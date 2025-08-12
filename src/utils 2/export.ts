import { Config } from '@/types/config';

export const exportUtils = {
  generateConfigJson: (config: Config): string => {
    return JSON.stringify(config, null, 2);
  },

  generateEnvFile: (config: Config): string => {
    const envLines = [
      '# RustDesk Client Configuration',
      '# Variables de entorno para hardcode del cliente',
      '',
      '# Configuración del servidor (obligatorios si se usan)',
      `RENDEZVOUS_SERVER=${config.server.RENDEZVOUS_SERVER}`,
      `RS_PUB_KEY=${config.server.RS_PUB_KEY}`,
      `API_SERVER=${config.server.API_SERVER || ''}`,
      '',
      '# Configuración de build',
      `BUILD_VERSION=${config.build.version}`,
      `BUILD_PLATFORM=${config.build.platform}`,
      `BUILD_ARTIFACTS=${config.build.artifacts.join(',')}`,
      `PUBLISH_RELEASE=${config.build.publish_release}`,
      `UPLOAD_ARTIFACTS=${config.build.upload_artifacts}`,
      '',
      '# Branding',
      `PRODUCT_NAME=${config.branding.PRODUCT_NAME}`,
      `THEME_COLOR=${config.branding.THEME_COLOR}`,
      '',
      '# Configuraciones avanzadas',
      `DEFAULT_THEME=${config.advanced.theme}`,
      `DEFAULT_LANG=${config.advanced.lang}`,
      `ENABLE_HARDWARE_CODEC=${config.advanced.ENABLE_HARDWARE_CODEC}`,
      `ENCRYPTED_ONLY=${config.security.encrypted_only}`,
      `REQUIRE_LOGIN=${config.security.require_login}`,
      ''
    ];

    return envLines.join('\n');
  },

  downloadFile: (content: string, filename: string, mimeType: string = 'text/plain'): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  downloadConfigJson: (config: Config): void => {
    const content = exportUtils.generateConfigJson(config);
    exportUtils.downloadFile(content, 'config.json', 'application/json');
  },

  downloadEnvFile: (config: Config): void => {
    const content = exportUtils.generateEnvFile(config);
    exportUtils.downloadFile(content, '.env.example', 'text/plain');
  }
};