import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PublicLayout, 
  ResponsiveContainer, 
  Grid, 
  GridItem 
} from '@/components/layout';
import { 
  Button, 
  Avatar, 
  LanguageSwitcher,
  CustomTabs as Tabs,
  TabPanel,
  Modal
} from '@/components/ui';
import { 
  ResponsiveNavigation 
} from '@/components/navigation';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  PlayIcon,
  LightBulbIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// 导航项
const navigationItems = [
  { key: 'home', label: 'navigation.home', href: '/' },
  { key: 'features', label: 'navigation.features', href: '/features' },
  { key: 'pricing', label: 'navigation.pricing', href: '/pricing' },
  { key: 'about', label: 'navigation.about', href: '/about' },
  { key: 'contact', label: 'navigation.contact', href: '/contact' },
];

// 特性列表 - 更新并扩展
const features = [
  {
    title: 'features.ai_powered.title',
    description: 'features.ai_powered.description',
    longDescription: 'features.ai_powered.long_description',
    icon: <DocumentTextIcon className="h-12 w-12 text-blue-500" />,
    image: '/images/features/ai-powered.webp',
  },
  {
    title: 'features.collaboration.title',
    description: 'features.collaboration.description',
    longDescription: 'features.collaboration.long_description',
    icon: <UserGroupIcon className="h-12 w-12 text-blue-500" />,
    image: '/images/features/collaboration.webp',
  },
  {
    title: 'features.communication.title',
    description: 'features.communication.description',
    longDescription: 'features.communication.long_description',
    icon: <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-500" />,
    image: '/images/features/communication.webp',
  },
  {
    title: 'features.analytics.title',
    description: 'features.analytics.description',
    longDescription: 'features.analytics.long_description',
    icon: <ChartBarIcon className="h-12 w-12 text-blue-500" />,
    image: '/images/features/analytics.webp',
  },
  {
    title: 'features.security.title',
    description: 'features.security.description',
    longDescription: 'features.security.long_description',
    icon: <ShieldCheckIcon className="h-12 w-12 text-blue-500" />,
    image: '/images/features/security.webp',
  },
];

// 工作流程步骤 - 新增
const workflowSteps = [
  {
    number: 1,
    title: 'workflow.step1.title',
    description: 'workflow.step1.description',
    icon: <LightBulbIcon className="h-8 w-8 text-blue-500" />,
  },
  {
    number: 2,
    title: 'workflow.step2.title',
    description: 'workflow.step2.description',
    icon: <CogIcon className="h-8 w-8 text-blue-500" />,
  },
  {
    number: 3,
    title: 'workflow.step3.title',
    description: 'workflow.step3.description',
    icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />,
  },
  {
    number: 4,
    title: 'workflow.step4.title',
    description: 'workflow.step4.description',
    icon: <ChartBarIcon className="h-8 w-8 text-blue-500" />,
  },
];

// 客户评价 - 更新
const testimonials = [
  {
    quote: 'testimonials.quote1',
    author: 'Sarah Johnson',
    role: 'testimonials.role1',
    company: 'testimonials.company1',
    avatar: '/images/testimonials/testimonial1.jpg',
    logo: '/images/brands/brand1.svg',
  },
  {
    quote: 'testimonials.quote2',
    author: 'Michael Chen',
    role: 'testimonials.role2',
    company: 'testimonials.company2',
    avatar: '/images/testimonials/testimonial2.jpg',
    logo: '/images/brands/brand2.svg',
  },
  {
    quote: 'testimonials.quote3',
    author: 'Elena Rodriguez',
    role: 'testimonials.role3',
    company: 'testimonials.company3',
    avatar: '/images/testimonials/testimonial3.jpg',
    logo: '/images/brands/brand3.svg',
  },
  {
    quote: 'testimonials.quote4',
    author: 'David Kim',
    role: 'testimonials.role4',
    company: 'testimonials.company4',
    avatar: '/images/testimonials/testimonial4.jpg',
    logo: '/images/brands/brand4.svg',
  },
];

// 在价格方案类型中添加 popular 属性
interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  highlighted: boolean;
  popular?: boolean;  // 添加 popular 属性
  badge?: string;
  customizable?: boolean;
  href: string;  // 添加 href 属性
}

