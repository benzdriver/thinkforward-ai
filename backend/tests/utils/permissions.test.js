const { expect } = require('chai');
const { rolePermissions, getUserPermissions, hasPermission } = require('../../utils/permissions');
const { ROLES } = require('../../constants/roles');

describe('Permission Utilities', () => {
  describe('rolePermissions', () => {
    it('should define permissions for Admin role', () => {
      expect(rolePermissions[ROLES.ADMIN]).to.be.an('object');
      expect(rolePermissions[ROLES.ADMIN].canManageSystem).to.equal(true);
    });

    it('should define permissions for Consultant role', () => {
      expect(rolePermissions[ROLES.CONSULTANT]).to.be.an('object');
      expect(rolePermissions[ROLES.CONSULTANT].canReviewClients).to.equal(true);
    });

    it('should define permissions for Client role', () => {
      expect(rolePermissions[ROLES.CLIENT]).to.be.an('object');
      expect(rolePermissions[ROLES.CLIENT].canAccessAIAssistant).to.equal(true);
    });
  });

  describe('getUserPermissions', () => {
    it('should return Admin permissions for Admin role', () => {
      const permissions = getUserPermissions(ROLES.ADMIN);
      expect(permissions).to.deep.equal(rolePermissions[ROLES.ADMIN]);
    });

    it('should return Consultant permissions for Consultant role', () => {
      const permissions = getUserPermissions(ROLES.CONSULTANT);
      expect(permissions).to.deep.equal(rolePermissions[ROLES.CONSULTANT]);
    });

    it('should return Client permissions for Client role', () => {
      const permissions = getUserPermissions(ROLES.CLIENT);
      expect(permissions).to.deep.equal(rolePermissions[ROLES.CLIENT]);
    });

    it('should return empty permissions object for invalid role', () => {
      const permissions = getUserPermissions('InvalidRole');
      expect(permissions).to.be.an('object');
      expect(Object.keys(permissions).length).to.equal(Object.keys(rolePermissions[ROLES.GUEST]).length);
    });
  });

  describe('hasPermission', () => {
    it('should return true for permission Admin has', () => {
      expect(hasPermission(ROLES.ADMIN, 'canManageSystem')).to.equal(true);
    });

    it('should return false for permission Admin does not have', () => {
      // Create a non-existent permission for test
      expect(hasPermission(ROLES.ADMIN, 'nonExistentPermission')).to.equal(false);
    });

    it('should return true for permission Consultant has', () => {
      expect(hasPermission(ROLES.CONSULTANT, 'canReviewClients')).to.equal(true);
    });

    it('should return false for permission Consultant does not have', () => {
      expect(hasPermission(ROLES.CONSULTANT, 'canManageSystem')).to.equal(false);
    });

    it('should return false for invalid role', () => {
      expect(hasPermission('InvalidRole', 'canAccessAIAssistant')).to.equal(false);
    });
  });
});   