# Thinkforward移民AI助手前端设计指南

## 版本历史
- v1.0 (2023-11-01): 初始文档
- v1.1 (2023-11-15): 添加用户角色与权限系统
- v1.2 (2023-12-01): 标记实现状态与API端点
- v1.3 (2024-01-10): 补充项目结构与部署信息

## 项目概览

Thinkforward移民AI助手是一个基于AI技术的移民服务平台，旨在简化移民申请流程并提供专业咨询。前端使用Next.js框架构建，结合Clerk进行身份验证，采用响应式设计确保在不同设备上的良好体验。

## 技术栈详情

- **前端框架**: Next.js (React框架) [已配置]
- **认证系统**: Clerk (提供用户认证、会话管理) [已集成]
- **状态管理**: React Hooks (useState, useEffect, useContext) [已使用]
- **样式方案**: Tailwind CSS [已配置]
- **国际化**: next-i18next (支持中英双语) [已配置]
- **API通信**: Fetch API [已使用]
- **类型检查**: TypeScript [已配置]

## 项目结构
```bash
frontend/
├── components/ # 可复用UI组件
│ ├── layout/ # 布局组件，如Header, Footer
│ ├── forms/ # 表单相关组件
│ ├── ui/ # 基础UI组件
│ └── dashboard/ # 仪表盘相关组件
├── pages/ # 页面组件和路由
│ ├── sign-in/ # 登录页面(Clerk集成)
│ ├── sign-up/ # 注册页面(Clerk集成)
│ ├── dashboard/ # 客户仪表盘
│ ├── consultant/ # 顾问专用页面
│ ├── admin/ # 管理员专用页面
│ └── api/ # API路由
├── public/ # 静态资源
├── styles/ # 全局样式
├── types/ # TypeScript类型定义
├── utils/ # 工具函数
└── middleware.ts # NextJS中间件(权限控制)
```

## 用户角色与权限系统

系统定义了四种用户角色，每种角色拥有不同的权限：

1. **游客(GUEST)** - 未登录用户，只能访问公共页面
   - 权限: {canAccessDashboard: false, canAccessAIAssistant: false, canFillForms: false, canReviewClients: false, canAssignConsultants: false, canManageSystem: false}

2. **客户(CLIENT)** - 基本用户，可以访问个人仪表盘、使用AI助手和填写表单
   - 权限: {canAccessDashboard: true, canAccessAIAssistant: true, canFillForms: true, canReviewClients: false, canAssignConsultants: false, canManageSystem: false}

3. **顾问(CONSULTANT)** - 移民顾问，可以审核客户资料和表单，提供专业建议
   - 权限: {canAccessDashboard: true, canAccessAIAssistant: true, canFillForms: true, canReviewClients: true, canAssignConsultants: false, canManageSystem: false}

4. **管理员(ADMIN)** - 系统管理员，拥有所有权限，包括系统管理和用户分配
   - 权限: {canAccessDashboard: true, canAccessAIAssistant: true, canFillForms: true, canReviewClients: true, canAssignConsultants: true, canManageSystem: true}

## 页面结构与实现状态

### 公共页面

1. **首页(/)** - 展示平台主要功能和价值主张，吸引用户注册 [已实现]
2. **关于我们(/about)** - 介绍公司团队和服务理念 [已实现]
3. **服务定价(/pricing)** - 展示不同服务套餐和价格 [已实现]
4. **登录(/sign-in/[[...index]])** - 用户登录界面 [已实现]
5. **注册(/sign-up/[[...index]])** - 新用户注册界面 [已实现]
6. **初步评估(/initial-assessment)** - 提供免费移民资格初步评估 [已实现]

### 客户页面

1. **仪表盘(/dashboard)** - 客户主界面，展示申请进度和通知 [进行中]
   - 进度卡片组件 [已实现]
   - 通知面板 [进行中]
   - 即将到期提醒 [待实现]
2. **表单中心(/forms)** - 各类移民表格填写界面 [待实现]
   - 表单导航 [待实现]
   - 表单编辑器 [待实现]
   - 自动保存功能 [待实现]
3. **文档管理(/documents)** - 上传和管理移民所需文档 [待实现]
4. **AI助手(/assistant)** - 提供实时移民政策咨询和指导 [进行中]
   - 聊天界面 [进行中]
   - 历史记录 [待实现]

### 顾问页面

1. **顾问仪表盘(/consultant/dashboard)** - 显示分配的客户和工作任务 [待实现]
2. **客户管理(/consultant/clients)** - 查看和管理客户申请 [待实现]
3. **申请审核(/consultant/applications)** - 审核客户提交的表单和文档 [待实现]

### 管理员页面

