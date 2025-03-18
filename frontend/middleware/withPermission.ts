import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../utils/mongodb';

// 权限类型定义
export type Permission = 
  | 'manage_users'       // 管理用户
  | 'manage_clients'     // 管理客户
  | 'access_analytics'   // 访问分析
  | 'use_ai_assistant'   // 使用AI助手
  | 'process_forms'      // 处理表单
  | 'manage_documents';  // 管理文档

// 角色权限映射
const rolePermissions: Record<string, Permission[]> = {
  'ADMIN': [
    'manage_users', 
    'manage_clients', 
    'access_analytics', 
    'use_ai_assistant', 
    'process_forms', 
    'manage_documents'
  ],
  'CONSULTANT': [
    'manage_clients', 
    'use_ai_assistant', 
    'process_forms', 
    'manage_documents'
  ],
  'CLIENT': [
    'use_ai_assistant'
  ],
  'GUEST': []
};

// 订阅级别权限映射
const subscriptionPermissions: Record<string, Permission[]> = {
  'professional': [
    'access_analytics',
    'use_ai_assistant',
    'process_forms',
    'manage_documents'
  ],
  'growth': [
    'use_ai_assistant',
    'process_forms',
    'manage_documents'
  ],
  'starter': [
    'use_ai_assistant',
    'process_forms'
  ],
  'free': []
};

// 权限中间件
export function withPermission(requiredPermission: Permission) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ clerkId: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const role = user.role || 'GUEST';
      const subscription = user.subscription?.plan || 'free';
      
      // 检查角色权限
      const hasRolePermission = rolePermissions[role]?.includes(requiredPermission);
      
      // 检查订阅权限
      const hasSubscriptionPermission = subscriptionPermissions[subscription]?.includes(requiredPermission);
      
      // 管理员始终有所有权限
      if (role === 'ADMIN' || (hasRolePermission && hasSubscriptionPermission)) {
        return next();
      }
      
      return res.status(403).json({ error: 'Permission denied' });
    } catch (error) {
      console.error('Error checking permission:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}