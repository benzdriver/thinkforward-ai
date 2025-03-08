/**
 * 同步用户社交登录信息的通用函数
 */
const syncSocialLogins = (user, clerkExternalAccounts) => {
  if (!clerkExternalAccounts || !clerkExternalAccounts.length) return;
  
  if (!user.socialLogins) user.socialLogins = [];
  
  for (const account of clerkExternalAccounts) {
    // 统一处理提供商名称
    const provider = account.provider.toLowerCase()
      .replace('oauth_', '')
      .replace('_oauth', '');
    
    const providerId = account.externalId;
    
    // 检查是否已存在
    const existingIndex = user.socialLogins.findIndex(
      sl => sl.provider === provider && sl.providerId === providerId
    );
    
    if (existingIndex >= 0) {
      // 更新现有关联
      user.socialLogins[existingIndex].lastUsed = new Date();
    } else {
      // 添加新关联
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
    }
  }
  
  return user;
};

module.exports = { syncSocialLogins }; 