1. **管理仪表盘(/admin/dashboard)** - 系统概览和关键数据 [待实现]
2. **用户管理(/admin/users)** - 管理所有用户账户 [待实现]
3. **顾问分配(/admin/assignments)** - 将客户分配给合适的顾问 [待实现]
4. **系统设置(/admin/settings)** - 配置系统参数和权限 [待实现]

## 主要功能

1. **智能表单填写** - AI辅助的表单填写，自动检查错误和提供建议 [待实现]
2. **实时进度跟踪** - 客户可随时查看申请进展 [进行中]
3. **多语言支持** - 支持中文和英文界面切换 [已实现]
4. **智能推荐** - 基于用户情况推荐最适合的移民途径 [待实现]
5. **文档管理** - 自动整理和验证移民所需文档 [待实现]
6. **安全认证** - 使用Clerk提供安全的身份验证和会话管理 [已实现]

## 认证与路由保护实现

### 认证实现 [已完成]
- 使用Clerk提供的`<ClerkProvider>`包裹应用
- 通过`localStorage`存储clerk-token用于API认证
- 使用`useAuth()`钩子获取用户认证状态

### 路由保护机制 [已完成]
```typescript
// 公共页面列表
const publicPages = [
"/",
"/about",
"/pricing",
"/sign-in",
"/sign-in/[[...index]]",
"/sign-up",
"/sign-up/[[...index]]",
"/initial-assessment"
];
// 路由保护逻辑
useEffect(() => {
// 已经在登录页面，不要再重定向到登录页面
if (router.pathname === "/sign-in" || router.pathname.startsWith("/sign-in/")) {
return;
}
if (!localStorage.getItem('clerk-token')) {
// 未登录用户只能访问公共页面
if (!isPublicPage) {
router.push("/sign-in");
}
} else {
// 角色权限路由保护
if (router.pathname.startsWith("/consultant/") &&
userRole !== UserRole.CONSULTANT &&
userRole !== UserRole.ADMIN) {
router.push("/dashboard");
}
if (router.pathname.startsWith("/admin/") &&
userRole !== UserRole.ADMIN) {
router.push("/dashboard");
}
}
}, [router.pathname, isPublicPage, userRole, router]);
```

## API端点概览

1. **用户API**
   - `GET /api/user/role` - 获取当前用户角色 [已实现]
   - `PUT /api/user/profile` - 更新用户个人资料 [待实现]
   - `GET /api/user/permissions` - 获取用户权限 [待实现]

2. **表单API**
   - `GET /api/forms` - 获取所有表单 [待实现]
   - `GET /api/forms/:id` - 获取特定表单 [待实现]
   - `POST /api/forms/:id` - 提交表单 [待实现]
   - `PUT /api/forms/:id` - 更新表单 [待实现]

3. **文档API**
   - `GET /api/documents` - 获取用户文档 [待实现]
   - `POST /api/documents/upload` - 上传新文档 [待实现]
   - `DELETE /api/documents/:id` - 删除文档 [待实现]

4. **AI助手API**
   - `POST /api/assistant/chat` - 发送消息给AI助手 [进行中]
   - `GET /api/assistant/history` - 获取聊天历史 [待实现]

## 视觉设计规范

- **主色调**: 蓝色系(#3949AB)，象征专业和可靠
- **辅助色**: 白色和浅灰色，确保内容清晰可读
- **字体**: 无衬线字体，确保在各种设备上的可读性
- **布局**: 简洁明了，突出重要信息和操作按钮
- **图标**: 使用直观的图标增强用户体验
- **响应式设计**: 移动优先，自适应桌面和平板尺寸

## 部署信息

- **开发环境**: `npm run dev` (http://localhost:3000)
- **生产构建**: `npm run build` followed by `npm start`
- **静态导出**: `npm run export` (可选)
- **部署平台**: Vercel (自动化部署)
- **环境变量**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk公钥
  - `CLERK_SECRET_KEY` - Clerk私钥
  - `NEXT_PUBLIC_API_URL` - 后端API地址

## 开发规范

1. **组件化设计** - 每个UI元素都应该是可复用的组件
2. **响应式布局** - 所有页面应适应不同屏幕尺寸
3. **TypeScript类型** - 使用强类型确保代码质量
4. **权限检查** - 确保在组件和API级别都有适当的权限验证
5. **错误处理** - 所有API调用都应该有适当的错误处理和用户反馈
6. **本地化** - 所有用户可见文本应通过i18n系统提供
7. **状态管理** - 使用React Hooks管理组件状态和共享状态
8. **代码风格** - 遵循ESLint配置，确保代码一致性
9. **单元测试** - 为关键组件编写测试

## 后续开发重点

1. 完成客户仪表盘页面设计与实现
2. 实现AI助手聊天界面与后端集成
3. 开发表单中心，支持智能表单填写
4. 完善顾问和管理员功能模块
5. 优化移动端体验
6. 增强国际化支持