import { useTranslation } from 'next-i18next';
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';

interface ClientSummaryProps {
  totalClients: number;
  activeClients: number;
}

export default function ClientSummary({ totalClients, activeClients }: ClientSummaryProps) {
  const { t } = useTranslation('consultant');
  
  const activePercentage = totalClients > 0 
    ? Math.round((activeClients / totalClients) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t('dashboard.client_summary')}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <UserGroupIcon className="h-10 w-10 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.total_clients')}</p>
            <p className="text-2xl font-bold text-gray-800">{totalClients}</p>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 flex items-center">
          <UserIcon className="h-10 w-10 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.active_clients')}</p>
            <p className="text-2xl font-bold text-gray-800">{activeClients}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {t('dashboard.active_rate')}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {activePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${activePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 