const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const i18nextMiddleware = require('./middleware/i18n');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config');
const logger = require('./utils/logger');

// 导入路由
const routes = require('./routes');

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

// API路由
app.use('/api', routes);

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
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  // 使用i18n
  const message = req.t('errors.serverError', 'Something went wrong. Please try again later.');
  
  res.status(500).json({ message });
});

module.exports = app; 