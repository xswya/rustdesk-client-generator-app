# 🚀 RustDesk Client Generator

Generador web para crear clientes personalizados de RustDesk con configuración avanzada y compilación automatizada.

## ✨ Características

- **Interfaz Web Intuitiva**: Formulario paso a paso para configurar tu cliente personalizado
- **Configuración Completa**: Servidor, seguridad, branding, opciones avanzadas y build
- **Múltiples Plataformas**: Soporte para Windows, Linux y macOS
- **Compilación Automatizada**: GitHub Actions para build automático
- **Scripts Locales**: Scripts para compilación local en cada plataforma
- **Exportación Flexible**: Descarga configuración como JSON o variables de entorno

## 🎯 Casos de Uso

- **Empresas**: Crear clientes corporativos con branding personalizado
- **MSPs**: Generar clientes para múltiples clientes con configuraciones específicas
- **Desarrolladores**: Personalizar RustDesk para proyectos específicos
- **Administradores**: Configurar clientes con políticas de seguridad predefinidas

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Validación**: Zod + React Hook Form
- **Build**: GitHub Actions + Scripts multiplataforma
- **Procesamiento**: PowerShell, Bash, Python

## 📋 Requisitos

### Para usar la interfaz web:
- Node.js 18+
- npm o yarn

### Para compilación local:
- **Windows**: PowerShell 5.1+, Visual Studio Build Tools
- **Linux**: Bash, Rust, dependencias de desarrollo
- **macOS**: Bash, Xcode Command Line Tools, Rust

### Para GitHub Actions:
- Repositorio en GitHub
- Secrets configurados (opcional, para firma)

## 🌐 Demo en Vivo

**URL de la aplicación**: https://gilberth.github.io/rustdesk-client-generator/

La aplicación está desplegada automáticamente en GitHub Pages y se actualiza con cada push a la rama main.

## 🚀 Inicio Rápido

### 1. Clonar e instalar dependencias

```bash
git clone <repository-url>
cd rustdesk-client-generator
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev
```

### 3. Abrir en el navegador

Visita `http://localhost:5173` para acceder a la interfaz web.

### 4. Configurar tu cliente

1. **Servidor**: Configura servidor de encuentro, clave pública y API
2. **Seguridad**: Establece contraseñas, claves de acceso y políticas
3. **Branding**: Personaliza nombre, logo, colores y textos
4. **Opciones Avanzadas**: Ajusta red, pantalla y rendimiento
5. **Build**: Define nombre del ejecutable, versión y opciones de compilación

### 5. Generar cliente

- **Opción A**: Descargar configuración y usar scripts locales
- **Opción B**: Usar GitHub Actions para compilación automática

## 📁 Estructura del Proyecto

```
rustdesk-client-generator/
├── src/
│   ├── components/
│   │   ├── forms/          # Componentes de formulario
│   │   └── ui/             # Componentes UI base
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Utilidades
│   └── App.tsx             # Aplicación principal
├── scripts/
│   ├── apply-config.ps1    # Script PowerShell para Windows
│   ├── build-linux.sh     # Script Bash para Linux
│   ├── build-macos.sh     # Script Bash para macOS
│   └── build-windows.ps1  # Script PowerShell para Windows
├── .github/workflows/
│   └── build-windows.yml  # GitHub Actions para Windows
└── docs/                   # Documentación adicional
```

## 🔧 Configuración Detallada

### Servidor

- **Servidor de Encuentro**: IP o dominio del servidor RustDesk
- **Clave Pública**: Clave pública para verificación de servidor
- **Servidor API**: Endpoint para API de gestión (opcional)

### Seguridad

- **Contraseña Fija**: Contraseña predefinida para conexiones
- **Clave de Acceso**: Clave adicional de seguridad
- **Políticas**: Remover fondo, bloquear entrada local, modo privacidad
- **Grabación**: Configuración de grabación de sesiones

### Branding

- **Identidad**: Nombre de aplicación, empresa, sitio web
- **Visual**: Logo, icono, colores personalizados
- **Textos**: Mensaje de bienvenida, información de soporte
- **Localización**: Idioma y configuraciones regionales

### Opciones Avanzadas

- **Red**: Puertos TCP/UDP, servidores STUN
- **Pantalla**: Calidad de video, FPS máximo, codec
- **Rendimiento**: Hardware acceleration, acceso directo IP
- **Características**: Audio, transferencia de archivos, portapapeles

### Build

- **Ejecutable**: Nombre y versión del archivo final
- **Plataforma**: Arquitectura objetivo (x86_64, ARM64, etc.)
- **Modo**: Debug vs Release, portable vs instalador
- **Firma**: Certificados de código para distribución

## 🖥️ Compilación Local

### Windows

