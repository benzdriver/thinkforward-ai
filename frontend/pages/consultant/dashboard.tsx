// Page: /consultant/dashboard - 顾问专用控制台页面
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { function as ConsultantLayout } from '@/components/layout/ConsultantLayout';
import { function as ClientSummary } from '@/components/consultant/dashboard/ClientSummary';
import { function as EfficiencyMetrics } from '@/components/consultant/dashboard/EfficiencyMetrics';
import { function as RecentActivities } from '@/components/consultant/dashboard/RecentActivities';
import { function as TasksList } from '@/components/consultant/dashboard/TasksList';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import PageHeader from '@/components/ui/PageHeader';
import { DashboardData } from '@/types/consultant';

export function ConsultantDashboard() {
  const { t } = useTranslation('consultant');
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not a consultant
    if (!authLoading && user && user.role !== 'CONSULTANT') {
      router.push('/dashboard');
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/consultant/dashboard');
        
        if (!response.ok) {
          throw new Error(t('dashboard.error_fetching') as string);
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, router, t]);

  if (authLoading || isLoading) {
    return <LoadingScreen message={t('dashboard.loading') as string} />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <ConsultantLayout>
      <div className="p-6">
        <PageHeader
          title={t('dashboard.welcome_message', { name: user?.firstName || t('dashboard.consultant') })}
          subtitle={t('dashboard.overview_subtitle')}
          alignment="left"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ClientSummary 
            totalClients={dashboardData?.statistics.totalClients || 0} 
            activeClients={dashboardData?.statistics.activeClients || 0} 
          />
          <EfficiencyMetrics 
            timesSaved={dashboardData?.statistics.timesSaved || 0} 
            casesCompleted={dashboardData?.statistics.casesCompleted || 0} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities activities={dashboardData?.recentActivities || []} />
          <TasksList tasks={dashboardData?.pendingTasks || []} />
        </div>
      </div>
    </ConsultantLayout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'consultant'])),
    },
  };
}
