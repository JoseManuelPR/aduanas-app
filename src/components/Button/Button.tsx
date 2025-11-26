import { Button as ARKHOButton } from "he-button-custom-library"
import type { ButtonProps } from "he-button-custom-library/dist/ui/atoms/Button/Button";



export const CustomButton: React.FC<ButtonProps> = ({ className, variant, ...props }) => {
  return (
    <ARKHOButton
      className={`text-xs md:text-sm rounded-sm ${className} ${variant === "secondary" && "bg-[#265EA4] text-white hover:bg-[#1E4E85]"}`}
      variant={variant}
      size="md"
      {...props}

    />
  );
};

