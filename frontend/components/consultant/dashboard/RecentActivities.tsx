import { useTranslation } from 'next-i18next';
import { formatDistanceToNow } from 'date-fns';
import { getDateLocale } from '@/utils/i18n';
import { 
  DocumentIcon, 
  ClipboardIcon, 
  ChatBubbleLeftIcon, 
  BellIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'document_upload' | 'form_submit' | 'client_message' | 'system_update';
  clientId?: string;
  clientName?: string;
  description: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const { t, i18n } = useTranslation('consultant');
  
  const dateLocale = getDateLocale(i18n.language);
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'document_upload':
        return <div className="rounded-full bg-blue-100 p-2"><DocumentIcon className="h-5 w-5 text-blue-600" /></div>;
      case 'form_submit':
        return <div className="rounded-full bg-green-100 p-2"><ClipboardIcon className="h-5 w-5 text-green-600" /></div>;
      case 'client_message':
        return <div className="rounded-full bg-purple-100 p-2"><ChatBubbleLeftIcon className="h-5 w-5 text-purple-600" /></div>;
      case 'system_update':
        return <div className="rounded-full bg-yellow-100 p-2"><BellIcon className="h-5 w-5 text-yellow-600" /></div>;
      default:
        return <div className="rounded-full bg-gray-100 p-2"><CircleStackIcon className="h-5 w-5 text-gray-600" /></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t('dashboard.recent_activities')}
      </h2>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('dashboard.no_recent_activities')}
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="py-4 flex">
              {getActivityIcon(activity.type)}
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                {activity.clientName && (
                  <p className="text-sm text-gray-500">
                    {t('dashboard.client')}: {activity.clientName}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { 
                    addSuffix: true,
                    locale: dateLocale
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {activities.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t('dashboard.view_all_activities')}
          </button>
        </div>
      )}
    </div>
  );
} 