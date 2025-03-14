import { useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { UserRole } from '../types/user';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageTitle from '../components/PageTitle';
import { motion } from 'framer-motion';
import { FadeInWhenVisible } from '../components/animations/FadeInWhenVisible';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Landing() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { t } = useTranslation(['landing', 'common']);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const router = useRouter();
  
  console.log("Landing page rendering started");
  
  useEffect(() => {
    async function fetchUserRole() {
      console.log("Fetching user role, isSignedIn:", isSignedIn);
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          console.log("Got token:", token ? "有token" : "无token");
          
          const response = await fetch('/api/user/role', {
            headers: {
              'Authorization': `Bearer ${token || ''}`
            }
          });
          
          console.log("API response status:", response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log("User role data:", data);
            setUserRole(data.role as UserRole);
          } else {
            console.log('User role API returned status:', response.status);
            setUserRole(UserRole.GUEST);
          }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
          setUserRole(UserRole.GUEST);
        }
      } else {
        console.log("User not signed in, using GUEST role");
      }
    }
    
    fetchUserRole();
  }, [isSignedIn, user, getToken]);

  useEffect(() => {
    console.log('Current locale:', router.locale);
    console.log('Translation - register.as_client:', t('register.as_client'));
    console.log('Translation - nav.assessment from common:', t('nav.assessment', { ns: 'common' }));
  }, [router.locale, t]);

  // 根据用户角色呈现不同的内容
  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case UserRole.CLIENT:
        return (
          <div className="bg-blue-50 py-8 rounded-lg my-8 px-6">
            <h2 className="text-2xl font-bold text-blue-800">{t('roles.client.welcome_back')}</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.client.continue_application')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.client.continue_description', '查看您的申请进度并完成下一步')}
                  </p>
                </div>
              </Link>
              <Link href="/chat">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.client.speak_consultant')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.client.speak_description', '与您的顾问或AI助手沟通，获取帮助')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        );
      
      case UserRole.CONSULTANT:
        return (
          <div className="bg-green-50 py-8 rounded-lg my-8 px-6">
            <h2 className="text-2xl font-bold text-green-800">{t('roles.consultant.consultant_tools')}</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.consultant.manage_clients')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.consultant.manage_description', '查看和管理您的客户案例')}
                  </p>
                </div>
              </Link>
              <Link href="/tools">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.consultant.ai_assistant')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.consultant.ai_description', '使用AI助手提高工作效率')}
                  </p>
                </div>
              </Link>
              <Link href="/analysis">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {t('roles.consultant.analytics', '数据分析')}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.consultant.analytics_description', '查看客户数据和业务洞察')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        );
      
      case UserRole.ADMIN:
        return (
          <div className="bg-purple-50 py-8 rounded-lg my-8 px-6">
            <h2 className="text-2xl font-bold text-purple-800">{t('roles.admin.system_overview')}</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.admin.system_overview')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.admin.system_description', '平台概览和系统状态')}
                  </p>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.admin.user_management')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.admin.user_description', '管理用户账户和权限')}
                  </p>
                </div>
              </Link>
              <Link href="/admin/analytics">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{t('roles.admin.platform_analytics')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('roles.admin.analytics_description', '查看平台数据和使用统计')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        );
      
      default:
        return null; // GUEST 不显示额外内容
    }
  };

  // 在返回之前添加一个简单的调试日志
  console.log("Rendering landing page, userRole:", userRole);
  
  return (
    <ErrorBoundary fallback={<div>页面加载出错，请刷新重试</div>}>
      <Layout userRole={userRole}>
        <PageTitle titleKey="title" defaultTitle="ThinkForward AI - 智能移民助手" namespace="landing" />

        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-background.jpg"
              fill
              className="object-cover"
              alt={t('hero.background_alt')}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 mix-blend-multiply" />
          </div>
          <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">{t('hero.title')}</span>
                <span className="block text-blue-200">{t('hero.subtitle')}</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-blue-100 sm:max-w-3xl">
                {t('hero.description')}
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                  <Link href="/initial-assessment">
                    <span className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8">
                      {t('cta.free_assessment')}
                    </span>
                  </Link>
                  {isSignedIn ? (
                    <Link href="/dashboard">
                      <span className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8">
                        {t('cta.dashboard')}
                      </span>
                    </Link>
                  ) : (
                    <Link href="/sign-in">
                      <span className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8">
                        {t('cta.login_register')}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 角色特定内容 */}
        {renderRoleSpecificContent()}

        {/* 非登录用户的角色选择 */}
        {userRole === UserRole.GUEST && (
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {t('roles.guest.role_selection', '选择您的角色')}
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  {t('roles.guest.role_description', 'ThinkForward为不同用户提供定制化服务')}
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="bg-blue-50 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-800">{t('roles.guest.consultant_heading')}</h3>
                    <p className="mt-4 text-lg text-gray-600">{t('roles.guest.consultant_description')}</p>
                    <Link href="/sign-up?role=consultant">
                      <span className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        {t('roles.guest.register_as_consultant', '注册为顾问')}
                      </span>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-green-800">{t('roles.guest.client_heading')}</h3>
                    <p className="mt-4 text-lg text-gray-600">{t('roles.guest.client_description')}</p>
                    <Link href="/sign-up?role=client">
                      <span className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                        {t('register.as_client')}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <FadeInWhenVisible>
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                  {t('features.title')}
                </h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {t('features.description')}
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  {t('features.explanation')}
                </p>
              </div>

              <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('features.item1.title')}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {t('features.item1.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('features.item2.title')}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {t('features.item2.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('features.item3.title')}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {t('features.item3.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('features.item4.title')}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {t('features.item4.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* How It Works Section */}
        <FadeInWhenVisible>
          <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {t('how_it_works.title')}
                </h2>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  {t('how_it_works.description')}
                </p>
              </div>

              <div className="mt-16">
                <div className="flex flex-col md:flex-row justify-around">
                  <div className="flex flex-col items-center mb-8 md:mb-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      {t('how_it_works.step1.title')}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 text-center max-w-xs">
                      {t('how_it_works.step1.description')}
                    </p>
                  </div>

                  <div className="flex flex-col items-center mb-8 md:mb-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xl font-bold text-blue-600">2</span>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      {t('how_it_works.step2.title')}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 text-center max-w-xs">
                      {t('how_it_works.step2.description')}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xl font-bold text-blue-600">3</span>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      {t('how_it_works.step3.title')}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 text-center max-w-xs">
                      {t('how_it_works.step3.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Consultant Section */}
        <FadeInWhenVisible>
          <div className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    {t('consultant.title')}
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    {t('consultant.description')}
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-lg font-medium text-gray-900">
                        {t('consultant.benefit1')}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-lg font-medium text-gray-900">
                        {t('consultant.benefit2')}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-lg font-medium text-gray-900">
                        {t('consultant.benefit3')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 relative text-base mx-auto max-w-prose lg:mt-0 sm:max-w-lg sm:mx-0 lg:max-w-none">
                  <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
                    <Image
                      className="rounded-lg shadow-xl"
                      src="/images/consultant.jpg"
                      alt={t('consultant.image_alt')}
                      fill
                      objectFit="cover"
                    />
                  </div>
                </div>
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
                  {t('testimonials.title')}
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                  {t('testimonials.subtitle')}
                </p>
              </div>
              
              <div className="mt-12 max-w-lg mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <p className="text-gray-600 italic">
                    {t('testimonials.testimonial1.content')}
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        className="rounded-full"
                        src="/images/testimonial1.jpg"
                        alt={t('testimonials.testimonial1.person_alt')}
                        fill
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {t('testimonials.testimonial1.name')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('testimonials.testimonial1.program')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <p className="text-gray-600 italic">
                    {t('testimonials.testimonial2.content')}
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        className="rounded-full"
                        src="/images/testimonial2.jpg"
                        alt={t('testimonials.testimonial2.person_alt')}
                        fill
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {t('testimonials.testimonial2.name')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('testimonials.testimonial2.program')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <p className="text-gray-600 italic">
                    {t('testimonials.testimonial3.content')}
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        className="rounded-full"
                        src="/images/testimonial3.jpg"
                        alt={t('testimonials.testimonial3.person_alt')}
                        fill
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {t('testimonials.testimonial3.name')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('testimonials.testimonial3.program')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* CTA Section */}
        <FadeInWhenVisible>
          <div className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {t('cta_section.title')}
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  {t('cta_section.description')}
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <Link href="/sign-up">
                      <span className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        {t('cta_section.register_button')}
                      </span>
                    </Link>
                  </div>
                  <div className="ml-3 inline-flex">
                    <Link href="/initial-assessment">
                      <span className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                        {t('cta_section.assessment_button')}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* 添加一个简单的调试内容，确保页面至少有一些内容 */}
        <div style={{position: 'fixed', bottom: 10, right: 10, background: '#f0f0f0', padding: 5, zIndex: 1000}}>
          Debug: {userRole} | Locale: {router.locale}
        </div>
      </Layout>
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