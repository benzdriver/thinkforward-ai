import { useState } from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { CanadianImmigrationProvider } from '../contexts/CanadianImmigrationContext';
import { RegionalTrends, DocumentAnalyzer } from '../components/canada/common';
import { ClientOnly } from '../components/canada/common/ClientOnly';
import { AIEligibilityAssessment, AIRecommendationEngine } from '../components/canada/express-entry';
import type { ExpressEntryProfile, DocumentSubmission, DocumentType } from '../types/canada';

const TestCanadianFeaturesPage: NextPage = () => {
  const { t } = useTranslation(['common', 'express-entry', 'provincial-programs']);
  const [activeTab, setActiveTab] = useState<'trends' | 'eligibility' | 'recommendations' | 'documents'>('trends');

  const mockProfile = {
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

  const mockDocument = {
    id: 'mock-doc-1',
    documentType: 'Language Test' as DocumentType,
    fileName: 'IELTS_Results.pdf',
    fileSize: 2500000,
    uploadDate: '2024-03-15',
    expiryDate: '2026-03-15',
    status: 'Pending' as 'Pending' | 'Approved' | 'Rejected' | 'Needs Review',
    fileUrl: 'https://example.com/mock-document.pdf'
  };

  return (
    <CanadianImmigrationProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Canadian Features</h1>
        <p className="mb-4 text-red-500">This is a test page that can be accessed without authentication</p>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <p className="mb-4">This page demonstrates the Canadian immigration features with mock data</p>
          
          <div className="flex flex-wrap mb-4 border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'trends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('trends')}
            >
              Regional Trends
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'eligibility' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('eligibility')}
            >
              Eligibility Assessment
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('recommendations')}
            >
              Recommendations
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('documents')}
            >
              Document Analysis
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          {activeTab === 'trends' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI-Powered Regional Trends</h2>
              <p className="mb-4">Analyze immigration trends across different Canadian provinces</p>
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Regional Trends for Ontario</h3>
                <p className="text-gray-600 mb-4">
                  This component displays immigration trends data for Ontario province, including minimum score trends, invitation counts, and target occupations.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700">
                    Charts are disabled in this test page to avoid hydration errors. In production, this would show interactive charts with recharts.
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium">Sample Data:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Minimum CRS Score: 470</li>
                    <li>Invitations Issued: 1,200</li>
                    <li>Top Occupations: Software Developers, Nurses, Financial Analysts</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'eligibility' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Eligibility Assessment</h2>
              <p className="mb-4">Check your eligibility for Canadian immigration programs</p>
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">AI Eligibility Assessment</h3>
                <p className="text-gray-600 mb-4">
                  This component assesses your eligibility for Express Entry based on your profile data.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-medium">Eligible for Express Entry</p>
                  <p className="mt-2">Confidence: 85%</p>
                  <p className="mt-2">Your CRS score of 478 is above the current minimum threshold.</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium">Key Factors:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Age: 32 (favorable)</li>
                    <li>Education: Master's Degree (favorable)</li>
                    <li>Language: CLB 9 (favorable)</li>
                    <li>Work Experience: 12 months Canadian + 60 months foreign (favorable)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Personalized Recommendations</h2>
              <p className="mb-4">Get personalized recommendations to improve your immigration chances</p>
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">AI Personalized Recommendations</h3>
                <p className="text-gray-600 mb-4">
                  This component provides personalized recommendations to improve your immigration chances.
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-blue-700">Improve Language Scores</h4>
                    <p className="mt-1 text-gray-600">Retake IELTS to achieve higher scores in all categories.</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">High Impact</span>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Medium Effort</span>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Short-term</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-blue-700">Apply for Provincial Nomination</h4>
                    <p className="mt-1 text-gray-600">Some provincial programs may have lower requirements.</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Medium Impact</span>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Medium Effort</span>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Short-term</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Document Analysis</h2>
              <p className="mb-4">Analyze your immigration documents for completeness and accuracy</p>
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">AI Document Analysis</h3>
                <p className="text-gray-600 mb-4">
                  This component analyzes your immigration documents for completeness and accuracy.
                </p>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">IELTS_Results.pdf</h4>
                      <p className="text-sm text-gray-500">Language Test • Uploaded on Mar 15, 2024</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                  </div>
                  
                  <div className="mt-4 bg-blue-50 p-3 rounded">
                    <h5 className="text-blue-700 font-medium">AI Analysis</h5>
                    <p className="mt-1">Document appears complete and valid. Confidence: 85%</p>
                    
                    <div className="mt-3">
                      <h6 className="text-sm font-medium">Extracted Data:</h6>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Document Type: Language Test</li>
                        <li>Status: Pending</li>
                        <li>Expiry Date: Mar 15, 2026</li>
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <h6 className="text-sm font-medium">Suggested Actions:</h6>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Verify document authenticity</li>
                        <li>Check expiration date</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
      ...(await serverSideTranslations(locale || 'en', ['common', 'express-entry', 'provincial-programs', 'documents'])),
    },
  };
};

export default TestCanadianFeaturesPage;
