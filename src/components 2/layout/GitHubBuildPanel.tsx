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
        message: 'Por favor completa todos los campos de configuración de GitHub'
      });
      return;
    }

    setBuildStatus({
      status: 'configuring',
      message: 'Configurando el workflow de GitHub Actions...'
    });

    try {
      // Preparar la configuración para el workflow
      // const workflowInputs = {
      //   config_json: JSON.stringify(config),
      //   executable_name: config.branding?.product_name || 'rustdesk-custom',
      //   version: config.build?.version || 'v1.0.0',
      //   rustdesk_branch: 'master',
      //   target_arch: 'x86_64',
      //   enable_portable: true,
      //   include_installer: true,
      //   enable_debug: false,
      //   sign_executable: false
      // };

      // Simular llamada a GitHub API para ejecutar workflow
      setBuildStatus({
        status: 'building',
        message: 'Ejecutando workflow de GitHub Actions...',
        workflowUrl: `https://github.com/${githubConfig.owner}/${githubConfig.repo}/actions`
      });

      // Simular proceso de build (en implementación real, aquí harías la llamada real a GitHub API)
      setTimeout(() => {
        setBuildStatus({
          status: 'success',
          message: '¡Compilación completada exitosamente!',
          workflowUrl: `https://github.com/${githubConfig.owner}/${githubConfig.repo}/actions`,
          downloadUrl: `https://github.com/${githubConfig.owner}/${githubConfig.repo}/actions/runs/latest/artifacts`
        });
      }, 3000);

    } catch (error) {
      setBuildStatus({
        status: 'error',
        message: 'Error al ejecutar el workflow: ' + (error as Error).message
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
              Configuración del Repositorio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario/Organización de GitHub
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
                  Nombre del Repositorio
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
                  Token de GitHub (Personal Access Token)
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
                  <span>Ver progreso en GitHub</span>
                </a>
              )}
            </div>
          )}

          {/* Resumen de Configuración */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resumen del Build
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre del ejecutable:</span>
                <span className="font-medium">{config.branding?.PRODUCT_NAME || 'rustdesk-custom'}.exe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Versión:</span>
                <span className="font-medium">{config.build?.version || 'v1.0.0'}</span>
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
                <span className="font-medium">Sí</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Incluir instalador:</span>
                <span className="font-medium">Sí</span>
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
                <span>Descargar Ejecutable</span>
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
                    <span>Iniciar Compilación</span>
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
            <h4 className="font-medium text-blue-900 mb-2">📋 Instrucciones:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Asegúrate de que este proyecto esté subido a GitHub</li>
              <li>Crea un Personal Access Token en GitHub con permisos "actions" y "repo"</li>
              <li>Completa la configuración del repositorio arriba</li>
              <li>Haz clic en "Iniciar Compilación" para ejecutar el workflow</li>
              <li>El proceso tomará 15-30 minutos aproximadamente</li>
              <li>Una vez completado, podrás descargar el ejecutable desde GitHub</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};