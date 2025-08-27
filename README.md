# 🚀 RustDesk 客户端生成器

Web生成器，用于创建具有高级配置和自动编译功能的RustDesk自定义客户端。

## ✨ 功能特点

- **直观的Web界面**：逐步表单，用于配置您的自定义客户端
- **完整配置**：服务器、安全、品牌、高级选项和构建设置
- **多平台支持**：支持Windows、Linux和macOS
- **自动编译**：使用GitHub Actions自动构建
- **本地脚本**：适用于各平台的本地编译脚本
- **灵活导出**：将配置下载为JSON或环境变量

## 🎯 使用场景

- **企业**：创建具有自定义品牌的企业客户端
- **MSP服务商**：为多个客户生成具有特定配置的客户端
- **开发者**：为特定项目自定义RustDesk
- **管理员**：使用预定义的安全策略配置客户端

## 🛠️ 技术栈

- **前端**：React 18 + TypeScript + Vite
- **UI**：Tailwind CSS + shadcn/ui
- **验证**：Zod + React Hook Form
- **构建**：GitHub Actions + 多平台脚本
- **处理**：PowerShell、Bash、Python

## 📋 要求

### 使用Web界面：
- Node.js 18+
- npm或yarn

### 本地编译：
- **Windows**：PowerShell 5.1+、Visual Studio Build Tools
- **Linux**：Bash、Rust、开发依赖项
- **macOS**：Bash、Xcode命令行工具、Rust

### GitHub Actions：
- GitHub仓库
- 配置的secrets（可选，用于签名）

## 🌐 在线演示

**应用URL**：https://gilberth.github.io/rustdesk-client-generator/

该应用程序自动部署在GitHub Pages上，并随着每次推送到main分支而更新。

## 🚀 快速开始

### 1. 克隆并安装依赖

```bash
git clone <仓库URL>
cd rustdesk-client-generator
npm install
```

### 2. 在开发模式下运行

```bash
npm run dev
```

### 3. 在浏览器中打开

访问`http://localhost:5173`以访问Web界面。

### 4. 配置您的客户端

1. **服务器**：配置中继服务器、公钥和API
2. **安全**：设置密码、访问密钥和策略
3. **品牌**：自定义名称、徽标、颜色和文本
4. **高级选项**：调整网络、屏幕和性能
5. **构建**：定义可执行文件名、版本和编译选项

### 5. 生成客户端

- **选项A**：下载配置并使用本地脚本
- **选项B**：使用GitHub Actions进行自动编译

## 📁 项目结构

```
rustdesk-client-generator/
├── src/
│   ├── components/
│   │   ├── forms/          # 表单组件
│   │   └── ui/             # 基础UI组件
│   ├── types/              # TypeScript类型
│   ├── utils/              # 工具函数
│   └── App.tsx             # 主应用程序
├── scripts/
│   ├── apply-config.ps1    # Windows PowerShell脚本
│   ├── build-linux.sh     # Linux Bash脚本
│   ├── build-macos.sh     # macOS Bash脚本
│   └── build-windows.ps1  # Windows PowerShell脚本
├── .github/workflows/
│   └── build-windows.yml  # Windows GitHub Actions
└── docs/                   # 额外文档
```

## 🔧 详细配置

### 服务器

- **中继服务器**：RustDesk服务器的IP或域名
- **公钥**：用于服务器验证的公钥
- **API服务器**：管理API的端点（可选）

### 安全

- **固定密码**：用于连接的预定义密码
- **访问密钥**：额外的安全密钥
- **策略**：移除背景、阻止本地输入、隐私模式
- **录制**：会话录制配置

### 品牌

- **身份**：应用名称、公司、网站
- **视觉**：徽标、图标、自定义颜色
- **文本**：欢迎消息、支持信息
- **本地化**：语言和区域设置

### 高级选项

- **网络**：TCP/UDP端口、STUN服务器
- **屏幕**：视频质量、最大FPS、编解码器
- **性能**：硬件加速、IP直接访问
- **功能**：音频、文件传输、剪贴板

### 构建

- **可执行文件**：最终文件的名称和版本
- **平台**：目标架构（x86_64、ARM64等）
- **模式**：调试vs发布，便携vs安装程序
- **签名**：用于分发的代码证书

## 🖥️ 本地编译

### Windows

```powershell
# 应用配置
.\scripts\apply-config.ps1 -ConfigPath config.json -RustDeskPath rustdesk-source

# 编译（需要额外脚本）
.\scripts\build-windows.ps1 -Config config.json -Architecture x64 -Release
```

### Linux

```bash
# 设为可执行
chmod +x scripts/build-linux.sh

# 编译
./scripts/build-linux.sh --config config.json --arch x86_64 --release
```

### macOS

```bash
# 设为可执行
chmod +x scripts/build-macos.sh

# 编译
./scripts/build-macos.sh --config config.json --arch x86_64 --release --sign
```

## ☁️ 使用GitHub Actions编译

### 1. 配置仓库

1. Fork或克隆此仓库
2. 启用GitHub Actions
3. 如果需要代码签名，配置secrets

### 2. 运行工作流

1. 前往Actions > Build Custom RustDesk Client
2. 点击"Run workflow"
3. 粘贴您的JSON配置
4. 配置构建选项
5. 运行工作流

### 3. 下载结果

构建产物将在工作流页面上可用90天。

## 🔐 Secrets配置

对于高级功能，请在GitHub中配置以下secrets：

```
CODE_SIGNING_CERT=<base64证书>
CODE_SIGNING_PASSWORD=<证书密码>
APPLE_ID=<用于公证的apple-id>
APPLE_PASSWORD=<应用专用密码>
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