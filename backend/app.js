const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const i18nextMiddleware = require('./middleware/i18n');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config');
const logger = require('./utils/logger');
const { auth } = require('./middleware/auth');
const clerkWebhookRoutes = require('./webhooks/clerkWebhook');

// 导入路由
const routes = require('./routes');
const uploadRoutes = require('./routes/uploadRoutes');
const healthRoutes = require('./routes/healthRoutes');

// 初始化Express应用
const app = express();

// 基本中间件
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
}

// 国际化中间件
app.use(i18nextMiddleware);

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Webhook路由 - 不需要认证
// 注意：这个路由必须在认证中间件前定义，因为webhook不需要认证
app.use('/api/webhooks/clerk', clerkWebhookRoutes);

// 认证中间件
app.use(auth);

// API路由
app.use('/api', routes);
app.use('/api/upload', uploadRoutes);
app.use('/api/health', healthRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    message: req.t('errors.notFound', 'Resource not found')
  });
});

// 全局错误处理
app.use(errorHandler);

// 在app.js底部，启动服务器之前添加
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  } else if(r.name === 'router' && r.handle.stack){
    r.handle.stack.forEach(function(h){
      if(h.route){
        console.log(h.route.path)
      }
    })
  }
});

module.exports = app; 