import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Config } from '@/types/config';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Palette, Image, Type, Globe } from 'lucide-react';

interface BrandingSectionProps {
  form: UseFormReturn<Config>;
}

export const BrandingSection: React.FC<BrandingSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="step-indicator active">
          <Palette className="h-4 w-4" />
        </div>
        <div>
          <h2 className="form-section-title">个性化和品牌定制</h2>
          <p className="form-section-description">
            自定义RustDesk客户端的外观和品牌
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                应用程序名称
              </label>
              <Tooltip content="将显示在应用程序窗口和标题中的自定义名称。&#10;&#10;例如: '我的企业远程桌面'" />
            </div>
            <Input
              {...register('branding.APP_NAME')}
              placeholder="我的企业远程桌面"
              error={errors.branding?.APP_NAME?.message}
              helperText="将显示在标题栏中的名称"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                企业名称
              </label>
              <Tooltip content="企业或组织的名称。&#10;显示在对话框和应用程序信息中。" />
            </div>
            <Input
              {...register('branding.COMPANY_NAME')}
              placeholder="我的企业有限公司"
              error={errors.branding?.COMPANY_NAME?.message}
              helperText="组织名称"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-secondary-900">
                网站URL
              </label>
              <Tooltip content="企业网站的URL。&#10;将显示在应用程序信息中。&#10;&#10;例如: https://www.mycompany.com" />
          </div>
          <Input
            {...register('branding.WEBSITE_URL')}
            placeholder="https://www.mycompany.com"
            error={errors.branding?.WEBSITE_URL?.message}
            helperText="完整的企业网站URL"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Image className="h-5 w-5" />
            图形资源
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  Logo URL
                </label>
                <Tooltip content="企业logo的URL，支持PNG、JPG或SVG格式。&#10;建议：256x256px或更高。&#10;&#10;例如：https://mycompany.com/logo.png" />
              </div>
              <Input
                {...register('branding.LOGO_URL')}
                placeholder="https://mycompany.com/logo.png"
                error={errors.branding?.LOGO_URL?.message}
                helperText="logo的URL (PNG, JPG, SVG)"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                图标URL
              </label>
              <Tooltip content="应用程序图标的URL，支持ICO或PNG格式。&#10;建议：32x32px、64x64px或128x128px。&#10;&#10;将用作系统中的应用程序图标。" />
              </div>
              <Input
                {...register('branding.ICON_URL')}
                placeholder="https://mycompany.com/icon.ico"
                error={errors.branding?.ICON_URL?.message}
                helperText="图标的URL (ICO, PNG格式)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Type className="h-5 w-5" />
            自定义文本
          </h3>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                欢迎文本
              </label>
              <Tooltip content="显示在欢迎屏幕上的自定义消息。&#10;&#10;例如: '欢迎使用我的企业远程桌面系统'" />
            </div>
            <textarea
              {...register('branding.WELCOME_TEXT')}
              placeholder="欢迎使用我的企业远程桌面系统"
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            {errors.branding?.WELCOME_TEXT && (
              <p className="mt-1 text-sm text-red-600">{errors.branding.WELCOME_TEXT.message}</p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              显示在启动屏幕上的消息
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                支持信息
              </label>
              <Tooltip content="技术支持的联系信息。&#10;可包括电子邮件、电话或说明。&#10;&#10;例如: '如需支持，请联系: support@mycompany.com'" />
            </div>
            <textarea
              {...register('branding.SUPPORT_INFO')}
              placeholder="如需支持，请联系: support@mycompany.com 或致电 +1-234-567-8900"
              rows={2}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            {errors.branding?.SUPPORT_INFO && (
              <p className="mt-1 text-sm text-red-600">{errors.branding.SUPPORT_INFO.message}</p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              为用户提供的联系信息
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Palette className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">品牌建议</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• 使用高质量图像以获得更好的外观</li>
                <li>• Logo应有透明背景（PNG/SVG）</li>
                <li>• 保持文本简洁专业</li>
                <li>• 确保URL可公开访问</li>
                <li>• 考虑颜色对比度以提高可读性</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">推荐资源</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Logo：</strong> 256x256px，带透明背景的PNG</li>
                <li>• <strong>图标：</strong> 32x32px、64x64px、128x128px的ICO格式</li>
                <li>• <strong>托管：</strong> CDN或可靠的Web服务器</li>
                <li>• <strong>格式：</strong> Logo使用PNG、JPG、SVG；图标使用ICO</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};