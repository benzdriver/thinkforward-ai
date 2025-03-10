# 前端到后端需求Prompt集合
以下是基于ThinkForward移民AI助手前端设计的后端需求prompt集合，适合用于与开发团队沟通或作为后端开发指南。

## 1. 用户认证与角色系统 API 需求 [已实现 ✅]

作为后端开发者，我已实现用户认证与角色系统API，以支持前端的Clerk集成和多角色权限控制。实现了以下功能：

1. 验证来自Clerk的JWT令牌，并将其映射到我们的内部用户系统
2. 实现用户角色API端点：
   - GET /api/users/role - 获取当前用户角色(ADMIN, CONSULTANT, CLIENT, GUEST)
   - GET /api/users/permissions - 获取当前用户权限列表
   - POST /api/users/profile - 更新用户资料信息

3. 实现角色管理API(管理员专用)：
   - GET /api/users/all - 获取用户列表(支持分页和筛选)
   - PUT /api/users/role/:userId - 更新用户角色
   - POST /api/users/invite - 邮件邀请新用户/顾问

安全要求：
- 所有非公开端点验证用户身份
- 权限检查通过middleware/roleCheck.js执行
- 日志记录所有角色变更操作

完成情况：
- ✅ 角色检查中间件: middleware/roleCheck.js
- ✅ 权限管理工具: utils/permissions.js
- ✅ 用户控制器: controllers/userController.js
- ✅ 国际化支持: locales/en/users.json 和 locales/zh/users.json
- ✅ 邮件邀请: services/emailService.js
- ✅ 单元测试覆盖: tests/unit/

## 2. 基础架构组件 [部分实现 ⚠️]

作为后端开发者，我已经完成以下基础架构组件：

1. 数据库连接与配置: 
   - ✅ MongoDB连接配置
   - ✅ 错误处理与重试逻辑

2. 国际化支持:
   - ✅ i18next集成
   - ✅ 中英文语言支持

3. 日志系统:
   - ✅ 结构化日志工具
   - ✅ 环境感知日志级别
   - ✅ 替换所有console.log为logger

4. 错误处理:
   - ✅ 全局错误处理中间件
   - ✅ 标准化错误响应格式

待完成:
- ⚠️ 缓存层实现(Redis)
- ⚠️ 文件上传与存储服务

## 3. 智能表单系统后端需求 [待实现 ❌]

作为后端开发者，我需要实现智能表单系统后端，支持前端的表单填写整合功能。具体要求：

1. 表单数据建模与存储：
   - 设计移民表单数据模型，支持不同类型表单(IMM0001, IMM0002等)
   - 实现字段映射系统，识别不同表单间的相同字段(如出生日期、姓名等)
   - 支持表单状态跟踪(草稿、已提交、已审核等)

2. API端点实现：
   - GET /api/forms - 获取所有可用表单类型
   - GET /api/forms/:formId - 获取特定表单模板
   - POST /api/applications - 创建新的申请(包含多个表单)
   - GET /api/applications/:id - 获取申请及相关表单
   - PUT /api/applications/:id - 更新申请数据
   - GET /api/applications/:id/forms - 获取申请相关的所有表单
   - POST /api/applications/:id/submit - 提交完整申请

3. 智能表单功能：
   - 实现字段验证逻辑，基于移民规则
   - 支持字段间的依赖关系和条件显示
   - 提供AI辅助的表单填写建议
   - 生成可下载的PDF表单(填充完用户数据)

4. 表单数据整合：
   - API支持将用户输入的单一数据集映射到多个移民表单
   - 实现表单间的数据一致性检查
   - 支持表单数据版本控制

## 4. AI助手后端需求 [待实现 ❌]

作为后端开发者，我需要设计实现移民AI助手功能的服务端组件。具体要求：

1. 扩展现有AI聊天功能：
   - 优化/api/ai/chat接口以支持更复杂的对话历史
   - 实现对话主题分类和摘要生成
   - 添加上下文管理，支持长对话和多轮交互

