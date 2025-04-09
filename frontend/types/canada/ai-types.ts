
export interface AIAnalysisResult {
  confidence: number; // 0-1 value
  reasoning: string;
  suggestedActions?: string[];
  riskFactors?: string[];
}

export interface AIDocumentAnalysis extends AIAnalysisResult {
  documentId: string;
  documentType: string;
  isComplete: boolean;
  missingInformation?: string[];
  extractedData?: Record<string, unknown>;
  potentialIssues?: string[];
}

export interface AIEligibilityResult extends AIAnalysisResult {
  profileId: string;
  programId: string;
  isEligible: boolean;
  factorScores: {
    factor: string;
    score: number;
    maxScore: number;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  overallScore: number;
  thresholdScore: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  timeframe: 'Immediate' | 'Short-term' | 'Long-term';
  relevantFactors: string[];
  potentialBenefit: string;
  confidence: number; // 0-1 value
}

export interface RegionalTrendData {
  province: string;
  period: string;
  invitations: number;
  minimumScore?: number;
  topOccupations: {
    noc: string;
    title: string;
    count: number;
  }[];
  growthRate: number;
}

export interface AITrendPrediction {
  province: string;
  predictedPeriods: {
    period: string;
    predictedInvitations: number;
    predictedMinimumScore?: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  }[];
  growingOccupations: {
    noc: string;
    title: string;
    growthRate: number;
    confidence: number;
  }[];
  analysis: string;
  confidenceScore: number;
  dataPoints: number;
}
