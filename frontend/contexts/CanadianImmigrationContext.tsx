import React, { createContext, useContext, useState, useCallback } from 'react';
import type { 
  ExpressEntryProfile, 
  PNPProgram, 
  CanadianProvince, 
  CLBLevel,
  CanadianCase,
  DocumentSubmission,
  DocumentType 
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
  
  const value = {
    calculateExpressEntryPoints,
    checkPnpEligibility,
    getDocumentChecklist,
    getCases,
    uploadDocument,
    getLatestDraws,
    saveProfile,
    getProvincialPrograms
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