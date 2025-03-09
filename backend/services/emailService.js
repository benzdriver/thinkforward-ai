const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');
const i18next = require('i18next');

// 创建邮件发送器
let transporter;

if (process.env.NODE_ENV === 'production') {
  // 生产环境使用配置的SMTP
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
} else {
  // 开发环境可以使用 ethereal.email
  nodemailer.createTestAccount().then(account => {
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
  });
}

/**
 * 发送邀请邮件
 * @param {string} email - 接收者邮箱
 * @param {string} role - 被邀请的角色
 * @param {string} inviteLink - 邀请链接
 * @param {string} [language='en'] - 邮件语言
 */
const sendInviteEmail = async (email, role, inviteLink, language = 'en') => {
  try {
    // 使用i18next加载本地化文本而不是硬编码
    const translatedRole = i18next.t(`users:roles.${role.toLowerCase()}`, { lng: language });
    
    const subject = i18next.t('users:invitation.title', { lng: language });
    const greeting = i18next.t('users:invitation.greeting', { lng: language });
    const message = i18next.t('users:invitation.message', { lng: language, role: translatedRole });
    const button = i18next.t('users:invitation.button', { lng: language });
    const expires = i18next.t('users:invitation.expires', { lng: language });
    const ignore = i18next.t('users:invitation.ignore', { lng: language });
    
    // 构建HTML邮件
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a6ee0;">${subject}</h1>
        <p>${greeting}</p>
        <p>${message}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">${button}</a>
        </div>
        <p style="color: #888; font-size: 0.9em;">${expires}</p>
        <p style="color: #888; font-size: 0.9em;">${ignore}</p>
      </div>
    `;
    
    const info = await transporter.sendMail({
      from: `"ThinkForward.ai" <${config.email.from}>`,
      to: email,
      subject: subject,
      html: html
    });
    
    logger.info(`邀请邮件已发送: ${info.messageId}`);
    
    // 如果是测试账户，记录预览URL
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`邮件预览URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    logger.error('发送邀请邮件错误:', error);
    throw error;
  }
};

/**
 * 生成邀请链接
 * @param {string} userId - 用户ID
 * @returns {string} - 邀请链接
 */
const generateInviteLink = (userId) => {
  const token = Buffer.from(`${userId}-${Date.now()}`).toString('base64');
  return `${config.frontend.url}/invite/accept?token=${token}`;
};

module.exports = {
  sendInviteEmail,
  generateInviteLink
}; 