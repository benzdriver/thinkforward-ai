# ThinkForward AI - Directory Structure for Canadian Market Focus

This document outlines the proposed directory structure for implementing the Canadian market focus modules in the ThinkForward AI application.

## Frontend Directory Structure

```
frontend/
├── components/
│   ├── canada/
│   │   ├── express-entry/
│   │   │   ├── PointsCalculator.tsx
│   │   │   ├── EligibilityChecker.tsx
│   │   │   ├── ProfileCreator.tsx
│   │   │   └── index.ts
│   │   ├── pnp/
│   │   │   ├── ProvinceSelector.tsx
│   │   │   ├── ProgramFinder.tsx
│   │   │   ├── EligibilityChecker.tsx
│   │   │   └── index.ts
│   │   ├── documents/
│   │   │   ├── ChecklistGenerator.tsx
│   │   │   ├── DocumentUploader.tsx
│   │   │   ├── ValidationStatus.tsx
│   │   │   └── index.ts
│   │   ├── consultant/
│   │   │   ├── CanadianCaseManager.tsx
│   │   │   ├── RegulatoryCompliance.tsx
│   │   │   ├── CanadianFeeCalculator.tsx
│   │   │   └── index.ts
│   │   ├── analytics/
│   │   │   ├── ProcessingTimeChart.tsx
│   │   │   ├── SuccessRateDisplay.tsx
│   │   │   ├── RegionalTrends.tsx
│   │   │   └── index.ts
│   │   └── common/
│   │       ├── CanadianFlag.tsx
│   │       ├── ProvinceMap.tsx
│   │       ├── BilingualToggle.tsx
│   │       └── index.ts
│   └── ai/
│       ├── CanadianPolicyAdvisor.tsx
│       ├── BilingualAssistant.tsx
│       └── index.ts
├── pages/
│   ├── canada/
│   │   ├── index.tsx
│   │   ├── express-entry.tsx
│   │   ├── provincial-programs.tsx
│   │   ├── family-sponsorship.tsx
│   │   ├── business-immigration.tsx
│   │   ├── temporary-residence.tsx
│   │   └── consultant/
│   │       ├── dashboard.tsx
│   │       ├── cases.tsx
│   │       ├── compliance.tsx
│   │       └── analytics.tsx
│   └── api/
│       └── canada/
│           ├── express-entry.ts
│           ├── pnp.ts
│           ├── documents.ts
│           ├── consultant.ts
│           ├── analytics.ts
│           └── ai.ts
├── public/
│   ├── images/
│   │   └── canada/
│   │       ├── flags/
│   │       ├── provinces/
│   │       ├── landmarks/
│   │       └── icons/
│   └── locales/
│       ├── en/
│       │   ├── canada.json
│       │   ├── express-entry.json
│       │   ├── provincial-programs.json
│       │   └── canadian-documents.json
│       └── fr/
│           ├── canada.json
│           ├── express-entry.json
│           ├── provincial-programs.json
│           └── canadian-documents.json
└── contexts/
    └── CanadianImmigrationContext.tsx
```

## Backend Directory Structure

```
backend/
├── controllers/
│   └── canada/
│       ├── expressEntryController.js
│       ├── pnpController.js
│       ├── documentController.js
│       ├── consultantController.js
│       ├── analyticsController.js
│       └── aiController.js
├── models/
│   └── canada/
│       ├── ExpressEntryProfile.js
│       ├── PNPApplication.js
│       ├── CanadianDocument.js
│       ├── CanadianCase.js
│       ├── ConsultantCompliance.js
│       └── CanadianAnalytics.js
├── services/
│   └── canada/
│       ├── expressEntryService.js
│       ├── pnpService.js
│       ├── documentService.js
│       ├── consultantService.js
│       ├── analyticsService.js
│       └── aiService.js
├── routes/
│   └── canada/
│       ├── expressEntryRoutes.js
│       ├── pnpRoutes.js
│       ├── documentRoutes.js
│       ├── consultantRoutes.js
│       ├── analyticsRoutes.js
│       └── aiRoutes.js
├── ai/
│   └── canada/
│       ├── policyAdvisor.js
│       ├── documentAnalyzer.js
│       ├── eligibilityAssessor.js
│       └── bilingualProcessor.js
└── locales/
    ├── en/
    │   └── canada/
    │       ├── express-entry.json
    │       ├── pnp.json
    │       └── errors.json
    └── fr/
        └── canada/
            ├── express-entry.json
            ├── pnp.json
            └── errors.json
```

# Code Templates

## Frontend Templates

### React Component Template (TypeScript)

