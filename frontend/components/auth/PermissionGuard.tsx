import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/types/permissions';
import { UserPermissions } from '@/types/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: Permission[];
  basePermissions?: (keyof UserPermissions)[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

/**
 * 权限守卫组件
 * 可以同时检查基本权限和细粒度权限
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions = [],
  basePermissions = [],
  fallback = null,
  requireAll = false
}) => {
  const { hasPermission, hasBasePermission } = usePermissions();
  
  // 检查细粒度权限
  const hasDetailedPermissions = requireAll
    ? permissions.every(p => hasPermission(p))
    : permissions.some(p => hasPermission(p));
    
  // 检查基本权限
  const hasBasePermissions = requireAll
    ? basePermissions.every(p => hasBasePermission(p))
    : basePermissions.some(p => hasBasePermission(p));
  
  // 如果没有指定任何权限，则默认通过
  if (permissions.length === 0 && basePermissions.length === 0) {
    return <>{children}</>;
  }
  
  // 如果同时指定了两种权限，则两种都需要通过
  if (permissions.length > 0 && basePermissions.length > 0) {
    return hasDetailedPermissions && hasBasePermissions 
      ? <>{children}</>
      : <>{fallback}</>;
  }
  
  // 如果只指定了一种权限，则只需要通过对应的检查
  if (permissions.length > 0) {
    return hasDetailedPermissions ? <>{children}</> : <>{fallback}</>;
  }
  
  return hasBasePermissions ? <>{children}</> : <>{fallback}</>;
}; 