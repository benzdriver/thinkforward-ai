/**
 * 系统角色常量
 */
const ROLES = {
  ADMIN: 'ADMIN',
  CONSULTANT: 'CONSULTANT',
  CLIENT: 'CLIENT',
  GUEST: 'GUEST'
};

// 所有有效角色的数组
const ALL_ROLES = Object.values(ROLES);

// 可分配的角色（通常不包括GUEST，因为GUEST是系统分配的）
const ASSIGNABLE_ROLES = [ROLES.ADMIN, ROLES.CONSULTANT, ROLES.CLIENT];

module.exports = {
  ROLES,
  ALL_ROLES,
  ASSIGNABLE_ROLES
}; 