import React from 'react';
import { Monitor, Settings } from 'lucide-react';
import packageInfo from '../../../package.json';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                RustDesk客户端生成器
              </h1>
              <p className="text-sm text-gray-500">
                生成自定义RustDesk客户端
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">v{packageInfo.version}</span>
          </div>
        </div>
      </div>
    </header>
  );
};