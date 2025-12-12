import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import { getTodasLasNotificaciones, usuarioActual } from '../../data';

type ConfigCard = {
  title: string;
  description: string;
};

const CARDS: ConfigCard[] = [
  {
    title: 'Plan de feriados',
    description:
      'Establece y administra los días festivos, garantizando que estén correctamente reflejados en el calendario de la organización.',
  },
  {
    title: 'Formatos',
    description: 'Formatos aplicables para la gestión de Actos administrativos.',
  },
  {
    title: 'Notificaciones y alertas',
    description:
      'Personaliza las alertas para mantener a los usuarios informados sobre eventos importantes, actualizaciones y recordatorios.',
  },
  {
    title: 'Plazos',
    description:
      'Define los tiempos establecidos y administra los plazos para garantizar el cumplimiento efectivo de las tareas y proyectos.',
  },
  {
    title: 'Formularios',
    description:
      'Personaliza cada formulario según las necesidades, permitiendo una gestión más precisa y detallada de los datos recolectados.',
  },
];

export const Configuracion: React.FC = () => {
  const navigate = useNavigate();
  const allNotifications = useMemo(() => getTodasLasNotificaciones(), []);

  return (
    <CustomLayout
      platformName="DECARE"
      sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
      options={[]}
      onLogout={() => navigate(ERoutePaths.LOGIN)}
      notifications={allNotifications}
      user={{
        initials: usuarioActual.initials,
        name: usuarioActual.name,
        email: usuarioActual.email,
        role: usuarioActual.role,
      }}
    >
      <div className="min-h-full space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Configuración</h1>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CARDS.map((c) => (
            <div key={c.title} className="card p-7 flex flex-col">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{c.title}</h2>
                <p className="mt-3 text-gray-500 leading-relaxed">{c.description}</p>
              </div>

              <button
                type="button"
                className="mt-8 inline-flex w-fit items-center justify-center rounded-md bg-aduana-azul px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-aduana-azul-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aduana-azul"
              >
                Administrar
              </button>
            </div>
          ))}
        </section>
      </div>
    </CustomLayout>
  );
};

export default Configuracion;
