import i18next from 'i18next';
// 日志级别类型
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 日志条目接口
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  source?: string;
}

// 在配置接口添加
interface HybridLoggerConfig {
  // 日志级别
  minLevel: LogLevel;
  // 控制台输出
  consoleOutput: boolean;
  // 保存到本地存储 - 设置为false
  localStorageOutput: boolean;
  // 发送到服务器 - 确保为true
  serverOutput: boolean;
  // 本地存储键名 (仅在localStorageOutput为true时使用)
  storageKey: string;
  // 最大日志条目数
  maxEntries: number;
  // 服务器日志API端点
  logEndpoint: string;
  // 服务器日志批处理大小 - 减小批处理大小以更快发送
  batchSize: number;
  // 批处理发送间隔(ms) - 减小间隔以更快发送
  batchInterval: number;
  useSubmitBeacon: boolean;
  consoleFormat?: 'json' | 'pretty'; // 新增控制台格式选项
}

// 默认配置
const config: HybridLoggerConfig = {
  // 日志级别
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  // 控制台输出
  consoleOutput: true,
  // 保存到本地存储 - 设置为false
  localStorageOutput: false,
  // 发送到服务器 - 确保为true
  serverOutput: false,
  // 本地存储键名 (仅在localStorageOutput为true时使用)
  storageKey: 'app_logs',
  // 最大日志条目数
  maxEntries: 1000,
  // 服务器日志API端点
  logEndpoint: '/api/log',
  // 服务器日志批处理大小 - 减小批处理大小以更快发送
  batchSize: 10,
  // 批处理发送间隔(ms) - 减小间隔以更快发送
  batchInterval: 5000,
  useSubmitBeacon: false,
  consoleFormat: 'pretty', // 默认使用友好格式
};

// 日志级别排序
const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// 日志队列(用于批处理发送)
let logQueue: LogEntry[] = [];
let batchSendTimer: NodeJS.Timeout | null = null;

// Add a flag to prevent recursive logging
let isCurrentlyLogging = false;

// 添加递归调用保护
let isLogging = false;

// 判断是否应该记录此级别的日志
const shouldLog = (level: LogLevel): boolean => {
  return logLevels[level] >= logLevels[config.minLevel as LogLevel];
};

// 从localStorage获取现有日志 - 保留但默认不使用
const getStoredLogs = (): LogEntry[] => {
  if (typeof window === 'undefined' || !config.localStorageOutput) return [];
  
  try {
    const storedLogs = localStorage.getItem(config.storageKey);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (e) {
    console.error('Failed to retrieve logs from localStorage:', e);
    return [];
  }
};

// 保存日志到localStorage - 保留但默认不使用
const saveToLocalStorage = (entry: LogEntry) => {
  if (typeof window === 'undefined' || !config.localStorageOutput) return;
  
  try {
    // 获取现有日志
    let logs = getStoredLogs();
    
    // 添加新日志
    logs.push(entry);
    
    // 如果超出最大条目数，删除旧的
    if (logs.length > config.maxEntries) {
      logs = logs.slice(-config.maxEntries);
    }
    
    // 保存回localStorage
    localStorage.setItem(config.storageKey, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save log to localStorage:', e);
  }
};

// 将日志添加到发送队列 - 增强可靠性
const addToSendQueue = (entry: LogEntry) => {
  if (!config.serverOutput) return;
  
  // 添加到队列
  logQueue.push(entry);
  
  // 如果队列长度达到批处理大小，立即发送
  if (logQueue.length >= config.batchSize) {
    sendLogsToServer();
  }
  
  // 如果定时器不存在，启动一个
  if (!batchSendTimer && logQueue.length < config.batchSize) {
    batchSendTimer = setTimeout(sendLogsToServer, config.batchInterval);
  }
};

// 发送日志到服务器 - 增强错误处理和重试逻辑
const sendLogsToServer = async () => {
  if (logQueue.length === 0 || isLogging) return;

  isLogging = true;

  try {
    // 记录请求开始
    logger.debug('Sending logs to server', {
      endpoint: config.logEndpoint,
      batchSize: logQueue.length,
    });

    const response = await fetch(config.logEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clerk-token') || ''}`,
      },
      body: JSON.stringify(logQueue),
    });

    // 记录响应状态
    logger.debug('Received response from server', {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      throw new Error(`Failed to send logs: ${response.statusText}`);
    }

    // 清空日志队列
    logQueue = [];
  } catch (error) {
    logger.error('Failed to send logs to server', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    storeLogsLocally(logQueue);
    logQueue = [];
  } finally {
    isLogging = false;
  }
};

// 导出日志到文件 - 修改为从服务器获取日志
const exportLogs = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // 从服务器获取日志
    const response = await fetch(`${config.logEndpoint}/export`, {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.status}`);
    }
    
    // 获取日志数据
    const logs = await response.json();
    
    // 将日志格式化为可读文本
    const logText = logs.map((log: LogEntry) => 
      `[${log.timestamp}] [${log.level.toUpperCase()}]${log.source ? ` [${log.source}]` : ''} ${log.message} ${log.context ? JSON.stringify(log.context) : ''}`
    ).join('\n');
    
    // 创建Blob对象
    const blob = new Blob([logText], { type: 'text/plain' });
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `application-logs-${new Date().toISOString().slice(0, 10)}.log`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (error) {
    console.error('Failed to export logs:', error);
    alert('导出日志失败，请稍后再试');
  }
};

// 清除所有日志 - 修改为清除服务器日志
const clearLogs = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    const response = await fetch(`${config.logEndpoint}/clear`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to clear logs: ${response.status}`);
    }
    
    alert('日志已成功清除');
  } catch (error) {
    console.error('Failed to clear logs:', error);
    alert('清除日志失败，请稍后再试');
  }
};

