const Client = require('../../models/Client');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

describe('客户模型测试', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });
  
  afterEach(async () => {
    await Client.deleteMany({});
  });
  
  after(async () => {
    await mongoose.connection.close();
  });
  
  it('应该成功创建并保存客户资料', async () => {
    const clientData = {
      firstName: 'Client',
      lastName: 'Test',
      dateOfBirth: new Date('1990-01-01'),
      email: 'client@test.com',
      phone: '123-456-7890',
      nationality: 'Chinese',
      maritalStatus: 'Single',
      address: {
        street: '123 Main St',
        city: 'Beijing',
        province: 'Beijing',
        postalCode: '100000',
        country: 'China'
      },
      user: new mongoose.Types.ObjectId()
    };
    
    const client = new Client(clientData);
    const savedClient = await client.save();
    
    expect(savedClient._id).to.exist;
    expect(savedClient.firstName).to.equal(clientData.firstName);
    expect(savedClient.lastName).to.equal(clientData.lastName);
    expect(savedClient.nationality).to.equal(clientData.nationality);
    expect(savedClient.address.city).to.equal(clientData.address.city);
    expect(savedClient.age).to.equal(new Date().getFullYear() - 1990);
  });
  
  it('应该正确计算年龄', async () => {
    const birthYear = new Date().getFullYear() - 30; // 30岁
    const client = new Client({
      firstName: 'Age',
      lastName: 'Test',
      dateOfBirth: new Date(`${birthYear}-06-01`),
      user: new mongoose.Types.ObjectId()
    });
    
    await client.save();
    expect(client.age).to.equal(30);
    
    // 测试边界条件
    const client2 = new Client({
      firstName: 'Age',
      lastName: 'Boundary',
      dateOfBirth: new Date(`${birthYear}-12-31`), // 年底出生
      user: new mongoose.Types.ObjectId()
    });
    
    await client2.save();
    
    // 当前是否已经过了12月31日决定了年龄是29还是30
    const today = new Date();
    const isAfterBirthday = 
      today.getMonth() > 11 || 
      (today.getMonth() === 11 && today.getDate() >= 31);
    
    const expectedAge = isAfterBirthday ? 30 : 29;
    expect(client2.age).to.equal(expectedAge);
  });
  
  it('应该添加教育经历', async () => {
    const client = new Client({
      firstName: 'Education',
      lastName: 'Test',
      user: new mongoose.Types.ObjectId()
    });
    
    await client.save();
    
    const education = {
      institution: 'University of Beijing',
      country: 'China',
      degree: 'Bachelor',
      field: 'Computer Science',
      startDate: new Date('2010-09-01'),
      endDate: new Date('2014-06-30'),
      completed: true
    };
    
    client.education.push(education);
    await client.save();
    
    expect(client.education.length).to.equal(1);
    expect(client.education[0].institution).to.equal(education.institution);
    expect(client.education[0].degree).to.equal(education.degree);
  });
  
  it('应该添加工作经验', async () => {
    const client = new Client({
      firstName: 'Work',
      lastName: 'Experience',
      user: new mongoose.Types.ObjectId()
    });
    
    await client.save();
    
    const work = {
      employer: 'Tech Company',
      country: 'China',
      jobTitle: 'Software Engineer',
      duties: 'Developing web applications',
      startDate: new Date('2014-07-01'),
      endDate: null, // 当前工作
      hoursPerWeek: 40
    };
    
    client.workExperience.push(work);
    await client.save();
    
    expect(client.workExperience.length).to.equal(1);
    expect(client.workExperience[0].employer).to.equal(work.employer);
    expect(client.workExperience[0].endDate).to.be.null;
  });
  
  it('应该添加语言测试成绩', async () => {
    const client = new Client({
      firstName: 'Language',
      lastName: 'Test',
      user: new mongoose.Types.ObjectId()
    });
    
    await client.save();
    
    const languageTest = {
      type: 'IELTS',
      date: new Date('2023-01-15'),
      listening: 7.5,
      reading: 7.0,
      writing: 6.5,
      speaking: 7.0,
      overall: 7.0
    };
    
    client.languageTests.push(languageTest);
    await client.save();
    
    expect(client.languageTests.length).to.equal(1);
    expect(client.languageTests[0].type).to.equal(languageTest.type);
    expect(client.languageTests[0].overall).to.equal(languageTest.overall);
  });
}); 