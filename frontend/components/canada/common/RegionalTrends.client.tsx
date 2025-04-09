import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import type { CanadianProvince } from '../../../types/canada';

const ResponsiveContainer = dynamic(() => import('recharts/lib/component/ResponsiveContainer'), { ssr: false });
const LineChart = dynamic(() => import('recharts/lib/chart/LineChart'), { ssr: false });
const Line = dynamic(() => import('recharts/lib/cartesian/Line'), { ssr: false });
const XAxis = dynamic(() => import('recharts/lib/cartesian/XAxis'), { ssr: false });
const YAxis = dynamic(() => import('recharts/lib/cartesian/YAxis'), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts/lib/cartesian/CartesianGrid'), { ssr: false });
const Tooltip = dynamic(() => import('recharts/lib/component/Tooltip'), { ssr: false });
const Legend = dynamic(() => import('recharts/lib/component/Legend'), { ssr: false });
const BarChart = dynamic(() => import('recharts/lib/chart/BarChart'), { ssr: false });
const Bar = dynamic(() => import('recharts/lib/cartesian/Bar'), { ssr: false });
const PieChart = dynamic(() => import('recharts/lib/chart/PieChart'), { ssr: false });
const Pie = dynamic(() => import('recharts/lib/polar/Pie'), { ssr: false });
const Cell = dynamic(() => import('recharts/lib/component/Cell'), { ssr: false });

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface RegionalTrendsProps {
  province?: string;
  showProjections?: boolean;
  showOccupations?: boolean;
  className?: string;
  showHistorical?: boolean;
}

/**
 * RegionalTrends组件 - Client-side only version
 * 显示特定省份的移民趋势数据，包括分数趋势、邀请趋势和职业分布
 */
export function RegionalTrendsClient({
  province = 'Ontario',
  showProjections = true,
  showOccupations = true,
  className = '',
  showHistorical = true
}: RegionalTrendsProps) {
  const { t } = useTranslation(['provincial-programs', 'common']);
  const { getRegionalTrends } = useCanadianImmigration();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [scoreData, setScoreData] = useState<any[]>([]);
  const [invitationData, setInvitationData] = useState<any[]>([]);
  const [occupationData, setOccupationData] = useState<any[]>([]);
  
  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const trendsData = await getRegionalTrends(province as CanadianProvince);
      setTrends(() => trendsData);
      
      if (showOccupations && trendsData.length > 0) {
        const occupationCounts: Record<string, number> = {};
        
        trendsData.forEach(trend => {
          if (trend.topOccupations) {
            trend.topOccupations.forEach((occupation) => {
              const title = occupation.title;
              if (occupationCounts[title]) {
                occupationCounts[title] += occupation.count;
              } else {
                occupationCounts[title] = occupation.count;
              }
            });
          } else if ((trend as any).targetOccupations) {
            (trend as any).targetOccupations.forEach((occupation: string) => {
              if (occupationCounts[occupation]) {
                occupationCounts[occupation] += 1;
              } else {
                occupationCounts[occupation] = 1;
              }
            });
          }
        });
        
        const processedData = Object.entries(occupationCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        setOccupationData(processedData);
      }
      
      const processedScoreData = trendsData.map(trend => ({
        period: trend.period,
        minimumScore: trend.minimumScore,
        projectedScore: showProjections ? (trend as any).projectedMinimumScore : undefined
      }));
      
      setScoreData(processedScoreData);
      
      const processedInvitationData = trendsData.map(trend => ({
        period: trend.period,
        invitations: (trend as any).invitationCount || trend.invitations,
        growthRate: trend.growthRate
      }));
      
      setInvitationData(processedInvitationData);
    } catch (error) {
      console.error('Error fetching regional trends:', error);
      setError(t('common:errors.failed_to_load_data'));
    } finally {
      setLoading(false);
    }
  }, [getRegionalTrends, province, showProjections, showOccupations, t]);
  
  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);
  
  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">{t('common:loading')}</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`bg-red-50 text-red-600 p-4 rounded-lg ${className}`}>
        <p>{error}</p>
        <button 
          onClick={fetchTrends}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          {t('common:retry')}
        </button>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">
        {t('provincial-programs:regional_trends_for', { province })}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 分数趋势图表 */}
        {showHistorical && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">{t('provincial-programs:minimum_score_trends')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={scoreData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="minimumScore"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  {showProjections && (
                    <Line
                      type="monotone"
                      dataKey="projectedScore"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* 邀请趋势图表 */}
        {showHistorical && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">{t('provincial-programs:invitation_trends')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={invitationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="invitations"
                    fill="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="growthRate"
                    stroke="#ff7300"
                    yAxisId={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* 职业分布图表 */}
        {showOccupations && occupationData.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
            <h3 className="text-lg font-medium mb-2">{t('provincial-programs:target_occupations')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupationData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {occupationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>{t('provincial-programs:data_disclaimer')}</p>
      </div>
    </div>
  );
}

export default RegionalTrendsClient;
