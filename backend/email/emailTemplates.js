const { t } = require('../utils/i18nHelper');

// 替换硬编码的中英文模板
const emailTemplates = {
  // 欢迎邮件
  welcome: (user, language = 'en') => ({
    subject: t('email:welcome.subject', 'Welcome to ThinkForward AI', {}, language),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${t('email:welcome.heading', 'Welcome to ThinkForward AI!', {}, language)}</h1>
        <p>${t('email:welcome.greeting', 'Hello', {}, language)} ${user.firstName},</p>
        <p>${t('email:welcome.message', 'Thank you for creating an account with ThinkForward AI. We\'re excited to help you with your immigration journey.', {}, language)}</p>
        <p>${t('email:welcome.getStarted', 'To get started, you can:', {}, language)}</p>
        <ul>
          <li>${t('email:welcome.feature1', 'Chat with our AI Assistant', {}, language)}</li>
          <li>${t('email:welcome.feature2', 'Create client profiles', {}, language)}</li>
          <li>${t('email:welcome.feature3', 'Get AI assessments', {}, language)}</li>
        </ul>
        <p>${t('email:welcome.closing', 'If you have any questions, please don\'t hesitate to contact us.', {}, language)}</p>
        <p>${t('email:welcome.signature', 'Best regards,', {}, language)}<br>ThinkForward AI Team</p>
      </div>
    `
  }),
  
  // 密码重置
  passwordReset: (resetLink, language = 'en') => ({
    subject: t('email:passwordReset.subject', 'Reset Your Password', {}, language),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${t('email:passwordReset.heading', 'Password Reset Request', {}, language)}</h1>
        <p>${t('email:passwordReset.message', 'You requested to reset your password. Please click the link below to set a new password:', {}, language)}</p>
        <p style="text-align: center;">
          <a href="${resetLink}" style="display: inline-block; background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            ${t('email:passwordReset.button', 'Reset Password', {}, language)}
          </a>
        </p>
        <p>${t('email:passwordReset.expiry', 'This link will expire in 24 hours.', {}, language)}</p>
        <p>${t('email:passwordReset.ignoreMessage', 'If you didn\'t request a password reset, you can safely ignore this email.', {}, language)}</p>
        <p>${t('email:passwordReset.signature', 'Best regards,', {}, language)}<br>ThinkForward AI Team</p>
      </div>
    `
  }),
  
  // 添加其他邮件模板
  reminderNotification: (reminder, language = 'en') => ({
    subject: t('email:reminder.subject', 'Immigration Task Reminder', {}, language),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${t('email:reminder.heading', 'Reminder: Upcoming Immigration Task', {}, language)}</h1>
        <p>${t('email:reminder.message', 'This is a reminder about your upcoming immigration task:', {}, language)}</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>${t('email:reminder.title', 'Task', {}, language)}:</strong> ${reminder.title}</p>
          <p><strong>${t('email:reminder.dueDate', 'Due Date', {}, language)}:</strong> ${reminder.dueDate}</p>
          <p><strong>${t('email:reminder.description', 'Description', {}, language)}:</strong> ${reminder.description}</p>
        </div>
        <p>${t('email:reminder.action', 'Please make sure to complete this task before the due date.', {}, language)}</p>
        <p>${t('email:reminder.signature', 'Best regards,', {}, language)}<br>ThinkForward AI Team</p>
      </div>
    `
  })
};

module.exports = emailTemplates; 