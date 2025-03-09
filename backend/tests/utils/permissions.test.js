const { expect } = require('chai');
const { rolePermissions, getUserPermissions, hasPermission } = require('../../utils/permissions');

describe('Permission Utilities', () => {
  describe('rolePermissions', () => {
    it('should define permissions for Admin role', () => {
      expect(rolePermissions.Admin).to.be.an('object');
      expect(rolePermissions.Admin.canManageSystem).to.equal(true);
    });

    it('should define permissions for Consultant role', () => {
      expect(rolePermissions.Consultant).to.be.an('object');
      expect(rolePermissions.Consultant.canReviewClients).to.equal(true);
    });

    it('should define permissions for Client role', () => {
      expect(rolePermissions.Client).to.be.an('object');
      expect(rolePermissions.Client.canAccessAIAssistant).to.equal(true);
    });
  });

  describe('getUserPermissions', () => {
    it('should return Admin permissions for Admin role', () => {
      const permissions = getUserPermissions('Admin');
      expect(permissions).to.deep.equal(rolePermissions.Admin);
    });

    it('should return Consultant permissions for Consultant role', () => {
      const permissions = getUserPermissions('Consultant');
      expect(permissions).to.deep.equal(rolePermissions.Consultant);
    });

    it('should return Client permissions for Client role', () => {
      const permissions = getUserPermissions('Client');
      expect(permissions).to.deep.equal(rolePermissions.Client);
    });

    it('should return empty permissions object for invalid role', () => {
      const permissions = getUserPermissions('InvalidRole');
      expect(permissions).to.be.an('object');
      expect(Object.keys(permissions).length).to.equal(0);
    });
  });

  describe('hasPermission', () => {
    it('should return true for permission Admin has', () => {
      expect(hasPermission('Admin', 'canManageSystem')).to.equal(true);
    });

    it('should return false for permission Admin does not have', () => {
      // Create a non-existent permission for test
      expect(hasPermission('Admin', 'nonExistentPermission')).to.equal(false);
    });

    it('should return true for permission Consultant has', () => {
      expect(hasPermission('Consultant', 'canReviewClients')).to.equal(true);
    });

    it('should return false for permission Consultant does not have', () => {
      expect(hasPermission('Consultant', 'canManageSystem')).to.equal(false);
    });

    it('should return false for invalid role', () => {
      expect(hasPermission('InvalidRole', 'canAccessAIAssistant')).to.equal(false);
    });
  });
}); 