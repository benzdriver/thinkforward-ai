# ThinkForward移民AI助手后端设计指南 (2.0版)

## 版本历史

- v1.0 (2023-11-01): 初始文档
- v2.0 (2024-05): 重新定位为"顾问优先"战略
- v2.1 (2024-06): 增强国际化支持与性能优化
- v2.2 (2024-06): 更新国际化实现策略，采用按页面组织翻译文件

## 项目战略概述

ThinkForward移民AI助手后端架构已调整为"顾问优先"战略，以支持两阶段部署:

1. **第一阶段(当前)**: 重点优化移民顾问体验，打造AI赋能工具套件
2. **第二阶段(未来)**: 扩展架构，支持直接终端用户服务

本设计指南重点关注第一阶段实现，同时保留未来扩展能力。

## 后端技术栈

- **主框架**: Node.js + Express [保持不变]
- **数据库**: MongoDB (主数据库) [保持不变]
- **认证集成**: Clerk API集成 [保持不变]
- **AI集成**: OpenAI API (GPT-4) [保持不变]
- **文件存储**: AWS S3 [保持不变]
- **缓存系统**: Redis [保持不变]
- **队列系统**: [新增] Bull + Redis (处理长时间运行的AI任务)
- **业务分析**: [新增] 定制分析服务，存储在MongoDB
- **国际化支持**: [新增] i18next-node (后端错误消息与邮件模板)

## 系统架构调整

### API路由命名规范 [新增部分]

所有API路由遵循RESTful标准:

1. **使用复数形式表示资源集合**
   - `/api/users` 而非 `/api/user`
   - `/api/applications` 而非 `/api/application`

2. **路由结构示例**
   ```
   /api/users                    # 获取/创建用户
   /api/users/:id                # 操作特定用户
   /api/users/:id/settings       # 操作用户设置
   /api/consultants/:id/clients  # 获取顾问的客户列表
   ```

3. **查询参数约定**
   ```
   /api/users?role=consultant    # 按角色过滤
   /api/forms?limit=10&page=2    # 分页
   /api/clients?sortBy=name&order=asc  # 排序
   ```

### 项目结构更新

```
backend/
├── config/ # 配置文件
├── controllers/ # 请求处理器
│ ├── userController.js # 用户相关
│ ├── consultantController.js # 【新增】顾问专用功能
│ ├── clientController.js # 客户相关
│ ├── formController.js # 表单处理
│ ├── aiAssistantController.js # AI助手
│ ├── documentController.js # 文档管理
│ └── analyticsController.js # 【新增】业务分析
├── middleware/ # 中间件
│ ├── auth.js # 认证
│ ├── roleCheck.js # 角色验证
│ ├── subscriptionCheck.js # 【新增】订阅检查
│ ├── rateLimit.js # 请求速率限制
│ ├── errorHandler.js # 【新增】统一错误处理
│ └── i18n.js # 【新增】国际化中间件
├── models/ # 数据库模型
│ ├── User.js # 用户模型
│ ├── Consultant.js # 【新增】顾问模型扩展
│ ├── Client.js # 【新增】客户模型扩展
│ ├── Application.js # 申请模型
│ ├── Form.js # 表单模型
│ └── Subscription.js # 【新增】订阅模型
├── routes/ # 路由定义
│ ├── api/ # API路由
│ │ ├── users.js # 用户相关路由
│ │ ├── consultant.js # 【新增】顾问专用路由
│ │ ├── client.js # 客户路由
│ │ ├── form.js # 表单路由
│ │ ├── ai-assistant.js # AI助手路由
│ │ ├── document.js # 文档路由
│ │ ├── analytics.js # 【新增】分析路由
│ │ └── subscription.js # 【新增】订阅路由
│ └── index.js # 路由汇总
├── services/ # 业务逻辑
│ ├── userService.js # 用户服务
│ ├── consultantService.js # 【新增】顾问服务
│ ├── clientService.js # 客户服务
│ ├── formService.js # 表单服务
│ ├── aiService.js # AI服务
│ ├── documentService.js # 文档服务
│ ├── analyticsService.js # 【新增】分析服务
│ ├── emailService.js # 邮件服务
│ └── subscriptionService.js # 【新增】订阅服务
├── utils/ # 工具函数
│ ├── apiResponse.js # API响应格式化
│ ├── logger.js # 日志工具
│ ├── validation.js # 数据验证
│ ├── errorTypes.js # 【新增】错误类型定义
│ └── i18n.js # 【新增】国际化工具
├── queues/ # 【新增】队列处理
│ ├── formProcessingQueue.js # 表单处理队列
│ ├── documentAnalysisQueue.js # 文档分析队列
│ └── aiTaskQueue.js # AI任务队列
├── locales/ # 【新增】国际化翻译文件
│ ├── en/ # 英文翻译
│ │ ├── common.json # 通用翻译
│ │ ├── errors.json # 错误消息
│ │ ├── emails.json # 邮件模板
│ │ └── api.json # API响应消息
│ ├── zh-CN/ # 简体中文翻译
│ │ ├── common.json
│ │ ├── errors.json
│ │ ├── emails.json
│ │ └── api.json
│ └── ... # 其他语言
├── app.js # 应用入口
└── server.js # 服务器启动
```

