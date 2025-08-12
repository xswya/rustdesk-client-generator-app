import { z } from 'zod';

// Esquemas de validación con Zod
export const ServerConfigSchema = z.object({
  RENDEZVOUS_SERVER: z.string()
    .min(1, 'El servidor es obligatorio')
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 
      'Debe ser un FQDN válido (ej: hbbs.midominio.com)'),
  RS_PUB_KEY: z.string()
    .min(1, 'La clave pública es obligatoria')
    .regex(/^[A-Za-z0-9+/]+=*$/, 'Debe ser una clave Base64 válida'),
  API_SERVER: z.string()
    .url('Debe ser una URL válida (ej: https://hbbs.midominio.com)')
    .optional()
    .or(z.literal(''))
}).refine(
  (data) => {
    const hasServer = data.RENDEZVOUS_SERVER.length > 0;
    const hasKey = data.RS_PUB_KEY.length > 0;
    return (hasServer && hasKey) || (!hasServer && !hasKey);
  },
  {
    message: 'Si defines RENDEZVOUS_SERVER, también debes definir RS_PUB_KEY (y viceversa)',
    path: ['RENDEZVOUS_SERVER']
  }
);

export const SecurityConfigSchema = z.object({
  PRESET_PASSWORD: z.string().optional(),
  ACCESS_KEY: z.string().optional(),
  PRESET_REMOVE_WALLPAPER: z.boolean().default(false),
  PRESET_BLOCK_INPUT: z.boolean().default(false),
  PRESET_PRIVACY_MODE: z.boolean().default(false),
  PRESET_RECORD_SESSION: z.boolean().default(false),
  encrypted_only: z.boolean().default(false),
  require_login: z.boolean().default(false)
});

export const BrandingConfigSchema = z.object({
  APP_NAME: z.string().min(1, 'El nombre de la aplicación es obligatorio').default('RustDesk'),
  COMPANY_NAME: z.string().optional(),
  WEBSITE_URL: z.string().optional(),
  LOGO_URL: z.string().optional(),
  ICON_URL: z.string().optional(),
  WELCOME_TEXT: z.string().optional(),
  SUPPORT_INFO: z.string().optional(),
  // Campos adicionales
  PRODUCT_NAME: z.string().min(1, 'El nombre del producto es obligatorio').default('RustDesk'),
  MAIN_WINDOW_TITLE: z.string().optional(),
  ABOUT_TEXT: z.string().optional(),
  LOGO_LIGHT: z.string().optional(),
  LOGO_DARK: z.string().optional(),
  ICON_WIN_ICO: z.string().optional(),
  ICON_WIN_PNG: z.string().optional(),
  ICON_MAC_ICNS: z.string().optional(),
  ICON_LINUX_PNG: z.string().optional(),
  THEME_COLOR: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido').default('#0a84ff'),
  CUSTOM_CSS: z.string().optional(),
  CUSTOM_FAVICON: z.string().optional(),
  HIDE_ABOUT_MENU: z.boolean().default(false),
  HIDE_HELP_MENU: z.boolean().default(false),
  HIDE_SETTINGS_MENU: z.boolean().default(false)
});

export const AdvancedConfigSchema = z.object({
  CUSTOM_TCP_PORT: z.string().optional(),
  CUSTOM_UDP_PORT: z.string().optional(),
  CUSTOM_STUN_SERVERS: z.string().optional(),
  DEFAULT_VIDEO_QUALITY: z.enum(['low', 'medium', 'high', 'best']).default('medium'),
  MAX_FPS: z.number().min(1).max(120).default(30),
  ENABLE_HARDWARE_CODEC: z.boolean().default(true),
  ENABLE_DIRECT_IP_ACCESS: z.boolean().default(true),
  DISABLE_AUDIO: z.boolean().default(false),
  ENABLE_FILE_TRANSFER: z.boolean().default(true),
  theme: z.enum(['system', 'dark', 'light']).default('system'),
  lang: z.string().default('es'),
  custom_kv: z.record(z.string()).default({})
});

