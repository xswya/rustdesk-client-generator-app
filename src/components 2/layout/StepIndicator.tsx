import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  errors: Record<string, any>;
  onStepClick: (stepIndex: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick
}) => {
  return (
    <div className="step-indicator w-full">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4 max-w-4xl w-full">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center min-w-0 flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium cursor-pointer transition-colors flex-shrink-0 ${
                    index < currentStep
                      ? 'bg-blue-600 text-white'
                      : index === currentStep
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  onClick={() => onStepClick?.(index)}
                >
                  {index + 1}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-700 truncate">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`ml-4 flex-shrink-0 w-8 h-0.5 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};