```powershell
# Aplicar configuración
.\scripts\apply-config.ps1 -ConfigPath config.json -RustDeskPath rustdesk-source

# Compilar (requiere script adicional)
.\scripts\build-windows.ps1 -Config config.json -Architecture x64 -Release
```

### Linux

```bash
# Hacer ejecutable
chmod +x scripts/build-linux.sh

# Compilar
./scripts/build-linux.sh --config config.json --arch x86_64 --release
```

### macOS

```bash
# Hacer ejecutable
chmod +x scripts/build-macos.sh

# Compilar
./scripts/build-macos.sh --config config.json --arch x86_64 --release --sign
```

## ☁️ Compilación con GitHub Actions

### 1. Configurar repositorio

1. Fork o clona este repositorio
2. Habilita GitHub Actions
3. Configura secrets si necesitas firma de código

### 2. Ejecutar workflow

1. Ve a Actions > Build Custom RustDesk Client
2. Haz clic en "Run workflow"
3. Pega tu configuración JSON
4. Configura opciones de build
5. Ejecuta el workflow

### 3. Descargar resultado

Los artefactos estarán disponibles en la página del workflow por 90 días.

## 🔐 Configuración de Secrets

Para funcionalidades avanzadas, configura estos secrets en GitHub:

```
CODE_SIGNING_CERT=<certificado-base64>
CODE_SIGNING_PASSWORD=<contraseña-certificado>
APPLE_ID=<apple-id-para-notarizacion>
APPLE_PASSWORD=<contraseña-especifica-app>
```

## 📖 Ejemplos de Configuración

### Cliente Corporativo Básico

```json
{
  "server": {
    "rendezvous_server": "rustdesk.miempresa.com:21116",
    "public_key": "OGYuMDk2MjY5..."
  },
  "branding": {
    "app_name": "MiEmpresa Remote",
    "company": "Mi Empresa S.A.",
    "website_url": "https://miempresa.com"
  },
  "security": {
    "remove_wallpaper": true,
    "block_local_input": true
  }
}
```

### Cliente MSP con Seguridad Avanzada

```json
{
  "server": {
    "rendezvous_server": "msp.ejemplo.com:21116",
    "api_server": "https://api.msp.ejemplo.com"
  },
  "security": {
    "fixed_password": "ClienteSeguro123!",
    "access_key": "MSP-2024-SECURE",
    "privacy_mode": true,
    "session_recording": true
  },
  "advanced": {
    "disable_audio": true,
    "disable_file_transfer": true,
    "direct_ip_access": false
  }
}
```

## 🐛 Solución de Problemas

### Error: "Dependencias faltantes"

**Windows**:
```powershell
# Instalar Visual Studio Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools

# Instalar Rust
winget install Rustlang.Rustup
```

**Linux**:
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y build-essential pkg-config libgtk-3-dev

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**macOS**:
```bash
# Instalar Xcode Command Line Tools
xcode-select --install

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Error: "Certificado de firma no encontrado"

1. Obtén un certificado de firma de código válido
2. Importa el certificado en el almacén apropiado
3. Configura las variables de entorno o secrets necesarios

### Error: "GitHub Actions falla"

1. Verifica que el JSON de configuración sea válido
2. Revisa los logs del workflow para errores específicos
3. Asegúrate de que los secrets estén configurados correctamente

## 🚀 Deployment

### GitHub Pages (Automático)

La aplicación se despliega automáticamente en GitHub Pages con cada push a la rama `main`:

1. **URL de producción**: https://gilberth.github.io/rustdesk-client-generator/
2. **Workflow**: `.github/workflows/deploy.yml`
3. **Configuración**: Vite configurado con `base: '/rustdesk-client-generator/'`

### Deployment Manual

Para desplegar manualmente a GitHub Pages:

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Deploy a GitHub Pages
npm run deploy
```

### Otros Servicios

#### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Build
npm run build

# Deploy (arrastra la carpeta dist a Netlify)
```

#### Servidor Propio

```bash
# Build
npm run build

# Servir archivos estáticos desde la carpeta dist/
# Ejemplo con nginx, Apache, etc.
```

### Variables de Entorno

Para diferentes entornos, puedes configurar:

```bash
# .env.production
VITE_API_URL=https://api.midominio.com
VITE_APP_TITLE=RustDesk Generator Pro
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [RustDesk](https://github.com/rustdesk/rustdesk) - El cliente de escritorio remoto base
- [React](https://reactjs.org/) - Framework de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI

## 📞 Soporte

- 📧 Email: [soporte@ejemplo.com](mailto:soporte@ejemplo.com)
- 💬 Discord: [Servidor de la comunidad](https://discord.gg/ejemplo)
- 📖 Wiki: [Documentación completa](https://github.com/usuario/repo/wiki)
- 🐛 Issues: [Reportar problemas](https://github.com/usuario/repo/issues)

---

⭐ ¡Si este proyecto te resulta útil, considera darle una estrella en GitHub!