export const BuildConfigSchema = z.object({
  EXECUTABLE_NAME: z.string().optional(),
  VERSION: z.string().regex(/^v\d+\.\d+\.\d+$/, 'Debe seguir el formato vX.Y.Z').default('v1.0.0'),
  BUILD_DESCRIPTION: z.string().optional(),
  RUSTDESK_BRANCH: z.string().default('master'),
  TARGET_ARCH: z.enum(['x86_64', 'aarch64']).default('x86_64'),
  ENABLE_PORTABLE_MODE: z.boolean().default(false),
  INCLUDE_INSTALLER: z.boolean().default(true),
  ENABLE_DEBUG_MODE: z.boolean().default(false),
  SIGN_EXECUTABLE: z.boolean().default(false),
  // Campos legacy para compatibilidad
  version: z.string().regex(/^v\d+\.\d+\.\d+$/, 'Debe seguir el formato vX.Y.Z').default('v1.0.0'),
  description: z.string().optional(),
  repository_branch: z.string().default('master'),
  rustdesk_arch: z.enum(['x86_64', 'aarch64']).default('x86_64'),
  portable_mode: z.boolean().default(false),
  include_installer: z.boolean().default(true),
  debug_mode: z.boolean().default(false),
  sign_executable: z.boolean().default(false),
  platform: z.enum(['windows-x64']).default('windows-x64'),
  artifacts: z.array(z.enum(['exe', 'msi'])).default(['exe']),
  publish_release: z.boolean().default(false),
  upload_artifacts: z.boolean().default(true)
});

export const ConfigSchema = z.object({
  server: ServerConfigSchema,
  security: SecurityConfigSchema,
  branding: BrandingConfigSchema,
  advanced: AdvancedConfigSchema,
  build: BuildConfigSchema
});

// Tipos TypeScript derivados de los esquemas
export type ServerConfig = z.infer<typeof ServerConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type BrandingConfig = z.infer<typeof BrandingConfigSchema>;
export type AdvancedConfig = z.infer<typeof AdvancedConfigSchema>;
export type BuildConfig = z.infer<typeof BuildConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;

// Configuración por defecto
export const defaultConfig: Config = {
  server: {
    RENDEZVOUS_SERVER: '',
    RS_PUB_KEY: '',
    API_SERVER: ''
  },
  security: {
    PRESET_PASSWORD: '',
    ACCESS_KEY: '',
    PRESET_REMOVE_WALLPAPER: false,
    PRESET_BLOCK_INPUT: false,
    PRESET_PRIVACY_MODE: false,
    PRESET_RECORD_SESSION: false,
    encrypted_only: false,
    require_login: false
  },
  branding: {
    APP_NAME: 'RustDesk',
    COMPANY_NAME: '',
    WEBSITE_URL: '',
    LOGO_URL: '',
    ICON_URL: '',
    WELCOME_TEXT: '',
    SUPPORT_INFO: '',
    // Campos adicionales
    PRODUCT_NAME: 'RustDesk',
    MAIN_WINDOW_TITLE: '',
    ABOUT_TEXT: '',
    LOGO_LIGHT: '',
    LOGO_DARK: '',
    ICON_WIN_ICO: '',
    ICON_WIN_PNG: '',
    ICON_MAC_ICNS: '',
    ICON_LINUX_PNG: '',
    THEME_COLOR: '#0a84ff',
    CUSTOM_CSS: '',
    CUSTOM_FAVICON: '',
    HIDE_ABOUT_MENU: false,
    HIDE_HELP_MENU: false,
    HIDE_SETTINGS_MENU: false
  },
  advanced: {
    CUSTOM_TCP_PORT: '',
    CUSTOM_UDP_PORT: '',
    CUSTOM_STUN_SERVERS: '',
    DEFAULT_VIDEO_QUALITY: 'medium' as const,
    MAX_FPS: 30,
    ENABLE_HARDWARE_CODEC: true,
    ENABLE_DIRECT_IP_ACCESS: true,
    DISABLE_AUDIO: false,
    ENABLE_FILE_TRANSFER: true,
    theme: 'system' as const,
    lang: 'es',
    custom_kv: {}
  },
  build: {
    EXECUTABLE_NAME: '',
    VERSION: 'v1.0.0',
    BUILD_DESCRIPTION: '',
    RUSTDESK_BRANCH: 'master',
    TARGET_ARCH: 'x86_64' as const,
    ENABLE_PORTABLE_MODE: false,
    INCLUDE_INSTALLER: true,
    ENABLE_DEBUG_MODE: false,
    SIGN_EXECUTABLE: false,
    // Campos legacy para compatibilidad
    version: 'v1.0.0',
    description: '',
    repository_branch: 'master',
    rustdesk_arch: 'x86_64' as const,
    portable_mode: false,
    include_installer: true,
    debug_mode: false,
    sign_executable: false,
    platform: 'windows-x64' as const,
    artifacts: ['exe'] as const,
    publish_release: false,
    upload_artifacts: true
  }
};