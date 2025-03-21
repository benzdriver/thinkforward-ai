import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Image from 'next/image';
import { useClerk } from '@clerk/nextjs';
import { 
  ResponsiveContainer, 
  Grid, 
  GridItem,
  RTLWrapper
} from '@/components/layout';
import { 
  Button, 
  Input, 
  FormError,
  ErrorNotification,
  LoadingButton,
  Alert
} from '@/components/ui';
import { Breadcrumbs } from '@/components/navigation';
import { useError } from '@/contexts/ErrorContext';

export default function ForgotPasswordPage() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const { client } = useClerk();
  const { showErrorMessage } = useError();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = t('auth:errors.email_required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth:errors.email_invalid');
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
      // 使用 Clerk 的密码重置功能
      await client.signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      showErrorMessage(
        error.errors?.[0]?.message || t('auth:errors.forgot_password_failed'),
        t('auth:errors.forgot_password_failed_title')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: t('common:navigation.home'), href: '/' },
    { label: t('common:navigation.login'), href: '/auth/login' },
    { label: t('auth:forgot_password.title') }
  ];

  return (
    <RTLWrapper>
      <ErrorNotification position="top" />
      
      <div className="min-h-screen bg-gray-50">
        <ResponsiveContainer maxWidth="xl" className="py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />
          
          <Grid cols={1} lgCols={2} gap={8} className="items-center">
            <GridItem className="hidden lg:block">
              <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/forgot-password-illustration.jpg"
                  alt={t('auth:forgot_password.illustration_alt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col justify-end p-8">
                  <h2 className="text-white text-3xl font-bold mb-4">
                    {t('auth:forgot_password.welcome_message')}
                  </h2>
                  <p className="text-white text-lg">
                    {t('auth:forgot_password.welcome_description')}
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
                    {t('auth:forgot_password.title')}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {t('auth:forgot_password.subtitle')}
                  </p>
                </div>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        label={t('auth:forgot_password.email')}
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth:forgot_password.email_placeholder')}
                        error={!!errors.email}
                        required
                        fullWidth
                      />
                      <FormError error={errors.email} />
                    </div>
                    
                    <LoadingButton
                      type="submit"
                      variant="primary"
                      size="large"
                      isLoading={isLoading}
                      loadingText={t('auth:forgot_password.sending')}
                      fullWidth
                    >
                      {t('auth:forgot_password.reset_password')}
                    </LoadingButton>
                    
                    <div className="text-center mt-6">
                      <p className="text-gray-600">
                        <Link
                          href="/auth/login"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {t('auth:forgot_password.back_to_login')}
                        </Link>
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <Alert 
                      type="success" 
                      className="mb-4" 
                      message={t('auth:forgot_password.check_email')}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {t('auth:forgot_password.email_sent_to', { email })}
                    </p>
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => router.push('/auth/login')}
                        fullWidth
                      >
                        {t('auth:forgot_password.back_to_login')}
                      </Button>
                    </div>
                  </div>
                )}
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
