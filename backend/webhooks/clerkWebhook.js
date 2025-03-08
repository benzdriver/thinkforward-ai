const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const logger = require('../utils/logger');
const config = require('../config');
const { syncSocialLogins } = require('../utils/syncSocialLogins');

// 验证Clerk的Webhook请求
const verifyClerkWebhook = (req, res, next) => {
  try {
    // 获取Clerk签名
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];
    
    if (!svix_id || !svix_timestamp || !svix_signature) {
      logger.warn('Webhook调用缺少Svix头信息');
      return res.status(401).json({ message: 'Missing Svix headers' });
    }
    
    // 准备要验证的消息
    const body = JSON.stringify(req.body);
    const payload = `${svix_id}.${svix_timestamp}.${body}`;
    
    // 验证签名
    const signature = crypto
      .createHmac('sha256', config.clerk.webhookSecret)
      .update(payload)
      .digest('hex');
    
    if (signature !== svix_signature) {
      logger.warn('Webhook签名验证失败');
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    next();
  } catch (error) {
    logger.error('Webhook验证错误:', error);
    return res.status(500).json({ message: 'Verification error' });
  }
};

// 处理用户创建事件
router.post('/user.created', verifyClerkWebhook, async (req, res) => {
  try {
    const { data: clerkUser } = req.body;
    
    // 获取用户主邮箱
    const primaryEmail = clerkUser.email_addresses.find(
      email => email.id === clerkUser.primary_email_address_id
    )?.email_address;
    
    if (!primaryEmail) {
      logger.warn(`Webhook: 用户 ${clerkUser.id} 没有主邮箱，跳过`);
      return res.status(200).json({ message: 'Skipped - no primary email' });
    }
    
    // 创建或更新用户
    let user = await User.findOne({ 
      $or: [
        { clerkId: clerkUser.id },
        { email: primaryEmail }
      ]
    });
    
    if (!user) {
      user = new User({
        clerkId: clerkUser.id,
        authProvider: 'clerk',
        email: primaryEmail,
        firstName: clerkUser.first_name || 'User',
        lastName: clerkUser.last_name || '',
        createdAt: new Date()
      });
    }
    
    // 同步社交登录(使用您刚接受的工具函数)
    if (clerkUser.external_accounts && clerkUser.external_accounts.length > 0) {
      syncSocialLogins(user, clerkUser.external_accounts);
    }
    
    await user.save();
    logger.info(`Webhook: 用户 ${clerkUser.id} 已同步`);
    
    return res.status(200).json({ message: 'User synchronized' });
  } catch (error) {
    logger.error('Webhook处理错误:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
});

// 处理用户更新事件
router.post('/user.updated', verifyClerkWebhook, async (req, res) => {
  try {
    const userData = req.body.data;
    
    logger.info(`收到用户更新Webhook: ${userData.id}`);
    
    // 找到用户
    let user = await User.findOne({ clerkId: userData.id });
    
    if (!user) {
      logger.warn(`用户 ${userData.id} 不存在，可能是首次同步`);
      
      // 尝试通过邮箱查找
      const primaryEmailObj = userData.email_addresses.find(
        email => email.id === userData.primary_email_address_id
      );
      
      if (primaryEmailObj) {
        user = await User.findOne({ email: primaryEmailObj.email_address });
      }
      
      if (!user) {
        // 如果仍找不到，创建新用户
        return res.redirect(307, '/api/webhooks/clerk/user.created');
      }
    }
    
    // 更新基本信息
    user.firstName = userData.first_name || user.firstName;
    user.lastName = userData.last_name || user.lastName;
    
    // 更新邮箱(如果主邮箱发生变化)
    const primaryEmailObj = userData.email_addresses.find(
      email => email.id === userData.primary_email_address_id
    );
    
    if (primaryEmailObj && primaryEmailObj.email_address !== user.email) {
      user.email = primaryEmailObj.email_address;
    }
    
    // 处理外部账户变化(社交登录)
    if (userData.external_accounts && userData.external_accounts.length > 0) {
      if (!user.socialLogins) user.socialLogins = [];
      
      // 检查新的社交登录
      for (const externalAccount of userData.external_accounts) {
        const provider = externalAccount.provider.replace('oauth_', '');
        const providerId = externalAccount.provider_user_id;
        
        // 检查是否已存在此社交登录
        const existingIndex = user.socialLogins.findIndex(
          login => login.provider === provider && login.providerId === providerId
        );
        
        if (existingIndex === -1) {
          // 添加新的社交登录
          user.socialLogins.push({
            provider,
            providerId,
            data: {
              email: externalAccount.email_address,
              username: externalAccount.username,
              firstName: externalAccount.first_name,
              lastName: externalAccount.last_name,
              avatarUrl: externalAccount.avatar_url
            },
            lastUsed: new Date(),
            createdAt: new Date(externalAccount.created_at || Date.now())
          });
        }
      }
    }
    
    await user.save();
    
    logger.info(`用户更新同步成功: ${userData.id}`);
    return res.status(200).json({ message: 'User updated' });
  } catch (error) {
    logger.error('用户更新Webhook处理错误:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
});

// 处理社交登录添加事件
router.post('/externalAccount.created', verifyClerkWebhook, async (req, res) => {
  try {
    const accountData = req.body.data;
    const userId = accountData.user_id;
    
    logger.info(`收到社交账号创建Webhook: ${accountData.id} 用户: ${userId}`);
    
    // 查找用户
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      logger.warn(`用户 ${userId} 不存在，跳过社交账号同步`);
      return res.status(200).json({ message: 'User not found' });
    }
    
    // 准备添加新的社交登录
    if (!user.socialLogins) user.socialLogins = [];
    
    const provider = accountData.provider.replace('oauth_', '');
    const providerId = accountData.provider_user_id;
    
    // 检查是否已存在
    const existingIndex = user.socialLogins.findIndex(
      login => login.provider === provider && login.providerId === providerId
    );
    
    if (existingIndex === -1) {
      // 添加新的社交登录
      user.socialLogins.push({
        provider,
        providerId,
        data: {
          email: accountData.email_address,
          username: accountData.username,
          firstName: accountData.first_name,
          lastName: accountData.last_name,
          avatarUrl: accountData.avatar_url
        },
        lastUsed: new Date(),
        createdAt: new Date()
      });
      
      await user.save();
      logger.info(`为用户 ${userId} 添加社交登录 ${provider} 成功`);
    } else {
      logger.info(`用户 ${userId} 已有社交登录 ${provider}`);
    }
    
    return res.status(200).json({ message: 'Social login synced' });
  } catch (error) {
    logger.error('社交账号创建Webhook处理错误:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
});

// 处理用户登录事件
router.post('/session.created', verifyClerkWebhook, async (req, res) => {
  try {
    const sessionData = req.body.data;
    const userId = sessionData.user_id;
    
    logger.info(`收到用户登录Webhook: ${userId}`);
    
    // 更新最后登录时间
    const user = await User.findOne({ clerkId: userId });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
      logger.info(`更新用户 ${userId} 最后登录时间`);
    }
    
    return res.status(200).json({ message: 'Login recorded' });
  } catch (error) {
    logger.error('登录Webhook处理错误:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
});

// 注册Clerk webhook路由
module.exports = router; 