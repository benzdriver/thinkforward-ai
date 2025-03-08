const { Clerk } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const config = require('../config');

const clerk = new Clerk({ secretKey: config.clerk.secretKey });

/**
 * 认证中间件
 * 使用Clerk验证会话并查找或创建用户
 */
const auth = async (req, res, next) => {
  try {
    // 从请求头中获取令牌
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: req.t('errors.unauthorized', 'Unauthorized')
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 使用Clerk验证令牌
    const { sub: clerkUserId, sessionId } = await clerk.verifyToken(token);
    
    if (!clerkUserId) {
      return res.status(401).json({
        message: req.t('errors.unauthorized', 'Unauthorized')
      });
    }
    
    // 获取Clerk用户数据
    const clerkUser = await clerk.users.getUser(clerkUserId);
    
    if (!clerkUser) {
      return res.status(401).json({
        message: req.t('errors.unauthorized', 'Unauthorized')
      });
    }
    
    // 查找或创建用户
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      // 创建新用户
      const primaryEmail = clerkUser.emailAddresses.find(email => 
        email.id === clerkUser.primaryEmailAddressId
      );
      
      user = await User.create({
        clerkId: clerkUserId,
        email: primaryEmail ? primaryEmail.emailAddress : '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        role: 'Client', // 默认角色
        profileComplete: false,
        subscriptionStatus: 'Free',
        subscriptionExpiry: null,
      });
    }
    
    // 将用户信息附加到请求对象
    req.user = user;
    req.sessionId = sessionId;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      message: req.t('errors.unauthorized', 'Authentication failed')
    });
  }
};

module.exports = auth; 