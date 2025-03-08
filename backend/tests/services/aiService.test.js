const AIService = require('../../services/aiService');
const { OpenAI } = require('openai');
const AiChat = require('../../models/AiChat');
const AiAssessment = require('../../models/AiAssessment');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

describe('AI服务测试', () => {
  let aiService;
  let mockOpenAI;
  
  before(async () => {
    // 连接测试数据库
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });
  
  beforeEach(() => {
    // 创建OpenAI模拟
    mockOpenAI = {
      chat: {
        completions: {
          create: sinon.stub().resolves({
            choices: [{ message: { content: 'AI response for testing' } }]
          })
        }
      }
    };
    
    // 创建AIService实例
    aiService = new AIService();
    aiService.openai = mockOpenAI;
  });
  
  afterEach(async () => {
    // 清理测试数据
    await AiChat.deleteMany({});
    await AiAssessment.deleteMany({});
    sinon.restore();
  });
  
  after(async () => {
    await mongoose.connection.close();
  });
  
  describe('聊天功能', () => {
    it('应该创建新的聊天会话', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      const chat = await aiService.createChat(userId, 'zh');
      
      expect(chat._id).to.exist;
      expect(chat.user.toString()).to.equal(userId.toString());
      expect(chat.language).to.equal('zh');
      expect(chat.messages).to.be.an('array').that.is.empty;
    });
    
    it('应该发送消息并获取响应', async () => {
      const userId = new mongoose.Types.ObjectId();
      const chat = await aiService.createChat(userId);
      
      const response = await aiService.sendMessage(chat._id, '你好，我需要移民加拿大的建议', 'zh');
      
      expect(response.content).to.equal('AI response for testing');
      expect(mockOpenAI.chat.completions.create.calledOnce).to.be.true;
      
      // 验证保存的消息
      const updatedChat = await AiChat.findById(chat._id);
      expect(updatedChat.messages.length).to.equal(2); // 用户消息和AI回复
      expect(updatedChat.messages[0].content).to.equal('你好，我需要移民加拿大的建议');
      expect(updatedChat.messages[1].content).to.equal('AI response for testing');
    });
  });
  
  describe('评估功能', () => {
    it('应该为客户创建评估', async () => {
      const mockProfile = {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Assessment',
        lastName: 'Test',
        dateOfBirth: new Date('1990-01-01'),
        education: [{ institution: 'Test University' }],
        workExperience: [{ employer: 'Test Company' }]
      };
      
      const userId = new mongoose.Types.ObjectId();
      
      // 模拟评估链
      sinon.stub(aiService, '_analyzeProfile').resolves({
        eligibilityScore: 75,
        programs: [{ name: 'Express Entry', score: 80 }],
        strengths: ['Good education'],
        weaknesses: ['Limited experience'],
        recommendations: ['Apply soon']
      });
      
      const assessment = await aiService.createAssessment(userId, mockProfile, 'zh');
      
      expect(assessment._id).to.exist;
      expect(assessment.user.toString()).to.equal(userId.toString());
      expect(assessment.profile.toString()).to.equal(mockProfile._id.toString());
      expect(assessment.language).to.equal('zh');
      expect(assessment.eligibilityScore).to.equal(75);
      expect(assessment.programs[0].name).to.equal('Express Entry');
    });
  });
  
  describe('文档审核功能', () => {
    it('应该审核文档并提供反馈', async () => {
      const userId = new mongoose.Types.ObjectId();
      const documentContent = 'This is a sample resume for testing document review functionality.';
      
      // 模拟文档审核链
      sinon.stub(aiService, '_reviewDocument').resolves({
        feedback: 'Good structure, needs more details',
        strengths: ['Clear format'],
        improvements: ['Add more achievements']
      });
      
      const result = await aiService.reviewDocument(userId, 'Resume', documentContent, 'en');
      
      expect(result.review).to.exist;
      expect(result.review.feedback).to.equal('Good structure, needs more details');
      expect(result.chatId).to.exist;
      
      // 验证是否创建了聊天记录
      const chat = await AiChat.findById(result.chatId);
      expect(chat).to.exist;
      expect(chat.messages.length).to.equal(2);
      expect(chat.chatType).to.equal('DocumentReview');
    });
  });
  
  describe('表单帮助功能', () => {
    it('应该提供表单字段帮助', async () => {
      const userId = new mongoose.Types.ObjectId();
      const fieldName = 'occupation';
      const formName = 'Express Entry Application';
      
      // 模拟表单帮助链
      sinon.stub(aiService, '_provideFormHelp').resolves({
        explanation: 'The occupation field should contain your NOC code',
        examples: ['Software engineer - 21234'],
        tips: ['Be specific about your role']
      });
      
      const result = await aiService.getFormFieldHelp(userId, formName, fieldName, 'en');
      
      expect(result.help).to.exist;
      expect(result.help.explanation).to.include('NOC code');
      expect(result.chatId).to.exist;
      
      // 验证是否创建了聊天记录
      const chat = await AiChat.findById(result.chatId);
      expect(chat).to.exist;
      expect(chat.messages.length).to.equal(2);
      expect(chat.chatType).to.equal('FormHelper');
    });
  });
}); 