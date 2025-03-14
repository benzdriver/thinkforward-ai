import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import PageHeader from '@/components/ui/PageHeader';
import PlanFeature from '@/components/pricing/PlanFeature';
import SubscriptionForm from '@/components/pricing/SubscriptionForm';
import TestimonialCard from '@/components/pricing/TestimonialCard';
import ValueProposition from '@/components/pricing/ValueProposition';
import { Plan } from '@/types/subscription';

export default function ConsultantPlans() {
  const { t } = useTranslation(['consultant', 'pricing']);
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  
  const plans = [
    {
      id: 'starter',
      name: t('pricing:plans.starter.name'),
      description: t('pricing:plans.starter.description'),
      price: 299,
      features: [
        { name: t('pricing:plans.starter.features.clients'), value: '15' },
        { name: t('pricing:plans.starter.features.ai_assistant'), included: true },
        { name: t('pricing:plans.starter.features.document_automation'), included: true },
        { name: t('pricing:plans.starter.features.client_portal'), included: true },
        { name: t('pricing:plans.starter.features.consultation_tools'), included: true },
        { name: t('pricing:plans.starter.features.advanced_analytics'), included: false },
        { name: t('pricing:plans.starter.features.priority_support'), included: false },
        { name: t('pricing:plans.starter.features.white_label'), included: false }
      ]
    },
    {
      id: 'growth',
      name: t('pricing:plans.growth.name'),
      description: t('pricing:plans.growth.description'),
      price: 599,
      recommended: true,
      features: [
        { name: t('pricing:plans.growth.features.clients'), value: '40' },
        { name: t('pricing:plans.growth.features.ai_assistant'), included: true },
        { name: t('pricing:plans.growth.features.document_automation'), included: true },
        { name: t('pricing:plans.growth.features.client_portal'), included: true },
        { name: t('pricing:plans.growth.features.consultation_tools'), included: true },
        { name: t('pricing:plans.growth.features.advanced_analytics'), included: true },
        { name: t('pricing:plans.growth.features.priority_support'), included: true },
        { name: t('pricing:plans.growth.features.white_label'), included: false }
      ]
    },
    {
      id: 'professional',
      name: t('pricing:plans.professional.name'),
      description: t('pricing:plans.professional.description'),
      price: 999,
      features: [
        { name: t('pricing:plans.professional.features.clients'), value: t('pricing:plans.professional.features.unlimited') },
        { name: t('pricing:plans.professional.features.ai_assistant'), included: true },
        { name: t('pricing:plans.professional.features.document_automation'), included: true },
        { name: t('pricing:plans.professional.features.client_portal'), included: true },
        { name: t('pricing:plans.professional.features.consultation_tools'), included: true },
        { name: t('pricing:plans.professional.features.advanced_analytics'), included: true },
        { name: t('pricing:plans.professional.features.priority_support'), included: true },
        { name: t('pricing:plans.professional.features.white_label'), included: true }
      ]
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowSubscriptionForm(true);
    
    // Scroll to subscription form
    setTimeout(() => {
      document.getElementById('subscription-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };
  
  const handleSubscriptionSuccess = () => {
    router.push('/consultant/dashboard');
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title={t('pricing:header.title')}
          subtitle={t('pricing:header.subtitle')}
        />
        
        {/* Value proposition section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <ValueProposition
            icon={<SparklesIcon className="h-8 w-8 text-blue-500" />}
            title={t('pricing:value.efficiency.title')}
            description={t('pricing:value.efficiency.description')}
          />
          <ValueProposition
            icon={<CheckCircleIcon className="h-8 w-8 text-green-500" />}
            title={t('pricing:value.growth.title')}
            description={t('pricing:value.growth.description')}
          />
          <ValueProposition
            icon={<StarIcon className="h-8 w-8 text-yellow-500" />}
            title={t('pricing:value.expertise.title')}
            description={t('pricing:value.expertise.description')}
          />
        </div>
        
        {/* Pricing cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                plan.recommended ? 'border-2 border-blue-500 relative' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 inset-x-0 px-4 py-1 bg-blue-500 text-white text-center text-sm font-medium">
                  {t('pricing:recommended')}
                </div>
              )}
              
              <div className={`px-6 py-8 ${plan.recommended ? 'pt-10' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/{t('pricing:per_month')}</span>
                </p>
                
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`mt-8 w-full py-3 px-4 rounded-md shadow ${
                    plan.recommended
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 text-gray-700'
                  } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {t('pricing:select_plan')}
                </button>
              </div>
              
              <div className="px-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  {t('pricing:features_included')}
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <PlanFeature
                      key={idx}
                      name={feature.name}
                      included={feature.included}
                      value={feature.value}
                    />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* Subscription form */}
        {showSubscriptionForm && (
          <div id="subscription-form" className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <SubscriptionForm
              selectedPlan={plans.find(p => p.id === selectedPlan) as Plan}
              onSuccess={handleSubscriptionSuccess}
            />
          </div>
        )}
        
        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            {t('pricing:testimonials.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote={t('pricing:testimonials.first.quote')}
              author={t('pricing:testimonials.first.author')}
              role={t('pricing:testimonials.first.role')}
              imageUrl="/images/testimonials/consultant1.jpg"
            />
            <TestimonialCard
              quote={t('pricing:testimonials.second.quote')}
              author={t('pricing:testimonials.second.author')}
              role={t('pricing:testimonials.second.role')}
              imageUrl="/images/testimonials/consultant2.jpg"
            />
            <TestimonialCard
              quote={t('pricing:testimonials.third.quote')}
              author={t('pricing:testimonials.third.author')}
              role={t('pricing:testimonials.third.role')}
              imageUrl="/images/testimonials/consultant3.jpg"
            />
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {t('pricing:faq.title')}
          </h2>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="py-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {t(`pricing:faq.q${item}`)}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {t(`pricing:faq.a${item}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('pricing:cta.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {t('pricing:cta.description')}
          </p>
          <div className="mt-8">
            <button
              onClick={() => handleSelectPlan('growth')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('pricing:cta.button')}
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'consultant', 'pricing'])),
    },
  };
} 