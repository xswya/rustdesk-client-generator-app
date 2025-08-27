import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Config } from '@/types/config';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Package, Download, FileText, GitBranch } from 'lucide-react';

interface BuildSectionProps {
  form: UseFormReturn<Config>;
}

export const BuildSection: React.FC<BuildSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="step-indicator active">
          <Package className="h-4 w-4" />
        </div>
        <div>
          <h2 className="form-section-title">构建配置</h2>
          <p className="form-section-description">
            配置编译和分发参数
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                  可执行文件名 *
                </label>
                <Tooltip content="最终可执行文件的名称。&#10;请勿包含.exe扩展名&#10;&#10;示例：我的公司远程" />
            </div>
            <Input
              {...register('build.EXECUTABLE_NAME')}
              placeholder="mi-empresa-remote"
              error={errors.build?.EXECUTABLE_NAME?.message}
              helperText="无扩展名的名称（.exe会自动添加）"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                  客户端版本 *
                </label>
                <Tooltip content="自定义客户端版本。&#10;推荐格式：MAJOR.MINOR.PATCH&#10;&#10;示例：1.0.0, 2.1.3" />
            </div>
            <Input
              {...register('build.VERSION')}
              placeholder="1.0.0"
              error={errors.build?.VERSION?.message}
              helperText="格式：MAJOR.MINOR.PATCH"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-secondary-900">
                  构建描述
                </label>
                <Tooltip content="自定义构建描述。&#10;显示在可执行文件的属性中。&#10;&#10;示例：'为我的公司定制的RustDesk客户端'" />
          </div>
          <Input
            {...register('build.BUILD_DESCRIPTION')}
            placeholder="Cliente RustDesk personalizado para Mi Empresa"
            error={errors.build?.BUILD_DESCRIPTION?.message}
            helperText="显示在文件属性中的描述"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            仓库配置
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  RustDesk分支
                </label>
                <Tooltip content="用于构建的RustDesk仓库分支。&#10;&#10;常用选项：&#10;• master: 最新稳定版本&#10;• dev: 开发版本&#10;• v1.2.3: 特定标签" />
              </div>
              <select
                {...register('build.RUSTDESK_BRANCH')}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="master">master (estable)</option>
                <option value="dev">dev (desarrollo)</option>
                <option value="1.2.6">v1.2.6 (específica)</option>
                <option value="1.2.5">v1.2.5 (específica)</option>
                <option value="1.2.4">v1.2.4 (específica)</option>
              </select>
              {errors.build?.RUSTDESK_BRANCH && (
                <p className="mt-1 text-sm text-red-600">{errors.build.RUSTDESK_BRANCH.message}</p>
              )}
              <p className="mt-1 text-xs text-secondary-500">
                RustDesk仓库的分支或标签
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  构建架构
                </label>
                <Tooltip content="构建的处理器架构。&#10;&#10;• x86_64: 64位（推荐）&#10;• x86: 32位（传统）&#10;• aarch64: ARM 64位" />
              </div>
              <select
                {...register('build.TARGET_ARCH')}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="x86_64">x86_64 (64-bit)</option>
                <option value="x86">x86 (32-bit)</option>
                <option value="aarch64">aarch64 (ARM 64-bit)</option>
              </select>
              {errors.build?.TARGET_ARCH && (
                <p className="mt-1 text-sm text-red-600">{errors.build.TARGET_ARCH.message}</p>
              )}
              <p className="mt-1 text-xs text-secondary-500">
                目标处理器架构
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Download className="h-5 w-5" />
            构建选项
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('build.ENABLE_PORTABLE_MODE')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      便携模式
                    </span>
                    <Tooltip content="创建无需安装的便携可执行文件。&#10;配置保存在可执行文件同一目录中。" />
                </div>
                <p className="text-xs text-secondary-600">
                  无需安装，本地配置
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('build.INCLUDE_INSTALLER')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      包含安装程序
                    </span>
                    <Tooltip content="还为Windows生成MSI安装程序。&#10;便于在多台设备上分发和安装。" />
                </div>
                <p className="text-xs text-secondary-600">
                  额外生成MSI安装程序
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('build.ENABLE_DEBUG_MODE')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      调试模式
                    </span>
                    <Tooltip content="以附加信息编译调试模式。&#10;对开发和问题解决很有用。&#10;&#10;可执行文件将更大更慢。" />
                </div>
                <p className="text-xs text-secondary-600">
                  包含调试信息（更慢）
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
              <input
                {...register('build.SIGN_EXECUTABLE')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary-900">
                      签名可执行文件
                    </span>
                    <Tooltip content="数字签名可执行文件（需要证书）。&#10;提高信任度并避免安全警告。&#10;&#10;需要在GitHub Secrets中配置证书。" />
                </div>
                <p className="text-xs text-secondary-600">
                  需要代码证书（推荐）
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">构建信息</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 构建将在GitHub Actions中自动执行</li>
                <li>• 构建产物将在90天内可用</li>
                <li>• 将生成包含可执行文件和配置的ZIP文件</li>
                <li>• 典型构建时间为15-30分钟</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">重要注意事项</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 便携模式非常适合临时使用或测试</li>
                <li>• MSI安装程序需要管理员权限</li>
                <li>• 数字签名需要有效的证书</li>
                <li>• 调试模式会显著增加文件大小</li>
                <li>• 请确保可执行文件名称唯一且具有描述性</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};