```tsx
// components/canada/express-entry/PointsCalculator.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '@/contexts/CanadianImmigrationContext';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@/components/ui';
import type { ExpressEntryProfile } from '@/types/canada';

interface PointsCalculatorProps {
  initialProfile?: Partial<ExpressEntryProfile>;
  onScoreCalculated?: (score: number, profile: ExpressEntryProfile) => void;
}

export const PointsCalculator: React.FC<PointsCalculatorProps> = ({ 
  initialProfile = {}, 
  onScoreCalculated 
}) => {
  const { t } = useTranslation('express-entry');
  const { calculateExpressEntryPoints } = useCanadianImmigration();
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [score, setScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ExpressEntryProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset score when inputs change
    setScore(null);
  };

  const handleCalculateScore = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      
      // Validate required fields
      if (!profile.age || !profile.educationLevel || !profile.languageProficiency) {
        throw new Error(t('errors.missingRequiredFields'));
      }
      
      const calculatedScore = await calculateExpressEntryPoints(profile as ExpressEntryProfile);
      setScore(calculatedScore);
      
      if (onScoreCalculated) {
        onScoreCalculated(calculatedScore, profile as ExpressEntryProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="points-calculator">
      <h2>{t('calculator.title')}</h2>
      <p>{t('calculator.description')}</p>
      
      <div className="form-section">
        <h3>{t('calculator.personalInfo')}</h3>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.age')}</InputLabel>
          <TextField
            type="number"
            value={profile.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value, 10))}
            label={t('calculator.age')}
          />
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.educationLevel')}</InputLabel>
          <Select
            value={profile.educationLevel || ''}
            onChange={(e) => handleInputChange('educationLevel', e.target.value)}
            label={t('calculator.educationLevel')}
          >
            <MenuItem value="highSchool">{t('education.highSchool')}</MenuItem>
            <MenuItem value="oneYearDiploma">{t('education.oneYearDiploma')}</MenuItem>
            <MenuItem value="twoYearDiploma">{t('education.twoYearDiploma')}</MenuItem>
            <MenuItem value="bachelors">{t('education.bachelors')}</MenuItem>
            <MenuItem value="masters">{t('education.masters')}</MenuItem>
            <MenuItem value="phd">{t('education.phd')}</MenuItem>
          </Select>
        </FormControl>
        
        {/* Additional form fields would go here */}
        
        {error && <div className="error-message">{error}</div>}
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCalculateScore}
          disabled={isCalculating}
        >
          {isCalculating ? t('calculator.calculating') : t('calculator.calculateButton')}
        </Button>
        
        {score !== null && (
          <div className="score-result">
            <h3>{t('calculator.yourScore')}</h3>
            <div className="score-value">{score}</div>
            <p>{t('calculator.scoreExplanation')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsCalculator;
```

### Next.js Page Template (TypeScript)

```tsx
// pages/canada/express-entry.tsx

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Layout } from '@/components/layout';
import { PointsCalculator, EligibilityChecker, ProfileCreator } from '@/components/canada/express-entry';
import { CanadianFlag } from '@/components/canada/common';

export default function ExpressEntryPage() {
  const { t } = useTranslation(['common', 'express-entry']);
  
  return (
    <>
      <Head>
        <title>{t('express-entry:pageTitle')} | ThinkForward AI</title>
        <meta name="description" content={t('express-entry:pageDescription')} />
      </Head>
      
      <Layout>
        <div className="page-header">
          <CanadianFlag className="flag-icon" />
          <h1>{t('express-entry:pageTitle')}</h1>
        </div>
        
        <div className="page-intro">
          <p>{t('express-entry:pageIntro')}</p>
        </div>
        
        <div className="content-section">
          <h2>{t('express-entry:eligibilitySection')}</h2>
          <EligibilityChecker />
        </div>
        
        <div className="content-section">
          <h2>{t('express-entry:calculatorSection')}</h2>
          <PointsCalculator />
        </div>
        
        <div className="content-section">
          <h2>{t('express-entry:profileSection')}</h2>
          <ProfileCreator />
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'express-entry'])),
    },
  };
};
```

### Context Provider Template (TypeScript)

