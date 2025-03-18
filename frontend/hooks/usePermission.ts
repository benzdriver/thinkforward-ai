import { useState, useEffect } from 'react';
import { useUserRole } from './useUserRole';

// 权限类型定义 (与服务器端保持一致)
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

export function usePermission(permission: Permission) {
  const { role, isLoading: roleLoading } = useUserRole();
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function checkPermission() {
      if (roleLoading || !role) {
        return;
      }
      
      try {
        // 获取用户订阅信息
        const subscriptionResponse = await fetch('/api/users/subscription');
        let subscription = 'free';
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          subscription = subscriptionData.plan || 'free';
        }
        
        // 检查角色权限
        const hasRolePermission = rolePermissions[role]?.includes(permission);
        
        // 检查订阅权限
        const hasSubscriptionPermission = subscriptionPermissions[subscription]?.includes(permission);
        
        // 管理员始终有所有权限
        setHasPermission(role === 'ADMIN' || (hasRolePermission && hasSubscriptionPermission));
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkPermission();
  }, [role, roleLoading, permission]);
  
  return { hasPermission, isLoading };
} 