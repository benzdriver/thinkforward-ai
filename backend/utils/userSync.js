const User = require('../models/User');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const logger = require('./logger');
const { ROLES } = require('../constants/roles');

/**
 * 从 Clerk 同步用户到本地数据库
 */
const syncClerkUser = async (clerkUser) => {
  try {
    // 检查用户是否已存在
    let user = await User.findOne({ clerkId: clerkUser.id });
    
    // 获取主电子邮件
    const primaryEmail = clerkUser.email_addresses?.find(email => 
      email.id === clerkUser.primary_email_address_id
    )?.email_address;
    
    if (!user) {
      // 创建新用户
      user = new User({
        clerkId: clerkUser.id,
        email: primaryEmail,
        firstName: clerkUser.first_name || '',
        lastName: clerkUser.last_name || '',
        role: ROLES.CLIENT, // 默认角色
        profileCompleted: false,
        createdAt: new Date(clerkUser.created_at)
      });
      
      await user.save();
      logger.info(`从 Clerk 创建了新用户: ${primaryEmail}`);
    } else {
      // 更新现有用户
      user.email = primaryEmail || user.email;
      user.firstName = clerkUser.first_name || user.firstName;
      user.lastName = clerkUser.last_name || user.lastName;
      user.updatedAt = new Date();
      
      await user.save();
      logger.info(`更新了用户数据: ${user.email}`);
    }
    
    return user;
  } catch (error) {
    logger.error(`同步 Clerk 用户失败: ${error.message}`, { error });
    throw error;
  }
};

/**
 * 更新本地用户数据与 Clerk 保持一致
 */
const updateUserFromClerk = async (clerkUser) => {
  try {
    const user = await User.findOne({ clerkId: clerkUser.id });
    
    if (!user) {
      logger.warn(`尝试更新不存在的用户: Clerk ID ${clerkUser.id}`);
      // 如果用户不存在，创建新用户
      return await syncClerkUser(clerkUser);
    }
    
    // 获取主电子邮件
    const primaryEmail = clerkUser.email_addresses?.find(email => 
      email.id === clerkUser.primary_email_address_id
    )?.email_address;
    
    // 更新用户字段
    if (primaryEmail && primaryEmail !== user.email) {
      user.email = primaryEmail;
    }
    
    user.firstName = clerkUser.first_name || user.firstName;
    user.lastName = clerkUser.last_name || user.lastName;
    user.updatedAt = new Date();
    
    await user.save();
    logger.info(`已更新用户 ${user.email} 的数据`);
    
    return user;
  } catch (error) {
    logger.error(`更新用户数据失败: ${error.message}`, { error });
    throw error;
  }
};

/**
 * 处理用户删除
 */
const handleUserDeletion = async (clerkId) => {
  try {
    // 选项 1: 硬删除
    // await User.deleteOne({ clerkId });
    
    // 选项 2: 软删除 (推荐)
    const user = await User.findOne({ clerkId });
    if (user) {
      user.isDeleted = true;
      user.deletedAt = new Date();
      await user.save();
      logger.info(`标记用户 ${user.email} 为已删除`);
    }
  } catch (error) {
    logger.error(`处理用户删除失败: ${error.message}`, { error });
    throw error;
  }
};

/**
 * 同步用户的社交登录账号
 */
const syncSocialLogins = async (userId, socialAccounts) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`尝试同步不存在用户的社交登录: ${userId}`);
      return null;
    }
    
    // 更新社交账号信息
    user.socialLogins = socialAccounts.map(account => ({
      provider: account.provider,
      providerId: account.provider_user_id,
      lastLogin: new Date()
    }));
    
    await user.save();
    logger.info(`已更新用户 ${user.email} 的社交登录信息`);
    
    return user;
  } catch (error) {
    logger.error(`同步社交登录失败: ${error.message}`, { error });
    throw error;
  }
};

/**
 * 从 Clerk 批量同步所有用户
 * 用于初始化或修复数据
 */
const syncAllUsers = async () => {
  try {
    const userList = await clerkClient.users.getUserList();
    logger.info(`从 Clerk 获取了 ${userList.length} 个用户`);
    
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    for (const clerkUser of userList) {
      try {
        const user = await User.findOne({ clerkId: clerkUser.id });
        
        if (user) {
          await updateUserFromClerk(clerkUser);
          updated++;
        } else {
          await syncClerkUser(clerkUser);
          created++;
        }
      } catch (error) {
        logger.error(`同步用户 ${clerkUser.id} 失败: ${error.message}`);
        errors++;
      }
    }
    
    return { created, updated, errors, total: userList.length };
  } catch (error) {
    logger.error(`批量同步用户失败: ${error.message}`, { error });
    throw error;
  }
};

module.exports = {
  syncClerkUser,
  updateUserFromClerk,
  handleUserDeletion,
  syncSocialLogins,
  syncAllUsers
}; 