# Script de PowerShell para aplicar configuración personalizada a RustDesk
# Autor: Generador de Clientes RustDesk
# Versión: 1.0.0

param(
    [Parameter(Mandatory=$true)]
    [string]$ConfigPath,
    
    [Parameter(Mandatory=$true)]
    [string]$RustDeskPath,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose
)

# Función para escribir logs
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    if ($Verbose) {
        Add-Content -Path "apply-config.log" -Value $logMessage
    }
}

# Función para validar archivos
function Test-FileExists {
    param([string]$Path, [string]$Description)
    if (-not (Test-Path $Path)) {
        Write-Log "Error: $Description no encontrado en: $Path" "ERROR"
        exit 1
    }
    Write-Log "$Description encontrado: $Path" "SUCCESS"
}

# Función para aplicar configuración de servidor
function Set-ServerConfig {
    param($config, $cargoTomlPath)
    
    Write-Log "Aplicando configuración de servidor..."
    
    $cargoContent = Get-Content $cargoTomlPath -Raw
    
    if ($config.server.RENDEZVOUS_SERVER) {
        Write-Log "Configurando servidor de encuentro: $($config.server.RENDEZVOUS_SERVER)"
        $cargoContent = $cargoContent -replace 'rendezvous_server\s*=\s*"[^"]*"', "rendezvous_server = `"$($config.server.RENDEZVOUS_SERVER)`""
    }
    
    if ($config.server.RS_PUB_KEY) {
        Write-Log "Configurando clave pública del servidor"
        $cargoContent = $cargoContent -replace 'rs_pub_key\s*=\s*"[^"]*"', "rs_pub_key = `"$($config.server.RS_PUB_KEY)`""
    }
    
    if ($config.server.API_SERVER) {
        Write-Log "Configurando servidor API: $($config.server.API_SERVER)"
        $cargoContent = $cargoContent -replace 'api_server\s*=\s*"[^"]*"', "api_server = `"$($config.server.API_SERVER)`""
    }
    
    Set-Content $cargoTomlPath -Value $cargoContent -Encoding UTF8
    Write-Log "Configuración de servidor aplicada correctamente"
}

# Función para aplicar configuración de seguridad
function Set-SecurityConfig {
    param($config, $configFilePath)
    
    Write-Log "Aplicando configuración de seguridad..."
    
    $configContent = @{}
    if (Test-Path $configFilePath) {
        $configContent = Get-Content $configFilePath | ConvertFrom-Json -AsHashtable
    }
    
    if ($config.security.PRESET_PASSWORD) {
        Write-Log "Configurando contraseña predefinida"
        $configContent["preset_password"] = $config.security.PRESET_PASSWORD
    }
    
    if ($config.security.ACCESS_KEY) {
        Write-Log "Configurando clave de acceso"
        $configContent["access_key"] = $config.security.ACCESS_KEY
    }
    
    # Configuraciones booleanas de seguridad
    $securityOptions = @{
        "PRESET_REMOVE_WALLPAPER" = "preset_remove_wallpaper"
        "PRESET_BLOCK_INPUT" = "preset_block_input"
        "PRESET_PRIVACY_MODE" = "preset_privacy_mode"
        "PRESET_RECORD_SESSION" = "preset_record_session"
    }
    
    foreach ($option in $securityOptions.GetEnumerator()) {
        if ($config.security.PSObject.Properties.Name -contains $option.Key) {
            $value = $config.security.($option.Key)
            if ($value -eq $true) {
                Write-Log "Habilitando: $($option.Value)"
                $configContent[$option.Value] = $true
            }
        }
    }
    
    # Guardar configuración
    $configContent | ConvertTo-Json -Depth 10 | Set-Content $configFilePath -Encoding UTF8
    Write-Log "Configuración de seguridad aplicada correctamente"
}

# Función para aplicar branding
function Set-BrandingConfig {
    param($config, $rustdeskPath)
    
    Write-Log "Aplicando configuración de branding..."
    
    # Buscar archivos de recursos
    $resourcesPath = Join-Path $rustdeskPath "res"
    if (-not (Test-Path $resourcesPath)) {
        New-Item -ItemType Directory -Path $resourcesPath -Force | Out-Null
    }
    
    # Aplicar nombre de aplicación
    if ($config.branding.APP_NAME) {
        Write-Log "Configurando nombre de aplicación: $($config.branding.APP_NAME)"
        $appConfigPath = Join-Path $resourcesPath "app.toml"
        $appConfig = @{
            name = $config.branding.APP_NAME
            company = $config.branding.COMPANY_NAME
            website = $config.branding.WEBSITE_URL
        }
        $appConfig | ConvertTo-Json | Set-Content $appConfigPath -Encoding UTF8
    }
    
    # Descargar recursos si se proporcionan URLs
    if ($config.branding.LOGO_URL) {
        Write-Log "Descargando logo desde: $($config.branding.LOGO_URL)"
        try {
            $logoPath = Join-Path $resourcesPath "logo.png"
            Invoke-WebRequest -Uri $config.branding.LOGO_URL -OutFile $logoPath
            Write-Log "Logo descargado correctamente"
        } catch {
            Write-Log "Error al descargar logo: $($_.Exception.Message)" "WARNING"
        }
    }
    
    if ($config.branding.ICON_URL) {
        Write-Log "Descargando icono desde: $($config.branding.ICON_URL)"
        try {
            $iconPath = Join-Path $resourcesPath "icon.ico"
            Invoke-WebRequest -Uri $config.branding.ICON_URL -OutFile $iconPath
            Write-Log "Icono descargado correctamente"
        } catch {
            Write-Log "Error al descargar icono: $($_.Exception.Message)" "WARNING"
        }
    }
    
    Write-Log "Configuración de branding aplicada correctamente"
}

# Función para aplicar configuración avanzada
function Set-AdvancedConfig {
    param($config, $configFilePath)
    
    Write-Log "Aplicando configuración avanzada..."
    
    $configContent = @{}
    if (Test-Path $configFilePath) {
        $configContent = Get-Content $configFilePath | ConvertFrom-Json -AsHashtable
    }
    
    # Configuraciones de red
    if ($config.advanced.CUSTOM_TCP_PORT) {
        Write-Log "Configurando puerto TCP personalizado: $($config.advanced.CUSTOM_TCP_PORT)"
        $configContent["custom_tcp_port"] = [int]$config.advanced.CUSTOM_TCP_PORT
    }
    
    if ($config.advanced.CUSTOM_UDP_PORT) {
        Write-Log "Configurando puerto UDP personalizado: $($config.advanced.CUSTOM_UDP_PORT)"
        $configContent["custom_udp_port"] = [int]$config.advanced.CUSTOM_UDP_PORT
    }
    
    if ($config.advanced.CUSTOM_STUN_SERVERS) {
        Write-Log "Configurando servidores STUN personalizados"
        $stunServers = $config.advanced.CUSTOM_STUN_SERVERS -split ','
        $configContent["custom_stun_servers"] = $stunServers | ForEach-Object { $_.Trim() }
    }
    
    # Configuraciones de video
    if ($config.advanced.DEFAULT_VIDEO_QUALITY) {
        Write-Log "Configurando calidad de video por defecto: $($config.advanced.DEFAULT_VIDEO_QUALITY)"
        $configContent["default_video_quality"] = $config.advanced.DEFAULT_VIDEO_QUALITY
    }
    
    if ($config.advanced.MAX_FPS) {
        Write-Log "Configurando FPS máximo: $($config.advanced.MAX_FPS)"
        $configContent["max_fps"] = [int]$config.advanced.MAX_FPS
    }
    
    # Configuraciones booleanas avanzadas
    $advancedOptions = @{
        "ENABLE_HARDWARE_CODEC" = "enable_hardware_codec"
        "ENABLE_DIRECT_IP_ACCESS" = "enable_direct_ip_access"
        "DISABLE_AUDIO" = "disable_audio"
        "ENABLE_FILE_TRANSFER" = "enable_file_transfer"
    }
    
    foreach ($option in $advancedOptions.GetEnumerator()) {
        if ($config.advanced.PSObject.Properties.Name -contains $option.Key) {
            $value = $config.advanced.($option.Key)
            if ($value -eq $true) {
                Write-Log "Habilitando: $($option.Value)"
                $configContent[$option.Value] = $true
            }
        }
    }
    
    # Guardar configuración
    $configContent | ConvertTo-Json -Depth 10 | Set-Content $configFilePath -Encoding UTF8
    Write-Log "Configuración avanzada aplicada correctamente"
}

# Función principal
function Main {
    Write-Log "=== Iniciando aplicación de configuración personalizada ===" "INFO"
    Write-Log "Archivo de configuración: $ConfigPath"
    Write-Log "Directorio RustDesk: $RustDeskPath"
    
    # Validar archivos de entrada
    Test-FileExists $ConfigPath "Archivo de configuración"
    Test-FileExists $RustDeskPath "Directorio RustDesk"
    
    # Cargar configuración
    try {
        $config = Get-Content $ConfigPath | ConvertFrom-Json
        Write-Log "Configuración cargada correctamente"
    } catch {
        Write-Log "Error al cargar configuración: $($_.Exception.Message)" "ERROR"
        exit 1
    }
    
    # Rutas importantes
    $cargoTomlPath = Join-Path $RustDeskPath "Cargo.toml"
    $configFilePath = Join-Path $RustDeskPath "rustdesk.json"
    
    # Aplicar configuraciones
    try {
        if ($config.server) {
            Set-ServerConfig $config $cargoTomlPath
        }
        
        if ($config.security) {
            Set-SecurityConfig $config $configFilePath
        }
        
        if ($config.branding) {
            Set-BrandingConfig $config $RustDeskPath
        }
        
        if ($config.advanced) {
            Set-AdvancedConfig $config $configFilePath
        }
        
        Write-Log "=== Configuración aplicada exitosamente ===" "SUCCESS"
        
    } catch {
        Write-Log "Error durante la aplicación de configuración: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}

# Ejecutar función principal
Main