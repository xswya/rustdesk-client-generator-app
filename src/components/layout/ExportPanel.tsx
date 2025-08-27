import React, { useState } from 'react';
import { Download, FileText, Settings, X, CheckCircle, Github } from 'lucide-react';
import { Button } from '../ui/Button';
import { Config } from '../../types/config';
import { exportUtils } from '../../utils/export';
import { GitHubBuildPanel } from './GitHubBuildPanel';

interface ExportPanelProps {
  config: Config;
  onClose: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ config, onClose }) => {
  const [showGitHubPanel, setShowGitHubPanel] = useState(false);
  const handleExportConfig = () => {
    exportUtils.downloadConfigJson(config);
  };

  const handleExportEnv = () => {
    exportUtils.downloadEnvFile(config);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              配置已完成！
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    配置准备就绪
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    您的RustDesk配置已成功完成。
                    现在您可以下载编译自定义客户端所需的文件。
                  </p>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                编译选项
              </h3>
              
              {/* Compilación Automática */}
              <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center space-x-3 mb-3">
                  <Github className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">自动编译</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">推荐</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  使用GitHub Actions自动编译您的RustDesk客户端。
                  您只需要GitHub仓库和访问令牌。
                </p>
                <Button
                  onClick={() => setShowGitHubPanel(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Github className="w-4 h-4" />
                  <span>自动编译</span>
                </Button>
              </div>

              <h4 className="text-md font-medium text-gray-900 mb-3">
                或下载文件进行手动编译：
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">config.json</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    包含客户端所有参数的主配置文件。
                  </p>
                  <Button
                    onClick={handleExportConfig}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>下载 config.json</span>
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Settings className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">.env.example</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    用于编译脚本的环境变量。
                  </p>
                  <Button
                    onClick={handleExportEnv}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>下载 .env.example</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
              后续步骤
            </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>下载文件 <code className="bg-blue-100 px-1 rounded">config.json</code></li>
                  <li>将其放在RustDesk项目的根目录</li>
                  <li>运行与您的系统对应的编译脚本：</li>
                </ol>
                <div className="mt-3 bg-blue-100 rounded p-3">
                  <code className="text-xs text-blue-900 block">
                    # Linux<br/>
                    ./scripts/build-linux.sh<br/><br/>
                    # macOS<br/>
                    ./scripts/build-macos.sh<br/><br/>
                    # Windows (PowerShell)<br/>
                    .\scripts\apply-config.ps1
                  </code>
                </div>
              </div>
            </div>

            {/* Configuration Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
              配置摘要
            </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Servidor:</span>
                    <span className="ml-2 font-mono text-xs text-gray-600">
                      {config.server?.RENDEZVOUS_SERVER || 'No configurado'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Producto:</span>
                    <span className="ml-2 text-gray-600">
                      {config.branding?.PRODUCT_NAME || 'RustDesk'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Versión:</span>
                    <span className="ml-2 text-gray-600">
                      {config.build?.VERSION || '1.0.0'}
                    </span>
                  </div>
                  <div>
                     <span className="font-medium text-gray-700">Plataforma:</span>
                     <span className="ml-2 text-gray-600">
                       {config.build?.platform || 'windows-x64'}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
          >
            关闭
          </Button>
          <Button
            onClick={handleExportConfig}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>下载 config.json</span>
          </Button>
        </div>
      </div>
      
      {/* GitHub Build Panel */}
      {showGitHubPanel && (
        <GitHubBuildPanel
          config={config}
          onClose={() => setShowGitHubPanel(false)}
        />
      )}
    </div>
  );
};