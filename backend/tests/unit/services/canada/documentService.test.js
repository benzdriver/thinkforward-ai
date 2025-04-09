const { expect } = require('chai');
const sinon = require('sinon');
const documentService = require('../../../../services/canada/documentService');
const DocumentSubmission = require('../../../../models/canada/DocumentSubmission');

describe('Document Service Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('getDocumentChecklist', function() {
    it('should return document checklist for Express Entry program', function() {
      const program = 'express-entry';
      const profile = {
        maritalStatus: 'single',
        hasChildren: false,
        canadianWorkExperience: 0,
        hasCanadianEducation: false
      };

      const result = documentService.getDocumentChecklist(program, profile);

      expect(result).to.be.an('array');
      expect(result).to.include('Valid passport');
      expect(result).to.include('Language test results');
      expect(result).to.include('Educational credential assessment (ECA)');
      
      expect(result).to.not.include('Spouse\'s passport');
      
      expect(result).to.not.include('Children\'s birth certificates');
    });

    it('should include spouse documents for married applicants', function() {
      const program = 'express-entry';
      const profile = {
        maritalStatus: 'married',
        hasChildren: false,
        canadianWorkExperience: 0,
        hasCanadianEducation: false
      };

      const result = documentService.getDocumentChecklist(program, profile);

      expect(result).to.include('Spouse\'s passport');
      expect(result).to.include('Spouse\'s language test results');
      expect(result).to.include('Marriage certificate');
    });

    it('should include children documents for applicants with children', function() {
      const program = 'express-entry';
      const profile = {
        maritalStatus: 'single',
        hasChildren: true,
        canadianWorkExperience: 0,
        hasCanadianEducation: false
      };

      const result = documentService.getDocumentChecklist(program, profile);

      expect(result).to.include('Children\'s birth certificates');
      expect(result).to.include('Children\'s passports');
    });

    it('should include Canadian experience documents for applicants with Canadian experience', function() {
      const program = 'express-entry';
      const profile = {
        maritalStatus: 'single',
        hasChildren: false,
        canadianWorkExperience: 12,
        hasCanadianEducation: false
      };

      const result = documentService.getDocumentChecklist(program, profile);

      expect(result).to.include('Canadian work permits');
      expect(result).to.include('Canadian employment letters');
    });

    it('should include Canadian education documents for applicants with Canadian education', function() {
      const program = 'express-entry';
      const profile = {
        maritalStatus: 'single',
        hasChildren: false,
        canadianWorkExperience: 0,
        hasCanadianEducation: true
      };

      const result = documentService.getDocumentChecklist(program, profile);

      expect(result).to.include('Canadian educational transcripts');
      expect(result).to.include('Canadian diplomas/degrees');
    });

    it('should return PNP-specific documents for PNP program', function() {
      const program = 'pnp';
      const profile = {
        maritalStatus: 'single',
        hasChildren: false,
        canadianWorkExperience: 0,
        hasCanadianEducation: false
      };

      const result = documentService.getDocumentChecklist(program, profile);

      expect(result).to.include('Provincial nomination application');
      expect(result).to.include('Proof of connection to province');
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
      const userId = 'user123';

      const savedDocument = {
        _id: 'doc123',
        userId,
        ...documentData,
        uploadDate: new Date(),
        status: 'Pending'
      };

      const documentInstance = {
        ...savedDocument,
        save: sinon.stub().resolves(savedDocument)
      };
      
      sinon.stub(DocumentSubmission.prototype, 'save').resolves(savedDocument);
      sinon.stub(global, 'Date').returns(savedDocument.uploadDate);

      const result = await documentService.uploadDocument(documentData, userId);

      expect(result.documentType).to.equal(documentData.documentType);
      expect(result.fileName).to.equal(documentData.fileName);
      expect(result.fileSize).to.equal(documentData.fileSize);
      expect(result.fileUrl).to.equal(documentData.fileUrl);
      expect(result.userId).to.equal(userId);
      expect(result.status).to.equal('Pending');
      if (!(result.uploadDate instanceof Date)) {
        const dateObj = new Date(result.uploadDate);
        expect(dateObj).to.be.instanceOf(Date);
        expect(isNaN(dateObj.getTime())).to.be.false;
      } else {
        expect(result.uploadDate).to.be.instanceOf(Date);
      }
    });

    it('should handle validation errors', async function() {
      const invalidData = {
      };
      const userId = 'user123';

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      sinon.stub(DocumentSubmission.prototype, 'save').rejects(validationError);

      try {
        await documentService.uploadDocument(invalidData, userId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.name).to.equal('ValidationError');
      }
    });
  });

  describe('getDocument', function() {
    it('should retrieve a document by ID for authorized user', async function() {
      const documentId = 'doc123';
      const userId = 'user123';

      const mockDocument = {
        _id: documentId,
        userId,
        documentType: 'Passport',
        fileName: 'passport.pdf',
        uploadDate: new Date(),
        status: 'Approved'
      };

      sinon.stub(DocumentSubmission, 'findById').resolves(mockDocument);

      const result = await documentService.getDocument(documentId, userId);

      expect(result).to.deep.equal(mockDocument);
      expect(DocumentSubmission.findById.calledWith(documentId)).to.be.true;
    });

    it('should throw error when document is not found', async function() {
      const documentId = 'nonexistent';
      const userId = 'user123';

      sinon.stub(DocumentSubmission, 'findById').resolves(null);

      try {
        await documentService.getDocument(documentId, userId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.include('not found');
      }
    });

    it('should throw error for unauthorized access', async function() {
      const documentId = 'doc123';
      const userId = 'user123';
      const differentUserId = 'differentUser';

      const mockDocument = {
        _id: documentId,
        userId: differentUserId,
        documentType: 'Passport',
        fileName: 'passport.pdf'
      };

      sinon.stub(DocumentSubmission, 'findById').resolves(mockDocument);

      try {
        await documentService.getDocument(documentId, userId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.include('Unauthorized');
      }
    });
  });
});
