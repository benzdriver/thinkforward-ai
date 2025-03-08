require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const i18nMiddleware = require('./middleware/i18n');
const auth = require('./middleware/auth');
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./config');
const clerkWebhooks = require('./webhooks/clerkWebhook');
const authSyncMiddleware = require('./middleware/authSync');
const { scheduleDataSync } = require('./scripts/scheduledSync');

// 初始化数据库连接
connectDB();

// 路由导入
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const formRoutes = require('./routes/formRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(i18nMiddleware);

// 全局身份验证中间件
app.use(auth);

// 路由
app.use('/api/user', userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/form', formRoutes);
app.use('/api/ai', aiRoutes);

// 注册Clerk webhook路由
app.use('/api/webhooks/clerk', clerkWebhooks);

// 添加认证同步中间件
app.use(authSyncMiddleware);

// 启动定期数据同步
scheduleDataSync();

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = req.t ? req.t('errors.serverError', 'Server error') : 'Server error';
  
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { error: err.message } : {})
  });
});

// 设置未捕获的异常处理器
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// 连接到MongoDB
mongoose
  .connect(config.mongodb.uri, config.mongodb.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // 启动服务器
    const server = app.listen(config.server.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.server.port}`);
    });
    
    // 处理未处理的Promise拒绝
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });
    
    // 正常关闭处理
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        mongoose.connection.close(false, () => {
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }); 