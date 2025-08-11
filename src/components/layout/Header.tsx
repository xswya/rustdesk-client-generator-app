import React from 'react';
import { Monitor, Settings } from 'lucide-react';

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
                RustDesk Client Generator
              </h1>
              <p className="text-sm text-gray-500">
                Genera clientes personalizados de RustDesk
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">v1.0.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};