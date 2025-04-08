const ExpressEntryProfile = require('../../models/canada/ExpressEntryProfile');

/**
 * Calculate CRS score based on Express Entry criteria
 * @param {Object} profile - Express Entry profile data
 * @returns {Number} - Calculated CRS score
 */
exports.calculateCRSScore = (profile) => {
  let score = 0;
  
  score += calculateAgePoints(profile.age);
  score += calculateEducationPoints(profile.education);
  score += calculateLanguagePoints(profile.languageProficiency);
  score += calculateWorkExperiencePoints(profile.workExperience);
  
  if (profile.maritalStatus === 'married' || profile.maritalStatus === 'commonLaw') {
    if (profile.spouse) {
      score += calculateSpousePoints(profile.spouse);
    }
  }
  
  score += calculateSkillTransferabilityPoints(profile);
  
  if (profile.hasProvincialNomination) {
    score += 600; // Provincial nomination
  } else if (profile.hasJobOffer) {
    if (profile.jobOfferDetails && profile.jobOfferDetails.noc) {
      if (['00'].includes(profile.jobOfferDetails.noc.substring(0, 2))) {
        score += 200; // NOC 00 (senior management)
      } else if (['0', '1', '2', '3'].includes(profile.jobOfferDetails.noc.substring(0, 1))) {
        score += 50; // NOC 0, 1, 2, 3
      }
    }
  }
  
  if (profile.hasCanadianEducation) {
    score += 30; // Canadian education
  }
  
  if (profile.hasFrenchProficiency) {
    score += 30; // French language proficiency
  }
  
  if (profile.hasSiblingInCanada) {
    score += 15; // Sibling in Canada
  }
  
  return score;
};

/**
 * Save Express Entry profile to database
 * @param {Object} profileData - Express Entry profile data
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Saved profile
 */
