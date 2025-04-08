import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCanadianImmigration } from '../../../contexts/CanadianImmigrationContext';
import type { CanadianProvince } from '../../../types/canada';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

export const RegionalTrends: React.FC<RegionalTrendsProps> = ({
  province = 'Ontario',
  className = '',
  showHistorical = true,
  showProjections = true,
  showOccupations = true
}) => {
  const { t } = useTranslation(['provincial-programs', 'common']);
  const { getRegionalTrends } = useCanadianImmigration();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<RegionalTrendData[]>([]);
  const [occupationData, setOccupationData] = useState<Array<{name: string, value: number}>>([]);
  
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trends data using AI-powered context method
        const trendsData = await getRegionalTrends(province as CanadianProvince);
        setTrends(trendsData);
        
        // Process occupation data for visualization
        if (showOccupations && trendsData.length > 0) {
          const occupationCounts: Record<string, number> = {};
          
          trendsData.forEach(trend => {
            trend.targetOccupations.forEach((occupation: string) => {
              if (occupationCounts[occupation]) {
                occupationCounts[occupation] += 1;
              } else {
                occupationCounts[occupation] = 1;
              }
            });
          });
          
          const processedData = Object.entries(occupationCounts).map(([name, value]) => ({
            name,
            value
          }));
          
          setOccupationData(processedData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching regional trends:', err);
        setError(t('common:errors.failed_to_load_data'));
        setLoading(false);
      }
    };
    
    fetchTrends();
  }, [province, getRegionalTrends, showOccupations, t]);
  
  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  if (trends.length === 0) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-gray-500">{t('provincial-programs:no_trend_data_available')}</div>
      </div>
    );
  }
  
  // Prepare data for charts
  const scoreData = trends.map(trend => ({
    period: trend.period,
    minimumScore: trend.minimumScore,
    projectedScore: trend.projectedMinimumScore,
    confidence: trend.aiConfidence
  }));
  
  const invitationData = trends.map(trend => ({
    period: trend.period,
    invitations: trend.invitationCount || trend.invitations,
    growthRate: trend.growthRate
  }));
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">
        {t('provincial-programs:regional_trends_for')} {province}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minimum Score Trends */}
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
                    name={t('provincial-programs:minimum_score')}
                    activeDot={{ r: 8 }}
                  />
                  {showProjections && (
                    <Line
                      type="monotone"
                      dataKey="projectedScore"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                      name={t('provincial-programs:projected_score')}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {t('provincial-programs:ai_confidence')}: {trends[0].aiConfidence || 85}%
            </div>
          </div>
        )}
        
        {/* Invitation Count Trends */}
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
                    name={t('provincial-programs:invitations')}
                  />
                  <Line
                    type="monotone"
                    dataKey="growthRate"
                    stroke="#ff7300"
                    name={t('provincial-programs:growth_rate')}
                    yAxisId={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Target Occupations */}
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
                    label={({ name, percent }: { name: string, percent: number }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {occupationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
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
};

export default RegionalTrends;
