import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';

const RegionalTrendsClient = dynamic(
  () => import('./RegionalTrends.client'),
  { ssr: false }
);

// 本地定义接口，避免从types导入
interface RegionalTrendData {
  province: string;
  period: string;
  invitations: number;
  minimumScore?: number;
  invitationCount?: number;
  projectedMinimumScore?: number;
  aiConfidence?: number;
  targetOccupations: Array<string>;
  growthRate: number;
}

interface RegionalTrendsProps {
  province?: string;
  className?: string;
  showHistorical?: boolean;
  showProjections?: boolean;
  showOccupations?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const RegionalTrends: React.FC<any> = (props) => {
  const { t } = useTranslation(['provincial-programs', 'common']);
  
  return (
    <ClientOnly fallback={
      <div className={`flex justify-center items-center h-64 ${props.className || ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">{t('common:loading')}</span>
      </div>
    }>
      <RegionalTrendsClient {...props} />
    </ClientOnly>
  );
};

export default RegionalTrends;
