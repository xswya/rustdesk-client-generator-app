# RustDesk Client Generator - Project Information

## Project Details
- **Name**: RustDesk Client Generator
- **Description**: Generador de clientes RustDesk personalizados con configuración hardcodeada
- **Type**: Web App (React + TypeScript + Vite + Tailwind CSS)
- **Build System**: GitHub Actions
- **Target**: Windows executables
- **Current Version**: v1.0.4
- **Last Update**: 2025-01-15

## GitHub Configuration
- **Repository**: rustdesk-client-generator-app
- **Owner**: gilberth
- **Workflow File**: build-rustdesk-final.yml
- **Main Branch**: main
- **Workflow URL**: https://github.com/gilberth/rustdesk-client-generator-app/actions/workflows/build-rustdesk-final.yml

## Default Configuration Values

### Server
- **Host**: 10.10.10.202
- **Key**: GfHkoiAEdUSVmf2E2ZhjsHLXdPY99NM59xyDemOwSBU=
- **Fields**: RENDEZVOUS_SERVER, RELAY_SERVER, RS_PUB_KEY, API_SERVER

### Branding  
- **App Name**: GYTECH
- **Company**: GYTECH
- **Executable**: gytechrustdesk
- **Product**: RustDesk

### Build
- **Version**: 1.0.2
- **Portable**: true
- **Installer**: false
- **Architecture**: x86_64

## Workflow Configuration
- **Basic Inputs Limit**: 8 (GitHub Actions limit)
- **Strategy**: Pass complex config via config_json parameter
- **Current Inputs**: config_json, executable_name, rustdesk_branch, target_arch, enable_portable, include_installer, create_installer, enable_debug

## Key Files
- **Main Build Logic**: src/components/layout/GitHubBuildPanel.tsx
- **Workflow**: .github/workflows/build-rustdesk-final.yml
- **Config Types**: src/types/config.ts
- **Version Script**: scripts/bump-version.js
- **Forms**: src/components/forms/*.tsx
- **Backup Info**: BACKUP_INFO.md

## Rust Mappings
- RS_PUB_KEY → KEY
- RENDEZVOUS_SERVER → RENDEZVOUS_SERVER
- RELAY_SERVER → RELAY_SERVER
- API_SERVER → API_SERVER
- APP_NAME → APP_NAME
- PRODUCT_NAME → PRODUCT_NAME
- COMPANY_NAME → COMPANY_NAME

## Troubleshooting

### Workflow Not Executing
- **Problem**: GitHub Actions workflow_dispatch has input limits
- **Solution**: Keep to 8 basic inputs max, use config_json for complex data
- **Reference Commit**: a91fd02

### Build Fails
- **Problems**: Executable name mapping, default-run target mismatch, missing inline.rs
- **Solutions**: Check EXECUTABLE_NAME mapping, update default-run target, generate inline.rs

### Token Issues
- **Problem**: GitHub token lacks permissions
- **Solution**: Token needs actions:write scope for workflow dispatch

### Version Tracking
- **Solution**: Use npm run version:patch after changes

## Implementation Status
- ✅ Server Config: 100% implemented
- ✅ Branding Config: 100% implemented  
- ✅ Security Config: 100% implemented
- ✅ Advanced Config: 100% implemented
- ✅ Build Config: 100% implemented
- ✅ Workflow Compatibility: 100% compatible
- ✅ Web Interface: All options active

## Important Commits
- **Current**: eee483f - Add opencode.json to gitignore to prevent deletion
- **Workflow Fix**: 2aeb1a0 - Revert workflow to working version with only basic inputs
- **Version System**: cfd8737 - Implement automatic web versioning system
- **Last Working**: a91fd02 - Fix default-run target and executable search issues
- **Full Implementation**: 8cbcd64 - Complete implementation of all web interface options

## Development Commands
```bash
# Development
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Preview
npm run preview

# Version management
npm run version:patch
npm run version:minor
npm run version:major
```