import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { 
  Permission, 
  UserPermissions, 
  getPermissionsByRole, 
  rolePermissions, 
  subscriptionPermissions 
} from '@/types/permissions';
import { useI18n } from './useI18n';

/**
 * 统一的权限管理 Hook
 * 提供基于角色和订阅的权限检查
 */
export const usePermissions = () => {
  const { user, userRole, isAuthenticated } = useAuth();
  const { t } = useI18n('permissions');
  
  // 获取用户订阅信息
  const subscriptionPlan = user?.subscriptionPlan || 'free';
  const hasActiveSubscription = user?.hasActiveSubscription || false;
  
  // 获取基本权限
  const basePermissions: UserPermissions = getPermissionsByRole(
    userRole || UserRole.GUEST,
    hasActiveSubscription
  );
  
  /**
   * 检查用户是否有基本权限
   * @param permission 要检查的权限名称
   */
  const hasBasePermission = (permission: keyof UserPermissions): boolean => {
    if (!isAuthenticated) return false;
    return basePermissions[permission] || false;
  };
  
  /**
   * 检查用户是否可以访问特定功能（满足任一权限即可）
   * @param requiredPermissions 需要的权限列表
   */
  const canAccess = (requiredPermissions: (keyof UserPermissions)[]): boolean => {
    if (!isAuthenticated) return false;
    return requiredPermissions.some(permission => hasBasePermission(permission));
  };
  
  /**
   * 检查用户是否有细粒度权限
   * @param permission 要检查的细粒度权限
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!isAuthenticated || !userRole) return false;
    
    // 管理员始终有所有权限
    if (userRole === UserRole.ADMIN) return true;
    
    // 检查角色权限
    const hasRolePermission = rolePermissions[userRole]?.includes(permission);
    
    // 检查订阅权限
    const hasSubscriptionPermission = subscriptionPermissions[subscriptionPlan]?.includes(permission);
    
    return hasRolePermission && hasSubscriptionPermission;
  };
  
  /**
   * 获取用户所有的细粒度权限
   */
  const getAllPermissions = (): Permission[] => {
    if (!isAuthenticated || !userRole) return [];
    
    // 管理员有所有权限
    if (userRole === UserRole.ADMIN) {
      return Object.values(rolePermissions).flat() as Permission[];
    }
    
    // 获取角色权限
    const userRolePermissions = rolePermissions[userRole] || [];
    
    // 获取订阅权限
    const userSubscriptionPermissions = subscriptionPermissions[subscriptionPlan] || [];
    
    // 返回两者交集
    return userRolePermissions.filter(permission => 
      userSubscriptionPermissions.includes(permission)
    );
  };
  
  /**
   * 获取权限的本地化名称
   */
  const getPermissionName = (permission: Permission): string => {
    return t(`permissions.${permission}`);
  };
  
  /**
   * 获取角色的本地化名称
   */
  const getRoleName = (role: UserRole): string => {
    return t(`roles.${role}`);
  };
  
  /**
   * 获取订阅计划的本地化名称
   */
  const getSubscriptionPlanName = (plan: string): string => {
    return t(`subscriptions.${plan}`);
  };
  
  return {
    // 基本权限
    basePermissions,
    hasBasePermission,
    canAccess,
    
    // 细粒度权限
    hasPermission,
    getAllPermissions,
    
    // 本地化名称
    getPermissionName,
    getRoleName,
    getSubscriptionPlanName,
    
    // 用户信息
    userRole,
    subscriptionPlan,
    hasActiveSubscription,
    isAuthenticated
  };
}; 