#!/bin/bash

# Script de validación simple para RustDesk
echo "🔍 Validación simple del proyecto RustDesk"
echo "==========================================="
echo ""

ERRORS=0
SUCCESS=0

# Función para mostrar éxito
success() {
    echo "✅ $1"
    ((SUCCESS++))
}

# Función para mostrar error
error() {
    echo "❌ $1"
    ((ERRORS++))
}

echo "📁 Verificando archivos..."
echo "---------------------------"

# Verificar vcpkg.json
if [ -f "vcpkg.json" ]; then
    success "vcpkg.json existe"
    
    # Verificar dependencias
    if grep -q '"opus"' vcpkg.json; then
        success "Dependencia opus encontrada"
    else
        error "Dependencia opus no encontrada"
    fi
    
    if grep -q '"openssl"' vcpkg.json; then
        success "Dependencia openssl encontrada"
    else
        error "Dependencia openssl no encontrada"
    fi
else
    error "vcpkg.json no encontrado"
fi

# Verificar workflow
if [ -f ".github/workflows/build-rustdesk.yml" ]; then
    success "Workflow de GitHub Actions existe"
    
    if grep -q "VCPKG_INSTALLATION_ROOT" ".github/workflows/build-rustdesk.yml"; then
        success "Variable VCPKG_INSTALLATION_ROOT configurada"
    else
        error "Variable VCPKG_INSTALLATION_ROOT no configurada"
    fi
else
    error "Workflow de GitHub Actions no encontrado"
fi

# Verificar estructura
if [ -d ".github" ]; then
    success "Directorio .github existe"
else
    error "Directorio .github no existe"
fi

echo ""
echo "📊 Resumen:"
echo "✅ Éxitos: $SUCCESS"
echo "❌ Errores: $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "🎉 ¡Validación exitosa! El proyecto está listo."
    exit 0
else
    echo "💥 Se encontraron $ERRORS errores. Revisa la configuración."
    exit 1
fi