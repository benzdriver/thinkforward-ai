const { connectToDatabase } = require('../../_utils/db');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../../../../models/User');
const logger = require('../../../../utils/logger');

/**
 * Serverless function for synchronizing Clerk users with MongoDB
 * This function can be triggered by a cron job from Vercel
 * https://vercel.com/docs/cron-jobs
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Cron-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized' 
    });
  }

  try {
    await connectToDatabase();
    
    logger.info('Starting scheduled user synchronization');
    
    const stats = {
      checked: 0,
      updated: 0,
      created: 0,
      errors: 0
    };
    
    const batchSize = 100;
    let hasMore = true;
    let offset = 0;
    
    while (hasMore) {
      try {
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
        
        for (const clerkUser of clerkUsers) {
          try {
            const primaryEmail = clerkUser.emailAddresses.find(
              email => email.id === clerkUser.primaryEmailAddressId
            )?.emailAddress;
            
            if (!primaryEmail) {
              logger.warn(`User ${clerkUser.id} has no primary email, skipping`);
              continue;
            }
            
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
                firstName: clerkUser.firstName || 'User',
                lastName: clerkUser.lastName || '',
                createdAt: new Date(clerkUser.createdAt),
                lastLogin: new Date(clerkUser.lastSignInAt || clerkUser.createdAt)
              });
              
              stats.created++;
            } else {
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
            
            if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
              if (!user.socialLogins) user.socialLogins = [];
              
              let socialUpdated = false;
              
              for (const account of clerkUser.externalAccounts) {
                const provider = account.provider.replace('oauth_', '');
                const providerId = account.externalId;
                
                const exists = user.socialLogins.some(
                  sl => sl.provider === provider && sl.providerId === providerId
                );
                
                if (!exists) {
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
            
            await user.save();
            
          } catch (userError) {
            logger.error(`Error processing user ${clerkUser.id}:`, userError);
            stats.errors++;
          }
        }
        
        logger.info(`Sync progress: Processed ${stats.checked} users`);
        
      } catch (batchError) {
        logger.error('Error getting user batch:', batchError);
        stats.errors++;
        hasMore = false; // 停止处理
      }
    }
    
    logger.info('User synchronization completed', stats);
    
    return res.status(200).json({
      success: true,
      message: 'User synchronization completed',
      stats
    });
  } catch (error) {
    logger.error('Error in scheduled user synchronization:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error', 
      error: error.message 
    });
  }
};
