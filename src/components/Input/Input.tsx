import { Input as ARKHOInput } from "he-button-custom-library"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  className?: string;
  allowedPattern?: RegExp;
  disallowedChars?: string[];
  maxLength?: number;

}


export const CustomInput: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <ARKHOInput
      className={`rounded-sm ${className}`}
      {...props}

    />
  );
};

