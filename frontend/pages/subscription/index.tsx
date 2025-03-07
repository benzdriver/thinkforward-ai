import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@clerk/nextjs";

const plans = [
  {
    id: 'basic',
    name: '基础计划',
    price: '$199',
    period: '月',
    features: [
      'AI移民路径分析',
      '基础表格填写指导',
      '电子邮件支持',
      '移民资讯访问'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: '专业计划',
    price: '$399',
    period: '月',
    features: [
      'AI移民路径详细分析',
      '全部表格自动填写',
      '移民顾问审核',
      '优先电子邮件支持',
      '移民资讯访问',
      '每月一次视频咨询'
    ],
    recommended: true
  },
  {
    id: 'premium',
    name: '高级计划',
    price: '$599',
    period: '月',
    features: [
      'AI移民路径详细分析',
      '全部表格自动填写',
      '资深移民顾问审核',
      '24/7优先支持',
      '完整移民资料库访问',
      '每月两次视频咨询',
      '专属移民策略规划'
    ],
    recommended: false
  }
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { isLoaded, userId, isSignedIn } = useAuth();

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      // 如果用户未登录，重定向到登录页面
      router.push(`/sign-in?redirect=/subscription`);
      return;
    }

    setIsProcessing(true);
    
    try {
      // 发送订阅请求到API
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (response.ok) {
        // 重定向到支付或确认页
        router.push(data.redirectUrl || '/subscription/success');
      } else {
        alert(`订阅失败: ${data.message}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      alert('处理订阅时发生错误，请稍后再试。');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          为您的移民之旅选择最佳计划
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          订阅我们的服务，让AI助手和专业移民顾问帮助您实现移民目标。
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`border rounded-lg shadow-sm p-8 transition-all duration-200 ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-blue-500 transform scale-105' 
                : 'hover:shadow-lg'
            } ${plan.recommended ? 'relative' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                推荐
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
            <p className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="ml-1 text-xl font-medium text-gray-500">/{plan.period}</span>
            </p>
            
            <ul className="mt-6 space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <button
                onClick={() => {
                  setSelectedPlan(plan.id);
                  handleSubscribe(plan.id);
                }}
                disabled={isProcessing}
                className={`w-full inline-flex justify-center py-3 px-5 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </span>
                ) : (
                  '订阅此计划'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">订阅常见问题</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg">我可以随时取消订阅吗？</h3>
            <p className="text-gray-600 mt-1">是的，您可以随时在账户设置中取消订阅。</p>
          </div>
          <div>
            <h3 className="font-medium text-lg">顾问审核服务包括什么？</h3>
            <p className="text-gray-600 mt-1">我们的移民顾问将审核您的个人资料和表格，确保信息准确无误，并提供专业建议。</p>
          </div>
          <div>
            <h3 className="font-medium text-lg">视频咨询如何预约？</h3>
            <p className="text-gray-600 mt-1">订阅后，您可以在控制台中选择合适的时间与顾问预约视频咨询。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
