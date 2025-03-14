# ThinkForward移民AI助手前端设计指南 (2.0版)

## 版本历史
- v1.0-v1.3 (2023-11至2024-01): 初始文档与更新
- v2.0 (2024-05): 重新定位为"顾问优先"战略

## 项目战略重新定位

ThinkForward移民AI助手是一个基于AI技术的移民服务平台，旨在赋能移民顾问并简化移民申请流程。平台采用"顾问优先"的两阶段战略:

1. **第一阶段(当前)**: 专注于招募移民顾问作为核心用户，提供AI辅助工具提升其工作效率
2. **第二阶段(未来)**: 在建立稳固的顾问网络后，扩展至直接服务终端用户

## 技术栈详情

- **前端框架**: Next.js (React框架) [保持不变]
- **认证系统**: Clerk (提供用户认证、会话管理) [保持不变]
- **状态管理**: React Hooks + Context API [保持不变]
- **样式方案**: Tailwind CSS [保持不变]
- **国际化**: next-i18next (支持多语言) [保持不变]
- **API通信**: Fetch API + React Query [新增: React Query用于数据获取]
- **类型检查**: TypeScript [保持不变]

## 项目结构更新

```bash
frontend/
├── components/ # 可复用UI组件
│ ├── layout/ # 布局组件
│ ├── forms/ # 表单相关组件
│ ├── ui/ # 基础UI组件
│ ├── dashboard/ # 仪表盘相关组件
│ ├── consultant/ # 【新增】顾问专用组件
│ │ ├── ClientManagement/ # 客户管理相关组件
│ │ ├── AITools/ # 顾问专用AI工具组件
│ │ └── Analytics/ # 顾问业务分析组件
│ └── client/ # 客户端组件
├── pages/ # 页面组件和路由
│ ├── auth/ # 认证相关页面
│ ├── dashboard/ # 仪表盘(根据角色显示不同内容)
│ ├── consultant/ # 【重点区域】顾问专用页面
│ │ ├── clients/ # 客户管理
│ │ ├── tools/ # 顾问工具
│ │ ├── analytics/ # 业务分析
│ │ └── settings/ # 顾问设置
│ ├── client/ # 客户专用页面
│ └── admin/ # 管理员专用页面
├── public/ # 静态资源
├── styles/ # 全局样式
├── contexts/ # 【新增】React Context
│ ├── AuthContext.tsx # 认证上下文
│ └── ConsultantContext.tsx # 【新增】顾问专用上下文
├── hooks/ # 【新增】自定义Hooks
├── types/ # TypeScript类型定义
├── utils/ # 工具函数
└── middleware.ts # NextJS中间件(权限控制)
```

## 用户角色与权限系统 (更新)

系统定义四种用户角色，优先完善顾问(CONSULTANT)角色体验:

1. **管理员(ADMIN)** [次要优先级]
   - 平台管理权限
   - 顾问管理权限
   - 系统配置权限

2. **顾问(CONSULTANT)** [最高优先级]
   - 客户管理权限
   - AI助手高级使用权限
   - 表单处理高级权限
   - 案例管理权限
   - 【新增】客户分析仪表盘
   - 【新增】批量文档处理权限

3. **客户(CLIENT)** [后期优先级]
   - 个人资料管理权限
   - AI助手使用权限(基础)
   - 表单填写权限
   - 文档上传权限

4. **访客(GUEST)** [维持基础功能]
   - 浏览公开内容权限
   - 注册/登录权限

## 顾问体验核心组件 (新增重点)

### 1. 顾问仪表盘

**设计重点**: 直观展示业务概况，强调AI带来的效率提升

```jsx
// 核心组件示例
<ConsultantDashboard>
  <ClientSummary totalClients={statistics.totalClients} activeClients={statistics.activeClients} />
  <EfficiencyMetrics timesSaved={statistics.timesSaved} casesCompleted={statistics.casesCompleted} />
  <RecentActivities activities={recentActivities} />
  <TasksList tasks={pendingTasks} />
</ConsultantDashboard>
```

### 2. 客户管理界面

**设计重点**: 直观、高效的客户管理体验，集成AI分析

```jsx
// 核心组件示例
<ClientManagement>
  <ClientSearchFilters />
  <ClientsList clients={clients} />
  <ClientDetailView client={selectedClient}>
    <AIInsightPanel clientId={selectedClient.id} /> {/* 新增: AI对客户的洞察 */}
    <DocumentsManager clientId={selectedClient.id} />
    <ApplicationTimeline applicationId={selectedClient.applicationId} />
  </ClientDetailView>
</ClientManagement>
```