## 国际化支持实现 [新增]

### 后端错误消息国际化

使用i18next处理后端错误消息的国际化:

```javascript
// utils/i18n.js
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    ns: ['errors', 'emails'],
    defaultNS: 'errors',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
    },
  });

module.exports = i18next;
```

```javascript
// middleware/i18n.js
const i18next = require('../utils/i18n');

module.exports = (req, res, next) => {
  // 从请求头或查询参数获取语言偏好
  const lang = req.headers['accept-language'] || req.query.lang || 'en';
  req.language = lang.split(',')[0].trim().substring(0, 5);
  
  // 添加翻译函数到请求对象
  req.t = (key, options) => {
    return i18next.t(key, { lng: req.language, ...options });
  };
  
  next();
};
```

### 错误消息翻译示例

```json
// locales/en/errors.json
{
  "validation": {
    "required": "{{field}} is required",
    "email": "Please enter a valid email address",
    "minLength": "{{field}} must be at least {{min}} characters"
  },
  "auth": {
    "unauthorized": "Unauthorized access",
    "forbidden": "Access forbidden",
    "invalidCredentials": "Invalid credentials"
  },
  "notFound": {
    "user": "User not found",
    "client": "Client not found",
    "form": "Form not found"
  }
}
```

```json
// locales/zh-CN/errors.json
{
  "validation": {
    "required": "{{field}}为必填项",
    "email": "请输入有效的电子邮件地址",
    "minLength": "{{field}}至少需要{{min}}个字符"
  },
  "auth": {
    "unauthorized": "未授权访问",
    "forbidden": "禁止访问",
    "invalidCredentials": "无效的凭据"
  },
  "notFound": {
    "user": "未找到用户",
    "client": "未找到客户",
    "form": "未找到表单"
  }
}
```

### 使用示例

```javascript
// controllers/userController.js
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: req.t('validation.required', { field: 'Name' })
      });
    }
    
    // 处理用户创建逻辑...
    
  } catch (error) {
    next(error);
  }
};
```

## 统一错误处理 [新增]

### 错误类型定义

```javascript
// utils/errorTypes.js
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(message, resource) {
    super(message, 404, 'NOT_FOUND');
    this.resource = resource;
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError
};
```

### 全局错误处理中间件

```javascript
// middleware/errorHandler.js
const { AppError } = require('../utils/errorTypes');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // 默认错误状态
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'SERVER_ERROR';
  let message = err.message || 'Something went wrong';
  
  // 开发环境提供更多错误详情
  const error = {
    success: false,
    status: statusCode,
    code: errorCode,
    message: req.t ? req.t(message, err) : message,
  };
  
  // 非生产环境添加错误堆栈
  if (process.env.NODE_ENV !== 'production') {
    error.stack = err.stack;
    
    if (err.field) error.field = err.field;
    if (err.resource) error.resource = err.resource;
  }
  
  // 记录错误
  if (statusCode >= 500) {
    logger.error(`[${errorCode}] ${message}`, { 
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body
    });
  } else {
    logger.warn(`[${errorCode}] ${message}`, { 
      path: req.path,
      method: req.method
    });
  }
  
  res.status(statusCode).json(error);
};
```

## 队列系统实现 [新增]

### 表单处理队列

