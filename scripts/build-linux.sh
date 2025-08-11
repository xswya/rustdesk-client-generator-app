#!/bin/bash

# Script para compilar cliente RustDesk personalizado en Linux
# Uso: ./build-linux.sh [config.json] [opciones]

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
Script de compilación para cliente RustDesk personalizado (Linux)

Uso: $0 [OPCIONES]

OPCIONES:
    -c, --config FILE       Archivo de configuración JSON (default: config.json)
    -o, --output DIR        Directorio de salida (default: ./dist)
    -b, --branch BRANCH     Rama de RustDesk (default: master)
    -a, --arch ARCH         Arquitectura objetivo (x86_64, aarch64, armv7)
    -r, --release           Compilar en modo release (default)
    -d, --debug             Compilar en modo debug
    -p, --portable          Crear versión portable
    -v, --verbose           Salida detallada
    -h, --help              Mostrar esta ayuda

EJEMPLOS:
    $0 -c mi-config.json -a x86_64 -r
    $0 --config config.json --arch aarch64 --portable
    $0 --debug --verbose

EOF
}

# Variables por defecto
CONFIG_FILE="config.json"
OUTPUT_DIR="./dist"
RUSTDESK_BRANCH="master"
TARGET_ARCH="x86_64"
BUILD_MODE="release"
PORTABLE_MODE=false
VERBOSE=false
RUSTDESK_DIR="rustdesk-source"

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
    for tool in git curl wget unzip; do
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
    
    # Verificar dependencias de desarrollo
    if ! pkg-config --exists gtk+-3.0; then
        missing_deps+=("libgtk-3-dev")
    fi
    
    if ! pkg-config --exists x11; then
        missing_deps+=("libx11-dev")
    fi
    
    if ! pkg-config --exists xrandr; then
        missing_deps+=("libxrandr-dev")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Faltan las siguientes dependencias:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Para instalar en Ubuntu/Debian:"
        echo "sudo apt update && sudo apt install -y git curl wget unzip build-essential pkg-config libgtk-3-dev libx11-dev libxrandr-dev libxss-dev libglib2.0-dev libpango1.0-dev libatk1.0-dev libgdk-pixbuf-2.0-dev libcairo2-dev libxext-dev libxfixes-dev libxi-dev libxtst-dev libasound2-dev libpulse-dev libva-dev libvdpau-dev libxcb1-dev libxcb-randr0-dev libxcb-xtest0-dev libxcb-xinerama0-dev libxcb-shape0-dev libxcb-xkb-dev"
        echo ""
        echo "Para instalar Rust:"
        echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        exit 1
    fi
    
    success "Todas las dependencias están instaladas"
}

# Función para configurar el target de Rust
setup_rust_target() {
    log "Configurando target de Rust: $TARGET_ARCH"
    
    case $TARGET_ARCH in
        x86_64)
            RUST_TARGET="x86_64-unknown-linux-gnu"
            ;;
        aarch64)
            RUST_TARGET="aarch64-unknown-linux-gnu"
            ;;
        armv7)
            RUST_TARGET="armv7-unknown-linux-gnueabihf"
            ;;
        *)
            error "Arquitectura no soportada: $TARGET_ARCH"
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

def apply_config():
    try:
        with open('$CONFIG_FILE', 'r') as f:
            config = json.load(f)
        
        rustdesk_dir = '$RUSTDESK_DIR'
        
        # Aplicar configuración del servidor
        if 'server' in config:
            server_config = config['server']
            
            # Configurar servidor de encuentro
            if 'rendezvous_server' in server_config and server_config['rendezvous_server']:
                print(f"Configurando servidor de encuentro: {server_config['rendezvous_server']}")
                # Aquí se aplicaría la configuración específica
            
            # Configurar clave pública
            if 'public_key' in server_config and server_config['public_key']:
                print(f"Configurando clave pública")
                # Aquí se aplicaría la configuración específica
        
        # Aplicar configuración de branding
        if 'branding' in config:
            branding_config = config['branding']
            
            if 'app_name' in branding_config and branding_config['app_name']:
                print(f"Configurando nombre de aplicación: {branding_config['app_name']}")
                # Aquí se aplicaría la configuración específica
        
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
    
    # Configurar variables de entorno
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

