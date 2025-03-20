import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  Alert 
} from '@/components/ui';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Form } from '@/components/ui/Form/Form';
import { FormField } from '@/components/ui/Form/FormField';
export function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const { client } = useClerk();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await client.signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.errors?.[0]?.message || t('forgotPassword.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title={t('forgotPassword.title') as string}
      subtitle={t('forgotPassword.subtitle') as string}
    >
      <Card>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4" message={error} />
          )}
          
          {!isSubmitted ? (
            <Form onSubmit={handleSubmit}>
              <FormField
                label={t('forgotPassword.email') as string}
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
                  placeholder={t('forgotPassword.emailPlaceholder') as string}
                />
              </FormField>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  {t('forgotPassword.resetPassword')}
                </Button>
              </div>
            </Form>
          ) : (
            <div className="text-center py-4">
              <Alert type="success" className="mb-4" message={t('forgotPassword.checkEmail') as string} />
              <p className="mt-2 text-sm text-gray-600">
                {t('forgotPassword.emailSentTo', { email })}
              </p>
            </div>
          )}
        </Card.Body>
        
        <Card.Footer>
          <p className="text-center text-sm text-gray-600">
            <Link href="/auth/login">
              <a className="font-medium text-blue-600 hover:text-blue-500">
                {t('forgotPassword.backToLogin')}
              </a>
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}
