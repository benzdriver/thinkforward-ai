const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const logger = require('../utils/logger');
const config = require('../config');
const { ROLES } = require('../constants/roles');
const { 
  syncClerkUser, 
  updateUserFromClerk, 
  handleUserDeletion,
  syncSocialLogins 
} = require('../utils/userSync');

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

// 统一处理所有Clerk事件的端点
router.post('/', verifyClerkWebhook, async (req, res) => {
  const startTime = Date.now();
  const { type, data } = req.body;
  
  // 添加事件开始处理日志
  logger.info(`开始处理Webhook事件: ${type}`, { 
    eventType: type,
    dataId: data.id,
    requestId: req.headers['svix-id']
  });
  
  try {
    logger.info(`收到Clerk webhook事件: ${type}`);
    
    switch (type) {
      case 'user.created':
        await syncClerkUser(data);
        break;
      case 'user.updated':
        await updateUserFromClerk(data);
        break;
      case 'user.deleted':
        await handleUserDeletion(data.id);
        break;
      case 'session.created':
        await handleSessionCreated(data);
        break;
      case 'session.revoked':
      case 'session.removed':
        logger.info(`会话事件 ${type}: ${data.id}`);
        break;
      case 'user.email.created':
      case 'user.email.updated':
        if (data.user_id) {
          const clerkUser = await clerkClient.users.getUser(data.user_id);
          await updateUserFromClerk(clerkUser);
        }
        break;
      case 'oauth.access_token.created':
      case 'oauth.access_token.refreshed':
        if (data.user_id) {
          const clerkUser = await clerkClient.users.getUser(data.user_id);
          const userId = await getUserIdByClerkId(data.user_id);
          if (userId && clerkUser.externalAccounts) {
            await syncSocialLogins(userId, clerkUser.externalAccounts);
          }
        }
        break;
      default:
        logger.info(`未处理的Webhook事件类型: ${type}`);
    }
    
    const endTime = Date.now();
    logger.info(`成功处理Webhook事件: ${type}`, {
      eventType: type,
      dataId: data.id,
      requestId: req.headers['svix-id'],
      processingTime: `${endTime - startTime}ms`
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    const endTime = Date.now();
    logger.error(`Webhook处理错误: ${error.message}`, {
      eventType: type,
      dataId: data?.id,
      requestId: req.headers['svix-id'],
      processingTime: `${endTime - startTime}ms`,
      error
    });
    
    return res.status(200).json({ success: false, error: error.message });
  }
});

// 会话创建处理函数
async function handleSessionCreated(sessionData) {
  try {
    const userId = sessionData.user_id;
    
    const user = await User.findOne({ clerkId: userId });
    
    if (user) {
      user.lastLogin = new Date();
      user.lastLoginIP = sessionData.client_ip || null;
      if (user.failedLoginAttempts > 0) {
        user.failedLoginAttempts = 0;
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          user.lockedUntil = null;
        }
      }
      
      await user.save();
      logger.info(`用户 ${user.email} (Clerk ID: ${userId}) 登录成功`);
    } else {
      logger.warn(`会话创建: 用户 ${userId} 在本地数据库中不存在`);
    }
  } catch (error) {
    logger.error(`处理会话创建失败: ${error.message}`, { error });
    throw error;
  }
}

// 辅助函数 - 通过ClerkID获取用户ID
async function getUserIdByClerkId(clerkId) {
  try {
    const user = await User.findOne({ clerkId });
    return user ? user._id : null;
  } catch (error) {
    logger.error(`获取用户ID失败: ${error.message}`, { error });
    return null;
  }
}

module.exports = router; 