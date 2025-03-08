const cron = require('node-cron');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * 定期检查并同步Clerk和本地数据库
 * 每天凌晨2点运行
 */
const scheduleDataSync = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('开始定期数据同步检查');
      
      // 计数器
      const stats = {
        checked: 0,
        updated: 0,
        created: 0,
        errors: 0
      };
      
      // 分批处理所有Clerk用户
      const batchSize = 100;
      let hasMore = true;
      let offset = 0;
      
      while (hasMore) {
        try {
          // 获取一批用户
          const clerkUsers = await clerkClient.users.getUserList({
            limit: batchSize,
            offset
          });
          
          stats.checked += clerkUsers.length;
          
          if (clerkUsers.length < batchSize) {
            hasMore = false;
          } else {
            offset += batchSize;
          }
          
          // 处理这批用户
          for (const clerkUser of clerkUsers) {
            try {
              // 获取主邮箱
              const primaryEmail = clerkUser.emailAddresses.find(
                email => email.id === clerkUser.primaryEmailAddressId
              )?.emailAddress;
              
              if (!primaryEmail) {
                logger.warn(`用户 ${clerkUser.id} 没有主邮箱，跳过`);
                continue;
              }
              
              // 查找本地用户
              let user = await User.findOne({ 
                $or: [
                  { clerkId: clerkUser.id },
                  { email: primaryEmail }
                ]
              });
              
              // 如果找不到，创建新用户
              if (!user) {
                user = new User({
                  clerkId: clerkUser.id,
                  authProvider: 'clerk',
                  email: primaryEmail,
                  firstName: clerkUser.firstName || 'User',
                  lastName: clerkUser.lastName || '',
                  createdAt: new Date(clerkUser.createdAt),
                  lastLogin: new Date(clerkUser.lastSignInAt || clerkUser.createdAt)
                });
                
                stats.created++;
              } else {
                // 更新基本信息
                let updated = false;
                
                if (user.clerkId !== clerkUser.id) {
                  user.clerkId = clerkUser.id;
                  updated = true;
                }
                
                if (user.email !== primaryEmail) {
                  user.email = primaryEmail;
                  updated = true;
                }
                
                if (user.firstName !== clerkUser.firstName && clerkUser.firstName) {
                  user.firstName = clerkUser.firstName;
                  updated = true;
                }
                
                if (user.lastName !== clerkUser.lastName && clerkUser.lastName) {
                  user.lastName = clerkUser.lastName;
                  updated = true;
                }
                
                if (updated) {
                  stats.updated++;
                }
              }
              
              // 同步社交登录
              if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
                if (!user.socialLogins) user.socialLogins = [];
                
                let socialUpdated = false;
                
                for (const account of clerkUser.externalAccounts) {
                  const provider = account.provider.replace('oauth_', '');
                  const providerId = account.externalId;
                  
                  // 检查是否已存在
                  const exists = user.socialLogins.some(
                    sl => sl.provider === provider && sl.providerId === providerId
                  );
                  
                  if (!exists) {
                    // 添加社交登录
                    user.socialLogins.push({
                      provider,
                      providerId,
                      data: {
                        email: account.emailAddress,
                        username: account.username,
                        avatarUrl: account.avatarUrl
                      },
                      lastUsed: new Date(),
                      createdAt: new Date(account.createdAt || Date.now())
                    });
                    
                    socialUpdated = true;
                  }
                }
                
                if (socialUpdated && !stats.updated.includes(user._id)) {
                  stats.updated++;
                }
              }
              
              // 保存更改
              await user.save();
              
            } catch (userError) {
              logger.error(`处理用户 ${clerkUser.id} 时出错:`, userError);
              stats.errors++;
            }
          }
          
          // 记录批次进度
          logger.info(`同步进度: 已处理 ${stats.checked} 个用户`);
          
        } catch (batchError) {
          logger.error('获取用户批次时出错:', batchError);
          stats.errors++;
          hasMore = false; // 停止处理
        }
      }
      
      logger.info('数据同步完成', stats);
      
    } catch (error) {
      logger.error('定期数据同步出错:', error);
    }
  });
  
  logger.info('数据同步计划已设置 - 每天凌晨2点运行');
};

module.exports = {
  scheduleDataSync
}; 