import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/contexts/AuthContext';
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

export function LoginPage() {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      setError(t('login.errors.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title={t('login.title') as string}
      subtitle={t('login.subtitle') as string}
    >
      <Card>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4" message={error} />
          )}
          
          <Form onSubmit={handleSubmit}>
            <FormField
              label={t('login.email') as string}
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
                placeholder={t('login.emailPlaceholder') as string}
              />
            </FormField>
            
            <FormField
              label={t('login.password') as string}
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
                placeholder={t('login.passwordPlaceholder') as string}
              />
            </FormField>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t('login.rememberMe')}
                </label>
              </div>
              
              <div className="text-sm">
                <Link href="/auth/forgot-password">
                  <a className="font-medium text-blue-600 hover:text-blue-500">
                    {t('login.forgotPassword')}
                  </a>
                </Link>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                {t('login.signIn')}
              </Button>
            </div>
          </Form>
        </Card.Body>
        
        <Card.Footer>
          <p className="text-center text-sm text-gray-600">
            {t('login.noAccount')}{' '}
            <Link href="/auth/register">
              <a className="font-medium text-blue-600 hover:text-blue-500">
                {t('login.signUp')}
              </a>
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}
