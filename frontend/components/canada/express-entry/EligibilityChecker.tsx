import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import type { ExpressEntryProfile } from '../../../types/canada';

interface EligibilityCheckerProps {
  initialProfile?: Partial<ExpressEntryProfile>;
  onEligibilityChecked?: (isEligible: boolean, programs: string[], profile: ExpressEntryProfile) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  initialProfile = {},
  onEligibilityChecked
}) => {
  const { t } = useTranslation(['express-entry', 'common']);
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [eligiblePrograms, setEligiblePrograms] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use the profile and API components from the PointsCalculator with some modifications
  // for the eligibility check
  
  const handleCheckEligibility = async () => {
    try {
      setIsChecking(true);
      setError(null);
      
      // Simulated API call or check (replace with actual API when available)
      // In a real implementation, this would call the backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate checking eligibility based on profile data
      const mockCheck = checkMockEligibility(profile);
      
      setIsEligible(mockCheck.isEligible);
      setEligiblePrograms(mockCheck.eligiblePrograms);
      setReasons(mockCheck.reasons);
      
      if (onEligibilityChecked) {
        onEligibilityChecked(
          mockCheck.isEligible, 
          mockCheck.eligiblePrograms, 
          profile as ExpressEntryProfile
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsChecking(false);
    }
  };
  
  // Mock eligibility check function for demonstration purposes
  // This would be replaced with the actual API call
  const checkMockEligibility = (profile: Partial<ExpressEntryProfile>) => {
    const result = {
      isEligible: false,
      eligiblePrograms: [] as string[],
      reasons: [] as string[]
    };
    
    // Check Federal Skilled Worker Program (FSWP)
    let fswpEligible = true;
    const fswpReasons: string[] = [];
    
    if (!profile.education || profile.education.length === 0) {
      fswpEligible = false;
      fswpReasons.push(t('eligibility.reasons.noEducation', { ns: 'express-entry' }));
    }
    
    if (!profile.languageProficiency || profile.languageProficiency.length === 0) {
      fswpEligible = false;
      fswpReasons.push(t('eligibility.reasons.noLanguageTest', { ns: 'express-entry' }));
    } else {
      const englishProficiency = profile.languageProficiency.find(lp => lp.language === 'english');
      if (englishProficiency) {
        const minScore = Math.min(
          englishProficiency.speaking, 
          englishProficiency.listening, 
          englishProficiency.reading, 
          englishProficiency.writing
        );
        if (minScore < 7) {
          fswpEligible = false;
          fswpReasons.push(t('eligibility.reasons.lowLanguageScore', { ns: 'express-entry' }));
        }
      } else {
        fswpEligible = false;
        fswpReasons.push(t('eligibility.reasons.noEnglishTest', { ns: 'express-entry' }));
      }
    }
    
    if (!profile.workExperience || profile.workExperience.length === 0) {
      fswpEligible = false;
      fswpReasons.push(t('eligibility.reasons.noWorkExperience', { ns: 'express-entry' }));
    } else if (profile.workExperience.length < 1) {
      fswpEligible = false;
      fswpReasons.push(t('eligibility.reasons.insufficientWorkExperience', { ns: 'express-entry' }));
    }
    
    if (fswpEligible) {
      result.isEligible = true;
      result.eligiblePrograms.push('FSWP');
    } else {
      result.reasons.push(...fswpReasons.map(reason => `FSWP: ${reason}`));
    }
    
    // Check Canadian Experience Class (CEC)
    let cecEligible = true;
    const cecReasons: string[] = [];
    
    const canadianExperience = profile.workExperience?.filter(exp => exp.isCanadianExperience) || [];
    if (canadianExperience.length < 1) {
      cecEligible = false;
      cecReasons.push(t('eligibility.reasons.noCanadianExperience', { ns: 'express-entry' }));
    }
    
    if (!profile.languageProficiency || profile.languageProficiency.length === 0) {
      cecEligible = false;
      cecReasons.push(t('eligibility.reasons.noLanguageTest', { ns: 'express-entry' }));
    } else {
      const englishProficiency = profile.languageProficiency.find(lp => lp.language === 'english');
      if (englishProficiency) {
        const minScore = Math.min(
          englishProficiency.speaking, 
          englishProficiency.listening, 
          englishProficiency.reading, 
          englishProficiency.writing
        );
        if (minScore < 5) {
          cecEligible = false;
          cecReasons.push(t('eligibility.reasons.lowLanguageScoreCEC', { ns: 'express-entry' }));
        }
      } else {
        cecEligible = false;
        cecReasons.push(t('eligibility.reasons.noEnglishTest', { ns: 'express-entry' }));
      }
    }
    
    if (cecEligible) {
      result.isEligible = true;
      result.eligiblePrograms.push('CEC');
    } else {
      result.reasons.push(...cecReasons.map(reason => `CEC: ${reason}`));
    }
    
    // We'll assume Federal Skilled Trades Program (FSTP) check is similar
    // but with different requirements
    
    return result;
  };
  
  return (
    <div className="eligibility-checker bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('eligibility.title', { ns: 'express-entry' })}</h2>
      <p className="text-gray-600 mb-6">{t('eligibility.description', { ns: 'express-entry' })}</p>
      
      {/* Reuse some of the PointsCalculator form elements here */}
      
      <div className="mt-8">
        <button
          onClick={handleCheckEligibility}
          disabled={isChecking}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isChecking ? t('eligibility.checking', { ns: 'express-entry' }) : t('eligibility.checkButton', { ns: 'express-entry' })}
        </button>
      </div>
      
      {error && (
        <div className="error-message mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isEligible !== null && (
        <div className={`eligibility-result mt-6 p-6 border rounded-lg ${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {isEligible 
              ? t('eligibility.eligible', { ns: 'express-entry' }) 
              : t('eligibility.notEligible', { ns: 'express-entry' })}
          </h3>
          
          {isEligible && eligiblePrograms.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{t('eligibility.eligiblePrograms', { ns: 'express-entry' })}</h4>
              <ul className="list-disc pl-5 space-y-1">
                {eligiblePrograms.includes('FSWP') && (
                  <li className="text-green-700">
                    {t('eligibility.programs.fswp', { ns: 'express-entry' })}
                  </li>
                )}
                {eligiblePrograms.includes('CEC') && (
                  <li className="text-green-700">
                    {t('eligibility.programs.cec', { ns: 'express-entry' })}
                  </li>
                )}
                {eligiblePrograms.includes('FSTP') && (
                  <li className="text-green-700">
                    {t('eligibility.programs.fstp', { ns: 'express-entry' })}
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {!isEligible && reasons.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{t('eligibility.reasons.title', { ns: 'express-entry' })}</h4>
              <ul className="list-disc pl-5 space-y-1">
                {reasons.map((reason, index) => (
                  <li key={index} className="text-red-700">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-gray-600">
              {isEligible 
                ? t('eligibility.nextSteps.eligible', { ns: 'express-entry' })
                : t('eligibility.nextSteps.notEligible', { ns: 'express-entry' })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker; 