# ThinkForward AI - Core Implementation for Canadian Market

Based on the comprehensive analysis and design work, I'll now implement the core functionality for the Canadian market focus. This implementation will include:

1. Frontend components for Express Entry calculator
2. Backend API for Express Entry points calculation
3. Canadian localization enhancements
4. Canadian consultant dashboard components

Let's start with the implementation:

## 1. Frontend Implementation

### Canadian Immigration Context Provider

```tsx
// frontend/contexts/CanadianImmigrationContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { 
  ExpressEntryProfile, 
  PNPProgram, 
  CanadianProvince, 
  CLBLevel,
  CanadianCase 
} from '../types/canada';

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

### Express Entry Points Calculator Component

```tsx
// frontend/components/canada/express-entry/PointsCalculator.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '../../../components/ui';
import type { ExpressEntryProfile } from '../../../types/canada';

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
        
        {/* Language Proficiency Section */}
        <h3>{t('calculator.languageProficiency')}</h3>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.languageTest')}</InputLabel>
          <Select
            value={profile.languageProficiency?.[0]?.test || ''}
            onChange={(e) => handleInputChange('languageProficiency', [{
              ...profile.languageProficiency?.[0] || {},
              language: 'english',
              test: e.target.value,
            }])}
            label={t('calculator.languageTest')}
          >
            <MenuItem value="IELTS">{t('language.ielts')}</MenuItem>
            <MenuItem value="CELPIP">{t('language.celpip')}</MenuItem>
          </Select>
        </FormControl>
        
        {profile.languageProficiency?.[0]?.test && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('calculator.speaking')}</InputLabel>
              <TextField
                type="number"
                step="0.5"
                value={profile.languageProficiency[0].speaking || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const updatedProficiency = [...(profile.languageProficiency || [])];
                  if (!updatedProficiency[0]) {
                    updatedProficiency[0] = { language: 'english', test: profile.languageProficiency?.[0]?.test || 'IELTS' };
                  }
                  updatedProficiency[0].speaking = value;
                  handleInputChange('languageProficiency', updatedProficiency);
                }}
                label={t('calculator.speaking')}
              />
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('calculator.listening')}</InputLabel>
              <TextField
                type="number"
                step="0.5"
                value={profile.languageProficiency[0].listening || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const updatedProficiency = [...(profile.languageProficiency || [])];
                  if (!updatedProficiency[0]) {
                    updatedProficiency[0] = { language: 'english', test: profile.languageProficiency?.[0]?.test || 'IELTS' };
                  }
                  updatedProficiency[0].listening = value;
                  handleInputChange('languageProficiency', updatedProficiency);
                }}
                label={t('calculator.listening')}
              />
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('calculator.reading')}</InputLabel>
              <TextField
                type="number"
                step="0.5"
                value={profile.languageProficiency[0].reading || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const updatedProficiency = [...(profile.languageProficiency || [])];
                  if (!updatedProficiency[0]) {
                    updatedProficiency[0] = { language: 'english', test: profile.languageProficiency?.[0]?.test || 'IELTS' };
                  }
                  updatedProficiency[0].reading = value;
                  handleInputChange('languageProficiency', updatedProficiency);
                }}
                label={t('calculator.reading')}
              />
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('calculator.writing')}</InputLabel>
              <TextField
                type="number"
                step="0.5"
                value={profile.languageProficiency[0].writing || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const updatedProficiency = [...(profile.languageProficiency || [])];
                  if (!updatedProficiency[0]) {
                    updatedProficiency[0] = { language: 'english', test: profile.languageProficiency?.[0]?.test || 'IELTS' };
                  }
                  updatedProficiency[0].writing = value;
                  handleInputChange('languageProficiency', updatedProficiency);
                }}
                label={t('calculator.writing')}
              />
            </FormControl>
          </>
        )}
        
        {/* Work Experience Section */}
        <h3>{t('calculator.workExperience')}</h3>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.canadianWorkExperience')}</InputLabel>
          <Select
            value={profile.workExperience?.filter(exp => exp.isCanadianExperience).length || 0}
            onChange={(e) => {
              const years = parseInt(e.target.value as string, 10);
              const canadianExperience = Array(years).fill(0).map((_, i) => ({
                occupation: { title: `Canadian Experience ${i + 1}` },
                employer: '',
                country: 'Canada',
                isCanadianExperience: true,
                startDate: new Date(),
                hoursPerWeek: 40
              }));
              
              const foreignExperience = profile.workExperience?.filter(exp => !exp.isCanadianExperience) || [];
              
              handleInputChange('workExperience', [...canadianExperience, ...foreignExperience]);
            }}
            label={t('calculator.canadianWorkExperience')}
          >
            <MenuItem value="0">{t('workExperience.none')}</MenuItem>
            <MenuItem value="1">{t('workExperience.oneYear')}</MenuItem>
            <MenuItem value="2">{t('workExperience.twoYears')}</MenuItem>
            <MenuItem value="3">{t('workExperience.threeYears')}</MenuItem>
            <MenuItem value="4">{t('workExperience.fourYears')}</MenuItem>
            <MenuItem value="5">{t('workExperience.fiveYears')}</MenuItem>
            <MenuItem value="6">{t('workExperience.sixPlusYears')}</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.foreignWorkExperience')}</InputLabel>
          <Select
            value={profile.workExperience?.filter(exp => !exp.isCanadianExperience).length || 0}
            onChange={(e) => {
              const years = parseInt(e.target.value as string, 10);
              const foreignExperience = Array(years).fill(0).map((_, i) => ({
                occupation: { title: `Foreign Experience ${i + 1}` },
                employer: '',
                country: '',
                isCanadianExperience: false,
                startDate: new Date(),
                hoursPerWeek: 40
              }));
              
              const canadianExperience = profile.workExperience?.filter(exp => exp.isCanadianExperience) || [];
              
              handleInputChange('workExperience', [...canadianExperience, ...foreignExperience]);
            }}
            label={t('calculator.foreignWorkExperience')}
          >
            <MenuItem value="0">{t('workExperience.none')}</MenuItem>
            <MenuItem value="1">{t('workExperience.oneYear')}</MenuItem>
            <MenuItem value="2">{t('workExperience.twoYears')}</MenuItem>
            <MenuItem value="3">{t('workExperience.threeYears')}</MenuItem>
          </Select>
        </FormControl>
        
        {/* Additional Factors Section */}
        <h3>{t('calculator.additionalFactors')}</h3>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.maritalStatus')}</InputLabel>
          <Select
            value={profile.maritalStatus || 'single'}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            label={t('calculator.maritalStatus')}
          >
            <MenuItem value="single">{t('maritalStatus.single')}</MenuItem>
            <MenuItem value="married">{t('maritalStatus.married')}</MenuItem>
            <MenuItem value="commonLaw">{t('maritalStatus.commonLaw')}</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.provincialNomination')}</InputLabel>
          <Select
            value={profile.hasProvincialNomination ? 'yes' : 'no'}
            onChange={(e) => handleInputChange('hasProvincialNomination', e.target.value === 'yes')}
            label={t('calculator.provincialNomination')}
          >
            <MenuItem value="no">{t('common.no')}</MenuItem>
            <MenuItem value="yes">{t('common.yes')}</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('calculator.jobOffer')}</InputLabel>
          <Select
            value={profile.hasJobOffer ? 'yes' : 'no'}
            onChange={(e) => handleInputChange('hasJobOffer', e.target.value === 'yes')}
            label={t('calculator.jobOffer')}
          >
            <MenuItem value="no">{t('common.no')}</MenuItem>
            <MenuItem value="yes">{t('common.yes')}</MenuItem>
          </Select>
        </FormControl>
        
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

