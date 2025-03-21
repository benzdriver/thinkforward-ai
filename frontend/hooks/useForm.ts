import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'next-i18next';

interface FormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  i18nNamespace?: string;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
  i18nNamespace = 'form',
}: FormOptions<T>) {
  const { t } = useTranslation([i18nNamespace, 'common']);
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理输入变化
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    }));
    
    // 清除已修改字段的错误
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }, [errors]);

  // 处理字段失焦
  const handleBlur = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    
    // 如果有验证函数，在失焦时验证
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name as keyof T]) {
        // 翻译错误消息
        const translatedError = t(validationErrors[name as keyof T] as string);
        setErrors(prev => ({
          ...prev,
          [name]: translatedError,
        }));
      }
    }
  }, [validate, values, t]);

  // 处理表单提交
  const handleSubmit = useCallback(async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    
    // 标记所有字段为已触摸
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    
    setTouched(allTouched);
    
    // 如果有验证函数，验证所有字段
    if (validate) {
      const validationErrors = validate(values);
      
      // 翻译所有错误消息
      const translatedErrors = Object.entries(validationErrors).reduce(
        (acc, [key, value]) => {
          acc[key as keyof T] = value ? t(value).toString() : undefined;
          return acc;
        },
        {} as Partial<Record<keyof T, string | undefined>>
      );
      
      setErrors(translatedErrors);
      
      // 如果有错误，不提交
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, validate, values, t]);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 设置特定字段的值
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValue,
    t,
  };
}
