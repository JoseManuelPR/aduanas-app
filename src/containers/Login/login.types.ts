export interface SocialLogin {
  provider: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface LoginTemplateProps {
  authType?: "email" | "username" | "rut";
  authLabel?: string;
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  showRememberMe?: boolean;
  showClearButton?: boolean;
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
  loading?: boolean;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  socialLogin?: SocialLogin[];
  footer?: React.ReactNode;
  expandedLeftContent?: React.ReactNode;
  mode?: "expanded" | "centered";
  placeholder?: string;
}