### Canadian Express Entry Page

```tsx
// frontend/pages/canada/express-entry.tsx

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Layout } from '../../components/layout';
import { PointsCalculator } from '../../components/canada/express-entry';
import { CanadianImmigrationProvider } from '../../contexts/CanadianImmigrationContext';

export default function ExpressEntryPage() {
  const { t } = useTranslation(['common', 'express-entry']);
  
  return (
    <>
      <Head>
        <title>{t('express-entry:pageTitle')} | ThinkForward AI</title>
        <meta name="description" content={t('express-entry:pageDescription')} />
      </Head>
      
      <Layout>
        <CanadianImmigrationProvider>
          <div className="page-header">
            <img 
              src="/images/canada/flags/canada-flag.svg" 
              alt="Canadian Flag" 
              className="flag-icon" 
            />
            <h1>{t('express-entry:pageTitle')}</h1>
          </div>
          
          <div className="page-intro">
            <p>{t('express-entry:pageIntro')}</p>
          </div>
          
          <div className="content-section">
            <h2>{t('express-entry:calculatorSection')}</h2>
            <PointsCalculator />
          </div>
        </CanadianImmigrationProvider>
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

### Canadian Consultant Dashboard Component

```tsx
// frontend/components/canada/consultant/CanadianCaseManager.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  CircularProgress
} from '../../../components/ui';
import type { CanadianCase } from '../../../types/canada';

