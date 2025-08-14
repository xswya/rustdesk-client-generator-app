# Backup Information - Fix para Default-Run Target Issue

## Problema Identificado
- **Error**: `default-run target rustdesk not found` en GitHub Actions
- **Causa**: Workflow cambia `name` en Cargo.toml pero no actualiza `default-run`
- **Trigger**: Ocurre cuando se cambia APP_NAME en la configuración de branding
- **Funciona**: Solo con servidor + clave pública (APP_NAME = "rustdesk")
- **Falla**: Cuando APP_NAME ≠ "rustdesk"

## Estado Antes del Fix
- **Commit actual**: `b3d8ee1` - "Fix NSIS installer error - add missing Uninstall section"
- **Fecha**: $(date)
- **Archivos a modificar**: `.github/workflows/build-rustdesk-final.yml`
- **Líneas problemáticas**: 184-190

## Código Original (líneas 184-190)
```powershell
if ($config.branding.APP_NAME -ne "rustdesk") {
    $cargoContent = $cargoContent -replace 'name = "rustdesk"', "name = `"$($config.branding.APP_NAME)`""
    Write-Host "[SUCCESS] Updated package name in Cargo.toml"
}
```

## Análisis del Problema
1. El workflow clona RustDesk correctamente
2. Aplica configuración personalizada
3. Modifica `name` en Cargo.toml si APP_NAME ≠ "rustdesk"
4. **NO actualiza** `default-run` target
5. Cargo build falla porque busca target "rustdesk" que ya no existe

## Solución Propuesta
Actualizar también el `default-run` target cuando se cambia el nombre del paquete.

## Para Restaurar
Si el fix causa problemas:
```bash
git reset --hard b3d8ee1
```

## Testing
- **Caso 1**: Solo servidor + clave → debe seguir funcionando
- **Caso 2**: APP_NAME personalizado → debe funcionar después del fix