const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('../../../helpers/mock-request');
const documentController = require('../../../../controllers/canada/document');
const documentService = require('../../../../services/canada/documentService');
const DocumentSubmission = require('../../../../models/canada/DocumentSubmission');

describe('Document Controller Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('getDocumentChecklist', function() {
    it('should return document checklist for a specific program', async function() {
      const req = httpMocks.createRequest({
        body: {
          program: 'express-entry',
          profile: {
            maritalStatus: 'married',
            hasChildren: true,
            canadianWorkExperience: 12,
            hasCanadianEducation: true
          }
        }
      });
      const res = httpMocks.createResponse();

      const mockChecklist = [
        'Valid passport',
        'Birth certificate',
        'Marriage certificate',
        'Language test results',
        'Educational credential assessment (ECA)',
        'Express Entry profile number',
        'Proof of funds',
        'Police certificates',
        'Medical examination results',
        'Spouse\'s passport',
        'Spouse\'s language test results',
        'Children\'s birth certificates',
        'Canadian work permits',
        'Canadian educational transcripts'
      ];

      sinon.stub(documentService, 'getDocumentChecklist').returns(mockChecklist);

      await documentController.getDocumentChecklist(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.checklist).to.deep.equal(mockChecklist);
      expect(documentService.getDocumentChecklist.calledOnce).to.be.true;
    });

    it('should handle missing program parameter', async function() {
      const req = httpMocks.createRequest({
        body: {
          profile: { maritalStatus: 'single' }
        }
      });
      const res = httpMocks.createResponse();

      await documentController.getDocumentChecklist(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('program');
    });

    it('should handle missing profile parameter', async function() {
      const req = httpMocks.createRequest({
        body: {
          program: 'express-entry'
        }
      });
      const res = httpMocks.createResponse();

      await documentController.getDocumentChecklist(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('profile');
    });
  });

  describe('uploadDocument', function() {
    it('should upload a document successfully', async function() {
      const documentData = {
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileSize: 1024000,
        fileUrl: 'https://example.com/files/passport.pdf'
      };
      
      const req = httpMocks.createRequest({
        body: documentData,
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const uploadedDocument = {
        _id: 'doc123',
        userId: 'user123',
        ...documentData,
        uploadDate: new Date(),
        status: 'Pending'
      };

      sinon.stub(documentService, 'uploadDocument').resolves(uploadedDocument);

      await documentController.uploadDocument(req, res);

      expect(res.statusCode).to.equal(201);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.document).to.deep.equal(uploadedDocument);
      expect(documentService.uploadDocument.calledWith(documentData, 'user123')).to.be.true;
    });

    it('should handle validation errors during upload', async function() {
      const req = httpMocks.createRequest({
        body: { /* missing required fields */ },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const validationError = new Error('Missing required fields');
      sinon.stub(documentService, 'uploadDocument').rejects(validationError);

      await documentController.uploadDocument(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });

    it('should handle unauthorized upload attempts', async function() {
      const req = httpMocks.createRequest({
        body: {
          documentType: 'Passport',
          fileName: 'passport.pdf'
        }
      });
      const res = httpMocks.createResponse();

      await documentController.uploadDocument(req, res);

      expect(res.statusCode).to.equal(401);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('unauthorized');
    });
  });

  describe('getDocument', function() {
    it('should retrieve a document by ID', async function() {
      const documentId = 'doc123';
      const req = httpMocks.createRequest({
        params: { id: documentId },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const mockDocument = {
        _id: documentId,
        userId: 'user123',
        documentType: 'Passport',
        fileName: 'passport.pdf',
        fileSize: 1024000,
        uploadDate: new Date(),
        status: 'Approved',
        fileUrl: 'https://example.com/files/passport.pdf'
      };

      sinon.stub(documentService, 'getDocument').resolves(mockDocument);

      await documentController.getDocument(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.document).to.deep.equal(mockDocument);
      expect(documentService.getDocument.calledWith(documentId, 'user123')).to.be.true;
    });

    it('should return 404 when document is not found', async function() {
      const req = httpMocks.createRequest({
        params: { id: 'nonexistent' },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const notFoundError = new Error('Document not found');
      sinon.stub(documentService, 'getDocument').rejects(notFoundError);

      await documentController.getDocument(req, res);

      expect(res.statusCode).to.equal(404);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('not found');
    });

    it('should handle unauthorized access to documents', async function() {
      const req = httpMocks.createRequest({
        params: { id: 'doc123' },
        user: { id: 'user123' }
      });
      const res = httpMocks.createResponse();

      const unauthorizedError = new Error('Unauthorized to access this document');
      sinon.stub(documentService, 'getDocument').rejects(unauthorizedError);

      await documentController.getDocument(req, res);

      expect(res.statusCode).to.equal(403);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('Unauthorized');
    });
  });
});