```javascript
// queues/formProcessingQueue.js
const Queue = require('bull');
const FormService = require('../services/formService');
const logger = require('../utils/logger');

// 创建队列
const formProcessingQueue = new Queue('form-processing', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
});

// 处理队列任务
formProcessingQueue.process(async (job) => {
  const { consultantId, formIds, options } = job.data;
  
  try {
    logger.info(`Processing forms for consultant ${consultantId}`, { formIds });
    
    // 更新任务进度
    job.progress(10);
    
    // 处理每个表单
    const results = [];
    for (let i = 0; i < formIds.length; i++) {
      const formId = formIds[i];
      const result = await FormService.processForm(formId, consultantId, options);
      results.push(result);
      
      // 更新进度
      job.progress(10 + Math.floor((i + 1) / formIds.length * 80));
    }
    
    // 完成处理
    job.progress(100);
    logger.info(`Completed processing forms for consultant ${consultantId}`, { formIds });
    
    return { success: true, results };
  } catch (error) {
    logger.error(`Error processing forms for consultant ${consultantId}`, { 
      formIds, 
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
});

// 添加批处理任务
async function addFormBatchJob(consultantId, formIds, options = {}) {
  const job = await formProcessingQueue.add({
    consultantId,
    formIds,
    options
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: true
  });
  
  return job.id;
}

// 检查任务状态
async function getFormBatchJobStatus(jobId) {
  const job = await formProcessingQueue.getJob(jobId);
  if (!job) {
    return { status: 'not_found' };
  }
  
  const state = await job.getState();
  return {
    id: job.id,
    status: state,
    progress: job.progress(),
    data: job.returnvalue,
    error: job.failedReason
  };
}

module.exports = {
  addFormBatchJob,
  getFormBatchJobStatus
};
```

## 数据模型扩展 [新增]

### 顾问模型扩展

```javascript
// models/Consultant.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  specializations: [{
    type: String,
    enum: ['BUSINESS', 'FAMILY', 'STUDENT', 'REFUGEE', 'SKILLED_WORKER', 'OTHER']
  }],
  languages: [{
    type: String
  }],
  licenseNumber: {
    type: String,
    required: true
  },
  licenseExpiry: {
    type: Date,
    required: true
  },
  subscriptionTier: {
    type: String,
    enum: ['FREE', 'STARTER', 'GROWTH', 'PROFESSIONAL'],
    default: 'FREE'
  },
  subscriptionStatus: {
    type: String,
    enum: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIAL'],
    default: 'TRIAL'
  },
  subscriptionExpiry: {
    type: Date
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  website: {
    type: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    displayOnPublicDirectory: {
      type: Boolean,
      default: false
    },
    autoRenewSubscription: {
      type: Boolean,
      default: true
    }
  },
  metrics: {
    clientCount: {
      type: Number,
      default: 0
    },
    completedApplications: {
      type: Number,
      default: 0
    },
    aiInteractions: {
      type: Number,
      default: 0
    },
    documentsProcessed: {
      type: Number,
      default: 0
    },
    averageClientRating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// 虚拟字段: 客户列表
ConsultantSchema.virtual('clients', {
  ref: 'Client',
  localField: '_id',
  foreignField: 'consultantId'
});

// 方法: 检查订阅是否有效
ConsultantSchema.methods.hasValidSubscription = function() {
  if (this.subscriptionStatus !== 'ACTIVE' && this.subscriptionStatus !== 'TRIAL') {
    return false;
  }
  
  if (this.subscriptionExpiry && new Date() > this.subscriptionExpiry) {
    return false;
  }
  
  return true;
};

// 方法: 检查是否可以添加更多客户
ConsultantSchema.methods.canAddMoreClients = async function() {
  if (!this.hasValidSubscription()) {
    return false;
  }
  
  const clientCount = this.metrics.clientCount;
  
  // 根据订阅层级检查客户数量限制
  switch(this.subscriptionTier) {
    case 'FREE':
      return clientCount < 3;
    case 'STARTER':
      return clientCount < 15;
    case 'GROWTH':
      return clientCount < 40;
    case 'PROFESSIONAL':
      return true; // 无限制
    default:
      return false;
  }
};

module.exports = mongoose.model('Consultant', ConsultantSchema);
```

### 订阅模型

