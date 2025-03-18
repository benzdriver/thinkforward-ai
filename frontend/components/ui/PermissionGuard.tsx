import React from 'react';
import { usePermission, Permission } from '../../hooks/usePermission';

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { hasPermission, isLoading } = usePermission(permission);
  
  if (isLoading) {
    return null; // 或者返回一个加载指示器
  }
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}; 