# 项目需求说明
	1.	一个Web应用（表单+验证），用于收集RustDesk客户端的所有可自定义参数。
	2.	一个GitHub Actions工作流，将这些参数作为输入/工件，并构建带有服务器/密钥（和高级选项）硬编码的客户端，将二进制文件作为工件发布。
包含技术说明和要求，以及RustDesk文档支持的硬编码和高级配置关键字段。
复制以下所有文本并粘贴到你偏好的AI中。
目标：设计一个完整的项目，包含：
	•	一个带有表单的静态网站/SPA，用于捕获RustDesk客户端配置。
	•	每个字段的验证和上下文帮助。
	•	以JSON和.env格式导出配置，用于CI。
	•	一个GitHub Actions工作流，消费该配置，编译带有服务器/密钥硬编码的RustDesk客户端，并应用预定义的高级设置，将.exe/.msi作为工件上传。
交付物：
	1.	Web的源代码（React或Svelte或Vue），包含：
	•	表单分为几个部分：服务器、安全、品牌、高级选项、输出/构建。
	•	验证和提示框。
	•	"导出"按钮，生成：
	•	config.json（下面有详细结构）。
	•	带有键值对的.env.example。
	•	作为静态网站部署的说明（README）。
	2.	一个.github/workflows/build-windows.yml文件，该文件：
	•	允许手动执行（workflow_dispatch）和通过推送触发。
	•	从仓库的Secrets/Variables加载变量和/或上传config.json作为构件并读取它。
	•	准备环境（稳定的Flutter、稳定的Rust MSVC、Ninja、LLVM）。
	•	编译Windows Release客户端。
	•	如果官方仓库中有可用脚本，则使用它们进行打包。
	•	发布构件（.exe/.msi）。
	3.	实用脚本（scripts/apply-config.ps1|py|sh），该脚本：
	•	读取config.json。
	•	将硬编码密钥（RENDEZVOUS_SERVER、RS_PUB_KEY、API_SERVER）导出为环境变量。
	•	生成在构建中应用兼容的高级选项所需的文件或参数。
	4.	带有明确步骤的README：
	•	如何使用Web界面。
	•	如何在GitHub中加载Secrets/Variables。
	•	如何触发工作流以及在哪里找到构件。
	•	注意事项和故障排除。
所需字段和行为：A) "服务器（硬编码）"部分
	•	RENDEZVOUS_SERVER（必需）：没有协议或端口的域名，例如hbbs.midominio.com。验证FQDN。
	•	RS_PUB_KEY（必需）：服务器的Base64公钥（id_ed25519.pub）。验证Base64。
	•	API_SERVER（可选）：API的基础URL（推荐HTTPS，如果在代理后则不需要端口），例如https://hbbs.midominio.com。规则：
	•	如果定义了RENDEZVOUS_SERVER或RS_PUB_KEY，则必须同时定义两者；警告如果缺少一个，可执行文件将无法工作。
	•	显示上下文帮助：在哪里获取公钥、典型端口以及在Nginx后面使用HTTPS的建议。
	•	在提示框中为最终用户提供文档参考："硬编码自定义设置"和"客户端配置"。在提示框中引用"查看官方文档"的文本。
B) "安全"部分
	•	强制执行"仅加密"（复选框）。
	•	剪贴板策略：完全禁用或设置单向性（传入/传出）的选项。
	•	文件传输：禁用或单向。
	•	自动录制会话（传入/传出）。
	•	默认要求登录（如果适用）。注意：警告某些高级策略在Pro版本中更集成；在OSS版本中可能需要映射到客户端的"高级设置"。
C) "品牌"部分
	•	显示的产品名称。
	•	图标和标志（暗色/亮色）作为图像上传；应用程序只应准备资产和构建中的替换步骤，无需签名二进制文件。
	•	主色调/主题。注意：
	•	指出在OSS版本中，资产在Flutter项目中被替换；Pro版本提供从控制台生成品牌的功能。
D) "高级选项"部分（映射到"高级设置"）包括最常用的复选框/字段；每个条目必须映射到config.json中的键值对：
	•	theme：system/dark/light。
	•	lang：es（或其他）。
	•	allow-auto-record-incoming：Y/N。
	•	allow-auto-record-outgoing：Y/N（如果适用）。
	•	enable-directx-capture（Windows控制）：Y/N。
	•	disable-clipboard：Y/N。
	•	one-way-clipboard-redirection：Y/N。
	•	one-way-file-transfer：Y/N。
	•	allow-remote-cm-modification：Y/N。添加一个自由字段"custom_kv"，用于未来可能添加的新选项的额外键值对。注意：
	•	指出"高级设置"的完整集合在不断发展，某些设置需要客户端的最低版本。
E) "输出/构建"部分
	•	初始目标平台：Windows x64。
	•	输出类型：便携式.exe和/或安装程序.msi（如果官方脚本支持）。
	•	"发布为Release"选项，带有语义标签（vX.Y.Z）和"draft: true"。
	•	"上传构件到Actions"标志。
