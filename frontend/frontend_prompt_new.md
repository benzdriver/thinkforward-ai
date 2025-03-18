# ThinkForward移民AI助手前端设计指南 (3.0版)

## 版本历史
- v1.0-v1.3 (2023-11至2024-01): 初始文档与更新
- v2.0 (2024-05): 重新定位为"顾问优先"战略
- v3.0 (2024-06): 架构优化与国际化完善
- v3.1 (2024-06): 更新国际化实现策略，采用按页面组织翻译文件

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
│ ├── AIAssistant.tsx # AI助手组件
│ ├── Navbar.tsx # 导航栏组件
│ ├── OAuthButton.tsx # OAuth按钮组件
│ ├── SubscriptionBanner.tsx # 订阅横幅组件
│ ├── about/ # 关于页面组件
│ │ ├── Contact.tsx # 联系我们组件
│ │ ├── Hero.tsx # 英雄区组件
│ │ ├── Milestones.tsx # 里程碑组件
│ │ ├── MissionVision.tsx # 使命愿景组件
│ │ ├── Team.tsx # 团队组件
│ │ └── Values.tsx # 价值观组件
│ ├── animations/ # 动画组件
│ │ └── FadeInWhenVisible.tsx # 渐显动画组件
│ ├── auth/ # 认证相关组件
│ │ ├── AuthenticatedApp.tsx # 已认证应用组件
│ │ └── withPagePermission.tsx # 页面权限HOC
│ ├── common/ # 通用组件
│ ├── consultant/ # 顾问相关组件
│ │ └── dashboard/ # 顾问仪表盘组件
│ │   ├── ClientSummary.tsx # 客户概览组件
│ │   ├── EfficiencyMetrics.tsx # 效率指标组件
│ │   ├── RecentActivities.tsx # 最近活动组件
│ │   └── TasksList.tsx # 任务列表组件
│ ├── error/ # 错误处理组件
│ │ └── ErrorBoundary.tsx # 错误边界组件
│ ├── forms/ # 表单相关组件
│ │ ├── ImmigrationForm.tsx # 移民表单组件
│ │ └── ProfileForm.tsx # 个人资料表单组件
│ ├── layout/ # 布局组件
│ │ ├── AuthLayout.tsx # 认证布局组件
│ │ ├── ConsultantLayout.tsx # 顾问布局组件
│ │ ├── DashboardLayout.tsx # 仪表盘布局组件
│ │ ├── Footer.tsx # 页脚组件
│ │ ├── Header.tsx # 页头组件
│ │ ├── PublicLayout.tsx # 公共布局组件
│ │ ├── RTLWrapper.tsx # RTL包装器组件
│ │ ├── Sidebar.tsx # 侧边栏组件
│ │ └── index.ts # 布局组件导出
│ ├── pricing/ # 定价相关组件
│ │ ├── PlanFeature.tsx # 计划特性组件
│ │ ├── SubscriptionForm.tsx # 订阅表单组件
│ │ ├── TestimonialCard.tsx # 推荐卡片组件
│ │ └── ValueProposition.tsx # 价值主张组件
│ └── ui/ # UI基础组件
│   ├── Alert.tsx # 提示组件
│   ├── Avatar.tsx # 头像组件
│   ├── Badge.tsx # 徽章组件
│   ├── Breadcrumb.tsx # 面包屑组件
│   ├── Button.tsx # 按钮组件
│   ├── Card.tsx # 卡片组件
│   ├── Checkbox.tsx # 复选框组件
│   ├── DataTable.tsx # 数据表格组件
│   ├── Divider.tsx # 分割线组件
│   ├── Empty.tsx # 空状态组件
│   ├── FileUpload.tsx # 文件上传组件
│   ├── Form/ # 表单组件
│   │ ├── Form.tsx # 表单组件
│   │ ├── FormField.tsx # 表单字段组件
│   │ ├── FormFooter.tsx # 表单页脚组件
│   │ ├── FormItem.tsx # 表单项组件
│   │ ├── FormSection.tsx # 表单分区组件
│   │ └── index.ts # 表单组件导出
│   ├── Input.tsx # 输入框组件
│   ├── LanguageSwitcher.tsx # 语言切换器组件
│   ├── LoadingScreen.tsx # 加载屏幕组件
│   ├── Modal.tsx # 模态框组件
│   ├── Pagination.tsx # 分页组件
│   ├── PasswordInput.tsx # 密码输入组件
│   ├── PermissionGuard.tsx # 权限守卫组件
│   ├── Radio.tsx # 单选框组件
│   ├── RadioGroup.tsx # 单选框组组件
│   ├── Select.tsx # 选择框组件
│   ├── Skeleton.tsx # 骨架屏组件
│   ├── Switch.tsx # 开关组件
│   ├── Table.tsx # 表格组件
│   ├── Tabs.tsx # 标签页组件
│   ├── Tag.tsx # 标签组件
│   ├── TextArea.tsx # 文本域组件
│   ├── Tooltip.tsx # 提示框组件
│   ├── VerificationInput.tsx # 验证码输入组件
│   └── index.ts # UI组件导出
├── config/ # 配置文件
│ └── api.ts # API配置
├── contexts/ # React Context
│ └── AuthContext.tsx # 认证上下文
├── hooks/ # 自定义Hooks
│ ├── usePermission.ts # 权限Hook
│ └── useUserRole.ts # 用户角色Hook
├── middleware/ # 中间件
│ └── withPermission.ts # 权限中间件
├── pages/ # 页面组件和路由
│ ├── _app.tsx # 应用入口
│ ├── _document.tsx # 文档结构
│ ├── about.tsx # 关于页面
│ ├── admin/ # 管理员页面
│ │ ├── consultants.tsx # 顾问管理页面
│ │ ├── dashboard.tsx # 管理员仪表盘
│ │ ├── settings.tsx # 设置页面
│ │ └── users.tsx # 用户管理页面
│ ├── api/ # API路由
│ │ ├── log/ # 日志API
│ │ │ ├── clear.ts # 清除日志
│ │ │ ├── export.ts # 导出日志
│ │ │ └── view.ts # 查看日志
│ │ ├── log.ts # 日志API入口
│ │ └── users/ # 用户API
│ │   └── role.ts # 角色API
│ ├── assessment/ # 评估页面
│ │ └── result.tsx # 评估结果页面
│ ├── auth/ # 认证页面
│ │ ├── forgot-password.tsx # 忘记密码页面
│ │ ├── login.tsx # 登录页面
│ │ ├── register.tsx # 注册页面
│ │ └── verify.tsx # 验证页面
│ ├── client/ # 客户页面
│ │ ├── chat.tsx # 聊天页面
│ │ ├── consultant.tsx # 顾问页面
│ │ ├── documents.tsx # 文档页面
│ │ ├── forms.tsx # 表单页面
│ │ └── profile.tsx # 个人资料页面
│ ├── consultant/ # 顾问页面
│ │ ├── clients/ # 客户管理页面
│ │ │ ├── [id]/ # 特定客户页面
│ │ │ │ ├── cases/ # 案例管理页面
│ │ │ │ │ ├── [caseId]/ # 特定案例页面
│ │ │ │ │ │ └── edit.tsx # 编辑案例页面
│ │ │ │ │ ├── [caseId].tsx # 案例详情页面
│ │ │ │ │ └── new.tsx # 新建案例页面
│ │ │ │ ├── documents/ # 文档管理页面
│ │ │ │ │ └── upload.tsx # 上传文档页面
│ │ │ │ └── edit.tsx # 编辑客户页面
│ │ │ ├── [id].tsx # 客户详情页面
│ │ │ └── new.tsx # 新建客户页面
│ │ ├── clients.tsx # 客户列表页面
│ │ ├── dashboard.tsx # 顾问仪表盘页面
│ │ ├── plans.tsx # 计划页面
│ │ └── review.tsx # 审核页面
│ ├── dashboard.tsx # 仪表盘页面
│ ├── guest/ # 访客页面
│ │ └── dashboard.tsx # 访客仪表盘页面
│ ├── index.tsx # 首页
│ ├── initial-assessment.tsx # 初始评估页面
│ ├── landing.tsx # 落地页
│ ├── pricing.tsx # 定价页面
│ ├── sign-in/ # 登录页面
│ │ └── [[...index]].tsx # 登录页面入口
│ ├── sign-up/ # 注册页面
│ │ └── [[...index]].tsx # 注册页面入口
│ ├── subscription/ # 订阅页面
│ │ ├── index.tsx # 订阅页面入口
│ │ └── success.tsx # 订阅成功页面
│ └── test.tsx # 测试页面
├── public/ # 公共资源
│ ├── favicon.ico # 网站图标
│ ├── images/ # 图片资源
│ │ ├── hero-background.jpg # 英雄区背景
│ │ └── logo.png # 网站Logo
│ └── locales/ # 国际化翻译文件
│   ├── ar/ # 阿拉伯语翻译
│   │ ├── about.json # 关于页面翻译
│   │ ├── auth.json # 认证页面翻译
│   │ ├── common.json # 通用翻译
│   │ ├── dashboard.json # 仪表盘翻译
│   │ ├── index.json # 首页翻译
│   │ ├── landing.json # 落地页翻译
│   │ ├── layout.json # 布局翻译
│   │ ├── pricing.json # 定价页面翻译
│   │ └── sign-in.json # 登录页面翻译
│   ├── en/ # 英语翻译
│   │ ├── about.json # 关于页面翻译
│   │ ├── auth.json # 认证页面翻译
│   │ ├── common.json # 通用翻译
│   │ ├── consultant.json # 顾问页面翻译
│   │ ├── dashboard.json # 仪表盘翻译
│   │ ├── index.json # 首页翻译
│   │ ├── landing.json # 落地页翻译
│   │ ├── layout.json # 布局翻译
│   │ ├── pricing.json # 定价页面翻译
│   │ ├── sign-in.json # 登录页面翻译
│   │ └── sign-up.json # 注册页面翻译
│   ├── fr/ # 法语翻译
│   │ ├── about.json # 关于页面翻译
│   │ ├── auth.json # 认证页面翻译
│   │ ├── common.json # 通用翻译
│   │ ├── consultant.json # 顾问页面翻译
│   │ ├── dashboard.json # 仪表盘翻译
│   │ ├── index.json # 首页翻译
│   │ ├── landing.json # 落地页翻译
│   │ ├── layout.json # 布局翻译
│   │ ├── pricing.json # 定价页面翻译
│   │ └── sign-in.json # 登录页面翻译
│   ├── ja/ # 日语翻译
│   │ ├── about.json # 关于页面翻译
│   │ ├── auth.json # 认证页面翻译
│   │ ├── common.json # 通用翻译
│   │ ├── dashboard.json # 仪表盘翻译
│   │ ├── index.json # 首页翻译
│   │ ├── landing.json # 落地页翻译
│   │ ├── layout.json # 布局翻译
│   │ ├── pricing.json # 定价页面翻译
│   │ └── sign-in.json # 登录页面翻译
│   ├── ko/ # 韩语翻译
│   │ ├── about.json # 关于页面翻译
│   │ ├── auth.json # 认证页面翻译
│   │ ├── common.json # 通用翻译
│   │ ├── dashboard.json # 仪表盘翻译
│   │ ├── index.json # 首页翻译
│   │ ├── landing.json # 落地页翻译
│   │ ├── layout.json # 布局翻译
│   │ ├── pricing.json # 定价页面翻译
│   │ └── sign-in.json # 登录页面翻译
│   ├── zh-CN/ # 简体中文翻译
│   │ ├── about.json # 关于页面翻译
│   │ ├── auth.json # 认证页面翻译
│   │ ├── common.json # 通用翻译
│   │ ├── consultant.json # 顾问页面翻译
│   │ ├── dashboard.json # 仪表盘翻译
│   │ ├── index.json # 首页翻译
│   │ ├── landing.json # 落地页翻译
│   │ ├── layout.json # 布局翻译
│   │ ├── pricing.json # 定价页面翻译
│   │ ├── sign-in.json # 登录页面翻译
│   │ └── sign-up.json # 注册页面翻译
│   └── zh-TW/ # 繁体中文翻译
│       ├── about.json # 关于页面翻译
│       ├── auth.json # 认证页面翻译
│       ├── common.json # 通用翻译
│       ├── consultant.json # 顾问页面翻译
│       ├── dashboard.json # 仪表盘翻译
│       ├── index.json # 首页翻译
│       ├── landing.json # 落地页翻译
│       ├── layout.json # 布局翻译
│       ├── pricing.json # 定价页面翻译
│       └── sign-in.json # 登录页面翻译
├── scripts/ # 脚本文件
│ ├── check-env.js # 环境检查脚本
│ └── replace-console-logs.js # 替换控制台日志脚本
├── styles/ # 样式文件
│ ├── clerk-overrides.css # Clerk样式覆盖
│ ├── globals.css # 全局样式
│ └── rtl.css # RTL样式
├── types/ # TypeScript类型定义
│ ├── consultant.ts # 顾问类型
│ ├── subscription.ts # 订阅类型
│ └── user.ts # 用户类型
└── utils/ # 工具函数
    ├── api.ts # API工具
    ├── hybridLogger.ts # 混合日志工具
    ├── i18n.ts # 国际化工具
    ├── logger.ts # 日志工具
    └── mongodb.ts # MongoDB工具
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
// 动态导入重量级组件
const AIAssistant = dynamic(() => import('@/components/AIAssistant'), {
  loading: () => <Skeleton height="500px" />,
  ssr: false // 对于客户端专用组件禁用SSR
});