```tsx
// contexts/CanadianImmigrationContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { 
  ExpressEntryProfile, 
  PNPProgram, 
  CanadianProvince, 
  CLBLevel,
  CanadianCase 
} from '@/types/canada';

interface CanadianImmigrationContextType {
  calculateExpressEntryPoints: (profile: ExpressEntryProfile) => Promise<number>;
  checkPnpEligibility: (province: CanadianProvince, profile: Partial<ExpressEntryProfile>) => Promise<PNPProgram[]>;
  getDocumentChecklist: (programType: string, profile: Partial<ExpressEntryProfile>) => Promise<string[]>;
  getCases: () => Promise<CanadianCase[]>;
  // Additional methods
}

const CanadianImmigrationContext = createContext<CanadianImmigrationContextType | undefined>(undefined);

export const CanadianImmigrationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Implementation of context methods
  const calculateExpressEntryPoints = useCallback(async (profile: ExpressEntryProfile): Promise<number> => {
    try {
      const response = await fetch('/api/canada/express-entry/calculate-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate points');
      }
      
      const data = await response.json();
      return data.score;
    } catch (error) {
      console.error('Error calculating Express Entry points:', error);
      throw error;
    }
  }, []);
  
  const checkPnpEligibility = useCallback(async (
    province: CanadianProvince, 
    profile: Partial<ExpressEntryProfile>
  ): Promise<PNPProgram[]> => {
    try {
      const response = await fetch('/api/canada/pnp/eligibility-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ province, profile }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check PNP eligibility');
      }
      
      const data = await response.json();
      return data.eligiblePrograms;
    } catch (error) {
      console.error('Error checking PNP eligibility:', error);
      throw error;
    }
  }, []);
  
  const getDocumentChecklist = useCallback(async (
    programType: string, 
    profile: Partial<ExpressEntryProfile>
  ): Promise<string[]> => {
    try {
      const response = await fetch(`/api/canada/documents/checklist?program=${programType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get document checklist');
      }
      
      const data = await response.json();
      return data.documents;
    } catch (error) {
      console.error('Error getting document checklist:', error);
      throw error;
    }
  }, []);
  
  const getCases = useCallback(async (): Promise<CanadianCase[]> => {
    try {
      const response = await fetch('/api/canada/consultant/cases');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }
      
      const data = await response.json();
      return data.cases;
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  }, []);
  
  const value = {
    calculateExpressEntryPoints,
    checkPnpEligibility,
    getDocumentChecklist,
    getCases,
    // Additional methods would be included here
  };
  
  return (
    <CanadianImmigrationContext.Provider value={value}>
      {children}
    </CanadianImmigrationContext.Provider>
  );
};

export const useCanadianImmigration = () => {
  const context = useContext(CanadianImmigrationContext);
  if (context === undefined) {
    throw new Error('useCanadianImmigration must be used within a CanadianImmigrationProvider');
  }
  return context;
};
```

## Backend Templates

### Controller Template (JavaScript)

```javascript
// controllers/canada/expressEntryController.js

const expressEntryService = require('../../services/canada/expressEntryService');
const { validationResult } = require('express-validator');
const { translateError } = require('../../utils/errorHandler');

/**
 * Calculate Express Entry points based on profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.calculatePoints = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const profile = req.body;
    const score = await expressEntryService.calculatePoints(profile);
    
    return res.status(200).json({
      success: true,
      score,
      breakdown: expressEntryService.getPointsBreakdown(profile)
    });
  } catch (error) {
    console.error('Error calculating Express Entry points:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Check eligibility for Express Entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkEligibility = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const profile = req.body;
    const eligibility = await expressEntryService.checkEligibility(profile);
    
    return res.status(200).json({
      success: true,
      isEligible: eligibility.isEligible,
      programs: eligibility.eligiblePrograms,
      reasons: eligibility.reasons
    });
  } catch (error) {
    console.error('Error checking Express Entry eligibility:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Get current Express Entry draw information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLatestDraws = async (req, res) => {
  try {
    const draws = await expressEntryService.getLatestDraws();
    
    return res.status(200).json({
      success: true,
      draws
    });
  } catch (error) {
    console.error('Error fetching Express Entry draws:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Create or update Express Entry profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.saveProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const userId = req.user.id;
    const profileData = req.body;
    
    const profile = await expressEntryService.saveProfile(userId, profileData);
    
    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error saving Express Entry profile:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};
```

### Service Template (JavaScript)

```javascript
// services/canada/expressEntryService.js

const ExpressEntryProfile = require('../../models/canada/ExpressEntryProfile');
const { fetchLatestDraws } = require('../../utils/canadaApiClient');
const { calculateCoreHumanCapitalPoints, calculateSpousePoints, calculateAdditionalPoints } = require('../../utils/pointsCalculator');

/**
 * Calculate Comprehensive Ranking System (CRS) points for Express Entry
 * @param {Object} profile - Express Entry profile
 * @returns {Promise<number>} - Total CRS points
 */
exports.calculatePoints = async (profile) => {
  try {
    // Core/Human Capital points
    const corePoints = calculateCoreHumanCapitalPoints(profile);
    
    // Spouse factors (if applicable)
    const spousePoints = profile.maritalStatus === 'married' && profile.spouseProfile 
      ? calculateSpousePoints(profile.spouseProfile) 
      : 0;
    
    // Additional points (provincial nomination, job offer, etc.)
    const additionalPoints = calculateAdditionalPoints(profile);
    
    // Total CRS score
    const totalPoints = corePoints + spousePoints + additionalPoints;
    
    return Math.min(1200, totalPoints); // Maximum CRS score is 1200
  } catch (error) {
    console.error('Error calculating Express Entry points:', error);
    throw error;
  }
};

/**
 * Get detailed breakdown of points calculation
 * @param {Object} profile - Express Entry profile
 * @returns {Object} - Points breakdown by category
 */
