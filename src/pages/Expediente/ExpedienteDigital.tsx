import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { CustomButton } from "../../components/Button/Button";
import { Badge, Tabs, Timeline, ProgressBar, getEstadoBadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  denuncias,
  getDenunciaPorNumero,
  getTodasLasNotificaciones,
  usuarioActual,
} from '../../data';

export const ExpedienteDigital: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();

  // Buscar la denuncia por id o usar la primera
  const denunciaData = denuncias.find(d => d.id === id) || denuncias[0];

  // Datos mock del expediente usando datos centralizados
  const expediente = {
    id: id || denunciaData?.id || '1',
    numero: denunciaData?.numeroDenuncia || '993519',
    tipo: 'Denuncia',
    estado: denunciaData?.estado || 'En Revisión',
    fechaCreacion: denunciaData?.fechaIngreso || '15-11-2025',
    ultimaActualizacion: '20-11-2025 14:35',
    denuncia: {
      rutDeudor: denunciaData?.rutDeudor || '',
      nombreDeudor: denunciaData?.nombreDeudor || '',
      tipoInfraccion: denunciaData?.tipoInfraccion || '',
      montoEstimado: denunciaData?.montoEstimado || '',
    },
    funcionarioAsignado: 'Juan Rodríguez',
    seccion: 'Fiscalización',
    aduana: denunciaData?.aduana || 'Valparaíso',
    plazoLegal: 15,
    diasTranscurridos: denunciaData ? Math.max(0, 15 - denunciaData.diasVencimiento) : 5,
  };

  // Timeline del expediente
  const timelineItems = [
    {
      id: '1',
      title: 'Expediente Creado',
      description: 'Se registró la denuncia y se creó el expediente digital',
      date: '2024-11-15',
      time: '09:30',
      user: 'Sistema',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Asignación de Funcionario',
      description: 'Se asignó a Juan Rodríguez como funcionario responsable',
      date: '2024-11-15',
      time: '10:15',
      user: 'María González (Jefe Sección)',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Inicio de Revisión',
      description: 'Se inició la revisión documental y verificación de antecedentes',
      date: '2024-11-16',
      time: '08:45',
      user: 'Juan Rodríguez',
      status: 'completed' as const,
    },
    {
      id: '4',
      title: 'Solicitud de Antecedentes',
      description: 'Se solicitaron antecedentes adicionales al denunciado',
      date: '2024-11-18',
      time: '11:20',
      user: 'Juan Rodríguez',
      status: 'current' as const,
    },
    {
      id: '5',
      title: 'Formulación de Denuncia',
      description: 'Pendiente de formulación oficial',
      date: '-',
      status: 'pending' as const,
    },
    {
      id: '6',
      title: 'Notificación al Denunciado',
      description: 'Pendiente de notificación electrónica',
      date: '-',
      status: 'pending' as const,
    },
  ];

  // Documentos del expediente
  const documentos = [
    { id: '1', nombre: 'Denuncia Original', tipo: 'PDF', fecha: '2024-11-15', tamaño: '245 KB', estado: 'Vigente' },
    { id: '2', nombre: 'DIN 6020-24-0012345', tipo: 'PDF', fecha: '2024-11-15', tamaño: '1.2 MB', estado: 'Vigente' },
    { id: '3', nombre: 'Fotografías Mercancía', tipo: 'ZIP', fecha: '2024-11-15', tamaño: '8.4 MB', estado: 'Vigente' },
    { id: '4', nombre: 'Informe de Aforo', tipo: 'PDF', fecha: '2024-11-16', tamaño: '567 KB', estado: 'Vigente' },
    { id: '5', nombre: 'Notificación Solicitud Antecedentes', tipo: 'PDF', fecha: '2024-11-18', tamaño: '123 KB', estado: 'Enviada' },
  ];

  // Notificaciones del expediente
  const notificaciones = [
    { id: '1', tipo: 'Solicitud Antecedentes', fecha: '2024-11-18', destinatario: 'legal@importadoraglobal.cl', estado: 'Enviada', leida: true },
    { id: '2', tipo: 'Acuse de Recibo', fecha: '2024-11-18', destinatario: 'legal@importadoraglobal.cl', estado: 'Pendiente', leida: false },
  ];

  // Movimientos de mercancía
  const movimientos = [
    { id: '1', tipo: 'Ingreso Puerto', fecha: '2024-11-01', ubicacion: 'Terminal Pacífico Sur', estado: 'Completado' },
    { id: '2', tipo: 'Descarga', fecha: '2024-11-02', ubicacion: 'Zona Primaria TPS', estado: 'Completado' },
    { id: '3', tipo: 'Aforo Físico', fecha: '2024-11-03', ubicacion: 'Área de Inspección', estado: 'Completado' },
    { id: '4', tipo: 'Retención', fecha: '2024-11-03', ubicacion: 'Depósito Fiscal', estado: 'Vigente' },
  ];

  // Tabs del expediente
  const tabs = [
    {
      id: 'resumen',
      label: 'Resumen',
      icon: <Icon name="FileText" size={16} />,
      content: (
        <div className="space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-l-aduana-azul">
              <p className="text-sm text-gray-500">Estado Actual</p>
              <div className="mt-2">
                <Badge variant={getEstadoBadgeVariant(expediente.estado)} size="md" dot>
                  {expediente.estado}
                </Badge>
              </div>
            </div>
            <div className="card p-5 border-l-4 border-l-amber-500">
              <p className="text-sm text-gray-500">Plazo Legal</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {expediente.plazoLegal - expediente.diasTranscurridos} días
              </p>
              <p className="text-xs text-gray-500">restantes de {expediente.plazoLegal}</p>
            </div>
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <p className="text-sm text-gray-500">Funcionario Asignado</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{expediente.funcionarioAsignado}</p>
              <p className="text-xs text-gray-500">{expediente.seccion}</p>
            </div>
          </div>

          {/* Progreso del plazo */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-900 mb-4">Progreso del Plazo Legal</h4>
            <ProgressBar
              value={expediente.diasTranscurridos}
              max={expediente.plazoLegal}
              label={`${expediente.diasTranscurridos} días transcurridos`}
              colorScheme="auto"
              size="lg"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Inicio: {expediente.fechaCreacion}</span>
              <span>Vencimiento: 2024-11-30</span>
            </div>
          </div>

          {/* Datos del denunciado */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="User" size={18} />
              Datos del Denunciado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">RUT</p>
                <p className="font-medium">{expediente.denuncia.rutDeudor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Razón Social</p>
                <p className="font-medium">{expediente.denuncia.nombreDeudor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Infracción</p>
                <p className="font-medium">{expediente.denuncia.tipoInfraccion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monto Estimado</p>
                <p className="font-medium text-aduana-rojo">{expediente.denuncia.montoEstimado}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'documentos',
      label: 'Documentos',
      icon: <Icon name="Folder" size={16} />,
      badge: documentos.length,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Documentos del Expediente</h4>
            <CustomButton variant="primary" className="flex items-center gap-2 text-sm">
              <Icon name="Upload" size={16} />
              Agregar Documento
            </CustomButton>
          </div>
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentos.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={18} className="text-aduana-azul" />
                        <span className="font-medium text-gray-900">{doc.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.tipo}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.fecha}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.tamaño}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success" size="sm">{doc.estado}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 text-gray-500 hover:text-aduana-azul">
                          <Icon name="Eye" size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-emerald-600">
                          <Icon name="Download" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: <Icon name="Clock" size={16} />,
      content: (
        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 mb-6">Historial del Expediente</h4>
          <Timeline items={timelineItems} />
        </div>
      ),
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Icon name="Bell" size={16} />,
      badge: notificaciones.filter(n => !n.leida).length,
      badgeVariant: 'danger' as const,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Notificaciones Electrónicas</h4>
            <CustomButton variant="primary" className="flex items-center gap-2 text-sm">
              <Icon name="Send" size={16} />
              Nueva Notificación
            </CustomButton>
          </div>
          <div className="space-y-3">
            {notificaciones.map((notif) => (
              <div key={notif.id} className={`card p-4 ${!notif.leida ? 'border-l-4 border-l-aduana-rojo' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${notif.leida ? 'bg-gray-100' : 'bg-aduana-rojo-50'}`}>
                      <Icon name="Mail" size={20} className={notif.leida ? 'text-gray-500' : 'text-aduana-rojo'} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{notif.tipo}</p>
                      <p className="text-sm text-gray-500">Para: {notif.destinatario}</p>
                      <p className="text-xs text-gray-400 mt-1">Enviada: {notif.fecha}</p>
                    </div>
                  </div>
                  <Badge variant={getEstadoBadgeVariant(notif.estado)} size="sm">
                    {notif.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'movimientos',
      label: 'Movimientos',
      icon: <Icon name="Truck" size={16} />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Seguimiento de Mercancía</h4>
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movimientos.map((mov) => (
                  <tr key={mov.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} className="text-aduana-azul" />
                        <span className="font-medium">{mov.tipo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{mov.fecha}</td>
                    <td className="px-4 py-3 text-gray-600">{mov.ubicacion}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getEstadoBadgeVariant(mov.estado)} size="sm">
                        {mov.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ];

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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{expediente.numero}</h1>
                <Badge variant={getEstadoBadgeVariant(expediente.estado)} size="md" dot>
                  {expediente.estado}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">
                Expediente Digital • {expediente.tipo} • {expediente.aduana}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {expediente.ultimaActualizacion}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 ml-10 md:ml-0">
            <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
              <Icon name="Printer" size={16} />
              Imprimir
            </CustomButton>
            <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
              <Icon name="Download" size={16} />
              Exportar
            </CustomButton>
            <CustomButton variant="primary" className="flex items-center gap-2 text-sm">
              <Icon name="Edit" size={16} />
              Editar
            </CustomButton>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} variant="underline" />
      </div>
    </CustomLayout>
  );
};

export default ExpedienteDigital;

