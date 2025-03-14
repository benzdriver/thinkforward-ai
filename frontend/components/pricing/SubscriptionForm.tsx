import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface Plan {
  id: string;
  name: string;
  price: number;
}

interface SubscriptionFormProps {
  selectedPlan: Plan;
  onSuccess: () => void;
}

export default function SubscriptionForm({ selectedPlan, onSuccess }: SubscriptionFormProps) {
  const { t } = useTranslation('pricing');
  const stripe = useStripe();
  const elements = useElements();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const onSubmit = async (data: any) => {
    if (!stripe || !elements) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // 1. Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error(t('subscription.card_element_missing') as string); 
      }
      
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
        },
      });
      
      if (stripeError) {
        throw new Error(stripeError.message);
      }
      
      // 2. Send to server to create subscription
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planId: selectedPlan.id,
          ...data
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || t('subscription.error_generic'));
      }
      
      // 3. If required, handle additional authentication
      if (result.requiresAction) {
        const { error } = await stripe.confirmCardPayment(result.clientSecret);
        if (error) {
          throw new Error(error.message);
        }
      }
      
      // 4. Subscription successful
      onSuccess();
      
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('subscription.complete_subscription')}
      </h2>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          {t('subscription.selected_plan')}: <span className="font-semibold">{selectedPlan.name}</span> - 
          ${selectedPlan.price}/{t('per_month')}
        </p>
      </div>
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              {t('subscription.first_name')}
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="firstName"
                {...register('firstName', { required: true })}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.firstName ? 'border-red-300' : ''
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {t('subscription.required_field')}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              {t('subscription.last_name')}
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="lastName"
                {...register('lastName', { required: true })}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.lastName ? 'border-red-300' : ''
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {t('subscription.required_field')}
                </p>
              )}
            </div>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('subscription.email')}
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                })}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.email ? 'border-red-300' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.type === 'pattern' 
                    ? t('subscription.valid_email') 
                    : t('subscription.required_field')}
                </p>
              )}
            </div>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              {t('subscription.company_name')}
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="companyName"
                {...register('companyName', { required: true })}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.companyName ? 'border-red-300' : ''
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {t('subscription.required_field')}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('subscription.payment_details')}
          </label>
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !stripe}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? t('subscription.processing') 
              : t('subscription.start_subscription')}
          </button>
        </div>
      </form>
    </div>
  );
} 