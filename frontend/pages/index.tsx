import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/initial-assessment');
  };
  
  return (
    <div className="bg-white">
      {/* 英雄区域 */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
        <div className="max-w-7xl mx-auto">
          <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="世界各地的人们"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800 mix-blend-multiply"></div>
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
        </div>
      </div>

      {/* 特点部分 */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              简化您的移民之旅
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              我们的服务将移民流程分解为易于管理的步骤，利用AI技术和专业顾问为您提供支持
            </p>
          </div>

          <div className="relative mt-12 lg:mt-20 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                AI驱动的移民路径分析
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                我们的人工智能系统分析您的个人情况，推荐最适合您的移民路径，并为每个步骤提供详细指导。
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">快速评估</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    几分钟内获取您在不同移民项目中的资格评估和成功几率。
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">个性化移民路径</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    根据您的教育、工作经验、语言能力和家庭情况，获取量身定制的移民方案。
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">成功率预测</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    利用历史数据和AI分析，准确预测您申请成功的可能性。
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0">
              <img
                className="relative mx-auto rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="移民分析界面"
              />
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16 lg:mt-20">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  专业顾问支持
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  除了AI技术，我们还提供真人顾问支持，确保您在移民过程中获得专业指导。
                </p>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">实时聊天咨询</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      随时与经验丰富的移民顾问沟通，获取专业建议和解答疑问。
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">申请审核</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      专业顾问审核您的申请材料，确保准确无误，提高通过率。
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">个人化指导</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      根据您的具体情况，获取定制化的移民建议和指导。
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                <img
                  className="relative mx-auto rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1573496130407-57329f01f769?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                  alt="顾问咨询界面"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 流程部分 */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">移民流程</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              简单四步，实现移民梦想
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              我们将复杂的移民过程简化为四个简单步骤，让您轻松实现移民目标
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">免费评估</h3>
                <p className="mt-2 text-base text-gray-500">
                  完成简短的在线评估问卷，了解您适合的移民路径和成功几率。
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">个性化规划</h3>
                <p className="mt-2 text-base text-gray-500">
                  根据评估结果，我们为您提供详细的移民计划和所需材料清单。
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">表格准备</h3>
                <p className="mt-2 text-base text-gray-500">
                  使用我们的AI辅助工具填写表格，并由专业顾问审核确保无误。
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <span className="text-lg font-bold">4</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">提交跟踪</h3>
                <p className="mt-2 text-base text-gray-500">
                  提交申请后，实时跟踪进度，并在需要时获得额外支持。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 价格部分 */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">定价方案</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              选择适合您的服务
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              我们提供多种价格方案，满足不同阶段移民者的需求
            </p>
          </div>

          <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">基础方案</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">¥199</span>
                  <span className="ml-1 text-xl font-semibold">/月</span>
                </p>
                <p className="mt-6 text-gray-500">最基本的AI移民评估和指导服务。</p>

                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">AI移民路径分析</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">基础表格填写指导</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">移民资讯访问</span>
                  </li>
                </ul>
              </div>

              <Link href="/subscription">
                <span className="bg-blue-50 text-blue-700 hover:bg-blue-100 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium">
                  开始使用
                </span>
              </Link>
            </div>

            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-600 text-white">
                  最受欢迎
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">专业方案</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">¥399</span>
                  <span className="ml-1 text-xl font-semibold">/月</span>
                </p>
                <p className="mt-6 text-gray-500">全面的AI评估加顾问审核服务。</p>

                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">AI移民路径详细分析</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">全部表格自动填写</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">移民顾问审核</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">每月一次视频咨询</span>
                  </li>
                </ul>
              </div>

              <Link href="/subscription">
                <span className="bg-blue-600 text-white hover:bg-blue-700 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium">
                  立即订阅
                </span>
              </Link>
            </div>

            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">高级方案</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">¥999</span>
                  <span className="ml-1 text-xl font-semibold">/月</span>
                </p>
                <p className="mt-6 text-gray-500">最全面的移民服务套餐。</p>

                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">全部专业方案功能</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">专属资深移民顾问</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">不限次数的视频咨询</span>
                  </li>
                  <li className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">申请材料优先审核</span>
                  </li>
                </ul>
              </div>

              <Link href="/subscription">
                <span className="bg-blue-50 text-blue-700 hover:bg-blue-100 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium">
                  联系我们
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA部分 */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">准备开始您的移民之旅？</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            立即免费评估您的移民资格，获取AI分析报告，开启您的移民之路。
          </p>
          <Link href="/initial-assessment">
            <span className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto">
              免费评估您的资格
            </span>
          </Link>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                移民AI助手
              </h3>
              <p className="text-base text-gray-300">
                通过人工智能和专业知识，为您提供全方位的移民服务支持。
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">微信</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.813 15.248c-.375.281-.875.086-.969-.281l-.125-.906c-.063-.297-.063-.594.094-.812.156-.219.375-.344.625-.375l1.281-.156c.25-.031.469.125.562.344.094.219.063.469-.063.656l-.531.656c-.281.313-.625.563-.875.875zm7.344 0c-.375.281-.875.086-.969-.281l-.125-.906c-.063-.297-.063-.594.094-.812.156-.219.375-.344.625-.375l1.281-.156c.25-.031.469.125.562.344.094.219.063.469-.063.656l-.531.656c-.281.313-.625.563-.875.875zm.843-7.811c-2.609-.312-5.219-.188-7.781.375-2.125.5-3.609 2.219-3.219 4.344 0 .109.938.594 1.219.719.938.406 1.937.594 2.937.656 2.219.156 4.406-.5 6.313-1.625.531-.313 1.094-.594 1.594-.969.938-.656 1.031-1.969.281-2.844-.188-.25-.531-.469-.844-.531-.5-.125-1.031-.094-1.531-.125h.031z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">微博</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.813 17.219c-3.313 0-6-1.688-6-3.75 0-2.063 2.688-3.75 6-3.75s6 1.688 6 3.75c0 2.063-2.688 3.75-6 3.75zm-.25-6c-2.969 0-5.375 1.031-5.375 2.313 0 1.281 2.406 2.313 5.375 2.313s5.375-1.031 5.375-2.313c0-1.281-2.406-2.313-5.375-2.313zm7.437-5.969c-.219 0-.438.063-.656.125-.438.156-.75.563-.656 1.031.094.469.531.75.969.656.313-.063.594-.156.875-.281.406-.188.563-.656.375-1.063-.156-.312-.531-.469-.906-.469zm1.281 1.969c-.156 0-.312.031-.438.094-.344.125-.5.5-.375.844.125.344.5.531.813.406.375-.125.75-.281 1.094-.5.281-.188.375-.531.188-.813-.125-.25-.344-.344-.594-.344-.25 0-.469.094-.688.312zm2.469 4.625c-.094-.094-.188-.156-.281-.25-.281-.281-.531-.594-.781-.906-.688-.906-1.375-1.844-2.063-2.719-.281-.406-.563-.781-.844-1.125-.219-.281-.469-.531-.688-.781-.281-.313-.75-.344-1.063-.063-.313.281-.313.75-.031 1.063.031.031.063.063.094.094v.031c.063.063.094.125.156.188.125.156.281.313.406.469.25.313.5.656.75.969.656.875 1.313 1.781 1.969 2.656.25.344.5.688.781 1 .125.125.25.25.375.375.344.313.813.281 1.125-.063.313-.344.281-.875-.063-1.188.063 0 .094.063.156.25zm-9.844 1.938c-2.125-.281-3.625-1.25-3.344-2.156.281-.906 2.125-1.406 4.219-1.125 2.125.281 3.625 1.25 3.344 2.156-.25.906-2.094 1.406-4.219 1.125zm3.25-2.094c-.188-.594-.938-1-1.719-.875-.781.125-1.281.719-1.094 1.344.188.594.938.969 1.719.844.813-.125 1.281-.75 1.094-1.313zm-.563.75c-.125.344-.469.531-.781.438-.313-.094-.5-.406-.344-.75.125-.313.469-.5.781-.406.313.063.469.406.344.719z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">服务</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">移民评估</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">表格填写</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">顾问指导</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">申请跟踪</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">移民项目</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">技术移民</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">投资移民</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">家庭团聚</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">留学转移民</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">支持</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">帮助中心</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">联系我们</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">常见问题</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">社区论坛</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">法律</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">隐私政策</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">服务条款</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Cookie政策</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2023 移民AI助手. 保留所有权利.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}