#!/bin/bash

# Script para compilar cliente RustDesk personalizado en macOS
# Uso: ./build-macos.sh [config.json] [opciones]

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Función de ayuda
show_help() {
    cat << EOF
Script de compilación para cliente RustDesk personalizado (macOS)

Uso: $0 [OPCIONES]

OPCIONES:
    -c, --config FILE       Archivo de configuración JSON (default: config.json)
    -o, --output DIR        Directorio de salida (default: ./dist)
    -b, --branch BRANCH     Rama de RustDesk (default: master)
    -a, --arch ARCH         Arquitectura objetivo (x86_64, aarch64)
    -r, --release           Compilar en modo release (default)
    -d, --debug             Compilar en modo debug
    -p, --portable          Crear versión portable
    -s, --sign              Firmar aplicación (requiere certificado)
    -n, --notarize          Notarizar aplicación (requiere Apple ID)
    -v, --verbose           Salida detallada
    -h, --help              Mostrar esta ayuda

EJEMPLOS:
    $0 -c mi-config.json -a x86_64 -r
    $0 --config config.json --arch aarch64 --sign
    $0 --debug --verbose

NOTA: Para firmar y notarizar, necesitas:
- Certificado de desarrollador de Apple
- Apple ID configurado con xcode-select
- Contraseña específica de aplicación

EOF
}

# Variables por defecto
CONFIG_FILE="config.json"
OUTPUT_DIR="./dist"
RUSTDESK_BRANCH="master"
TARGET_ARCH="$(uname -m)"
BUILD_MODE="release"
PORTABLE_MODE=false
SIGN_APP=false
NOTARIZE_APP=false
VERBOSE=false
RUSTDESK_DIR="rustdesk-source"

# Detectar arquitectura automáticamente si no se especifica
if [ "$TARGET_ARCH" = "arm64" ]; then
    TARGET_ARCH="aarch64"
fi

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -b|--branch)
            RUSTDESK_BRANCH="$2"
            shift 2
            ;;
        -a|--arch)
            TARGET_ARCH="$2"
            shift 2
            ;;
        -r|--release)
            BUILD_MODE="release"
            shift
            ;;
        -d|--debug)
            BUILD_MODE="debug"
            shift
            ;;
        -p|--portable)
            PORTABLE_MODE=true
            shift
            ;;
        -s|--sign)
            SIGN_APP=true
            shift
            ;;
        -n|--notarize)
            NOTARIZE_APP=true
            SIGN_APP=true  # Notarización requiere firma
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            error "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Función para verificar dependencias
check_dependencies() {
    log "Verificando dependencias del sistema..."
    
    local missing_deps=()
    
    # Verificar herramientas básicas
    for tool in git curl wget; do
        if ! command -v $tool &> /dev/null; then
            missing_deps+=($tool)
        fi
    done
    
    # Verificar Rust
    if ! command -v rustc &> /dev/null; then
        missing_deps+=("rust")
    fi
    
    # Verificar Cargo
    if ! command -v cargo &> /dev/null; then
        missing_deps+=("cargo")
    fi
    
    # Verificar Xcode Command Line Tools
    if ! xcode-select -p &> /dev/null; then
        missing_deps+=("xcode-command-line-tools")
    fi
    
    # Verificar Homebrew (opcional pero recomendado)
    if ! command -v brew &> /dev/null; then
        warning "Homebrew no está instalado (opcional pero recomendado)"
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Faltan las siguientes dependencias:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Para instalar:"
        echo "1. Xcode Command Line Tools: xcode-select --install"
        echo "2. Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        echo "3. Homebrew (opcional): /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    success "Todas las dependencias están instaladas"
}