2. 增强AI知识库：
   - 设计知识库结构，支持不同移民路径的政策和要求
   - 实现知识检索机制，提供最新、最相关的移民信息
   - 支持根据用户对话内容动态加载相关知识

3. 实现表单辅助API：
   - POST /api/ai/form-recommendation - 根据用户情况推荐适合的移民途径和表单
   - POST /api/ai/form-field-help - 提供特定表单字段的填写建议和说明
   - POST /api/ai/form-validation - 检查表单数据并提供智能纠错和优化建议

4. 集成文档分析功能：
   - 实现文档提取API，从上传文件中提取关键信息
   - 支持自动将文档中的信息填入相关表单字段
   - 提供文档完整性和有效性评估

5. 性能和扩展考虑：
   - 设计异步处理机制，特别是对于耗时的AI操作
   - 实现请求队列和优先级系统
   - 考虑AI响应缓存策略，减少重复计算

## 5. 顾问工作流后端需求 [待实现 ❌]

作为后端开发者，我需要实现支持移民顾问工作流的API和服务。具体要求：

1. 客户管理API：
   - GET /api/consultants/clients - 获取分配给顾问的客户列表
   - GET /api/consultants/clients/:id - 获取特定客户详情
   - PUT /api/consultants/clients/:id/notes - 更新客户咨询笔记
   - GET /api/consultants/workload - 获取顾问当前工作量统计

2. 申请审核功能：
   - GET /api/consultants/applications - 获取待审核的申请列表
   - GET /api/consultants/applications/:id - 获取特定申请详情
   - POST /api/consultants/applications/:id/review - 提交申请审核结果
   - POST /api/consultants/applications/:id/request-changes - 请求申请修改

3. 客户沟通API：
   - POST /api/messages - 发送消息给客户
   - GET /api/messages/client/:clientId - 获取与特定客户的消息历史
   - PUT /api/messages/:id/read - 标记消息为已读

4. 日历与预约功能：
   - GET /api/consultants/availability - 获取顾问可用时间
   - PUT /api/consultants/availability - 更新顾问可用时间
   - GET /api/consultants/appointments - 获取预约列表
   - POST /api/consultants/appointments/:id/confirm - 确认预约

## 6. 待实现的数据模型与关系

基于ThinkForward移民AI助手的需求，我们需要实现以下数据模型：

1. ✅ 用户模型（User）- 已实现
   - 基础字段：id, email, name, createdAt
   - 认证相关：clerkId, lastLogin
   - 角色管理：role(enum), permissions(json)

2. ❌ 用户档案（Profile）- 待实现
   - 个人信息：dateOfBirth, nationality, address
   - 联系方式：phone, alternateEmail
   - 偏好设置：language, notificationPreferences

3. ❌ 申请模型（Application）- 待实现
   - 元数据：id, type, status, createdAt, updatedAt
   - 关联：applicant(User), consultant(User), forms(1:n)
   - 状态跟踪：statusHistory, currentStage

4. ❌ 表单模型（Form）- 待实现
   - 类型信息：formType, version, officialId(如IMM0001)
   - 状态：status, lastUpdated
   - 数据：formData(json), validationResults

5. ❌ 消息模型（Message）- 待实现
   - 基础：id, content, createdAt
   - 参与者：sender, recipient
   - 状态：readStatus, deliveryStatus

6. ❌ AI会话模型（AIChat）- 待实现
   - 会话：id, title, createdAt
   - 消息：messages(1:n)
   - 关联：user, relatedApplication(可选)

## 7. 下一步开发计划

1. 开发优先级:
   - 完成基础架构组件 (缓存、文件上传)
   - 实现表单系统的核心模型和API
   - 开发AI助手基础功能
   - 实现顾问工作流

2. 技术债务:
   - 完善logger工具在所有文件中的应用
   - 增强错误处理机制
   - 扩展测试覆盖率

3. 前后端协调:
   - 确定API接口规范
   - 同步开发进度
   - 协调集成测试