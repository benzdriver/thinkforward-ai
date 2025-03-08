const Form = require('../models/Form');
const User = require('../models/User');

// 创建表单模板
exports.createFormTemplate = async (req, res) => {
  try {
    // 验证权限（只有顾问和管理员可以创建表单模板）
    if (req.user.role !== 'Consultant' && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    const { title, description, formType, fields, category } = req.body;
    
    // 验证必要字段
    if (!title || !formType || !fields || !Array.isArray(fields)) {
      return res.status(400).json({
        message: req.t('errors.missingParameters', 'Missing required parameters')
      });
    }
    
    // 创建表单模板
    const template = new Form({
      title,
      description,
      formType,
      fields,
      createdBy: req.user._id,
      isTemplate: true,
      category: category || 'general'
    });
    
    await template.save();
    
    return res.status(201).json({
      message: req.t('form.created', 'Form template created successfully'),
      template
    });
  } catch (error) {
    console.error('Create form template error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取表单模板列表
exports.getFormTemplates = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // 构建查询条件
    const query = {
      isTemplate: true
    };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 查找表单模板
    const templates = await Form.find(query)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'firstName lastName');
    
    return res.json({ templates });
  } catch (error) {
    console.error('Get form templates error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取特定表单模板
exports.getFormTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const template = await Form.findOne({
      _id: templateId,
      isTemplate: true
    }).populate('createdBy', 'firstName lastName');
    
    if (!template) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form template not found')
      });
    }
    
    return res.json({ template });
  } catch (error) {
    console.error('Get form template error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 基于模板创建表单实例
exports.createFormInstance = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const template = await Form.findOne({
      _id: templateId,
      isTemplate: true
    });
    
    if (!template) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form template not found')
      });
    }
    
    // 创建表单实例
    const formInstance = new Form({
      title: template.title,
      description: template.description,
      formType: template.formType,
      fields: template.fields,
      createdBy: req.user._id,
      isTemplate: false,
      category: template.category
    });
    
    await formInstance.save();
    
    return res.status(201).json({
      message: req.t('form.created', 'Form instance created successfully'),
      form: formInstance
    });
  } catch (error) {
    console.error('Create form instance error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取表单实例
exports.getFormInstanceById = async (req, res) => {
  try {
    const { instanceId } = req.params;
    
    const form = await Form.findOne({
      _id: instanceId,
      isTemplate: false
    }).populate('createdBy', 'firstName lastName');
    
    if (!form) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== form.createdBy._id.toString() && 
      req.user.role !== 'Admin' && 
      req.user.role !== 'Consultant'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    return res.json({ form });
  } catch (error) {
    console.error('Get form instance error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取用户的表单实例
exports.getUserFormInstances = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;
    
    // 如果查询其他用户的表单，验证权限
    if (
      userId.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin' && 
      req.user.role !== 'Consultant'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    const forms = await Form.find({
      createdBy: userId,
      isTemplate: false
    }).sort({ updatedAt: -1 });
    
    return res.json({ forms });
  } catch (error) {
    console.error('Get user forms error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新表单实例
exports.updateFormInstance = async (req, res) => {
  try {
    const { instanceId } = req.params;
    
    const form = await Form.findOne({
      _id: instanceId,
      isTemplate: false
    });
    
    if (!form) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== form.createdBy.toString() && 
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 更新表单数据
    if (req.body.data) {
      form.data = req.body.data;
    }
    
    await form.save();
    
    return res.json({
      message: req.t('form.updated', 'Form updated successfully'),
      form
    });
  } catch (error) {
    console.error('Update form error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 提交表单实例
exports.submitFormInstance = async (req, res) => {
  try {
    const { instanceId } = req.params;
    
    const form = await Form.findOne({
      _id: instanceId,
      isTemplate: false
    });
    
    if (!form) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form not found')
      });
    }
    
    // 验证访问权限
    if (
      req.user._id.toString() !== form.createdBy.toString() && 
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    // 更新表单数据和状态
    if (req.body.data) {
      form.data = req.body.data;
    }
    
    form.isActive = false; // 标记为已提交
    
    await form.save();
    
    return res.json({
      message: req.t('form.submitted', 'Form submitted successfully'),
      form
    });
  } catch (error) {
    console.error('Submit form error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 搜索表单
exports.searchForms = async (req, res) => {
  try {
    const { query, formType, isTemplate, category } = req.query;
    
    // 构建查询条件
    const searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (formType) {
      searchQuery.formType = formType;
    }
    
    if (isTemplate !== undefined) {
      searchQuery.isTemplate = isTemplate === 'true';
    }
    
    if (category) {
      searchQuery.category = category;
    }
    
    // 顾问和管理员可以看到所有表单，普通用户只能看到自己的和公开的模板
    if (req.user.role !== 'Admin' && req.user.role !== 'Consultant') {
      if (isTemplate === 'true') {
        // 普通用户可以看到所有模板
      } else {
        // 普通用户只能看到自己的表单实例
        searchQuery.createdBy = req.user._id;
      }
    }
    
    const forms = await Form.find(searchQuery)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'firstName lastName');
    
    return res.json({ forms });
  } catch (error) {
    console.error('Search forms error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除表单模板
exports.deleteFormTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const template = await Form.findOne({
      _id: templateId,
      isTemplate: true
    });
    
    if (!template) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form template not found')
      });
    }
    
    // 验证删除权限（创建者、管理员可以删除）
    if (
      req.user._id.toString() !== template.createdBy.toString() && 
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    await Form.deleteOne({ _id: templateId });
    
    return res.json({
      message: req.t('form.deleted', 'Form template deleted successfully')
    });
  } catch (error) {
    console.error('Delete form template error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除表单实例
exports.deleteFormInstance = async (req, res) => {
  try {
    const { instanceId } = req.params;
    
    const form = await Form.findOne({
      _id: instanceId,
      isTemplate: false
    });
    
    if (!form) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form not found')
      });
    }
    
    // 验证删除权限（创建者、管理员可以删除）
    if (
      req.user._id.toString() !== form.createdBy.toString() && 
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        message: req.t('errors.forbidden', 'Access denied')
      });
    }
    
    await Form.deleteOne({ _id: instanceId });
    
    return res.json({
      message: req.t('form.deleted', 'Form deleted successfully')
    });
  } catch (error) {
    console.error('Delete form instance error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
}; 