import hybridLogger from '../../utils/hybridLogger';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// 配置日志文件保存路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const APP_LOG_FILE = path.join(LOG_DIR, 'application.log');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.log');

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 日志文件旋转功能
function rotateLogIfNeeded(logFile: string, maxSizeMB = 10) {
  try {
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      const fileSizeMB = stats.size / (1024 * 1024);
      
      if (fileSizeMB >= maxSizeMB) {
        const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
        const newLogFile = `${logFile}.${timestamp}`;
        fs.renameSync(logFile, newLogFile);
      }
    }
  } catch (error) {
    console.error('日志文件旋转失败:', error);
  }
}

// 写入日志到文件
function writeToLog(logFile: string, logData: any) {
  // 旋转日志文件如果需要
  rotateLogIfNeeded(logFile);
  
  // 格式化日志条目
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(logData)}\n`;
  
  // 将日志追加到文件
  fs.appendFileSync(logFile, logEntry);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只处理 POST 请求 - 其他路径/方法由子路由处理
  if (req.method !== 'POST' || req.url?.includes('/api/log/')) {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 接收来自客户端的日志
    const logs = req.body;
    
    // 1. 在控制台输出日志
    console.log('[前端服务日志]', JSON.stringify(logs, null, 2));
    
    // 2. 保存到日志文件
    for (const log of Array.isArray(logs) ? logs : [logs]) {
      // 根据日志级别分离存储
      if (log.level === 'error' || log.level === 'fatal') {
        writeToLog(ERROR_LOG_FILE, log);
      }
      
      // 所有日志都存到主日志文件
      writeToLog(APP_LOG_FILE, log);
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('处理日志时出错:', error);
    return res.status(500).json({ error: '处理日志失败' });
  }
} 