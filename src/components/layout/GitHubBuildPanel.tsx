import React, { useState } from 'react';
import { Download, Github, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Config } from '../../types/config';

interface GitHubBuildPanelProps {
  config: Config;
  onClose: () => void;
}

interface BuildStatus {
  status: 'idle' | 'configuring' | 'building' | 'success' | 'error';
  message: string;
  workflowUrl?: string;
  downloadUrl?: string;
}

export const GitHubBuildPanel: React.FC<GitHubBuildPanelProps> = ({ config, onClose }) => {
  const [buildStatus, setBuildStatus] = useState<BuildStatus>({
    status: 'idle',
    message: ''
  });
  const [githubConfig, setGithubConfig] = useState({
    owner: '',
    repo: '',
    token: ''
  });

  const handleStartBuild = async () => {
    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.token) {
      setBuildStatus({
        status: 'error',
        message: '请完成所有GitHub配置字段'
      });
      return;
    }

    setBuildStatus({
      status: 'configuring',
      message: '验证GitHub仓库...'
    });

    try {
      // Validar que el repositorio existe
      const repoUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}`;
      const response = await fetch(repoUrl, {
        headers: {
          'Authorization': `token ${githubConfig.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setBuildStatus({
            status: 'error',
            message: `仓库 ${githubConfig.owner}/${githubConfig.repo} 不存在或你没有访问权限`
          });
        } else if (response.status === 401) {
          setBuildStatus({
            status: 'error',
            message: 'GitHub令牌无效或权限不足'
          });
        } else {
          setBuildStatus({
            status: 'error',
            message: `访问仓库时出错: ${response.status} ${response.statusText}`
          });
        }
        return;
      }

      // Ejecutar el workflow de GitHub Actions
      setBuildStatus({
        status: 'building',
        message: '启动GitHub Actions工作流...'
      });

      // Crear el objeto config completo incluyendo la sección build
      console.log('=== DEBUG: Config original ===');
      console.log(config);
      console.log('=== DEBUG: Config.build ===');
      console.log(config.build);
      
      // Usar el config completo con todas las secciones
      const fullConfig = {
        server: config.server,
        security: config.security,
        branding: config.branding,
        advanced: config.advanced,
        build: config.build
      };
      
      console.log('=== DEBUG: Config completo ===');
      console.log(fullConfig);
      
      const configJson = JSON.stringify(fullConfig);
      console.log('=== DEBUG: Config JSON (length:', configJson.length, ') ===');
      console.log(configJson);
      
      // Verificar que contiene la sección build
      if (configJson.includes('"build"')) {
        console.log('✅ Confirmado: El JSON contiene la sección build correctamente');
      } else {
        console.error('ERROR: El JSON NO contiene la sección build!');
      }
      
      // Usar solo los inputs básicos que funcionaban antes
      const workflowInputs = {
        config_json: configJson,
        executable_name: String(config.build?.EXECUTABLE_NAME || config.branding?.APP_NAME || 'rustdesk-custom'),
        rustdesk_branch: String(config.build?.RUSTDESK_BRANCH || 'master'),
        target_arch: String(config.build?.TARGET_ARCH || 'x86_64'),
        enable_portable: Boolean(config.build?.ENABLE_PORTABLE_MODE),
        create_installer: Boolean(config.build?.INCLUDE_INSTALLER !== false),
        enable_debug: Boolean(config.build?.ENABLE_DEBUG_MODE)
      };

      // Validate required inputs
      if (!workflowInputs.config_json || workflowInputs.config_json === '{}') {
        setBuildStatus({
            status: 'error',
            message: '错误: 配置为空。至少完成服务器配置。'
          });
        return;
      }

      if (!workflowInputs.executable_name || workflowInputs.executable_name.length < 3) {
        setBuildStatus({
            status: 'error',
            message: '错误: 需指定可执行文件名（至少3个字符）。'
          });
        return;
      }

      console.log('=== GitHub Workflow Execution Debug ===');
      console.log('Owner:', githubConfig.owner);
      console.log('Repo:', githubConfig.repo);
      console.log('Workflow inputs:', workflowInputs);
      console.log('=== Workflow Input Details ===');
      console.log('executable_name:', workflowInputs.executable_name);
      console.log('enable_portable:', workflowInputs.enable_portable);
      console.log('create_installer:', workflowInputs.create_installer);
      console.log('config.build.EXECUTABLE_NAME:', config.build?.EXECUTABLE_NAME);
      console.log('config.build.ENABLE_PORTABLE_MODE:', config.build?.ENABLE_PORTABLE_MODE);
      console.log('config.build.INCLUDE_INSTALLER:', config.build?.INCLUDE_INSTALLER);

      // Primero verificar si el workflow existe
      const workflowInfoUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/actions/workflows/build-rustdesk-final.yml`;
      console.log('Checking workflow exists at:', workflowInfoUrl);
      
      try {
        const workflowInfoResponse = await fetch(workflowInfoUrl, {
          headers: {
            'Authorization': `token ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (workflowInfoResponse.ok) {
          const workflowInfo = await workflowInfoResponse.json();
          console.log('Workflow found:', workflowInfo.name, 'State:', workflowInfo.state);
          console.log('Workflow triggers:', workflowInfo);
        } else {
          const errorText = await workflowInfoResponse.text();
          console.error('Workflow not found or accessible:', workflowInfoResponse.status, errorText);
          setBuildStatus({
            status: 'error',
            message: `找不到工作流 (${workflowInfoResponse.status}): ${errorText}`
          });
          return;
        }
      } catch (error) {
        console.error('Error checking workflow:', error);
      }

      // Ejecutar el workflow
      const workflowUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/actions/workflows/build-rustdesk-final.yml/dispatches`;
      console.log('Workflow URL:', workflowUrl);
      
      console.log('=== Final payload being sent ===');
      const requestPayload = {
        ref: 'main',
        inputs: workflowInputs
      };
      console.log(JSON.stringify(requestPayload, null, 2));
      
      const workflowResponse = await fetch(workflowUrl, {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubConfig.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      if (!workflowResponse.ok) {
        const errorText = await workflowResponse.text();
        console.error('=== Workflow Error Details ===');
        console.error('Status:', workflowResponse.status);
        console.error('Status Text:', workflowResponse.statusText);
        console.error('Error Response:', errorText);
        console.error('Request URL:', workflowUrl);
        console.error('Request Headers:', {
          'Authorization': 'token [REDACTED]',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        });
        console.error('Request Body:', JSON.stringify({
          ref: 'main',
          inputs: workflowInputs
        }, null, 2));
        
        // Parse error response if it's JSON
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
            console.error('GitHub API Error:', errorJson);
            
            // Specific error messages for common issues
            if (errorMessage.includes('Repository access blocked')) {
              errorMessage = '令牌没有执行工作流的权限。请检查令牌的作用域。';
            } else if (errorMessage.includes('Bad credentials')) {
              errorMessage = 'GitHub令牌无效。请检查配置中的令牌。';
            } else if (errorMessage.includes('Not Found')) {
              errorMessage = '找不到工作流。请确认工作流文件存在于仓库中。';
            } else if (errorMessage.includes('workflow_dispatch')) {
              errorMessage = '工作流未配置为手动触发。请检查触发器设置。';
            }
          }
        } catch (e) {
          // Error response is not JSON, use as-is
        }
        
        setBuildStatus({
          status: 'error',
          message: `执行工作流时出错 (${workflowResponse.status}): ${errorMessage}`
        });
        return;
      }

      // Workflow iniciado exitosamente
      setBuildStatus({
        status: 'building',
        message: '工作流已成功启动。正在编译RustDesk客户端...',
        workflowUrl: `https://github.com/${githubConfig.owner}/${githubConfig.repo}/actions/workflows/build-rustdesk-final.yml`
      });

      // Monitorear el progreso del workflow
      const monitorWorkflow = async () => {
        try {
          // Obtener las ejecuciones del workflow
          const runsResponse = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/actions/workflows/build-rustdesk-final.yml/runs?per_page=1`, {
            headers: {
              'Authorization': `token ${githubConfig.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });

          if (runsResponse.ok) {
            const runsData = await runsResponse.json();
            if (runsData.workflow_runs && runsData.workflow_runs.length > 0) {
              const latestRun = runsData.workflow_runs[0];
              
              if (latestRun.status === 'completed') {
                if (latestRun.conclusion === 'success') {
                  setBuildStatus({
                    status: 'success',
                    message: '编译已成功完成！',
                    workflowUrl: latestRun.html_url,
                    downloadUrl: `https://github.com/${githubConfig.owner}/${githubConfig.repo}/actions/runs/${latestRun.id}/artifacts`
                  });
                } else {
                  setBuildStatus({
                    status: 'error',
                    message: `编译失败: ${latestRun.conclusion}`,
                    workflowUrl: latestRun.html_url
                  });
                }
              } else if (latestRun.status === 'in_progress') {
                setBuildStatus({
                  status: 'building',
                  message: '编译进行中...',
                  workflowUrl: latestRun.html_url
                });
                // Continuar monitoreando
                setTimeout(monitorWorkflow, 30000); // Verificar cada 30 segundos
              }
            }
          }
        } catch (error) {
          console.error('Error monitoring workflow:', error);
        }
      };

      // Iniciar monitoreo después de 10 segundos
      setTimeout(monitorWorkflow, 10000);

    } catch (error) {
      setBuildStatus({
          status: 'error',
          message: '连接错误: ' + (error as Error).message
        });
    }
  };

  const getStatusIcon = () => {
    switch (buildStatus.status) {
      case 'configuring':
      case 'building':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Github className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (buildStatus.status) {
      case 'configuring':
      case 'building':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Github className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Compilar con GitHub Actions
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Configuración de GitHub */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              仓库配置
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub用户名/组织
                </label>
                <input
                  type="text"
                  value={githubConfig.owner}
                  onChange={(e) => setGithubConfig(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="tu-usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  仓库名称
                </label>
                <input
                  type="text"
                  value={githubConfig.repo}
                  onChange={(e) => setGithubConfig(prev => ({ ...prev, repo: e.target.value }))}
                  placeholder="rustdesk-client-generator"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub令牌 (个人访问令牌)
                </label>
                <input
                  type="password"
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig(prev => ({ ...prev, token: e.target.value }))}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Necesitas un token con permisos de "actions" y "repo"
                </p>
              </div>
            </div>
          </div>

          {/* Estado del Build */}
          {buildStatus.status !== 'idle' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon()}
                <span className={`font-medium ${getStatusColor()}`}>
                  {buildStatus.message}
                </span>
              </div>
              
              {buildStatus.workflowUrl && (
                <a
                  href={buildStatus.workflowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>在GitHub上查看进度</span>
                </a>
              )}
            </div>
          )}

          {/* Resumen de Configuración */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              构建摘要
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre del ejecutable:</span>
                <span className="font-medium">{config.branding?.PRODUCT_NAME || 'rustdesk-custom'}.exe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Versión:</span>
                <span className="font-medium">{config.build?.VERSION || 'v1.0.0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Servidor:</span>
                <span className="font-medium">{config.server?.RENDEZVOUS_SERVER || 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arquitectura:</span>
                <span className="font-medium">x86_64 (Windows)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modo portable:</span>
                <span className="font-medium">是</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-600">包含安装器:</span>
                  <span className="font-medium">是</span>
                </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex space-x-3">
            {buildStatus.status === 'success' && buildStatus.downloadUrl ? (
              <a
                href={buildStatus.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>下载可执行文件</span>
              </a>
            ) : (
              <button
                onClick={handleStartBuild}
                disabled={buildStatus.status === 'configuring' || buildStatus.status === 'building'}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {buildStatus.status === 'configuring' || buildStatus.status === 'building' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Compilando...</span>
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4" />
                    <span>开始编译</span>
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>

          {/* Instrucciones */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📋 说明：</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>确保此项目已上传到GitHub</li>
              <li>在GitHub上创建一个具有"actions"和"repo"权限的个人访问令牌</li>
              <li>完成上方的仓库配置</li>
              <li>点击"开始编译"执行工作流</li>
              <li>该过程大约需要15-30分钟</li>
              <li>完成后，你可以从GitHub下载可执行文件</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p className="text-xs text-blue-700">
                <strong>注意：</strong> 工作流将自动编译具有你自定义配置的RustDesk客户端。
                将同时生成便携式可执行文件和安装程序。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};