#!/bin/bash

# Script de validación completa para RustDesk
# Verifica todos los aspectos críticos del proyecto antes de ejecutar en GitHub Actions

set -e

echo "🚀 Validación completa del proyecto RustDesk"
echo "============================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0
SUCCESS=0

# Funciones de output
success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

section() {
    echo ""
    echo -e "${BLUE}📋 $1${NC}"
    echo "$(printf '%*s' ${#1} '' | tr ' ' '-')"
}

# 1. Verificación de archivos de configuración
section "1. Archivos de configuración"

# Verificar vcpkg.json
if [ -f "vcpkg.json" ]; then
    success "vcpkg.json encontrado"
    
    # Verificar dependencias críticas
    critical_deps=("opus" "libvpx" "openssl" "zlib")
    for dep in "${critical_deps[@]}"; do
        if grep -q "\"$dep\"" vcpkg.json; then
            success "Dependencia crítica $dep encontrada"
        else
            error "Dependencia crítica $dep no encontrada"
        fi
    done
    
    # Verificar dependencias opcionales
    optional_deps=("libyuv" "libsodium" "protobuf")
    for dep in "${optional_deps[@]}"; do
        if grep -q "\"$dep\"" vcpkg.json; then
            success "Dependencia opcional $dep encontrada"
        else
            warning "Dependencia opcional $dep no encontrada"
        fi
    done
    
    # Verificar baseline
    if grep -q "builtin-baseline" vcpkg.json; then
        baseline=$(grep "builtin-baseline" vcpkg.json | cut -d'"' -f4)
        success "Baseline configurado: $baseline"
    else
        warning "No se encontró builtin-baseline"
    fi
else
    error "vcpkg.json no encontrado"
fi

# 2. Verificación del workflow de GitHub Actions
section "2. Workflow de GitHub Actions"

workflow_file=".github/workflows/build-rustdesk.yml"
if [ -f "$workflow_file" ]; then
    success "Workflow encontrado: $workflow_file"
    
    # Verificar configuración de Windows
    if grep -q "windows-latest" "$workflow_file"; then
        success "Configurado para Windows"
    else
        error "No está configurado para Windows"
    fi
    
    # Verificar variables de entorno críticas
    critical_env_vars=("VCPKG_INSTALLATION_ROOT" "VCPKG_DEFAULT_TRIPLET")
    for var in "${critical_env_vars[@]}"; do
        if grep -q "$var" "$workflow_file"; then
            success "Variable de entorno $var configurada"
        else
            error "Variable de entorno $var no configurada"
        fi
    done
    
    # Verificar pasos críticos
    critical_steps=("install_vcpkg_dependencies" "vcpkg.json" "Build RustDesk")
    for step in "${critical_steps[@]}"; do
        if grep -q "$step" "$workflow_file"; then
            success "Paso crítico encontrado: $step"
        else
            error "Paso crítico no encontrado: $step"
        fi
    done
    
    # Verificar configuración de vcpkg
    if grep -q "VCPKG_FEATURE_FLAGS" "$workflow_file"; then
        success "Flags de vcpkg configurados"
    else
        warning "Flags de vcpkg no configurados"
    fi
else
    error "Workflow no encontrado: $workflow_file"
fi

# 3. Verificación de estructura del proyecto
section "3. Estructura del proyecto"

# Verificar directorios esenciales
essential_dirs=(".github" ".github/workflows" "scripts")
for dir in "${essential_dirs[@]}"; do
    if [ -d "$dir" ]; then
        success "Directorio encontrado: $dir"
    else
        if [ "$dir" = "scripts" ]; then
            warning "Directorio opcional no encontrado: $dir"
        else
            error "Directorio esencial no encontrado: $dir"
        fi
    fi
done

# Verificar archivos problemáticos
if find . -name "*2.*" -o -name "* 2.*" | grep -q .; then
    warning "Se encontraron archivos duplicados que podrían causar problemas"
    find . -name "*2.*" -o -name "* 2.*" | head -3 | while read -r file; do
        echo "  - $file"
    done
else
    success "No se encontraron archivos duplicados problemáticos"
fi

# 4. Verificación de herramientas
section "4. Herramientas de desarrollo"

# Git
if command -v git >/dev/null 2>&1; then
    git_version=$(git --version | cut -d' ' -f3)
    success "Git instalado: v$git_version"
else
    error "Git no está instalado"
fi

# Rust (opcional para validación local)
if command -v rustc >/dev/null 2>&1; then
    rust_version=$(rustc --version | cut -d' ' -f2)
    success "Rust instalado: v$rust_version"
else
    info "Rust no instalado localmente (se instalará en GitHub Actions)"
fi

# 5. Verificación de conectividad
section "5. Conectividad"

# GitHub
if ping -c 1 github.com >/dev/null 2>&1; then
    success "Conectividad a GitHub OK"
else
    warning "Problemas de conectividad a GitHub"
fi

# Verificar acceso al repositorio RustDesk
if git ls-remote https://github.com/rustdesk/rustdesk.git >/dev/null 2>&1; then
    success "Acceso al repositorio RustDesk OK"
else
    error "No se puede acceder al repositorio RustDesk"
fi

# 6. Verificaciones adicionales de seguridad
section "6. Verificaciones de seguridad"

# Verificar que no hay secretos expuestos
if grep -r "password\|secret\|key\|token" . --exclude-dir=.git --exclude="*.sh" >/dev/null 2>&1; then
    warning "Se encontraron posibles secretos en el código (revisar manualmente)"
else
    success "No se detectaron secretos obvios en el código"
fi

# Verificar permisos de archivos
if find . -type f -perm +111 -name "*.sh" | grep -q .; then
    success "Scripts tienen permisos de ejecución"
else
    warning "Algunos scripts podrían no tener permisos de ejecución"
fi

# Resumen final
echo ""
echo "═══════════════════════════════════════════════════════════════"
info "RESUMEN DE VALIDACIÓN COMPLETA"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Verificaciones exitosas: $SUCCESS${NC}"
echo -e "${YELLOW}⚠️  Advertencias: $WARNINGS${NC}"
echo -e "${RED}❌ Errores críticos: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 VALIDACIÓN COMPLETA EXITOSA${NC}"
    echo ""
    info "El proyecto está listo para ejecutarse en GitHub Actions."
    echo ""
    info "Recomendaciones para la ejecución:"
    echo "  1. Ejecuta primero con 'headers_only_mode: true'"
    echo "  2. Si pasa, prueba con 'fast_check_mode: true'"
    echo "  3. Finalmente, ejecuta la compilación completa"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        warning "Nota: Hay $WARNINGS advertencias que deberías revisar"
    fi
    exit 0
else
    echo -e "${RED}💥 VALIDACIÓN FALLÓ${NC}"
    echo ""
    error "Se encontraron $ERRORS errores críticos que deben corregirse."
    echo ""
    info "Acciones recomendadas:"
    echo "  - Revisa los errores mostrados arriba"
    echo "  - Corrige la configuración de vcpkg y el workflow"
    echo "  - Ejecuta este script nuevamente antes de subir a GitHub"
    echo ""
    exit 1
fi