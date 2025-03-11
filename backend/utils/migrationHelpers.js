const User = require('../models/User');
const AuthService = require('../services/authService');
const logger = require('./logger');

const authService = new AuthService();

/**
 * 为用户设置本地密码 (从Clerk迁移到本地认证)
 */
const setLocalPassword = async (userId, password) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 设置新密码
    user.password = password;
    await user.save();
    
    logger.info(`用户 ${user.email} 设置了本地密码`);
    return true;
  } catch (error) {
    logger.error(`设置本地密码失败: ${error.message}`, { error });
    throw error;
  }
};

/**
 * 为没有本地密码的用户生成和发送密码设置链接
 * (批量迁移辅助工具)
 */
const generatePasswordSetupLinks = async () => {
  try {
    // 查找所有没有本地密码的非删除用户
    const users = await User.find({
      password: { $exists: false },
      isDeleted: { $ne: true }
    });
    
    logger.info(`找到 ${users.length} 个需要设置本地密码的用户`);
    
    // 为每个用户生成密码设置令牌
    const results = [];
    for (const user of users) {
      // 生成一次性令牌
      const token = authService.generatePasswordSetupToken(user._id);
      const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${token}`;
      
      results.push({
        email: user.email,
        userId: user._id,
        setupLink
      });
      
      // 这里可以添加发送邮件的逻辑
    }
    
    return results;
  } catch (error) {
    logger.error(`生成密码设置链接失败: ${error.message}`, { error });
    throw error;
  }
};

/**
 * 验证密码设置令牌并设置新密码
 */
const verifyAndSetPassword = async (token, newPassword) => {
  try {
    // 验证令牌
    const decoded = authService.verifyPasswordSetupToken(token);
    
    // 设置新密码
    return await setLocalPassword(decoded.id, newPassword);
  } catch (error) {
    logger.error(`验证密码令牌失败: ${error.message}`, { error });
    throw error;
  }
};

module.exports = {
  setLocalPassword,
  generatePasswordSetupLinks,
  verifyAndSetPassword
}; 