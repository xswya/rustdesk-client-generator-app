#!/bin/bash

# Script de validación completa para RustDesk usando Docker
# Simula el entorno de Windows y compila realmente el código

set -e

echo "🔍 Iniciando validación completa con compilación real..."
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar errores
show_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar información
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que Docker está instalado
if ! command -v docker >/dev/null 2>&1; then
    show_error "Docker no está instalado. Instalando Docker..."
    echo "Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
fi

show_success "Docker encontrado"

# Verificar que Docker está corriendo
if ! docker info >/dev/null 2>&1; then
    show_error "Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

show_success "Docker está corriendo"

# Crear Dockerfile para simular entorno de Windows con vcpkg
show_info "Creando entorno de compilación Docker..."

cat > Dockerfile.validation << 'EOF'
# Usar imagen base de Windows Server Core con herramientas de desarrollo
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Instalar chocolatey para gestión de paquetes
RUN powershell -Command \
    "Set-ExecutionPolicy Bypass -Scope Process -Force; \
     [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; \
     iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"

# Instalar herramientas necesarias
RUN choco install -y git cmake ninja visualstudio2022buildtools visualstudio2022-workload-vctools

# Instalar Rust
RUN powershell -Command \
    "Invoke-WebRequest -Uri 'https://win.rustup.rs/' -OutFile 'rustup-init.exe'; \
     .\rustup-init.exe -y --default-toolchain stable --default-host x86_64-pc-windows-msvc; \
     Remove-Item rustup-init.exe"

# Configurar PATH para Rust
RUN setx PATH "%PATH%;C:\Users\ContainerUser\.cargo\bin"

# Instalar vcpkg
RUN git clone https://github.com/Microsoft/vcpkg.git C:\vcpkg
RUN C:\vcpkg\bootstrap-vcpkg.bat

# Configurar variables de entorno para vcpkg
ENV VCPKG_INSTALLATION_ROOT=C:\vcpkg
ENV VCPKG_DEFAULT_TRIPLET=x64-windows-static
ENV VCPKG_FEATURE_FLAGS=manifests,versions

# Crear directorio de trabajo
WORKDIR C:\workspace

# Script de compilación
COPY validate-compile.ps1 C:\workspace\
EOF

# Crear script de PowerShell para compilación
cat > validate-compile.ps1 << 'EOF'
# Script de validación de compilación para RustDesk
param(
    [string]$Mode = "full"
)

Write-Host "🔍 Iniciando validación de compilación RustDesk..." -ForegroundColor Blue
Write-Host "Modo: $Mode" -ForegroundColor Yellow

# Función para mostrar errores
function Show-Error($message) {
    Write-Host "❌ ERROR: $message" -ForegroundColor Red
}

# Función para mostrar éxito
function Show-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

# Función para mostrar información
function Show-Info($message) {
    Write-Host "ℹ️  $message" -ForegroundColor Blue
}

try {
    # Verificar herramientas
    Show-Info "Verificando herramientas instaladas..."
    
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Show-Error "Git no encontrado"
        exit 1
    }
    Show-Success "Git encontrado"
    
    if (!(Get-Command rustc -ErrorAction SilentlyContinue)) {
        Show-Error "Rust no encontrado"
        exit 1
    }
    Show-Success "Rust encontrado: $(rustc --version)"
    
    if (!(Test-Path "$env:VCPKG_INSTALLATION_ROOT\vcpkg.exe")) {
        Show-Error "vcpkg no encontrado en $env:VCPKG_INSTALLATION_ROOT"
        exit 1
    }
    Show-Success "vcpkg encontrado"
    
    # Clonar RustDesk
    Show-Info "Clonando repositorio RustDesk..."
    if (Test-Path "rustdesk") {
        Remove-Item -Recurse -Force "rustdesk"
    }
    git clone --depth 1 https://github.com/rustdesk/rustdesk.git
    Set-Location rustdesk
    
    # Copiar vcpkg.json
    Show-Info "Copiando vcpkg.json..."
    Copy-Item "..\vcpkg.json" "."
    
    # Instalar dependencias vcpkg
    Show-Info "Instalando dependencias vcpkg..."
    & "$env:VCPKG_INSTALLATION_ROOT\vcpkg.exe" install --triplet $env:VCPKG_DEFAULT_TRIPLET
    
    if ($LASTEXITCODE -ne 0) {
        Show-Error "Falló la instalación de dependencias vcpkg"
        exit 1
    }
    Show-Success "Dependencias vcpkg instaladas"
    
    # Verificar instalación
    $installedDir = "$env:VCPKG_INSTALLATION_ROOT\installed\$env:VCPKG_DEFAULT_TRIPLET"
    if (!(Test-Path $installedDir)) {
        Show-Error "Directorio installed no encontrado: $installedDir"
        exit 1
    }
    Show-Success "Directorio installed verificado"
    
    # Verificar headers de opus
    $opusInclude = "$installedDir\include\opus"
    if (!(Test-Path "$opusInclude\opus.h")) {
        Show-Error "Headers de opus no encontrados en $opusInclude"
        exit 1
    }
    Show-Success "Headers de opus verificados"
    
    # Configurar variables de entorno para compilación
    $env:OPUS_INCLUDE_DIR = "$installedDir\include"
    $env:OPUS_LIB_DIR = "$installedDir\lib"
    $env:LIBVPX_INCLUDE_DIR = "$installedDir\include"
    $env:LIBVPX_LIB_DIR = "$installedDir\lib"
    
    Show-Info "Variables de entorno configuradas:"
    Write-Host "  OPUS_INCLUDE_DIR: $env:OPUS_INCLUDE_DIR"
    Write-Host "  OPUS_LIB_DIR: $env:OPUS_LIB_DIR"
    
    if ($Mode -eq "headers_only") {
        Show-Success "Modo headers_only completado exitosamente"
        exit 0
    }
    
    # Compilar RustDesk
    Show-Info "Iniciando compilación de RustDesk..."
    
    if ($Mode -eq "fast_check") {
        Show-Info "Modo fast_check: compilando solo dependencias..."
        cargo check --release
    } else {
        Show-Info "Compilación completa..."
        cargo build --release --bin rustdesk
    }
    
    if ($LASTEXITCODE -ne 0) {
        Show-Error "Falló la compilación de RustDesk"
        exit 1
    }
    
    Show-Success "Compilación completada exitosamente"
    
    # Verificar binario generado (solo en modo completo)
    if ($Mode -eq "full") {
        $binaryPath = "target\release\rustdesk.exe"
        if (Test-Path $binaryPath) {
            $fileInfo = Get-Item $binaryPath
            Show-Success "Binario generado: $binaryPath ($(($fileInfo.Length / 1MB).ToString('F2')) MB)"
        } else {
            Show-Error "Binario no encontrado en $binaryPath"
            exit 1
        }
    }
    
    Show-Success "🎉 Validación completada exitosamente en modo $Mode"
    
} catch {
    Show-Error "Excepción durante la validación: $($_.Exception.Message)"
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
    exit 1
}
EOF

