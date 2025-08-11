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
          <h2 className="form-section-title">Configuración de Build</h2>
          <p className="form-section-description">
            Configura los parámetros de compilación y distribución
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Nombre del Ejecutable *
              </label>
              <Tooltip content="Nombre del archivo ejecutable final.&#10;No incluir la extensión .exe&#10;&#10;Ejemplo: mi-empresa-remote" />
            </div>
            <Input
              {...register('build.EXECUTABLE_NAME')}
              placeholder="mi-empresa-remote"
              error={errors.build?.EXECUTABLE_NAME?.message}
              helperText="Nombre sin extensión (.exe se añade automáticamente)"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Versión del Cliente *
              </label>
              <Tooltip content="Versión del cliente personalizado.&#10;Formato recomendado: MAJOR.MINOR.PATCH&#10;&#10;Ejemplo: 1.0.0, 2.1.3" />
            </div>
            <Input
              {...register('build.VERSION')}
              placeholder="1.0.0"
              error={errors.build?.VERSION?.message}
              helperText="Formato: MAJOR.MINOR.PATCH"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-secondary-900">
              Descripción del Build
            </label>
            <Tooltip content="Descripción del build personalizado.&#10;Aparece en las propiedades del archivo ejecutable.&#10;&#10;Ejemplo: 'Cliente RustDesk personalizado para Mi Empresa'" />
          </div>
          <Input
            {...register('build.BUILD_DESCRIPTION')}
            placeholder="Cliente RustDesk personalizado para Mi Empresa"
            error={errors.build?.BUILD_DESCRIPTION?.message}
            helperText="Descripción que aparece en las propiedades del archivo"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Configuración de Repositorio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  Rama de RustDesk
                </label>
                <Tooltip content="Rama del repositorio RustDesk a usar para el build.&#10;&#10;Opciones comunes:&#10;• master: Última versión estable&#10;• dev: Versión en desarrollo&#10;• v1.2.3: Tag específico" />
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
                Rama o tag del repositorio RustDesk
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  Arquitectura de Build
                </label>
                <Tooltip content="Arquitectura del procesador para el build.&#10;&#10;• x86_64: 64-bit (recomendado)&#10;• x86: 32-bit (legacy)&#10;• aarch64: ARM 64-bit" />
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
                Arquitectura del procesador objetivo
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Opciones de Build
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
                    Modo Portable
                  </span>
                  <Tooltip content="Crea un ejecutable portable que no requiere instalación.&#10;Guarda la configuración en el mismo directorio del ejecutable." />
                </div>
                <p className="text-xs text-secondary-600">
                  No requiere instalación, configuración local
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
                    Incluir Instalador
                  </span>
                  <Tooltip content="Genera también un instalador MSI para Windows.&#10;Facilita la distribución e instalación en múltiples equipos." />
                </div>
                <p className="text-xs text-secondary-600">
                  Genera instalador MSI adicional
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
                    Modo Debug
                  </span>
                  <Tooltip content="Compila en modo debug con información adicional.&#10;Útil para desarrollo y resolución de problemas.&#10;&#10;El ejecutable será más grande y lento." />
                </div>
                <p className="text-xs text-secondary-600">
                  Incluye información de debug (más lento)
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
                    Firmar Ejecutable
                  </span>
                  <Tooltip content="Firma digitalmente el ejecutable (requiere certificado).&#10;Mejora la confianza y evita advertencias de seguridad.&#10;&#10;Requiere configurar certificado en GitHub Secrets." />
                </div>
                <p className="text-xs text-secondary-600">
                  Requiere certificado de código (recomendado)
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Información del Build</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• El build se ejecutará automáticamente en GitHub Actions</li>
                <li>• Los artefactos estarán disponibles por 90 días</li>
                <li>• Se generará un archivo ZIP con el ejecutable y configuración</li>
                <li>• El tiempo de build típico es de 15-30 minutos</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Consideraciones Importantes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• El modo portable es ideal para uso temporal o testing</li>
                <li>• El instalador MSI requiere permisos de administrador</li>
                <li>• La firma digital requiere un certificado válido</li>
                <li>• El modo debug aumenta significativamente el tamaño del archivo</li>
                <li>• Verifica que el nombre del ejecutable sea único y descriptivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};