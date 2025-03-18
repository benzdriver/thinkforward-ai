import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 配置日志文件路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const APP_LOG_FILE = path.join(LOG_DIR, 'application.log');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 检查日志文件是否存在
    if (!fs.existsSync(APP_LOG_FILE)) {
      return res.status(200).json([]);
    }

    // 读取整个日志文件
    const logData = fs.readFileSync(APP_LOG_FILE, 'utf8');
    
    // 解析日志文件内容为结构化数据
    const logs = [];
    const lines = logData.split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          // 解析日志行
          const timestampMatch = line.match(/^\[(.*?)\]/);
          const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString();
          
          // 提取 JSON 部分
          const jsonStart = line.indexOf('{');
          if (jsonStart > -1) {
            const jsonStr = line.substring(jsonStart);
            const logData = JSON.parse(jsonStr);
            
            // 添加时间戳
            logs.push({
              timestamp,
              ...logData
            });
          }
        } catch (parseError) {
          console.error('解析日志行失败:', parseError);
        }
      }
    }
    
    return res.status(200).json(logs);
  } catch (error) {
    console.error('导出日志失败:', error);
    return res.status(500).json({ error: '导出日志失败' });
  }
} 