const { expect } = require('chai');
const mongoose = require('mongoose');
const DocumentSubmission = require('../../../../models/canada/DocumentSubmission');

describe('Document Submission Model Tests', function() {
  before(function() {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  after(function() {
    return mongoose.connection.dropCollection('documentsubmissions')
      .catch(err => {
        if (err.code !== 26) throw err;
      });
  });

  it('should create a valid document submission', async function() {
    const documentData = {
      userId: new mongoose.Types.ObjectId(),
      documentType: 'passport',
      name: 'Passport Document',
      fileType: 'application/pdf',
      fileSize: 1024000,
      fileUrl: 'https://example.com/files/passport.pdf',
      uploadDate: new Date(),
      status: 'Pending',
      notes: [{
        content: 'Passport expiry date needs to be verified',
        createdBy: new mongoose.Types.ObjectId()
      }]
    };

    const document = new DocumentSubmission(documentData);
    const savedDocument = await document.save();

    expect(savedDocument).to.have.property('_id');
    expect(savedDocument.userId).to.equal(documentData.userId);
    expect(savedDocument.documentType).to.equal(documentData.documentType);
    expect(savedDocument.fileName).to.equal(documentData.fileName);
    expect(savedDocument.fileSize).to.equal(documentData.fileSize);
    expect(savedDocument.fileUrl).to.equal(documentData.fileUrl);
    expect(savedDocument.status).to.equal(documentData.status);
    expect(savedDocument.notes).to.equal(documentData.notes);
    expect(savedDocument.createdAt).to.be.instanceOf(Date);
    expect(savedDocument.updatedAt).to.be.instanceOf(Date);
  });

  it('should require userId field', async function() {
    const documentWithoutUserId = new DocumentSubmission({
      documentType: 'passport',
      name: 'Passport Document',
      fileType: 'application/pdf',
      fileSize: 1024000,
      fileUrl: 'https://example.com/files/passport.pdf'
    });

    try {
      await documentWithoutUserId.save();
      expect.fail('Expected validation error for missing userId');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.userId).to.exist;
    }
  });

  it('should require documentType field', async function() {
    const documentWithoutType = new DocumentSubmission({
      userId: new mongoose.Types.ObjectId(),
      name: 'Document',
      fileType: 'application/pdf',
      fileSize: 1024000,
      fileUrl: 'https://example.com/files/document.pdf'
    });

    try {
      await documentWithoutType.save();
      expect.fail('Expected validation error for missing documentType');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.documentType).to.exist;
    }
  });

  it('should validate document status', async function() {
    const documentWithInvalidStatus = new DocumentSubmission({
      userId: new mongoose.Types.ObjectId(),
      documentType: 'passport',
      name: 'Passport Document',
      fileType: 'application/pdf',
      fileSize: 1024000,
      fileUrl: 'https://example.com/files/passport.pdf',
      status: 'InvalidStatus' // Invalid status
    });

    try {
      await documentWithInvalidStatus.save();
      expect.fail('Expected validation error for invalid status');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.status).to.exist;
    }
  });

  it('should update status and add review notes', async function() {
    const document = new DocumentSubmission({
      userId: new mongoose.Types.ObjectId(),
      documentType: 'passport',
      name: 'Passport Document',
      fileType: 'application/pdf',
      fileSize: 1024000,
      fileUrl: 'https://example.com/files/passport.pdf',
      status: 'Pending'
    });
    
    const savedDocument = await document.save();
    
    savedDocument.status = 'Approved';
    savedDocument.notes.push({
      content: 'Document verified and approved',
      createdBy: new mongoose.Types.ObjectId()
    });
    savedDocument.reviewedBy = new mongoose.Types.ObjectId();
    savedDocument.reviewDate = new Date();
    
    const updatedDocument = await savedDocument.save();
    
    expect(updatedDocument.status).to.equal('Approved');
    expect(updatedDocument.notes[0].content).to.equal('Document verified and approved');
    expect(updatedDocument.reviewedBy).to.be.instanceOf(mongoose.Types.ObjectId);
    expect(updatedDocument.reviewDate).to.be.instanceOf(Date);
    expect(updatedDocument.updatedAt.getTime()).to.be.greaterThan(savedDocument.updatedAt.getTime());
  });
});
