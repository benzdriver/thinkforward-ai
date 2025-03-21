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
  LoadingButton
} from '@/components/ui';
import { Breadcrumbs } from '@/components/navigation';

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const { signIn } = useAuth();
  const { showErrorMessage } = useError();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { redirect } = router.query;

  const validateForm = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = t('auth:errors.email_required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth:errors.email_invalid');
    }
    
    if (!password) {
      newErrors.password = t('auth:errors.password_required');
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
      await signIn(email, password);
      
      // 重定向到指定页面或默认到仪表板
      const redirectPath = typeof redirect === 'string' ? redirect : '/dashboard';
      router.push(redirectPath);
    } catch (error) {
      showErrorMessage(
        t('auth:errors.login_failed') as string,
        t('auth:errors.login_failed_title') as string
      );
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: t('common:navigation.home'), href: '/' },
    { label: t('auth:login.title') }
  ];

  return (
    <RTLWrapper>
      <ErrorNotification position="top" />
      
      <div className="min-h-screen bg-gray-50">
        <ResponsiveContainer maxWidth="xl" className="py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />
          
          <Grid cols={1} lgCols={2} gap={8} className="items-center">
            <GridItem className="hidden lg:block">
              <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/login-illustration.jpg"
                  alt={t('auth:login.illustration_alt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col justify-end p-8">
                  <h2 className="text-white text-3xl font-bold mb-4">
                    {t('auth:login.welcome_message')}
                  </h2>
                  <p className="text-white text-lg">
                    {t('auth:login.welcome_description')}
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
                    {t('auth:login.title')}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {t('auth:login.subtitle')}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      label={t('auth:login.email') as string}
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth:login.email_placeholder') as string}
                      error={!!errors.email}
                      required
                      fullWidth
                    />
                    <FormError error={errors.email} />
                  </div>
                  
                  <div>
                    <PasswordInput
                      label={t('auth:login.password') as string}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth:login.password_placeholder') as string}
                      error={!!errors.password}
                      required
                      fullWidth
                    />
                    <FormError error={errors.password} />
                    
                    <div className="mt-2 text-right">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {t('auth:login.forgot_password')}
                      </Link>
                    </div>
                  </div>
                  
                  <LoadingButton
                    type="submit"
                    variant="primary"
                    size="large"
                    isLoading={isLoading}
                    loadingText={t('auth:login.signing_in') as string}
                    fullWidth
                  >
                    {t('auth:login.sign_in')}
                  </LoadingButton>
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      {t('auth:login.no_account')}{' '}
                      <Link
                        href="/auth/register"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t('auth:login.sign_up')}
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
