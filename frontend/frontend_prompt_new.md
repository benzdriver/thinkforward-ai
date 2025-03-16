# ThinkForward移民AI助手前端设计指南 (3.0版)

## 版本历史
- v1.0-v1.3 (2023-11至2024-01): 初始文档与更新
- v2.0 (2024-05): 重新定位为"顾问优先"战略
- v3.0 (2024-06): 架构优化与国际化完善

## 项目战略重新定位

ThinkForward移民AI助手是一个基于AI技术的移民服务平台，旨在赋能移民顾问并简化移民申请流程。平台采用"顾问优先"的两阶段战略:

1. **第一阶段(当前)**: 专注于招募移民顾问作为核心用户，提供AI辅助工具提升其工作效率
2. **第二阶段(未来)**: 在建立稳固的顾问网络后，扩展至直接服务终端用户

## 技术栈详情

- **前端框架**: Next.js (React框架) [保持不变]
- **认证系统**: Clerk (提供用户认证、会话管理) [保持不变]
- **状态管理**: React Hooks + Context API + React Query [更新: 添加React Query]
- **样式方案**: Tailwind CSS [保持不变]
- **国际化**: next-i18next (支持多语言) [已完善]
- **API通信**: Fetch API + React Query [已实现]
- **类型检查**: TypeScript [保持不变]
- **错误处理**: 全局错误边界 + 统一错误UI [新增]
- **性能优化**: 组件懒加载 + 图片优化 + 缓存策略 [新增]

## 项目结构更新

