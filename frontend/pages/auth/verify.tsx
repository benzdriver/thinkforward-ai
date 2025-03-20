import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  Alert
} from '@/components/ui';
import { VerificationInput } from '@/components/ui/VerificationInput';
import { Form } from '@/components/ui/Form/Form';
import { AuthLayout } from '@/components/layout/AuthLayout';

export function VerifyPage() {
  const { t } = useTranslation('auth');
  const { client } = useClerk();
  const router = useRouter();
  const { token, email } = router.query;
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // 处理自动验证（如果URL中有token）
  useEffect(() => {
    if (token && typeof token === 'string' && token.length > 0) {
      verifyWithToken(token);
    }
  }, [token]);
  
  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);
  
  // 使用token验证
  const verifyWithToken = async (verificationToken: string) => {
    setIsVerifying(true);
    setError(null);
    
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
      setError(err.message || t('verify.errors.generic'));
    } finally {
      setIsVerifying(false);
    }
  };
  
  // 使用验证码验证
  const verifyWithCode = async () => {
    if (verificationCode.length !== 6 || !email) return;
    
    setIsVerifying(true);
    setError(null);
    
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
      setError(err.errors?.[0]?.message || t('verify.errors.generic'));
    } finally {
      setIsVerifying(false);
    }
  };
  
  // 重新发送验证邮件
  const resendVerification = async () => {
    if (!email || resendCooldown > 0) return;
    
    setError(null);
    
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
      setError(err.errors?.[0]?.message || t('verify.errors.resend'));
    }
  };
  
  return (
    <AuthLayout 
      title={t('verify.title') as string}
      subtitle={email ? (t('verify.subtitle', { email }) as string) : (t('verify.subtitleGeneric') as string)}
    >
      <Card>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4" message={error} />
          )}
          
          {isVerified ? (
            <div className="text-center py-4">
              <Alert type="success" className="mb-4" message={t('verify.success') as string} />
              <p className="mt-2 text-sm text-gray-600">
                {t('verify.redirecting')}
              </p>
            </div>
          ) : (
            <>
              {!token && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    {t('verify.enterCode')}
                  </p>
                  
                  <div className="flex justify-center">
                    <VerificationInput
                      onChange={setVerificationCode}
                      disabled={isVerifying}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      onClick={verifyWithCode}
                      fullWidth
                      isLoading={isVerifying}
                      disabled={verificationCode.length !== 6}
                    >
                      {t('verify.verifyButton')}
                    </Button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={resendVerification}
                      disabled={resendCooldown > 0}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                    >
                      {resendCooldown > 0
                        ? t('verify.resendIn', { seconds: resendCooldown })
                        : t('verify.resendButton')}
                    </button>
                  </div>
                </div>
              )}
              
              {token && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">
                    {t('verify.verifying')}
                  </p>
                  {/* 可以添加加载动画 */}
                </div>
              )}
            </>
          )}
        </Card.Body>
        
        <Card.Footer>
          <p className="text-center text-sm text-gray-600">
            <Link href="/auth/login">
              <a className="font-medium text-blue-600 hover:text-blue-500">
                {t('verify.backToLogin')}
              </a>
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}