exports.getPointsBreakdown = (profile) => {
  const breakdown = {
    coreHumanCapital: {
      age: calculateAgePoints(profile),
      education: calculateEducationPoints(profile),
      languageProficiency: calculateLanguagePoints(profile),
      canadianWorkExperience: calculateCanadianWorkExperiencePoints(profile),
      subtotal: 0
    },
    spouse: {
      education: 0,
      languageProficiency: 0,
      canadianWorkExperience: 0,
      subtotal: 0
    },
    skillTransferability: {
      education: calculateEducationTransferabilityPoints(profile),
      foreignWorkExperience: calculateForeignWorkExperiencePoints(profile),
      certificateOfQualification: calculateCertificatePoints(profile),
      subtotal: 0
    },
    additional: {
      provincialNomination: profile.hasProvincialNomination ? 600 : 0,
      jobOffer: calculateJobOfferPoints(profile),
      canadianEducation: calculateCanadianEducationPoints(profile),
      frenchLanguageSkills: calculateFrenchLanguagePoints(profile),
      sibling: profile.hasSiblingInCanada ? 15 : 0,
      subtotal: 0
    }
  };
  
  // Calculate subtotals
  breakdown.coreHumanCapital.subtotal = 
    breakdown.coreHumanCapital.age + 
    breakdown.coreHumanCapital.education + 
    breakdown.coreHumanCapital.languageProficiency + 
    breakdown.coreHumanCapital.canadianWorkExperience;
  
  if (profile.maritalStatus === 'married' && profile.spouseProfile) {
    breakdown.spouse.education = calculateSpouseEducationPoints(profile.spouseProfile);
    breakdown.spouse.languageProficiency = calculateSpouseLanguagePoints(profile.spouseProfile);
    breakdown.spouse.canadianWorkExperience = calculateSpouseWorkExperiencePoints(profile.spouseProfile);
    breakdown.spouse.subtotal = 
      breakdown.spouse.education + 
      breakdown.spouse.languageProficiency + 
      breakdown.spouse.canadianWorkExperience;
  }
  
  breakdown.skillTransferability.subtotal = 
    breakdown.skillTransferability.education + 
    breakdown.skillTransferability.foreignWorkExperience + 
    breakdown.skillTransferability.certificateOfQualification;
  
  breakdown.additional.subtotal = 
    breakdown.additional.provincialNomination + 
    breakdown.additional.jobOffer + 
    breakdown.additional.canadianEducation + 
    breakdown.additional.frenchLanguageSkills + 
    breakdown.additional.sibling;
  
  return breakdown;
};

/**
 * Check eligibility for Express Entry programs
 * @param {Object} profile - Express Entry profile
 * @returns {Promise<Object>} - Eligibility results
 */
exports.checkEligibility = async (profile) => {
  try {
    const eligibility = {
      isEligible: false,
      eligiblePrograms: [],
      reasons: []
    };
    
    // Check Federal Skilled Worker Program (FSWP) eligibility
    const fswpEligibility = checkFSWPEligibility(profile);
    if (fswpEligibility.isEligible) {
      eligibility.eligiblePrograms.push('FSWP');
    } else {
      eligibility.reasons.push(...fswpEligibility.reasons);
    }
    
    // Check Canadian Experience Class (CEC) eligibility
    const cecEligibility = checkCECEligibility(profile);
    if (cecEligibility.isEligible) {
      eligibility.eligiblePrograms.push('CEC');
    } else {
      eligibility.reasons.push(...cecEligibility.reasons);
    }
    
    // Check Federal Skilled Trades Program (FSTP) eligibility
    const fstpEligibility = checkFSTPEligibility(profile);
    if (fstpEligibility.isEligible) {
      eligibility.eligiblePrograms.push('FSTP');
    } else {
      eligibility.reasons.push(...fstpEligibility.reasons);
    }
    
    // Overall eligibility
    eligibility.isEligible = eligibility.eligiblePrograms.length > 0;
    
    return eligibility;
  } catch (error) {
    console.error('Error checking Express Entry eligibility:', error);
    throw error;
  }
};

/**
 * Get latest Express Entry draw information
 * @returns {Promise<Array>} - Latest Express Entry draws
 */
exports.getLatestDraws = async () => {
  try {
    const draws = await fetchLatestDraws();
    return draws;
  } catch (error) {
    console.error('Error fetching Express Entry draws:', error);
    throw error;
  }
};

/**
 * Save or update Express Entry profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to save
 * @returns {Promise<Object>} - Saved profile
 */
exports.saveProfile = async (userId, profileData) => {
  try {
    let profile = await ExpressEntryProfile.findOne({ userId });
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
    } else {
      // Create new profile
      profile = new ExpressEntryProfile({
        userId,
        ...profileData
      });
    }
    
    await profile.save();
    return profile;
  } catch (error) {
    console.error('Error saving Express Entry profile:', error);
    throw error;
  }
};

