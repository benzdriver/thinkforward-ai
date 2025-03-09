import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { UserRole } from '../../types/user';

export default function SignUpPage() {
  const router = useRouter();
  const { redirectUrl } = router.query;
  
  // 自定义 Clerk 组件外观，使其与网站蓝色调一致
  const clerkAppearance = {
    layout: {
      socialButtonsVariant: 'iconButton' as 'iconButton',
      socialButtonsPlacement: 'top' as 'top',
    },
    elements: {
      formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      footerActionLink: 'text-blue-600 hover:text-blue-500',
      card: 'rounded-lg shadow-md',
      formField: 'rounded',
      formFieldInput: 'rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      identityPreview: 'bg-blue-50 border-blue-100',
      identityPreviewText: 'text-blue-700',
      identityPreviewEditButton: 'text-blue-600',
      otpCodeFieldInput: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    },
  };
  
  return (
    <Layout userRole={UserRole.GUEST}>
      <Head>
        <title>注册 - Thinkforward移民AI助手</title>
        <meta name="description" content="创建您的移民AI助手账户" />
      </Head>
      
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            创建您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已有账户?{' '}
            <a href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
              立即登录
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <SignUp 
              path="/sign-up" 
              routing="path" 
              signInUrl="/sign-in" 
              redirectUrl={(redirectUrl as string) || '/dashboard'}
              appearance={clerkAppearance}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
} 