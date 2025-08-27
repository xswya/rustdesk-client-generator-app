import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Config } from '@/types/config';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Server, Key, Globe } from 'lucide-react';

interface ServerSectionProps {
  form: UseFormReturn<Config>;
}

export const ServerSection: React.FC<ServerSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="step-indicator active">
          <Server className="h-4 w-4" />
        </div>
        <div>
          <h2 className="form-section-title">服务器配置</h2>
          <p className="form-section-description">
            配置RustDesk服务器的硬编码连接
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                中继服务器 *
              </label>
              <Tooltip content="RustDesk服务器的FQDN，不包含协议和端口。&#10;例如: hbbs.mydomain.com&#10;&#10;此服务器处理客户端之间的初始连接。" />
            </div>
            <Input
              {...register('server.RENDEZVOUS_SERVER')}
              placeholder="hbbs.mydomain.com"
              error={errors.server?.RENDEZVOUS_SERVER?.message}
              helperText="完整域名，不包含协议(http/https)和端口"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                转发服务器 (可选)
              </label>
              <Tooltip content="用于流量转发的服务器FQDN。&#10;例如: hbbr.mydomain.com&#10;&#10;如果留空，将使用与RENDEZVOUS_SERVER相同的服务器。" />
            </div>
            <Input
              {...register('server.RELAY_SERVER')}
              placeholder="hbbr.mydomain.com"
              error={errors.server?.RELAY_SERVER?.message}
              helperText="可选 - 如果留空则使用中继服务器"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                公钥 *
              </label>
              <Tooltip content="服务器的Base64格式公钥。&#10;可在服务器的id_ed25519.pub文件中找到。&#10;&#10;例如: OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw=" />
            </div>
            <Input
              {...register('server.RS_PUB_KEY')}
              placeholder="OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw="
              error={errors.server?.RS_PUB_KEY?.message}
              helperText="id_ed25519.pub文件的Base64密钥"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                API服务器 (可选)
              </label>
              <Tooltip content="用于高级功能的API服务器URL。&#10;建议在Nginx等代理后使用HTTPS。&#10;&#10;例如: https://hbbs.mydomain.com" />
            </div>
            <Input
              {...register('server.API_SERVER')}
              placeholder="https://hbbs.mydomain.com"
              error={errors.server?.API_SERVER?.message}
              helperText="完整的服务器API URL，包含HTTPS"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">重要信息</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 如果定义了RENDEZVOUS_SERVER，也必须定义RS_PUB_KEY</li>
                <li>• 如果缺少任何必填字段，客户端将无法正常工作</li>
                <li>• 常用端口: 21114-21119 (TCP), 21116 (UDP)</li>
                <li>• Se recomienda usar HTTPS para el API_SERVER</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Obtener la Clave Pública</h4>
              <p className="text-sm text-yellow-800">
                En el servidor RustDesk, la clave pública se encuentra en el archivo 
                <code className="bg-yellow-100 px-1 rounded mx-1">id_ed25519.pub</code>
                ubicado en el directorio de configuración del servidor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};