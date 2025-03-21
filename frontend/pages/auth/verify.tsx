import React, { useState, useEffect } from 'react';
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
  FormError,
  ErrorNotification,
  LoadingButton,
  Alert,
  VerificationInput
} from '@/components/ui';
import { Breadcrumbs } from '@/components/navigation';
import { useError } from '@/contexts/ErrorContext';

export default function VerifyPage() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const { client } = useClerk();
  const { showErrorMessage } = useError();
  const { token, email } = router.query;
  
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // 处理自动验证（如果URL中有token）
  useEffect(() => {
    if (token && typeof token === 'string' && token.length > 0) {
      verifyWithToken(token);
    }
  }, [token]);
  
  // 处理重发冷却时间
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // 使用token验证
  const verifyWithToken = async (verificationToken: string) => {
    setIsVerifying(true);
    setError('');
    
    try {
      // 使用正确的Clerk API
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}/verify?token=${verificationToken}`);
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      
      setIsVerified(true);
      
      // 延迟后重定向到登录页面
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || t('auth:verify.errors.generic'));
      showErrorMessage(
        err.message || t('auth:verify.errors.generic'),
        t('auth:verify.errors.title')
      );
    } finally {
      setIsVerifying(false);
    }
  };
  
  // 使用验证码验证
  const verifyWithCode = async () => {
    if (verificationCode.length !== 6 || !email) {
      setError(t('auth:verify.errors.invalid_code'));
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    try {
      // 使用Clerk的signIn流程验证邮箱
      const signInAttempt = await client.signIn.create({
        identifier: email as string,
      });
      
      await signInAttempt.attemptFirstFactor({
        strategy: "email_code",
        code: verificationCode
      });
      
      setIsVerified(true);
      
      // 延迟后重定向到登录页面
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || t('auth:verify.errors.generic'));
      showErrorMessage(
        err.errors?.[0]?.message || t('auth:verify.errors.generic'),
        t('auth:verify.errors.title')
      );
    } finally {
      setIsVerifying(false);
    }
  };
  
  // 重新发送验证邮件
  const resendVerification = async () => {
    if (!email || resendCooldown > 0) return;
    
    setError('');
    
    try {
      // 创建新的signIn尝试并发送验证邮件
      const signInAttempt = await client.signIn.create({
        identifier: email as string,
      });
      
      // 获取可用的邮箱ID
      const emailAddressId = signInAttempt.supportedFirstFactors?.find(
        factor => factor.strategy === 'email_code'
      )?.emailAddressId;
      
      if (!emailAddressId) {
        throw new Error('Email verification not available');
      }
      
      await signInAttempt.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId
      });
      
      // 设置60秒冷却时间
      setResendCooldown(60);
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError(err.errors?.[0]?.message || t('auth:verify.errors.resend'));
      showErrorMessage(
        err.errors?.[0]?.message || t('auth:verify.errors.resend'),
        t('auth:verify.errors.resend_title')
      );
    }
  };

  const breadcrumbItems = [
    { label: t('common:navigation.home'), href: '/' },
    { label: t('auth:verify.title') }
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
                  src="/images/verify-email-illustration.jpg"
                  alt={t('auth:verify.illustration_alt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col justify-end p-8">
                  <h2 className="text-white text-3xl font-bold mb-4">
                    {t('auth:verify.welcome_message')}
                  </h2>
                  <p className="text-white text-lg">
                    {t('auth:verify.welcome_description')}
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
                    {t('auth:verify.title')}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {email 
                      ? t('auth:verify.subtitle', { email }) 
                      : t('auth:verify.subtitle_generic')}
                  </p>
                </div>
                
                {!isVerified ? (
                  <div className="space-y-6">
                    {!token && (
                      <>
                        <div className="text-center">
                          <p className="text-gray-700 mb-4">
                            {t('auth:verify.enter_code')}
                          </p>
                          
                          <VerificationInput
                            length={6}
                            value={verificationCode}
                            onChange={setVerificationCode}
                            error={!!error}
                            className="justify-center"
                          />
                          
                          <FormError error={error} className="mt-2" />
                        </div>
                        
                        <LoadingButton
                          onClick={verifyWithCode}
                          variant="primary"
                          size="large"
                          isLoading={isVerifying}
                          loadingText={t('auth:verify.verifying')}
                          fullWidth
                          disabled={verificationCode.length !== 6 || !email}
                        >
                          {t('auth:verify.verify_email')}
                        </LoadingButton>
                        
                        <div className="text-center mt-4">
                          <p className="text-gray-600 mb-2">
                            {t('auth:verify.no_code')}
                          </p>
                          <Button
                            variant="text"
                            onClick={resendVerification}
                            disabled={isVerifying || resendCooldown > 0 || !email}
                          >
                            {resendCooldown > 0
                              ? t('auth:verify.resend_countdown', { seconds: resendCooldown })
                              : t('auth:verify.resend_code')}
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {token && (
                      <div className="text-center py-4">
                        <p className="text-gray-700">
                          {t('auth:verify.verifying_token')}
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Alert 
                      type="success" 
                      className="mb-4" 
                      message={t('auth:verify.verification_success')}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {t('auth:verify.redirecting_login')}
                    </p>
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => router.push('/auth/login')}
                        fullWidth
                      >
                        {t('auth:verify.go_to_login')}
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
