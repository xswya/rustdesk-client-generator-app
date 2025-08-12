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
          <h2 className="form-section-title">Configuración del Servidor</h2>
          <p className="form-section-description">
            Configura la conexión hardcodeada al servidor RustDesk
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Servidor de Encuentro *
              </label>
              <Tooltip content="FQDN del servidor RustDesk sin protocolo ni puerto.&#10;Ejemplo: hbbs.midominio.com&#10;&#10;Este servidor maneja las conexiones iniciales entre clientes." />
            </div>
            <Input
              {...register('server.RENDEZVOUS_SERVER')}
              placeholder="hbbs.midominio.com"
              error={errors.server?.RENDEZVOUS_SERVER?.message}
              helperText="Dominio completo sin protocolo (http/https) ni puerto"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-secondary-900">
                Clave Pública *
              </label>
              <Tooltip content="Clave pública del servidor en formato Base64.&#10;Se encuentra en el archivo id_ed25519.pub del servidor.&#10;&#10;Ejemplo: OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw=" />
            </div>
            <Input
              {...register('server.RS_PUB_KEY')}
              placeholder="OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw="
              error={errors.server?.RS_PUB_KEY?.message}
              helperText="Clave Base64 del archivo id_ed25519.pub"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-secondary-900">
              Servidor API (Opcional)
            </label>
            <Tooltip content="URL del servidor API para funciones avanzadas.&#10;Recomendado usar HTTPS detrás de un proxy como Nginx.&#10;&#10;Ejemplo: https://hbbs.midominio.com" />
          </div>
          <Input
            {...register('server.API_SERVER')}
            placeholder="https://hbbs.midominio.com"
            error={errors.server?.API_SERVER?.message}
            helperText="URL completa con HTTPS para el API del servidor"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Información Importante</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Si defines RENDEZVOUS_SERVER, también debes definir RS_PUB_KEY</li>
                <li>• El cliente no funcionará si falta alguno de estos campos obligatorios</li>
                <li>• Puertos típicos: 21114-21119 (TCP), 21116 (UDP)</li>
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