# Configuración de GitHub Actions para Compilación Automática

Este documento explica cómo configurar tu repositorio de GitHub para usar la compilación automática de clientes RustDesk personalizados.

## Requisitos Previos

1. **Repositorio en GitHub**: Asegúrate de que este proyecto esté subido a un repositorio de GitHub
2. **Personal Access Token**: Necesitas un token con permisos específicos
3. **GitHub Actions habilitado**: Debe estar habilitado en tu repositorio

## Paso 1: Crear un Personal Access Token

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Haz clic en "Generate new token (classic)"
3. Configura el token con los siguientes permisos:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `actions` (Access to GitHub Actions)

4. Copia el token generado (empieza con `ghp_`)

## Paso 2: Verificar GitHub Actions

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña "Actions"
3. Si no está habilitado, habilítalo
4. Verifica que puedes ver los workflows existentes

## Paso 3: Usar la Aplicación Web

1. Abre la aplicación web del generador de clientes RustDesk
2. Completa toda la configuración en los 5 pasos
3. En el paso final, haz clic en "Compilar Automáticamente"
4. En el modal que se abre:
   - **Usuario/Organización**: Tu nombre de usuario de GitHub (ej: `tu-usuario`)
   - **Nombre del Repositorio**: El nombre de este repositorio (ej: `rustdesk-client-generator`)
   - **Token de GitHub**: Pega el token que creaste en el Paso 1

5. Haz clic en "Iniciar Compilación"

## Qué Sucede Durante la Compilación

El workflow de GitHub Actions:

1. **Descarga RustDesk**: Clona el repositorio oficial de RustDesk
2. **Aplica tu configuración**: Usa los datos que ingresaste en la aplicación web
3. **Compila el cliente**: Genera el ejecutable personalizado
4. **Crea instalador**: Genera un instalador NSIS (opcional)
5. **Sube artefactos**: Los archivos compilados quedan disponibles para descarga

## Archivos Generados

Después de la compilación exitosa, encontrarás:

- `{nombre-ejecutable}.exe` - El cliente RustDesk personalizado
- `{nombre-ejecutable}.portable` - Archivo que marca el modo portable
- `{nombre-ejecutable}-installer.exe` - Instalador completo (si está habilitado)
- `release-info.json` - Información sobre la compilación

## Tiempo de Compilación

- **Tiempo estimado**: 15-30 minutos
- **Dependencias**: La primera compilación puede tomar más tiempo
- **Monitoreo**: Puedes ver el progreso en tiempo real en GitHub Actions

## Solución de Problemas

### Error: "Repository not found"
- Verifica que el nombre del usuario/organización y repositorio sean correctos
- Asegúrate de que el repositorio sea público o que tu token tenga acceso

### Error: "Token invalid"
- Verifica que el token sea correcto y no haya expirado
- Asegúrate de que el token tenga los permisos necesarios (`repo`, `workflow`, `actions`)

### Error: "Workflow not found"
- Asegúrate de que el archivo `.github/workflows/build-rustdesk.yml` esté en tu repositorio
- Verifica que el archivo esté en la rama `main` o `master`

### Compilación falla
- Revisa los logs en GitHub Actions para ver el error específico
- Verifica que tu configuración sea válida
- Asegúrate de que los servidores especificados sean accesibles

## Configuración Avanzada

### Personalizar la Compilación

Puedes modificar el workflow `.github/workflows/build-rustdesk.yml` para:

- Cambiar la versión de RustDesk base
- Agregar arquitecturas adicionales (ARM64)
- Personalizar el proceso de firma
- Modificar las opciones de compilación

### Compilación para Múltiples Plataformas

El workflow actual compila solo para Windows. Para agregar otras plataformas:

1. Duplica el job `build-windows`
2. Cambia `runs-on` a `ubuntu-latest` (Linux) o `macos-latest` (macOS)
3. Ajusta los comandos de compilación según la plataforma

## Seguridad

- **Nunca compartas tu Personal Access Token**
- **Usa tokens con permisos mínimos necesarios**
- **Considera usar GitHub Secrets para tokens en workflows personalizados**
- **Revisa regularmente los permisos de tus tokens**

## Soporte

Si encuentras problemas:

1. Revisa este documento
2. Verifica los logs de GitHub Actions
3. Asegúrate de que tu configuración sea válida
4. Consulta la documentación oficial de RustDesk