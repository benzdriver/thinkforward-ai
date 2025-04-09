const PNPProgram = require('../../models/canada/PNPProgram');

exports.checkEligibility = async (req, res) => {
  try {
    const { province, profile } = req.body;
    
    const allPrograms = await PNPProgram.find({ province });
    
    const eligiblePrograms = allPrograms.filter(program => {
      return checkProgramEligibility(program, profile);
    });
    
    return res.status(200).json({
      success: true,
      eligiblePrograms
    });
  } catch (error) {
    console.error('Error checking PNP eligibility:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check PNP eligibility',
      error: error.message
    });
  }
};

exports.getProvincialPrograms = async (req, res) => {
  try {
    const { province } = req.params;
    
    const programs = getMockProgramsForProvince(province);
    
    return res.status(200).json({
      success: true,
      programs
    });
  } catch (error) {
    console.error('Error fetching provincial programs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch provincial programs',
      error: error.message
    });
  }
};

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
    ],
    'manitoba': [
      {
        id: 'mb-001',
        name: 'Manitoba Provincial Nominee Program (MPNP) - Skilled Worker Overseas',
        description: 'For skilled workers outside Canada with connection to Manitoba',
        eligibilityCriteria: [
          'Connection to Manitoba (family, education, work)',
          'Minimum CLB 7',
          'Minimum education of high school',
          'Work experience in eligible occupation'
        ],
        processingTime: '6 months',
        applicationFee: 500
      }
    ],
    'saskatchewan': [
      {
        id: 'sk-001',
        name: 'Saskatchewan Immigrant Nominee Program (SINP) - Express Entry',
        description: 'For Express Entry candidates with skills and experience in demand in Saskatchewan',
        eligibilityCriteria: [
          'Express Entry profile',
          'Minimum CLB 7',
          'Post-secondary education',
          'Work experience in eligible occupation'
        ],
        processingTime: '3-6 months',
        applicationFee: 350
      }
    ],
    'nova_scotia': [
      {
        id: 'ns-001',
        name: 'Nova Scotia Nominee Program (NSNP) - Express Entry Stream',
        description: 'For Express Entry candidates with strong ties to Nova Scotia',
        eligibilityCriteria: [
          'Express Entry profile',
          'Minimum CLB 7',
          'Post-secondary education',
          'Work experience in eligible occupation'
        ],
        processingTime: '3 months',
        applicationFee: 300
      }
    ],
    'new_brunswick': [
      {
        id: 'nb-001',
        name: 'New Brunswick Provincial Nominee Program (NBPNP) - Express Entry Stream',
        description: 'For Express Entry candidates with strong ties to New Brunswick',
        eligibilityCriteria: [
          'Express Entry profile',
          'Minimum CLB 7',
          'Post-secondary education',
          'Work experience in eligible occupation'
        ],
        processingTime: '5-6 months',
        applicationFee: 250
      }
    ],
    'prince_edward_island': [
      {
        id: 'pei-001',
        name: 'Prince Edward Island Provincial Nominee Program (PEI PNP) - Express Entry',
        description: 'For Express Entry candidates with skills needed in PEI',
        eligibilityCriteria: [
          'Express Entry profile',
          'Minimum CLB 7',
          'Post-secondary education',
          'Work experience in eligible occupation'
        ],
        processingTime: '2-3 months',
        applicationFee: 300
      }
    ],
    'newfoundland_and_labrador': [
      {
        id: 'nl-001',
        name: 'Newfoundland and Labrador Provincial Nominee Program (NLPNP) - Skilled Worker',
        description: 'For skilled workers with job offers in Newfoundland and Labrador',
        eligibilityCriteria: [
          'Job offer from NL employer',
          'Minimum CLB 5',
          'Post-secondary education',
          'Work experience in eligible occupation'
        ],
        processingTime: '6 months',
        applicationFee: 250
      }
    ],
    'yukon': [
      {
        id: 'yt-001',
        name: 'Yukon Nominee Program (YNP) - Skilled Worker',
        description: 'For skilled workers with job offers in Yukon',
        eligibilityCriteria: [
          'Job offer from Yukon employer',
          'Minimum CLB 6',
          'Relevant education or training',
          'Work experience in eligible occupation'
        ],
        processingTime: '3-4 months',
        applicationFee: 250
      }
    ],
    'northwest_territories': [
      {
        id: 'nt-001',
        name: 'Northwest Territories Nominee Program (NTNP) - Skilled Worker',
        description: 'For skilled workers with job offers in Northwest Territories',
        eligibilityCriteria: [
          'Job offer from NT employer',
          'Minimum CLB 6',
          'Relevant education or training',
          'Work experience in eligible occupation'
        ],
        processingTime: '4-5 months',
        applicationFee: 300
      }
    ],
    'nunavut': [
      {
        id: 'nu-001',
        name: 'Nunavut Nominee Program - Skilled Worker',
        description: 'For skilled workers with job offers in Nunavut',
        eligibilityCriteria: [
          'Job offer from Nunavut employer',
          'Minimum CLB 6',
          'Relevant education or training',
          'Work experience in eligible occupation'
        ],
        processingTime: '4-6 months',
        applicationFee: 300
      }
    ]
  };
  
  return programs[province] || [];
}
