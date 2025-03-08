const Client = require('../models/Client');
const User = require('../models/User');

// 创建客户资料
exports.createClient = async (req, res) => {
  try {
    // 检查用户是否已经有客户资料
    const existingClient = await Client.findOne({ user: req.user._id });
    
    if (existingClient) {
      return res.status(400).json({
        message: req.t('errors.duplicateEntry', 'A client profile already exists for this user')
      });
    }
    
    // 创建新客户资料
    const client = new Client({
      user: req.user._id,
      // 初始化基本信息
      personalInfo: {
        dateOfBirth: req.body.dateOfBirth,
        citizenship: req.body.citizenship,
        currentCountry: req.body.currentCountry,
        maritalStatus: req.body.maritalStatus
      }
    });
    
    await client.save();
    
    // 更新用户记录
    await User.findByIdAndUpdate(req.user._id, {
      hasClientProfile: true
    });
    
    return res.status(201).json({
      message: req.t('client.created', 'Client profile created successfully'),
      client
    });
  } catch (error) {
    console.error('Create client error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取客户资料（通过ID）
exports.getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await Client.findById(clientId)
      .populate('user', 'firstName lastName email phone')
      .populate('consultant', 'firstName lastName email');
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user._id.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant._id.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    return res.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取客户资料（通过用户ID）
exports.getClientByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 验证访问权限
    if (
      req.user._id.toString() !== userId && 
      req.user.role !== 'Admin' && 
      req.user.role !== 'Consultant'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    const client = await Client.findOne({ user: userId })
      .populate('user', 'firstName lastName email phone')
      .populate('consultant', 'firstName lastName email');
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 顾问权限检查
    if (
      req.user.role === 'Consultant' && 
      client.consultant && 
      req.user._id.toString() !== client.consultant._id.toString()
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    return res.json({ client });
  } catch (error) {
    console.error('Get client by user id error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新客户资料
exports.updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 更新允许的字段
    if (req.body.personalInfo) {
      client.personalInfo = {
        ...client.personalInfo,
        ...req.body.personalInfo
      };
    }
    
    if (req.body.contactInfo) {
      client.contactInfo = {
        ...client.contactInfo,
        ...req.body.contactInfo
      };
    }
    
    if (req.body.immigrationGoals) {
      client.immigrationGoals = {
        ...client.immigrationGoals,
        ...req.body.immigrationGoals
      };
    }
    
    // 判断资料是否完整
    let isComplete = true;
    
    if (
      !client.personalInfo.dateOfBirth ||
      !client.personalInfo.citizenship ||
      !client.personalInfo.currentCountry ||
      !client.personalInfo.maritalStatus
    ) {
      isComplete = false;
    }
    
    client.profileCompleted = isComplete;
    
    await client.save();
    
    return res.json({
      message: req.t('client.updated', 'Client profile updated successfully'),
      client
    });
  } catch (error) {
    console.error('Update client error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 添加教育经历
exports.addEducation = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 添加教育记录
    client.education.push({
      degree: req.body.degree,
      institution: req.body.institution,
      fieldOfStudy: req.body.fieldOfStudy,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      country: req.body.country,
      hasECA: req.body.hasECA || false,
      ecaAuthority: req.body.ecaAuthority,
      ecaDate: req.body.ecaDate
    });
    
    await client.save();
    
    return res.status(201).json({
      message: req.t('client.educationAdded', 'Education record added'),
      education: client.education[client.education.length - 1]
    });
  } catch (error) {
    console.error('Add education error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 处理文档上传(简化版本)
exports.addDocument = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 假设文件已上传到某个存储服务并返回URL
    const fileUrl = req.body.fileUrl || "https://example.com/dummy-file.pdf";
    
    // 添加文档记录
    client.documents.push({
      name: req.body.name,
      type: req.body.type,
      fileUrl: fileUrl,
      expiryDate: req.body.expiryDate,
      notes: req.body.notes
    });
    
    await client.save();
    
    return res.status(201).json({
      message: req.t('client.documentAdded', 'Document uploaded successfully'),
      document: client.documents[client.documents.length - 1]
    });
  } catch (error) {
    console.error('Add document error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新教育记录
exports.updateEducation = async (req, res) => {
  try {
    const { clientId, eduId } = req.params;
    const { degree, institution, fieldOfStudy, startDate, endDate, country, hasECA, ecaAuthority, ecaDate } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要更新的教育记录索引
    const eduIndex = client.education.findIndex(
      edu => edu._id.toString() === eduId
    );
    
    if (eduIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Education record not found')
      });
    }
    
    // 更新教育记录
    client.education[eduIndex] = {
      _id: client.education[eduIndex]._id, // 保留原始ID
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      country,
      hasECA,
      ecaAuthority,
      ecaDate
    };
    
    await client.save();
    
    return res.json({
      message: req.t('client.educationUpdated', 'Education record updated successfully'),
      education: client.education[eduIndex]
    });
  } catch (error) {
    console.error('Update education error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除教育记录
exports.deleteEducation = async (req, res) => {
  try {
    const { clientId, eduId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要删除的教育记录索引
    const eduIndex = client.education.findIndex(
      edu => edu._id.toString() === eduId
    );
    
    if (eduIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Education record not found')
      });
    }
    
    // 删除教育记录
    client.education.splice(eduIndex, 1);
    
    await client.save();
    
    return res.json({
      message: req.t('client.educationDeleted', 'Education record deleted successfully')
    });
  } catch (error) {
    console.error('Delete education error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 添加工作经验
exports.addWorkExperience = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { jobTitle, employer, country, startDate, endDate, isCurrentJob, duties, nocCode, hoursPerWeek } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 添加工作经验
    client.workExperience.push({
      jobTitle,
      employer,
      country,
      startDate,
      endDate,
      isCurrentJob,
      duties: duties || [],
      nocCode,
      hoursPerWeek
    });
    
    await client.save();
    
    return res.status(201).json({
      message: req.t('client.workExperienceAdded', 'Work experience added successfully'),
      workExperience: client.workExperience[client.workExperience.length - 1]
    });
  } catch (error) {
    console.error('Add work experience error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新工作经验
exports.updateWorkExperience = async (req, res) => {
  try {
    const { clientId, expId } = req.params;
    const { jobTitle, employer, country, startDate, endDate, isCurrentJob, duties, nocCode, hoursPerWeek } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要更新的工作经验索引
    const expIndex = client.workExperience.findIndex(
      exp => exp._id.toString() === expId
    );
    
    if (expIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Work experience record not found')
      });
    }
    
    // 更新工作经验
    client.workExperience[expIndex] = {
      _id: client.workExperience[expIndex]._id, // 保留原始ID
      jobTitle,
      employer,
      country,
      startDate,
      endDate,
      isCurrentJob,
      duties: duties || client.workExperience[expIndex].duties,
      nocCode,
      hoursPerWeek
    };
    
    await client.save();
    
    return res.json({
      message: req.t('client.workExperienceUpdated', 'Work experience updated successfully'),
      workExperience: client.workExperience[expIndex]
    });
  } catch (error) {
    console.error('Update work experience error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除工作经验
exports.deleteWorkExperience = async (req, res) => {
  try {
    const { clientId, expId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要删除的工作经验索引
    const expIndex = client.workExperience.findIndex(
      exp => exp._id.toString() === expId
    );
    
    if (expIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Work experience record not found')
      });
    }
    
    // 删除工作经验
    client.workExperience.splice(expIndex, 1);
    
    await client.save();
    
    return res.json({
      message: req.t('client.workExperienceDeleted', 'Work experience deleted successfully')
    });
  } catch (error) {
    console.error('Delete work experience error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 添加语言测试
exports.addLanguageTest = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { language, testType, dateOfTest, reading, writing, listening, speaking } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 添加语言测试
    client.languageTests.push({
      language,
      testType,
      dateOfTest,
      reading,
      writing,
      listening,
      speaking
    });
    
    await client.save();
    
    return res.status(201).json({
      message: req.t('client.languageTestAdded', 'Language test added successfully'),
      languageTest: client.languageTests[client.languageTests.length - 1]
    });
  } catch (error) {
    console.error('Add language test error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新语言测试
exports.updateLanguageTest = async (req, res) => {
  try {
    const { clientId, testId } = req.params;
    const { language, testType, dateOfTest, reading, writing, listening, speaking } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要更新的语言测试索引
    const testIndex = client.languageTests.findIndex(
      test => test._id.toString() === testId
    );
    
    if (testIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Language test not found')
      });
    }
    
    // 更新语言测试
    client.languageTests[testIndex] = {
      _id: client.languageTests[testIndex]._id, // 保留原始ID
      language,
      testType,
      dateOfTest,
      reading,
      writing,
      listening,
      speaking
    };
    
    await client.save();
    
    return res.json({
      message: req.t('client.languageTestUpdated', 'Language test updated successfully'),
      languageTest: client.languageTests[testIndex]
    });
  } catch (error) {
    console.error('Update language test error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除语言测试
exports.deleteLanguageTest = async (req, res) => {
  try {
    const { clientId, testId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要删除的语言测试索引
    const testIndex = client.languageTests.findIndex(
      test => test._id.toString() === testId
    );
    
    if (testIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Language test not found')
      });
    }
    
    // 删除语言测试
    client.languageTests.splice(testIndex, 1);
    
    await client.save();
    
    return res.json({
      message: req.t('client.languageTestDeleted', 'Language test deleted successfully')
    });
  } catch (error) {
    console.error('Delete language test error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新文档
exports.updateDocument = async (req, res) => {
  try {
    const { clientId, docId } = req.params;
    const { documentType, documentNumber, issueDate, expiryDate, notes } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要更新的文档索引
    const docIndex = client.documents.findIndex(
      doc => doc._id.toString() === docId
    );
    
    if (docIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Document not found')
      });
    }
    
    // 更新文档（保留原始文件路径和上传信息）
    client.documents[docIndex] = {
      ...client.documents[docIndex],
      documentType,
      documentNumber,
      issueDate,
      expiryDate,
      notes
    };
    
    await client.save();
    
    return res.json({
      message: req.t('client.documentUpdated', 'Document updated successfully'),
      document: client.documents[docIndex]
    });
  } catch (error) {
    console.error('Update document error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除文档
exports.deleteDocument = async (req, res) => {
  try {
    const { clientId, docId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== client.user.toString() && 
      req.user.role !== 'Admin' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 查找要删除的文档索引
    const docIndex = client.documents.findIndex(
      doc => doc._id.toString() === docId
    );
    
    if (docIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Document not found')
      });
    }
    
    // 获取文件路径，以便删除存储的文件
    const filePath = client.documents[docIndex].filePath;
    
    // 如果使用本地文件系统或云存储，可以在这里添加删除文件的逻辑
    // 例如：await fileService.deleteFile(filePath);
    
    // 删除文档记录
    client.documents.splice(docIndex, 1);
    
    await client.save();
    
    return res.json({
      message: req.t('client.documentDeleted', 'Document deleted successfully')
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 添加笔记
exports.addNote = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { content, isPrivate } = req.body;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 验证访问权限（只有顾问和管理员可以添加笔记）
    if (req.user.role !== 'Consultant' && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 如果是顾问，确认是否被分配给此客户
    if (
      req.user.role === 'Consultant' && 
      (!client.consultant || req.user._id.toString() !== client.consultant.toString())
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'You are not the assigned consultant for this client')
      });
    }
    
    // 添加笔记
    client.notes.push({
      content,
      author: req.user._id,
      isPrivate: isPrivate || false
    });
    
    await client.save();
    
    // 返回添加的笔记，并填充作者信息
    const populatedClient = await Client.findById(clientId)
      .populate('notes.author', 'firstName lastName');
    
    const newNote = populatedClient.notes[populatedClient.notes.length - 1];
    
    return res.status(201).json({
      message: req.t('client.noteAdded', 'Note added successfully'),
      note: newNote
    });
  } catch (error) {
    console.error('Add note error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除笔记
exports.deleteNote = async (req, res) => {
  try {
    const { clientId, noteId } = req.params;
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client not found')
      });
    }
    
    // 查找要删除的笔记索引
    const noteIndex = client.notes.findIndex(
      note => note._id.toString() === noteId
    );
    
    if (noteIndex === -1) {
      return res.status(404).json({
        message: req.t('errors.notFound', 'Note not found')
      });
    }
    
    // 验证删除权限（只有笔记作者或管理员可以删除笔记）
    if (
      client.notes[noteIndex].author.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'You do not have permission to delete this note')
      });
    }
    
    // 删除笔记
    client.notes.splice(noteIndex, 1);
    
    await client.save();
    
    return res.json({
      message: req.t('client.noteDeleted', 'Note deleted successfully')
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
}; 