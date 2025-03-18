import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
    Card, 
    Button, 
    Alert 
} from '@/components/ui';
import { Form } from '@/components/ui/Form/Form';
import { FormField } from '@/components/ui/Form/FormField';
import { AuthLayout } from '@/components/layout/AuthLayout';

// 步骤定义
const STEPS = {
    ACCOUNT: 0,
    PROFILE: 1,
    VERIFICATION: 2
};

export default function RegisterPage() {
    const { t } = useTranslation('auth');
    const router = useRouter();
    const { signUp, isLoaded } = useSignUp();
    const [isLoading, setIsLoading] = useState(false);
    
    // 表单状态
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('client'); // 'client' 或 'consultant'
    const [verificationCode, setVerificationCode] = useState('');
    
    // UI状态
    const [currentStep, setCurrentStep] = useState(STEPS.ACCOUNT);
    const [error, setError] = useState<string | null>(null);
    const [pendingVerification, setPendingVerification] = useState(false);
    
    // 确保Clerk已加载
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    
    // 处理账户信息提交
    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
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
            setError(err.errors?.[0]?.message || t('register.errors.generic'));
        } finally {
            setIsLoading(false);
        }
    };
    
    // 处理个人资料提交
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
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
            setPendingVerification(true);
            setCurrentStep(STEPS.VERIFICATION);
        } catch (err: any) {
            console.error('Profile update error:', err);
            setError(err.errors?.[0]?.message || t('register.errors.profile'));
        } finally {
            setIsLoading(false);
        }
    };
    
    // 处理验证码提交
    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
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
                setError(t('register.errors.verification'));
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.errors?.[0]?.message || t('register.errors.verification'));
        } finally {
            setIsLoading(false);
        }
    };
    
    // 渲染步骤指示器
    const renderStepIndicator = () => {
        const steps = [
            t('register.steps.account'),
            t('register.steps.profile'),
            t('register.steps.verification')
        ];
        
        return (
            <div className="flex justify-center mb-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full 
                            ${index === currentStep 
                                ? 'bg-blue-600 text-white' 
                                : index < currentStep 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                            }
                        `}>
                            {index < currentStep ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>
                        
                        {index < steps.length - 1 && (
                            <div className={`w-12 h-1 ${
                                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };
    
    // 渲染当前步骤的表单
    const renderCurrentStep = () => {
        switch (currentStep) {
            case STEPS.ACCOUNT:
                return (
                    <Form onSubmit={handleAccountSubmit}>
                        <FormField
                            label={t('register.email') as string}
                            name="email"
                            required
                        >
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.emailPlaceholder') as string}    
                            />
                        </FormField>
                        
                        <FormField
                            label={t('register.password') as string}
                            name="password"
                            required
                        >
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.passwordPlaceholder') as string}
                            />
                        </FormField>
                        
                        <div className="mt-6">
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                            >
                                {t('register.continue')}
                            </Button>
                        </div>
                    </Form>
                );
                
            case STEPS.PROFILE:
                return (
                    <Form onSubmit={handleProfileSubmit}>
                        <FormField
                            label={t('register.firstName') as string}
                            name="firstName"
                            required
                        >
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.firstNamePlaceholder') as string}
                            />
                        </FormField>
                        
                        <FormField
                            label={t('register.lastName') as string}
                            name="lastName"
                            required
                        >
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.lastNamePlaceholder') as string}
                            />
                        </FormField>
                        
                        <FormField
                            label={t('register.role') as string}
                            name="role"
                            required
                        >
                            <div className="mt-1 space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="role-client"
                                        name="role"
                                        type="radio"
                                        value="client"
                                        checked={role === 'client'}
                                        onChange={() => setRole('client')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="role-client" className="ml-2 block text-sm text-gray-900">
                                        {t('register.roleClient')}
                                    </label>
                                </div>
                                
                                <div className="flex items-center">
                                    <input
                                        id="role-consultant"
                                        name="role"
                                        type="radio"
                                        value="consultant"
                                        checked={role === 'consultant'}
                                        onChange={() => setRole('consultant')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="role-consultant" className="ml-2 block text-sm text-gray-900">
                                        {t('register.roleConsultant')}
                                    </label>
                                </div>
                            </div>
                        </FormField>
                        
                        <div className="flex justify-between mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(STEPS.ACCOUNT)}
                            >
                                {t('register.back')}
                            </Button>
                            
                            <Button
                                type="submit"
                                isLoading={isLoading}
                            >
                                {t('register.continue')}
                            </Button>
                        </div>
                    </Form>
                );
                
            case STEPS.VERIFICATION:
                return (
                    <Form onSubmit={handleVerificationSubmit}>
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-600">
                                {t('register.verificationSent', { email })}
                            </p>
                        </div>
                        
                        <FormField
                            label={t('register.verificationCode') as string}
                            name="verificationCode"
                            required
                        >
                            <input
                                type="text"
                                id="verificationCode"
                                name="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.verificationCodePlaceholder') as string}
                            />
                        </FormField>
                        
                        <div className="flex justify-between mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(STEPS.PROFILE)}
                                disabled={isLoading}
                            >
                                {t('register.back')}
                            </Button>
                            
                            <Button
                                type="submit"
                                isLoading={isLoading}
                            >
                                {t('register.complete')}
                            </Button>
                        </div>
                    </Form>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <AuthLayout 
            title={t('register.title') as string}
            subtitle={t('register.subtitle') as string}
        >
            <Card>
                <Card.Body>
                    {error && (
                        <Alert type="error" className="mb-4" message={error} />
                    )}
                    
                    {renderStepIndicator()}
                    {renderCurrentStep()}
                </Card.Body>
                
                <Card.Footer>
                    <p className="text-center text-sm text-gray-600">
                        {t('register.haveAccount')}{' '}
                        <Link href="/auth/login">
                            <a className="font-medium text-blue-600 hover:text-blue-500">
                                {t('register.signIn')}
                            </a>
                        </Link>
                    </p>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}