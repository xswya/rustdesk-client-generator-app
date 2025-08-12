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
          <h2 className="form-section-title">Configuración de Seguridad</h2>
          <p className="form-section-description">
            Configura las opciones de seguridad y acceso del cliente
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Contraseña Fija (Opcional)
              </label>
              <Tooltip content="Contraseña predefinida para conexiones.&#10;Si se establece, el cliente usará esta contraseña automáticamente.&#10;&#10;Útil para despliegues masivos donde se quiere una contraseña común." />
            </div>
            <div className="relative">
              <Input
                {...register('security.PRESET_PASSWORD')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña predefinida"
                error={errors.security?.PRESET_PASSWORD?.message}
                helperText="Contraseña que se aplicará automáticamente"
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
                Clave de Acceso (Opcional)
              </label>
              <Tooltip content="Clave de acceso permanente para conexiones.&#10;Permite conexiones sin contraseña temporal.&#10;&#10;Formato: cadena alfanumérica de al menos 6 caracteres." />
            </div>
            <Input
              {...register('security.ACCESS_KEY')}
              placeholder="Clave de acceso permanente"
              error={errors.security?.ACCESS_KEY?.message}
              helperText="Clave alfanumérica para acceso directo"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Opciones de Seguridad
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
                    Remover Fondo de Pantalla
                  </span>
                  <Tooltip content="Remueve automáticamente el fondo de pantalla durante conexiones remotas.&#10;Mejora el rendimiento en conexiones lentas." />
                </div>
                <p className="text-xs text-secondary-600">
                  Mejora el rendimiento en conexiones lentas
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
                    Bloquear Entrada Local
                  </span>
                  <Tooltip content="Bloquea el teclado y mouse local durante conexiones remotas.&#10;Previene interferencias del usuario local." />
                </div>
                <p className="text-xs text-secondary-600">
                  Previene interferencias durante control remoto
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
                    Modo Privacidad
                  </span>
                  <Tooltip content="Oculta la pantalla local durante conexiones remotas.&#10;Solo el usuario remoto puede ver la pantalla." />
                </div>
                <p className="text-xs text-secondary-600">
                  Oculta la pantalla del usuario local
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
                    Grabar Sesiones
                  </span>
                  <Tooltip content="Graba automáticamente todas las sesiones remotas.&#10;Útil para auditoría y cumplimiento." />
                </div>
                <p className="text-xs text-secondary-600">
                  Graba automáticamente las conexiones
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