const { expect } = require('chai');
const sinon = require('sinon');
const consultantService = require('../../../../services/canada/consultantService');
const CanadianCase = require('../../../../models/canada/CanadianCase');

describe('Consultant Service Tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('getCases', function() {
    it('should return cases for a consultant', async function() {
      const consultantId = 'consultant123';

      const mockCases = [
        {
          id: 'case-001',
          clientName: 'John Smith',
          clientEmail: 'john.smith@example.com',
          programType: 'Express Entry',
          status: 'In Progress'
        },
        {
          id: 'case-002',
          clientName: 'Jane Doe',
          clientEmail: 'jane.doe@example.com',
          programType: 'Provincial Nominee Program',
          status: 'Awaiting Documents'
        }
      ];

      sinon.stub(CanadianCase, 'find').resolves(mockCases);

      const result = await consultantService.getCases(consultantId);

      expect(result).to.deep.equal(mockCases);
      expect(CanadianCase.find.calledWith({ consultantId })).to.be.true;
    });

    it('should handle case when no cases are found', async function() {
      const consultantId = 'consultantWithNoCases';

      sinon.stub(CanadianCase, 'find').resolves([]);

      const result = await consultantService.getCases(consultantId);

      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle database errors', async function() {
      const consultantId = 'consultant123';

      const dbError = new Error('Database connection error');
      sinon.stub(CanadianCase, 'find').rejects(dbError);

      try {
        await consultantService.getCases(consultantId);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.equal(dbError);
      }
    });
  });
});
