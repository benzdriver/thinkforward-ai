import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { UserRole } from '../types/user';

export default function About() {
  return (
    <Layout userRole={UserRole.GUEST}>
      <Head>
        <title>关于ThinkForward - 结合AI技术的加拿大顶级移民顾问团队</title>
        <meta name="description" content="ThinkForward移民AI平台由加拿大Top 1%持牌移民顾问Bernice He领导，结合人工智能技术与十年移民经验，为您提供高效、精准的加拿大移民服务，节省宝贵时间与成本" />
        <meta name="keywords" content="加拿大移民,AI移民助手,持牌移民顾问,ThinkForward,移民效率,移民申请,快速通道移民,技术移民,家庭团聚,学生签证,工作签证,永久居民,移民评估,UBC移民顾问" />
      </Head>
      
      {/* 公司简介部分 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-base font-semibold text-blue-600 tracking-wide uppercase">关于ThinkForward</h1>
            <h2 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              AI赋能的加拿大顶级移民顾问团队
            </h2>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              我们由加拿大Top 1%的持牌移民顾问Bernice He领导，结合人工智能与专业经验，为客户提供更高效、更精准的移民服务，让每一分钟都创造价值。
            </p>
          </div>
        </div>
      </div>
      
      {/* AI技术优势部分 - 新增 */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                AI赋能，效率倍增
              </h2>
              <p className="mt-6 text-lg leading-7">
                在ThinkForward，我们深知<span className="font-bold underline">客户的时间就是金钱</span>。通过拥抱人工智能技术，我们革新了传统移民服务流程：
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium">审批速度提升85%</h3>
                    <p className="mt-2 text-base">
                      我们的AI系统能够实时检查申请材料完整性和准确性，将传统人工审核时间从3-5天缩短至几小时内完成，大幅加速申请进程。
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium">智能文档生成与管理</h3>
                    <p className="mt-2 text-base">
                      AI助手能自动生成定制化申请文档，并智能管理所有材料，确保文件的准确性和完整性，减少人为错误率达90%。
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium">预测性分析</h3>
                    <p className="mt-2 text-base">
                      我们的AI系统分析数千个成功案例，能够预测申请结果并提供最佳移民路径建议，成功率高于行业平均水平35%。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <Image 
                    src="/images/ai-dashboard.jpg" 
                    alt="ThinkForward AI移民助手界面" 
                    width={500}
                    height={300}
                    className="w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button type="button" className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      观看演示
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 bg-gradient-to-l from-blue-600 to-blue-400 rounded-full p-3 transform rotate-12">
                <div className="bg-white rounded-full p-2">
                  <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 首席顾问介绍 */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="relative lg:order-2">
              <div className="aspect-w-4 aspect-h-5 rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/bernice-he.jpg" 
                  alt="Bernice He - 首席移民顾问" 
                  layout="fill"
                  objectFit="cover"
                  className="object-center"
                />
              </div>
              <div className="absolute bottom-0 right-0 -mb-10 -mr-10 bg-blue-600 rounded-lg shadow-lg px-6 py-4 text-white">
                <p className="text-lg font-bold">加拿大Top 1%</p>
                <p>持牌移民顾问</p>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:order-1">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Bernice He
              </h2>
              <p className="mt-2 text-xl text-blue-700 font-semibold">
                首席持牌移民顾问 | UBC毕业 | 十年精英经验
              </p>
              <div className="mt-6 text-lg text-gray-500 space-y-4">
                <p>
                  Bernice He是一位备受尊敬的加拿大持牌移民顾问(RCIC)，以其专业知识和卓越成就跻身加拿大顶尖1%的移民顾问行列。
                </p>
                <p>
                  毕业于不列颠哥伦比亚大学(UBC)移民专业，Bernice拥有超过十年的丰富移民咨询经验，专长于加拿大各类移民项目，包括快速通道(Express Entry)、省提名计划(PNP)、家庭团聚、商业移民及工作签证申请。
                </p>
                <p>
                  作为行业创新者，Bernice不仅精通传统移民法规，还率先将AI技术引入移民服务，开创了"AI+专家"的服务新模式。她坚信技术与专业知识的结合能够最大化客户价值，让移民之路更加顺畅高效。
                </p>
                <p>
                  在她的带领下，ThinkForward团队专注于为客户提供"全生命周期"的移民服务，确保每位客户从规划到登陆再到安居的全过程都能获得最优质的支持。
                </p>
              </div>
              <div className="mt-8 flex">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/initial-assessment">
                    <span className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      预约Bernice顾问
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 专业团队部分 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              AI驱动的精英移民顾问团队
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              在Bernice的带领下，我们的团队由经验丰富的持牌移民顾问、移民律师、AI工程师和数据分析专家组成，创新性地将人工专业知识与AI技术完美融合。
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <Image 
                  className="object-cover" 
                  src="/images/team-1.jpg" 
                  alt="资深移民顾问"
                  layout="fill"
                />
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-bold text-gray-900">Sarah Zhang</h3>
                <p className="text-blue-600 font-medium">资深持牌移民顾问</p>
                <p className="mt-4 text-gray-600">
                  专注于Express Entry技术移民和省提名计划(PNP)，拥有8年申请经验，结合AI技术优化申请流程，成功率高达96%。
                </p>
                <div className="mt-4 flex flex-wrap">
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">技术移民</span>
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">省提名</span>
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">快速通道</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <Image 
                  className="object-cover" 
                  src="/images/team-2.jpg" 
                  alt="AI技术主管"
                  layout="fill"
                />
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-bold text-gray-900">Ben Zhou</h3>
                <p className="text-blue-600 font-medium">AI技术主管</p>
                <p className="mt-4 text-gray-600">
                  Workday高级工程师，拥有多年NLP和机器学习经验，负责开发和优化ThinkForward的AI移民助手，让复杂的移民流程变得简单高效。
                </p>
                <div className="mt-4 flex flex-wrap">
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">人工智能</span>
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">数据分析</span>
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">自动化系统</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <Image 
                  className="object-cover" 
                  src="/images/team-3.jpg" 
                  alt="移民律师"
                  layout="fill"
                />
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-bold text-gray-900">Jessica Wang</h3>
                <p className="text-blue-600 font-medium">首席移民律师</p>
                <p className="mt-4 text-gray-600">
                  加拿大和美国双重执业律师，15年复杂移民案例经验，与AI系统协作处理疑难案例，专注于解决移民申请中的法律挑战。
                </p>
                <div className="mt-4 flex flex-wrap">
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">移民法律</span>
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">上诉案件</span>
                  <span className="m-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">法律顾问</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 加入团队部分 - 新增 */}
          <div className="mt-20 bg-gray-50 rounded-xl shadow-lg overflow-hidden">
            <div className="lg:grid lg:grid-cols-2">
              <div className="px-6 py-12 lg:p-12">
                <h3 className="text-3xl font-bold text-gray-900">加入ThinkForward移民AI大家庭</h3>
                <p className="mt-6 text-lg text-gray-600">
                  我们诚挚欢迎更多资深移民专家加入我们的平台！如果您是:
                </p>
                <ul className="mt-4 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3">持牌移民顾问或拥有丰富移民服务经验的专业人士</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3">愿意拥抱AI技术，提升服务效率和客户体验</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3">热衷于持续学习和创新的行业专家</span>
                  </li>
                </ul>
                <p className="mt-6 text-lg text-gray-600">
                  ThinkForward将为您提供:
                </p>
                <ul className="mt-4 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="ml-3">先进的AI助手工具，大幅提升工作效率</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="ml-3">源源不断的优质客户资源</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="ml-3">行业领先的薪酬和灵活的工作模式</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a href="/consultant/join" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    申请加入顾问团队
                  </a>
                </div>
              </div>
              <div className="relative">
                <Image 
                  className="h-full w-full object-cover" 
                  src="/images/team-collaboration.jpg" 
                  alt="团队协作" 
                  layout="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/30 mix-blend-overlay" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 平台智能特点部分 - 新增 */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">ThinkForward智能平台</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              AI驱动的移民服务新体验
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              我们的平台融合了最前沿的AI技术，为移民服务带来革命性变革，让每一步都更加高效、透明且精准。
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">智能文档管理</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  系统自动整理和分类所有移民文件，智能识别缺失文件并提醒，保持申请材料始终完整有序，节省高达70%的文档准备时间。
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  <span className="flex items-center">
                    客户平均节省时间: 15-20小时
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">自动申请跟踪</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  AI系统实时跟踪申请进度，预测关键节点时间，并在重要日期前自动提醒，确保客户和顾问不会错过任何重要时间点。
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  <span className="flex items-center">
                    申请进度透明度: 100%
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">智能表单助手</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  AI表单助手能自动填充常见信息，并通过智能提示帮助客户完成复杂表格，减少错误率，提高申请效率。
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  <span className="flex items-center">
                    表单完成时间缩短: 65%
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">费用透明系统</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  我们的平台提供全透明的费用结构，客户可以清楚看到每项服务的具体费用，不会有任何隐藏收费，让您的移民预算清晰可控。
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  <span className="flex items-center">
                    平均为客户节省费用: 30%
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">24/7 AI顾问</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  我们的AI顾问全天候在线，能够立即回答90%以上的常见移民问题，为您提供实时支持和指导，不再受时区和工作时间限制。
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  <span className="flex items-center">
                    平均响应时间: &lt;5秒
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">成功率预测分析</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  基于数千个历史案例的深度学习模型，能精确预测不同申请类型的成功概率，助您选择最优移民路径，避免时间和资金浪费。
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  <span className="flex items-center">
                    预测准确率: 93%
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 加入我们的团队部分 - 新增 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                加入ThinkForward移民AI大家庭
              </h2>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                我们正寻找热衷于创新、拥抱AI技术的资深移民专家加入我们的团队。在ThinkForward，您将获得：
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-semibold text-gray-900">前沿AI工具</span> - 使用我们的专属AI系统，将您从繁琐的文书工作中解放出来，专注于高价值咨询服务
                  </p>
                </div>
                <div className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-semibold text-gray-900">更高客户满意度</span> - 通过AI辅助，为客户提供更精准、更高效的服务，赢得更多好评和推荐
                  </p>
                </div>
                <div className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-semibold text-gray-900">提升业务量</span> - 我们的平台每月为顾问平均增加40%的客户咨询量，帮助您实现业务增长
                  </p>
                </div>
                <div className="flex">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-base text-gray-500">
                    <span className="font-semibold text-gray-900">灵活工作方式</span> - 远程办公与线下相结合，借助AI技术，您可以随时随地为客户提供服务
                  </p>
                </div>
              </div>
              <div className="mt-10">
                <a href="/join-our-team" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  了解顾问合作机会
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 grid grid-cols-2 gap-4">
              <div className="col-span-1 space-y-4">
                <div className="overflow-hidden rounded-lg transform transition-all hover:scale-105 shadow-lg">
                  <Image 
                    src="/images/consultant-1.jpg" 
                    alt="移民顾问工作照" 
                    width={300}
                    height={400}
                    className="w-full object-cover h-full"
                  />
                </div>
                <div className="overflow-hidden rounded-lg transform transition-all hover:scale-105 shadow-lg mt-4">
                  <Image 
                    src="/images/consultant-2.jpg" 
                    alt="移民顾问团队会议" 
                    width={300}
                    height={200}
                    className="w-full object-cover h-full"
                  />
                </div>
              </div>
              <div className="col-span-1 pt-8 space-y-4">
                <div className="overflow-hidden rounded-lg transform transition-all hover:scale-105 shadow-lg">
                  <Image 
                    src="/images/consultant-3.jpg" 
                    alt="移民顾问使用AI系统" 
                    width={300}
                    height={250}
                    className="w-full object-cover h-full"
                  />
                </div>
                <div className="overflow-hidden rounded-lg transform transition-all hover:scale-105 shadow-lg mt-4">
                  <Image 
                    src="/images/consultant-4.jpg" 
                    alt="移民顾问与客户交流" 
                    width={300}
                    height={350}
                    className="w-full object-cover h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 成功案例与客户见证 */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            AI助力，成功加倍
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            我们的客户通过ThinkForward平台，享受到了AI+专业顾问的双重优势
          </p>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <Image 
                    src="/images/testimonial-1.jpg" 
                    alt="客户照片" 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">李先生</h4>
                  <p className="text-blue-600">IT工程师 - 快速通道移民</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "ThinkForward的AI系统让我的申请材料准备效率提高了3倍。Bernice团队的专业指导加上AI的效率，让我在8个月内就成功获得了PR，远快于我的同事们。申请过程中随时可以通过AI助手获取即时解答，非常方便。"
              </p>
              <div className="mt-4 flex">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <Image 
                    src="/images/testimonial-2.jpg" 
                    alt="客户照片" 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">张女士</h4>
                  <p className="text-blue-600">留学生 - 工签转永居</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "作为全职工作的留学生，我最担心的就是没有时间处理复杂的移民申请。ThinkForward的AI系统帮我在深夜也能完成文档准备，Bernice团队则在关键时刻提供专业指导。整个过程省去了至少30小时的资料整理时间，让我毫无压力。"
              </p>
              <div className="mt-4 flex">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <Image 
                    src="/images/testimonial-3.jpg" 
                    alt="客户照片" 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">王先生一家</h4>
                  <p className="text-blue-600">企业家 - BC省提名计划</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "我们一家的商业移民案例非常复杂，涉及多家企业和大量财务文件。ThinkForward的AI系统精确分析了所有材料，找出潜在问题并主动提供解决方案。Bernice团队的经验加上AI的高效，为我们节省了至少20万元的顾问费和时间成本。真正的时间就是金钱！"
              </p>
              <div className="mt-4 flex">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 联系我们部分 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">与我们联系</h2>
              <div className="mt-3">
                <p className="text-lg text-gray-500">
                  无论您是想了解更多关于我们的服务，还是准备开始您的移民之旅，我们都随时欢迎您的咨询。
                </p>
              </div>
              <div className="mt-9">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p>+1 (604) 123-4567</p>
                    <p className="mt-1">周一至周五 9AM-6PM (温哥华时间)</p>
                  </div>
                </div>
                <div className="mt-6 flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p>contact@thinkforwardimmigration.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 md:mt-0">
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">温哥华总部</h2>
              <div className="mt-3">
                <p className="text-lg text-gray-500">
                  我们的主要办公室位于温哥华市中心，欢迎预约访问。
                </p>
              </div>
              <div className="mt-9">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1 1 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-500">
                    <p>1234 West Georgia Street</p>
                    <p className="mt-1">Suite 500</p>
                    <p className="mt-1">Vancouver, BC V6E 4E2</p>
                  </div>
                </div>
                <div className="mt-6 border-2 border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2602.6529470281986!2d-123.12757642345364!3d49.283219071122574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5486717f9f804d5b%3A0x8cdcdee2b1987ef5!2sWest%20Georgia%20St%2C%20Vancouver%2C%20BC!5e0!3m2!1sen!2sca!4v1656444473183!5m2!1sen!2sca"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}