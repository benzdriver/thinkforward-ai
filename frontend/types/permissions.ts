import { UserRole } from './user';

/**
 * 细粒度权限类型
 */
export type Permission = 
  | 'manage_users'       // 管理用户
  | 'manage_clients'     // 管理客户
  | 'access_analytics'   // 访问分析
  | 'use_ai_assistant'   // 使用AI助手
  | 'process_forms'      // 处理表单
  | 'manage_documents';  // 管理文档

/**
 * 用户权限接口
 */
export interface UserPermissions {
  canAccessAdmin: boolean;
  canAccessConsultant: boolean;
  canAccessClient: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSubscriptions: boolean;
  canAccessPremiumFeatures: boolean;
}

/**
 * 角色权限映射
 */
export const rolePermissions: Record<UserRole, Permission[]> = {
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

/**
 * 订阅级别权限映射
 */
export const subscriptionPermissions: Record<string, Permission[]> = {
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

/**
 * 根据用户角色获取基本权限
 */
export function getPermissionsByRole(role: UserRole, hasActiveSubscription: boolean = false): UserPermissions {
  switch (role) {
    case UserRole.ADMIN:
      return {
        canAccessAdmin: true,
        canAccessConsultant: true,
        canAccessClient: true,
        canManageUsers: true,
        canManageRoles: true,
        canManageSubscriptions: true,
        canAccessPremiumFeatures: true
      };
    case UserRole.CONSULTANT:
      return {
        canAccessAdmin: false,
        canAccessConsultant: true,
        canAccessClient: false,
        canManageUsers: false,
        canManageRoles: false,
        canManageSubscriptions: false,
        canAccessPremiumFeatures: hasActiveSubscription
      };
    case UserRole.CLIENT:
      return {
        canAccessAdmin: false,
        canAccessConsultant: false,
        canAccessClient: true,
        canManageUsers: false,
        canManageRoles: false,
        canManageSubscriptions: false,
        canAccessPremiumFeatures: hasActiveSubscription
      };
    case UserRole.GUEST:
    default:
      return {
        canAccessAdmin: false,
        canAccessConsultant: false,
        canAccessClient: false,
        canManageUsers: false,
        canManageRoles: false,
        canManageSubscriptions: false,
        canAccessPremiumFeatures: false
      };
  }
} 