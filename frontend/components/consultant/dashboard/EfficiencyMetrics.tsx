import { useTranslation } from 'next-i18next';
import { ClockIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

interface EfficiencyMetricsProps {
  timesSaved: number; // in minutes
  casesCompleted: number;
}

export default function EfficiencyMetrics({ timesSaved, casesCompleted }: EfficiencyMetricsProps) {
  const { t } = useTranslation('consultant');
  
  // Convert minutes to hours and minutes
  const hours = Math.floor(timesSaved / 60);
  const minutes = timesSaved % 60;
  
  const timeDisplay = hours > 0 
    ? t('dashboard.hours_minutes', { hours, minutes }) 
    : t('dashboard.minutes', { minutes });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t('dashboard.efficiency_metrics')}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 flex items-center">
          <ClockIcon className="h-10 w-10 text-purple-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.time_saved')}</p>
            <p className="text-2xl font-bold text-gray-800">{timeDisplay}</p>
          </div>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
          <DocumentCheckIcon className="h-10 w-10 text-indigo-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.cases_completed')}</p>
            <p className="text-2xl font-bold text-gray-800">{casesCompleted}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          {t('dashboard.efficiency_insight')}
        </p>
      </div>
    </div>
  );
} 