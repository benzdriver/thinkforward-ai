export interface User {
    name: string;
    email: string;
    password: string;
}

export enum UserRole {
  ADMIN = 'Admin',
  CONSULTANT = 'Consultant',
  CLIENT = 'Client',
  GUEST = 'Guest'
}

export interface UserPermissions {
  canAccessDashboard: boolean;
  canAccessAIAssistant: boolean;
  canFillForms: boolean;
  canReviewClients: boolean;
  canAssignConsultants: boolean;
  canManageSystem: boolean;
}

export const rolePermissions: Record<UserRole, UserPermissions> = {
  [UserRole.ADMIN]: {
    canAccessDashboard: true,
    canAccessAIAssistant: true,
    canFillForms: true,
    canReviewClients: true,
    canAssignConsultants: true,
    canManageSystem: true
  },
  [UserRole.CONSULTANT]: {
    canAccessDashboard: true,
    canAccessAIAssistant: true,
    canFillForms: true,
    canReviewClients: true,
    canAssignConsultants: false,
    canManageSystem: false
  },
  [UserRole.CLIENT]: {
    canAccessDashboard: true,
    canAccessAIAssistant: true,
    canFillForms: true,
    canReviewClients: false,
    canAssignConsultants: false,
    canManageSystem: false
  },
  [UserRole.GUEST]: {
    canAccessDashboard: false,
    canAccessAIAssistant: false,
    canFillForms: false,
    canReviewClients: false,
    canAssignConsultants: false,
    canManageSystem: false
  }
} 