```bash
frontend/
├── components/ # 可复用UI组件
│ ├── layout/ # 布局组件
│ │ ├── AppLayout.tsx # 应用主布局
│ │ ├── AuthenticatedLayout.tsx # 认证用户布局
│ │ ├── ConsultantLayout.tsx # 顾问专用布局
│ │ ├── ClientLayout.tsx # 客户专用布局
│ │ ├── AdminLayout.tsx # 管理员专用布局
│ │ └── ErrorBoundary.tsx # 全局错误边界
│ ├── forms/ # 表单相关组件
│ │ ├── FormBuilder/ # 表单构建器
│ │ ├── FormRenderer/ # 表单渲染器
│ │ ├── FormValidation/ # 表单验证
│ │ └── FormControls/ # 表单控件
│ ├── ui/ # 基础UI组件 [已完成国际化]
│ │ ├── Button/ # 按钮组件
│ │ ├── Card/ # 卡片组件
│ │ ├── Table/ # 表格组件
│ │ ├── Modal/ # 模态框组件
│ │ ├── Dropdown/ # 下拉菜单组件
│ │ ├── Form/ # 表单组件
│ │ ├── Tabs/ # 标签页组件
│ │ ├── Pagination/ # 分页组件
│ │ ├── Alert/ # 提示组件
│ │ ├── Toast/ # 轻提示组件
│ │ ├── Skeleton/ # 骨架屏组件 [新增]
│ │ ├── ErrorAlert/ # 错误提示组件
│ │ └── LoadingIndicator/ # 加载指示器
│ ├── dashboard/ # 仪表盘相关组件
│ │ ├── StatCard/ # 统计卡片
│ │ ├── Chart/ # 图表组件
│ │ ├── ActivityFeed/ # 活动流
│ │ └── QuickActions/ # 快速操作
│ ├── consultant/ # 顾问专用组件
│ │ ├── ClientManagement/ # 客户管理相关组件
│ │ │ ├── ClientList/ # 客户列表
│ │ │ ├── ClientDetail/ # 客户详情
│ │ │ ├── ClientForm/ # 客户表单
│ │ │ └── ClientFilter/ # 客户筛选
│ │ ├── AITools/ # 顾问专用AI工具组件
│ │ │ ├── DocumentAnalyzer/ # 文档分析
│ │ │ ├── PathwayRecommender/ # 路径推荐
│ │ │ ├── FormAssistant/ # 表单助手
│ │ │ └── PrecedentSearch/ # 案例搜索
│ │ └── Analytics/ # 顾问业务分析组件
│ │   ├── PerformanceMetrics/ # 绩效指标
│ │   ├── ClientInsights/ # 客户洞察
│ │   ├── RevenueAnalysis/ # 收入分析
│ │   └── TrendReports/ # 趋势报告
│ └── client/ # 客户端组件
│   ├── ApplicationStatus/ # 申请状态
│   ├── DocumentUpload/ # 文档上传
│   ├── FormFilling/ # 表单填写
│   └── ConsultantFinder/ # 顾问查找
├── pages/ # 页面组件和路由
│ ├── _app.tsx # 应用入口
│ ├── _document.tsx # 文档结构
│ ├── index.tsx # 首页
│ ├── auth/ # 认证相关页面
│ │ ├── signin.tsx # 登录
│ │ ├── signup.tsx # 注册
│ │ ├── forgot-password.tsx # 忘记密码
│ │ └── reset-password.tsx # 重置密码
│ ├── dashboard/ # 仪表盘(根据角色显示不同内容)
│ │ ├── index.tsx # 仪表盘首页
│ │ └── profile.tsx # 个人资料
│ ├── consultant/ # 顾问专用页面
│ │ ├── index.tsx # 顾问首页
│ │ ├── clients/ # 客户管理
│ │ │ ├── index.tsx # 客户列表
│ │ │ ├── [id].tsx # 客户详情
│ │ │ ├── add.tsx # 添加客户
│ │ │ └── import.tsx # 导入客户
│ │ ├── tools/ # 顾问工具
│ │ │ ├── index.tsx # 工具首页
│ │ │ ├── ai-assistant.tsx # AI助手
│ │ │ ├── document-analyzer.tsx # 文档分析
│ │ │ ├── form-automation.tsx # 表单自动化
│ │ │ └── pathway-finder.tsx # 路径查找
│ │ ├── analytics/ # 业务分析
│ │ │ ├── index.tsx # 分析首页
│ │ │ ├── performance.tsx # 绩效分析
│ │ │ ├── clients.tsx # 客户分析
│ │ │ └── revenue.tsx # 收入分析
│ │ └── settings/ # 顾问设置
│ │   ├── index.tsx # 设置首页
│ │   ├── profile.tsx # 个人资料
│ │   ├── business.tsx # 业务设置
│ │   ├── subscription.tsx # 订阅管理
│ │   └── team.tsx # 团队管理
│ ├── client/ # 客户专用页面
│ │ ├── index.tsx # 客户首页
│ │ ├── applications/ # 申请管理
│ │ ├── documents/ # 文档管理
│ │ ├── forms/ # 表单管理
│ │ └── consultants/ # 顾问查找
│ └── admin/ # 管理员专用页面
│   ├── index.tsx # 管理首页
│   ├── users/ # 用户管理
│   ├── consultants/ # 顾问管理
│   ├── settings/ # 系统设置
│   └── analytics/ # 平台分析
├── public/ # 静态资源
│ ├── locales/ # 国际化翻译文件 [已完善]
│ │ ├── en/ # 英文
│ │ │ ├── common.json # 通用翻译
│ │ │ ├── auth.json # 认证相关
│ │ │ └── consultant.json # 顾问相关
│ │ ├── zh-CN/ # 简体中文
│ │ │ ├── common.json # 通用翻译
│ │ │ ├── auth.json # 认证相关
│ │ │ └── consultant.json # 顾问相关
│ │ └── ... # 其他语言
│ ├── images/ # 图片资源
│ └── fonts/ # 字体资源
├── styles/ # 全局样式
│ ├── globals.css # 全局CSS
│ ├── tailwind.css # Tailwind入口
│ └── rtl.css # RTL支持样式 [新增]
├── contexts/ # React Context
│ ├── AuthContext.tsx # 认证上下文
│ ├── ConsultantContext.tsx # 顾问专用上下文
│ ├── UIContext.tsx # UI状态上下文 [新增]
│ ├── LanguageContext.tsx # 语言上下文 [新增]
│ └── ThemeContext.tsx # 主题上下文 [新增]
├── hooks/ # 自定义Hooks
│ ├── api/ # API相关hooks [新增]
│ │ ├── useConsultant.ts # 顾问数据hooks
│ │ ├── useClient.ts # 客户数据hooks
│ │ ├── useForm.ts # 表单数据hooks
│ │ └── useAnalytics.ts # 分析数据hooks
│ ├── useAuth.ts # 认证hooks
│ ├── useToast.ts # 提示hooks
│ ├── useMediaQuery.ts # 媒体查询hooks [新增]
│ ├── useLocalStorage.ts # 本地存储hooks [新增]
│ └── useTranslation.ts # 翻译hooks [已完善]
├── services/ # 服务层 [新增]
│ ├── api.ts # API基础服务
│ ├── auth.ts # 认证服务
│ ├── consultant.ts # 顾问服务
│ ├── client.ts # 客户服务
│ └── analytics.ts # 分析服务
├── utils/ # 工具函数
│ ├── api/ # API工具
│ │ ├── fetcher.ts # 数据获取器
│ │ └── endpoints.ts # API端点定义
│ ├── validation.ts # 验证工具
│ ├── formatting.ts # 格式化工具
│ ├── date.ts # 日期工具
│ ├── storage.ts # 存储工具
│ └── i18n.ts # 国际化工具 [已完善]
├── types/ # TypeScript类型定义
│ ├── user.ts # 用户类型
│ ├── consultant.ts # 顾问类型
│ ├── client.ts # 客户类型
│ ├── form.ts # 表单类型
│ └── api.ts # API响应类型
├── middleware.ts # NextJS中间件(权限控制)
├── next.config.js # Next.js配置
├── tailwind.config.js # Tailwind配置
├── i18n.js # 国际化配置 [已完善]
└── tsconfig.json # TypeScript配置
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

## 国际化实现详情 [已完成]

### 翻译键组织结构

翻译文件采用分层结构，确保可维护性和可扩展性:

```json
{
  "common": {
    "buttons": {
      "submit": "提交",
      "cancel": "取消",
      "save": "保存"
    },
    "validation": {
      "required": "此字段为必填项",
      "email": "请输入有效的电子邮件地址"
    }
  },
  "components": {
    "form": {
      "required": "必填",
      "optional": "可选"
    },
    "table": {
      "noData": "暂无数据",
      "loading": "加载中..."
    }
  },
  "pages": {
    "dashboard": {
      "title": "仪表盘",
      "welcome": "欢迎回来，{{name}}"
    }
  }
}
```

### 动态内容国际化处理

对于动态内容，使用插值和复数形式:

```jsx
// 插值示例
t('welcome', { name: user.name })