// 更新方案配置
const pricingPlans = [
  {
    name: 'pricing.basic.name',
    price: 'pricing.basic.price',
    billing: 'pricing.basic.billing',
    description: 'pricing.basic.description',
    features: [
      'pricing.basic.feature1',
      'pricing.basic.feature2',
      'pricing.basic.feature3',
      'pricing.basic.feature4',
      'pricing.basic.feature5',
    ],
    limitations: [
      'pricing.basic.limitation1',
      'pricing.basic.limitation2',
    ],
    cta: 'pricing.basic.cta',
    highlighted: false,
    popular: false, // 添加 popular 属性
    href: '/pricing/basic',  // 添加具体路径
  },
  {
    name: 'pricing.pro.name',
    price: 'pricing.pro.price',
    billing: 'pricing.pro.billing',
    description: 'pricing.pro.description',
    features: [
      'pricing.pro.feature1',
      'pricing.pro.feature2',
      'pricing.pro.feature3',
      'pricing.pro.feature4',
      'pricing.pro.feature5',
      'pricing.pro.feature6',
    ],
    limitations: [],
    cta: 'pricing.pro.cta',
    highlighted: true,
    popular: true, // 标记为热门
    badge: 'pricing.most_popular',
    href: '/pricing/pro',
  },
  {
    name: 'pricing.enterprise.name',
    price: 'pricing.enterprise.price',
    billing: 'pricing.enterprise.billing',
    description: 'pricing.enterprise.description',
    features: [
      'pricing.enterprise.feature1',
      'pricing.enterprise.feature2',
      'pricing.enterprise.feature3',
      'pricing.enterprise.feature4',
      'pricing.enterprise.feature5',
      'pricing.enterprise.feature6',
      'pricing.enterprise.feature7',
    ],
    limitations: [],
    cta: 'pricing.enterprise.cta',
    highlighted: false,
    customizable: true,
    href: '/pricing/enterprise',
  },
];

// 品牌 - 更新
const brands = [
  { name: 'Microsoft', logo: '/images/brands/microsoft.svg' },
  { name: 'Google', logo: '/images/brands/google.svg' },
  { name: 'Amazon', logo: '/images/brands/amazon.svg' },
  { name: 'IBM', logo: '/images/brands/ibm.svg' },
  { name: 'Oracle', logo: '/images/brands/oracle.svg' },
  { name: 'Salesforce', logo: '/images/brands/salesforce.svg' },
];

// 在页面组件前添加 FAQ 配置
const faqs = [
  {
    question: 'faq.question1',
    answer: 'faq.answer1',
  },
  {
    question: 'faq.question2',
    answer: 'faq.answer2',
  },
  {
    question: 'faq.question3',
    answer: 'faq.answer3',
  },
  {
    question: 'faq.question4',
    answer: 'faq.answer4',
  },
];

