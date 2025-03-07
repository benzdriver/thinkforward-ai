import { useState } from 'react';
import { useRouter } from 'next/router';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
  required: boolean;
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

interface ImmigrationFormProps {
  formType: 'express-entry' | 'family-sponsorship' | 'study-permit';
}

// 添加FormData和Errors接口
interface FormDataType {
  [key: string]: string;
}

interface FormErrorsType {
  [key: string]: string;
}

export default function ImmigrationForm({ formType }: ImmigrationFormProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [errors, setErrors] = useState<FormErrorsType>({});
  
  // 根据表格类型获取表格部分和字段
  const formSections = getFormSections(formType);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 清除错误
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateSection = (sectionIndex: number): boolean => {
    const section = formSections[sectionIndex];
    const newErrors: FormErrorsType = {};
    let isValid = true;
    
    section.fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label}是必填项`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    setCurrentSection((prev) => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateSection(currentSection)) {
      return;
    }
    
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType,
          formData,
        }),
      });
      
      if (response.ok) {
        router.push('/client/documents?status=success');
      } else {
        const data = await response.json();
        alert(`提交失败: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('提交过程中发生错误，请稍后再试');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        {formType === 'express-entry' && '快速通道申请表'}
        {formType === 'family-sponsorship' && '家庭团聚申请表'}
        {formType === 'study-permit' && '学习许可申请表'}
      </h1>
      
      <div className="mb-8">
        <div className="flex items-center">
          {formSections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentSection
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`text-sm mx-2 ${
                  index <= currentSection ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {section.title}
              </div>
              {index < formSections.length - 1 && (
                <div
                  className={`h-1 w-8 ${
                    index < currentSection ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {formSections[currentSection].title}
          </h2>
          
          <div className="space-y-4">
            {formSections[currentSection].fields.map((field) => (
              <div key={field.id}>
                <label className="block mb-1 font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      errors[field.id] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">请选择...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-2 border rounded ${
                      errors[field.id] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  ></textarea>
                ) : (
                  <input
                    type={field.type}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      errors[field.id] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
                
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          {currentSection > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              上一步
            </button>
          )}
          
          {currentSection < formSections.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto"
            >
              下一步
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 ml-auto"
            >
              提交表格
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// 辅助函数获取表格部分
function getFormSections(formType: string): FormSection[] {
  // 这里可以根据不同的表格类型返回不同的字段和部分
  // 这是一个示例实现
  if (formType === 'express-entry') {
    return [
      {
        id: 'personal',
        title: '个人信息',
        fields: [
          { id: 'fullName', label: '全名', type: 'text', required: true },
          { id: 'dob', label: '出生日期', type: 'date', required: true },
          { id: 'nationality', label: '国籍', type: 'text', required: true },
          { id: 'passportNumber', label: '护照号码', type: 'text', required: true },
          { id: 'currentAddress', label: '当前地址', type: 'text', required: true },
        ]
      },
      {
        id: 'education',
        title: '教育背景',
        fields: [
          { 
            id: 'educationLevel', 
            label: '最高教育水平', 
            type: 'select', 
            options: ['高中', '大专', '学士', '硕士', '博士'],
            required: true 
          },
          { id: 'institution', label: '毕业院校', type: 'text', required: true },
          { id: 'major', label: '专业', type: 'text', required: true },
          { id: 'graduationDate', label: '毕业日期', type: 'date', required: true },
        ]
      },
      {
        id: 'workExperience',
        title: '工作经验',
        fields: [
          { id: 'employer', label: '雇主名称', type: 'text', required: true },
          { id: 'jobTitle', label: '职位', type: 'text', required: true },
          { id: 'startDate', label: '开始日期', type: 'date', required: true },
          { id: 'endDate', label: '结束日期', type: 'date', required: false },
          { id: 'jobDuties', label: '工作职责', type: 'textarea', required: true },
        ]
      },
      {
        id: 'languageSkills',
        title: '语言能力',
        fields: [
          { 
            id: 'englishTest', 
            label: '英语考试类型', 
            type: 'select', 
            options: ['IELTS', 'CELPIP', 'TOEFL'],
            required: true 
          },
          { id: 'listeningScore', label: '听力分数', type: 'number', required: true },
          { id: 'readingScore', label: '阅读分数', type: 'number', required: true },
          { id: 'writingScore', label: '写作分数', type: 'number', required: true },
          { id: 'speakingScore', label: '口语分数', type: 'number', required: true },
        ]
      },
      {
        id: 'additionalInfo',
        title: '附加信息',
        fields: [
          { 
            id: 'maritalStatus', 
            label: '婚姻状况', 
            type: 'select', 
            options: ['单身', '已婚', '离异', '丧偶'],
            required: true 
          },
          { id: 'familyMembers', label: '家庭成员数量', type: 'number', required: true },
          { id: 'haveCriminalRecord', label: '是否有犯罪记录', type: 'select', options: ['是', '否'], required: true },
          { id: 'additionalComments', label: '其他备注', type: 'textarea', required: false },
        ]
      }
    ];
  }
  
  // 为其他表格类型添加类似的字段定义
  return [];
}
