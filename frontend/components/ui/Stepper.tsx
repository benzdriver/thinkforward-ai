import React from 'react';

interface StepperProps {
  steps: Array<{ label: string }>;
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={`flex justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}; 