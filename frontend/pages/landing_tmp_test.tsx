import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Landing() {
  const { t } = useTranslation(['landing', 'common']);
  const router = useRouter();
  
  console.log("Simplified landing page rendering");
  
  return (
    <ErrorBoundary fallback={<div className="p-10 bg-red-100">错误: 页面加载失败</div>}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">ThinkForward AI</h1>
        <p className="text-xl mb-8">智能移民助手 - 简化版测试页面</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">特点一</h2>
            <p>AI驱动的移民评估和建议</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">特点二</h2>
            <p>个性化移民路径规划</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">特点三</h2>
            <p>专业移民顾问支持</p>
          </div>
        </div>
        
        <div className="mt-10 p-4 bg-blue-50 rounded-md">
          <p>当前区域设置: {router.locale}</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  console.log("getStaticProps called with locale:", locale);
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['landing', 'common'])),
    },
  };
};

