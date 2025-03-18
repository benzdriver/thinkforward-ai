import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { FadeInWhenVisible } from '@/components/animations/FadeInWhenVisible';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function HomePage() {
  const { t } = useTranslation(['index', 'common']);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  try {
    return (
      <ErrorBoundary>
        <PublicLayout
          defaultTitle={t('common:title') as string}
          namespace={['index', 'common']}
        >
          {error && (
            <Alert
              type="error"
              message={t('common:errors.title', 'Error')}
              description={error}
              showIcon
              closable
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}
          
          {/* Hero Section */}
          <FadeInWhenVisible>
            <div className="relative bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                  <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
                    <div className="sm:text-center lg:text-left">
                      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">{t('landing.hero.title')}</span>
                      </h1>
                      <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                        {t('landing.hero.subtitle')}
                      </p>
                      
                      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                        <div className="rounded-md shadow">
                          <Button 
                            type="button" 
                            size="lg" 
                            onClick={() => router.push('/auth/register')}
                          >
                            {t('landing.hero.cta')}
                          </Button>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                          <Button 
                            type="button" 
                            variant="outline"
                            size="lg" 
                            onClick={() => {
                              const featuresSection = document.getElementById('features');
                              featuresSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            {t('landing.hero.secondary_cta')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
              <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center bg-black">
                <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}> {/* 16:9 宽高比 */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  >
                    <source src="/videos/hero-animation.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Features Section */}
          <FadeInWhenVisible>
            <div id="features" className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                  <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                  <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    {t('landing.features.title')}
                  </p>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                    {t('landing.features.subtitle')}
                  </p>
                </div>

                <div className="mt-10">
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('landing.features.ai_assistant.title')}</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        {t('landing.features.ai_assistant.description')}
                      </dd>
                    </div>

                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('landing.features.document_analysis.title')}</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        {t('landing.features.document_analysis.description')}
                      </dd>
                    </div>

                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('landing.features.form_automation.title')}</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        {t('landing.features.form_automation.description')}
                      </dd>
                    </div>

                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('landing.features.client_management.title')}</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        {t('landing.features.client_management.description')}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Testimonials */}
          <FadeInWhenVisible>
            <div className="bg-gray-50 py-16 sm:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    {t('landing.testimonials.title')}
                  </h2>
                  <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                    {t('landing.testimonials.subtitle')}
                  </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                  <Card>
                    <Card.Body>
                      <p className="text-lg text-gray-600 italic mb-4">"{t('landing.testimonials.testimonial_1.quote')}"</p>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-bold">{t('landing.testimonials.testimonial_1.author').charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{t('landing.testimonials.testimonial_1.author')}</p>
                          <p className="text-sm text-gray-500">{t('landing.testimonials.testimonial_1.position')}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  <Card>
                    <Card.Body>
                      <p className="text-lg text-gray-600 italic mb-4">"{t('landing.testimonials.testimonial_2.quote')}"</p>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-bold">{t('landing.testimonials.testimonial_2.author').charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{t('landing.testimonials.testimonial_2.author')}</p>
                          <p className="text-sm text-gray-500">{t('landing.testimonials.testimonial_2.position')}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  <Card>
                    <Card.Body>
                      <p className="text-lg text-gray-600 italic mb-4">"{t('landing.testimonials.testimonial_3.quote')}"</p>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-bold">{t('landing.testimonials.testimonial_3.author').charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{t('landing.testimonials.testimonial_3.author')}</p>
                          <p className="text-sm text-gray-500">{t('landing.testimonials.testimonial_3.position')}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Pricing Plans */}
          <FadeInWhenVisible>
            <div className="bg-white py-16 sm:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    {t('landing.consultant_plans.title')}
                  </h2>
                  <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                    {t('landing.consultant_plans.subtitle')}
                  </p>
                </div>
                
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                  {/* Starter Plan */}
                  <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-4">
                        {t('landing.consultant_plans.starter.badge')}
                      </Badge>
                      <h2 className="text-lg leading-6 font-medium text-gray-900">{t('landing.consultant_plans.starter.title')}</h2>
                      <p className="mt-4 text-sm text-gray-500">{t('landing.consultant_plans.starter.description')}</p>
                      <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">${t('landing.consultant_plans.starter.price')}</span>
                        <span className="text-base font-medium text-gray-500">/{t('landing.consultant_plans.period')}</span>
                      </p>
                      <Button
                        type="button"
                        className="mt-8 block w-full"
                        onClick={() => router.push('/auth/register?plan=starter')}
                      >
                        {t('landing.consultant_plans.starter.cta')}
                      </Button>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                        {t('common:includes', '包含')}
                      </h3>
                      <ul className="mt-6 space-y-4">
                        {(() => {
                          const features = t('landing.consultant_plans.starter.features', { returnObjects: true });
                          const defaultFeatures = [
                            '基础AI顾问助手',
                            '最多管理10位客户',
                            '基础文档分析',
                            '标准表单自动填充',
                            '电子邮件支持'
                          ];
                          
                          if (Array.isArray(features)) return features;
                          if (typeof features === 'string') return [features];
                          return defaultFeatures;
                        })().map((feature: string, index: number) => (
                          <li key={index} className="flex">
                            <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="ml-3 text-base text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Professional Plan */}
                  <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                    <div className="p-6">
                      <Badge variant="primary" className="mb-4">
                        {t('landing.consultant_plans.professional.badge')}
                      </Badge>
                      <h2 className="text-lg leading-6 font-medium text-gray-900">{t('landing.consultant_plans.professional.title')}</h2>
                      <p className="mt-4 text-sm text-gray-500">{t('landing.consultant_plans.professional.description')}</p>
                      <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">${t('landing.consultant_plans.professional.price')}</span>
                        <span className="text-base font-medium text-gray-500">/{t('landing.consultant_plans.period')}</span>
                      </p>
                      <Button
                        type="button"
                        className="mt-8 block w-full"
                        variant="primary"
                        onClick={() => router.push('/auth/register?plan=professional')}
                      >
                        {t('landing.consultant_plans.professional.cta')}
                      </Button>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                        {t('common:includes', '包含')}
                      </h3>
                      <ul className="mt-6 space-y-4">
                        {(() => {
                          const features = t('landing.consultant_plans.professional.features', { returnObjects: true });
                          const defaultFeatures = [
                            '高级AI顾问助手',
                            '最多管理50位客户',
                            '高级文档分析与提取',
                            '高级表单自动化',
                            '优先电子邮件和聊天支持',
                            '客户洞察分析'
                          ];
                          
                          if (Array.isArray(features)) return features;
                          if (typeof features === 'string') return [features];
                          return defaultFeatures;
                        })().map((feature: string, index: number) => (
                          <li key={index} className="flex">
                            <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="ml-3 text-base text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                    <div className="p-6">
                      <Badge variant="accent" className="mb-4">
                        {t('landing.consultant_plans.enterprise.badge')}
                      </Badge>
                      <h2 className="text-lg leading-6 font-medium text-gray-900">{t('landing.consultant_plans.enterprise.title')}</h2>
                      <p className="mt-4 text-sm text-gray-500">{t('landing.consultant_plans.enterprise.description')}</p>
                      <p className="mt-8 flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">${t('landing.consultant_plans.enterprise.price')}</span>
                        <span className="ml-1 text-base font-medium text-gray-500">/{t('landing.consultant_plans.period')}</span>
                      </p>
                      <Button
                        type="button"
                        className="mt-8 block w-full"
                        variant="secondary"
                        onClick={() => router.push('/auth/register?plan=enterprise')}
                      >
                        {t('landing.consultant_plans.enterprise.cta')}
                      </Button>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                        {t('common:includes', '包含')}
                      </h3>
                      <ul className="mt-6 space-y-4">
                        {(() => {
                          const features = t('landing.consultant_plans.enterprise.features', { returnObjects: true });
                          const defaultFeatures = [
                            '企业级AI顾问助手',
                            '无限客户管理',
                            '高级文档分析与批量处理',
                            '完整表单自动化套件',
                            '24/7优先支持',
                            '高级分析和报告',
                            '专属客户经理'
                          ];
                          
                          if (Array.isArray(features)) return features;
                          if (typeof features === 'string') return [features];
                          return defaultFeatures;
                        })().map((feature: string, index: number) => (
                          <li key={index} className="flex">
                            <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="ml-3 text-base text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* CTA Section */}
          <FadeInWhenVisible>
            <div className="bg-blue-700">
              <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">{t('landing.cta_section.title')}</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-200">
                  {t('landing.cta_section.subtitle')}
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <Button
                      type="button"
                      size="lg"
                      variant="white"
                      onClick={() => router.push('/auth/register')}
                    >
                      {t('landing.cta_section.cta')}
                    </Button>
                  </div>
                  <div className="ml-3 inline-flex">
                    <button
                      type="button"
                      onClick={() => router.push('/contact')}
                      className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-800 transition-colors"
                    >
                      {t('landing.cta_section.secondary_cta', '预约演示')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </PublicLayout>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error rendering HomePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">渲染错误</h2>
          <p className="text-gray-700 mb-4">
            抱歉，加载页面时出现问题。请刷新页面或稍后再试。
          </p>
          <p className="text-sm text-gray-500 mb-4">
            错误详情: {error instanceof Error ? error.message : String(error)}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh-CN', ['index', 'layout', 'common'])),
    },
  };
};