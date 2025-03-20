import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/user';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * 角色守卫组件
 * 根据用户角色控制内容访问
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null
}) => {
  const { userRole } = usePermissions();
  
  // 检查用户是否有允许的角色
  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  // 如果没有允许的角色，显示备用内容
  return <>{fallback}</>;
}; 