import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface AssessmentResult {
  eligibilityScore: number;
  recommendations: string[];
  targetCountries: Array<{
    country: string;
    score: number;
    programs: string[];
  }>;
  timeframe: string;
  nextSteps: string[];
}

export function AssessmentResult() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchResult() {
      try {
        // 获取评估结果
        const response = await fetch('/api/assessment/result');
        
        if (!response.ok) {
          throw new Error('无法获取评估结果');
        }
        
        const data = await response.json();
        setResult(data.result);
      } catch (error) {
        console.error('获取评估结果错误:', error);
        setError('获取您的评估结果时出现错误，请稍后再试。');
      } finally {
        setLoading(false);
      }
    }
    
    fetchResult();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">AI正在分析您的资料...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">出错了</h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <div className="mt-6">
            <Link href="/initial-assessment">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                重新评估
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
          <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">未找到评估结果</h2>
          <p className="mt-2 text-gray-500">我们无法找到您的评估结果，请重新进行评估。</p>
          <div className="mt-6">
            <Link href="/initial-assessment">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                重新评估
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  您的移民评估结果
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  基于您提供的信息，我们的AI系统已生成个性化评估
                </p>
              </div>
              <div>
                <div className="bg-blue-50 rounded-full p-3">
                  <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* 资格评分 */}
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-base font-medium text-gray-900">总体资格评分</h4>
            <div className="mt-3 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    您的分数
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {result.eligibilityScore}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${result.eligibilityScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
              <p className="text-sm text-gray-500">
                {result.eligibilityScore >= 80 ? '您的移民资格评分很高，有很大机会获得批准。' : 
                result.eligibilityScore >= 60 ? '您的移民资格评分中等，有合理的成功机会。' : 
                '您的移民资格评分较低，可能需要改善一些条件以提高成功率。'}
              </p>
            </div>
          </div>
          
          {/* 推荐国家 */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-base font-medium text-gray-900">推荐移民国家</h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {result.targetCountries.map((country, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900">{country.country}</h5>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        匹配度: {country.score}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500">适合的移民项目:</p>
                      <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                        {country.programs.map((program, i) => (
                          <li key={i}>{program}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 建议和下一步 */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-base font-medium text-gray-900">个性化建议</h4>
              <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-base font-medium text-gray-900">预计时间</h4>
              <p className="mt-2 text-sm text-gray-500">{result.timeframe}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-base font-medium text-gray-900">下一步行动</h4>
              <ul className="mt-2 text-sm text-gray-500 list-decimal list-inside space-y-1">
                {result.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="px-4 py-5 bg-gray-50 sm:px-6 border-t border-gray-200 sm:flex sm:flex-row-reverse">
            <Link href="/sign-up?plan=basic">
              <span className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto">
                注册账号获取详细指导
              </span>
            </Link>
            <Link href="/initial-assessment">
              <span className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto">
                重新评估
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 