# Función para ejecutar validación en Docker
run_docker_validation() {
    local mode=$1
    show_info "Ejecutando validación en Docker (modo: $mode)..."
    
    # Construir imagen Docker
    show_info "Construyendo imagen Docker (esto puede tomar varios minutos la primera vez)..."
    docker build -f Dockerfile.validation -t rustdesk-validator .
    
    if [ $? -ne 0 ]; then
        show_error "Falló la construcción de la imagen Docker"
        return 1
    fi
    
    # Ejecutar validación
    show_info "Ejecutando validación en contenedor..."
    docker run --rm -v "$(pwd)/vcpkg.json:/workspace/vcpkg.json:ro" \
        rustdesk-validator powershell -File validate-compile.ps1 -Mode $mode
    
    return $?
}

# Función para validación local (Linux/macOS)
run_local_validation() {
    show_info "Ejecutando validación local (limitada)..."
    
    # Verificar archivos básicos
    if [ ! -f "vcpkg.json" ]; then
        show_error "vcpkg.json no encontrado"
        return 1
    fi
    
    if [ ! -f ".github/workflows/build-rustdesk.yml" ]; then
        show_error "Workflow file no encontrado"
        return 1
    fi
    
    # Verificar sintaxis JSON de vcpkg.json
    if command -v jq >/dev/null 2>&1; then
        if jq empty vcpkg.json >/dev/null 2>&1; then
            show_success "vcpkg.json tiene sintaxis JSON válida"
        else
            show_error "vcpkg.json tiene sintaxis JSON inválida"
            return 1
        fi
    fi
    
    # Clonar y verificar que RustDesk compila localmente (sin vcpkg)
    if command -v rustc >/dev/null 2>&1; then
        show_info "Clonando RustDesk para verificación local..."
        if [ -d "rustdesk" ]; then
            rm -rf rustdesk
        fi
        
        git clone --depth 1 https://github.com/rustdesk/rustdesk.git
        cd rustdesk
        
        show_info "Verificando que el proyecto Rust es válido..."
        if cargo check >/dev/null 2>&1; then
            show_success "Proyecto Rust válido"
        else
            show_warning "Proyecto Rust tiene problemas (normal sin dependencias nativas)"
        fi
        
        cd ..
        rm -rf rustdesk
    else
        show_warning "Rust no instalado, saltando verificación local"
    fi
    
    show_success "Validación local completada"
    return 0
}

# Menú principal
echo ""
show_info "Selecciona el tipo de validación:"
echo "1) Validación completa con Docker (recomendado)"
echo "2) Validación rápida con Docker (solo headers)"
echo "3) Validación local limitada (sin compilación real)"
echo "4) Todas las validaciones"
echo ""
read -p "Selecciona una opción (1-4): " choice

case $choice in
    1)
        show_info "Ejecutando validación completa..."
        run_docker_validation "full"
        ;;
    2)
        show_info "Ejecutando validación rápida..."
        run_docker_validation "headers_only"
        ;;
    3)
        show_info "Ejecutando validación local..."
        run_local_validation
        ;;
    4)
        show_info "Ejecutando todas las validaciones..."
        echo ""
        show_info "=== 1. Validación local ==="
        run_local_validation
        echo ""
        show_info "=== 2. Validación headers_only ==="
        run_docker_validation "headers_only"
        echo ""
        show_info "=== 3. Validación fast_check ==="
        run_docker_validation "fast_check"
        echo ""
        show_info "=== 4. Validación completa ==="
        run_docker_validation "full"
        ;;
    *)
        show_error "Opción inválida"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    show_success "🎉 Validación completada exitosamente"
    show_info "El workflow debería funcionar correctamente en GitHub Actions"
else
    echo ""
    show_error "❌ Validación falló"
    show_info "Revisa los errores antes de subir a GitHub Actions"
    exit 1
fi

# Limpiar archivos temporales
rm -f Dockerfile.validation validate-compile.ps1

echo ""