// 复数形式示例
t('clientCount', { count: clients.length })
// 对应的翻译键:
// "clientCount": "{{count}} 个客户",
// "clientCount_plural": "{{count}} 个客户",
```

### RTL支持实现

为支持阿拉伯语等RTL语言，添加了以下功能:

1. **RTL检测与应用**:
```jsx
// RTLProvider组件
export const RTLProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};
```

2. **RTL专用样式**:
```css
/* rtl.css */
.rtl {
  direction: rtl;
  text-align: right;
}

.rtl .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

.rtl .mr-auto {
  margin-right: 0;
  margin-left: auto;
}
```

3. **组件RTL适配**:
```jsx
// 使用RTL感知的边距
<div className={`${isRTL ? 'ml-0 mr-4' : 'mr-0 ml-4'}`}>
  {children}
</div>
```

## 状态管理架构 [新增]

### React Query实现

采用React Query进行服务器状态管理，提供统一的数据获取、缓存和同步方案:

```jsx
// 基础查询hook
export function useConsultantClients(consultantId) {
  return useQuery({
    queryKey: ['consultant', consultantId, 'clients'],
    queryFn: () => fetchConsultantClients(consultantId),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: 2,
    onError: (error) => {
      toast.error('无法加载客户列表');
      console.error(error);
    }
  });
}

// 变更查询hook
export function useAddClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newClient) => createClient(newClient),
    onSuccess: () => {
      // 使缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['consultant', 'clients'] });
      toast.success('客户添加成功');
    },
    onError: (error) => {
      toast.error('添加客户失败');
      console.error(error);
    }
  });
}
```

### 全局状态与本地状态划分

1. **全局状态** (使用Context API):
   - 用户认证状态
   - UI主题设置
   - 语言偏好
   - 全局通知

2. **服务器状态** (使用React Query):
   - 用户数据
   - 客户列表
   - 表单数据
   - 分析数据

3. **本地组件状态** (使用useState/useReducer):
   - 表单输入
   - UI交互状态
   - 临时数据

### 缓存策略

```jsx
// 配置全局默认值
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

// 针对特定查询的自定义配置
const { data } = useQuery({
  queryKey: ['consultant', 'dashboard'],
  queryFn: fetchDashboardData,
  staleTime: 5 * 60 * 1000, // 5分钟
  cacheTime: 30 * 60 * 1000, // 30分钟
});
```

## 响应式设计标准 [新增]

### 断点定义

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  }
}
```

### 响应式设计原则

1. **移动优先设计**:
   - 默认样式针对移动设备
   - 使用媒体查询向上扩展