// Helper functions for points calculations
function calculateAgePoints(profile) {
  const age = profile.age;
  
  if (profile.maritalStatus === 'single' || !profile.spouseProfile) {
    // Single applicants
    if (age <= 17) return 0;
    if (age === 18) return 99;
    if (age === 19) return 105;
    if (age >= 20 && age <= 29) return 110;
    if (age === 30) return 105;
    if (age === 31) return 99;
    if (age === 32) return 94;
    if (age === 33) return 88;
    if (age === 34) return 83;
    if (age === 35) return 77;
    if (age === 36) return 72;
    if (age === 37) return 66;
    if (age === 38) return 61;
    if (age === 39) return 55;
    if (age === 40) return 50;
    if (age === 41) return 39;
    if (age === 42) return 28;
    if (age === 43) return 17;
    if (age === 44) return 6;
    if (age >= 45) return 0;
  } else {
    // Married applicants
    if (age <= 17) return 0;
    if (age === 18) return 90;
    if (age === 19) return 95;
    if (age >= 20 && age <= 29) return 100;
    if (age === 30) return 95;
    if (age === 31) return 90;
    if (age === 32) return 85;
    if (age === 33) return 80;
    if (age === 34) return 75;
    if (age === 35) return 70;
    if (age === 36) return 65;
    if (age === 37) return 60;
    if (age === 38) return 55;
    if (age === 39) return 50;
    if (age === 40) return 45;
    if (age === 41) return 35;
    if (age === 42) return 25;
    if (age === 43) return 15;
    if (age === 44) return 5;
    if (age >= 45) return 0;
  }
}

// Additional helper functions would be implemented here
```

### Model Template (JavaScript)

```javascript
// models/canada/ExpressEntryProfile.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageProficiencySchema = new Schema({
  language: {
    type: String,
    enum: ['english', 'french'],
    required: true
  },
  test: {
    type: String,
    enum: ['IELTS', 'CELPIP', 'TEF', 'TCF'],
    required: true
  },
  speaking: {
    type: Number,
    required: true
  },
  listening: {
    type: Number,
    required: true
  },
  reading: {
    type: Number,
    required: true
  },
  writing: {
    type: Number,
    required: true
  },
  clbEquivalent: {
    speaking: Number,
    listening: Number,
    reading: Number,
    writing: Number
  }
});

const EducationSchema = new Schema({
  level: {
    type: String,
    enum: [
      'highSchool',
      'oneYearDiploma',
      'twoYearDiploma',
      'bachelors',
      'twoOrMoreDegrees',
      'masters',
      'phd'
    ],
    required: true
  },
  field: String,
  institution: String,
  country: String,
  completionDate: Date,
  canadianEquivalency: {
    hasECA: {
      type: Boolean,
      default: false
    },
    ecaAuthority: String,
    ecaDate: Date,
    ecaReport: String
  }
});

const WorkExperienceSchema = new Schema({
  occupation: {
    noc: String,
    title: String
  },
  employer: String,
  country: String,
  isCanadianExperience: {
    type: Boolean,
    default: false
  },
  startDate: Date,
  endDate: Date,
  hoursPerWeek: Number,
  duties: [String]
});

const SpouseProfileSchema = new Schema({
  languageProficiency: [LanguageProficiencySchema],
  education: EducationSchema,
  canadianWorkExperience: [WorkExperienceSchema]
});

const ExpressEntryProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profileId: {
    type: String,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'commonLaw', 'divorced', 'separated', 'widowed'],
    required: true
  },
  spouseProfile: SpouseProfileSchema,
  languageProficiency: [LanguageProficiencySchema],
  education: [EducationSchema],
  workExperience: [WorkExperienceSchema],
  adaptabilityFactors: {
    relativesInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      relationship: String
    },
    spouseEducationInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      details: String
    },
    previousWorkInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      duration: Number
    },
    previousStudyInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      program: String,
      institution: String
    }
  },
  hasProvincialNomination: {
    type: Boolean,
    default: false
  },
  provincialNominationDetails: {
    province: String,
    program: String,
    nominationDate: Date,
    certificateNumber: String
  },
  hasJobOffer: {
    type: Boolean,
    default: false
  },
  jobOfferDetails: {
    employer: String,
    position: String,
    noc: String,
    lmiaExempt: Boolean,
    lmiaNumber: String
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'invited', 'applied', 'approved', 'rejected'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Generate a unique profile ID before saving
ExpressEntryProfileSchema.pre('save', async function(next) {
  if (!this.profileId) {
    const currentYear = new Date().getFullYear().toString().substr(-2);
    const randomPart = Math.floor(1000000 + Math.random() * 9000000);
    this.profileId = `EE-${currentYear}-${randomPart}`;
  }
  next();
});

// Calculate CLB equivalents for language scores
ExpressEntryProfileSchema.pre('save', function(next) {
  if (this.languageProficiency) {
    this.languageProficiency.forEach(lang => {
      if (!lang.clbEquivalent) {
        lang.clbEquivalent = {};
      }
      
      if (lang.test === 'IELTS') {
        lang.clbEquivalent.speaking = calculateCLBForIELTS('speaking', lang.speaking);
        lang.clbEquivalent.listening = calculateCLBForIELTS('listening', lang.listening);
        lang.clbEquivalent.reading = calculateCLBForIELTS('reading', lang.reading);
        lang.clbEquivalent.writing = calculateCLBForIELTS('writing', lang.writing);
      } else if (lang.test === 'CELPIP') {
        lang.clbEquivalent.speaking = lang.speaking;
        lang.clbEquivalent.listening = lang.listening;
        lang.clbEquivalent.reading = lang.reading;
        lang.clbEquivalent.writing = lang.writing;
      }
      // Add other test conversions as needed
    });
  }
  next();
});

// Helper function to calculate CLB from IELTS scores
function calculateCLBForIELTS(skill, score) {
  if (skill === 'speaking' || skill === 'writing') {
    if (score >= 7.5) return 10;
    if (score >= 7.0) return 9;
    if (score >= 6.5) return 8;
    if (score >= 6.0) return 7;
    if (score >= 5.5) return 6;
    if (score >= 5.0) return 5;
    if (score >= 4.0) return 4;
    return 0;
  } else if (skill === 'reading' || skill === 'listening') {
    if (score >= 8.0) return 10;
    if (score >= 7.5) return 9;
    if (score >= 6.5) return 8;
    if (score >= 6.0) return 7;
    if (score >= 5.0) return 6;
    if (score >= 4.0) return 5;
    if (score >= 3.5) return 4;
    return 0;
  }
  return 0;
}

module.exports = mongoose.model('ExpressEntryProfile', ExpressEntryProfileSchema);
```

### Route Template (JavaScript)

```javascript
// routes/canada/expressEntryRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const expressEntryController = require('../../controllers/canada/expressEntryController');
const authMiddleware = require('../../middleware/authMiddleware');
const localeMiddleware = require('../../middleware/localeMiddleware');

// Apply locale middleware to all routes
router.use(localeMiddleware);

/**
 * @route POST /api/canada/express-entry/calculate-score
 * @desc Calculate Express Entry points
 * @access Public
 */
router.post(
  '/calculate-score',
  [
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    body('educationLevel').isString().notEmpty().withMessage('Education level is required'),
    body('languageProficiency').isObject().notEmpty().withMessage('Language proficiency is required'),
    // Additional validations
  ],
  expressEntryController.calculatePoints
);

/**
 * @route POST /api/canada/express-entry/check-eligibility
 * @desc Check eligibility for Express Entry
 * @access Public
 */
router.post(
  '/check-eligibility',
  [
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    body('educationLevel').isString().notEmpty().withMessage('Education level is required'),
    body('languageProficiency').isObject().notEmpty().withMessage('Language proficiency is required'),
    // Additional validations
  ],
  expressEntryController.checkEligibility
);

/**
 * @route GET /api/canada/express-entry/latest-draws
 * @desc Get latest Express Entry draws
 * @access Public
 */
router.get('/latest-draws', expressEntryController.getLatestDraws);

/**
 * @route POST /api/canada/express-entry/profile
 * @desc Create or update Express Entry profile
 * @access Private
 */
router.post(
  '/profile',
  authMiddleware,
  [
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    body('maritalStatus').isString().notEmpty().withMessage('Marital status is required'),
    body('languageProficiency').isArray().notEmpty().withMessage('Language proficiency is required'),
    body('education').isArray().notEmpty().withMessage('Education is required'),
    // Additional validations
  ],
  expressEntryController.saveProfile
);

/**
 * @route GET /api/canada/express-entry/profile
 * @desc Get user's Express Entry profile
 * @access Private
 */
router.get('/profile', authMiddleware, expressEntryController.getProfile);

module.exports = router;
```

## TypeScript Type Definitions

```typescript
// types/canada.ts

export type CanadianProvince = 
  | 'AB' // Alberta
  | 'BC' // British Columbia
  | 'MB' // Manitoba
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'NS' // Nova Scotia
  | 'NT' // Northwest Territories
  | 'NU' // Nunavut
  | 'ON' // Ontario
  | 'PE' // Prince Edward Island
  | 'QC' // Quebec
  | 'SK' // Saskatchewan
  | 'YT'; // Yukon

export type EducationLevel = 
  | 'highSchool'
  | 'oneYearDiploma'
  | 'twoYearDiploma'
  | 'bachelors'
  | 'twoOrMoreDegrees'
  | 'masters'
  | 'phd';

export type CLBLevel = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type LanguageTest = 'IELTS' | 'CELPIP' | 'TEF' | 'TCF';

export type MaritalStatus = 'single' | 'married' | 'commonLaw' | 'divorced' | 'separated' | 'widowed';

export type ApplicationStage = 'draft' | 'submitted' | 'invited' | 'applied' | 'approved' | 'rejected';

export type DocumentType = 
  | 'passport'
  | 'educationCredential'
  | 'languageTest'
  | 'employmentReference'
  | 'policeCheck'
  | 'medicalExam'
  | 'birthCertificate'
  | 'marriageCertificate'
  | 'proofOfFunds'
  | 'photoID';

export type ValidationStatus = 'pending' | 'valid' | 'invalid' | 'needsReview';

export type CanadianImmigrationProgram = 
  | 'expressEntry'
  | 'pnp'
  | 'familySponsorship'
  | 'businessImmigration'
  | 'refugeeAsylum'
  | 'temporaryResidence';

export interface LanguageProficiency {
  language: 'english' | 'french';
  test: LanguageTest;
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  clbEquivalent?: {
    speaking: CLBLevel;
    listening: CLBLevel;
    reading: CLBLevel;
    writing: CLBLevel;
  };
}

export interface Education {
  level: EducationLevel;
  field?: string;
  institution?: string;
  country?: string;
  completionDate?: Date;
  canadianEquivalency?: {
    hasECA: boolean;
    ecaAuthority?: string;
    ecaDate?: Date;
    ecaReport?: string;
  };
}

export interface WorkExperience {
  occupation: {
    noc?: string;
    title: string;
  };
  employer: string;
  country: string;
  isCanadianExperience: boolean;
  startDate: Date;
  endDate?: Date;
  hoursPerWeek: number;
  duties?: string[];
}

export interface AdaptabilityFactors {
  relativesInCanada?: {
    has: boolean;
    relationship?: string;
  };
  spouseEducationInCanada?: {
    has: boolean;
    details?: string;
  };
  previousWorkInCanada?: {
    has: boolean;
    duration?: number;
  };
  previousStudyInCanada?: {
    has: boolean;
    program?: string;
    institution?: string;
  };
}

export interface SpouseProfile {
  languageProficiency?: LanguageProficiency[];
  education?: Education;
  canadianWorkExperience?: WorkExperience[];
}

export interface ExpressEntryProfile {
  userId?: string;
  profileId?: string;
  age: number;
  maritalStatus: MaritalStatus;
  spouseProfile?: SpouseProfile;
  languageProficiency: LanguageProficiency[];
  education: Education[];
  workExperience: WorkExperience[];
  adaptabilityFactors?: AdaptabilityFactors;
  hasProvincialNomination: boolean;
  provincialNominationDetails?: {
    province: CanadianProvince;
    program: string;
    nominationDate: Date;
    certificateNumber: string;
  };
  hasJobOffer: boolean;
  jobOfferDetails?: {
    employer: string;
    position: string;
    noc: string;
    lmiaExempt: boolean;
    lmiaNumber?: string;
  };
  status?: ApplicationStage;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PNPProgram {
  province: CanadianProvince;
  streamName: string;
  eligibilityCriteria: string[];
  processingTime: number; // in days
  applicationFee: number;
  requiredDocuments: string[];
  steps: string[];
}

export interface DocumentRequirement {
  immigrationProgram: CanadianImmigrationProgram;
  documentType: DocumentType;
  isRequired: boolean;
  alternativeDocuments?: DocumentType[];
  validationRules: string[];
  translationRequired: boolean;
  notarizationRequired: boolean;
}

export interface DocumentSubmission {
  userId: string;
  applicationId: string;
  documentType: DocumentType;
  fileUrl: string;
  uploadDate: Date;
  validationStatus: ValidationStatus;
  reviewNotes?: string;
  translationFileUrl?: string;
}

export interface TimelineEvent {
  date: Date;
  stage: ApplicationStage;
  description: string;
  actor: string;
}

export interface CaseNote {
  date: Date;
  author: string;
  content: string;
  isPrivate: boolean;
}

export interface FeeStructure {
  governmentFees: {
    applicationFee: number;
    rightOfPermanentResidenceFee?: number;
    biometricsFee?: number;
    otherFees: {name: string, amount: number}[];
  };
  consultantFees: {
    baseFee: number;
    optionalServices: {name: string, amount: number}[];
    paymentSchedule: {date: Date, amount: number, description: string}[];
  };
  totalPaid: number;
  totalDue: number;
}

export interface ActionItem {
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  status: 'pending' | 'inProgress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CanadianCase {
  caseId: string;
  clientId: string;
  consultantId: string;
  immigrationProgram: CanadianImmigrationProgram;
  currentStage: ApplicationStage;
  timeline: TimelineEvent[];
  documents: DocumentSubmission[];
  notes: CaseNote[];
  fees: FeeStructure;
  nextSteps: ActionItem[];
}
```

## Localization Files

### English Localization (JSON)

```json
// public/locales/en/canada.json
{
  "pageTitle": "Canadian Immigration",
  "pageDescription": "Explore Canadian immigration pathways and find the best option for you",
  "welcomeMessage": "Welcome to ThinkForward AI's Canadian Immigration Portal",
  "introText": "Canada offers various immigration pathways for skilled workers, families, entrepreneurs, and more. Our AI-powered platform helps you navigate the complex Canadian immigration system with ease.",
  "pathways": {
    "title": "Immigration Pathways",
    "expressEntry": {
      "title": "Express Entry",
      "description": "A system that manages applications for permanent residence under three federal economic immigration programs."
    },
    "pnp": {
      "title": "Provincial Nominee Programs",
      "description": "Programs that allow Canadian provinces and territories to nominate individuals for immigration based on local needs."
    },
    "familySponsorship": {
      "title": "Family Sponsorship",
      "description": "Programs that allow Canadian citizens and permanent residents to sponsor eligible family members."
    },
    "businessImmigration": {
      "title": "Business Immigration",
      "description": "Programs for entrepreneurs, investors, and self-employed individuals who want to establish businesses in Canada."
    },
    "temporaryResidence": {
      "title": "Temporary Residence",
      "description": "Options for work permits, study permits, and visitor visas for those seeking temporary stay in Canada."
    }
  },
  "provinces": {
    "title": "Canadian Provinces and Territories",
    "ab": "Alberta",
    "bc": "British Columbia",
    "mb": "Manitoba",
    "nb": "New Brunswick",
    "nl": "Newfoundland and Labrador",
    "ns": "Nova Scotia",
    "nt": "Northwest Territories",
    "nu": "Nunavut",
    "on": "Ontario",
    "pe": "Prince Edward Island",
    "qc": "Quebec",
    "sk": "Saskatchewan",
    "yt": "Yukon"
  },
  "consultantDashboard": {
    "title": "Consultant Dashboard",
    "caseManagement": "Case Management",
    "clientProgress": "Client Progress",
    "feeCalculator": "Fee Calculator",
    "regulatoryCompliance": "Regulatory Compliance",
    "immigrationUpdates": "Immigration Updates"
  },
  "common": {
    "learnMore": "Learn More",
    "getStarted": "Get Started",
    "checkEligibility": "Check Eligibility",
    "calculatePoints": "Calculate Points",
    "createProfile": "Create Profile",
    "viewDetails": "View Details",
    "back": "Back",
    "next": "Next",
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  }
}
```

### French Localization (JSON)

```json
// public/locales/fr/canada.json
{
  "pageTitle": "Immigration Canadienne",
  "pageDescription": "Explorez les voies d'immigration canadiennes et trouvez la meilleure option pour vous",
  "welcomeMessage": "Bienvenue sur le portail d'immigration canadienne de ThinkForward AI",
  "introText": "Le Canada offre diverses voies d'immigration pour les travailleurs qualifiés, les familles, les entrepreneurs et plus encore. Notre plateforme alimentée par l'IA vous aide à naviguer facilement dans le système d'immigration canadien complexe.",
  "pathways": {
    "title": "Voies d'Immigration",
    "expressEntry": {
      "title": "Entrée Express",
      "description": "Un système qui gère les demandes de résidence permanente dans le cadre de trois programmes fédéraux d'immigration économique."
    },
    "pnp": {
      "title": "Programmes des Candidats des Provinces",
      "description": "Programmes qui permettent aux provinces et territoires canadiens de désigner des individus pour l'immigration en fonction des besoins locaux."
    },
    "familySponsorship": {
      "title": "Parrainage Familial",
      "description": "Programmes qui permettent aux citoyens canadiens et aux résidents permanents de parrainer des membres de leur famille admissibles."
    },
    "businessImmigration": {
      "title": "Immigration d'Affaires",
      "description": "Programmes pour les entrepreneurs, les investisseurs et les travailleurs autonomes qui souhaitent établir des entreprises au Canada."
    },
    "temporaryResidence": {
      "title": "Résidence Temporaire",
      "description": "Options pour les permis de travail, les permis d'études et les visas de visiteur pour ceux qui cherchent un séjour temporaire au Canada."
    }
  },
  "provinces": {
    "title": "Provinces et Territoires Canadiens",
    "ab": "Alberta",
    "bc": "Colombie-Britannique",
    "mb": "Manitoba",
    "nb": "Nouveau-Brunswick",
    "nl": "Terre-Neuve-et-Labrador",
    "ns": "Nouvelle-Écosse",
    "nt": "Territoires du Nord-Ouest",
    "nu": "Nunavut",
    "on": "Ontario",
    "pe": "Île-du-Prince-Édouard",
    "qc": "Québec",
    "sk": "Saskatchewan",
    "yt": "Yukon"
  },
  "consultantDashboard": {
    "title": "Tableau de Bord du Consultant",
    "caseManagement": "Gestion des Dossiers",
    "clientProgress": "Progrès des Clients",
    "feeCalculator": "Calculateur de Frais",
    "regulatoryCompliance": "Conformité Réglementaire",
    "immigrationUpdates": "Mises à Jour d'Immigration"
  },
  "common": {
    "learnMore": "En Savoir Plus",
    "getStarted": "Commencer",
    "checkEligibility": "Vérifier l'Admissibilité",
    "calculatePoints": "Calculer les Points",
    "createProfile": "Créer un Profil",
    "viewDetails": "Voir les Détails",
    "back": "Retour",
    "next": "Suivant",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "submit": "Soumettre",
    "loading": "Chargement...",
    "error": "Erreur",
    "success": "Succès"
  }
}
```

This directory structure and code templates provide a comprehensive foundation for implementing the Canadian market focus in the ThinkForward AI application. The structure follows modern best practices for both frontend and backend development, with a focus on maintainability, scalability, and bilingual support for the Canadian market.