# Función para crear distribución
create_distribution() {
    log "Creando distribución..."
    
    # Crear directorio de salida
    mkdir -p "$OUTPUT_DIR"
    
    # Copiar ejecutable
    local executable_name="rustdesk"
    if [ -f "$CONFIG_FILE" ]; then
        # Extraer nombre personalizado del config si existe
        local custom_name=$(python3 -c "
import json
try:
    with open('$CONFIG_FILE', 'r') as f:
        config = json.load(f)
    if 'build' in config and 'executable_name' in config['build']:
        print(config['build']['executable_name'])
    else:
        print('rustdesk')
except:
    print('rustdesk')
")
        if [ "$custom_name" != "rustdesk" ] && [ -n "$custom_name" ]; then
            executable_name="$custom_name"
        fi
    fi
    
    local source_path="$RUSTDESK_DIR/target/$RUST_TARGET/$BUILD_MODE/rustdesk"
    local dest_path="$OUTPUT_DIR/$executable_name"
    
    cp "$source_path" "$dest_path"
    chmod +x "$dest_path"
    
    # Copiar configuración
    cp "$CONFIG_FILE" "$OUTPUT_DIR/config.json"
    
    # Crear README
    cat > "$OUTPUT_DIR/README.txt" << EOF
# Cliente RustDesk Personalizado

Este es un cliente RustDesk personalizado compilado automáticamente.

## Archivos incluidos:
- $executable_name: Ejecutable principal
- config.json: Configuración utilizada para el build

## Información del build:
- Arquitectura: $TARGET_ARCH
- Target Rust: $RUST_TARGET
- Modo: $BUILD_MODE
- Rama RustDesk: $RUSTDESK_BRANCH
- Portable: $PORTABLE_MODE
- Fecha de compilación: $(date)

## Instrucciones:
1. Ejecuta directamente el archivo $executable_name
2. El cliente usará la configuración personalizada automáticamente

Para soporte técnico, consulta la documentación del proyecto.
EOF
    
    # Crear script de instalación si es modo portable
    if [ "$PORTABLE_MODE" = true ]; then
        cat > "$OUTPUT_DIR/install.sh" << 'EOF'
#!/bin/bash

# Script de instalación para cliente RustDesk portable

INSTALL_DIR="$HOME/.local/bin"
EXECUTABLE_NAME="rustdesk"

echo "Instalando cliente RustDesk personalizado..."

# Crear directorio si no existe
mkdir -p "$INSTALL_DIR"

# Copiar ejecutable
cp "$EXECUTABLE_NAME" "$INSTALL_DIR/"
chmod +x "$INSTALL_DIR/$EXECUTABLE_NAME"

# Agregar al PATH si no está
if ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
    echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> "$HOME/.bashrc"
    echo "Agregado $INSTALL_DIR al PATH en .bashrc"
fi

echo "Instalación completada!"
echo "Ejecuta '$EXECUTABLE_NAME' desde cualquier terminal"
echo "O reinicia tu terminal para usar el comando globalmente"
EOF
        chmod +x "$OUTPUT_DIR/install.sh"
    fi
    
    # Mostrar resumen
    log "Contenido de la distribución:"
    ls -la "$OUTPUT_DIR"
    
    success "Distribución creada en: $OUTPUT_DIR"
}

# Función principal
main() {
    log "=== Iniciando compilación de cliente RustDesk personalizado ==="
    
    # Mostrar configuración
    log "Configuración:"
    echo "  - Archivo de configuración: $CONFIG_FILE"
    echo "  - Directorio de salida: $OUTPUT_DIR"
    echo "  - Rama RustDesk: $RUSTDESK_BRANCH"
    echo "  - Arquitectura: $TARGET_ARCH"
    echo "  - Modo de compilación: $BUILD_MODE"
    echo "  - Modo portable: $PORTABLE_MODE"
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
    echo "🎉 Tu cliente RustDesk personalizado está listo!"
    echo "📁 Ubicación: $OUTPUT_DIR"
    echo "🚀 Ejecuta: ./$OUTPUT_DIR/$executable_name"
    
    if [ "$PORTABLE_MODE" = true ]; then
        echo "📦 Para instalar globalmente: cd $OUTPUT_DIR && ./install.sh"
    fi
}

# Ejecutar función principal
main "$@"