export default function HomePage() {
  const { t } = useTranslation('home');
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    policy: false,
  });
  
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setContactForm({
      ...contactForm,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加表单提交逻辑
    alert(t('contact.success_message'));
    setContactForm({
      name: '',
      email: '',
      company: '',
      message: '',
      policy: false,
    });
  };

  return (
    <PublicLayout
      title={t('meta.title') as string}
      description={t('meta.description') as string}
      navigation={
        <ResponsiveNavigation 
          items={navigationItems}
          actions={
            <div className="flex items-center space-x-4">
              <LanguageSwitcher className="hidden md:block" />
              <Link href="/login" passHref>
                <Button variant="outline">{t('navigation.sign_in')}</Button>
              </Link>
            </div>
          }
        />
      }
    >
      {/* Hero Section - 更新 */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <ResponsiveContainer>
          <Grid cols={1} mdCols={2} gap={8} className="items-center">
            <GridItem>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('hero.title')}
                <span className="text-blue-600 block mt-2">{t('hero.highlight')}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="px-8 py-4 text-lg"
                  onClick={() => setShowDemoModal(true)}
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  {t('hero.watch_demo')}
                </Button>
                <Link href="/signup" passHref>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    {t('hero.get_started')}
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2 mr-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar 
                      key={i}
                      src={`/images/avatars/user${i}.jpg`}
                      alt={`User ${i}`}
                      size="sm"
                      className="border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold text-blue-600">5,000+</span> {t('hero.users_count')}
                </div>
              </div>
            </GridItem>
            <GridItem className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <Image
                  src="/images/hero-dashboard.webp"
                  alt="ThinkForward AI Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">{t('hero.live_feature')}</p>
                </div>
                <p className="text-xs text-gray-600">{t('hero.live_feature_description')}</p>
              </div>
            </GridItem>
          </Grid>
          
          {/* Stats */}
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: '98%', label: 'hero.stats.satisfaction' },
              { value: '24/7', label: 'hero.stats.support' },
              { value: '150+', label: 'hero.stats.integrations' },
              { value: '99.9%', label: 'hero.stats.uptime' },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{t(stat.label)}</div>
              </div>
            ))}
          </div>
        </ResponsiveContainer>
      </section>

      {/* Brands Section - 移动到Hero下方 */}
      <section className="py-12 bg-white border-b border-gray-100">
        <ResponsiveContainer>
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-700">
              {t('trusted_by')}
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {brands.map((brand, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
              <Image 
                src={brand.logo} 
                alt={brand.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </section>

    {/* Features Section - 改进 */}
    <section className="py-16 md:py-24 bg-white" id="features">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="tab0" className="mb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {features.map((feature, index) => (
              <TabPanel 
                key={index.toString()} 
                value={`tab${index}`}
                label={t(feature.title) as string}
                icon={feature.icon}
              >
                <Grid cols={1} mdCols={2} gap={8} className="items-center">
                  <GridItem className={index % 2 === 0 ? 'order-1 md:order-1' : 'order-1 md:order-2'}>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {t(feature.title)}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {t(feature.description)}
                    </p>
                    <div className="text-gray-700 mb-8">
                      {t(feature.longDescription)}
                    </div>
                    <Link href="/features" passHref>
                      <Button variant="outline" size="md">
                        {t('features.learn_more')}
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </GridItem>
                  <GridItem className={index % 2 === 0 ? 'order-2 md:order-2' : 'order-2 md:order-1'}>
                    <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                      <Image
                        src={feature.image}
                        alt={t(feature.title)}
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
                    </div>
                  </GridItem>
                </Grid>
              </TabPanel>
            ))}
          </div>
        </Tabs>

        <div className="text-center mt-12">
          <Link href="/features" passHref>
            <Button variant="primary" size="lg">
              {t('features.explore_all')}
            </Button>
          </Link>
        </div>
      </ResponsiveContainer>
    </section>

    {/* How It Works Section - 改进 */}
    <section className="py-16 md:py-24 bg-gray-50" id="how-it-works">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('workflow.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('workflow.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* 连接线 */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-120px)] bg-blue-200 hidden md:block"></div>
          
          <Grid cols={1} mdCols={2} gap={8} className="gap-[16px] relative">
            {workflowSteps.map((step, index) => (
              <GridItem key={index} className={index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'}>
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 relative">
                  {/* 步骤数字 */}
                  <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {step.number}
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t(step.title)}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {t(step.description)}
                  </p>
                  
                  <Link href="/how-it-works" className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                    {t('workflow.learn_more')}
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </GridItem>
            ))}
          </Grid>
        </div>

        <div className="text-center mt-16">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowDemoModal(true)}
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            {t('workflow.watch_demo')}
          </Button>
        </div>
      </ResponsiveContainer>
    </section>

    {/* Testimonials Section - 改进 */}
    <section className="py-16 md:py-24 bg-white" id="testimonials">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-6">
                <Image 
                  src={testimonial.logo}
                  alt={t(testimonial.company)}
                  width={100}
                  height={40}
                  className="h-8 w-auto mr-4"
                />
              </div>
              
              <p className="text-gray-700 mb-6 text-lg italic">
                "{t(testimonial.quote)}"
              </p>
              
              <div className="flex items-center">
                <Avatar 
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  size="md"
                  className="mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">
                    {t(testimonial.role)}, {t(testimonial.company)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/case-studies" passHref>
            <Button variant="outline" size="lg">
              {t('testimonials.view_case_studies')}
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </ResponsiveContainer>
    </section>

    {/* Pricing Section - 改进 */}
    <section className="py-16 md:py-24 bg-gray-50" id="pricing">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden border ${
                plan.popular ? 'border-blue-500' : 'border-gray-200'
              } flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-2">
                  {t('pricing.most_popular')}
                </div>
              )}
              
              <div className="p-6 flex-grow flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t(plan.name)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t(plan.description)}
                  </p>
                  
                  <div className="text-4xl font-bold text-gray-900 mb-6">
                    {plan.name === 'Enterprise' ? t(plan.price) : `$${t(plan.price)}`}
                    <span className="text-lg font-normal text-gray-600">/{t('pricing.per_month')}</span>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{t(feature)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto pt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full transition-colors duration-200 bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-md"
                  >
                    {t('pricing.get_started')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {t('pricing.enterprise.title')}
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            {t('pricing.enterprise.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              'pricing.enterprise.feature1',
              'pricing.enterprise.feature2',
              'pricing.enterprise.feature3',
              'pricing.enterprise.feature4',
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{t(feature)}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/contact" passHref>
              <Button variant="primary" size="lg">
                {t('pricing.enterprise.contact_us')}
              </Button>
            </Link>
          </div>
        </div>
      </ResponsiveContainer>
    </section>

    {/* FAQ Section - 新增 */}
    <section className="py-16 md:py-24 bg-white" id="faq">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6 border-b border-gray-200 pb-6 last:border-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(faq.question)}
              </h3>
              <div className="text-gray-700">
                {t(faq.answer)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            {t('faq.more_questions')}
          </p>
          <Link href="/contact" passHref>
            <Button variant="outline" size="md">
              {t('faq.contact_support')}
            </Button>
          </Link>
        </div>
      </ResponsiveContainer>
    </section>

    {/* Contact Section - 新增 */}
    <section className="py-16 md:py-24 bg-gray-50" id="contact">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <Grid cols={1} mdCols={2} gap={8}>
          <GridItem>
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.form_title')}
              </h3>
              
              <form onSubmit={handleContactFormSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="policy"
                      name="policy"
                      checked={contactForm.policy}
                      onChange={(e) => setContactForm({...contactForm, policy: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="policy" className="ml-2 block text-sm text-gray-600">
                      {t('contact.form.policy')} *
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {t('contact.form.submit')}
                  </Button>
                </div>
              </form>
            </div>
          </GridItem>
          
          <GridItem>
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info_title')}
              </h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('contact.info.email_title')}
                  </h4>
                  <p className="text-gray-600">
                    <a href="mailto:support@thinkforwardai.com" className="text-blue-600 hover:text-blue-700">
                      support@thinkforwardai.com
                    </a>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('contact.info.phone_title')}
                  </h4>
                  <p className="text-gray-600">
                    <a href="tel:+16049085538" className="text-blue-600 hover:text-blue-700">
                      +1 (604) 908-5538
                    </a>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('contact.info.office_title')}
                  </h4>
                  <p className="text-gray-600">
                    6060 Silver Dr<br />
                    Burnaby, BC V5H 0H5<br />
                    Canada
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('contact.info.hours_title')}
                  </h4>
                  <p className="text-gray-600">
                    {t('contact.info.hours_value')}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('contact.info.social_title')}
                </h4>
                <div className="flex space-x-4">
                  {[
                    { name: 'Twitter', href: 'https://twitter.com/thinkforwardai' },
                    { name: 'LinkedIn', href: 'https://linkedin.com/company/thinkforwardai' },
                    { name: 'Facebook', href: 'https://facebook.com/thinkforwardai' },
                    { name: 'Instagram', href: 'https://instagram.com/thinkforwardai' },
                  ].map((social) => (
                    <a 
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                    >
                      <span className="sr-only">{social.name}</span>
                      {/* 这里可以添加社交媒体图标 */}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </GridItem>
        </Grid>
      </ResponsiveContainer>
    </section>

    {/* CTA Section - 改进 */}
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <ResponsiveContainer>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" passHref>
              <Button 
                variant="white" 
                size="lg"
                className="px-8 py-4 text-lg"
              >
                {t('cta.primary_button')}
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button 
                variant="outline-white" 
                size="lg"
                className="px-8 py-4 text-lg"
              >
                {t('cta.secondary_button')}
              </Button>
            </Link>
          </div>
        </div>
      </ResponsiveContainer>
    </section>

    {/* Demo Modal */}
    <Modal
      isOpen={showDemoModal}
      onClose={() => setShowDemoModal(false)}
      title={t('demo_modal.title')}
    >
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="ThinkForward AI Demo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="mt-6">
        <p className="text-gray-700 mb-4">
          {t('demo_modal.description')}
        </p>
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={() => setShowDemoModal(false)}
          >
            {t('demo_modal.close')}
          </Button>
        </div>
      </div>
    </Modal>
  </PublicLayout>
)};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'home',
        'navigation',
      ])),
    },
  };
};