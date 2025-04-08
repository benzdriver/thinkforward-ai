import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import type { ExpressEntryProfile } from '../../../types/canada';

// 本地定义接口，避免从types导入
interface AIEligibilityResult {
  profileId: string;
  programId: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  factorScores: Array<{
    factor: string;
    score: number;
    maxScore: number;
    impact: 'High' | 'Medium' | 'Low';
  }>;
  overallScore: number;
  thresholdScore: number;
  suggestedActions?: string[];
  riskFactors?: string[];
}

interface AIEligibilityAssessmentProps {
  profile: ExpressEntryProfile;
  programId: string;
  className?: string;
}

export const AIEligibilityAssessment: React.FC<AIEligibilityAssessmentProps> = ({
  profile,
  programId,
  className = ''
}) => {
  const { t } = useTranslation(['express-entry', 'common']);
  const { assessEligibility } = useCanadianImmigration();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AIEligibilityResult | null>(null);
  
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await assessEligibility(profile, programId);
        setAssessment(result);
        
        setLoading(false);
      } catch (err) {
        console.error('Error assessing eligibility:', err);
        setError(t('common:errors.failed_to_load_data'));
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [profile, programId, assessEligibility, t]);
  
  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  if (!assessment) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-gray-500">{t('express-entry:no_assessment_available')}</div>
      </div>
    );
  }
  
  // Helper function to determine color based on score ratio
  const getScoreColor = (score: number, maxScore: number) => {
    const ratio = score / maxScore;
    if (ratio >= 0.8) return 'text-green-600';
    if (ratio >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Helper function to determine color based on impact
  const getImpactColor = (impact: 'High' | 'Medium' | 'Low') => {
    if (impact === 'High') return 'text-red-600';
    if (impact === 'Medium') return 'text-yellow-600';
    return 'text-blue-600';
  };

  // Calculate the percentage of the overall score compared to threshold
  const scorePercentage = Math.min(100, Math.round((assessment.overallScore / assessment.thresholdScore) * 100));
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">
        {t('express-entry:ai_eligibility_assessment')}
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">{t('express-entry:eligibility_result')}</span>
          <span className={`text-2xl font-bold ${assessment.isEligible ? 'text-green-600' : 'text-red-600'}`}>
            {assessment.isEligible ? t('express-entry:eligible') : t('express-entry:not_eligible')}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-medium">
            {assessment.overallScore} / {assessment.thresholdScore} {t('express-entry:points')}
          </span>
          <span className={`text-sm font-medium ${
            assessment.confidence >= 0.8 ? 'text-green-600' : 
            assessment.confidence >= 0.6 ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {t('express-entry:ai_confidence')}: {(assessment.confidence * 100).toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              assessment.isEligible ? 'bg-green-600' : 'bg-red-600'
            }`} 
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('express-entry:factor_scores')}</h3>
        <div className="space-y-3">
          {assessment.factorScores.map((factor: {
            factor: string;
            score: number;
            maxScore: number;
            impact: 'High' | 'Medium' | 'Low';
          }, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{factor.factor}</span>
                <span className={`ml-2 text-sm ${getImpactColor(factor.impact)}`}>
                  ({factor.impact})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                  <div 
                    className={`h-1.5 rounded-full ${getScoreColor(factor.score, factor.maxScore)}`} 
                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{factor.score}/{factor.maxScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {assessment.suggestedActions && assessment.suggestedActions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">{t('express-entry:suggested_actions')}</h3>
          <div className="space-y-2">
            {assessment.suggestedActions.map((action: string, index: number) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-800">{action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {assessment.riskFactors && assessment.riskFactors.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">{t('express-entry:risk_factors')}</h3>
          <div className="space-y-2">
            {assessment.riskFactors.map((risk: string, index: number) => (
              <div key={index} className="bg-red-50 p-3 rounded-lg">
                <div className="text-red-800">{risk}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">{t('express-entry:ai_reasoning')}</h3>
        <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
          <p>{assessment.reasoning}</p>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>{t('express-entry:assessment_disclaimer')}</p>
      </div>
    </div>
  );
};

export default AIEligibilityAssessment;
