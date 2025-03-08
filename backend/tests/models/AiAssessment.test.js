const AiAssessment = require('../../models/AiAssessment');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

describe('AI评估模型测试', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });
  
  afterEach(async () => {
    await AiAssessment.deleteMany({});
  });
  
  after(async () => {
    await mongoose.connection.close();
  });
  
  it('应该成功创建并保存评估', async () => {
    const assessmentData = {
      user: new mongoose.Types.ObjectId(),
      profile: new mongoose.Types.ObjectId(),
      title: 'Express Entry Evaluation',
      content: {
        summary: 'This is a detailed assessment',
        factors: {
          age: 'Positive factor',
          education: 'Strong education background',
          experience: 'Limited work experience'
        }
      },
      summary: 'Overall positive assessment',
      eligibilityScore: 85,
      programs: [
        { name: 'Express Entry', score: 90, notes: 'Excellent candidate' },
        { name: 'PNP', score: 75, notes: 'Good option as backup' }
      ],
      strengths: ['Education', 'Age', 'Language proficiency'],
      weaknesses: ['Limited work experience'],
      recommendations: ['Apply for Express Entry', 'Prepare documents'],
      language: 'zh'
    };
    
    const assessment = new AiAssessment(assessmentData);
    const savedAssessment = await assessment.save();
    
    expect(savedAssessment._id).to.exist;
    expect(savedAssessment.title).to.equal(assessmentData.title);
    expect(savedAssessment.eligibilityScore).to.equal(assessmentData.eligibilityScore);
    expect(savedAssessment.programs.length).to.equal(2);
    expect(savedAssessment.language).to.equal('zh');
    expect(savedAssessment.createdAt).to.exist;
    expect(savedAssessment.updatedAt).to.exist;
  });
  
  it('应该验证评分范围', async () => {
    try {
      const assessment = new AiAssessment({
        user: new mongoose.Types.ObjectId(),
        profile: new mongoose.Types.ObjectId(),
        content: { basic: 'content' },
        eligibilityScore: 110, // 超过最大值100
        language: 'en'
      });
      
      await assessment.validate();
      // 如果验证通过，测试应该失败
      expect.fail('应该因超出范围而失败验证');
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors.eligibilityScore).to.exist;
    }
  });
  
  it('应该验证语言选项', async () => {
    try {
      const assessment = new AiAssessment({
        user: new mongoose.Types.ObjectId(),
        profile: new mongoose.Types.ObjectId(),
        content: { basic: 'content' },
        language: 'fr' // 不支持的语言
      });
      
      await assessment.validate();
      // 如果验证通过，测试应该失败
      expect.fail('应该因不支持的语言而失败验证');
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors.language).to.exist;
    }
  });
  
  it('应该需要必填字段', async () => {
    try {
      const assessment = new AiAssessment({
        // 缺少user和profile
        content: { basic: 'content' }
      });
      
      await assessment.validate();
      // 如果验证通过，测试应该失败
      expect.fail('应该因缺少必填字段而失败验证');
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors.user).to.exist;
      expect(error.errors.profile).to.exist;
    }
  });
}); 