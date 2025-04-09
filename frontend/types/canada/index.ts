// Common components export
export { default as CanadianFlag } from '../../components/canada/common/CanadianFlag';
export { default as ProvinceMap } from '../../components/canada/common/ProvinceMap';
export { default as RegionalTrends } from '../../components/canada/common/RegionalTrends';
export { default as DocumentAnalyzer } from '../../components/canada/common/DocumentAnalyzer';

// Express Entry components export
export { default as AIEligibilityAssessment } from '../../components/canada/express-entry/AIEligibilityAssessment';
export { default as AIRecommendationEngine } from '../../components/canada/express-entry/AIRecommendationEngine';

import { Education, WorkExperience, JobOfferDetails, AdaptabilityFactors, LanguageProficiency } from './job-types';
export type { Education, WorkExperience, JobOfferDetails, AdaptabilityFactors, LanguageProficiency } from './job-types';

// Type definitions for Canadian immigration system

// Enums
export enum CanadianProvince {
  Alberta = 'Alberta',
  BritishColumbia = 'British Columbia',
  Manitoba = 'Manitoba',
  NewBrunswick = 'New Brunswick',
  NewfoundlandAndLabrador = 'Newfoundland and Labrador',
  NorthwestTerritories = 'Northwest Territories',
  NovaScotia = 'Nova Scotia',
  Nunavut = 'Nunavut',
  Ontario = 'Ontario',
  PrinceEdwardIsland = 'Prince Edward Island',
  Quebec = 'Quebec',
  Saskatchewan = 'Saskatchewan',
  Yukon = 'Yukon'
}

export enum CLBLevel {
  Level4 = '4',
  Level5 = '5',
  Level6 = '6',
  Level7 = '7',
  Level8 = '8',
  Level9 = '9',
  Level10 = '10',
  Level11 = '11',
  Level12 = '12'
}

export type DocumentType = 
  | 'Passport'
  | 'Language Test'
  | 'Educational Credential'
  | 'Work Experience'
  | 'Police Check'
  | 'Medical Exam'
  | 'Marriage Certificate'
  | 'Birth Certificate'
  | 'Proof of Funds'
  | 'Photo'
  | 'Other';

// Core interfaces
export interface ExpressEntryProfile {
  id?: string;
  _id?: string;
  age: number;
  maritalStatus?: 'single' | 'married' | 'commonLaw' | 'divorced' | 'separated' | 'widowed';
  education?: Education[];
  languageProficiency?: LanguageProficiency[];
  workExperience?: WorkExperience[];
  hasProvincialNomination?: boolean;
  hasJobOffer?: boolean;
  jobOfferDetails?: JobOfferDetails;
  adaptabilityFactors?: AdaptabilityFactors;
  
  educationLevel?: string;
  firstLanguageCLB?: string;
  secondLanguageCLB?: string;
  canadianWorkExperience?: number; // in months
  foreignWorkExperience?: number; // in months
  certificateOfQualification?: boolean;
  provincialNomination?: boolean;
  arrangedEmployment?: boolean;
  siblings?: boolean;
  spouse?: {
    educationLevel?: string;
    firstLanguageCLB?: string;
    canadianWorkExperience?: number;
  };
  crsScore?: number;
}

export interface PNPProgram {
  id: string;
  name: string;
  province: CanadianProvince | string;
  targetOccupations?: string[];
  minimumCLB?: string;
  minimumEducation?: string;
  minimumWorkExperience?: number;
  requiresJobOffer?: boolean;
  requiresProvincialConnection?: boolean;
  applicationFee?: number;
  processingTime?: string;
  annualIntakes?: number;
  description: string;
  eligibilityCriteria: string[];
  website: string;
}

export interface DocumentSubmission {
  id: string;
  documentType: DocumentType | string;
  fileName: string;
  fileSize: number;
  uploadDate: string; // ISO string format
  expiryDate?: string; // ISO string format
  status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Review';
  notes?: string;
  fileUrl: string;
}

export interface CanadianCase {
  id: string;
  clientId: string;
  consultantId: string;
  program: 'Express Entry' | 'PNP' | 'Family Sponsorship' | 'Study Permit' | 'Work Permit' | 'Other';
  province?: CanadianProvince | string;
  specificProgram?: string;
  status: 'Draft' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected' | 'On Hold';
  startDate: string;
  submissionDate?: string;
  decisionDate?: string;
  documents: DocumentSubmission[];
  notes: string[];
  timeline: {
    date: string;
    event: string;
    details?: string;
  }[];
}

// AI-specific interfaces
export interface AIAnalysisResult {
  confidence: number; // 0-1 value
  reasoning: string;
  suggestedActions?: string[];
  riskFactors?: string[];
}

export interface AIDocumentAnalysis extends AIAnalysisResult {
  documentId: string;
  documentType: DocumentType | string;
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
  province: CanadianProvince | string;
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
  province: CanadianProvince | string;
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
