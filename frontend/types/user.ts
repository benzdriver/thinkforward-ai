/**
 * 用户角色枚举
 * 定义系统中的所有用户角色
 */
export enum UserRole {
  ADMIN = 'ADMIN',        // 管理员 - 拥有所有权限
  CONSULTANT = 'CONSULTANT', // 顾问 - 拥有管理客户和提供服务的权限
  CLIENT = 'CLIENT',      // 客户 - 拥有访问自己数据和服务的权限
  GUEST = 'GUEST'         // 访客 - 只能访问公共内容
}

/**
 * 用户接口
 * 定义用户对象的结构
 */
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  role: UserRole;
  hasActiveSubscription?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户权限接口
 * 定义用户可以执行的操作
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
 * 根据用户角色获取权限
 * @param role 用户角色
 * @returns 用户权限对象
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