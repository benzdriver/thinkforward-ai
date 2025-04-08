import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import type { CanadianCase } from '../../../types/canada';

interface CanadianCaseManagerProps {
  onCaseSelect?: (caseId: string) => void;
  className?: string;
}

export const CanadianCaseManager: React.FC<CanadianCaseManagerProps> = ({ 
  onCaseSelect,
  className = '' 
}) => {
  const { t } = useTranslation(['consultant', 'common']);
  const { getCases } = useCanadianImmigration();
  const [cases, setCases] = useState<CanadianCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, this would call the backend API
        // For now, we'll use dummy data
        setTimeout(() => {
          const dummyCases: CanadianCase[] = [
            {
              caseId: 'CA-2023-0001',
              clientId: 'CL-2023-0001',
              consultantId: 'CON-001',
              immigrationProgram: 'expressEntry',
              currentStage: 'submitted',
              timeline: [
                {
                  date: new Date('2023-01-10'),
                  stage: 'draft',
                  description: 'Profile created',
                  actor: 'Consultant'
                },
                {
                  date: new Date('2023-01-15'),
                  stage: 'submitted',
                  description: 'Profile submitted to Express Entry pool',
                  actor: 'Consultant'
                }
              ],
              documents: [
                {
                  userId: 'CL-2023-0001',
                  applicationId: 'CA-2023-0001',
                  documentType: 'passport',
                  fileUrl: '/documents/passport.pdf',
                  uploadDate: new Date('2023-01-05'),
                  validationStatus: 'valid'
                },
                {
                  userId: 'CL-2023-0001',
                  applicationId: 'CA-2023-0001',
                  documentType: 'languageTest',
                  fileUrl: '/documents/language.pdf',
                  uploadDate: new Date('2023-01-05'),
                  validationStatus: 'valid'
                }
              ],
              notes: [
                {
                  date: new Date('2023-01-05'),
                  author: 'Consultant',
                  content: 'Reviewed application',
                  isPrivate: true
                }
              ],
              fees: {
                governmentFees: {
                  applicationFee: 1325,
                  rightOfPermanentResidenceFee: 500,
                  biometricsFee: 85,
                  otherFees: []
                },
                consultantFees: {
                  baseFee: 3000,
                  optionalServices: [],
                  paymentSchedule: [
                    {
                      date: new Date('2022-12-20'),
                      amount: 1500,
                      description: 'Initial payment'
                    },
                    {
                      date: new Date('2023-02-20'),
                      amount: 1500,
                      description: 'Final payment'
                    }
                  ]
                },
                totalPaid: 1500,
                totalDue: 1500
              },
              nextSteps: [
                {
                  title: 'Wait for Express Entry draw',
                  description: 'Monitor Express Entry draws for invitations',
                  dueDate: new Date('2023-02-15'),
                  assignedTo: 'Consultant',
                  status: 'pending',
                  priority: 'medium'
                }
              ]
            },
            {
              caseId: 'CA-2023-0002',
              clientId: 'CL-2023-0002',
              consultantId: 'CON-001',
              immigrationProgram: 'pnp',
              currentStage: 'approved',
              timeline: [
                {
                  date: new Date('2022-10-10'),
                  stage: 'draft',
                  description: 'PNP application created',
                  actor: 'Consultant'
                },
                {
                  date: new Date('2022-10-15'),
                  stage: 'submitted',
                  description: 'PNP application submitted',
                  actor: 'Consultant'
                },
                {
                  date: new Date('2022-12-20'),
                  stage: 'approved',
                  description: 'PNP nomination certificate issued',
                  actor: 'Provincial government'
                }
              ],
              documents: [
                {
                  userId: 'CL-2023-0002',
                  applicationId: 'CA-2023-0002',
                  documentType: 'passport',
                  fileUrl: '/documents/passport.pdf',
                  uploadDate: new Date('2022-10-05'),
                  validationStatus: 'valid'
                }
              ],
              notes: [
                {
                  date: new Date('2022-12-20'),
                  author: 'Consultant',
                  content: 'PNP nomination received',
                  isPrivate: false
                }
              ],
              fees: {
                governmentFees: {
                  applicationFee: 1500,
                  rightOfPermanentResidenceFee: 500,
                  biometricsFee: 85,
                  otherFees: [
                    {
                      name: 'Provincial application fee',
                      amount: 300
                    }
                  ]
                },
                consultantFees: {
                  baseFee: 3500,
                  optionalServices: [],
                  paymentSchedule: [
                    {
                      date: new Date('2022-09-20'),
                      amount: 1750,
                      description: 'Initial payment'
                    },
                    {
                      date: new Date('2022-12-20'),
                      amount: 1750,
                      description: 'Final payment'
                    }
                  ]
                },
                totalPaid: 3500,
                totalDue: 0
              },
              nextSteps: [
                {
                  title: 'Submit Express Entry profile',
                  description: 'Create Express Entry profile with PNP nomination',
                  dueDate: new Date('2023-01-20'),
                  assignedTo: 'Consultant',
                  status: 'inProgress',
                  priority: 'high'
                }
              ]
            }
          ];
          
          setCases(dummyCases);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    fetchCases();
  }, [getCases]);

  const handleCaseClick = (caseId: string) => {
    if (onCaseSelect) {
      onCaseSelect(caseId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'invited':
        return 'bg-purple-100 text-purple-800';
      case 'applied':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgramTranslation = (program: string) => {
    const programMap: Record<string, string> = {
      'expressEntry': 'Express Entry',
      'pnp': 'Provincial Nominee Program',
      'familySponsorship': 'Family Sponsorship',
      'businessImmigration': 'Business Immigration',
      'refugeeAsylum': 'Refugee/Asylum',
      'temporaryResidence': 'Temporary Residence'
    };
    
    return programMap[program] || program;
  };

  if (loading) {
    return (
      <div className={`canadian-case-manager ${className} p-4 flex justify-center items-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">{t('common:loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`canadian-case-manager ${className} p-4`}>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p className="font-medium">{t('errors.failedToLoadCases', { ns: 'consultant' })}</p>
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
    <div className={`canadian-case-manager ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('caseManager.title', { ns: 'consultant' })}</h2>
      
      {cases.length === 0 ? (
        <div className="empty-state p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-4">{t('caseManager.noCases', { ns: 'consultant' })}</p>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
            {t('caseManager.createCase', { ns: 'consultant' })}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('caseManager.caseId', { ns: 'consultant' })}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('caseManager.client', { ns: 'consultant' })}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('caseManager.program', { ns: 'consultant' })}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('caseManager.status', { ns: 'consultant' })}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('caseManager.lastUpdated', { ns: 'consultant' })}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common:actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem.caseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {caseItem.caseId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.clientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getProgramTranslation(caseItem.immigrationProgram)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.currentStage)}`}>
                      {t(`status.${caseItem.currentStage}`, { ns: 'consultant' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(caseItem.timeline[caseItem.timeline.length - 1].date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleCaseClick(caseItem.caseId)}
                      className="text-primary hover:text-primary-dark"
                    >
                      {t('common:view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CanadianCaseManager; 