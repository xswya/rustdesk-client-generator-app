# GitHub Actions 自动编译配置指南

本文档将介绍如何配置你的GitHub仓库，以使用RustDesk自定义客户端的自动编译功能。

## 前提条件

1. **GitHub仓库**：确保此项目已上传到GitHub仓库
2. **个人访问令牌**：你需要一个具有特定权限的令牌
3. **GitHub Actions已启用**：仓库中必须启用GitHub Actions功能

## 步骤1：创建个人访问令牌

1. 前往GitHub → 设置 → 开发者设置 → 个人访问令牌 → 令牌（经典）
2. 点击"生成新令牌（经典）"
3. 为令牌配置以下权限：
   - ✅ `repo`（完全控制私有仓库）
   - ✅ `workflow`（更新GitHub Action工作流）
   - ✅ `actions`（访问GitHub Actions）

4. 复制生成的令牌（以`ghp_`开头）

## 步骤2：验证GitHub Actions

1. 访问你的GitHub仓库
2. 点击"Actions"标签
3. 如果未启用，请启用它
4. 确认你可以看到现有的工作流

## 步骤3：使用Web应用

1. 打开RustDesk客户端生成器的Web应用
2. 完成所有5个步骤的配置
3. 在最后一步，点击"自动编译"
4. 在弹出的模态框中：
   - **用户/组织**：你的GitHub用户名（例如：`你的用户名`）
   - **仓库名称**：此仓库的名称（例如：`rustdesk-client-generator`）
   - **GitHub令牌**：粘贴你在步骤1中创建的令牌

5. 点击"开始编译"

## 编译过程中会发生什么

GitHub Actions工作流将执行以下操作：

1. **下载RustDesk**：克隆官方RustDesk仓库
2. **应用你的配置**：使用你在Web应用中输入的数据
3. **编译客户端**：生成自定义可执行文件
4. **创建安装程序**：生成NSIS安装程序（可选）
5. **上传构件**：编译后的文件可供下载

## 生成的文件

编译成功后，你将获得以下文件：

- `{可执行文件名}.exe` - 自定义RustDesk客户端
- `{可执行文件名}.portable` - 标记便携模式的文件
- `{可执行文件名}-installer.exe` - 完整安装程序（如果启用）
- `release-info.json` - 编译信息

## 编译时间

- **预计时间**：15-30分钟
- **依赖项**：首次编译可能需要更长时间
- **监控**：你可以在GitHub Actions中实时查看进度

## 故障排除

### 错误："Repository not found"
- 确认用户名/组织和仓库名称正确
- 确保仓库是公开的，或者你的令牌有权访问

### 错误："Token invalid"
- 确认令牌正确且未过期
- 确保令牌具有所需的权限（`repo`、`workflow`、`actions`）

### 错误："Workflow not found"
- 确保`.github/workflows/build-rustdesk.yml`文件存在于你的仓库中
- 确认该文件位于`main`或`master`分支

### 编译失败
- 查看GitHub Actions中的日志以了解具体错误
- 确认你的配置有效
- 确保指定的服务器可访问

## 高级配置

### 自定义编译过程

你可以修改`.github/workflows/build-rustdesk.yml`工作流以：

- 更改基础RustDesk版本
- 添加额外的架构（ARM64）
- 自定义签名过程
- 修改编译选项

### 多平台编译

当前工作流仅编译Windows版本。要添加其他平台：

1. 复制`build-windows`任务
2. 将`runs-on`更改为`ubuntu-latest`（Linux）或`macos-latest`（macOS）
3. 根据平台调整编译命令

## 安全提示

- **切勿分享你的个人访问令牌**
- **使用具有最低必要权限的令牌**
- **考虑在自定义工作流中使用GitHub Secrets存储令牌**
- **定期检查令牌的权限**

## 支持

如果你遇到问题：

1. 查看本文档
2. 检查GitHub Actions日志
3. 确保你的配置有效
4. 查阅RustDesk官方文档