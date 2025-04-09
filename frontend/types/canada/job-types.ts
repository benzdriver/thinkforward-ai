
export interface Occupation {
  title: string;
  noc?: string;
  description?: string;
  skillLevel?: string;
  skillType?: string;
}

export interface JobOfferDetails {
  noc: string;
  title?: string;
  employer?: string;
  location?: string;
  salary?: number;
  isLMIAExempt?: boolean;
  isInNOCList?: boolean;
}

export interface WorkExperience {
  occupation: Occupation;
  employer: string;
  country: string;
  isCanadianExperience: boolean;
  startDate: Date;
  endDate?: Date;
  hoursPerWeek: number;
  description?: string;
  references?: {
    name: string;
    position: string;
    contact: string;
  }[];
}

export interface Education {
  level: 'highSchool' | 'oneYearDiploma' | 'twoYearDiploma' | 'bachelors' | 'twoOrMoreDegrees' | 'masters' | 'phd';
  institution?: string;
  country?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  hasECA?: boolean;
  ecaAuthority?: string;
  ecaDate?: Date;
}

export interface LanguageProficiency {
  language: 'english' | 'french';
  test: 'IELTS' | 'CELPIP' | 'TEF' | 'TCF';
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  testDate?: Date;
  expiryDate?: Date;
}

export interface AdaptabilityFactors {
  canadianEducation?: {
    has: boolean;
    level?: string;
    duration?: number;
  };
  canadianWorkExperience?: {
    has: boolean;
    duration?: number;
  };
  relativesInCanada?: {
    has: boolean;
    relationship?: 'sibling' | 'parent' | 'grandparent' | 'child' | 'aunt' | 'uncle';
    status?: 'citizen' | 'permanent_resident';
  };
  spouseLanguageProficiency?: {
    has: boolean;
    clbLevel?: number;
  };
  spouseEducation?: {
    has: boolean;
    level?: string;
  };
  spouseWorkExperience?: {
    has: boolean;
    duration?: number;
  };
}
