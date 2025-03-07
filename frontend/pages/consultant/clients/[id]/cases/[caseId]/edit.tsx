import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { UserRole } from '../../../../../../types/user';

interface CaseFormData {
  title: string;
  description: string;
  immigrationType: string;
  destination: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'completed';
  progress: number;
  notes: string;
}

interface EditCaseProps {
  userRole: UserRole;
}

interface ClientBasic {
  id: string;
  name: string;
  email: string;
}

export default function EditCase({ userRole }: EditCaseProps) {
  const router = useRouter();
  const { id, caseId } = router.query;
  const { isLoaded, userId, getToken } = useAuth();
  const [client, setClient] = useState<ClientBasic | null>(null);
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    description: '',
    immigrationType: '',
    destination: '',
    targetDate: '',
    status: 'pending',
    progress: 0,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 获取案例数据
  useEffect(() => {
    async function fetchCaseData() {
      if (!id || !caseId || !isLoaded) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`/api/consultant/clients/${id}/cases/${caseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('无法获取案例数据');
        }
        
        const data = await response.json();
        setClient(data.client);
        // 格式化日期字段，确保表单的日期输入可正确显示
        const caseData = data.case;
        if (caseData.targetDate) {
          const date = new Date(caseData.targetDate);
          caseData.targetDate = date.toISOString().split('T')[0];
        } else {
          caseData.targetDate = '';
        }
        setFormData(caseData);
      } catch (error) {
        console.error('获取案例数据出错:', error);
        setError('无法加载案例数据，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && id && caseId) {
      fetchCaseData();
    }
  }, [isLoaded, id, caseId, getToken]);
  
  // 如果不是顾问角色，重定向到控制台
  useEffect(() => {
    if (isLoaded && userRole !== UserRole.CONSULTANT && userRole !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [isLoaded, userRole, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData(prev => ({
      ...prev,
      progress: isNaN(value) ? 0 : Math.min(100, Math.max(0, value))
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('案例标题不能为空');
      return;
    }
    
    if (!formData.immigrationType) {
      setError('请选择移民类型');
      return;
    }
    
    if (!formData.destination) {
      setError('请选择目标国家');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = await getToken();
      const response = await fetch(`/api/consultant/clients/${id}/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('保存案例失败');
      }

      const data = await response.json();
      setSuccess('案例保存成功');
      router.push(`/consultant/clients/${id}/cases/${caseId}`);
    } catch (error) {
      console.error('保存案例出错:', error);
      setError('保存案例失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-4">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg leading-6 font-medium text-gray-900">案例信息</h3>
            <p className="mt-1 text-sm text-gray-600">编辑案例的详细信息</p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      案例标题 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      案例描述
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="请输入案例描述"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="immigrationType" className="block text-sm font-medium text-gray-700">
                      移民类型 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="immigrationType"
                        name="immigrationType"
                        value={formData.immigrationType}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="">请选择移民类型</option>
                        <option value="skilled_worker">技术移民</option>
                        <option value="investment">投资移民</option>
                        <option value="family">家庭团聚</option>
                        <option value="study">留学转移民</option>
                        <option value="work_permit">工作签证</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                      目标国家 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="">请选择目标国家</option>
                        <option value="canada">加拿大</option>
                        <option value="australia">澳大利亚</option>
                        <option value="usa">美国</option>
                        <option value="uk">英国</option>
                        <option value="new_zealand">新西兰</option>
                        <option value="singapore">新加坡</option>
                        <option value="europe">欧洲</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                      目标日期
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="targetDate"
                        id="targetDate"
                        value={formData.targetDate}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      状态 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="pending">待处理</option>
                        <option value="in_progress">进行中</option>
                        <option value="submitted">已提交</option>
                        <option value="approved">已批准</option>
                        <option value="rejected">已拒绝</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div>
                    <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                      进度 ({formData.progress}%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="range"
                        name="progress"
                        id="progress"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.progress}
                        onChange={handleProgressChange}
                        className="block w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer"
                      />
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div style={{ width: `${formData.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      附加说明
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="请输入任何其他需要说明的信息"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-right">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '保存中...' : '保存修改'}
                  </button>
                </div>
              </form>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => router.push(`/consultant/clients/${id}/cases/${caseId}`)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                disabled={isSubmitting}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 