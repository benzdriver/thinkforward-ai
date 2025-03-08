const User = require('../models/User');
const logger = require('../utils/logger');
const clerkClient = require('../utils/clerkClient');
const { syncSocialLogins } = require('../utils/socialLogins');

/**
 * 创建中间件来同步每次认证后的用户信息
 */
const authSyncMiddleware = async (req, res, next) => {
  // 只处理已认证的请求
  if (!req.auth || !req.auth.userId) {
    return next();
  }
  
  try {
    const clerkUserId = req.auth.userId;
    
    // 查找或创建用户
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      // 用户在本地不存在，从Clerk获取信息
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      // 获取主邮箱
      const primaryEmail = clerkUser.emailAddresses.find(
        email => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
      
      if (!primaryEmail) {
        logger.warn(`同步中间件: 用户 ${clerkUserId} 没有主邮箱`);
        return next();
      }
      
      // 创建新用户
      user = new User({
        clerkId: clerkUserId,
        authProvider: 'clerk',
        email: primaryEmail,
        firstName: clerkUser.firstName || 'User',
        lastName: clerkUser.lastName || '',
        lastLogin: new Date()
      });
      
      // 同步社交登录
      if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
        syncSocialLogins(user, clerkUser.externalAccounts);
      }
      
      await user.save();
      logger.info(`用户 ${clerkUserId} 同步完成`);
    } else {
      // 更新最后登录时间
      user.lastLogin = new Date();
      await user.save();
    }
    
    // 将用户附加到请求
    req.dbUser = user;
    
    next();
  } catch (error) {
    logger.error('认证同步中间件错误:', error);
    next(); // 继续处理请求，不要因同步失败而阻断用户
  }
};

module.exports = authSyncMiddleware; 