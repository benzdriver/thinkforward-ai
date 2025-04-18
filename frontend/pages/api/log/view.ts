import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// 配置日志文件路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const APP_LOG_FILE = path.join(LOG_DIR, 'application.log');

export async function handler(
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

    // 从查询参数获取限制，默认返回最近的100条日志
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    
    // 读取日志文件
    const logs = [];
    const fileStream = fs.createReadStream(APP_LOG_FILE);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // 逐行读取日志
    for await (const line of rl) {
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

    // 返回最近的 N 条日志（倒序）
    return res.status(200).json(logs.slice(-limit).reverse());
  } catch (error) {
    console.error('获取日志失败:', error);
    return res.status(500).json({ error: '获取日志失败' });
  }
}

// Next.js API 路由需要默认导出
export default handler; 