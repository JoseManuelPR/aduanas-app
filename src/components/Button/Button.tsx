import { Button as ARKHOButton } from "he-button-custom-library"
import type { ButtonProps } from "he-button-custom-library/dist/ui/atoms/Button/Button";

const getVariantClasses = (variant?: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-aduana-azul text-white hover:bg-aduana-azul/90 active:bg-aduana-azul/80 shadow-sm';
    case 'secondary':
      return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100';
    case 'success':
      return 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm';
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm';
    case 'warning':
      return 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm';
    case 'ghost':
      return 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200';
    case 'link':
      return 'bg-transparent text-aduana-azul hover:underline p-0';
    default:
      return '';
  }
};

export const CustomButton: React.FC<ButtonProps> = ({ className, variant, ...props }) => {
  const variantClasses = getVariantClasses(variant);
  
  return (
    <ARKHOButton
      className={`text-sm font-medium rounded-lg transition-all duration-150 ${variantClasses} ${className}`}
      variant={variant}
      size="md"
      {...props}
    />
  );
};

