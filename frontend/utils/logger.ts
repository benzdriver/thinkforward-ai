// 定义日志级别
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4 // 完全禁用日志
}

// 获取当前环境的日志级别
const getCurrentLogLevel = (): LogLevel => {
  // 从环境变量获取日志级别，默认为生产环境INFO，开发环境DEBUG
  const levelName = process.env.NEXT_PUBLIC_LOG_LEVEL || 
                   (process.env.NODE_ENV === 'production' ? 'INFO' : 'DEBUG');
  
  switch (levelName.toUpperCase()) {
    case 'DEBUG': return LogLevel.DEBUG;
    case 'INFO': return LogLevel.INFO;
    case 'WARN': return LogLevel.WARN;
    case 'ERROR': return LogLevel.ERROR;
    case 'NONE': return LogLevel.NONE;
    default: return process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }
};

// 当前日志级别
const CURRENT_LOG_LEVEL = getCurrentLogLevel();

// 格式化日期时间
const formatDateTime = (): string => {
  return new Date().toISOString();
};

// 日志上下文信息
interface LogContext {
  component?: string;
  user?: string;
  [key: string]: any; // 允许添加其他任意上下文信息
}

// 创建日志记录器
class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  // 创建带上下文的新日志记录器实例
  withContext(additionalContext: LogContext): Logger {
    return new Logger({
      ...this.context,
      ...additionalContext
    });
  }

  // 格式化日志消息
  private formatMessage(level: string, message: string): string {
    let contextStr = '';
    if (Object.keys(this.context).length > 0) {
      contextStr = ` [${Object.entries(this.context)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}]`;
    }
    
    return `[${formatDateTime()}] [${level}]${contextStr} ${message}`;
  }

  // 日志方法
  debug(message: string, ...args: any[]): void {
    if (CURRENT_LOG_LEVEL <= LogLevel.DEBUG) {
      console.log(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (CURRENT_LOG_LEVEL <= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (CURRENT_LOG_LEVEL <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (CURRENT_LOG_LEVEL <= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }

  // 如果未来需要将日志发送到服务器
  async sendToServer(level: LogLevel, message: string, data?: any): Promise<void> {
    // 这是一个扩展点，可以在将来实现
    // 例如，向后端API发送日志数据
    /* 
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message,
          context: this.context,
          timestamp: new Date().toISOString(),
          data
        })
      });
    } catch (e) {
      // 失败静默处理，避免日志功能本身导致错误
      console.error('Failed to send log to server:', e);
    }
    */
  }
}

// 默认日志实例
export const defaultLogger = new Logger();