// 动态导入整个页面
const DashboardPage = dynamic(() => import('@/pages/dashboard/index'), {
  loading: () => <LoadingScreen />,
});
```

### 图片优化

使用Next.js的Image组件优化图片加载:

```jsx
// 优化图片加载
<Image
  src="/images/hero-background.jpg"
  alt="Hero Background"
  width={1200}
  height={600}
  priority={true} // 对于首屏图片
  placeholder="blur" // 使用模糊占位符
  blurDataURL="data:image/jpeg;base64,..." // 低质量图片占位符
  loading="lazy" // 对于非首屏图片
/>
```

### 虚拟列表

对于长列表使用虚拟化技术:

```jsx
// 使用react-window实现虚拟列表
import { FixedSizeList } from 'react-window';

const VirtualizedClientList = ({ clients }) => (
  <FixedSizeList
    height={500}
    width="100%"
    itemCount={clients.length}
    itemSize={60}
  >
    {({ index, style }) => (
      <div style={style}>
        <ClientListItem client={clients[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

### 代码分割

利用Next.js的自动代码分割功能:

```jsx
// 页面级代码分割 (Next.js自动处理)
// pages/consultant/dashboard.tsx
export default function ConsultantDashboard() {
  return <DashboardLayout>...</DashboardLayout>;
}

// 手动代码分割
const AnalyticsCharts = dynamic(() => import('@/components/AnalyticsCharts'), {
  ssr: false
});
```

### 缓存优化

使用React Query实现数据缓存:

```jsx
// 使用React Query缓存API数据
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
    staleTime: 5 * 60 * 1000, // 5分钟
    cacheTime: 30 * 60 * 1000, // 30分钟
  });
}

// 预取数据
export function prefetchClients() {
  return queryClient.prefetchQuery({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
  });
}
```

### 组件优化

使用React.memo和useMemo优化组件渲染:

```jsx
// 使用React.memo避免不必要的重渲染
const ClientCard = React.memo(({ client }) => {
  return (
    <Card>
      <h3>{client.name}</h3>
      <p>{client.email}</p>
    </Card>
  );
});

// 使用useMemo优化计算
function ClientAnalytics({ clientData }) {
  const statistics = useMemo(() => {
    return calculateStatistics(clientData);
  }, [clientData]);
  
  return <AnalyticsDisplay data={statistics} />;
}
```

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

## 国际化实现最佳实践 [新增]

### 1. 组件级翻译

使用翻译Hook在组件内部实现国际化:

```jsx
// Button.tsx
import { useTranslation } from 'next-i18next';

export const Button = ({ children, ...props }) => {
  const { t } = useTranslation('common');
  
  return (
    <button {...props}>
      {t(children)}
    </button>
  );
};
```

### 2. 页面级翻译

在页面级别使用getStaticProps或getServerSideProps加载翻译:

```jsx
// pages/consultant/dashboard.tsx
export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'consultant'
      ])),
    },
  };
};
```

### 3. 日期和数字格式化

使用Intl API实现日期和数字的本地化:

```jsx
// 日期格式化
export const formatDate = (date, locale) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// 数字格式化
export const formatCurrency = (amount, locale, currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};
```

### 4. RTL支持

为阿拉伯语等RTL语言提供布局支持:

```jsx
// RTLWrapper.tsx
import { useRouter } from 'next/router';

export const RTLWrapper = ({ children }) => {
  const { locale } = useRouter();
  const rtlLocales = ['ar']; // RTL语言列表
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';
  
  return (
    <div dir={dir} className={dir === 'rtl' ? 'rtl-layout' : ''}>
      {children}
    </div>
  );
};
```

### 5. 语言切换器

实现语言切换功能:

```jsx
// LanguageSwitcher.tsx
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'fr', name: 'Français' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' }
  ];
  
  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };
  
  return (
    <div className="language-switcher">
      <select
        value={router.locale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="form-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
```

## 开发规范与最佳实践

### 1. 组件命名与文件结构

- 使用PascalCase命名组件和组件文件
- 每个组件一个文件
- 相关组件放在同一目录下
- 使用index.ts导出组件

### 2. 样式规范

- 使用Tailwind CSS实现样式
- 复杂组件使用组合类名
- 自定义样式使用@apply指令
- 响应式设计使用Tailwind断点

### 3. 状态管理

- 简单状态使用useState和useReducer
- 跨组件状态使用Context API
- 服务器状态使用React Query
- 避免过度使用全局状态

### 4. 性能优化

- 使用React.memo避免不必要的重渲染
- 使用useMemo和useCallback优化性能
- 实现组件懒加载
- 优化图片和资源加载

### 5. 错误处理

- 使用错误边界捕获渲染错误
- 统一处理API错误
- 提供用户友好的错误提示
- 记录错误日志

### 6. 国际化

- 所有用户可见文本使用翻译函数
- 支持RTL布局
- 本地化日期、数字和货币
- 提供语言切换功能

## 后续开发计划

1. **完成顾问体验优化** [进行中]
   - 完善顾问仪表盘
   - 优化客户管理界面
   - 增强AI助手功能
   - 实现表单自动化工具

2. **增强国际化支持** [进行中]
   - 完成所有语言翻译
   - 优化RTL布局支持
   - 实现完整的日期和数字格式化

3. **性能优化** [计划中]
   - 实现代码分割
   - 优化首屏加载时间
   - 实现虚拟列表
   - 优化大型表单性能

4. **扩展客户体验** [未来计划]
   - 设计客户仪表盘
   - 实现客户自助服务功能
   - 开发客户端AI助手
   - 优化移动端体验
   - 实现客户文档管理系统
   - 开发进度追踪功能
   - 添加多语言实时聊天支持

5. **安全与合规** [计划中]
   - 实现高级数据加密
   - 完善隐私控制选项
   - 添加双因素认证
   - 实现合规性报告生成
   - 开发数据保留策略工具

## 技术债务与优化计划

1. **重构优先级**
   - 统一错误处理机制 [高]
   - 优化组件树结构 [中]
   - 重构API调用逻辑 [高]
   - 优化状态管理 [中]
   - 重构国际化实现 [已完成]

2. **测试覆盖**
   - 实现核心组件单元测试 [高]
   - 添加集成测试 [中]
   - 实现端到端测试 [低]
   - 添加性能测试 [中]

3. **文档完善**
   - 更新组件文档 [高]
   - 完善API文档 [中]
   - 创建开发指南 [中]
   - 编写国际化指南 [已完成]

## 结论

ThinkForward移民AI助手前端架构已完成重大更新，重点关注顾问体验优化和国际化支持。通过采用现代前端技术和最佳实践，我们已经建立了一个可扩展、高性能且用户友好的平台，为移民顾问提供AI赋能的工具，并为未来扩展至直接服务终端用户奠定了基础。

---

**文档维护**: ThinkForward开发团队  
**最后更新**: 2024-06-27 