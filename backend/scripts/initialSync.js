const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const logger = require('../utils/logger');
const { syncSocialLogins } = require('../utils/userSync');

const initialSync = async () => {
  try {
    logger.info('开始初始数据同步');
    
    // 读取所有Clerk用户
    let allClerkUsers = [];
    let hasMore = true;
    let offset = 0;
    const limit = 100;
    
    while (hasMore) {
      const users = await clerkClient.users.getUserList({
        limit,
        offset
      });
      
      allClerkUsers = [...allClerkUsers, ...users];
      
      if (users.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
      
      logger.info(`已获取 ${allClerkUsers.length} 个Clerk用户`);
    }
    
    // 同步每个用户
    const results = {
      total: allClerkUsers.length,
      created: 0,
      updated: 0,
      errors: 0
    };
    
    for (const clerkUser of allClerkUsers) {
      try {
        // 获取主邮箱
        const primaryEmail = clerkUser.emailAddresses.find(
          email => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;
        
        if (!primaryEmail) {
          logger.warn(`用户 ${clerkUser.id} 没有主邮箱，跳过`);
          continue;
        }
        
        // 查找或创建用户
        let user = await User.findOne({ 
          $or: [
            { clerkId: clerkUser.id },
            { email: primaryEmail }
          ]
        });
        
        const isNew = !user;
        
        if (isNew) {
          user = new User({
            clerkId: clerkUser.id,
            authProvider: 'clerk',
            email: primaryEmail,
            firstName: clerkUser.firstName || 'User',
            lastName: clerkUser.lastName || '',
            createdAt: new Date(clerkUser.createdAt),
            lastLogin: new Date(clerkUser.lastSignInAt || clerkUser.createdAt)
          });
        } else {
          // 更新基本信息
          user.clerkId = clerkUser.id;
          user.email = primaryEmail;
          user.firstName = clerkUser.firstName || user.firstName;
          user.lastName = clerkUser.lastName || user.lastName;
        }
        
        // 同步社交登录
        if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
          syncSocialLogins(user, clerkUser.externalAccounts);
        }
        
        await user.save();
        
        if (isNew) {
          results.created++;
        } else {
          results.updated++;
        }
      } catch (error) {
        logger.error(`同步用户 ${clerkUser.id} 时出错:`, error);
        results.errors++;
      }
    }
    
    logger.info('初始同步完成', results);
    return results;
  } catch (error) {
    logger.error('初始同步出错:', error);
    throw error;
  }
};

// 如果直接运行脚本
if (require.main === module) {
  initialSync()
    .then(() => {
      console.log('初始同步完成');
      process.exit(0);
    })
    .catch(err => {
      console.error('初始同步失败:', err);
      process.exit(1);
    });
}

module.exports = {
  initialSync,
  // 其他函数...
}; 