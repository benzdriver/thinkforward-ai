import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // 倒计时自动跳转到仪表板
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          订阅成功！
        </h1>
        
        <p className="mt-4 text-xl text-gray-500">
          感谢您订阅我们的服务。您现在可以使用所有高级功能，包括AI移民路径分析和表格填写。
        </p>
        
        <div className="mt-10">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">下一步</h2>
            <ul className="list-disc pl-5 text-left space-y-2 text-gray-600">
              <li>完善您的个人资料以获取更精准的移民建议</li>
              <li>使用AI助手了解您的移民选择</li>
              <li>开始填写移民表格</li>
              <li>与您的移民顾问联系</li>
            </ul>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <span className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                前往控制台 ({countdown})
              </span>
            </Link>
            <Link href="/client/profile">
              <span className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                完善个人资料
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
