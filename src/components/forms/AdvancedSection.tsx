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
          <h2 className="form-section-title">Opciones Avanzadas</h2>
          <p className="form-section-description">
            Configuraciones técnicas y de rendimiento del cliente
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Network className="h-5 w-5" />
            Configuración de Red
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  Puerto TCP Personalizado
                </label>
                <Tooltip content="Puerto TCP personalizado para conexiones directas.&#10;Rango válido: 1024-65535&#10;&#10;Puerto por defecto de RustDesk: 21118" />
              </div>
              <Input
                {...register('advanced.CUSTOM_TCP_PORT')}
                type="number"
                placeholder="21118"
                min="1024"
                max="65535"
                error={errors.advanced?.CUSTOM_TCP_PORT?.message}
                helperText="Puerto para conexiones TCP directas"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  Puerto UDP Personalizado
                </label>
                <Tooltip content="Puerto UDP personalizado para descubrimiento local.&#10;Rango válido: 1024-65535&#10;&#10;Puerto por defecto de RustDesk: 21116" />
              </div>
              <Input
                {...register('advanced.CUSTOM_UDP_PORT')}
                type="number"
                placeholder="21116"
                min="1024"
                max="65535"
                error={errors.advanced?.CUSTOM_UDP_PORT?.message}
                helperText="Puerto para descubrimiento UDP"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Servidores STUN Personalizados
              </label>
              <Tooltip content="Lista de servidores STUN separados por comas.&#10;Usado para NAT traversal en conexiones P2P.&#10;&#10;Ejemplo: stun.l.google.com:19302,stun1.l.google.com:19302" />
            </div>
            <Input
              {...register('advanced.CUSTOM_STUN_SERVERS')}
              placeholder="stun.l.google.com:19302,stun1.l.google.com:19302"
              error={errors.advanced?.CUSTOM_STUN_SERVERS?.message}
              helperText="Servidores STUN separados por comas"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Configuración de Pantalla
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  Calidad de Video por Defecto
                </label>
                <Tooltip content="Calidad de video inicial para conexiones.&#10;Valores: low, medium, high, best&#10;&#10;Mayor calidad requiere más ancho de banda." />
              </div>
              <select
                {...register('advanced.DEFAULT_VIDEO_QUALITY')}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seleccionar calidad...</option>
                <option value="low">Baja (más rápido)</option>
                <option value="medium">Media (balanceado)</option>
                <option value="high">Alta (mejor calidad)</option>
                <option value="best">Máxima (mejor calidad)</option>
              </select>
              {errors.advanced?.DEFAULT_VIDEO_QUALITY && (
                <p className="mt-1 text-sm text-red-600">{errors.advanced.DEFAULT_VIDEO_QUALITY.message}</p>
              )}
              <p className="mt-1 text-xs text-secondary-500">
                Calidad inicial de video para conexiones
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-secondary-900">
                  FPS Máximo
                </label>
                <Tooltip content="Frames por segundo máximo para transmisión de video.&#10;Rango: 5-60 FPS&#10;&#10;Más FPS requiere más ancho de banda." />
              </div>
              <Input
                {...register('advanced.MAX_FPS')}
                type="number"
                placeholder="30"
                min="5"
                max="60"
                error={errors.advanced?.MAX_FPS?.message}
                helperText="Frames por segundo máximo (5-60)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Configuración de Rendimiento
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
                    Habilitar Codec por Hardware
                  </span>
                  <Tooltip content="Usa aceleración por hardware para codificación de video.&#10;Mejora el rendimiento pero requiere GPU compatible." />
                </div>
                <p className="text-xs text-secondary-600">
                  Mejora el rendimiento con GPU compatible
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
                    Permitir Acceso Directo por IP
                  </span>
                  <Tooltip content="Permite conexiones directas usando direcciones IP.&#10;Útil para redes locales sin servidor de encuentro." />
                </div>
                <p className="text-xs text-secondary-600">
                  Conexiones directas por IP en red local
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
                    Deshabilitar Audio
                  </span>
                  <Tooltip content="Deshabilita la transmisión de audio por defecto.&#10;Reduce el uso de ancho de banda." />
                </div>
                <p className="text-xs text-secondary-600">
                  Reduce el uso de ancho de banda
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
                    Habilitar Transferencia de Archivos
                  </span>
                  <Tooltip content="Permite la transferencia de archivos entre cliente y servidor.&#10;Puede representar un riesgo de seguridad." />
                </div>
                <p className="text-xs text-secondary-600">
                  Permite intercambio de archivos
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
                    Deshabilitar Portapapeles
                  </span>
                  <Tooltip content="Deshabilita el intercambio de portapapeles entre cliente y servidor.&#10;Mejora la seguridad evitando transferencia accidental de datos." />
                </div>
                <p className="text-xs text-secondary-600">
                  Mejora la seguridad de datos
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Configuraciones Avanzadas</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Los puertos personalizados deben estar abiertos en el firewall</li>
                <li>• El codec por hardware requiere drivers actualizados</li>
                <li>• Mayor calidad de video requiere más ancho de banda</li>
                <li>• La transferencia de archivos puede ser un riesgo de seguridad</li>
                <li>• Prueba las configuraciones en un entorno controlado primero</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};