2. **流式布局**:
   - 使用百分比和相对单位
   - 避免固定宽度

3. **响应式组件**:
```jsx
// 响应式卡片组件
export const ResponsiveCard = ({ children }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div className="border rounded-lg p-4 h-full">
        {children}
      </div>
    </div>
  );
};
```

4. **响应式表格处理**:
```jsx
// 响应式表格
export const ResponsiveTable = ({ data, columns }) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, i) => (
          <div key={i} className="border rounded-lg p-4">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between py-2 border-b">
                <span className="font-medium">{column.title}</span>
                <span>{row[column.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <table className="min-w-full divide-y divide-gray-200">
      {/* 标准表格实现 */}
    </table>
  );
};
```

### 触摸友好设计

1. **适当的点击区域**:
```jsx
// 触摸友好按钮
<button className="p-4 sm:p-2 min-h-[44px] min-w-[44px]">
  {children}
</button>
```

2. **手势支持**:
```jsx
// 滑动组件
export const SwipeableItem = ({ onSwipe, children }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      onSwipe('left');
    }
    if (distance < -50) {
      onSwipe('right');
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};
```

## 性能优化策略 [新增]

### 组件懒加载

使用Next.js的动态导入功能实现组件懒加载:

```jsx
// 懒加载复杂组件
import dynamic from 'next/dynamic';

const DashboardAnalytics = dynamic(
  () => import('../components/dashboard/Analytics'),
  {
    loading: () => <SkeletonLoader height="400px" />,
    ssr: false // 对于客户端专用组件
  }
);
```

### 图片优化

使用Next.js的Image组件优化图片加载:

```jsx
import Image from 'next/image';

// 优化图片
<Image
  src="/images/consultant-dashboard.jpg"
  alt="顾问仪表盘"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  priority={isAboveFold}
/>
```

### 渲染性能优化

1. **使用React.memo避免不必要的重渲染**:
```jsx
const ClientCard = React.memo(({ client }) => {
  return (
    <div className="border p-4 rounded-lg">
      <h3>{client.name}</h3>
      <p>{client.email}</p>
    </div>
  );
});
```

2. **使用虚拟滚动处理大列表**:
```jsx
import { FixedSizeList } from 'react-window';

const ClientList = ({ clients }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="border-b p-4">
      <h3>{clients[index].name}</h3>
      <p>{clients[index].email}</p>
    </div>
  );
  
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={clients.length}
      itemSize={80}
    >
      {Row}
    </FixedSizeList>
  );
};
```

3. **使用useCallback和useMemo优化函数和计算**:
```jsx
const ClientAnalytics = ({ clients }) => {
  // 优化计算
  const statistics = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter(c => c.status === 'active').length,
      pending: clients.filter(c => c.status === 'pending').length,
    };
  }, [clients]);
  
  // 优化事件处理函数
  const handleExport = useCallback(() => {
    exportClientsToCSV(clients);
  }, [clients]);
  
  return (
    <div>
      <StatisticCard data={statistics} />
      <button onClick={handleExport}>导出数据</button>
    </div>
  );
};
```

## 错误处理与用户反馈 [新增]

### 全局错误边界

```jsx
// ErrorBoundary.tsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // 可以将错误发送到监控服务
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {this.props.fallbackHeading || '出现了问题'}
          </h2>
          <p className="mb-4">
            {this.props.fallbackMessage || '应用遇到了意外错误，请刷新页面重试。'}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 统一的Toast通知系统

```jsx
// ToastProvider.tsx
import { createContext, useContext, useState } from 'react';
import { Toast } from '../components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return {
    success: (message, duration) => context.addToast(message, 'success', duration),
    error: (message, duration) => context.addToast(message, 'error', duration),
    info: (message, duration) => context.addToast(message, 'info', duration),
    warning: (message, duration) => context.addToast(message, 'warning', duration),
  };
};
```

## 用户体验改进 [新增]

### 表单验证与反馈

使用统一的表单验证系统:

```jsx
// FormField组件示例
export const FormField = ({ 
  label, 
  name, 
  required, 
  error, 
  children 
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// 使用示例
const ClientForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField 
        label="客户姓名" 
        name="name" 
        required 
        error={errors.name?.message}
      >
        <input
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          {...register("name", { 
            required: "客户姓名为必填项" 
          })}
        />
      </FormField>
      
      <FormField 
        label="电子邮件" 
        name="email" 
        required 
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          {...register("email", {
            required: "电子邮件为必填项",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "请输入有效的电子邮件地址"
            }
          })}
        />
      </FormField>
      
      <button 
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        提交
      </button>
    </form>
  );
};
```

### 状态转换的视觉反馈

为用户操作提供清晰的视觉反馈:

```jsx
// 按钮加载状态示例
const ActionButton = ({ 
  children, 
  isLoading, 
  onClick, 
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded font-medium
        ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
        text-white transition-colors
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          处理中...
        </span>
      ) : children}
    </button>
  );
};

