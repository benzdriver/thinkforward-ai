const { ROLES } = require('../constants/roles'); // 引入角色常量

/**
 * 基于用户角色的权限映射
 */
const rolePermissions = {
  [ROLES.ADMIN]: { // 使用常量作为键
    canAccessDashboard: true,
    canAccessAIAssistant: true,
    canFillForms: true,
    canReviewClients: true,
    canAssignConsultants: true,
    canManageSystem: true,
    canInviteUsers: true
  },
  [ROLES.CONSULTANT]: { // 使用常量作为键
    canAccessDashboard: true,
    canAccessAIAssistant: true,
    canFillForms: true,
    canReviewClients: true,
    canAssignConsultants: false,
    canManageSystem: false,
    canInviteUsers: false
  },
  [ROLES.CLIENT]: { // 使用常量作为键
    canAccessDashboard: true,
    canAccessAIAssistant: true,
    canFillForms: true,
    canReviewClients: false,
    canAssignConsultants: false,
    canManageSystem: false,
    canInviteUsers: false
  },
  [ROLES.GUEST]: { // 使用常量作为键
    canAccessDashboard: false,
    canAccessAIAssistant: false,
    canFillForms: false,
    canReviewClients: false,
    canAssignConsultants: false,
    canManageSystem: false,
    canInviteUsers: false
  }
};

/**
 * 获取用户权限
 * @param {string} role - 用户角色
 * @returns {Object} - 权限对象
 */
const getUserPermissions = (role) => {
  return rolePermissions[role] || rolePermissions[ROLES.GUEST]; // 使用常量
};

/**
 * 检查用户是否有特定权限
 * @param {string} role - 用户角色
 * @param {string} permission - 权限名称
 * @returns {boolean} - 是否有权限
 */
const hasPermission = (role, permission) => {
  const permissions = getUserPermissions(role);
  return !!permissions[permission];
};

module.exports = {
  rolePermissions,
  getUserPermissions,
  hasPermission
}; 