# Función para configurar el target de Rust
setup_rust_target() {
    log "Configurando target de Rust: $TARGET_ARCH"
    
    case $TARGET_ARCH in
        x86_64)
            RUST_TARGET="x86_64-apple-darwin"
            ;;
        aarch64|arm64)
            RUST_TARGET="aarch64-apple-darwin"
            TARGET_ARCH="aarch64"  # Normalizar nombre
            ;;
        *)
            error "Arquitectura no soportada en macOS: $TARGET_ARCH"
            echo "Arquitecturas soportadas: x86_64, aarch64"
            exit 1
            ;;
    esac
    
    # Instalar target si no existe
    if ! rustup target list --installed | grep -q "$RUST_TARGET"; then
        log "Instalando target $RUST_TARGET..."
        rustup target add $RUST_TARGET
    fi
    
    success "Target configurado: $RUST_TARGET"
}

# Función para clonar RustDesk
clone_rustdesk() {
    log "Clonando RustDesk (rama: $RUSTDESK_BRANCH)..."
    
    if [ -d "$RUSTDESK_DIR" ]; then
        warning "Directorio $RUSTDESK_DIR ya existe, eliminando..."
        rm -rf "$RUSTDESK_DIR"
    fi
    
    git clone --depth 1 --branch "$RUSTDESK_BRANCH" https://github.com/rustdesk/rustdesk.git "$RUSTDESK_DIR"
    
    if [ ! -d "$RUSTDESK_DIR" ]; then
        error "Error al clonar RustDesk"
        exit 1
    fi
    
    success "RustDesk clonado correctamente"
}

# Función para aplicar configuración personalizada
apply_configuration() {
    log "Aplicando configuración personalizada..."
    
    if [ ! -f "$CONFIG_FILE" ]; then
        error "Archivo de configuración no encontrado: $CONFIG_FILE"
        exit 1
    fi
    
    # Verificar que el archivo JSON es válido
    if ! python3 -m json.tool "$CONFIG_FILE" > /dev/null 2>&1; then
        error "El archivo de configuración no es un JSON válido"
        exit 1
    fi
    
    # Aplicar configuración usando Python
    python3 << EOF
import json
import os
import sys
import plistlib
from pathlib import Path

def apply_config():
    try:
        with open('$CONFIG_FILE', 'r') as f:
            config = json.load(f)
        
        rustdesk_dir = '$RUSTDESK_DIR'
        
        # Aplicar configuración del servidor
        if 'server' in config:
            server_config = config['server']
            print("Aplicando configuración del servidor...")
            
            # Configurar servidor de encuentro
            if 'rendezvous_server' in server_config and server_config['rendezvous_server']:
                print(f"  - Servidor de encuentro: {server_config['rendezvous_server']}")
            
            # Configurar clave pública
            if 'public_key' in server_config and server_config['public_key']:
                print(f"  - Clave pública configurada")
        
        # Aplicar configuración de branding
        if 'branding' in config:
            branding_config = config['branding']
            print("Aplicando configuración de branding...")
            
            # Configurar Info.plist para macOS
            info_plist_path = Path(rustdesk_dir) / "src" / "platform" / "macos" / "Info.plist"
            if info_plist_path.exists():
                try:
                    with open(info_plist_path, 'rb') as f:
                        plist_data = plistlib.load(f)
                    
                    # Actualizar nombre de aplicación
                    if 'app_name' in branding_config and branding_config['app_name']:
                        plist_data['CFBundleName'] = branding_config['app_name']
                        plist_data['CFBundleDisplayName'] = branding_config['app_name']
                        print(f"  - Nombre de aplicación: {branding_config['app_name']}")
                    
                    # Actualizar identificador de bundle
                    if 'company' in branding_config and branding_config['company']:
                        bundle_id = f"com.{branding_config['company'].lower().replace(' ', '')}.rustdesk"
                        plist_data['CFBundleIdentifier'] = bundle_id
                        print(f"  - Bundle ID: {bundle_id}")
                    
                    # Guardar cambios
                    with open(info_plist_path, 'wb') as f:
                        plistlib.dump(plist_data, f)
                        
                except Exception as e:
                    print(f"  - Warning: No se pudo actualizar Info.plist: {e}")
        
        print("Configuración aplicada correctamente")
        
    except Exception as e:
        print(f"Error al aplicar configuración: {e}", file=sys.stderr)
        sys.exit(1)

apply_config()
EOF
    
    if [ $? -ne 0 ]; then
        error "Error al aplicar la configuración"
        exit 1
    fi
    
    success "Configuración aplicada correctamente"
}

