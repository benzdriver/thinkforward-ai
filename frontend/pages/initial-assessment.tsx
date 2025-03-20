import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  age: string;
  educationLevel: string;
  englishProficiency: string;
  workExperience: string;
  immigrationType: string;
  preferredCountry: string;
  familyMembers: string;
  budget: string;
  timeline: string;
  additionalInfo: string;
}

export function InitialAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    age: '',
    educationLevel: '',
    englishProficiency: '',
    workExperience: '',
    immigrationType: '',
    preferredCountry: '',
    familyMembers: '',
    budget: '',
    timeline: '',
    additionalInfo: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 发送评估请求
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('提交评估失败');
      }
      
      // 前往结果页面
      router.push('/assessment/result');
    } catch (error) {
      console.error('评估提交错误:', error);
      alert('提交评估时出现错误，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            免费移民资格评估
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            完成以下问卷，我们的AI系统将分析您的移民资格并提供个性化建议
          </p>
        </div>
        
        {/* 进度条 */}
        <div className="mb-8">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-sm font-medium text-gray-500">
            <p className={currentStep >= 1 ? "text-blue-600" : ""}>个人信息</p>
            <p className={currentStep >= 2 ? "text-blue-600" : ""}>移民偏好</p>
            <p className={currentStep >= 3 ? "text-blue-600" : ""}>其他细节</p>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  个人基本信息
                </h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      姓名
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      电子邮箱
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      电话号码
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                      国籍
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="nationality"
                        id="nationality"
                        required
                        value={formData.nationality}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      年龄
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="age"
                        id="age"
                        min="18"
                        max="120"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                      教育水平
                    </label>
                    <div className="mt-1">
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        required
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="high_school">高中</option>
                        <option value="college">大专</option>
                        <option value="bachelor">本科</option>
                        <option value="master">硕士</option>
                        <option value="phd">博士</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="englishProficiency" className="block text-sm font-medium text-gray-700">
                      英语水平
                    </label>
                    <div className="mt-1">
                      <select
                        id="englishProficiency"
                        name="englishProficiency"
                        required
                        value={formData.englishProficiency}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="beginner">初级</option>
                        <option value="intermediate">中级</option>
                        <option value="advanced">高级</option>
                        <option value="native">母语</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700">
                      工作经验（年）
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="workExperience"
                        id="workExperience"
                        min="0"
                        max="50"
                        required
                        value={formData.workExperience}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  移民偏好
                </h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="immigrationType" className="block text-sm font-medium text-gray-700">
                      您打算通过什么方式移民？
                    </label>
                    <div className="mt-1">
                      <select
                        id="immigrationType"
                        name="immigrationType"
                        required
                        value={formData.immigrationType}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="skilled_worker">技术移民</option>
                        <option value="investment">投资移民</option>
                        <option value="family">家庭团聚</option>
                        <option value="study">留学转移民</option>
                        <option value="refugee">难民或人道主义</option>
                        <option value="not_sure">不确定</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="preferredCountry" className="block text-sm font-medium text-gray-700">
                      您倾向于移民哪个国家？
                    </label>
                    <div className="mt-1">
                      <select
                        id="preferredCountry"
                        name="preferredCountry"
                        required
                        value={formData.preferredCountry}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="canada">加拿大</option>
                        <option value="australia">澳大利亚</option>
                        <option value="newzealand">新西兰</option>
                        <option value="usa">美国</option>
                        <option value="uk">英国</option>
                        <option value="singapore">新加坡</option>
                        <option value="not_sure">不确定</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="familyMembers" className="block text-sm font-medium text-gray-700">
                      您计划携带多少名家庭成员一起移民？
                    </label>
                    <div className="mt-1">
                      <select
                        id="familyMembers"
                        name="familyMembers"
                        required
                        value={formData.familyMembers}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="0">仅本人</option>
                        <option value="1">1人</option>
                        <option value="2">2人</option>
                        <option value="3">3人</option>
                        <option value="4+">4人或以上</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  其他信息
                </h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                      您的移民预算大约是多少（美元）？
                    </label>
                    <div className="mt-1">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="below_10k">10,000以下</option>
                        <option value="10k_50k">10,000 - 50,000</option>
                        <option value="50k_100k">50,000 - 100,000</option>
                        <option value="100k_500k">100,000 - 500,000</option>
                        <option value="above_500k">500,000以上</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                      您计划何时开始移民程序？
                    </label>
                    <div className="mt-1">
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="immediately">立即</option>
                        <option value="3_months">未来3个月内</option>
                        <option value="6_months">未来6个月内</option>
                        <option value="1_year">未来1年内</option>
                        <option value="2_years">未来2年内</option>
                        <option value="not_sure">尚不确定</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                      其他您想让我们了解的信息
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        rows={4}
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  上一步
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  下一步
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {loading ? '提交中...' : '提交评估'}
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          提交此表单即表示您同意我们的
          <Link href="/privacy">
            <span className="font-medium text-blue-600 hover:text-blue-500 ml-1">
              隐私政策
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 