import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Image from 'next/image';
import { useSignUp } from '@clerk/nextjs';
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
  RadioGroup,
  VerificationInput,
  Alert,
  Card,
  Stepper,
  RadioOption
} from '@/components/ui';
import { Breadcrumbs } from '@/components/navigation';
import { useError } from '@/contexts/ErrorContext';

// 注册步骤枚举
enum STEPS {
  ACCOUNT = 0,
  PROFILE = 1,
  VERIFICATION = 2
}

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const { showErrorMessage } = useError();
  
  // 表单状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('client'); // 'client' 或 'consultant'
  const [verificationCode, setVerificationCode] = useState('');
  
  // UI状态
  const [currentStep, setCurrentStep] = useState(STEPS.ACCOUNT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 确保Clerk已加载
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // 验证账户表单
  const validateAccountForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = t('auth:errors.email_required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth:errors.email_invalid');
    }
    
    if (!password) {
      newErrors.password = t('auth:errors.password_required');
    } else if (password.length < 8) {
      newErrors.password = t('auth:errors.password_too_short');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 验证个人资料表单
  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName) {
      newErrors.firstName = t('auth:errors.first_name_required');
    }
    
    if (!lastName) {
      newErrors.lastName = t('auth:errors.last_name_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 验证验证码表单
  const validateVerificationForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!verificationCode) {
      newErrors.verificationCode = t('auth:errors.verification_code_required');
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = t('auth:errors.verification_code_invalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理账户信息提交
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccountForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      
      // 进入个人资料步骤
      setCurrentStep(STEPS.PROFILE);
    } catch (err: any) {
      console.error('Registration error:', err);
      showErrorMessage(
        err.errors?.[0]?.message || t('auth:errors.registration_failed') as string,
        t('auth:errors.registration_failed_title') as string
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理个人资料提交
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp.update({
        firstName,
        lastName,
        unsafeMetadata: {
          role
        }
      });
      
      // 发送验证邮件
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // 进入验证步骤
      setCurrentStep(STEPS.VERIFICATION);
    } catch (err: any) {
      console.error('Profile update error:', err);
      showErrorMessage(
        err.errors?.[0]?.message || t('auth:errors.profile_update_failed') as string,
        t('auth:errors.profile_update_failed_title') as string
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理验证码提交
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVerificationForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      if (completeSignUp.status === 'complete') {
        // 注册成功，重定向到登录页面
        router.push('/auth/login?verified=true');
      } else {
        console.log('Verification not complete:', completeSignUp);
        showErrorMessage(
          t('auth:errors.verification_incomplete') as string,
          t('auth:errors.verification_incomplete_title') as string
        );
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      showErrorMessage(
        err.errors?.[0]?.message || t('auth:errors.verification_failed') as string,
        t('auth:errors.verification_failed_title') as string
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // 渲染步骤指示器
  const renderStepIndicator = () => {
    const steps = [
      { label: t('auth:register.steps.account') },
      { label: t('auth:register.steps.profile') },
      { label: t('auth:register.steps.verification') }
    ];
    
    return (
      <Stepper 
        steps={steps} 
        currentStep={currentStep} 
        className="mb-8" 
      />
    );
  };
  
  // 渲染当前步骤的表单
  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.ACCOUNT:
        return (
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            <div>
              <Input
                label={t('auth:register.email') as string}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth:register.email_placeholder') as string}
                error={!!errors.email}
                required
                fullWidth
              />
              <FormError error={errors.email} />
            </div>
            
            <div>
              <PasswordInput
                label={t('auth:register.password') || ''}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth:register.password_placeholder') || ''}
                error={!!errors.password}
                required
                fullWidth
              />
              <FormError error={errors.password} />
              <p className="mt-2 text-xs text-gray-500">
                {t('auth:register.password_requirements')}
              </p>
            </div>
            
            <LoadingButton
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              loadingText={t('auth:register.creating_account') || ''}
              fullWidth
            >
              {t('auth:register.continue') || ''}
            </LoadingButton>
          </form>
        );
        
      case STEPS.PROFILE:
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <Input
                label={t('auth:register.first_name') || ''}
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('auth:register.first_name_placeholder') || ''}
                error={!!errors.firstName}
                required
                fullWidth
              />
              <FormError error={errors.firstName} />
            </div>
            
            <div>
              <Input
                label={t('auth:register.last_name') || ''}
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('auth:register.last_name_placeholder') || ''}
                error={!!errors.lastName}
                required
                fullWidth
              />
              <FormError error={errors.lastName} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth:register.role') || ''}
              </label>
              <RadioGroup 
                name="role" 
                value={role} 
                onChange={setRole}
                className="space-y-2"
              >
                <RadioOption value="client" label={t('auth:register.role_client')} />
                <RadioOption value="consultant" label={t('auth:register.role_consultant')} />
              </RadioGroup>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(STEPS.ACCOUNT)}
              >
                {t('auth:register.back')}
              </Button>
              
              <LoadingButton
                type="submit"
                variant="primary"
                isLoading={isLoading}
                loadingText={t('auth:register.updating_profile') || ''}
              >
                {t('auth:register.continue') || ''}
              </LoadingButton>
            </div>
          </form>
        );
        
      case STEPS.VERIFICATION:
        return (
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <Alert 
              type="info" 
              className="mb-4" 
              message={t('auth:register.verification_sent', { email })}
            />
            
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                {t('auth:register.verification_code') || ''}
              </label>
              
              <VerificationInput
                length={6}
                value={verificationCode}
                onChange={setVerificationCode}
                error={!!errors.verificationCode}
                className="justify-center"
              />
              
              <FormError error={errors.verificationCode} className="mt-2" />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(STEPS.PROFILE)}
                disabled={isLoading}
              >
                {t('auth:register.back')}
              </Button>
              
              <LoadingButton
                type="submit"
                variant="primary"
                isLoading={isLoading}
                loadingText={t('auth:register.verifying') || ''}
              >
                {t('auth:register.complete') || ''}
              </LoadingButton>
            </div>
          </form>
        );
        
      default:
        return null;
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
              <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
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
                <div className="text-center mb-6">
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
                
                {renderStepIndicator()}
                {renderCurrentStep()}
                
                {currentStep === STEPS.ACCOUNT && (
                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      {t('auth:register.have_account')}{' '}
                      <Link
                        href="/auth/login"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t('auth:register.sign_in')}
                      </Link>
                    </p>
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