# Función para compilar RustDesk
build_rustdesk() {
    log "Iniciando compilación de RustDesk..."
    
    cd "$RUSTDESK_DIR"
    
    # Configurar variables de entorno para macOS
    export MACOSX_DEPLOYMENT_TARGET="10.14"
    export CARGO_TARGET_DIR="target"
    
    # Configurar flags de compilación
    local build_flags=""
    if [ "$BUILD_MODE" = "release" ]; then
        build_flags="--release"
    fi
    
    # Configurar target
    build_flags="$build_flags --target $RUST_TARGET"
    
    # Mostrar información de compilación
    log "Configuración de compilación:"
    echo "  - Modo: $BUILD_MODE"
    echo "  - Target: $RUST_TARGET"
    echo "  - Deployment Target: $MACOSX_DEPLOYMENT_TARGET"
    echo "  - Flags: $build_flags"
    
    # Compilar
    log "Compilando RustDesk..."
    if [ "$VERBOSE" = true ]; then
        cargo build $build_flags --bin rustdesk -v
    else
        cargo build $build_flags --bin rustdesk
    fi
    
    # Verificar que la compilación fue exitosa
    local executable_path="target/$RUST_TARGET/$BUILD_MODE/rustdesk"
    if [ ! -f "$executable_path" ]; then
        error "Error: No se encontró el ejecutable compilado en $executable_path"
        exit 1
    fi
    
    success "Compilación completada: $executable_path"
    
    cd ..
}

