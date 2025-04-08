import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import { AIRecommendation, ExpressEntryProfile } from '../../../types/canada';

interface AIRecommendationEngineProps {
  profile: ExpressEntryProfile;
  className?: string;
  onRecommendationSelect?: (recommendation: AIRecommendation) => void;
}

export const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({
  profile,
  className = '',
  onRecommendationSelect
}) => {
  const { t } = useTranslation(['express-entry', 'common']);
  const { getRecommendations } = useCanadianImmigration();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getRecommendations(profile);
      setRecommendations(result);
      
      setLoading(false);
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
      setError(t('common:errors.failed_to_get_recommendations'));
      setLoading(false);
    }
  };
  
  // Helper function to determine color based on impact
  const getImpactColor = (impact: 'High' | 'Medium' | 'Low') => {
    if (impact === 'High') return 'border-red-300 bg-red-50';
    if (impact === 'Medium') return 'border-yellow-300 bg-yellow-50';
    return 'border-blue-300 bg-blue-50';
  };
  
  // Helper function to determine badge color based on effort
  const getEffortBadgeColor = (effort: 'High' | 'Medium' | 'Low') => {
    switch (effort) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to determine badge color based on timeframe
  const getTimeframeBadgeColor = (timeframe: 'Immediate' | 'Short-term' | 'Long-term') => {
    switch (timeframe) {
      case 'Immediate':
        return 'bg-green-100 text-green-800';
      case 'Short-term':
        return 'bg-blue-100 text-blue-800';
      case 'Long-term':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {t('express-entry:ai_recommendations')}
        </h2>
        
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('common:loading') : t('express-entry:get_recommendations')}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {recommendations.length === 0 && !loading && !error ? (
        <div className="text-center py-8 text-gray-500">
          {t('express-entry:no_recommendations_yet')}
          <p className="mt-2 text-sm">
            {t('express-entry:click_button_to_generate')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${getImpactColor(recommendation.impact)}`}
              onClick={() => onRecommendationSelect && onRecommendationSelect(recommendation)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getEffortBadgeColor(recommendation.effort)}`}>
                    {t(`express-entry:${recommendation.effort.toLowerCase()}_effort`)}
                  </span>
                  <span className={`ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${getTimeframeBadgeColor(recommendation.timeframe)}`}>
                    {t(`express-entry:${recommendation.timeframe.toLowerCase().replace('-', '_')}`)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {t('express-entry:confidence')}: {(recommendation.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  recommendation.impact === 'High' ? 'text-red-700' :
                  recommendation.impact === 'Medium' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>
                  {t(`express-entry:${recommendation.impact.toLowerCase()}_impact`)}
                </span>
              </div>
              
              <h3 className="text-lg font-medium mb-2">{recommendation.title}</h3>
              
              <div className="text-sm text-gray-700 mb-3">
                {recommendation.description}
              </div>
              
              {recommendation.relevantFactors && recommendation.relevantFactors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {recommendation.relevantFactors.map((factor, i) => (
                    <span key={i} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="text-sm">
                <span className="font-medium">{t('express-entry:potential_benefit')}:</span> {recommendation.potentialBenefit}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>{t('express-entry:recommendations_disclaimer')}</p>
      </div>
    </div>
  );
};

export default AIRecommendationEngine;
