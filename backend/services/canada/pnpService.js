const PNPProgram = require('../../models/canada/PNPProgram');

/**
 * Check eligibility for provincial programs
 * @param {String} province - Province code
 * @param {Object} profile - User profile data
 * @returns {Promise<Array>} - List of eligible programs
 */
exports.checkEligibility = async (province, profile) => {
  try {
    const allPrograms = await PNPProgram.find({ province });
    
    const eligiblePrograms = allPrograms.filter(program => {
      return checkProgramEligibility(program, profile);
    });
    
    return eligiblePrograms;
  } catch (error) {
    throw error;
  }
};

/**
 * Get provincial programs for a specific province
 * @param {String} province - Province code
 * @returns {Promise<Array>} - List of provincial programs
 */
exports.getProvincialPrograms = async (province) => {
  try {
    return getMockProgramsForProvince(province);
  } catch (error) {
    throw error;
  }
};

/**
 * Check if a profile is eligible for a specific program
 * @param {Object} program - PNP program
 * @param {Object} profile - User profile
 * @returns {Boolean} - Whether the profile is eligible
 */
function checkProgramEligibility(program, profile) {
  if (program.ageRange) {
    if (profile.age < program.ageRange.min || profile.age > program.ageRange.max) {
      return false;
    }
  }
  
  if (program.educationRequirement) {
    if (!profile.education || !profile.education.length) {
      return false;
    }
    
    const hasRequiredEducation = profile.education.some(edu => {
      const levelRanking = {
        'highSchool': 1,
        'oneYearDiploma': 2,
        'twoYearDiploma': 3,
        'bachelors': 4,
        'twoOrMoreDegrees': 5,
        'masters': 6,
        'phd': 7
      };
      
      const requiredLevel = levelRanking[program.educationRequirement];
      const profileLevel = levelRanking[edu.level];
      
      return profileLevel >= requiredLevel;
    });
    
    if (!hasRequiredEducation) {
      return false;
    }
  }
  
  if (program.languageRequirement) {
    if (!profile.languageProficiency || !profile.languageProficiency.length) {
      return false;
    }
    
    const hasRequiredLanguage = profile.languageProficiency.some(lang => {
      const clbLevel = calculateCLBLevel(lang);
      return clbLevel >= program.languageRequirement.clbLevel;
    });
    
    if (!hasRequiredLanguage) {
      return false;
    }
  }
  
  if (program.workExperienceRequirement) {
    if (!profile.workExperience || !profile.workExperience.length) {
      return false;
    }
    
    const totalExperience = profile.workExperience.reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      return total + months;
    }, 0);
    
    if (totalExperience < program.workExperienceRequirement.months) {
      return false;
    }
    
    if (program.workExperienceRequirement.nocCodes && program.workExperienceRequirement.nocCodes.length > 0) {
      const hasRequiredNOC = profile.workExperience.some(exp => {
        return exp.occupation && exp.occupation.noc && 
               program.workExperienceRequirement.nocCodes.includes(exp.occupation.noc);
      });
      
      if (!hasRequiredNOC) {
        return false;
      }
    }
  }
  
  if (program.connectionToProvinceRequired) {
    if (!profile.connectionsToProvince || !profile.connectionsToProvince[program.province]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculate CLB level from language test scores
 * @param {Object} languageTest - Language test data
 * @returns {Number} - CLB level
 */
function calculateCLBLevel(languageTest) {
  
  if (languageTest.test === 'IELTS') {
    const scores = [
      languageTest.speaking,
      languageTest.listening,
      languageTest.reading,
      languageTest.writing
    ];
    
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / 4;
    
    if (avgScore >= 8.0) return 10;
    if (avgScore >= 7.5) return 9;
    if (avgScore >= 7.0) return 8;
    if (avgScore >= 6.5) return 7;
    if (avgScore >= 6.0) return 6;
    if (avgScore >= 5.5) return 5;
    if (avgScore >= 5.0) return 4;
    return 0;
  }
  
  if (languageTest.test === 'CELPIP') {
    const scores = [
      languageTest.speaking,
      languageTest.listening,
      languageTest.reading,
      languageTest.writing
    ];
    
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / 4;
    
    return Math.min(10, avgScore);
  }
  
  return 5; // Default CLB level for French tests
}

/**
 * Get mock programs for a province
 * @param {String} province - Province code
 * @returns {Array} - List of provincial programs
 */
function getMockProgramsForProvince(province) {
  const programs = {
    'ontario': [
      {
        id: 'on-001',
        name: 'Ontario Immigrant Nominee Program (OINP) - Human Capital Priorities Stream',
        description: 'For skilled workers with experience in Ontario\'s priority occupations',
        eligibilityCriteria: [
          'Express Entry profile',
          'NOC 0, A, or B work experience',
          'Minimum CLB 7',
          'Minimum education of Bachelor\'s degree'
        ],
        processingTime: '60-90 days',
        applicationFee: 1500
      },
      {
        id: 'on-002',
        name: 'Ontario Immigrant Nominee Program (OINP) - Skilled Trades Stream',
        description: 'For skilled workers with experience in eligible trades',
        eligibilityCriteria: [
          'Express Entry profile',
          'Eligible trade experience',
          'Minimum CLB 5 for most trades',
          'Job offer in Ontario'
        ],
        processingTime: '30-60 days',
        applicationFee: 1500
      }
    ],
    'british_columbia': [
      {
        id: 'bc-001',
        name: 'British Columbia Provincial Nominee Program (BC PNP) - Skills Immigration',
        description: 'For skilled workers with experience in high-demand occupations',
        eligibilityCriteria: [
          'Job offer from BC employer',
          'Minimum education requirements',
          'Minimum language proficiency',
          'Minimum income requirements'
        ],
        processingTime: '2-3 months',
        applicationFee: 1150
      },
      {
        id: 'bc-002',
        name: 'British Columbia Provincial Nominee Program (BC PNP) - Express Entry BC',
        description: 'Fast-track option for candidates in Express Entry system',
        eligibilityCriteria: [
          'Express Entry profile',
          'Job offer from BC employer',
          'Meet Express Entry criteria',
          'Minimum CLB 7'
        ],
        processingTime: '2-3 weeks',
        applicationFee: 1150
      }
    ],
    'alberta': [
      {
        id: 'ab-001',
        name: 'Alberta Immigrant Nominee Program (AINP) - Alberta Express Entry Stream',
        description: 'For Express Entry candidates with strong ties to Alberta',
        eligibilityCriteria: [
          'Express Entry profile',
          'Minimum CRS score of 300',
          'Work experience in eligible occupation',
          'Ties to Alberta (education, work, family)'
        ],
        processingTime: '6-8 months',
        applicationFee: 500
      }
    ],
    'quebec': [
      {
        id: 'qc-001',
        name: 'Quebec Skilled Worker Program (QSWP)',
        description: 'For skilled workers who want to become permanent residents of Quebec',
        eligibilityCriteria: [
          'Minimum education requirements',
          'French language proficiency',
          'Work experience in eligible occupation',
          'Intention to live in Quebec'
        ],
        processingTime: '12-24 months',
        applicationFee: 822
      }
    ]
  };
  
  return programs[province] || [];
}
