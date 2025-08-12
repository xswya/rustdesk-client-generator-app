#!/bin/bash

# Script de validación rápida para el workflow RustDesk
# Este script verifica la configuración básica sin Docker

set -e

echo "⚡ Validación rápida del workflow RustDesk"
echo "========================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0
SUCCESS=0

# Funciones de output
show_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

show_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS++))
}

show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "1. Verificando archivos de configuración..."
echo "-------------------------------------------"

# Verificar vcpkg.json
if [ -f "vcpkg.json" ]; then
    show_success "vcpkg.json encontrado"
    
    # Verificar que contiene dependencias básicas
    if grep -q '"opus"' vcpkg.json; then
        show_success "Dependencia opus encontrada"
    else
        show_error "Dependencia opus no encontrada"
    fi
    
    if grep -q '"libvpx"' vcpkg.json; then
        show_success "Dependencia libvpx encontrada"
    else
        show_error "Dependencia libvpx no encontrada"
    fi
    
    if grep -q '"openssl"' vcpkg.json; then
        show_success "Dependencia openssl encontrada"
    else
        show_error "Dependencia openssl no encontrada"
    fi
else
    show_error "vcpkg.json no encontrado"
fi

echo ""
echo "2. Verificando workflow de GitHub Actions..."
echo "--------------------------------------------"

# Verificar build-rustdesk.yml
if [ -f ".github/workflows/build-rustdesk.yml" ]; then
    show_success "build-rustdesk.yml encontrado"
    
    # Verificar pasos críticos
    if grep -q "install_vcpkg_dependencies" ".github/workflows/build-rustdesk.yml"; then
        show_success "Función install_vcpkg_dependencies encontrada"
    else
        show_error "Función install_vcpkg_dependencies no encontrada"
    fi
    
    if grep -q "VCPKG_INSTALLATION_ROOT" ".github/workflows/build-rustdesk.yml"; then
        show_success "Variable VCPKG_INSTALLATION_ROOT configurada"
    else
        show_error "Variable VCPKG_INSTALLATION_ROOT no configurada"
    fi
    
    if grep -q "vcpkg.json" ".github/workflows/build-rustdesk.yml"; then
        show_success "Referencia a vcpkg.json encontrada en workflow"
    else
        show_warning "No se encontró referencia a vcpkg.json en workflow"
    fi
else
    show_error "build-rustdesk.yml no encontrado"
fi

echo ""
echo "3. Verificando estructura del proyecto..."
echo "----------------------------------------"

# Verificar directorios importantes
if [ -d ".github" ]; then
    show_success "Directorio .github encontrado"
else
    show_error "Directorio .github no encontrado"
fi

if [ -d ".github/workflows" ]; then
    show_success "Directorio .github/workflows encontrado"
else
    show_error "Directorio .github/workflows no encontrado"
fi

if [ -d "scripts" ]; then
    show_success "Directorio scripts encontrado"
else
    show_warning "Directorio scripts no encontrado"
fi

echo ""
echo "4. Verificando herramientas de desarrollo..."
echo "--------------------------------------------"

# Verificar Git
if command -v git >/dev/null 2>&1; then
    show_success "Git está instalado"
else
    show_error "Git no está instalado"
fi

# Verificar conectividad a GitHub
if ping -c 1 github.com >/dev/null 2>&1; then
    show_success "Conectividad a GitHub OK"
else
    show_warning "No se puede conectar a GitHub"
fi

echo ""
echo "📊 Resumen de validación"
echo "========================"
echo -e "${GREEN}✅ Éxitos: $SUCCESS${NC}"
echo -e "${YELLOW}⚠️  Advertencias: $WARNINGS${NC}"
echo -e "${RED}❌ Errores: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Validación completada exitosamente!${NC}"
    echo "El workflow debería funcionar correctamente en GitHub Actions."
    exit 0
else
    echo -e "${RED}💥 Se encontraron $ERRORS errores críticos.${NC}"
    echo "Por favor, corrija estos errores antes de ejecutar el workflow."
    exit 1
fi