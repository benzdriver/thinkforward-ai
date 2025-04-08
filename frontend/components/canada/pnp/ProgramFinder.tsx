import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import { CanadianProvince, PNPProgram } from '../../../types/canada';

interface ProgramFinderProps {
  province: CanadianProvince;
  className?: string;
  onProgramSelect?: (program: PNPProgram) => void;
}

export const ProgramFinder: React.FC<ProgramFinderProps> = ({
  province,
  className = '',
  onProgramSelect
}) => {
  const { t } = useTranslation(['provincial-programs', 'common']);
  const { getProvincialPrograms } = useCanadianImmigration();
  const [programs, setPrograms] = useState<PNPProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<PNPProgram | null>(null);
  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedProgram(null);
        
        // In a real application, this would call the backend API
        // For now, we'll use dummy data
        setTimeout(() => {
          const dummyPrograms: PNPProgram[] = [
            {
              province,
              streamName: `${getProvinceName(province)} Skilled Worker Program`,
              eligibilityCriteria: [
                'Valid job offer from a provincial employer',
                'Minimum of 1 year work experience in a skilled occupation',
                'Language proficiency of CLB 7 or higher',
                'Minimum education of post-secondary diploma'
              ],
              processingTime: 180, // in days
              applicationFee: 1500,
              requiredDocuments: [
                'Valid passport',
                'Language test results',
                'Educational credentials assessment',
                'Proof of work experience',
                'Job offer letter'
              ],
              steps: [
                'Submit expression of interest',
                'Receive nomination invitation',
                'Submit complete application',
                'Receive provincial nomination',
                'Apply for permanent residence through Express Entry'
              ]
            },
            {
              province,
              streamName: `${getProvinceName(province)} International Graduate Stream`,
              eligibilityCriteria: [
                'Graduated from a recognized provincial institution',
                'Minimum of 2 years of study in the province',
                'Completed studies within the last 3 years',
                'Language proficiency of CLB 7 or higher',
                'Intent to live and work in the province'
              ],
              processingTime: 150, // in days
              applicationFee: 1200,
              requiredDocuments: [
                'Valid passport',
                'Language test results',
                'Post-secondary diploma/degree',
                'Transcripts',
                'Proof of provincial residence'
              ],
              steps: [
                'Submit expression of interest',
                'Receive nomination invitation',
                'Submit complete application',
                'Receive provincial nomination',
                'Apply for permanent residence through Express Entry'
              ]
            },
            {
              province,
              streamName: `${getProvinceName(province)} Entrepreneur Stream`,
              eligibilityCriteria: [
                'Minimum net worth of $500,000 CAD',
                'Business management experience of 3+ years',
                'Intent to establish or purchase a business in the province',
                'Minimum 33% ownership stake in the business',
                'Create at least 2 full-time jobs for Canadian citizens or PRs'
              ],
              processingTime: 240, // in days
              applicationFee: 2500,
              requiredDocuments: [
                'Valid passport',
                'Business plan',
                'Proof of net worth',
                'Business ownership documentation',
                'Resume detailing business experience'
              ],
              steps: [
                'Submit expression of interest',
                'Receive invitation to apply',
                'Submit complete application',
                'Attend interview',
                'Sign business performance agreement',
                'Receive work permit support letter',
                'Establish business in the province',
                'Apply for provincial nomination after meeting business commitments'
              ]
            }
          ];
          
          setPrograms(dummyPrograms);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };
    
    if (province) {
      fetchPrograms();
    }
  }, [province, getProvincialPrograms]);
  
  const getProvinceName = (provinceCode: CanadianProvince): string => {
    const provinceNames: Record<CanadianProvince, string> = {
      'AB': 'Alberta',
      'BC': 'British Columbia',
      'MB': 'Manitoba',
      'NB': 'New Brunswick',
      'NL': 'Newfoundland and Labrador',
      'NS': 'Nova Scotia',
      'NT': 'Northwest Territories',
      'NU': 'Nunavut',
      'ON': 'Ontario',
      'PE': 'Prince Edward Island',
      'QC': 'Quebec',
      'SK': 'Saskatchewan',
      'YT': 'Yukon'
    };
    
    return provinceNames[provinceCode];
  };
  
  const handleProgramClick = (program: PNPProgram) => {
    setSelectedProgram(program);
    if (onProgramSelect) {
      onProgramSelect(program);
    }
  };
  
  if (loading) {
    return (
      <div className={`program-finder ${className} p-4 flex justify-center items-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">{t('common:loading')}</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`program-finder ${className} p-4`}>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p className="font-medium">{t('provincial-programs:error.title')}</p>
          <p>{error}</p>
          <button 
            className="mt-2 text-red-700 underline"
            onClick={() => window.location.reload()}
          >
            {t('common:retry')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`program-finder ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {t('programFinder.title', { province: getProvinceName(province), ns: 'provincial-programs' })}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {t('programFinder.description', { province: getProvinceName(province), ns: 'provincial-programs' })}
      </p>
      
      {programs.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded">
          <p>{t('programFinder.noPrograms', { province: getProvinceName(province), ns: 'provincial-programs' })}</p>
        </div>
      ) : (
        <div className="grid gap-6 mb-6">
          {programs.map((program, index) => (
            <div 
              key={index}
              className={`border rounded-lg overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${
                selectedProgram === program ? 'border-primary' : 'border-gray-200'
              }`}
              onClick={() => handleProgramClick(program)}
            >
              <div className={`p-4 ${selectedProgram === program ? 'bg-primary-50' : 'bg-white'}`}>
                <h3 className="text-xl font-semibold text-gray-800">{program.streamName}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t('programFinder.processingTime', { count: program.processingTime, ns: 'provincial-programs' })}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t('programFinder.applicationFee', { fee: program.applicationFee, ns: 'provincial-programs' })}
                  </span>
                </div>
              </div>
              
              {selectedProgram === program && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {t('programFinder.eligibilityCriteria', { ns: 'provincial-programs' })}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {program.eligibilityCriteria.map((criterion, idx) => (
                        <li key={idx}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {t('programFinder.requiredDocuments', { ns: 'provincial-programs' })}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {program.requiredDocuments.map((document, idx) => (
                        <li key={idx}>{document}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {t('programFinder.applicationSteps', { ns: 'provincial-programs' })}
                    </h4>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                      {program.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramFinder; 