# Función para crear bundle de aplicación macOS
create_app_bundle() {
    log "Creando bundle de aplicación macOS..."
    
    local app_name="RustDesk"
    if [ -f "$CONFIG_FILE" ]; then
        # Extraer nombre personalizado del config si existe
        local custom_name=$(python3 -c "
import json
try:
    with open('$CONFIG_FILE', 'r') as f:
        config = json.load(f)
    if 'branding' in config and 'app_name' in config['branding']:
        print(config['branding']['app_name'])
    else:
        print('RustDesk')
except:
    print('RustDesk')
")
        if [ -n "$custom_name" ]; then
            app_name="$custom_name"
        fi
    fi
    
    local app_bundle="$OUTPUT_DIR/$app_name.app"
    local contents_dir="$app_bundle/Contents"
    local macos_dir="$contents_dir/MacOS"
    local resources_dir="$contents_dir/Resources"
    
    # Crear estructura del bundle
    mkdir -p "$macos_dir"
    mkdir -p "$resources_dir"
    
    # Copiar ejecutable
    local source_path="$RUSTDESK_DIR/target/$RUST_TARGET/$BUILD_MODE/rustdesk"
    cp "$source_path" "$macos_dir/$app_name"
    chmod +x "$macos_dir/$app_name"
    
    # Crear Info.plist
    cat > "$contents_dir/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>$app_name</string>
    <key>CFBundleIdentifier</key>
    <string>com.rustdesk.client</string>
    <key>CFBundleName</key>
    <string>$app_name</string>
    <key>CFBundleDisplayName</key>
    <string>$app_name</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.14</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSSupportsAutomaticGraphicsSwitching</key>
    <true/>
</dict>
</plist>
EOF
    
    # Copiar icono si existe
    local icon_path="$RUSTDESK_DIR/res/icon.icns"
    if [ -f "$icon_path" ]; then
        cp "$icon_path" "$resources_dir/icon.icns"
        # Actualizar Info.plist para incluir el icono
        /usr/libexec/PlistBuddy -c "Add :CFBundleIconFile string icon.icns" "$contents_dir/Info.plist" 2>/dev/null || true
    fi
    
    success "Bundle de aplicación creado: $app_bundle"
    
    # Firmar aplicación si se solicita
    if [ "$SIGN_APP" = true ]; then
        sign_application "$app_bundle"
    fi
    
    # Notarizar aplicación si se solicita
    if [ "$NOTARIZE_APP" = true ]; then
        notarize_application "$app_bundle"
    fi
}

# Función para firmar aplicación
sign_application() {
    local app_path="$1"
    
    log "Firmando aplicación..."
    
    # Verificar que existe un certificado de desarrollador
    local cert_name=$(security find-identity -v -p codesigning | grep "Developer ID Application" | head -1 | sed 's/.*") \(.*\)/\1/')
    
    if [ -z "$cert_name" ]; then
        warning "No se encontró certificado de Developer ID Application"
        echo "Para firmar la aplicación, necesitas:"
        echo "1. Certificado de Developer ID Application de Apple"
        echo "2. Importarlo en Keychain Access"
        return 1
    fi
    
    log "Usando certificado: $cert_name"
    
    # Firmar aplicación
    codesign --force --deep --sign "$cert_name" "$app_path"
    
    # Verificar firma
    if codesign --verify --deep --strict "$app_path"; then
        success "Aplicación firmada correctamente"
    else
        error "Error al firmar la aplicación"
        return 1
    fi
}

# Función para notarizar aplicación
notarize_application() {
    local app_path="$1"
    
    log "Notarizando aplicación..."
    
    # Verificar que xcrun está disponible
    if ! command -v xcrun &> /dev/null; then
        error "xcrun no está disponible. Instala Xcode Command Line Tools."
        return 1
    fi
    
    # Crear archivo ZIP para notarización
    local zip_path="$OUTPUT_DIR/$(basename "$app_path" .app).zip"
    (cd "$OUTPUT_DIR" && zip -r "$(basename "$zip_path")" "$(basename "$app_path")")
    
    log "Subiendo para notarización..."
    echo "NOTA: La notarización requiere Apple ID y contraseña específica de aplicación"
    echo "Configura las variables de entorno APPLE_ID y APPLE_PASSWORD"
    
    if [ -n "$APPLE_ID" ] && [ -n "$APPLE_PASSWORD" ]; then
        # Subir para notarización
        local request_uuid=$(xcrun altool --notarize-app \
            --primary-bundle-id "com.rustdesk.client" \
            --username "$APPLE_ID" \
            --password "$APPLE_PASSWORD" \
            --file "$zip_path" 2>&1 | grep "RequestUUID" | awk '{print $3}')
        
        if [ -n "$request_uuid" ]; then
            log "Notarización iniciada. UUID: $request_uuid"
            log "Verificando estado de notarización..."
            
            # Esperar a que complete la notarización
            local status="in progress"
            while [ "$status" = "in progress" ]; do
                sleep 30
                status=$(xcrun altool --notarization-info "$request_uuid" \
                    --username "$APPLE_ID" \
                    --password "$APPLE_PASSWORD" 2>&1 | grep "Status:" | awk '{print $2}')
                log "Estado: $status"
            done
            
            if [ "$status" = "success" ]; then
                # Grapar ticket de notarización
                xcrun stapler staple "$app_path"
                success "Aplicación notarizada y grapada correctamente"
            else
                error "Error en la notarización: $status"
                return 1
            fi
        else
            error "Error al iniciar notarización"
            return 1
        fi
    else
        warning "Variables APPLE_ID y APPLE_PASSWORD no configuradas"
        echo "Para notarizar automáticamente, configura:"
        echo "export APPLE_ID='tu-apple-id@ejemplo.com'"
        echo "export APPLE_PASSWORD='tu-contraseña-especifica-de-app'"
    fi
}

# Función para crear distribución
create_distribution() {
    log "Creando distribución..."
    
    # Crear directorio de salida
    mkdir -p "$OUTPUT_DIR"
    
    # Crear bundle de aplicación
    create_app_bundle
    
    # Copiar configuración
    cp "$CONFIG_FILE" "$OUTPUT_DIR/config.json"
    
    # Crear README
    cat > "$OUTPUT_DIR/README.txt" << EOF
# Cliente RustDesk Personalizado para macOS

Este es un cliente RustDesk personalizado compilado para macOS.

## Archivos incluidos:
- $(basename "$OUTPUT_DIR"/*.app): Aplicación principal
- config.json: Configuración utilizada para el build

## Información del build:
- Arquitectura: $TARGET_ARCH
- Target Rust: $RUST_TARGET
- Modo: $BUILD_MODE
- Rama RustDesk: $RUSTDESK_BRANCH
- Firmado: $SIGN_APP
- Notarizado: $NOTARIZE_APP
- Fecha de compilación: $(date)

## Instrucciones de instalación:
1. Arrastra la aplicación .app a tu carpeta Aplicaciones
2. La primera vez, haz clic derecho > Abrir para evitar el aviso de seguridad
3. El cliente usará la configuración personalizada automáticamente

## Solución de problemas:
- Si macOS bloquea la aplicación: Sistema > Seguridad > Permitir aplicación
- Para aplicaciones no firmadas: sudo spctl --master-disable (temporal)

Para soporte técnico, consulta la documentación del proyecto.
EOF
    
    # Crear script de instalación
    cat > "$OUTPUT_DIR/install.sh" << 'EOF'
#!/bin/bash

# Script de instalación para cliente RustDesk en macOS

APP_NAME=$(ls *.app | head -1)
APPLICATIONS_DIR="/Applications"

if [ -z "$APP_NAME" ]; then
    echo "Error: No se encontró archivo .app"
    exit 1
fi

echo "Instalando $APP_NAME..."

# Verificar permisos
if [ ! -w "$APPLICATIONS_DIR" ]; then
    echo "Se requieren permisos de administrador para instalar en /Applications"
    sudo cp -R "$APP_NAME" "$APPLICATIONS_DIR/"
else
    cp -R "$APP_NAME" "$APPLICATIONS_DIR/"
fi

echo "Instalación completada!"
echo "La aplicación está disponible en Launchpad y en /Applications"

# Abrir aplicación
read -p "¿Deseas abrir la aplicación ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "$APPLICATIONS_DIR/$APP_NAME"
fi
EOF
    chmod +x "$OUTPUT_DIR/install.sh"
    
    # Mostrar resumen
    log "Contenido de la distribución:"
    ls -la "$OUTPUT_DIR"
    
    success "Distribución creada en: $OUTPUT_DIR"
}

# Función principal
main() {
    log "=== Iniciando compilación de cliente RustDesk personalizado para macOS ==="
    
    # Mostrar configuración
    log "Configuración:"
    echo "  - Archivo de configuración: $CONFIG_FILE"
    echo "  - Directorio de salida: $OUTPUT_DIR"
    echo "  - Rama RustDesk: $RUSTDESK_BRANCH"
    echo "  - Arquitectura: $TARGET_ARCH"
    echo "  - Modo de compilación: $BUILD_MODE"
    echo "  - Modo portable: $PORTABLE_MODE"
    echo "  - Firmar aplicación: $SIGN_APP"
    echo "  - Notarizar aplicación: $NOTARIZE_APP"
    echo "  - Verbose: $VERBOSE"
    
    # Ejecutar pasos
    check_dependencies
    setup_rust_target
    clone_rustdesk
    apply_configuration
    build_rustdesk
    create_distribution
    
    success "=== Compilación completada exitosamente ==="
    echo ""
    echo "🎉 Tu cliente RustDesk personalizado para macOS está listo!"
    echo "📁 Ubicación: $OUTPUT_DIR"
    echo "🚀 Para instalar: cd $OUTPUT_DIR && ./install.sh"
    
    if [ "$SIGN_APP" = true ]; then
        echo "✅ Aplicación firmada"
    else
        echo "⚠️  Aplicación no firmada (puede requerir permisos adicionales)"
    fi
    
    if [ "$NOTARIZE_APP" = true ]; then
        echo "✅ Aplicación notarizada"
    fi
}

# Ejecutar función principal
main "$@"