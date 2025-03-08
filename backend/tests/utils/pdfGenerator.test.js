const PDFGenerator = require('../../utils/pdfGenerator');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

describe('PDF生成器测试', () => {
  const mockAssessment = {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      email: 'john@example.com',
      nationality: 'Canadian',
      address: {
        country: 'Canada',
        city: 'Toronto'
      },
      education: [{
        institution: 'University of Toronto',
        degree: 'Bachelor',
        field: 'Computer Science'
      }],
      workExperience: [{
        employer: 'Tech Corp',
        jobTitle: 'Software Developer',
        duties: 'Developing software applications'
      }]
    },
    summary: 'This is a test assessment summary',
    eligibilityScore: 75,
    programs: [
      { name: 'Express Entry', score: 80, notes: 'Good candidate' },
      { name: 'Provincial Nominee', score: 65, notes: 'Possible option' }
    ],
    strengths: ['Strong education background', 'Technical skills'],
    weaknesses: ['Limited work experience', 'No Canadian experience'],
    recommendations: ['Apply for Express Entry', 'Consider PNP programs']
  };

  it('应该生成英文版PDF buffer', async () => {
    const pdfBuffer = await PDFGenerator.generateAssessmentPDF(mockAssessment, 'en');
    expect(pdfBuffer).to.be.instanceOf(Buffer);
    expect(pdfBuffer.length).to.be.greaterThan(0);
  });

  it('应该生成中文版PDF buffer', async () => {
    const pdfBuffer = await PDFGenerator.generateAssessmentPDF(mockAssessment, 'zh');
    expect(pdfBuffer).to.be.instanceOf(Buffer);
    expect(pdfBuffer.length).to.be.greaterThan(0);
  });

  it('在缺少资料时应该优雅地处理', async () => {
    const incompleteAssessment = {
      profile: {
        firstName: 'Jane',
        lastName: 'Smith'
      },
      eligibilityScore: 60
    };
    
    const pdfBuffer = await PDFGenerator.generateAssessmentPDF(incompleteAssessment, 'en');
    expect(pdfBuffer).to.be.instanceOf(Buffer);
    expect(pdfBuffer.length).to.be.greaterThan(0);
  });
}); 