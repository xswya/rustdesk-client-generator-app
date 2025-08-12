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
          <h2 className="form-section-title">Personalización y Branding</h2>
          <p className="form-section-description">
            Personaliza la apariencia y marca del cliente RustDesk
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Nombre de la Aplicación
              </label>
              <Tooltip content="Nombre personalizado que aparecerá en la ventana y título de la aplicación.&#10;&#10;Ejemplo: 'Mi Empresa Remote Desktop'" />
            </div>
            <Input
              {...register('branding.APP_NAME')}
              placeholder="Mi Empresa Remote Desktop"
              error={errors.branding?.APP_NAME?.message}
              helperText="Nombre que aparecerá en la barra de título"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Nombre de la Empresa
              </label>
              <Tooltip content="Nombre de la empresa u organización.&#10;Aparece en diálogos y información de la aplicación." />
            </div>
            <Input
              {...register('branding.COMPANY_NAME')}
              placeholder="Mi Empresa S.A."
              error={errors.branding?.COMPANY_NAME?.message}
              helperText="Nombre de la organización"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-secondary-900">
              URL del Sitio Web
            </label>
            <Tooltip content="URL del sitio web de la empresa.&#10;Se mostrará en la información de la aplicación.&#10;&#10;Ejemplo: https://www.miempresa.com" />
          </div>
          <Input
            {...register('branding.WEBSITE_URL')}
            placeholder="https://www.miempresa.com"
            error={errors.branding?.WEBSITE_URL?.message}
            helperText="URL completa del sitio web corporativo"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Recursos Gráficos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  URL del Logo
                </label>
                <Tooltip content="URL del logo de la empresa en formato PNG, JPG o SVG.&#10;Recomendado: 256x256px o superior.&#10;&#10;Ejemplo: https://miempresa.com/logo.png" />
              </div>
              <Input
                {...register('branding.LOGO_URL')}
                placeholder="https://miempresa.com/logo.png"
                error={errors.branding?.LOGO_URL?.message}
                helperText="URL del logo (PNG, JPG, SVG)"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  URL del Icono
                </label>
                <Tooltip content="URL del icono de la aplicación en formato ICO o PNG.&#10;Recomendado: 32x32px, 64x64px o 128x128px.&#10;&#10;Se usará como icono de la aplicación en el sistema." />
              </div>
              <Input
                {...register('branding.ICON_URL')}
                placeholder="https://miempresa.com/icon.ico"
                error={errors.branding?.ICON_URL?.message}
                helperText="URL del icono (ICO, PNG)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Type className="h-5 w-5" />
            Personalización de Texto
          </h3>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Texto de Bienvenida
              </label>
              <Tooltip content="Mensaje personalizado que aparece en la pantalla de bienvenida.&#10;&#10;Ejemplo: 'Bienvenido al sistema de escritorio remoto de Mi Empresa'" />
            </div>
            <textarea
              {...register('branding.WELCOME_TEXT')}
              placeholder="Bienvenido al sistema de escritorio remoto de Mi Empresa"
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            {errors.branding?.WELCOME_TEXT && (
              <p className="mt-1 text-sm text-red-600">{errors.branding.WELCOME_TEXT.message}</p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              Mensaje que aparece en la pantalla de inicio
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Información de Soporte
              </label>
              <Tooltip content="Información de contacto para soporte técnico.&#10;Puede incluir email, teléfono o instrucciones.&#10;&#10;Ejemplo: 'Para soporte contacte: soporte@miempresa.com'" />
            </div>
            <textarea
              {...register('branding.SUPPORT_INFO')}
              placeholder="Para soporte contacte: soporte@miempresa.com o llame al +1-234-567-8900"
              rows={2}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            {errors.branding?.SUPPORT_INFO && (
              <p className="mt-1 text-sm text-red-600">{errors.branding.SUPPORT_INFO.message}</p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              Información de contacto para usuarios
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Palette className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">Consejos de Branding</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Usa imágenes de alta calidad para mejor apariencia</li>
                <li>• El logo debe tener fondo transparente (PNG/SVG)</li>
                <li>• Mantén los textos concisos y profesionales</li>
                <li>• Asegúrate de que las URLs sean accesibles públicamente</li>
                <li>• Considera el contraste de colores para mejor legibilidad</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Recursos Recomendados</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Logo:</strong> 256x256px, PNG con transparencia</li>
                <li>• <strong>Icono:</strong> 32x32px, 64x64px, 128x128px en formato ICO</li>
                <li>• <strong>Hosting:</strong> CDN o servidor web confiable</li>
                <li>• <strong>Formatos:</strong> PNG, JPG, SVG para logos; ICO para iconos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};