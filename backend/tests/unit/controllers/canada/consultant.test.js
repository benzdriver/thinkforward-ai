const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('../../../helpers/mock-request');
const consultantController = require('../../../../controllers/canada/consultant');
const consultantService = require('../../../../services/canada/consultantService');

describe('Consultant Controller Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('getCases', function() {
    it('should return cases for a consultant', async function() {
      const req = httpMocks.createRequest({
        user: { id: 'consultant123', role: 'consultant' }
      });
      const res = httpMocks.createResponse();

      const mockCases = [
        {
          id: 'case-001',
          clientName: 'John Smith',
          clientEmail: 'john.smith@example.com',
          programType: 'Express Entry',
          status: 'In Progress',
          createdAt: '2023-10-15T10:30:00Z',
          updatedAt: '2023-11-01T14:45:00Z',
          documents: [
            {
              id: 'doc-001',
              name: 'Passport',
              status: 'Approved',
              uploadDate: '2023-10-16T09:15:00Z'
            }
          ]
        },
        {
          id: 'case-002',
          clientName: 'Jane Doe',
          clientEmail: 'jane.doe@example.com',
          programType: 'Provincial Nominee Program',
          status: 'Awaiting Documents',
          createdAt: '2023-09-20T09:00:00Z',
          updatedAt: '2023-10-25T16:30:00Z'
        }
      ];

      sinon.stub(consultantService, 'getCases').resolves(mockCases);

      await consultantController.getCases(req, res);

      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.cases).to.deep.equal(mockCases);
      expect(consultantService.getCases.calledWith('consultant123')).to.be.true;
    });

    it('should handle unauthorized access', async function() {
      const req = httpMocks.createRequest({
        user: { id: 'user123', role: 'client' }
      });
      const res = httpMocks.createResponse();

      await consultantController.getCases(req, res);

      expect(res.statusCode).to.equal(403);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('unauthorized');
    });

    it('should handle missing user', async function() {
      const req = httpMocks.createRequest({});
      const res = httpMocks.createResponse();

      await consultantController.getCases(req, res);

      expect(res.statusCode).to.equal(401);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.include('authenticated');
    });

    it('should handle service errors', async function() {
      const req = httpMocks.createRequest({
        user: { id: 'consultant123', role: 'consultant' }
      });
      const res = httpMocks.createResponse();

      sinon.stub(consultantService, 'getCases').rejects(new Error('Database error'));

      await consultantController.getCases(req, res);

      expect(res.statusCode).to.equal(500);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });
});
