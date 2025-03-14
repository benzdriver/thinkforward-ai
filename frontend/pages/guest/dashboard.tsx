import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader';

// 成功案例类型
interface CaseStudy {
  id: string;
  title: string;
  program: string;
  timeFrame: string;
  result: string;
  imageSrc: string;
}

// 特色卡片类型
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function GuestDashboard() {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  
  // 模拟成功案例数据
  const caseStudies: CaseStudy[] = [
    {
      id: 'case1',
      title: t('case_studies.tech_immigration.title'),
      program: t('case_studies.tech_immigration.program'),
      timeFrame: t('case_studies.tech_immigration.timeFrame'),
      result: t('case_studies.tech_immigration.result'),
      imageSrc: '/images/cases/tech-case.jpg'
    },
    {
      id: 'case2',
      title: t('case_studies.family_reunification.title'),
      program: t('case_studies.family_reunification.program'),
      timeFrame: t('case_studies.family_reunification.timeFrame'),
      result: t('case_studies.family_reunification.result'),
      imageSrc: '/images/cases/family-case.jpg'
    },
    {
      id: 'case3',
      title: t('case_studies.student_pr.title'),
      program: t('case_studies.student_pr.program'),
      timeFrame: t('case_studies.student_pr.timeFrame'),
      result: t('case_studies.student_pr.result'),
      imageSrc: '/images/cases/student-case.jpg'
    }
  ];
  
  // 特色功能数据
  const features: FeatureCard[] = [
    {
      id: 'feature1',
      title: t('guest.features.ai_assistant'),
      description: t('guest.features.ai_assistant_desc'),
      icon: 'ai-icon.svg'
    },
    {
      id: 'feature2',
      title: t('guest.features.document_automation'),
      description: t('guest.features.document_automation_desc'),
      icon: 'document-icon.svg'
    },
    {
      id: 'feature3',
      title: t('guest.features.progress_tracking'),
      description: t('guest.features.progress_tracking_desc'),
      icon: 'progress-icon.svg'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <PageHeader 
          title={t('guest.title')} 
          subtitle={t('guest.subtitle')} 
          alignment="center"
          className="mb-12"
        />
        
        {/* 用户角色选择区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 border-2 border-blue-100 hover:border-blue-500">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">{t('guest.consultant_intro')}</h3>
            <p className="text-gray-600 mb-6">{t('guest.consultant_desc')}</p>
            <Link href="/auth/register?role=consultant">
              <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                {t('guest.learn_more')}
              </span>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 border-2 border-blue-100 hover:border-blue-500">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">{t('guest.client_intro')}</h3>
            <p className="text-gray-600 mb-6">{t('guest.client_desc')}</p>
            <Link href="/auth/register?role=client">
              <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                {t('guest.register_cta')}
              </span>
            </Link>
          </div>
        </div>
        
        {/* 特色功能区域 */}
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('common.features')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map(feature => (
            <div key={feature.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Image src={`/icons/${feature.icon}`} alt={feature.title} width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* 成功案例区域 */}
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('guest.case_studies')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {caseStudies.map(caseStudy => (
            <div key={caseStudy.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 relative">
                <Image 
                  src={caseStudy.imageSrc} 
                  alt={caseStudy.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{caseStudy.title}</h3>
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-2">
                    {caseStudy.program}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {caseStudy.timeFrame}
                  </span>
                </div>
                <p className="text-gray-600">{caseStudy.result}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 行动号召区域 */}
        <div className="bg-blue-50 rounded-2xl p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            {t('guest.free_assessment')}
          </h2>
          <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
            {t('guest.assessment_description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/assessment')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              {t('guest.start_assessment')}
            </button>
            <button
              onClick={() => router.push('/demo')}
              className="px-6 py-3 bg-white text-blue-600 border border-blue-300 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              {t('guest.try_demo')}
            </button>
          </div>
        </div>
        
        {/* 注册/登录区域 */}
        <div className="text-center">
          <div className="mb-4">
            <Link href="/auth/register">
              <span className="inline-block px-8 py-4 bg-blue-600 text-white rounded-md font-medium text-lg hover:bg-blue-700 transition-colors">
                {t('guest.register_cta')}
              </span>
            </Link>
          </div>
          <p className="text-gray-600">
            {t('guest.login_prompt')} <Link href="/auth/login">
              <span className="text-blue-600 hover:underline">
                {t('guest.login_cta')}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common', 'dashboard'])),
    },
  };
} 