```javascript
// models/Subscription.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  tier: {
    type: String,
    enum: ['FREE', 'STARTER', 'GROWTH', 'PROFESSIONAL'],
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIAL'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'OTHER']
  },
  paymentDetails: {
    lastFour: String,
    cardType: String,
    expiryMonth: Number,
    expiryYear: Number
  },
  billingHistory: [{
    date: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['PAID', 'FAILED', 'REFUNDED', 'PENDING']
    },
    invoiceUrl: String
  }],
  features: {
    maxClients: Number,
    aiCreditsPerMonth: Number,
    documentsPerMonth: Number,
    advancedAnalytics: Boolean,
    prioritySupport: Boolean,
    whiteLabel: Boolean
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
```

## API端点详细设计 [新增]

### 顾问仪表盘API

```javascript
// routes/api/consultant.js
const express = require('express');
const router = express.Router();
const consultantController = require('../../controllers/consultantController');
const auth = require('../../middleware/auth');
const roleCheck = require('../../middleware/roleCheck');
const subscriptionCheck = require('../../middleware/subscriptionCheck');

// 获取顾问仪表盘数据
router.get(
  '/dashboard',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.getDashboardData
);

// 获取顾问业务分析
router.get(
  '/analytics',
  auth,
  roleCheck('CONSULTANT'),
  subscriptionCheck(['GROWTH', 'PROFESSIONAL']),
  consultantController.getAnalytics
);

// 获取顾问客户列表
router.get(
  '/clients',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.getClients
);

// 获取特定客户详情
router.get(
  '/clients/:clientId',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.getClientDetails
);

// 添加新客户
router.post(
  '/clients',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.addClient
);

// 更新客户信息
router.put(
  '/clients/:clientId',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.updateClient
);

// 获取顾问订阅信息
router.get(
  '/subscription',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.getSubscription
);

// 更新顾问资料
router.put(
  '/profile',
  auth,
  roleCheck('CONSULTANT'),
  consultantController.updateProfile
);

module.exports = router;
```

### AI助手API

```javascript
// routes/api/ai-assistant.js
const express = require('express');
const router = express.Router();
const aiAssistantController = require('../../controllers/aiAssistantController');
const auth = require('../../middleware/auth');
const roleCheck = require('../../middleware/roleCheck');
const subscriptionCheck = require('../../middleware/subscriptionCheck');
const rateLimit = require('../../middleware/rateLimit');

// 顾问专用AI交互
router.post(
  '/consultant-chat',
  auth,
  roleCheck('CONSULTANT'),
  rateLimit('ai', 50),
  aiAssistantController.consultantChat
);

// 文档分析
router.post(
  '/document-analysis',
  auth,
  roleCheck('CONSULTANT'),
  subscriptionCheck(['STARTER', 'GROWTH', 'PROFESSIONAL']),
  rateLimit('document', 20),
  aiAssistantController.analyzeDocument
);

// 移民路径分析
router.post(
  '/immigration-pathways',
  auth,
  roleCheck('CONSULTANT'),
  subscriptionCheck(['GROWTH', 'PROFESSIONAL']),
  aiAssistantController.analyzeImmigrationPathways
);

// 案例搜索
router.post(
  '/precedent-search',
  auth,
  roleCheck('CONSULTANT'),
  subscriptionCheck(['PROFESSIONAL']),
  aiAssistantController.searchPrecedents
);

module.exports = router;
```

## 需要修改的关键区域

1. **数据模型扩展**:
   - 添加Consultant扩展模型 [已完成]
   - 实现订阅系统模型 [已完成]
   - 扩展客户模型以支持顾问关系 [进行中]

2. **权限系统更新**:
   - 增加基于订阅的功能访问控制 [已完成]
   - 细化顾问角色权限 [已完成]

3. **AI系统调整**:
   - 专业化顾问AI交互 [进行中]
   - 添加批量处理能力 [已完成]

4. **新增API端点**:
   - 顾问专用仪表盘API [已完成]
   - 客户管理API [已完成]
   - 订阅管理API [进行中]

## 国际化支持策略 [更新]

### 1. 翻译文件结构

采用按页面/功能组织翻译文件的方式，确保结构清晰且易于维护：

