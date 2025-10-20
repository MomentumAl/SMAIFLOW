import React from 'react';
import { FormStep } from '../types';
import { CheckIcon } from './IconComponents';

interface StepIndicatorProps {
  currentStep: number;
  steps: FormStep[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Progress">
      <div className="flex items-center w-full bg-amber-100/70 dark:bg-slate-700/50 rounded-full p-1.5 shadow-inner">
        {steps.map((step, stepIdx) => {
          const status = stepIdx < currentStep ? 'completed' : stepIdx === currentStep ? 'current' : 'upcoming';

          let stepClasses = 'flex flex-col sm:flex-row items-center justify-center gap-2 w-full text-center px-4 py-2.5 rounded-full transition-all duration-300 ';
          
          switch(status) {
              case 'completed':
                  stepClasses += 'bg-green-500 text-white';
                  break;
              case 'current':
                  stepClasses += 'bg-white dark:bg-slate-900 shadow-md text-amber-700 dark:text-amber-400 font-semibold';
                  break;
              case 'upcoming':
                  stepClasses += 'text-slate-500 dark:text-slate-400';
                  break;
          }

          return (
            <div key={step.id} className="flex-1">
              <div className={stepClasses} aria-current={status === 'current' ? 'step' : undefined}>
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                       <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <span className="text-base">{step.emoji}</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium">{step.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default StepIndicator;