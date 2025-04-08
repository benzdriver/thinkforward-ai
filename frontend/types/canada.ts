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