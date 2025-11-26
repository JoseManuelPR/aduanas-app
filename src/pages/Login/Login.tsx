import Footer from '../../organisms/Footer';
import LoginContainer from "../../containers/Login/LoginContainer"
import { useNavigate } from "react-router-dom";
import IMAGE_PLATFORM from '../../assets/images';
interface InLogin { }

export const Login: React.FC<InLogin> = () => {
  const navigate = useNavigate();
  return (
      <LoginContainer
        logo={
          <div className="flex justify-between items-center mx-2">
            <img src={IMAGE_PLATFORM.GOBIERNO_DE_CHILE_LOGO} className="h-14" alt="Logo Gobierno de Chile" />
            <img src={IMAGE_PLATFORM.ADUANA_LARGE_LOGO} className="w-3/5" alt="Logo Aduana" />
          </div>
        }
        onSubmit={() => navigate("/dashboard")}
        subtitle="Para acceder a la plataforma, ingresa tus credenciales"
        mode="centered"
        showRememberMe={false}
        showClearButton
        authType="username"
        authLabel="Nombre de Usuario"
        footer={
          <Footer
            variant="dark"
            leftContent={
              <div className='text-center md:text-left'>
                <div className="text-sm">Dirección Nacional de Aduanas</div>
                <div className="text-sm">Plaza Sotomayor 60, Valparaíso, Chile.</div>
              </div>
            }
            rightContent={
              <div className='text-center md:text-right'>
                <div className="text-sm">Teléfono Contact Center</div>
                <div className="text-sm font-semibold">600 570 7040</div>
                <div className="text-xs">Versión 3.16.0 - 28/08/2025</div>
              </div>
            }
          />

        }
      />
  );
};
