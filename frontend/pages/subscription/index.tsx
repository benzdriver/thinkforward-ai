import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@clerk/nextjs";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { function as Head } from 'next/head';
import Layout from '../../components/Layout';
import { UserRole } from '../../types/user';

const plans = [
  {
    id: 'basic',
    name: {
      key: 'subscription.plans.basic.name',
      default: '基础计划'
    },
    price: '$199',
    period: {
      key: 'subscription.period.monthly',
      default: '月'
    },
    features: [
      { key: 'subscription.plans.basic.feature1', default: 'AI移民路径分析' },
      { key: 'subscription.plans.basic.feature2', default: '基础表格填写指导' },
      { key: 'subscription.plans.basic.feature3', default: '电子邮件支持' },
      { key: 'subscription.plans.basic.feature4', default: '移民资讯访问' }
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: {
      key: 'subscription.plans.pro.name',
      default: '专业计划'
    },
    price: '$399',
    period: {
      key: 'subscription.period.monthly',
      default: '月'
    },
    features: [
      { key: 'subscription.plans.pro.feature1', default: 'AI移民路径详细分析' },
      { key: 'subscription.plans.pro.feature2', default: '全部表格自动填写' },
      { key: 'subscription.plans.pro.feature3', default: '移民顾问审核' },
      { key: 'subscription.plans.pro.feature4', default: '优先电子邮件支持' },
      { key: 'subscription.plans.pro.feature5', default: '移民资讯访问' },
      { key: 'subscription.plans.pro.feature6', default: '每月一次视频咨询' }
    ],
    recommended: true
  },
  {
    id: 'premium',
    name: {
      key: 'subscription.plans.premium.name',
      default: '高级计划'
    },
    price: '$599',
    period: {
      key: 'subscription.period.monthly',
      default: '月'
    },
    features: [
      { key: 'subscription.plans.premium.feature1', default: 'AI移民路径详细分析' },
      { key: 'subscription.plans.premium.feature2', default: '全部表格自动填写' },
      { key: 'subscription.plans.premium.feature3', default: '资深移民顾问审核' },
      { key: 'subscription.plans.premium.feature4', default: '24/7优先支持' },
      { key: 'subscription.plans.premium.feature5', default: '完整移民资料库访问' },
      { key: 'subscription.plans.premium.feature6', default: '每月两次视频咨询' },
      { key: 'subscription.plans.premium.feature7', default: '专属移民策略规划' }
    ],
    recommended: false
  }
];

export function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { t } = useTranslation('subscription');

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      // 如果用户未登录，重定向到登录页面
      router.push(`/sign-in?redirect=/subscription`);
      return;
    }

    setIsProcessing(true);
    
    try {
      // 发送订阅请求到API
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (response.ok) {
        // 重定向到支付或确认页
        router.push(data.redirectUrl || '/subscription/success');
      } else {
        alert(`${t('subscription_failed')}: ${data.message}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      alert(t('subscription_error'));
      setIsProcessing(false);
    }
  };

  return (
    <Layout userRole={UserRole.GUEST}>
      <Head>
        <title>{t('page_title')} - Thinkforward</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {t('heading')}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            {t('description')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`border rounded-lg shadow-sm p-8 transition-all duration-200 ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:shadow-lg'
              } ${plan.recommended ? 'relative' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  {t('recommended')}
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-900">{t(plan.name.key, plan.name.default)}</h2>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/{t(plan.period.key, plan.period.default)}</span>
              </p>
              
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">{t(feature.key, feature.default)}</p>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    handleSubscribe(plan.id);
                  }}
                  disabled={isProcessing}
                  className={`w-full inline-flex justify-center py-3 px-5 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('processing')}
                    </span>
                  ) : (
                    t('subscribe_button')
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('faq.title')}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg">{t('faq.q1')}</h3>
              <p className="text-gray-600 mt-1">{t('faq.a1')}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">{t('faq.q2')}</h3>
              <p className="text-gray-600 mt-1">{t('faq.a2')}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">{t('faq.q3')}</h3>
              <p className="text-gray-600 mt-1">{t('faq.a3')}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common', 'subscription'])),
    },
  };
}
