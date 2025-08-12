A continuación tienes un prompt listo para usar con una IA generativa que debe producir:
	1.	Una aplicación web (formulario + validación) que recopile todos los parámetros personalizables del cliente de RustDesk.
	2.	Un workflow de GitHub Actions que tome esos parámetros como inputs/artefactos y construya el cliente con “hardcode” de servidor/clave (y opciones avanzadas), publicando los binarios como artefactos.
Incluye instrucciones y requisitos técnicos, más los campos clave soportados por la documentación de RustDesk para hardcode y configuración avanzada.
Copia todo el texto siguiente y pégalo en tu IA de preferencia.
Objetivo:Diseña un proyecto completo que incluya:
	•	Una web estática/SPA con formulario para capturar configuración de cliente RustDesk.
	•	Validación y ayuda contextual por campo.
	•	Exportación de la configuración en formato JSON y .env para CI.
	•	Un workflow de GitHub Actions que consuma esa configuración, compile el cliente de RustDesk con hardcode de servidor/clave y aplique ajustes avanzados predefinidos, subiendo los .exe/.msi como artefactos.
Entregables:
	1.	Código fuente de la web (React o Svelte o Vue) con:
	•	Formulario dividido en secciones: Servidor, Seguridad, Branding, Opciones avanzadas, Salida/Build.
	•	Validación y tooltips.
	•	Botón “Exportar” que genere:
	•	config.json (estructura detallada abajo).
	•	.env.example con pares clave=valor.
	•	Instrucciones de despliegue (README) para servir como sitio estático.
	2.	Un archivo .github/workflows/build-windows.yml que:
	•	Permita ejecución manual (workflow_dispatch) y por push.
	•	Cargue variables desde Secrets/Variables del repo y/o suba config.json como artifact y lo lea.
	•	Prepare el entorno (Flutter estable, Rust stable MSVC, Ninja, LLVM).
	•	Compile el cliente Windows Release.
	•	Ejecute el empaquetado usando los scripts del repo oficial si están disponibles.
	•	Publique artefactos (.exe/.msi).
	3.	Script utilitario (scripts/apply-config.ps1|py|sh) que:
	•	Lea config.json.
	•	Exporte como variables de entorno las claves de hardcode (RENDEZVOUS_SERVER, RS_PUB_KEY, API_SERVER).
	•	Genere archivos o parámetros necesarios para aplicar opciones avanzadas compatibles en build.
	4.	README con pasos claros:
	•	Cómo usar la web.
	•	Cómo cargar Secrets/Variables en GitHub.
	•	Cómo disparar el workflow y dónde encontrar artefactos.
	•	Notas y troubleshooting.
Campos y comportamiento requeridos:A) Sección “Servidor (hardcode)”
	•	RENDEZVOUS_SERVER (obligatorio): dominio sin protocolo ni puerto, p.ej. hbbs.midominio.com. Validar FQDN.
	•	RS_PUB_KEY (obligatorio): clave pública en Base64 del servidor (id_ed25519.pub). Validar Base64.
	•	API_SERVER (opcional): URL base del API (recomendado HTTPS, sin puerto si va detrás de proxy), p.ej. https://hbbs.midominio.com.Reglas:
	•	Si se define RENDEZVOUS_SERVER o RS_PUB_KEY, se deben definir ambos; advertir que el ejecutable no funcionará si falta uno.
	•	Mostrar ayuda contextual: dónde obtener la clave pública, puertos típicos y recomendación de HTTPS detrás de Nginx.
	•	Referencia documental para el usuario final en tooltips: “Hardcoding Custom Settings” y “Client Configuration”. Cita en tooltips con textos “ver documentación oficial”.
B) Sección “Seguridad”
	•	Enforzar “Encrypted only” (checkbox).
	•	Política de clipboard: opciones para deshabilitar completamente o establecer unidireccionalidad (entrante/saliente).
	•	Transferencia de archivos: deshabilitar o unidireccional.
	•	Grabar sesiones automáticamente (incoming/outgoing).
	•	Requerir login por defecto (si aplica).Nota: Advertir que algunas políticas avanzadas están más integradas en Pro; en OSS pueden requerir mapeo a las “Advanced Settings” del cliente.
C) Sección “Branding”
	•	Nombre de producto mostrado.
	•	Icono y logos (oscuro/claro) como upload de imágenes; la aplicación solo debe preparar assets y un paso de reemplazo en build, sin firmar el binario.
	•	Colores primarios/tema.Notas:
	•	Señalar que en OSS se reemplazan assets en el proyecto Flutter; Pro ofrece generador con branding desde consola.
D) Sección “Opciones avanzadas” (mapear a “Advanced Settings”)Incluir checkboxes/campos para los más usados; cada entrada debe mapearse a clave=valor en config.json:
	•	theme: system/dark/light.
	•	lang: es (u otro).
	•	allow-auto-record-incoming: Y/N.
	•	allow-auto-record-outgoing: Y/N (si aplica).
	•	enable-directx-capture (Windows controlado): Y/N.
	•	disable-clipboard: Y/N.
	•	one-way-clipboard-redirection: Y/N.
	•	one-way-file-transfer: Y/N.
	•	allow-remote-cm-modification: Y/N.Agregar campo libre “custom_kv” para pares adicionales clave=valor por si se añaden nuevas opciones en el futuro.Notas:
	•	Indicar que el set completo de “Advanced Settings” evoluciona y que algunas requieren versiones mínimas del cliente.