```
backend/locales/
├── en/
│ ├── common.json       # 通用翻译
│ ├── errors.json       # 错误消息
│ ├── emails/           # 邮件模板
│ │ ├── welcome.json    # 欢迎邮件
│ │ ├── reset.json      # 密码重置
│ │ └── ...
│ └── api/              # API响应
│   ├── users.json      # 用户相关
│   ├── forms.json      # 表单相关
│   └── ...
├── zh-CN/              # 简体中文
│ └── ...
└── ...                 # 其他语言
```

### 2. 错误消息国际化

所有API错误响应支持多语言，通过以下方式实现：

```javascript
// errorHandler.js
const { t } = require('../utils/i18n');

module.exports = (err, req, res, next) => {
  const locale = req.headers['accept-language'] || 'en';
  
  // 根据错误类型获取本地化错误消息
  const message = t(locale, `errors:${err.code}`, err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code,
      message
    }
  });
};
```

### 3. 邮件模板国际化

支持多语言邮件模板，根据用户语言偏好发送相应语言的邮件：

```javascript
// emailService.js
const { renderTemplate } = require('../utils/i18n');

async function sendWelcomeEmail(user) {
  const locale = user.languagePreference || 'en';
  const subject = t(locale, 'emails:welcome.subject');
  const html = await renderTemplate('welcome', { name: user.name }, locale);
  
  return sendEmail({
    to: user.email,
    subject,
    html
  });
}
```

### 4. 内容国际化

动态内容(如表单标签、选项等)支持多语言：

```javascript
// formService.js
async function getFormTemplate(formId, locale = 'en') {
  const form = await Form.findById(formId);
  
  // 转换表单字段为用户首选语言
  const localizedFields = form.fields.map(field => ({
    ...field,
    label: t(locale, `forms:${formId}.fields.${field.id}.label`, field.label),
    placeholder: t(locale, `forms:${formId}.fields.${field.id}.placeholder`, field.placeholder),
    options: field.options?.map(option => ({
      value: option.value,
      label: t(locale, `forms:${formId}.fields.${field.id}.options.${option.value}`, option.label)
    }))
  }));
  
  return {
    ...form.toObject(),
    fields: localizedFields
  };
}
```

### 5. 语言检测与切换

实现语言检测与切换API端点：

```javascript
// routes/api/users.js
router.patch('/settings/language', auth, async (req, res) => {
  const { language } = req.body;
  
  // 验证语言代码
  if (!['en', 'zh-CN', 'fr', 'es', 'ar', 'ja', 'ko'].includes(language)) {
    return res.status(400).json({
      success: false,
      error: {
        message: t(req.locale, 'errors:invalid_language')
      }
    });
  }
  
  // 更新用户语言偏好
  await User.findByIdAndUpdate(req.user.id, { languagePreference: language });
  
  res.json({
    success: true,
    data: {
      message: t(language, 'api:language_updated')
    }
  });
});
```

## 性能优化策略

1. **缓存层实现**:
   - 使用Redis缓存频繁访问的数据
   - 实现缓存失效策略

2. **数据库查询优化**:
   - 创建适当的索引
   - 使用投影减少返回数据量
   - 实现分页和过滤

3. **AI请求优化**:
   - 使用队列处理长时间运行的AI任务
   - 实现结果缓存减少重复请求
   - 批量处理相似请求

## 后续开发规划

1. **第一阶段开发优先级**:
   - 实现顾问专用功能 [进行中]
   - 开发订阅系统 [进行中]
   - 增强AI顾问助手 [计划中]
   - 建立客户管理系统 [已完成]
   - 实现表单自动化工具 [进行中]

2. **第二阶段准备工作**:
   - 设计客户自助服务API [计划中]
   - 开发顾问匹配系统 [计划中]
   - 建立数据隔离与共享机制 [计划中]

## 安全最佳实践

1. **API安全**:
   - 实现请求速率限制
   - 使用HTTPS加密传输
   - 实现CSRF保护

2. **数据安全**:
   - 敏感数据加密存储
   - 实现数据访问审计
   - 定期数据备份

3. **认证与授权**:
   - 基于角色的访问控制
   - 基于订阅的功能访问控制
   - 会话管理与令牌验证

## 监控与日志

1. **应用监控**:
   - 性能指标收集
   - 错误率监控
   - API响应时间监控

2. **日志管理**:
   - 结构化日志记录
   - 错误日志集中存储
   - 安全事件日志

3. **警报系统**:
   - 关键错误自动警报
   - 性能降级警报
   - 安全事件警报