import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Image from 'next/image';
import { useSignIn } from '@clerk/nextjs';
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
import { useError } from '@/contexts/ErrorContext';

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { showErrorMessage } = useError();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { redirect, verified } = router.query;

  // 显示验证成功消息
  useEffect(() => {
    if (verified === 'true') {
      showErrorMessage(
        t('auth:login.verification_success_message') as string,
        t('auth:login.verification_success_title') as string
      );
    }
  }, [verified, showErrorMessage, t]);

  // 确保Clerk已加载
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // 设置活跃会话
        await setActive({ session: result.createdSessionId });
        
        // 重定向到指定页面或默认到仪表板
        const redirectPath = typeof redirect === 'string' ? redirect : '/dashboard';
        router.push(redirectPath);
      } else {
        // 处理多因素认证或其他情况
        console.log('Sign in needs more steps:', result);
        
        // 如果需要验证邮箱
        if (result.status === 'needs_first_factor') {
          router.push('/auth/verify?email=' + encodeURIComponent(email));
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      showErrorMessage(
        error.errors?.[0]?.message || t('auth:errors.login_failed'),
        t('auth:errors.login_failed_title') as string
      );
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
              <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
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
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Checkbox
                      id="remember-me"
                      label={t('auth:login.remember_me') as string}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    
                    <div className="text-sm">
                      <Link
                        href="/auth/forgot-password"
                        className="text-blue-600 hover:text-blue-800 font-medium"
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
