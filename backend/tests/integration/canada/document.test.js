const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../../../../app');
const DocumentSubmission = require('../../../../models/canada/DocumentSubmission');
const documentService = require('../../../../services/canada/documentService');
const { createTestUser, generateAuthToken } = require('../../helpers/testHelpers');

describe('Document Management Integration Tests', function() {
  let authToken;
  let testUser;

  before(async function() {
    testUser = await createTestUser();
    authToken = generateAuthToken(testUser);
  });

  after(async function() {
    await mongoose.connection.dropCollection('documentsubmissions')
      .catch(err => {
        if (err.code !== 26) throw err;
      });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('POST /api/canada/documents/checklist', function() {
    it('should return document checklist for a specific program and profile', async function() {
      const requestData = {
        program: 'express-entry',
        profile: {
          maritalStatus: 'married',
          hasChildren: true,
          canadianWorkExperience: 12,
          hasCanadianEducation: true
        }
      };

      const mockChecklist = [
        'Valid passport',
        'Language test results',
        'Educational credential assessment (ECA)',
        'Marriage certificate',
        'Spouse\'s passport',
        'Spouse\'s language test results',
        'Children\'s birth certificates',
        'Children\'s passports',
        'Canadian work permits',
        'Canadian employment letters',
        'Canadian educational transcripts',
        'Canadian diplomas/degrees'
      ];

      sinon.stub(documentService, 'getDocumentChecklist').returns(mockChecklist);

      const response = await request(app)
        .post('/api/canada/documents/checklist')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.checklist).to.deep.equal(mockChecklist);
    });

    it('should return 400 for invalid request data', async function() {
      const invalidData = {
      };

      const response = await request(app)
        .post('/api/canada/documents/checklist')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.exist;
    });
  });

  describe('POST /api/canada/documents/upload', function() {
    it('should upload a document successfully', async function() {
      const documentData = {
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileSize: 1024000,
        fileUrl: 'https://example.com/files/passport.pdf'
      };

      const uploadedDocument = {
        _id: 'doc123',
        userId: testUser._id,
        ...documentData,
        uploadDate: new Date(),
        status: 'Pending'
      };

      sinon.stub(documentService, 'uploadDocument').resolves(uploadedDocument);

      const response = await request(app)
        .post('/api/canada/documents/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .send(documentData)
        .expect(201);

      expect(response.body.success).to.be.true;
      expect(response.body.document).to.deep.equal(uploadedDocument);
    });

    it('should return 401 when not authenticated', async function() {
      const response = await request(app)
        .post('/api/canada/documents/upload')
        .send({
          documentType: 'Passport',
          fileName: 'passport.pdf'
        })
        .expect(401);

      expect(response.body.success).to.be.false;
    });
  });

  describe('GET /api/canada/documents/:id', function() {
    it('should retrieve a document by ID', async function() {
      const documentId = 'doc123';

      const mockDocument = {
        _id: documentId,
        userId: testUser._id.toString(),
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileUrl: 'https://example.com/files/passport.pdf',
        uploadDate: new Date(),
        status: 'Approved'
      };

      sinon.stub(documentService, 'getDocument').resolves(mockDocument);

      const response = await request(app)
        .get(`/api/canada/documents/${documentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.document).to.deep.equal(mockDocument);
    });

    it('should return 404 when document is not found', async function() {
      const nonExistentId = 'nonexistent';

      const notFoundError = new Error('Document not found');
      sinon.stub(documentService, 'getDocument').rejects(notFoundError);

      const response = await request(app)
        .get(`/api/canada/documents/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).to.be.false;
      expect(response.body.error).to.include('not found');
    });
  });

  describe('Frontend-Backend Integration', function() {
    it('should integrate with document upload component', async function() {
      
      const documentData = {
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileSize: 1024000,
        fileUrl: 'https://example.com/files/passport.pdf'
      };

      const uploadedDocument = {
        _id: 'doc123',
        userId: testUser._id,
        ...documentData,
        uploadDate: new Date(),
        status: 'Pending'
      };

      sinon.stub(documentService, 'uploadDocument').resolves(uploadedDocument);

      const response = await request(app)
        .post('/api/canada/documents/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .send(documentData)
        .expect(201);

      expect(response.body.success).to.be.true;
      expect(response.body.document).to.deep.equal(uploadedDocument);
      
    });

    it('should integrate with document checklist component', async function() {
      
      const requestData = {
        program: 'express-entry',
        profile: {
          maritalStatus: 'single',
          hasChildren: false,
          canadianWorkExperience: 0,
          hasCanadianEducation: false
        }
      };

      const mockChecklist = [
        'Valid passport',
        'Language test results',
        'Educational credential assessment (ECA)'
      ];

      sinon.stub(documentService, 'getDocumentChecklist').returns(mockChecklist);

      const response = await request(app)
        .post('/api/canada/documents/checklist')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).to.be.true;
      expect(response.body.checklist).to.deep.equal(mockChecklist);
      
    });
  });
});
