# Script para debug de configuración RustDesk
# Analiza el JSON de configuración que se está enviando

param(
    [Parameter(Mandatory=$false)]
    [string]$ConfigJson = ""
)

Write-Host "=== DEBUG: Analizando configuración de RustDesk ==="

# Si no se proporciona JSON, crear uno de ejemplo
if (-not $ConfigJson) {
    $ConfigJson = @'
{
  "server": {
    "RENDEZVOUS_SERVER": "test.example.com",
    "RELAY_SERVER": "",
    "RS_PUB_KEY": "test123key",
    "API_SERVER": ""
  },
  "branding": {
    "APP_NAME": "TestRustDesk",
    "PRODUCT_NAME": "Test RustDesk"
  }
}
'@
}

Write-Host "JSON recibido:"
Write-Host $ConfigJson
Write-Host ""

try {
    $config = $ConfigJson | ConvertFrom-Json
    
    Write-Host "=== Análisis de Configuración ==="
    Write-Host "Server Section:"
    Write-Host "  RENDEZVOUS_SERVER: '$($config.server.RENDEZVOUS_SERVER)'"
    Write-Host "  RELAY_SERVER: '$($config.server.RELAY_SERVER)'"
    Write-Host "  RS_PUB_KEY: '$($config.server.RS_PUB_KEY)'"
    Write-Host "  API_SERVER: '$($config.server.API_SERVER)'"
    Write-Host "  KEY (legacy): '$($config.server.KEY)'"
    
    Write-Host ""
    Write-Host "Branding Section:"
    Write-Host "  APP_NAME: '$($config.branding.APP_NAME)'"
    Write-Host "  PRODUCT_NAME: '$($config.branding.PRODUCT_NAME)'"
    
    Write-Host ""
    Write-Host "=== Verificación de Configuración Mínima ==="
    
    $issues = @()
    
    if (-not $config.server.RENDEZVOUS_SERVER) {
        $issues += "RENDEZVOUS_SERVER está vacío"
    }
    
    if (-not $config.server.RS_PUB_KEY -and -not $config.server.KEY) {
        $issues += "Falta RS_PUB_KEY o KEY"
    }
    
    if (-not $config.branding.APP_NAME) {
        $issues += "APP_NAME está vacío"
    }
    
    if ($issues.Count -eq 0) {
        Write-Host "✅ Configuración válida"
    } else {
        Write-Host "❌ Problemas encontrados:"
        foreach ($issue in $issues) {
            Write-Host "  - $issue"
        }
    }
    
    Write-Host ""
    Write-Host "=== Generando config.rs simulado ==="
    
    $keyValue = if ($config.server.RS_PUB_KEY) { $config.server.RS_PUB_KEY } else { $config.server.KEY }
    
    $rustConfig = @"
// Auto-generated configuration
pub const RENDEZVOUS_SERVER: &str = "$($config.server.RENDEZVOUS_SERVER)";
pub const RELAY_SERVER: &str = "$($config.server.RELAY_SERVER)";
pub const API_SERVER: &str = "$($config.server.API_SERVER)";
pub const KEY: &str = "$keyValue";
pub const PRODUCT_NAME: &str = "$($config.branding.PRODUCT_NAME)";
pub const APP_NAME: &str = "$($config.branding.APP_NAME)";
"@
    
    Write-Host $rustConfig
    
} catch {
    Write-Host "❌ Error al parsear JSON: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "=== Fin del análisis ==="