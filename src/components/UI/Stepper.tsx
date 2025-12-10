import React from 'react';
import { Icon } from 'he-button-custom-library';

export type StepStatus = 'pending' | 'current' | 'complete' | 'error';

export interface StepperStep {
  id: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

interface StepperProps {
  steps: StepperStep[];
  activeStep: StepperStep['id'];
  onStepChange?: (stepId: StepperStep['id']) => void;
  clickable?: boolean;
  showDescription?: boolean;
  className?: string;
}

const statusStyles: Record<StepStatus, string> = {
  pending: 'bg-gray-200 text-gray-600',
  current: 'bg-aduana-azul text-white ring-4 ring-aduana-azul/15',
  complete: 'bg-emerald-500 text-white',
  error: 'bg-aduana-rojo text-white ring-4 ring-aduana-rojo/15',
};

const labelStyles: Record<StepStatus, string> = {
  pending: 'text-gray-500',
  current: 'text-aduana-azul',
  complete: 'text-emerald-600',
  error: 'text-aduana-rojo',
};

const connectorStyles: Record<StepStatus, string> = {
  pending: 'bg-gray-200',
  current: 'bg-aduana-azul',
  complete: 'bg-emerald-500',
  error: 'bg-aduana-rojo',
};

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onStepChange,
  clickable = true,
  showDescription = true,
  className = '',
}) => {
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeStep),
  );

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      {steps.map((step, index) => {
        const status: StepStatus =
          step.status ||
          (index < activeIndex
            ? 'complete'
            : index === activeIndex
              ? 'current'
              : 'pending');

        const isClickable = clickable && !!onStepChange && !step.disabled;
        const handleClick = () => {
          if (isClickable && step.id !== activeStep) {
            onStepChange?.(step.id);
          }
        };

        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={handleClick}
              disabled={!isClickable}
              className={`
                flex items-start gap-3 px-2 py-1 rounded-lg transition-all duration-150 text-left
                ${isClickable ? 'hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aduana-azul/40' : 'cursor-default'}
              `}
            >
              <span
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold transition-all duration-150 shrink-0
                  ${statusStyles[status]}
                `}
              >
                {status === 'complete' ? (
                  <Icon name="Check" size={16} />
                ) : step.icon ? (
                  step.icon
                ) : (
                  index + 1
                )}
              </span>
              <span className="flex flex-col">
                <span className={`text-sm font-semibold ${labelStyles[status]}`}>
                  {step.label}
                </span>
                {showDescription && step.description && (
                  <span className="text-xs text-gray-500">{step.description}</span>
                )}
              </span>
            </button>

            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 rounded-full
                  ${connectorStyles[index < activeIndex ? 'complete' : status]}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
