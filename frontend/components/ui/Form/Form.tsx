import React from 'react';
import { useTranslation } from 'next-i18next';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal' | 'inline';
  labelCol?: number;
  wrapperCol?: number;
  requiredMark?: boolean | 'optional';
  size?: 'small' | 'middle' | 'large';
}

export const Form: React.FC<FormProps> = ({ 
  children, 
  className = '', 
  layout = 'vertical',
  labelCol = 3,
  wrapperCol = 9,
  requiredMark = true,
  size = 'middle',
  ...props 
}) => {
  const { t } = useTranslation();
  
  // 创建表单上下文
  const formContext = {
    layout,
    labelCol,
    wrapperCol,
    requiredMark,
    size
  };
  
  // 布局样式
  const layoutClasses = {
    vertical: 'space-y-6',
    horizontal: 'space-y-6',
    inline: 'flex flex-wrap items-start gap-4'
  };
  
  return (
    <form className={`${layoutClasses[layout]} ${className}`} {...props}>
      {children}
    </form>
  );
};