### 3. AI顾问助手

**设计重点**: 专业级AI交互，提供高价值行业洞察

```jsx
// 核心组件示例
<ConsultantAIAssistant>
  <ChatInterface role="CONSULTANT" specialFeatures={true} />
  <DocumentAnalysisPanel />
  <ImmigrationPathwayAnalyzer />
  <PrecedentCaseSearch /> {/* 新增: 案例搜索功能 */}
</ConsultantAIAssistant>
```

### 4. 表单自动化工具

**设计重点**: 大幅减少表单处理时间，提高准确性

```jsx
// 核心组件示例
<FormAutomationTools>
  <FormTemplateLibrary templates={formTemplates} />
  <AutoFillEngine clientId={selectedClient.id} formId={selectedForm.id} />
  <FormReviewInterface formId={selectedForm.id} />
  <BatchProcessing forms={selectedForms} /> {/* 新增: 批量处理 */}
</FormAutomationTools>
```

## 用户界面主题更新

顾问专业主题，强调:
- **主色调**: 深蓝色(#1E3A8A)，传达专业和可靠
- **辅助色**: 科技蓝(#2563EB)，象征AI创新
- **强调色**: 成功绿(#10B981)，表示效率与结果

## 所需API端点 (更新优先级)

以下API需优先实现，以支持顾问用户体验:

1. **顾问特有API** [最高优先级]
   - `GET /api/consultant/dashboard` - 获取顾问仪表盘数据
   - `GET /api/consultant/clients` - 获取顾问的客户列表
   - `GET /api/consultant/clients/:id` - 获取特定客户详情
   - `POST /api/consultant/clients` - 添加新客户
   - `GET /api/consultant/analytics` - 获取业务分析数据

2. **AI助手API** [高优先级]
   - `POST /api/assistant/consultant-chat` - 顾问专用AI交互
   - `POST /api/assistant/document-analysis` - 文档分析
   - `POST /api/assistant/immigration-pathways` - 移民路径分析

3. **表单处理API** [高优先级]
   - `GET /api/forms/templates` - 获取表单模板
   - `POST /api/forms/auto-fill` - 自动填充表单
   - `POST /api/forms/batch-process` - 批量处理表单

4. **用户管理API** [中等优先级]
   - 保持原有端点

5. **客户端API** [后期优先级]
   - 保持原有端点，优先级降低

## 需要修改的关键区域

1. **页面路由结构**:
   - 增强`/consultant/*`路径下的功能
   - 重新设计顾问仪表盘为核心入口

2. **导航菜单**:
   - 为顾问角色提供专用导航
   - 突出显示效率工具和客户管理

3. **权限系统**:
   - 为顾问角色增加更多细分权限
   - 实现基于订阅层级的功能访问控制

4. **AI交互界面**:
   - 区分顾问专用AI和客户用AI
   - 增强顾问AI的专业功能

## 顾问订阅计划UI

创建展示三级顾问订阅计划的专业页面:

```jsx
// 核心组件示例
<ConsultantPlans>
  <PlanCard 
    title="启动合作计划" 
    price="299" 
    period="月"
    features={[
      "核心AI助手功能",
      "最多管理15位客户",
      "基础文档自动化工具",
      "在线咨询工具"
    ]} 
  />
  <PlanCard 
    title="成长合作计划" 
    price="599" 
    period="月"
    featured={true}
    features={[
      "所有启动计划功能",
      "最多管理40位客户",
      "高级AI分析工具",
      "优先支持",
      "客户管理仪表板"
    ]} 
  />
  <PlanCard 
    title="专业合作计划" 
    price="999" 
    period="月"
    features={[
      "无限客户管理",
      "完整AI工具套件",
      "白标选项（简化版）",
      "营销支持",
      "定制报告"
    ]} 
  />
</ConsultantPlans>
```

## 营销与引导页面

创建专为顾问设计的营销页面，强调核心价值主张:
1. 效率提升页面：展示AI如何节省时间
2. 业务增长页面：展示如何管理更多客户
3. 顾问见证页面：早期采用者的成功案例

## 下一步开发优先级

1. 完成顾问仪表盘与客户管理界面
2. 实现顾问专用AI助手增强功能
3. 开发表单自动化高级工具
4. 实现顾问分析与业务洞察功能
5. 构建订阅与计费系统 