import React, { useState, useRef, useEffect } from 'react';

interface VerificationInputProps {
  length?: number;
  onChange: (code: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

export const VerificationInput: React.FC<VerificationInputProps> = ({
  length = 6,
  onChange,
  autoFocus = true,
  disabled = false,
  className = ''
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // 初始化refs数组
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);
  
  // 自动聚焦第一个输入框
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);
  
  // 当code变化时触发onChange
  useEffect(() => {
    onChange(code.join(''));
  }, [code, onChange]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // 只接受数字
    if (!/^\d*$/.test(value)) return;
    
    // 更新code数组
    const newCode = [...code];
    
    // 处理粘贴的情况
    if (value.length > 1) {
      // 分割粘贴的值到各个输入框
      const pastedValue = value.split('');
      for (let i = 0; i < length && i < pastedValue.length; i++) {
        newCode[index + i] = pastedValue[i];
      }
      setCode(newCode);
      
      // 聚焦到最后一个填充的输入框之后的输入框
      const focusIndex = Math.min(index + pastedValue.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    } else {
      // 正常输入单个字符
      newCode[index] = value;
      setCode(newCode);
      
      // 自动聚焦到下一个输入框
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // 处理退格键
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // 如果当前输入框为空且不是第一个，则聚焦到前一个输入框
        inputRefs.current[index - 1]?.focus();
        
        // 清空前一个输入框的值
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      } else if (code[index]) {
        // 如果当前输入框有值，则清空
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
    
    // 处理左右箭头键
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  return (
    <div className={`flex space-x-2 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={code[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          aria-label={`Verification code digit ${index + 1}`}
        />
      ))}
    </div>
  );
}; 