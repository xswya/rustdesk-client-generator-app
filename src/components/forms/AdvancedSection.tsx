import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Config } from '@/types/config';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Settings, Network, Monitor, Cpu } from 'lucide-react';

interface AdvancedSectionProps {
  form: UseFormReturn<Config>;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="step-indicator active">
          <Settings className="h-4 w-4" />
        </div>
        <div>
          <h2 className="form-section-title">高级选项</h2>
          <p className="form-section-description">
            客户端的技术和性能配置
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Network className="h-5 w-5" />
            网络配置
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  自定义TCP端口
                </label>
                <Tooltip content="用于直接连接的自定义TCP端口。&#10;有效范围：1024-65535&#10;&#10;RustDesk默认端口：21118" />
              </div>
              <Input
                {...register('advanced.CUSTOM_TCP_PORT')}
                type="number"
                placeholder="21118"
                min="1024"
                max="65535"
                error={errors.advanced?.CUSTOM_TCP_PORT?.message}
                helperText="用于直接TCP连接的端口"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  自定义UDP端口
                </label>
                <Tooltip content="用于本地发现的自定义UDP端口。&#10;有效范围：1024-65535&#10;&#10;RustDesk默认端口：21116" />
              </div>
              <Input
                {...register('advanced.CUSTOM_UDP_PORT')}
                type="number"
                placeholder="21116"
                min="1024"
                max="65535"
                error={errors.advanced?.CUSTOM_UDP_PORT?.message}
                helperText="用于UDP发现的端口"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                  自定义STUN服务器
                </label>
                <Tooltip content="用逗号分隔的STUN服务器列表。&#10;用于P2P连接中的NAT穿透。&#10;&#10;示例：stun.l.google.com:19302,stun1.l.google.com:19302" />
            </div>
            <Input
              {...register('advanced.CUSTOM_STUN_SERVERS')}
              placeholder="stun.l.google.com:19302,stun1.l.google.com:19302"
              error={errors.advanced?.CUSTOM_STUN_SERVERS?.message}
              helperText="用逗号分隔的STUN服务器"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            显示配置
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  默认视频质量
                </label>
                <Tooltip content="连接的初始视频质量。&#10;值：low, medium, high, best&#10;&#10;更高质量需要更多带宽。" />
              </div>
              <select
                {...register('advanced.DEFAULT_VIDEO_QUALITY')}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">选择质量...</option>
                <option value="low">低（更快）</option>
                <option value="medium">中（平衡）</option>
                <option value="high">高（更好质量）</option>
                <option value="best">最高（最佳质量）</option>
              </select>
              {errors.advanced?.DEFAULT_VIDEO_QUALITY && (
                <p className="mt-1 text-sm text-red-600">{errors.advanced.DEFAULT_VIDEO_QUALITY.message}</p>
              )}
              <p className="mt-1 text-xs text-secondary-500">
                  连接的初始视频质量
                </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  最大FPS
                </label>
                <Tooltip content="视频传输的最大每秒帧数。&#10;范围：5-60 FPS&#10;&#10;更高FPS需要更多带宽。" />
              </div>
              <Input
                {...register('advanced.MAX_FPS')}
                type="number"
                placeholder="30"
                min="5"
                max="60"
                error={errors.advanced?.MAX_FPS?.message}
                helperText="最大每秒帧数（5-60）"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            性能配置
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('advanced.ENABLE_HARDWARE_CODEC')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      启用硬件编解码器
                    </span>
                    <Tooltip content="使用硬件加速进行视频编码。&#10;提高性能但需要兼容的GPU。" />
                </div>
                <p className="text-xs text-secondary-600">
                  使用兼容GPU提高性能
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('advanced.ENABLE_DIRECT_IP_ACCESS')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      允许IP直接访问
                    </span>
                    <Tooltip content="允许使用IP地址直接连接。&#10;适用于没有中继服务器的局域网。" />
                </div>
                <p className="text-xs text-secondary-600">
                  局域网内通过IP直接连接
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('advanced.DISABLE_AUDIO')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      禁用音频
                    </span>
                    <Tooltip content="默认禁用音频传输。&#10;减少带宽使用。" />
                </div>
                <p className="text-xs text-secondary-600">
                  减少带宽使用
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('advanced.ENABLE_FILE_TRANSFER')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      启用文件传输
                    </span>
                    <Tooltip content="允许在客户端和服务器之间传输文件。&#10;可能存在安全风险。" />
                </div>
                <p className="text-xs text-secondary-600">
                  允许文件交换
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('advanced.DISABLE_CLIPBOARD')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      禁用剪贴板
                    </span>
                    <Tooltip content="禁用客户端和服务器之间的剪贴板交换。&#10;通过防止意外数据传输提高安全性。" />
                </div>
                <p className="text-xs text-secondary-600">
                  提高数据安全性
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">高级配置</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• 自定义端口必须在防火墙中开放</li>
                <li>• 硬件编解码器需要更新的驱动程序</li>
                <li>• 更高的视频质量需要更多带宽</li>
                <li>• 文件传输可能存在安全风险</li>
                <li>• 请先在受控环境中测试配置</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};