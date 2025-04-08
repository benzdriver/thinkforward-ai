import React, { createContext, useContext, useState, useCallback } from 'react';
import type { 
  ExpressEntryProfile, 
  PNPProgram, 
  CanadianProvince, 
  CLBLevel,
  CanadianCase,
  DocumentSubmission,
  DocumentType,
  AIDocumentAnalysis,
  AIEligibilityResult,
  AIRecommendation,
  RegionalTrendData,
  AITrendPrediction
} from '../types/canada';

interface CanadianImmigrationContextType {
  calculateExpressEntryPoints: (profile: ExpressEntryProfile) => Promise<number>;
  checkPnpEligibility: (province: CanadianProvince, profile: Partial<ExpressEntryProfile>) => Promise<PNPProgram[]>;
  getDocumentChecklist: (programType: string, profile: Partial<ExpressEntryProfile>) => Promise<string[]>;
  getCases: () => Promise<CanadianCase[]>;
  uploadDocument: (document: Partial<DocumentSubmission>) => Promise<DocumentSubmission>;
  getLatestDraws: () => Promise<any[]>;
  saveProfile: (profile: ExpressEntryProfile) => Promise<ExpressEntryProfile>;
  getProvincialPrograms: (province: CanadianProvince) => Promise<PNPProgram[]>;
  
  // AI-enhanced methods
  analyzeDocument: (documentId: string) => Promise<AIDocumentAnalysis>;
  assessEligibility: (profile: ExpressEntryProfile, programId: string) => Promise<AIEligibilityResult>;
  getRecommendations: (profile: ExpressEntryProfile) => Promise<AIRecommendation[]>;
  getRegionalTrends: (province: CanadianProvince) => Promise<RegionalTrendData[]>;
  getTrendPredictions: (province: CanadianProvince) => Promise<AITrendPrediction>;
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

  const uploadDocument = useCallback(async (
    document: Partial<DocumentSubmission>
  ): Promise<DocumentSubmission> => {
    try {
      const response = await fetch('/api/canada/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(document),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      const data = await response.json();
      return data.document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }, []);

  const getLatestDraws = useCallback(async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/canada/express-entry/latest-draws');
      
      if (!response.ok) {
        throw new Error('Failed to fetch latest draws');
      }
      
      const data = await response.json();
      return data.draws;
    } catch (error) {
      console.error('Error fetching latest draws:', error);
      throw error;
    }
  }, []);