// 使用示例
const SaveClientButton = () => {
  const { mutate, isLoading } = useSaveClient();
  
  return (
    <ActionButton 
      isLoading={isLoading} 
      onClick={() => mutate(clientData)}
    >
      保存客户信息
    </ActionButton>
  );
};
```

### 骨架屏加载状态

为数据加载提供平滑的视觉过渡:

```jsx
// 客户列表骨架屏示例
const ClientListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 使用示例
const ClientList = () => {
  const { data: clients, isLoading } = useConsultantClients();
  
  if (isLoading) {
    return <ClientListSkeleton />;
  }
  
  return (
    <div className="space-y-4">
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
};
```

## 性能优化策略 [新增]

### 组件懒加载实现

使用Next.js的动态导入功能实现组件懒加载:

```jsx
// 懒加载复杂组件
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(
  () => import('../components/consultant/Analytics/AnalyticsChart'),
  {
    loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded"></div>,
    ssr: false // 对于客户端渲染的图表组件禁用SSR
  }
);

// 使用示例
const AnalyticsPage = () => {
  return (
    <div>
      <h1>业务分析</h1>
      <AnalyticsChart />
    </div>
  );
};
```

### 图片优化

使用Next.js的Image组件优化图片加载:

```jsx
import Image from 'next/image';

// 优化的响应式图片
const ProfileHeader = ({ consultant }) => {
  return (
    <div className="relative h-48 w-full">
      <Image
        src={consultant.coverImage || '/default-cover.jpg'}
        alt="Profile cover"
        fill
        sizes="100vw"
        priority={true}
        className="object-cover"
      />
      
      <div className="absolute -bottom-16 left-8">
        <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden">
          <Image
            src={consultant.avatar || '/default-avatar.jpg'}
            alt={consultant.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
```

### 虚拟滚动实现

对于长列表，使用虚拟滚动提高性能:

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

// 虚拟滚动列表
const VirtualizedClientList = ({ clients }) => {
  const parentRef = React.useRef();
  
  const rowVirtualizer = useVirtualizer({
    count: clients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });
  
  return (
    <div 
      ref={parentRef}
      className="h-[600px] overflow-auto border rounded"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            className="p-4 border-b"
          >
            <ClientListItem client={clients[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 渲染优化

使用React.memo和回调函数优化:

```jsx
// 使用React.memo避免不必要的重渲染
const ClientCard = React.memo(({ client, onSelect }) => {
  return (
    <div className="border rounded p-4">
      <h3>{client.name}</h3>
      <p>{client.email}</p>
      <button 
        onClick={() => onSelect(client.id)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
      >
        查看详情
      </button>
    </div>
  );
});

// 使用useCallback优化事件处理函数
const ClientListContainer = () => {
  const [selectedId, setSelectedId] = useState(null);
  
  // 使用useCallback避免每次渲染创建新函数
  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);
  
  return (
    <div>
      {clients.map(client => (
        <ClientCard 
          key={client.id} 
          client={client} 
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};
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

1. **状态管理优化** [当前优先级]
   - 引入React Query进行数据获取与缓存
   - 创建可复用的自定义hooks
   - 优化组件渲染性能

2. **响应式设计优化** [当前优先级]
   - 修复移动端布局问题
   - 优化表格在小屏幕上的显示
   - 实现更好的触摸体验

3. **用户体验改进** [当前优先级]
   - 增强表单验证与反馈
   - 优化状态转换的视觉反馈
   - 改进导航结构

4. **完成顾问仪表盘与客户管理界面** [下一阶段]
   - 实现顾问专用仪表盘
   - 完善客户管理功能
   - 添加业务分析视图

5. **实现顾问专用AI助手增强功能** [下一阶段]
   - 开发文档分析工具
   - 实现移民路径推荐
   - 增强表单填写辅助功能
   - 构建订阅与计费系统

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