exports.saveProfile = async (profileData, userId) => {
  try {
    if (profileData._id) {
      const updatedProfile = await ExpressEntryProfile.findByIdAndUpdate(
        profileData._id,
        profileData,
        { new: true }
      );
      
      if (!updatedProfile) {
        throw new Error('Profile not found');
      }
      
      return updatedProfile;
    }
    
    const profile = new ExpressEntryProfile({
      ...profileData,
      userId,
      crsScore: exports.calculateCRSScore(profileData),
      lastCalculated: new Date()
    });
    
    await profile.save();
    
    return profile;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Express Entry profile by ID
 * @param {String} profileId - Profile ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Retrieved profile
 */
exports.getProfile = async (profileId, userId) => {
  try {
    const profile = await ExpressEntryProfile.findById(profileId);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    if (profile.userId.toString() !== userId) {
      throw new Error('Unauthorized to access this profile');
    }
    
    return profile;
  } catch (error) {
    throw error;
  }
};

/**
 * Get latest Express Entry draws
 * @returns {Array} - Latest Express Entry draws
 */
exports.getLatestDraws = () => {
  return [
    {
      drawNumber: 245,
      drawDate: '2023-11-08',
      programType: 'Express Entry',
      invitationsIssued: 4750,
      minimumScore: 481,
      tieBreakRule: '2023-10-15 11:22:33 UTC'
    },
    {
      drawNumber: 244,
      drawDate: '2023-10-25',
      programType: 'Express Entry',
      invitationsIssued: 4300,
      minimumScore: 491,
      tieBreakRule: '2023-10-01 09:12:45 UTC'
    },
    {
      drawNumber: 243,
      drawDate: '2023-10-11',
      programType: 'PNP only',
      invitationsIssued: 1548,
      minimumScore: 776,
      tieBreakRule: '2023-09-18 14:32:12 UTC'
    }
  ];
};

function calculateAgePoints(age) {
  if (age < 18 || age > 45) return 0;
  
  const agePoints = {
    18: 90, 19: 95, 20: 100, 21: 100, 22: 100, 23: 100, 24: 100, 25: 100, 26: 100, 27: 100, 28: 100, 29: 100,
    30: 95, 31: 90, 32: 85, 33: 80, 34: 75, 35: 70, 36: 65, 37: 60, 38: 55, 39: 50, 40: 45, 41: 35, 42: 25, 43: 15, 44: 5, 45: 0
  };
  
  return agePoints[age] || 0;
}

function calculateEducationPoints(education) {
  if (!education || !education.length) return 0;
  
  const highestEducation = education.reduce((highest, current) => {
    const levelRanking = {
      'highSchool': 1,
      'oneYearDiploma': 2,
      'twoYearDiploma': 3,
      'bachelors': 4,
      'twoOrMoreDegrees': 5,
      'masters': 6,
      'phd': 7
    };
    
    if (levelRanking[current.level] > levelRanking[highest.level]) {
      return current;
    }
    return highest;
  }, education[0]);
  
  const educationPoints = {
    'highSchool': 30,
    'oneYearDiploma': 90,
    'twoYearDiploma': 98,
    'bachelors': 120,
    'twoOrMoreDegrees': 128,
    'masters': 135,
    'phd': 150
  };
  
  return educationPoints[highestEducation.level] || 0;
}

function calculateLanguagePoints(languageProficiency) {
  if (!languageProficiency || !languageProficiency.length) return 0;
  
  let points = 0;
  
  const firstLanguage = languageProficiency.find(lang => 
    lang.language === 'english' || lang.language === 'french'
  );
  
  if (firstLanguage) {
    const clbLevel = calculateCLBLevel(firstLanguage);
    
    const firstLanguagePoints = {
      4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34
    };
    
    points += (firstLanguagePoints[clbLevel] || 0) * 4;
  }
  
  const secondLanguage = languageProficiency.find(lang => 
    lang.language !== firstLanguage.language
  );
  
  if (secondLanguage) {
    const clbLevel = calculateCLBLevel(secondLanguage);
    
    const secondLanguagePoints = {
      4: 0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 6, 10: 6
    };
    
    points += (secondLanguagePoints[clbLevel] || 0) * 4;
  }
  
  return points;
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

function calculateWorkExperiencePoints(workExperience) {
  if (!workExperience || !workExperience.length) return 0;
  
  const canadianExperience = workExperience
    .filter(exp => exp.isCanadianExperience)
    .reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      return total + months;
    }, 0) / 12; // Convert months to years
  
  let points = 0;
  if (canadianExperience >= 5) points = 80;
  else if (canadianExperience >= 4) points = 70;
  else if (canadianExperience >= 3) points = 64;
  else if (canadianExperience >= 2) points = 53;
  else if (canadianExperience >= 1) points = 40;
  
  return points;
}

function calculateSpousePoints(spouse) {
  let points = 0;
  
  if (spouse.education && spouse.education.length) {
    const highestEducation = spouse.education.reduce((highest, current) => {
      const levelRanking = {
        'highSchool': 1,
        'oneYearDiploma': 2,
        'twoYearDiploma': 3,
        'bachelors': 4,
        'twoOrMoreDegrees': 5,
        'masters': 6,
        'phd': 7
      };
      
      if (levelRanking[current.level] > levelRanking[highest.level]) {
        return current;
      }
      return highest;
    }, spouse.education[0]);
    
    const educationPoints = {
      'highSchool': 0,
      'oneYearDiploma': 2,
      'twoYearDiploma': 6,
      'bachelors': 7,
      'twoOrMoreDegrees': 8,
      'masters': 9,
      'phd': 10
    };
    
    points += educationPoints[highestEducation.level] || 0;
  }
  
  if (spouse.languageProficiency && spouse.languageProficiency.length) {
    const firstLanguage = spouse.languageProficiency[0];
    const clbLevel = calculateCLBLevel(firstLanguage);
    
    const languagePoints = {
      4: 0, 5: 5, 6: 10, 7: 15, 8: 20, 9: 20, 10: 20
    };
    
    points += languagePoints[clbLevel] || 0;
  }
  
  if (spouse.canadianWorkExperience) {
    const years = spouse.canadianWorkExperience / 12; // Convert months to years
    
    if (years >= 5) points += 10;
    else if (years >= 3) points += 8;
    else if (years >= 2) points += 5;
    else if (years >= 1) points += 3;
  }
  
  return points;
}

function calculateSkillTransferabilityPoints(profile) {
  let points = 0;
  
  if (profile.education && profile.education.length && profile.languageProficiency && profile.languageProficiency.length) {
    const highestEducation = profile.education.reduce((highest, current) => {
      const levelRanking = {
        'highSchool': 1,
        'oneYearDiploma': 2,
        'twoYearDiploma': 3,
        'bachelors': 4,
        'twoOrMoreDegrees': 5,
        'masters': 6,
        'phd': 7
      };
      
      if (levelRanking[current.level] > levelRanking[highest.level]) {
        return current;
      }
      return highest;
    }, profile.education[0]);
    
    const firstLanguage = profile.languageProficiency[0];
    const clbLevel = calculateCLBLevel(firstLanguage);
    
    if (highestEducation.level === 'bachelors' || highestEducation.level === 'twoOrMoreDegrees') {
      if (clbLevel >= 9) points += 50;
      else if (clbLevel >= 7) points += 25;
    } else if (highestEducation.level === 'masters' || highestEducation.level === 'phd') {
      if (clbLevel >= 9) points += 50;
      else if (clbLevel >= 7) points += 25;
    }
  }
  
  if (profile.workExperience && profile.workExperience.length && profile.languageProficiency && profile.languageProficiency.length) {
    const foreignExperience = profile.workExperience
      .filter(exp => !exp.isCanadianExperience)
      .reduce((total, exp) => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
        return total + months;
      }, 0) / 12; // Convert months to years
    
    const firstLanguage = profile.languageProficiency[0];
    const clbLevel = calculateCLBLevel(firstLanguage);
    
    if (foreignExperience >= 3) {
      if (clbLevel >= 9) points += 50;
      else if (clbLevel >= 7) points += 25;
    } else if (foreignExperience >= 1) {
      if (clbLevel >= 9) points += 25;
      else if (clbLevel >= 7) points += 13;
    }
  }
  
  return Math.min(100, points); // Cap at 100 points
}