interface CanadianCaseManagerProps {
  onCaseSelect?: (caseId: string) => void;
}

export const CanadianCaseManager: React.FC<CanadianCaseManagerProps> = ({ 
  onCaseSelect 
}) => {
  const { t } = useTranslation(['common', 'consultant']);
  const { getCases } = useCanadianImmigration();
  const [cases, setCases] = useState<CanadianCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const caseData = await getCases();
        setCases(caseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [getCases]);

  const handleCaseClick = (caseId: string) => {
    if (onCaseSelect) {
      onCaseSelect(caseId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500';
      case 'submitted':
        return 'text-blue-500';
      case 'invited':
        return 'text-purple-500';
      case 'applied':
        return 'text-orange-500';
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
        <span className="ml-2">{t('common:loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{t('common:errors.loadingFailed')}</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="canadian-case-manager">
      <h2>{t('consultant:caseManager.title')}</h2>
      
      {cases.length === 0 ? (
        <div className="empty-state p-8 text-center">
          <p>{t('consultant:caseManager.noCases')}</p>
          <Button 
            variant="contained" 
            color="primary"
            className="mt-4"
          >
            {t('consultant:caseManager.createCase')}
          </Button>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('consultant:caseManager.caseId')}</TableCell>
                <TableCell>{t('consultant:caseManager.client')}</TableCell>
                <TableCell>{t('consultant:caseManager.program')}</TableCell>
                <TableCell>{t('consultant:caseManager.status')}</TableCell>
                <TableCell>{t('consultant:caseManager.lastUpdated')}</TableCell>
                <TableCell>{t('common:actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.caseId}>
                  <TableCell>{caseItem.caseId}</TableCell>
                  <TableCell>{caseItem.clientId}</TableCell>
                  <TableCell>
                    {t(`consultant:programs.${caseItem.immigrationProgram}`)}
                  </TableCell>
                  <TableCell>
                    <span className={getStatusColor(caseItem.currentStage)}>
                      {t(`consultant:status.${caseItem.currentStage}`)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(caseItem.timeline[caseItem.timeline.length - 1].date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCaseClick(caseItem.caseId)}
                    >
                      {t('common:view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CanadianCaseManager;
```

### Bilingual Toggle Component

```tsx
// frontend/components/canada/common/BilingualToggle.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button, ButtonGroup } from '../../../components/ui';

interface BilingualToggleProps {
  className?: string;
}

export const BilingualToggle: React.FC<BilingualToggleProps> = ({ 
  className = '' 
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { pathname, asPath, query } = router;
  
  const switchLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };
  
  return (
    <div className={`bilingual-toggle ${className}`}>
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => switchLanguage('en')}
          variant={router.locale === 'en' ? 'contained' : 'outlined'}
        >
          English
        </Button>
        <Button
          onClick={() => switchLanguage('fr')}
          variant={router.locale === 'fr' ? 'contained' : 'outlined'}
        >
          Français
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default BilingualToggle;
```

## 2. Backend Implementation

### Express Entry Controller

```javascript
// backend/controllers/canada/expressEntryController.js

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

### Express Entry Service

```javascript
// backend/services/canada/expressEntryService.js

const ExpressEntryProfile = require('../../models/canada/ExpressEntryProfile');
const { fetchLatestDraws } = require('../../utils/canadaApiClient');

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

function calculateEducationPoints(profile) {
  // Get highest education level
  const educationLevels = {
    'highSchool': 0,
    'oneYearDiploma': 1,
    'twoYearDiploma': 2,
    'bachelors': 3,
    'twoOrMoreDegrees': 4,
    'masters': 5,
    'phd': 6
  };
  
  let highestEducation = -1;
  
  if (profile.education && profile.education.length > 0) {
    profile.education.forEach(edu => {
      const level = educationLevels[edu.level] || 0;
      if (level > highestEducation) {
        highestEducation = level;
      }
    });
  }
  
  if (profile.maritalStatus === 'single' || !profile.spouseProfile) {
    // Single applicants
    switch (highestEducation) {
      case 0: return 30; // High school
      case 1: return 90; // One-year diploma
      case 2: return 98; // Two-year diploma
      case 3: return 120; // Bachelor's degree
      case 4: return 128; // Two or more degrees, one being 3+ years
      case 5: return 135; // Master's degree
      case 6: return 150; // PhD
      default: return 0;
    }
  } else {
    // Married applicants
    switch (highestEducation) {
      case 0: return 28; // High school
      case 1: return 84; // One-year diploma
      case 2: return 91; // Two-year diploma
      case 3: return 112; // Bachelor's degree
      case 4: return 119; // Two or more degrees, one being 3+ years
      case 5: return 126; // Master's degree
      case 6: return 140; // PhD
      default: return 0;
    }
  }
}

function calculateLanguagePoints(profile) {
  if (!profile.languageProficiency || profile.languageProficiency.length === 0) {
    return 0;
  }
  
  // Find English and French proficiency
  const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
  const frenchProficiency = profile.languageProficiency.find(lang => lang.language === 'french');
  
  let points = 0;
  
  // Calculate points for first official language (usually English)
  if (englishProficiency) {
    const clb = englishProficiency.clbEquivalent || {
      speaking: 0,
      listening: 0,
      reading: 0,
      writing: 0
    };
    
    // Get minimum CLB score
    const minClb = Math.min(clb.speaking, clb.listening, clb.reading, clb.writing);
    
    if (profile.maritalStatus === 'single' || !profile.spouseProfile) {
      // Single applicants
      if (minClb < 4) points += 0;
      else if (minClb === 4) points += 6;
      else if (minClb === 5) points += 6;
      else if (minClb === 6) points += 9;
      else if (minClb === 7) points += 17;
      else if (minClb === 8) points += 23;
      else if (minClb === 9) points += 31;
      else if (minClb >= 10) points += 34;
      
      // Per ability points
      points += getLanguageAbilityPoints(clb.speaking, 'single');
      points += getLanguageAbilityPoints(clb.listening, 'single');
      points += getLanguageAbilityPoints(clb.reading, 'single');
      points += getLanguageAbilityPoints(clb.writing, 'single');
    } else {
      // Married applicants
      if (minClb < 4) points += 0;
      else if (minClb === 4) points += 6;
      else if (minClb === 5) points += 6;
      else if (minClb === 6) points += 8;
      else if (minClb === 7) points += 16;
      else if (minClb === 8) points += 22;
      else if (minClb === 9) points += 29;
      else if (minClb >= 10) points += 32;
      
      // Per ability points
      points += getLanguageAbilityPoints(clb.speaking, 'married');
      points += getLanguageAbilityPoints(clb.listening, 'married');
      points += getLanguageAbilityPoints(clb.reading, 'married');
      points += getLanguageAbilityPoints(clb.writing, 'married');
    }
  }
  
  // Calculate points for second official language (usually French)
  if (frenchProficiency) {
    const clb = frenchProficiency.clbEquivalent || {
      speaking: 0,
      listening: 0,
      reading: 0,
      writing: 0
    };
    
    // Get minimum CLB score
    const minClb = Math.min(clb.speaking, clb.listening, clb.reading, clb.writing);
    
    if (minClb >= 5 && minClb < 7) {
      points += 25; // CLB 5 or 6
    } else if (minClb >= 7) {
      points += 50; // CLB 7 or higher
    }
  }
  
  return points;
}

function getLanguageAbilityPoints(clbScore, maritalStatus) {
  if (maritalStatus === 'single') {
    if (clbScore < 4) return 0;
    if (clbScore === 4) return 6;
    if (clbScore === 5) return 6;
    if (clbScore === 6) return 8;
    if (clbScore === 7) return 16;
    if (clbScore === 8) return 22;
    if (clbScore === 9) return 29;
    if (clbScore >= 10) return 32;
  } else {
    if (clbScore < 4) return 0;
    if (clbScore === 4) return 5;
    if (clbScore === 5) return 5;
    if (clbScore === 6) return 6;
    if (clbScore === 7) return 14;
    if (clbScore === 8) return 20;
    if (clbScore === 9) return 26;
    if (clbScore >= 10) return 28;
  }
  return 0;
}

function calculateCanadianWorkExperiencePoints(profile) {
  if (!profile.workExperience) {
    return 0;
  }
  
  // Count years of Canadian work experience
  const canadianExperience = profile.workExperience.filter(exp => exp.isCanadianExperience);
  const years = canadianExperience.length; // Simplified for this example
  
  if (profile.maritalStatus === 'single' || !profile.spouseProfile) {
    // Single applicants
    if (years === 0) return 0;
    if (years === 1) return 40;
    if (years === 2) return 53;
    if (years === 3) return 64;
    if (years === 4) return 72;
    if (years >= 5) return 80;
  } else {
    // Married applicants
    if (years === 0) return 0;
    if (years === 1) return 35;
    if (years === 2) return 46;
    if (years === 3) return 56;
    if (years === 4) return 63;
    if (years >= 5) return 70;
  }
  
  return 0;
}

function calculateSpousePoints(spouseProfile) {
  let points = 0;
  
  // Spouse education
  points += calculateSpouseEducationPoints(spouseProfile);
  
  // Spouse language
  points += calculateSpouseLanguagePoints(spouseProfile);
  
  // Spouse Canadian work experience
  points += calculateSpouseWorkExperiencePoints(spouseProfile);
  
  return points;
}

function calculateSpouseEducationPoints(spouseProfile) {
  if (!spouseProfile || !spouseProfile.education) {
    return 0;
  }
  
  const educationLevels = {
    'highSchool': 0,
    'oneYearDiploma': 1,
    'twoYearDiploma': 2,
    'bachelors': 3,
    'twoOrMoreDegrees': 4,
    'masters': 5,
    'phd': 6
  };
  
  const level = educationLevels[spouseProfile.education.level] || 0;
  
  switch (level) {
    case 0: return 0; // High school
    case 1: return 2; // One-year diploma
    case 2: return 6; // Two-year diploma
    case 3: return 7; // Bachelor's degree
    case 4: return 8; // Two or more degrees, one being 3+ years
    case 5: return 9; // Master's degree
    case 6: return 10; // PhD
    default: return 0;
  }
}

function calculateSpouseLanguagePoints(spouseProfile) {
  if (!spouseProfile || !spouseProfile.languageProficiency || spouseProfile.languageProficiency.length === 0) {
    return 0;
  }
  
  // Find English proficiency
  const englishProficiency = spouseProfile.languageProficiency.find(lang => lang.language === 'english');
  
  if (!englishProficiency || !englishProficiency.clbEquivalent) {
    return 0;
  }
  
  const clb = englishProficiency.clbEquivalent;
  
  // Get minimum CLB score
  const minClb = Math.min(clb.speaking, clb.listening, clb.reading, clb.writing);
  
  if (minClb < 4) return 0;
  if (minClb === 4) return 5;
  if (minClb === 5) return 5;
  if (minClb === 6) return 5;
  if (minClb === 7) return 5;
  if (minClb === 8) return 5;
  if (minClb === 9) return 5;
  if (minClb >= 10) return 5;
  
  return 0;
}

function calculateSpouseWorkExperiencePoints(spouseProfile) {
  if (!spouseProfile || !spouseProfile.canadianWorkExperience) {
    return 0;
  }
  
  // Count years of Canadian work experience
  const years = spouseProfile.canadianWorkExperience.length; // Simplified for this example
  
  if (years === 0) return 0;
  if (years === 1) return 5;
  if (years === 2) return 7;
  if (years === 3) return 8;
  if (years === 4) return 9;
  if (years >= 5) return 10;
  
  return 0;
}

function calculateEducationTransferabilityPoints(profile) {
  if (!profile.education || profile.education.length === 0 || !profile.languageProficiency || profile.languageProficiency.length === 0) {
    return 0;
  }
  
  // Get highest education level
  const educationLevels = {
    'highSchool': 0,
    'oneYearDiploma': 1,
    'twoYearDiploma': 2,
    'bachelors': 3,
    'twoOrMoreDegrees': 4,
    'masters': 5,
    'phd': 6
  };
  
  let highestEducation = -1;
  
  profile.education.forEach(edu => {
    const level = educationLevels[edu.level] || 0;
    if (level > highestEducation) {
      highestEducation = level;
    }
  });
  
  // Find English proficiency
  const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
  
  if (!englishProficiency || !englishProficiency.clbEquivalent) {
    return 0;
  }
  
  const clb = englishProficiency.clbEquivalent;
  
  // Get minimum CLB score
  const minClb = Math.min(clb.speaking, clb.listening, clb.reading, clb.writing);
  
  let points = 0;
  
  // Education + Language
  if (highestEducation >= 3) { // Bachelor's degree or higher
    if (minClb >= 7 && minClb < 9) {
      points += 13;
    } else if (minClb >= 9) {
      points += 25;
    }
  } else if (highestEducation >= 1) { // One or two year post-secondary
    if (minClb >= 7 && minClb < 9) {
      points += 13;
    } else if (minClb >= 9) {
      points += 25;
    }
  }
  
  return points;
}

function calculateForeignWorkExperiencePoints(profile) {
  if (!profile.workExperience || !profile.languageProficiency || profile.languageProficiency.length === 0) {
    return 0;
  }
  
  // Count years of foreign work experience
  const foreignExperience = profile.workExperience.filter(exp => !exp.isCanadianExperience);
  const years = foreignExperience.length; // Simplified for this example
  
  // Find English proficiency
  const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
  
  if (!englishProficiency || !englishProficiency.clbEquivalent) {
    return 0;
  }
  
  const clb = englishProficiency.clbEquivalent;
  
  // Get minimum CLB score
  const minClb = Math.min(clb.speaking, clb.listening, clb.reading, clb.writing);
  
  let points = 0;
  
  // Foreign work experience + Language
  if (years >= 1 && years < 3) {
    if (minClb >= 7 && minClb < 9) {
      points += 13;
    } else if (minClb >= 9) {
      points += 25;
    }
  } else if (years >= 3) {
    if (minClb >= 7 && minClb < 9) {
      points += 25;
    } else if (minClb >= 9) {
      points += 50;
    }
  }
  
  return points;
}

function calculateCertificatePoints(profile) {
  // This is a simplified implementation
  return 0;
}

function calculateJobOfferPoints(profile) {
  if (!profile.hasJobOffer) {
    return 0;
  }
  
  // This is a simplified implementation
  return 50;
}

function calculateCanadianEducationPoints(profile) {
  // This is a simplified implementation
  return 0;
}

function calculateFrenchLanguagePoints(profile) {
  if (!profile.languageProficiency) {
    return 0;
  }
  
  // Find French proficiency
  const frenchProficiency = profile.languageProficiency.find(lang => lang.language === 'french');
  
  if (!frenchProficiency || !frenchProficiency.clbEquivalent) {
    return 0;
  }
  
  const frenchClb = frenchProficiency.clbEquivalent;
  const minFrenchClb = Math.min(frenchClb.speaking, frenchClb.listening, frenchClb.reading, frenchClb.writing);
  
  // Find English proficiency
  const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
  
  if (!englishProficiency || !englishProficiency.clbEquivalent) {
    return 0;
  }
  
  const englishClb = englishProficiency.clbEquivalent;
  const minEnglishClb = Math.min(englishClb.speaking, englishClb.listening, englishClb.reading, englishClb.writing);
  
  // French + English
  if (minFrenchClb >= 7 && minEnglishClb >= 5) {
    return 50;
  } else if (minFrenchClb >= 7 && minEnglishClb < 5) {
    return 25;
  }
  
  return 0;
}

// Eligibility check helper functions
function checkFSWPEligibility(profile) {
  const result = {
    isEligible: false,
    reasons: []
  };
  
  // Check skilled work experience
  const hasEnoughWorkExperience = profile.workExperience && profile.workExperience.length >= 1;
  if (!hasEnoughWorkExperience) {
    result.reasons.push('Insufficient skilled work experience for FSWP');
  }
  
  // Check language proficiency
  let hasLanguageProficiency = false;
  if (profile.languageProficiency && profile.languageProficiency.length > 0) {
    const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
    if (englishProficiency && englishProficiency.clbEquivalent) {
      const clb = englishProficiency.clbEquivalent;
      hasLanguageProficiency = clb.speaking >= 7 && clb.listening >= 7 && clb.reading >= 7 && clb.writing >= 7;
    }
  }
  
  if (!hasLanguageProficiency) {
    result.reasons.push('Language proficiency below CLB 7 for FSWP');
  }
  
  // Check education
  const hasEducation = profile.education && profile.education.length > 0;
  if (!hasEducation) {
    result.reasons.push('Missing education credentials for FSWP');
  }
  
  // Check overall score
  const score = calculateFSWPScore(profile);
  const hasMinimumScore = score >= 67;
  if (!hasMinimumScore) {
    result.reasons.push('FSWP score below 67 points');
  }
  
  result.isEligible = hasEnoughWorkExperience && hasLanguageProficiency && hasEducation && hasMinimumScore;
  
  return result;
}

function calculateFSWPScore(profile) {
  // This is a simplified implementation
  return 70; // Placeholder score
}

function checkCECEligibility(profile) {
  const result = {
    isEligible: false,
    reasons: []
  };
  
  // Check Canadian work experience
  const canadianExperience = profile.workExperience ? profile.workExperience.filter(exp => exp.isCanadianExperience) : [];
  const hasEnoughCanadianExperience = canadianExperience.length >= 1;
  
  if (!hasEnoughCanadianExperience) {
    result.reasons.push('Insufficient Canadian work experience for CEC');
  }
  
  // Check language proficiency
  let hasLanguageProficiency = false;
  if (profile.languageProficiency && profile.languageProficiency.length > 0) {
    const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
    if (englishProficiency && englishProficiency.clbEquivalent) {
      const clb = englishProficiency.clbEquivalent;
      
      // NOC 0 or A jobs need CLB 7, NOC B jobs need CLB 5
      // Simplified check assuming NOC B
      hasLanguageProficiency = clb.speaking >= 5 && clb.listening >= 5 && clb.reading >= 5 && clb.writing >= 5;
    }
  }
  
  if (!hasLanguageProficiency) {
    result.reasons.push('Language proficiency below required CLB for CEC');
  }
  
  result.isEligible = hasEnoughCanadianExperience && hasLanguageProficiency;
  
  return result;
}

function checkFSTPEligibility(profile) {
  const result = {
    isEligible: false,
    reasons: []
  };
  
  // Simplified implementation
  result.reasons.push('Not eligible for FSTP');
  
  return result;
}
```

### Express Entry Routes

```javascript
// backend/routes/canada/expressEntryRoutes.js

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
    body('languageProficiency').isArray().notEmpty().withMessage('Language proficiency is required'),
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
    body('languageProficiency').isArray().notEmpty().withMessage('Language proficiency is required'),
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

### Express Entry Model

```javascript
// backend/models/canada/ExpressEntryProfile.js

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

## 3. Localization Files

### English Express Entry Localization

```json
// frontend/public/locales/en/express-entry.json
{
  "pageTitle": "Express Entry Calculator",
  "pageDescription": "Calculate your Comprehensive Ranking System (CRS) score for Canadian Express Entry immigration",
  "pageIntro": "Express Entry is Canada's application management system for skilled workers. Use our calculator to estimate your Comprehensive Ranking System (CRS) score and see if you qualify for Canadian immigration.",
  
  "calculatorSection": "CRS Score Calculator",
  "eligibilitySection": "Eligibility Check",
  "profileSection": "Create Express Entry Profile",
  
  "calculator": {
    "title": "Calculate Your CRS Score",
    "description": "Fill in your details below to calculate your potential Express Entry score. The maximum possible score is 1,200 points.",
    "personalInfo": "Personal Information",
    "age": "Age",
    "educationLevel": "Highest Level of Education",
    "languageProficiency": "Language Proficiency",
    "languageTest": "Language Test",
    "speaking": "Speaking Score",
    "listening": "Listening Score",
    "reading": "Reading Score",
    "writing": "Writing Score",
    "workExperience": "Work Experience",
    "canadianWorkExperience": "Canadian Work Experience",
    "foreignWorkExperience": "Foreign Work Experience",
    "additionalFactors": "Additional Factors",
    "maritalStatus": "Marital Status",
    "provincialNomination": "Provincial Nomination",
    "jobOffer": "Valid Job Offer in Canada",
    "calculating": "Calculating...",
    "calculateButton": "Calculate My Score",
    "yourScore": "Your CRS Score",
    "scoreExplanation": "This is an estimate based on the information you provided. Actual scores may vary based on official assessment."
  },
  
  "education": {
    "highSchool": "High School",
    "oneYearDiploma": "One-year Post-secondary Program",
    "twoYearDiploma": "Two-year Post-secondary Program",
    "bachelors": "Bachelor's Degree",
    "twoOrMoreDegrees": "Two or more Post-secondary Credentials (one 3+ years)",
    "masters": "Master's Degree",
    "phd": "PhD"
  },
  
  "language": {
    "ielts": "IELTS - International English Language Testing System",
    "celpip": "CELPIP - Canadian English Language Proficiency Index Program",
    "tef": "TEF - Test d'évaluation de français",
    "tcf": "TCF - Test de connaissance du français"
  },
  
  "workExperience": {
    "none": "None",
    "oneYear": "1 year",
    "twoYears": "2 years",
    "threeYears": "3 years",
    "fourYears": "4 years",
    "fiveYears": "5 years",
    "sixPlusYears": "6+ years"
  },
  
  "maritalStatus": {
    "single": "Single",
    "married": "Married",
    "commonLaw": "Common-Law"
  },
  
  "errors": {
    "missingRequiredFields": "Please fill in all required fields",
    "invalidAge": "Age must be between 18 and 100",
    "invalidLanguageScore": "Language scores must be valid for the selected test"
  }
}
```

### French Express Entry Localization

```json
// frontend/public/locales/fr/express-entry.json
{
  "pageTitle": "Calculateur Entrée Express",
  "pageDescription": "Calculez votre score du Système de classement global (SCG) pour l'immigration canadienne Entrée Express",
  "pageIntro": "Entrée Express est le système de gestion des demandes du Canada pour les travailleurs qualifiés. Utilisez notre calculateur pour estimer votre score du Système de classement global (SCG) et voir si vous êtes admissible à l'immigration canadienne.",
  
  "calculatorSection": "Calculateur de Score SCG",
  "eligibilitySection": "Vérification d'Admissibilité",
  "profileSection": "Créer un Profil Entrée Express",
  
  "calculator": {
    "title": "Calculez Votre Score SCG",
    "description": "Remplissez vos informations ci-dessous pour calculer votre score potentiel d'Entrée Express. Le score maximum possible est de 1 200 points.",
    "personalInfo": "Informations Personnelles",
    "age": "Âge",
    "educationLevel": "Niveau d'Éducation le Plus Élevé",
    "languageProficiency": "Compétence Linguistique",
    "languageTest": "Test de Langue",
    "speaking": "Score en Expression Orale",
    "listening": "Score en Compréhension Orale",
    "reading": "Score en Compréhension Écrite",
    "writing": "Score en Expression Écrite",
    "workExperience": "Expérience Professionnelle",
    "canadianWorkExperience": "Expérience de Travail Canadienne",
    "foreignWorkExperience": "Expérience de Travail Étrangère",
    "additionalFactors": "Facteurs Supplémentaires",
    "maritalStatus": "État Civil",
    "provincialNomination": "Nomination Provinciale",
    "jobOffer": "Offre d'Emploi Valide au Canada",
    "calculating": "Calcul en cours...",
    "calculateButton": "Calculer Mon Score",
    "yourScore": "Votre Score SCG",
    "scoreExplanation": "Il s'agit d'une estimation basée sur les informations que vous avez fournies. Les scores réels peuvent varier en fonction de l'évaluation officielle."
  },
  
  "education": {
    "highSchool": "École Secondaire",
    "oneYearDiploma": "Programme Postsecondaire d'Un An",
    "twoYearDiploma": "Programme Postsecondaire de Deux Ans",
    "bachelors": "Baccalauréat",
    "twoOrMoreDegrees": "Deux Diplômes Postsecondaires ou Plus (un de 3+ ans)",
    "masters": "Maîtrise",
    "phd": "Doctorat"
  },
  
  "language": {
    "ielts": "IELTS - Système International de Test de la Langue Anglaise",
    "celpip": "CELPIP - Programme d'Indice de Compétence en Anglais Canadien",
    "tef": "TEF - Test d'évaluation de français",
    "tcf": "TCF - Test de connaissance du français"
  },
  
  "workExperience": {
    "none": "Aucune",
    "oneYear": "1 an",
    "twoYears": "2 ans",
    "threeYears": "3 ans",
    "fourYears": "4 ans",
    "fiveYears": "5 ans",
    "sixPlusYears": "6+ ans"
  },
  
  "maritalStatus": {
    "single": "Célibataire",
    "married": "Marié(e)",
    "commonLaw": "Conjoint(e) de Fait"
  },
  
  "errors": {
    "missingRequiredFields": "Veuillez remplir tous les champs obligatoires",
    "invalidAge": "L'âge doit être compris entre 18 et 100 ans",
    "invalidLanguageScore": "Les scores de langue doivent être valides pour le test sélectionné"
  }
}
```

## 4. TypeScript Type Definitions

```typescript
// frontend/types/canada.ts

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
```

## 5. API Integration

```typescript
// frontend/pages/api/canada/express-entry/calculate-score.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ExpressEntryProfile } from '../../../../types/canada';

type ResponseData = {
  success: boolean;
  score?: number;
  breakdown?: any;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const profile = req.body as ExpressEntryProfile;
    
    // Validate required fields
    if (!profile.age || !profile.educationLevel || !profile.languageProficiency) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Forward request to backend API
    const response = await fetch(`${process.env.BACKEND_API_URL}/canada/express-entry/calculate-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        success: false, 
        message: errorData.message || 'Failed to calculate score' 
      });
    }
    
    const data = await response.json();
    return res.status(200).json({
      success: true,
      score: data.score,
      breakdown: data.breakdown
    });
  } catch (error) {
    console.error('Error calculating Express Entry points:', error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    });
  }
}
```

This implementation provides the core functionality for the Canadian market focus, including:

1. A comprehensive Express Entry points calculator with both frontend and backend components
2. Bilingual support with English and French localization
3. Canadian consultant dashboard components
4. TypeScript type definitions for Canadian immigration data models
5. API integration for Express Entry calculations

These components can be integrated into the existing ThinkForward AI codebase to provide Canadian-specific functionality while maintaining compatibility with the existing architecture.