  const saveProfile = useCallback(async (profile: ExpressEntryProfile): Promise<ExpressEntryProfile> => {
    try {
      const response = await fetch('/api/canada/express-entry/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      
      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }, []);

  const getProvincialPrograms = useCallback(async (province: CanadianProvince): Promise<PNPProgram[]> => {
    try {
      const response = await fetch(`/api/canada/pnp/programs/${province}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch provincial programs');
      }
      
      const data = await response.json();
      return data.programs;
    } catch (error) {
      console.error('Error fetching provincial programs:', error);
      throw error;
    }
  }, []);
  
  // AI-enhanced methods
  const analyzeDocument = useCallback(async (documentId: string): Promise<AIDocumentAnalysis> => {
    try {
      // First try to call the backend API
      const response = await fetch(`/api/canada/ai/document-analysis/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.analysis;
      }
      
      // If backend API fails or isn't available, use client-side OpenAI
      console.warn('Backend API unavailable for document analysis, falling back to client-side processing');
      
      // Fetch the document data first
      const docResponse = await fetch(`/api/canada/documents/${documentId}`);
      
      if (!docResponse.ok) {
        throw new Error('Failed to fetch document data');
      }
      
      const docData = await docResponse.json();
      const document = docData.document;
      
      // Use OpenAI client-side if available
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        // This is a simplified example - in a real app, you'd use the OpenAI SDK
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert assistant for Canadian immigration document analysis.'
              },
              {
                role: 'user',
                content: `Analyze this immigration document: ${JSON.stringify(document)}`
              }
            ]
          })
        });
        
        if (!openaiResponse.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const aiResult = await openaiResponse.json();
        
        // Parse the AI response and format it as AIDocumentAnalysis
        // This is a simplified example - in a real app, you'd use proper parsing
        const analysis: AIDocumentAnalysis = {
          documentId,
          documentType: document.documentType,
          confidence: 0.85,
          reasoning: aiResult.choices[0].message.content,
          isComplete: true,
          extractedData: {},
          suggestedActions: ['Verify expiration date', 'Check for missing signatures']
        };
        
        return analysis;
      }
      
      // Fallback to basic analysis if OpenAI is not available
      return {
        documentId,
        documentType: document.documentType,
        confidence: 0.5,
        reasoning: 'Basic analysis performed without AI assistance',
        isComplete: document.status === 'Approved',
        suggestedActions: ['Consult an immigration specialist for detailed analysis'],
        potentialIssues: ['Unable to perform AI analysis']
      };
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }, []);

  const assessEligibility = useCallback(async (
    profile: ExpressEntryProfile, 
    programId: string
  ): Promise<AIEligibilityResult> => {
    try {
      // First try to call the backend API
      const response = await fetch('/api/canada/ai/eligibility-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, programId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.assessment;
      }
      
      // If backend API fails or isn't available, use client-side OpenAI
      console.warn('Backend API unavailable for eligibility assessment, falling back to client-side processing');
      
      // Fetch the program data first
      const programResponse = await fetch(`/api/canada/programs/${programId}`);
      
      if (!programResponse.ok) {
        throw new Error('Failed to fetch program data');
      }
      
      const programData = await programResponse.json();
      const program = programData.program;
      
      // Use OpenAI client-side if available
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        // This is a simplified example - in a real app, you'd use the OpenAI SDK
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert assistant for Canadian immigration eligibility assessment.'
              },
              {
                role: 'user',
                content: `Assess eligibility for this profile: ${JSON.stringify(profile)} against this program: ${JSON.stringify(program)}`
              }
            ]
          })
        });
        
        if (!openaiResponse.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const aiResult = await openaiResponse.json();
        
        // Parse the AI response and format it as AIEligibilityResult
        // This is a simplified example - in a real app, you'd use proper parsing
        const assessment: AIEligibilityResult = {
          profileId: profile.id,
          programId,
          isEligible: true, // This would be determined by AI analysis
          confidence: 0.85,
          reasoning: aiResult.choices[0].message.content,
          factorScores: [
            { factor: 'Age', score: 25, maxScore: 30, impact: 'High' },
            { factor: 'Education', score: 20, maxScore: 25, impact: 'Medium' },
            { factor: 'Language', score: 22, maxScore: 28, impact: 'High' }
          ],
          overallScore: 67,
          thresholdScore: 65
        };
        
        return assessment;
      }
      
      // Fallback to basic assessment if OpenAI is not available
      return {
        profileId: profile.id,
        programId,
        isEligible: profile.age >= 20 && profile.age <= 45, // Simplified logic
        confidence: 0.5,
        reasoning: 'Basic assessment performed without AI assistance',
        factorScores: [
          { factor: 'Age', score: 15, maxScore: 30, impact: 'High' },
          { factor: 'Education', score: 15, maxScore: 25, impact: 'Medium' },
          { factor: 'Language', score: 12, maxScore: 28, impact: 'High' }
        ],
        overallScore: 42,
        thresholdScore: 65,
        suggestedActions: ['Consult an immigration specialist for detailed assessment']
      };
    } catch (error) {
      console.error('Error assessing eligibility:', error);
      throw error;
    }
  }, []);

  const getRecommendations = useCallback(async (
    profile: ExpressEntryProfile
  ): Promise<AIRecommendation[]> => {
    try {
      // First try to call the backend API
      const response = await fetch('/api/canada/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.recommendations;
      }
      
      // If backend API fails or isn't available, use client-side OpenAI
      console.warn('Backend API unavailable for recommendations, falling back to client-side processing');
      
      // Use OpenAI client-side if available
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        // This is a simplified example - in a real app, you'd use the OpenAI SDK
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert assistant for Canadian immigration recommendations.'
              },
              {
                role: 'user',
                content: `Generate personalized immigration recommendations for this profile: ${JSON.stringify(profile)}`
              }
            ]
          })
        });
        
        if (!openaiResponse.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const aiResult = await openaiResponse.json();
        
        // Parse the AI response and format it as recommendations
        // This is a simplified example - in a real app, you'd use proper parsing
        const recommendations: AIRecommendation[] = [
          {
            id: '1',
            title: 'Improve language scores',
            description: 'Retake the IELTS exam to achieve higher CLB scores',
            impact: 'High',
            effort: 'Medium',
            timeframe: 'Short-term',
            relevantFactors: ['Language proficiency'],
            potentialBenefit: '+20 CRS points',
            confidence: 0.9
          },
          {
            id: '2',
            title: 'Gain Canadian work experience',
            description: 'Apply for a PGWP or work permit to gain Canadian work experience',
            impact: 'High',
            effort: 'High',
            timeframe: 'Long-term',
            relevantFactors: ['Canadian work experience'],
            potentialBenefit: '+50 CRS points',
            confidence: 0.8
          }
        ];
        
        return recommendations;
      }
      
      // Fallback to basic recommendations if OpenAI is not available
      return [
        {
          id: '1',
          title: 'Improve language scores',
          description: 'Higher language scores can significantly increase your CRS points',
          impact: 'High',
          effort: 'Medium',
          timeframe: 'Short-term',
          relevantFactors: ['Language proficiency'],
          potentialBenefit: 'Increased CRS score',
          confidence: 0.7
        },
        {
          id: '2',
          title: 'Consider provincial programs',
          description: 'Some provincial programs may have lower requirements',
          impact: 'Medium',
          effort: 'Medium',
          timeframe: 'Medium-term',
          relevantFactors: ['Provincial eligibility'],
          potentialBenefit: 'Alternative immigration pathway',
          confidence: 0.6
        }
      ];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }, []);

  const getRegionalTrends = useCallback(async (
    province: CanadianProvince
  ): Promise<RegionalTrendData[]> => {
    try {
      const response = await fetch(`/api/canada/trends/${province}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch regional trends');
      }
      
      const data = await response.json();
      return data.trends;
    } catch (error) {
      console.error('Error fetching regional trends:', error);
      throw error;
    }
  }, []);

  const getTrendPredictions = useCallback(async (
    province: CanadianProvince
  ): Promise<AITrendPrediction> => {
    try {
      // First try to call the backend API
      const response = await fetch(`/api/canada/ai/trend-predictions/${province}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.prediction;
      }
      
      // If backend API fails or isn't available, use client-side OpenAI
      console.warn('Backend API unavailable for trend predictions, falling back to client-side processing');
      
      // Fetch historical trends first
      const trendsResponse = await fetch(`/api/canada/trends/${province}`);
      
      if (!trendsResponse.ok) {
        throw new Error('Failed to fetch historical trends');
      }
      
      const trendsData = await trendsResponse.json();
      const historicalTrends = trendsData.trends;
      
      // Use OpenAI client-side if available
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        // This is a simplified example - in a real app, you'd use the OpenAI SDK
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert assistant for Canadian immigration trend analysis.'
              },
              {
                role: 'user',
                content: `Predict future immigration trends for ${province} based on this historical data: ${JSON.stringify(historicalTrends)}`
              }
            ]
          })
        });
        
        if (!openaiResponse.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const aiResult = await openaiResponse.json();
        
        // Parse the AI response and format it as a trend prediction
        // This is a simplified example - in a real app, you'd use proper parsing
        const prediction: AITrendPrediction = {
          province,
          predictedPeriods: [
            {
              period: 'Q1 2024',
              predictedInvitations: 1200,
              predictedMinimumScore: 470,
              confidenceInterval: { lower: 1100, upper: 1300 }
            },
            {
              period: 'Q2 2024',
              predictedInvitations: 1300,
              predictedMinimumScore: 465,
              confidenceInterval: { lower: 1200, upper: 1400 }
            }
          ],
          growingOccupations: [
            {
              noc: '21234',
              title: 'Software Engineers',
              growthRate: 0.12,
              confidence: 0.85
            },
            {
              noc: '31303',
              title: 'Registered Nurses',
              growthRate: 0.09,
              confidence: 0.82
            }
          ],
          analysis: aiResult.choices[0].message.content,
          confidenceScore: 0.8,
          dataPoints: historicalTrends.length
        };
        
        return prediction;
      }
      
      // Fallback to basic prediction if OpenAI is not available
      return {
        province,
        predictedPeriods: [
          {
            period: 'Next Quarter',
            predictedInvitations: 1000,
            confidenceInterval: { lower: 900, upper: 1100 }
          }
        ],
        growingOccupations: [
          {
            noc: '00000',
            title: 'General Occupations',
            growthRate: 0.05,
            confidence: 0.5
          }
        ],
        analysis: 'Basic prediction based on historical trends. For more accurate predictions, please consult an immigration specialist.',
        confidenceScore: 0.5,
        dataPoints: historicalTrends.length
      };
    } catch (error) {
      console.error('Error getting trend predictions:', error);
      throw error;
    }
  }, []);
  
  const value = {
    calculateExpressEntryPoints,
    checkPnpEligibility,
    getDocumentChecklist,
    getCases,
    uploadDocument,
    getLatestDraws,
    saveProfile,
    getProvincialPrograms,
    
    // AI-enhanced methods
    analyzeDocument,
    assessEligibility,
    getRecommendations,
    getRegionalTrends,
    getTrendPredictions
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