config.json结构（示例）：{"server": {"RENDEZVOUS_SERVER": "hbbs.midominio.com","RS_PUB_KEY": "OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw=","API_SERVER": "https://hbbs.midominio.com"},"security": {"encrypted_only": true,"require_login": true,"clipboard": {"disabled": true,"one_way": "controller_to_controlled" // 值：none, controller_to_controlled, controlled_to_controller},"file_transfer": {"mode": "disabled" // 值：disabled, one_way_to_controlled, one_way_to_controller, bidirectional},"recording": {"auto_incoming": false,"auto_outgoing": false}},"branding": {"product_name": "MiRustDesk","logo_light": "assets/logo_light.png","logo_dark": "assets/logo_dark.png","icon_win_ico": "assets/app.ico","theme_color": "#0a84ff"},"advanced": {"theme": "system","lang": "es","enable_directx_capture": true,"disable_clipboard": true,"one_way_clipboard_redirection": true,"one_way_file_transfer": true,"allow_remote_cm_modification": false,"custom_kv": {"keep-screen-on": "during-controlled"}},"build": {"platform": "windows-x64","artifacts": "exe", "msi","publish_release": false,"upload_artifacts": true,"version": "v1.0.0"}}
所需的GitHub Actions工作流（build-windows.yml）：
	•	触发器：workflow_dispatch和推送到main分支。
	•	workflow_dispatch中可选的输入，用于RENDEZVOUS_SERVER、RS_PUB_KEY、API_SERVER；如果没有提供，则从仓库变量/密钥或构件config.json读取。
	•	步骤：
	1.	Checkout，包含子模块：true。
	2.	设置稳定的Flutter。
	3.	设置稳定的Rust工具链，目标为x86_64-pc-windows-msvc。
	4.	安装依赖项（ninja、llvm、vswhere、python、仓库的pip依赖项）。
	5.	如果config.json由Web上传，则下载构件config.json（或从仓库读取）。
	6.	执行scripts/apply-config.ps1以导出变量：
	•	RENDEZVOUS_SERVER -> env
	•	RS_PUB_KEY -> env
	•	API_SERVER -> env此外，生成带有高级设置的中间.toml或.json文件，以便构建脚本可以将它们注入到assets/config或项目支持的标志中。
	7.	编译Flutter应用Windows Release版本（flutter build windows --release）。
	8.	如果存在build.py，则使用它打包，带有便携式标志且不签名。
	9.	上传构件（.exe/.msi），如果publish_release==true，则创建带有上传的Release草稿。
重要注意事项：
	•	明确指出，根据官方文档，硬编码使用环境变量RENDEZVOUS_SERVER和RS_PUB_KEY，API_SERVER是可选的但建议在Nginx后面使用HTTPS用于控制台/API。
	•	澄清如果设置RENDEZVOUS_SERVER/RS_PUB_KEY中的一个而没有另一个，可执行文件将无法工作。
	•	在README中包含"已知限制"部分：
	•	某些版本报告通过Actions设置RS_PUB_KEY时存在间歇性问题；如果失败，请清除测试主机上的配置缓存并验证变量是否确实在编译时被注入。
	•	高级设置可能因版本而异；映射最稳定的设置，并留下custom_kv块用于扩展。
	•	添加"故障排除"部分：
	•	验证构建的二进制文件是最新的（非缓存）。
	•	如果与先前的安装有冲突，在Windows上测试时清除%AppData%\RustDesk和服务路径。
	•	确认与服务器典型端口（21114-21119，21116 UDP）的连接以及正确的公钥。
Web的样式和用户体验：
	•	干净的UI，顶部有步骤：1）服务器，2）安全，3）品牌，4）高级，5）构建。
	•	带有帮助文本和示例的提示框。
	•	内联验证。
	•	按钮：保存草稿（localStorage）、导出config.json、导出.env.example、下载带有预期结构的压缩资产（标志/图标）。
	•	构建前的"快速指南"部分，带有检查列表。
建议的语言和技术栈：
	•	前端：React + Vite、TypeScript、简单UI（Chakra UI或Tailwind）。
	•	脚本：PowerShell（.ps1）用于Windows运行器，Python可选用于跨平台工具。
	•	无后端：全客户端/静态；导出产生config.json和.env.example。
测试：
	•	提供示例config.json和工作流的dry-run（不签名）运行。
	•	提供品牌预览组件（亮色/暗色标志，主色调）。
预期结果：
	•	一个准备好克隆的仓库，包含配置Web、功能正常的Actions工作流和清晰的文档，使工程师能够：
	1.	完成Web表单并导出config.json。
	2.	将config.json作为构件上传或提交到仓库。
	3.	执行工作流并下载.exe/.msi构件。
	4.	验证客户端带有硬编码的服务器/密钥和默认的高级设置。