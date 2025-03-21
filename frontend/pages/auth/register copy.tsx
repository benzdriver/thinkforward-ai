import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import { 
  ResponsiveContainer, 
  Grid, 
  GridItem,
  RTLWrapper
} from '@/components/layout';
import { 
  Button, 
  Input, 
  PasswordInput, 
  FormError,
  ErrorNotification,
  LoadingButton,
  Checkbox
} from '@/components/ui';
import { Breadcrumbs } from '@/components/navigation';

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const { register } = useAuth();
  const { showErrorMessage } = useError();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) {
      newErrors.firstName = t('auth:errors.first_name_required');
    }
    
    if (!formData.lastName) {
      newErrors.lastName = t('auth:errors.last_name_required');
    }
    
    if (!formData.email) {
      newErrors.email = t('auth:errors.email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth:errors.email_invalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth:errors.password_required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth:errors.password_too_short');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth:errors.passwords_not_match');
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('auth:errors.terms_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      router.push('/auth/verify-email');
    } catch (error) {
      showErrorMessage(
        t('auth:errors.registration_failed'),
        t('auth:errors.registration_failed_title')
      );
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: t('common:navigation.home'), href: '/' },
    { label: t('auth:register.title') }
  ];

  return (
    <RTLWrapper>
      <ErrorNotification position="top" />
      
      <div className="min-h-screen bg-gray-50">
        <ResponsiveContainer maxWidth="xl" className="py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />
          
          <Grid cols={1} lgCols={2} gap={8} className="items-center">
            <GridItem className="hidden lg:block">
              <div className="relative h-[700px] w-full rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/register-illustration.jpg"
                  alt={t('auth:register.illustration_alt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col justify-end p-8">
                  <h2 className="text-white text-3xl font-bold mb-4">
                    {t('auth:register.welcome_message')}
                  </h2>
                  <p className="text-white text-lg">
                    {t('auth:register.welcome_description')}
                  </p>
                </div>
              </div>
            </GridItem>
            
            <GridItem>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-center mb-8">
                  <Image
                    src="/logo.png"
                    alt="ThinkForward AI"
                    width={180}
                    height={48}
                    className="mx-auto mb-6"
                  />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('auth:register.title')}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {t('auth:register.subtitle')}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Grid cols={1} smCols={2} gap={4}>
                    <GridItem>
                      <Input
                        label={t('auth:register.first_name')}
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={t('auth:register.first_name_placeholder')}
                        error={!!errors.firstName}
                        required
                        fullWidth
                      />
                      <FormError error={errors.firstName} />
                    </GridItem>
                    
                    <GridItem>
                      <Input
                        label={t('auth:register.last_name')}
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={t('auth:register.last_name_placeholder')}
                        error={!!errors.lastName}
                        required
                        fullWidth
                      />
                      <FormError error={errors.lastName} />
                    </GridItem>
                  </Grid>
                  
                  <div>
                    <Input
                      label={t('auth:register.email')}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('auth:register.email_placeholder')}
                      error={!!errors.email}
                      required
                      fullWidth
                    />
                    <FormError error={errors.email} />
                  </div>
                  
                  <div>
                    <PasswordInput
                      label={t('auth:register.password')}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t('auth:register.password_placeholder')}
                      error={!!errors.password}
                      required
                      fullWidth
                    />
                    <FormError error={errors.password} />
                  </div>
                  
                  <div>
                    <PasswordInput
                      label={t('auth:register.confirm_password')}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t('auth:register.confirm_password_placeholder')}
                      error={!!errors.confirmPassword}
                      required
                      fullWidth
                    />
                    <FormError error={errors.confirmPassword} />
                  </div>
                  
                  <div>
                    <Checkbox
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      error={!!errors.agreeTerms}
                      label={
                        <span>
                          {t('auth:register.agree_terms_1')}{' '}
                          <Link
                            href="/terms"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {t('auth:register.terms_of_service')}
                          </Link>{' '}
                          {t('auth:register.and')}{' '}
                          <Link
                            href="/privacy"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {t('auth:register.privacy_policy')}
                          </Link>
                        </span>
                      }
                    />
                    <FormError error={errors.agreeTerms} />
                  </div>
                  
                  <LoadingButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    loadingText={t('auth:register.registering')}
                    fullWidth
                  >
                    {t('auth:register.create_account')}
                  </LoadingButton>
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      {t('auth:register.already_have_account')}{' '}
                      <Link
                        href="/auth/login"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t('auth:register.sign_in')}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </GridItem>
          </Grid>
        </ResponsiveContainer>
      </div>
    </RTLWrapper>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common'])),
    },
  };
}