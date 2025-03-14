import { useAuth } from '@clerk/nextjs';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useState } from 'react';
import { UserRole } from '../types/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Pricing() {
  const { isSignedIn } = useAuth();
  const [annual, setAnnual] = useState(true);
  const { t } = useTranslation('pricing');
  
  const toggleBilling = () => {
    setAnnual(!annual);
  };
  
  return (
    <Layout userRole={UserRole.GUEST}>
      <Head>
        <title>{t('page_title')} - Thinkforward</title>
        <meta name="description" content={t('meta_description') as string} />
      </Head>
      
      <div className="bg-gray-100">
        <div className="pt-12 sm:pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                {t('heading')}
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                {t('subheading')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* 计费周期选择器 */}
              <div className="relative self-center mt-6 bg-white rounded-lg p-0.5 flex sm:mt-8">
                <button
                  type="button"
                  className={`relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8 ${
                    annual ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                  onClick={() => setAnnual(true)}
                >
                  {t('billing.annual')}
                  {annual && <span className="ml-2 bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">{t('billing.save')}</span>}
                </button>
                <button
                  type="button"
                  className={`relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8 ${
                    !annual ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                  onClick={() => setAnnual(false)}
                >
                  {t('billing.monthly')}
                </button>
              </div>
              
              {/* 免费评估卡片 */}
              <div className="max-w-lg mx-auto mt-10 rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
                <div className="flex-1 bg-white px-6 py-8 lg:p-12">
                  <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {t('free_plan.title')}
                  </h3>
                  <p className="mt-6 text-base text-gray-500">
                    {t('free_plan.description')}
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <h4 className="flex-shrink-0 pr-4 bg-white text-sm tracking-wider font-semibold uppercase text-blue-600">
                        {t('free_plan.includes')}
                      </h4>
                      <div className="flex-1 border-t-2 border-gray-200"></div>
                    </div>
                    <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          {t('free_plan.feature1')}
                        </p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          {t('free_plan.feature2')}
                        </p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          {t('free_plan.feature3')}
                        </p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          {t('free_plan.feature4')}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                  <p className="text-lg leading-6 font-medium text-gray-900">
                    {t('free_plan.cta_title')}
                  </p>
                  <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900">
                    <span>
                      {t('free_plan.price')}
                    </span>
                  </div>
                  <div className="mt-6">
                    <Link href="/initial-assessment">
                      <span className="block w-full rounded-md shadow py-2 px-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {t('free_plan.cta_button')}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 付费方案列表 */}
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
              {/* 基础方案 */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{t('basic_plan.title')}</h2>
                  <p className="mt-4 text-sm text-gray-500">{t('basic_plan.description')}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{annual ? t('basic_plan.price_annual') : t('basic_plan.price_monthly')}</span>
                    <span className="text-base font-medium text-gray-500">/{annual ? t('billing.year') : t('billing.month')}</span>
                  </p>
                  <Link href={isSignedIn ? "/dashboard" : "/sign-up?plan=basic"}>
                    <span className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700">
                      {t('basic_plan.cta_button')}
                    </span>
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">{t('includes')}</h3>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">{t('basic_plan.feature1')}</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">{t('basic_plan.feature2')}</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">{t('basic_plan.feature3')}</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">{t('basic_plan.feature4')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 专业方案 */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">专业方案</h2>
                  <p className="mt-4 text-sm text-gray-500">全方位移民服务，提供专业顾问指导</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{annual ? '¥9,600' : '¥999'}</span>
                    <span className="text-base font-medium text-gray-500">/{annual ? '年' : '月'}</span>
                  </p>
                  <Link href={isSignedIn ? "/dashboard" : "/sign-up?plan=pro"}>
                    <span className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700">
                      开始使用
                    </span>
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">包含内容</h3>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">包含基础方案所有功能</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">高级文档自动生成</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">每月3次顾问咨询</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">优先申请审核</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 企业方案 */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">企业方案</h2>
                  <p className="mt-4 text-sm text-gray-500">为企业提供员工移民一站式服务解决方案</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">定制</span>
                  </p>
                  <Link href="/contact">
                    <span className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700">
                      联系我们
                    </span>
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">包含内容</h3>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">定制化移民方案</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">专属顾问团队</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">无限顾问咨询</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">优先处理和审核</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">培训和支持服务</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ区域 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                常见问题
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                无法找到您的问题？ 
                <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                  联系我们的客服团队
                </a>
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
              <dl className="space-y-12">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    如何选择最适合我的移民方案？
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    我们建议您先进行免费评估，了解您的移民选项和资格。评估后，我们会根据您的具体情况和需求，推荐最适合的方案。您也可以联系我们的顾问团队获取个性化建议。
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    订阅后可以随时取消吗？
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    是的，您可以随时取消订阅。对于月付方案，取消后将在当前计费周期结束时生效；对于年付方案，我们将按比例退还未使用部分的费用。
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    企业方案包含哪些具体内容？
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    企业方案完全根据企业的需求量身定制，可以包括员工移民申请管理、合规培训、专属顾问团队等服务。我们会与您的HR团队紧密合作，打造最适合贵公司的解决方案。
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    AI助手的回答是否准确可靠？
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    我们的AI助手基于最新的移民政策和法规进行训练，能够提供高度准确的信息。不过，对于关键决策，我们始终建议您咨询人工专业顾问，尤其是在处理复杂的移民情况时。
                  </dd>
                </div>
              </dl>
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
      ...(await serverSideTranslations(locale || 'zh', ['common', 'pricing'])),
    },
  };
} 