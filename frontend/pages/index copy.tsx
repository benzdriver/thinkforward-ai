import React from 'react';
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
  LanguageSwitcher 
} from '@/components/ui';
import { 
  ResponsiveNavigation 
} from '@/components/navigation';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

// 导航项
const navigationItems = [
  { key: 'home', label: 'navigation.home', href: '/' },
  { key: 'features', label: 'navigation.features', href: '/features' },
  { key: 'pricing', label: 'navigation.pricing', href: '/pricing' },
  { key: 'about', label: 'navigation.about', href: '/about' },
  { key: 'contact', label: 'navigation.contact', href: '/contact' },
];

// 特性列表
const features = [
  {
    title: 'features.ai_powered.title',
    description: 'features.ai_powered.description',
    icon: <DocumentTextIcon className="h-12 w-12 text-blue-500" />,
  },
  {
    title: 'features.collaboration.title',
    description: 'features.collaboration.description',
    icon: <UserGroupIcon className="h-12 w-12 text-blue-500" />,
  },
  {
    title: 'features.communication.title',
    description: 'features.communication.description',
    icon: <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-500" />,
  },
];

// 客户评价
const testimonials = [
  {
    quote: 'testimonials.quote1',
    author: 'Sarah Johnson',
    role: 'testimonials.role1',
    avatar: '/avatars/testimonial1.jpg',
  },
  {
    quote: 'testimonials.quote2',
    author: 'Michael Chen',
    role: 'testimonials.role2',
    avatar: '/avatars/testimonial2.jpg',
  },
  {
    quote: 'testimonials.quote3',
    author: 'Elena Rodriguez',
    role: 'testimonials.role3',
    avatar: '/avatars/testimonial3.jpg',
  },
];

// 定价方案
const pricingPlans = [
  {
    name: 'pricing.basic.name',
    price: 'pricing.basic.price',
    description: 'pricing.basic.description',
    features: [
      'pricing.basic.feature1',
      'pricing.basic.feature2',
      'pricing.basic.feature3',
    ],
    cta: 'pricing.basic.cta',
    highlighted: false,
  },
  {
    name: 'pricing.pro.name',
    price: 'pricing.pro.price',
    description: 'pricing.pro.description',
    features: [
      'pricing.pro.feature1',
      'pricing.pro.feature2',
      'pricing.pro.feature3',
      'pricing.pro.feature4',
    ],
    cta: 'pricing.pro.cta',
    highlighted: true,
  },
  {
    name: 'pricing.enterprise.name',
    price: 'pricing.enterprise.price',
    description: 'pricing.enterprise.description',
    features: [
      'pricing.enterprise.feature1',
      'pricing.enterprise.feature2',
      'pricing.enterprise.feature3',
      'pricing.enterprise.feature4',
      'pricing.enterprise.feature5',
    ],
    cta: 'pricing.enterprise.cta',
    highlighted: false,
  },
];

export default function HomePage() {
  // 明确指定使用 home 命名空间作为默认命名空间
  const { t } = useTranslation('home');
  
  return (
    <PublicLayout
      titleKey="meta.title"
      defaultTitle="ThinkForward AI - Intelligent Solutions for Your Business"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <ResponsiveContainer>
          <div className="py-20 md:py-28">
            <Grid cols={1} mdCols={2} gap={8} className="items-center">
              <GridItem>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {t('hero.title')}
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    variant="primary" 
                    className="bg-white text-blue-700 hover:bg-blue-50"
                  >
                    {t('hero.cta_primary')}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-blue-700"
                  >
                    {t('hero.cta_secondary')}
                  </Button>
                </div>
              </GridItem>
              <GridItem className="hidden md:block">
                <div className="relative h-96">
                  <Image 
                    src="/images/hero-illustration.svg" 
                    alt="ThinkForward AI Platform" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </GridItem>
            </Grid>
          </div>
        </ResponsiveContainer>
      </div>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <Grid cols={1} mdCols={3} gap={8}>
            {features.map((feature, index) => (
              <GridItem key={index}>
                <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {t(feature.title)}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {t(feature.description)}
                  </p>
                </div>
              </GridItem>
            ))}
          </Grid>
        </ResponsiveContainer>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('how_it_works.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('how_it_works.subtitle')}
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 -translate-y-1/2 z-0"></div>
            <Grid cols={1} mdCols={3} gap={8} className="relative z-10">
              {[1, 2, 3].map((step) => (
                <GridItem key={step}>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
                      {step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center">
                      {t(`how_it_works.step${step}.title`)}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {t(`how_it_works.step${step}.description`)}
                    </p>
                  </div>
                </GridItem>
              ))}
            </Grid>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>
          
          <Grid cols={1} mdCols={3} gap={8}>
            {testimonials.map((testimonial, index) => (
              <GridItem key={index}>
                <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
                  <div className="mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 flex-grow">
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
                      <p className="text-gray-500 text-sm">{t(testimonial.role)}</p>
                    </div>
                  </div>
                </div>
              </GridItem>
            ))}
          </Grid>
        </ResponsiveContainer>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
          
          <Grid cols={1} mdCols={3} gap={8}>
            {pricingPlans.map((plan, index) => (
              <GridItem key={index}>
                <div className={`h-full flex flex-col p-8 rounded-xl border ${
                  plan.highlighted 
                    ? 'border-blue-500 shadow-lg relative' 
                    : 'border-gray-200 shadow-sm'
                }`}>
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      {t('pricing.popular')}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t(plan.name)}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{t(plan.price)}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <p className="text-gray-600 mb-6">{t(plan.description)}</p>
                  <ul className="mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start mb-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    fullWidth
                    className={plan.highlighted ? 'bg-blue-600' : ''}
                  >
                    {t(plan.cta)}
                  </Button>
                </div>
              </GridItem>
            ))}
          </Grid>
        </ResponsiveContainer>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <ResponsiveContainer>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="primary" 
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                {t('cta.button_primary')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-blue-700"
              >
                {t('cta.button_secondary')}
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('faq.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t(`faq.q${item}`)}
                    </h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">
                      {t(`faq.a${item}`)}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              {t('faq.more_questions')}
            </p>
            <Link href="/contact" passHref>
              <Button variant="outline" className="inline-flex items-center">
                {t('faq.contact_us')}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Brands Section */}
      <section className="py-12 md:py-16">
        <ResponsiveContainer>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('trusted_by')}
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((brand) => (
              <div key={brand} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image 
                  src={`/images/brands/brand${brand}.svg`} 
                  alt={`Brand ${brand}`} 
                  width={120} 
                  height={40} 
                  className="h-8 md:h-10 w-auto"
                />
              </div>
            ))}
          </div>
        </ResponsiveContainer>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <ResponsiveContainer>
          <Grid cols={1} mdCols={2} gap={8} className="items-center">
            <GridItem>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('newsletter.title')}
              </h2>
              <p className="text-lg text-gray-300 mb-0">
                {t('newsletter.description')}
              </p>
            </GridItem>
            <GridItem>
              <div className="bg-gray-800 p-6 rounded-lg">
                <form className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    placeholder={t('newsletter.placeholder') as string}
                    className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Button 
                    type="submit" 
                    variant="primary"
                    className="whitespace-nowrap"
                  >
                    {t('newsletter.button')}
                  </Button>
                </form>
                <p className="text-sm text-gray-400 mt-3">
                  {t('newsletter.privacy_note')}
                </p>
              </div>
            </GridItem>
          </Grid>
        </ResponsiveContainer>
      </section>
    </PublicLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'home'])),
    },
  };
};