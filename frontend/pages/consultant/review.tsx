import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import { UserRole } from '../../types/user';

interface ReviewPageProps {
  userRole: UserRole;
}

interface FormReview {
  id: string;
  clientName: string;
  formType: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  formData: Record<string, any>;
}

export default function ReviewPage({ userRole }: ReviewPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const { isLoaded, getToken } = useAuth();
  const [review, setReview] = useState<FormReview | null>(null);
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReview() {
      if (!id) return;

      try {
        const token = await getToken();
        const response = await fetch(`/api/consultant/form-review/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }

        const data = await response.json();
        setReview(data.review);
        setStatus(data.review.status);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && id) {
      fetchReview();
    }
  }, [isLoaded, id, getToken]);
  
  // 如果不是顾问角色，重定向到控制台
  useEffect(() => {
    if (isLoaded && userRole !== UserRole.CONSULTANT && userRole !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [isLoaded, userRole, router]);
  
  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      const response = await fetch(`/api/consultant/submit-review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          comments
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      router.push('/consultant/clients');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('提交审核失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!review) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未找到审核内容</h2>
          <p className="text-gray-600 mb-4">找不到请求的审核内容或您没有访问权限。</p>
          <button
            onClick={() => router.push('/consultant/clients')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回客户列表
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            表格审核
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            客户: {review.clientName} | 表格类型: {review.formType} | 提交时间: {review.submittedAt}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => router.push('/consultant/clients')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回客户列表
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">表格详情</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">请审核以下提交的表格信息</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {Object.entries(review.formData).map(([key, value]) => (
              <div key={key} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">提交审核结果</h3>
          <div className="mt-5">
            <form onSubmit={handleSubmitReview}>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  审核状态
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="pending">待审核</option>
                    <option value="reviewed">已审核</option>
                    <option value="approved">已批准</option>
                    <option value="rejected">已拒绝</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  审核意见
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="comments"
                    name="comments"
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="请提供详细的审核意见和建议..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <div></div>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                  >
                    {isSubmitting ? '提交中...' : '提交审核'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
