import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// 配置日志文件路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const APP_LOG_FILE = path.join(LOG_DIR, 'application.log');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.log');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 备份当前日志（如果存在）
    if (fs.existsSync(APP_LOG_FILE)) {
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
      const backupFile = `${APP_LOG_FILE}.${timestamp}`;
      fs.renameSync(APP_LOG_FILE, backupFile);
    }
    
    // 备份错误日志（如果存在）
    if (fs.existsSync(ERROR_LOG_FILE)) {
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
      const backupFile = `${ERROR_LOG_FILE}.${timestamp}`;
      fs.renameSync(ERROR_LOG_FILE, backupFile);
    }
    
    // 创建新的空日志文件
    fs.writeFileSync(APP_LOG_FILE, '');
    fs.writeFileSync(ERROR_LOG_FILE, '');
    
    return res.status(200).json({ success: true, message: '日志已清除并备份' });
  } catch (error) {
    console.error('清除日志失败:', error);
    return res.status(500).json({ error: '清除日志失败' });
  }
} 