E) Sección “Salida/Build”
	•	Plataforma objetivo inicial: Windows x64.
	•	Tipo de salida: portable .exe y/o instalador .msi si el script oficial lo soporta.
	•	Opción de “publicar como Release” con tag semántico (vX.Y.Z) y “draft: true”.
	•	Flag “subir artefactos a Actions”.
Estructura de config.json (ejemplo):{“server”: {“RENDEZVOUS_SERVER”: “hbbs.midominio.com”,“RS_PUB_KEY”: “OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw=”,“API_SERVER”: “https://hbbs.midominio.com”},“security”: {“encrypted_only”: true,“require_login”: true,“clipboard”: {“disabled”: true,“one_way”: “controller_to_controlled” // valores: none, controller_to_controlled, controlled_to_controller},“file_transfer”: {“mode”: “disabled” // valores: disabled, one_way_to_controlled, one_way_to_controller, bidirectional},“recording”: {“auto_incoming”: false,“auto_outgoing”: false}},“branding”: {“product_name”: “MiRustDesk”,“logo_light”: “assets/logo_light.png”,“logo_dark”: “assets/logo_dark.png”,“icon_win_ico”: “assets/app.ico”,“theme_color”: “#0a84ff”},“advanced”: {“theme”: “system”,“lang”: “es”,“enable_directx_capture”: true,“disable_clipboard”: true,“one_way_clipboard_redirection”: true,“one_way_file_transfer”: true,“allow_remote_cm_modification”: false,“custom_kv”: {“keep-screen-on”: “during-controlled”}},“build”: {“platform”: “windows-x64”,“artifacts”: “exe”, “msi”,“publish_release”: false,“upload_artifacts”: true,“version”: “v1.0.0”}}
Workflow de GitHub Actions requerido (build-windows.yml):
	•	Disparadores: workflow_dispatch y push a main.
	•	Inputs opcionales en workflow_dispatch para RENDEZVOUS_SERVER, RS_PUB_KEY, API_SERVER; si no vienen, leer de repo variables/secrets o del artifact config.json.
	•	Pasos:
	1.	Checkout con submodules: true.
	2.	Setup Flutter estable.
	3.	Setup Rust toolchain stable con target x86_64-pc-windows-msvc.
	4.	Instalar deps (ninja, llvm, vswhere, python, pip deps del repo).
	5.	Descargar artifact config.json si fue subido por la web (o leer del repo).
	6.	Ejecutar scripts/apply-config.ps1 para exportar variables:
	•	RENDEZVOUS_SERVER -> env
	•	RS_PUB_KEY -> env
	•	API_SERVER -> envAdemás, generar un archivo .toml o .json intermedio con advanced settings para que los scripts de build puedan inyectarlos en assets/config o en flags soportados por el proyecto.
	7.	Compilar Flutter app Windows Release (flutter build windows –release).
	8.	Empaquetar con build.py si existe, con flags para portable y sin firma.
	9.	Upload de artefactos (.exe/.msi) y, si publish_release==true, crear Release draft con upload.
Notas y consideraciones importantes:
	•	Señalar explícitamente que, según la documentación oficial, para hardcode se usan variables de entorno RENDEZVOUS_SERVER y RS_PUB_KEY, y que API_SERVER es opcional pero recomendable con HTTPS detrás de Nginx para la consola/API.
	•	Aclarar que si se setea uno de RENDEZVOUS_SERVER/RS_PUB_KEY sin el otro, el ejecutable no funcionará.
	•	Incluir en README una sección “Limitaciones conocidas”:
	•	Algunas versiones reportan problemas intermitentes con RS_PUB_KEY vía Actions; si falla, limpiar caché de configuración en el host de prueba y verificar que efectivamente se inyectaron variables en tiempo de compilación.
	•	Advanced Settings pueden cambiar entre versiones; mapear lo más estable y dejar un bloque custom_kv para extensiones.
	•	Añadir sección “Troubleshooting”:
	•	Verificar que el binario construido sea el más reciente (no cache).
	•	Limpiar %AppData%\RustDesk y rutas de servicio al probar en Windows si hay conflictos con instalaciones previas.
	•	Confirmar conectividad a puertos típicos del servidor (21114-21119, 21116 UDP) y clave pública correcta.
Estilo y UX de la web:
	•	UI limpia con pasos arriba: 1) Servidor, 2) Seguridad, 3) Branding, 4) Avanzado, 5) Build.
	•	Tooltips con texto de ayuda y ejemplos.
	•	Validaciones inline.
	•	Botones: Guardar borrador (localStorage), Exportar config.json, Exportar .env.example, Descargar assets comprimidos (logos/icono) con estructura esperada.
	•	Sección de “Guía rápida” con check-list previo al build.
Lenguaje y stack sugeridos:
	•	Frontend: React + Vite, TypeScript, UI simple (Chakra UI o Tailwind).
	•	Scripts: PowerShell (.ps1) para Windows runner, Python opcional para utilidades cross-platform.
	•	Sin backend: todo cliente/estático; la exportación produce config.json y .env.example.
Pruebas:
	•	Entregar un ejemplo de config.json de muestra y un run del workflow en modo dry-run (sin firmar).
	•	Proveer un componente de previsualización de branding (logo claro/oscuro, color primario).
Resultado esperado:
	•	Un repositorio listo para clonar con la web de configuración, el workflow de Actions funcional y documentación clara para que un ingeniero pueda:
	1.	Completar el formulario web y exportar config.json.
	2.	Subir config.json como artifact o commitearlo en el repo.
	3.	Ejecutar el workflow y descargar los artefactos .exe/.msi.
	4.	Verificar que el cliente viene con servidor/clave hardcodeados y ajustes avanzados por defecto.