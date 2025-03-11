const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('Permissions System Integration Tests', () => {
  let mongoServer;
  let adminToken, consultantToken, clientToken;
  let adminUser, consultantUser, clientUser;

  before(async () => {
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test users with different roles
    adminUser = new User({
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'Admin',
      authProvider: 'local',
      password: 'Password123!'
    });
    await adminUser.save();

    consultantUser = new User({
      email: 'consultant@example.com',
      firstName: 'Consultant',
      lastName: 'User',
      role: 'Consultant',
      authProvider: 'local',
      password: 'Password123!'
    });
    await consultantUser.save();

    clientUser = new User({
      email: 'client@example.com',
      firstName: 'Client',
      lastName: 'User',
      role: ROLES.CLIENT,
      authProvider: 'local',
      password: 'Password123!'
    });
    await clientUser.save();

    // Generate JWT tokens for each user
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    consultantToken = jwt.sign({ userId: consultantUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    clientToken = jwt.sign({ userId: clientUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Stub the Clerk JWT verification (if needed)
    sinon.stub(require('@clerk/clerk-sdk-node'), 'verifyToken').resolves({
      sub: 'clerk_user_id',
      email: 'test@example.com'
    });
  });

  after(async () => {
    sinon.restore();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Role-based API Access Control', () => {
    // Admin role tests
    describe('Admin User', () => {
      it('can access admin dashboard routes', async () => {
        const res = await request(app)
          .get('/api/admin/dashboard')
          .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.status).to.not.equal(403);
      });

      it('can access user management routes', async () => {
        const res = await request(app)
          .get('/api/users/all')
          .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.status).to.equal(200);
      });

      it('can update user roles', async () => {
        const res = await request(app)
          .put(`/api/users/role/${clientUser._id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ role: 'Consultant' });
        
        expect(res.status).to.equal(200);
        
        // Reset role for other tests
        await User.findByIdAndUpdate(clientUser._id, { role: ROLES.CLIENT });
      });
    });

    // Consultant role tests
    describe('Consultant User', () => {
      it('can access client management routes', async () => {
        const res = await request(app)
          .get('/api/consultants/clients')
          .set('Authorization', `Bearer ${consultantToken}`);
        
        expect(res.status).to.not.equal(403);
      });

      it('cannot access user management routes', async () => {
        const res = await request(app)
          .get('/api/users/all')
          .set('Authorization', `Bearer ${consultantToken}`);
        
        expect(res.status).to.equal(403);
      });
    });

    // Client role tests
    describe('Client User', () => {
      it('can access AI assistant routes', async () => {
        const res = await request(app)
          .get('/api/ai/assistant')
          .set('Authorization', `Bearer ${clientToken}`);
        
        expect(res.status).to.not.equal(403);
      });

      it('cannot access user management routes', async () => {
        const res = await request(app)
          .get('/api/users/all')
          .set('Authorization', `Bearer ${clientToken}`);
        
        expect(res.status).to.equal(403);
      });

      it('cannot update other users', async () => {
        const res = await request(app)
          .put(`/api/users/role/${consultantUser._id}`)
          .set('Authorization', `Bearer ${clientToken}`)
          .send({ role: 'Admin' });
        
        expect(res.status).to.equal(403);
      });
    });
  });

  describe('Permission Checks', () => {
    it('user can see their own permissions', async () => {
      const res = await request(app)
        .get('/api/users/permissions')
        .set('Authorization', `Bearer ${clientToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('permissions');
    });
  });
}); 