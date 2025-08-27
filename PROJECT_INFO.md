# RustDesk 客户端生成器 - 项目信息

## 项目详情
- **名称**: RustDesk 客户端生成器
- **描述**: 具有硬编码配置的自定义RustDesk客户端生成器
- **类型**: Web应用 (React + TypeScript + Vite + Tailwind CSS)
- **构建系统**: GitHub Actions
- **目标**: Windows可执行文件
- **当前版本**: v1.0.4
- **最后更新**: 2025-01-15

## GitHub配置
- **仓库**: rustdesk-client-generator-app
- **所有者**: gilberth
- **工作流文件**: build-rustdesk-final.yml
- **主分支**: main
- **工作流URL**: https://github.com/gilberth/rustdesk-client-generator-app/actions/workflows/build-rustdesk-final.yml

## 默认配置值

### 服务器
- **主机**: 10.10.10.202
- **密钥**: GfHkoiAEdUSVmf2E2ZhjsHLXdPY99NM59xyDemOwSBU=
- **字段**: RENDEZVOUS_SERVER, RELAY_SERVER, RS_PUB_KEY, API_SERVER

### 品牌配置  
- **应用名称**: GYTECH
- **公司**: GYTECH
- **可执行文件**: gytechrustdesk
- **产品**: RustDesk

### 构建
- **版本**: 1.0.2
- **便携版**: true
- **安装程序**: false
- **架构**: x86_64

## 工作流配置
- **基本输入限制**: 8 (GitHub Actions限制)
- **策略**: 通过config_json参数传递复杂配置
- **当前输入**: config_json, executable_name, rustdesk_branch, target_arch, enable_portable, include_installer, create_installer, enable_debug

## 关键文件
- **主要构建逻辑**: src/components/layout/GitHubBuildPanel.tsx
- **工作流**: .github/workflows/build-rustdesk-final.yml
- **配置类型**: src/types/config.ts
- **版本脚本**: scripts/bump-version.js
- **表单**: src/components/forms/*.tsx
- **备份信息**: BACKUP_INFO.md

## Rust映射
- RS_PUB_KEY → KEY
- RENDEZVOUS_SERVER → RENDEZVOUS_SERVER
- RELAY_SERVER → RELAY_SERVER
- API_SERVER → API_SERVER
- APP_NAME → APP_NAME
- PRODUCT_NAME → PRODUCT_NAME
- COMPANY_NAME → COMPANY_NAME

## 故障排除

### 工作流不执行
- **问题**: GitHub Actions workflow_dispatch有输入限制
- **解决方案**: 最多保留8个基本输入，使用config_json处理复杂数据
- **参考提交**: a91fd02

### 构建失败
- **问题**: 可执行文件名称映射、default-run目标不匹配、缺少inline.rs
- **解决方案**: 检查EXECUTABLE_NAME映射、更新default-run目标、生成inline.rs

### 令牌问题
- **问题**: GitHub令牌缺少权限
- **解决方案**: 令牌需要actions:write权限才能使用workflow dispatch

### 版本跟踪
- **解决方案**: 修改后使用npm run version:patch命令

## 实现状态
- ✅ 服务器配置: 100% 已实现
- ✅ 品牌配置: 100% 已实现  
- ✅ 安全配置: 100% 已实现
- ✅ 高级配置: 100% 已实现
- ✅ 构建配置: 100% 已实现
- ✅ 工作流兼容性: 100% 兼容
- ✅ Web界面: 所有选项均可用

## 重要提交
- **当前**: eee483f - 添加opencode.json到gitignore以防止删除
- **工作流修复**: 2aeb1a0 - 将工作流回滚到只有基本输入的工作版本
- **版本系统**: cfd8737 - 实现自动Web版本控制系统
- **上一个工作版本**: a91fd02 - 修复default-run目标和可执行文件搜索问题
- **完整实现**: 8cbcd64 - 完成所有Web界面选项的实现

## 开发命令
```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 预览
npm run preview

# 版本管理
npm run version:patch
npm run version:minor
npm run version:major
```