// 记录到控制台
const logToConsole = (level: LogLevel, message: string, context?: any, source?: string) => {
  // Prevent recursive logging
  if (isCurrentlyLogging) return;
  
  try {
    isCurrentlyLogging = true;
    
    if (!config.consoleOutput) return;
    
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] [${level.toUpperCase()}]${source ? ` [${source}]` : ''} ${message}`;
    
    switch (level) {
      case 'debug':
        console.debug(fullMessage, context || '');
        break;
      case 'info':
        console.info(fullMessage, context || '');
        break;
      case 'warn':
        console.warn(fullMessage, context || '');
        break;
      case 'error':
        console.error(fullMessage, context || '');
        break;
    }
  } finally {
    isCurrentlyLogging = false;
  }
};

// 创建日志方法 - 优先发送到服务器
const createLogMethod = (level: LogLevel) => (message: string, context?: any, source?: string) => {
  if (isCurrentlyLogging) return;
  isCurrentlyLogging = true;

  try {
    if (!shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = { timestamp, level, message, context, source };

    // 修改后的控制台输出
    if (config.consoleOutput) {
      const color = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m'  // Red
      }[level];

      const logParts = [
        `${color}[${timestamp}]`,
        `${level.toUpperCase()}:`,
        `\x1b[0m${message}`,
        context ? JSON.stringify(context, null, 2) : '',
        source ? `(来源: ${source})` : ''
      ];

      // 使用原生console方法避免循环
      const originalConsoleMethod = console[level];
      originalConsoleMethod(logParts.filter(Boolean).join(' '));
    }
    
    // 添加到发送队列 - 优先于localStorage
    if (config.serverOutput) {
      addToSendQueue(logEntry);
    }
    
    // 保存到本地存储 (如果启用)
    if (config.localStorageOutput) {
      saveToLocalStorage(logEntry);
    }
  } finally {
    isCurrentlyLogging = false;
  }
};

// 安装控制台覆盖 - 保持不变
const installConsoleOverride = () => {
  if (typeof window === 'undefined') return;

  const originalConsole = {
    debug: console.debug,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  };

  console.debug = (...args: any[]) => {
    if (isCurrentlyLogging) return;
    isCurrentlyLogging = true;
    try {
      logger.debug(args[0], args.slice(1), 'console');
      originalConsole.debug(...args);
    } finally {
      isCurrentlyLogging = false;
    }
  };

  console.log = (...args: any[]) => {
    if (isCurrentlyLogging) return;
    isCurrentlyLogging = true;
    try {
      logger.debug(args[0], args.slice(1), 'console');
      originalConsole.log(...args);
    } finally {
      isCurrentlyLogging = false;
    }
  };

  console.info = (...args: any[]) => {
    if (isCurrentlyLogging) return;
    isCurrentlyLogging = true;
    try {
      logger.info(args[0], args.slice(1), 'console');
      originalConsole.info(...args);
    } finally {
      isCurrentlyLogging = false;
    }
  };

  console.warn = (...args: any[]) => {
    if (isCurrentlyLogging) return;
    isCurrentlyLogging = true;
    try {
      logger.warn(args[0], args.slice(1), 'console');
      originalConsole.warn(...args);
    } finally {
      isCurrentlyLogging = false;
    }
  };

  console.error = (...args: any[]) => {
    if (isCurrentlyLogging) return;
    isCurrentlyLogging = true;
    try {
      logger.error(args[0], args.slice(1), 'console');
      originalConsole.error(...args);
    } finally {
      isCurrentlyLogging = false;
    }
  };
};

// 修复 i18next 事件监听
// 监听i18next事件
if (typeof i18next !== 'undefined') {
  i18next.on('initialized', function(options: any) {
    logger.info('I18next initialized', options, 'i18next');
  });
  
  i18next.on('loaded', function(loaded: any) {
    logger.info('I18next resources loaded', loaded, 'i18next');
  });
  
  i18next.on('failedLoading', function(lng: string, ns: string, msg: string) {
    logger.error(`I18next failed loading ${lng}/${ns}: ${msg}`, {lng, ns, msg}, 'i18next');
  });
} else {
  console.debug('i18next not available for event listeners');
}

// 创建日志查看UI组件 - 修改为从服务器获取日志
const createLogViewer = () => {
  // 为避免代码过长，这部分代码被省略
  // 您需要修改此函数以从服务器获取日志而不是localStorage
  
  // 创建一个基本的日志查看器，从服务器获取日志
  if (typeof window === 'undefined') return () => {};
  
  // 创建容器
  const container = document.createElement('div');
  container.id = 'hybrid-log-viewer';
  container.style.position = 'fixed';
  container.style.zIndex = '9999';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.width = '80%';
  container.style.height = '50%';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  container.style.color = 'white';
  container.style.padding = '10px';
  container.style.overflow = 'auto';
  container.style.fontFamily = 'monospace';
  container.style.fontSize = '12px';
  
  // 添加标题和控制按钮
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '10px';
  
  const title = document.createElement('h3');
  title.textContent = '应用日志查看器';
  title.style.margin = '0';
  
  const buttonContainer = document.createElement('div');
  
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = '刷新';
  refreshBtn.style.marginRight = '5px';
  
  const exportBtn = document.createElement('button');
  exportBtn.textContent = '导出';
  exportBtn.style.marginRight = '5px';
  
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '清除';
  clearBtn.style.marginRight = '5px';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '关闭';
  
  buttonContainer.appendChild(refreshBtn);
  buttonContainer.appendChild(exportBtn);
  buttonContainer.appendChild(clearBtn);
  buttonContainer.appendChild(closeBtn);
  
  header.appendChild(title);
  header.appendChild(buttonContainer);
  
  container.appendChild(header);
  
  // 日志内容区域
  const logContent = document.createElement('div');
  container.appendChild(logContent);
  
  // 从服务器获取日志的函数
  const fetchLogsFromServer = async () => {
    try {
      const response = await fetch(`${config.logEndpoint}/view`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      return [];
    }
  };
  
  // 渲染日志
  const renderLogs = async () => {
    const logs = await fetchLogsFromServer();
    
    logContent.innerHTML = '';
    
    if (logs.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = '没有可显示的日志';
      logContent.appendChild(emptyMessage);
      return;
    }
    
    logs.forEach((log: LogEntry) => {
      const logEntry = document.createElement('div');
      logEntry.className = `log-entry log-${log.level}`;
      
      // 创建时间戳
      const timestamp = document.createElement('span');
      timestamp.className = 'log-timestamp';
      timestamp.textContent = `[${log.timestamp}]`;
      timestamp.style.color = '#888';
      
      // 创建级别标签
      const level = document.createElement('span');
      level.className = `log-level log-level-${log.level}`;
      level.textContent = `[${log.level.toUpperCase()}]`;
      switch (log.level) {
        case 'debug':
          level.style.color = '#8a8a8a';
          break;
        case 'info':
          level.style.color = '#4a90e2';
          break;
        case 'warn':
          level.style.color = '#f5a623';
          break;
        case 'error':
          level.style.color = '#d0021b';
          break;
      }
      
      // 创建源标签
      const source = document.createElement('span');
      source.className = 'log-source';
      if (log.source) {
        source.textContent = `[${log.source}]`;
        source.style.color = '#9013fe';
      }
      
      // 创建消息
      const message = document.createElement('span');
      message.className = 'log-message';
      message.textContent = ` ${log.message}`;
      
      // 创建上下文
      const context = document.createElement('span');
      context.className = 'log-context';
      if (log.context) {
        context.textContent = ` ${typeof log.context === 'string' ? log.context : JSON.stringify(log.context)}`;
        context.style.color = '#50e3c2';
      }
      
      logEntry.appendChild(timestamp);
      logEntry.appendChild(document.createTextNode(' '));
      logEntry.appendChild(level);
      logEntry.appendChild(document.createTextNode(' '));
      if (log.source) {
        logEntry.appendChild(source);
        logEntry.appendChild(document.createTextNode(' '));
      }
      logEntry.appendChild(message);
      if (log.context) {
        logEntry.appendChild(context);
      }
      
      logContent.appendChild(logEntry);
    });
    
    // 滚动到底部
    logContent.scrollTop = logContent.scrollHeight;
  };
  
  // 按钮事件
  refreshBtn.onclick = renderLogs;
  exportBtn.onclick = exportLogs;
  clearBtn.onclick = async () => {
    await clearLogs();
    renderLogs();
  };
  closeBtn.onclick = () => {
    const viewer = document.getElementById('hybrid-log-viewer');
    if (viewer) {
      document.body.removeChild(viewer);
    }
  };
  
  // 初始渲染
  renderLogs();
  
  // 添加键盘快捷键以刷新日志
  const refreshHandler = (e: KeyboardEvent) => {
    if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault();
      renderLogs();
    }
  };
  
  document.addEventListener('keydown', refreshHandler);
  
  // 添加到文档
  document.body.appendChild(container);
  
  // 返回清理函数
  return () => {
    document.removeEventListener('keydown', refreshHandler);
    const viewer = document.getElementById('hybrid-log-viewer');
    if (viewer) {
      document.body.removeChild(viewer);
    }
  };
};

// 确保日志在组件卸载后被发送
const flushLogs = () => {
  if (logQueue.length > 0) {
    sendLogsToServer();
  }
};

// Add this function to store logs locally
const storeLogsLocally = (logs: LogEntry[]) => {
  try {
    localStorage.setItem('local_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to store logs locally:', error);
  }
};

// 导出日志对象
export const logger = {
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
  
  // 导出和查看功能
  exportLogs,
  clearLogs,
  createLogViewer,
  flushLogs,
  
  // 配置方法
  configure: (options: Partial<typeof config>) => {
    Object.assign(config, options);
  },
  
  // 安装控制台覆盖
  installConsoleOverride,
  
  // 获取所有存储的日志 - 修改为从服务器获取
  getLogs: async () => {
    if (config.localStorageOutput) {
      return getStoredLogs();
    } else {
      try {
        const response = await fetch(`${config.logEndpoint}/view`, {
          credentials: 'include'
        });
        if (!response.ok) return [];
        return await response.json();
      } catch (error) {
        console.error('Failed to get logs:', error);
        return [];
      }
    }
  },
  
  // Add a method to enable server logging when endpoint is ready
  enableServerLogging: function(endpoint?: string) {
    config.serverOutput = true;
    if (endpoint) {
      config.logEndpoint = endpoint;
    }
    return this;
  },
  
  // Add this method
  captureI18nextLogs: function() {
    if (typeof window !== 'undefined' && i18next) {
      try {
        // Listen for i18next initialization
        i18next.on('initialized', (options) => {
          logger.debug('i18next initialized', options, 'i18next');
        });
        
        // Listen for language changes
        i18next.on('languageChanged', (lng) => {
          logger.debug('i18next language changed', { language: lng }, 'i18next');
        });
        
        // Listen for loading failures
        i18next.on('failedLoading', (lng, ns, msg) => {
          logger.error('i18next failed loading', { language: lng, namespace: ns, message: msg }, 'i18next');
        });
        
        // Listen for missing keys
        i18next.on('missingKey', (lngs, namespace, key, res) => {
          logger.warn('i18next missing key', { languages: lngs, namespace, key, result: res }, 'i18next');
        });
        
        logger.debug('i18next event listeners installed', undefined, 'i18next');
      } catch (error) {
        console.error('Failed to capture i18next logs:', error);
      }
    } else {
      console.debug('i18next not available for event listeners');
    }
    
    return this;
  }
};

