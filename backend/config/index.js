const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
    host: process.env.HOST || '0.0.0.0',
  },
  
  mongodb: {
    uri: process.env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'thinkforward-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },
  
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    models: {
      chat: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo',
      embedding: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large',
    },
  },
  
  aws: {
    region: process.env.AWS_REGION,
    s3: {
      bucketName: process.env.AWS_BUCKET_NAME,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  
  email: {
    service: process.env.EMAIL_SERVICE,
    apiKey: process.env.EMAIL_API_KEY,
    fromAddress: process.env.EMAIL_FROM || 'no-reply@thinkforward.ai',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  
  ai: {
    // AI配置预设
    promptsDir: path.join(__dirname, '../ai/prompts'),
    knowledgeDir: path.join(__dirname, '../ai/knowledge'),
    messageLimit: {
      free: 20,
      basic: 100,
      premium: -1, // 无限制
      enterprise: -1,
    },
  },
  
  i18n: {
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    supportedLanguages: ['en', 'zh'],
    fallbackLanguage: 'en',
  },
};

module.exports = config; 