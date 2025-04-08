import { useState } from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { CanadianImmigrationProvider } from '../../contexts/CanadianImmigrationContext';
import { RegionalTrends, DocumentAnalyzer } from '../../components/canada/common';
import { AIEligibilityAssessment, AIRecommendationEngine } from '../../components/canada/express-entry';
import type { ExpressEntryProfile, DocumentSubmission } from '../../types/canada';

const AIFeaturesPage: NextPage = () => {
  const { t } = useTranslation(['common', 'express-entry', 'provincial-programs']);
  const [activeTab, setActiveTab] = useState<'trends' | 'eligibility' | 'recommendations' | 'documents'>('trends');

  // Mock data for demonstration
  const mockProfile: ExpressEntryProfile = {
    id: 'mock-profile-1',
    age: 32,
    educationLevel: "Master's Degree",
    firstLanguageCLB: '9',
    canadianWorkExperience: 12,
    foreignWorkExperience: 60,
    certificateOfQualification: false,
    provincialNomination: false,
    arrangedEmployment: false,
    siblings: true,
    spouse: {
      educationLevel: "Bachelor's Degree",
      firstLanguageCLB: '8',
      canadianWorkExperience: 0
    },
    crsScore: 478
  };

  const mockDocument: DocumentSubmission = {
    id: 'mock-doc-1',
    documentType: 'Language Test',
    fileName: 'IELTS_Results.pdf',
    fileSize: 2500000,
    uploadDate: '2024-03-15',
    expiryDate: '2026-03-15',
    status: 'Pending',
    fileUrl: 'https://example.com/mock-document.pdf'
  };

  return (
    <CanadianImmigrationProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('express-entry:ai_features')}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <p className="mb-4">{t('express-entry:ai_features_description')}</p>
          
          <div className="flex flex-wrap mb-4 border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'trends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('trends')}
            >
              {t('provincial-programs:regional_trends')}
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'eligibility' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('eligibility')}
            >
              {t('express-entry:eligibility_assessment')}
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('recommendations')}
            >
              {t('express-entry:recommendations')}
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('documents')}
            >
              {t('express-entry:document_analysis')}
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          {activeTab === 'trends' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('provincial-programs:ai_powered_regional_trends')}</h2>
              <p className="mb-4">{t('provincial-programs:regional_trends_description')}</p>
              <RegionalTrends province="Ontario" className="mt-6" />
            </div>
          )}
          
          {activeTab === 'eligibility' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('express-entry:ai_eligibility_assessment')}</h2>
              <p className="mb-4">{t('express-entry:eligibility_assessment_description')}</p>
              <AIEligibilityAssessment profile={mockProfile} programId="express-entry" className="mt-6" />
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('express-entry:ai_personalized_recommendations')}</h2>
              <p className="mb-4">{t('express-entry:recommendations_description')}</p>
              <AIRecommendationEngine profile={mockProfile} className="mt-6" />
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('express-entry:ai_document_analysis')}</h2>
              <p className="mb-4">{t('express-entry:document_analysis_description')}</p>
              <DocumentAnalyzer document={mockDocument} className="mt-6" />
            </div>
          )}
        </div>
      </div>
    </CanadianImmigrationProvider>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'express-entry', 'provincial-programs', 'documents'])),
    },
  };
};

export default AIFeaturesPage; 