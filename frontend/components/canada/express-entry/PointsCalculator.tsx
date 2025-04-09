import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import type { ExpressEntryProfile, LanguageProficiency } from '../../../types/canada';
import type { Education, WorkExperience, JobOfferDetails, AdaptabilityFactors } from '../../../types/canada/job-types';

interface PointsCalculatorProps {
  initialProfile?: Partial<ExpressEntryProfile>;
  onScoreCalculated?: (score: number, profile: ExpressEntryProfile) => void;
}

export const PointsCalculator: React.FC<PointsCalculatorProps> = ({ 
  initialProfile = {}, 
  onScoreCalculated 
}) => {
  const { t } = useTranslation(['express-entry', 'common']);
  const { calculateExpressEntryPoints } = useCanadianImmigration();
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [score, setScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: keyof ExpressEntryProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset score when inputs change
    setScore(null);
  };

  const handleLanguageProficiencyChange = (
    index: number, 
    field: keyof LanguageProficiency, 
    value: any
  ) => {
    setProfile(prev => {
      const updatedLanguageProficiency = [...(prev.languageProficiency || [])];
      if (!updatedLanguageProficiency[index]) {
        updatedLanguageProficiency[index] = {
          language: 'english',
          test: 'IELTS',
          speaking: 0,
          listening: 0,
          reading: 0,
          writing: 0
        };
      }
      updatedLanguageProficiency[index] = {
        ...updatedLanguageProficiency[index],
        [field]: value
      };
      return {
        ...prev,
        languageProficiency: updatedLanguageProficiency
      };
    });
    // Reset score when inputs change
    setScore(null);
  };

  const handleCalculateScore = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      
      // Validate required fields
      if (!profile.age || !profile.languageProficiency || profile.languageProficiency.length === 0) {
        throw new Error(t('errors.missingRequiredFields', { ns: 'express-entry' }) as string);
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

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="points-calculator bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('calculator.title', { ns: 'express-entry' })}</h2>
      <p className="text-gray-600 mb-6">{t('calculator.description', { ns: 'express-entry' })}</p>
      
      <div className="steps-indicator mb-8 flex justify-between">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`step-indicator flex flex-col items-center ${currentStep >= step ? 'text-primary' : 'text-gray-400'}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep > step 
                  ? 'bg-primary text-white' 
                  : currentStep === step 
                  ? 'border-2 border-primary text-primary' 
                  : 'border-2 border-gray-300 text-gray-400'
              }`}
            >
              {currentStep > step ? '✓' : step}
            </div>
            <span className="text-sm">
              {step === 1 && t('calculator.personalInfo', { ns: 'express-entry' })}
              {step === 2 && t('calculator.languageProficiency', { ns: 'express-entry' })}
              {step === 3 && t('calculator.workExperience', { ns: 'express-entry' })}
              {step === 4 && t('calculator.additionalFactors', { ns: 'express-entry' })}
            </span>
          </div>
        ))}
      </div>
      
      {currentStep === 1 && (
        <div className="form-section mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('calculator.personalInfo', { ns: 'express-entry' })}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="age">
              {t('calculator.age', { ns: 'express-entry' })}
            </label>
            <input
              id="age"
              type="number"
              value={profile.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value, 10))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="maritalStatus">
              {t('calculator.maritalStatus', { ns: 'express-entry' })}
            </label>
            <select
              id="maritalStatus"
              value={profile.maritalStatus || 'single'}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="single">{t('maritalStatus.single', { ns: 'express-entry' })}</option>
              <option value="married">{t('maritalStatus.married', { ns: 'express-entry' })}</option>
              <option value="commonLaw">{t('maritalStatus.commonLaw', { ns: 'express-entry' })}</option>
              <option value="divorced">{t('maritalStatus.divorced', { ns: 'express-entry' })}</option>
              <option value="separated">{t('maritalStatus.separated', { ns: 'express-entry' })}</option>
              <option value="widowed">{t('maritalStatus.widowed', { ns: 'express-entry' })}</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="educationLevel">
              {t('calculator.educationLevel', { ns: 'express-entry' })}
            </label>
            <select
              id="educationLevel"
              value={profile.education?.[0]?.level || ''}
              onChange={(e) => {
                const education = profile.education || [];
                const updatedEducation = [...education];
                if (!updatedEducation[0]) {
                  updatedEducation[0] = { level: e.target.value as any };
                } else {
                  updatedEducation[0] = { ...updatedEducation[0], level: e.target.value as any };
                }
                handleInputChange('education', updatedEducation);
              }}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('common:select')}</option>
              <option value="highSchool">{t('education.highSchool', { ns: 'express-entry' })}</option>
              <option value="oneYearDiploma">{t('education.oneYearDiploma', { ns: 'express-entry' })}</option>
              <option value="twoYearDiploma">{t('education.twoYearDiploma', { ns: 'express-entry' })}</option>
              <option value="bachelors">{t('education.bachelors', { ns: 'express-entry' })}</option>
              <option value="twoOrMoreDegrees">{t('education.twoOrMoreDegrees', { ns: 'express-entry' })}</option>
              <option value="masters">{t('education.masters', { ns: 'express-entry' })}</option>
              <option value="phd">{t('education.phd', { ns: 'express-entry' })}</option>
            </select>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="form-section mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('calculator.languageProficiency', { ns: 'express-entry' })}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="languageTest">
              {t('calculator.languageTest', { ns: 'express-entry' })}
            </label>
            <select
              id="languageTest"
              value={profile.languageProficiency?.[0]?.test || ''}
              onChange={(e) => handleLanguageProficiencyChange(0, 'test', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('common:select')}</option>
              <option value="IELTS">{t('language.ielts', { ns: 'express-entry' })}</option>
              <option value="CELPIP">{t('language.celpip', { ns: 'express-entry' })}</option>
              <option value="TEF">{t('language.tef', { ns: 'express-entry' })}</option>
              <option value="TCF">{t('language.tcf', { ns: 'express-entry' })}</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="language">
              {t('calculator.language', { ns: 'express-entry' })}
            </label>
            <select
              id="language"
              value={profile.languageProficiency?.[0]?.language || 'english'}
              onChange={(e) => handleLanguageProficiencyChange(0, 'language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="english">English</option>
              <option value="french">French</option>
            </select>
          </div>
          
          {profile.languageProficiency?.[0]?.test && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="speaking">
                  {t('calculator.speaking', { ns: 'express-entry' })}
                </label>
                <input
                  id="speaking"
                  type="number"
                  step="0.5"
                  value={profile.languageProficiency[0].speaking || ''}
                  onChange={(e) => handleLanguageProficiencyChange(0, 'speaking', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="listening">
                  {t('calculator.listening', { ns: 'express-entry' })}
                </label>
                <input
                  id="listening"
                  type="number"
                  step="0.5"
                  value={profile.languageProficiency[0].listening || ''}
                  onChange={(e) => handleLanguageProficiencyChange(0, 'listening', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="reading">
                  {t('calculator.reading', { ns: 'express-entry' })}
                </label>
                <input
                  id="reading"
                  type="number"
                  step="0.5"
                  value={profile.languageProficiency[0].reading || ''}
                  onChange={(e) => handleLanguageProficiencyChange(0, 'reading', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="writing">
                  {t('calculator.writing', { ns: 'express-entry' })}
                </label>
                <input
                  id="writing"
                  type="number"
                  step="0.5"
                  value={profile.languageProficiency[0].writing || ''}
                  onChange={(e) => handleLanguageProficiencyChange(0, 'writing', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="form-section mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('calculator.workExperience', { ns: 'express-entry' })}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="canadianWorkExperience">
              {t('calculator.canadianWorkExperience', { ns: 'express-entry' })}
            </label>
            <select
              id="canadianWorkExperience"
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
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="0">{t('workExperience.none', { ns: 'express-entry' })}</option>
              <option value="1">{t('workExperience.oneYear', { ns: 'express-entry' })}</option>
              <option value="2">{t('workExperience.twoYears', { ns: 'express-entry' })}</option>
              <option value="3">{t('workExperience.threeYears', { ns: 'express-entry' })}</option>
              <option value="4">{t('workExperience.fourYears', { ns: 'express-entry' })}</option>
              <option value="5">{t('workExperience.fiveYears', { ns: 'express-entry' })}</option>
              <option value="6">{t('workExperience.sixPlusYears', { ns: 'express-entry' })}</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="foreignWorkExperience">
              {t('calculator.foreignWorkExperience', { ns: 'express-entry' })}
            </label>
            <select
              id="foreignWorkExperience"
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
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="0">{t('workExperience.none', { ns: 'express-entry' })}</option>
              <option value="1">{t('workExperience.oneYear', { ns: 'express-entry' })}</option>
              <option value="2">{t('workExperience.twoYears', { ns: 'express-entry' })}</option>
              <option value="3">{t('workExperience.threeYears', { ns: 'express-entry' })}</option>
            </select>
          </div>
        </div>
      )}
      
      {currentStep === 4 && (
        <div className="form-section mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('calculator.additionalFactors', { ns: 'express-entry' })}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="provincialNomination">
              {t('calculator.provincialNomination', { ns: 'express-entry' })}
            </label>
            <select
              id="provincialNomination"
              value={profile.hasProvincialNomination ? 'yes' : 'no'}
              onChange={(e) => handleInputChange('hasProvincialNomination', e.target.value === 'yes')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="no">{t('common:no')}</option>
              <option value="yes">{t('common:yes')}</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="jobOffer">
              {t('calculator.jobOffer', { ns: 'express-entry' })}
            </label>
            <select
              id="jobOffer"
              value={profile.hasJobOffer ? 'yes' : 'no'}
              onChange={(e) => handleInputChange('hasJobOffer', e.target.value === 'yes')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="no">{t('common:no')}</option>
              <option value="yes">{t('common:yes')}</option>
            </select>
          </div>
          
          {profile.hasJobOffer && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="jobOfferNOC">
                {t('calculator.jobOfferNOC', { ns: 'express-entry' })}
              </label>
              <input
                id="jobOfferNOC"
                type="text"
                value={profile.jobOfferDetails?.noc || ''}
                onChange={(e) => {
                  const jobOfferDetails = {
                    ...(profile.jobOfferDetails || {}),
                    noc: e.target.value
                  };
                  handleInputChange('jobOfferDetails', jobOfferDetails);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 21223"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="sibling">
              {t('calculator.siblingInCanada', { ns: 'express-entry' })}
            </label>
            <select
              id="sibling"
              value={(profile.adaptabilityFactors?.relativesInCanada?.has && profile.adaptabilityFactors?.relativesInCanada?.relationship === 'sibling') ? 'yes' : 'no'}
              onChange={(e) => {
                const hasSibling = e.target.value === 'yes';
                const adaptabilityFactors = {
                  ...(profile.adaptabilityFactors || {}),
                  relativesInCanada: {
                    has: hasSibling,
                    relationship: hasSibling ? 'sibling' : undefined
                  }
                };
                handleInputChange('adaptabilityFactors', adaptabilityFactors);
              }}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="no">{t('common:no')}</option>
              <option value="yes">{t('common:yes')}</option>
            </select>
          </div>
          
          <button
            onClick={handleCalculateScore}
            disabled={isCalculating}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isCalculating ? t('calculator.calculating', { ns: 'express-entry' }) : t('calculator.calculateButton', { ns: 'express-entry' })}
          </button>
          
          {error && (
            <div className="error-message mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {score !== null && (
            <div className="score-result mt-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('calculator.yourScore', { ns: 'express-entry' })}</h3>
              <div className="score-value text-4xl font-bold text-primary mb-3">{score}</div>
              <p className="text-gray-600">{t('calculator.scoreExplanation', { ns: 'express-entry' })}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="navigation-buttons flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded ${
            currentStep === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('common:back')}
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            {t('common:next')}
          </button>
        ) : (
          <button
            onClick={handleCalculateScore}
            disabled={isCalculating}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isCalculating ? t('calculator.calculating', { ns: 'express-entry' }) : t('calculator.calculateButton', { ns: 'express-entry' })}
          </button>
        )}
      </div>
    </div>
  );
};

export default PointsCalculator;    