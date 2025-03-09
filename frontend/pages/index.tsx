import { useAuth } from '@clerk/nextjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { UserRole } from '../types/user';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <Layout userRole={UserRole.GUEST}>
      <Head>
        <title>Thinkforward移民AI助手 - 简化您的移民之旅</title>
        <meta name="description" content="通过AI技术和专业顾问，简化复杂的移民申请流程" />
      </Head>

      {/* 英雄区域 */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background.jpg"
            fill
            className="object-cover"
            alt="背景图"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 mix-blend-multiply" />
        </div>
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
          <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-white">简化您的移民申请</span>
            <span className="block text-blue-200">AI驱动的移民服务</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-center text-xl text-blue-100 sm:max-w-3xl">
            通过我们先进的AI技术和专业顾问，使复杂的移民流程变得简单。从表格填写到申请跟踪，我们提供全方位支持。
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
              <Link href="/initial-assessment">
                <span className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8">
                  免费评估
                </span>
              </Link>
              {isSignedIn ? (
                <Link href="/dashboard">
                  <span className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8">
                    进入控制台
                  </span>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <span className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8">
                    登录/注册
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 特点区域 */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Thinkforward移民AI助手特点</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              智能化的移民申请体验
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              我们利用先进的AI技术，为您提供个性化的移民解决方案，让申请过程更加高效、透明。
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">智能表单填写</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  AI辅助的表单填写，自动检查错误，确保信息准确无误，大大减少被拒风险。
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">实时进度跟踪</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  随时了解您申请的最新进展，每一步都清晰可见，让您的移民之旅透明可控。
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">24/7 AI顾问支持</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  全天候AI顾问随时为您解答问题，提供专业建议，解决您在移民过程中遇到的任何疑惑。
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">专业顾问团队</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  拥有多年经验的移民顾问为您提供个性化服务，确保您的申请获得最高成功率。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* 统计数据区域 */}
      <div className="bg-blue-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              值得信赖的移民伙伴
            </h2>
            <p className="mt-3 text-xl text-blue-200 sm:mt-4">
              我们已帮助数千客户成功移民至他们梦想的国家，成为他们值得信赖的移民伙伴。
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                成功案例
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                5,000+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                客户满意度
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                98%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                覆盖国家
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                20+
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 号召行动区域 */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">准备开始您的移民之旅?</span>
            <span className="block text-blue-600">立即获取免费资格评估</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/initial-assessment">
                <span className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  开始免费评估
                </span>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/about">
                <span className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50">
                  了解更多
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}