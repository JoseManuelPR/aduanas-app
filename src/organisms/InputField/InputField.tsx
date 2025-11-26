import * as React from "react";
import { CustomInput } from "../../components/Input/Input";
import { Label } from "he-button-custom-library";
import { cn } from "../../utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  errorMessage?: string;
  required?: boolean;
  requiredOrientation?: "left" | "right";
  hasError?: boolean;
  allowedPattern?: RegExp;
  disallowedChars?: string[];
  maxLength?: number;
  icon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      errorMessage,
      required = false,
      requiredOrientation = "right",
      hasError = false,
      icon,
      containerClassName,
      labelClassName,
      inputClassName,
      allowedPattern,
      disallowedChars,
      maxLength = 50,
      type,
      ...props
    },
  ) => {
    const showError = hasError || !!errorMessage;

    return (
      <div
        className={cn(
          "flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 w-full",
          containerClassName
        )}
      >
        {/* Label */}
        <div className="lg:w-48 lg:flex-shrink-0">
          <Label
            htmlFor={id}
            required={required}
            requiredOrientation={requiredOrientation}
            className={labelClassName}
          >
            {label}
          </Label>
        </div>

        {/* Input Container */}
        <div className="flex-1 w-full">
          <div className="relative w-full pointer-events-auto">
            <CustomInput
              id={id}
              hasError={showError}
              className={cn("w-full", icon ? "pr-10" : "", inputClassName)}
              allowedPattern={allowedPattern}
              disallowedChars={disallowedChars}
              maxLength={maxLength}
              type={type}
              onClick={(e) => {
                if (type === "date") {
                  e.currentTarget.showPicker?.();  // ← Fuerza abrir el calendario
                }
              }}
              {...props}
            />

            {/* Icon */}
            {icon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                {icon}
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-1 text-xs text-red-500 flex items-start gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3 mt-0.5 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;