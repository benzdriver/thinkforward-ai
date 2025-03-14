import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '../../../types/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 开发环境中我们可以总是返回成功，避免认证错误
    // 这样网站可以正常显示，即使没有完全实现后端功能
    
    // 尝试获取用户ID，但不严格要求认证成功
    const auth = getAuth(req);
    const userId = auth?.userId;
    
    console.log("Auth request received, userId:", userId);
    
    // 即使未授权也返回一个默认角色
    // 在生产环境中可能需要更严格的检查
    if (!userId) {
      console.log("提供默认访客角色");
      return res.status(200).json({ role: UserRole.GUEST });
    }

    // 这里可以添加数据库查询获取实际用户角色
    // 目前为测试返回一个固定角色
    return res.status(200).json({ role: UserRole.CLIENT });
  } catch (error) {
    console.error("角色API错误:", error);
    // 返回默认角色而不是错误，确保UI能继续工作
    return res.status(200).json({ role: UserRole.GUEST });
  }
} 