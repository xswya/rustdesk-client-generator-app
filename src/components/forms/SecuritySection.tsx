import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Config } from '@/types/config';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

interface SecuritySectionProps {
  form: UseFormReturn<Config>;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="step-indicator active">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <h2 className="form-section-title">安全配置</h2>
          <p className="form-section-description">
            配置客户端的安全和访问选项
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                固定密码 (可选)
              </label>
              <Tooltip content="连接的预定义密码。&#10;如果设置，客户端将自动使用此密码。&#10;&#10;适用于需要统一密码的大规模部署。" />
            </div>
            <div className="relative">
              <Input
                {...register('security.PRESET_PASSWORD')}
                type={showPassword ? 'text' : 'password'}
                placeholder="预定义密码"
                error={errors.security?.PRESET_PASSWORD?.message}
                helperText="将自动应用的密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                访问密钥 (可选)
              </label>
              <Tooltip content="永久连接访问密钥。&#10;允许无需临时密码进行连接。&#10;&#10;格式：至少6个字符的字母数字字符串。" />
            </div>
            <Input
              {...register('security.ACCESS_KEY')}
              placeholder="永久访问密钥"
              error={errors.security?.ACCESS_KEY?.message}
              helperText="字母数字密钥，用于直接访问"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            安全选项
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('security.PRESET_REMOVE_WALLPAPER')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      移除桌面背景
                    </span>
                    <Tooltip content="在远程连接期间自动移除桌面背景。&#10;在慢速连接中提高性能。" />
                </div>
                <p className="text-xs text-secondary-600">
                  在慢速连接中提高性能
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('security.PRESET_BLOCK_INPUT')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                    锁定本地输入
                  </span>
                  <Tooltip content="在远程连接期间锁定本地键盘和鼠标。&#10;防止本地用户干扰。" />
                </div>
                <p className="text-xs text-secondary-600">
                  防止远程控制期间的干扰
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('security.PRESET_PRIVACY_MODE')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                    隐私模式
                  </span>
                  <Tooltip content="在远程连接期间隐藏本地屏幕。&#10;只有远程用户可以看到屏幕。" />
                </div>
                <p className="text-xs text-secondary-600">
                  隐藏本地用户的屏幕
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('security.PRESET_RECORD_SESSION')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                    录制会话
                  </span>
                  <Tooltip content="自动录制所有远程会话。&#10;适用于审计和合规性。" />
                </div>
                <p className="text-xs text-secondary-600">
                  自动录制连接
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Recomendaciones de Seguridad</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Usa contraseñas fuertes si estableces PRESET_PASSWORD</li>
                <li>• La clave de acceso debe tener al menos 6 caracteres alfanuméricos</li>
                <li>• Considera habilitar el modo privacidad para mayor seguridad</li>
                <li>• La grabación de sesiones puede requerir espacio de almacenamiento adicional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};