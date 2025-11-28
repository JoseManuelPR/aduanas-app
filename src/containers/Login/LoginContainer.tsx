import React, { useState } from 'react';
import { Checkbox, Label } from 'he-button-custom-library'
import { LoginTemplateProps } from './login.types';
import { CustomButton } from '../../components/Button/Button';
import { CustomInput } from '../../components/Input/Input';


function LoginTemplate({
  authType = "email",
  authLabel = "Correo electrónico",
  title = "Bienvenido de vuelta",
  subtitle = "Ingresa tus credenciales para acceder a tu cuenta",
  logo,
  showRememberMe = true,
  showClearButton = false,
  onSubmit,
  loading = false,
  onForgotPassword,
  onSignUp,
  socialLogin = [],
  footer,
  expandedLeftContent,
  mode = "expanded",
  placeholder = authLabel,
}: LoginTemplateProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError(
        authType === "email"
          ? "El email es requerido"
          : authType === "rut"
            ? "El RUT es requerido"
            : "El usuario es requerido"
      );
      isValid = false;
    } else {
      if (authType === "email") {
        if (!/\S+@\S+\.\S+/.test(email)) {
          setEmailError("El email no es válido");
          isValid = false;
        } else {
          setEmailError("");
        }
      }

      if (authType === "username") {
        if (/\s/.test(email)) {
          setEmailError("El usuario no puede contener espacios en blanco");
          isValid = false;
        } else {
          setEmailError("");
        }
      }

      if (authType === "rut") {
        if (!/^\d{7,8}-[\dkK]$/.test(email)) {
          setEmailError("Formato de RUT inválido (Ej: 12345678-9 o 12345678-K)");
          isValid = false;
        } else {
          const [num, dv] = email.split("-");
          if (!isValidRUT(num, dv)) {
            setEmailError("El RUT no es válido");
            isValid = false;
          } else {
            setEmailError("");
          }
        }
      }
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  // Algoritmo para validar RUT chileno
  const isValidRUT = (num: string, dv: string) => {
    let sum = 0;
    let multiplier = 2;

    for (let i = num.length - 1; i >= 0; i--) {
      sum += parseInt(num[i], 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const rest = 11 - (sum % 11);
    const dvExpected = rest === 11 ? "0" : rest === 10 ? "K" : rest.toString();
    return dvExpected.toUpperCase() === dv.toUpperCase();
  };




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(email, password, rememberMe);
    }
  };

  const onClearValues = () => {
    setEmail('');
    setPassword('');
    setRememberMe(false);
  };

  const Form = (
    <div className="w-full max-w-sm lg:max-w-md">
      {mode === "expanded" && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          {authLabel && (

            <Label htmlFor="userTypeId" className="block text-sm font-medium text-gray-700 mb-1" required>
              {authLabel}
            </Label>
          )}
          <CustomInput
            id="userTypeId"
            type={authType === "email" ? "email" : "text"}
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hasError={!!emailError}
            required
            disallowedChars={["&", "$", "+", "%", "-", "_", "#", "(", ")"]}

          />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" required>
            Contraseña
          </Label>
          <CustomInput
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hasError={!!passwordError}
            required
          />
          {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
        </div>

        <div className={`flex items-center justify-between ${showRememberMe ? 'justify-between' : 'justify-end'}`}>
          {showRememberMe && (

            <Checkbox
              label="Recordarme"
              id="remember-me"
              checked={rememberMe}
              onChange={(checked) => setRememberMe(checked)}
            />
          )}

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-dark-primary transition cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>

        <CustomButton type="submit" className="w-full" loading={loading} disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar"}
        </CustomButton>

        {showClearButton && (
          <CustomButton variant="outline" className="w-full" onClick={onClearValues}>
            Limpiar
          </CustomButton>
        )}

      </form>

      {socialLogin.length > 0 && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {socialLogin.map((social: { provider: string; icon: React.ReactNode; onClick: () => void }) => (
              <CustomButton
                key={social.provider}
                variant="secondary"
                onClick={social.onClick}
                className="w-full"
              >
                <span className="mr-2">{social.icon}</span>
                {social.provider}
              </CustomButton>
            ))}
          </div>
        </div>
      )}


      {onSignUp && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={onSignUp}
              className="font-medium text-primary hover:text-dark-primary transition cursor-pointer"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      )}
    </div>
  );

  if (mode === "centered") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">

        <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 my-6">
            <div className="text-center mb-6">
              {logo && (
                <div className="flex justify-center mb-4">
                  <div className="max-w-full h-24 flex items-center justify-center overflow-hidden">
                    {logo}
                  </div>
                </div>
              )}
              <h1 className="text-2xl font-bold text-blue-900">{title}</h1>
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            </div>

            {Form}
          </div>
        </div>

        {footer && <div className="w-full">{footer}</div>}

      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-blue-600 via-blue-800 to-blue-900 relative overflow-hidden">
        {expandedLeftContent ? (
          expandedLeftContent
        ) : (
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center ">
            {logo && (
              <div className="mb-8">
                <div className="max-w-full bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                  {logo}
                </div>
              </div>
            )}
          </div>
        )}


      </div>

      <div className="flex-1 flex items-center justify-center relative px-4 sm:px-6 lg:px-20 xl:px-24">
        {Form}
        {footer && mode === "expanded" && <div className="absolute bottom-0 w-full">{footer}</div>}

      </div>


    </div>
  );
}


export default LoginTemplate;