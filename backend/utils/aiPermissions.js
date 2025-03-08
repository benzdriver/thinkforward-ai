const { UserRole } = require('../types/user');

const aiFeaturePermissions = {
  [UserRole.ADMIN]: {
    canUseAIChat: true,
    canPerformAssessment: true,
    canUseFormHelper: true,
    canReviewDocuments: true,
    canAccessAllChats: true,
    canTrainAI: true
  },
  [UserRole.CONSULTANT]: {
    canUseAIChat: true,
    canPerformAssessment: true,
    canUseFormHelper: true,
    canReviewDocuments: true,
    canAccessClientChats: true,
    canTrainAI: false
  },
  [UserRole.CLIENT]: {
    canUseAIChat: true,
    canPerformAssessment: true,
    canUseFormHelper: true,
    canReviewDocuments: false,
    canAccessAllChats: false,
    canTrainAI: false
  },
  [UserRole.GUEST]: {
    canUseAIChat: true,
    canPerformAssessment: true,
    canUseFormHelper: false,
    canReviewDocuments: false,
    canAccessAllChats: false,
    canTrainAI: false
  }
};

module.exports = aiFeaturePermissions; 