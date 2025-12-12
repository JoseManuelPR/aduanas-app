import { ERoutePaths } from '../routes/routes';
import type { InHeaderTable } from "../components/Table/table.types";

// ============================================
// ICONOS SVG PARA SIDEBAR
// ============================================

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);


const IconDenuncia = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z" clipRule="evenodd" />
    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
  </svg>
);

const IconCargo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
    <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
  </svg>
);

const IconGiro = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.04A3.75 3.75 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z" clipRule="evenodd" />
  </svg>
);

const IconReclamo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
  </svg>
);

const IconNotificacion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
    <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9a6.75 6.75 0 0 0-6.75-6.75ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
  </svg>
);

const IconSeguimiento = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
    <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
    <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
  </svg>
);

const IconReportes = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
  </svg>
);

const IconConfiguracion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path fillRule="evenodd" d="M11.078 2.25c-.68 0-1.267.468-1.418 1.129l-.153.67a7.5 7.5 0 0 0-1.52.876l-.61-.268a1.5 1.5 0 0 0-1.79.56l-.75 1.299a1.5 1.5 0 0 0 .333 1.93l.522.43a7.48 7.48 0 0 0 0 1.752l-.522.43a1.5 1.5 0 0 0-.333 1.93l.75 1.3a1.5 1.5 0 0 0 1.79.56l.61-.269c.47.34.98.636 1.52.877l.153.67c.151.66.738 1.128 1.418 1.128h1.844c.68 0 1.267-.468 1.418-1.129l.153-.67a7.5 7.5 0 0 0 1.52-.876l.61.268a1.5 1.5 0 0 0 1.79-.56l.75-1.299a1.5 1.5 0 0 0-.333-1.93l-.522-.43a7.48 7.48 0 0 0 0-1.752l.522-.43a1.5 1.5 0 0 0 .333-1.93l-.75-1.3a1.5 1.5 0 0 0-1.79-.56l-.61.269a7.5 7.5 0 0 0-1.52-.877l-.153-.67a1.5 1.5 0 0 0-1.418-1.128h-1.844ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 0 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
  </svg>
);

// ============================================
// MENÚ SIDEBAR
// ============================================

const ITEMS_SIDEBAR_MENU = [
  {
    label: "Dashboard",
    to: ERoutePaths.DASHBOARD,
    icon: <IconDashboard />,
  },
  {
    label: "Denuncias",
    to: ERoutePaths.DENUNCIAS,
    icon: <IconDenuncia />,
    badge: 12, // Número de pendientes
  },
  {
    label: "Cargos",
    to: ERoutePaths.CARGOS,
    icon: <IconCargo />,
    badge: 5,
  },
  {
    label: "Giros",
    to: ERoutePaths.GIROS,
    icon: <IconGiro />,
  },
  {
    label: "Reclamos",
    to: ERoutePaths.RECLAMOS,
    icon: <IconReclamo />,
    badge: 3,
  },
  {
    label: "Involucrados",
    to: ERoutePaths.INVOLUCRADOS,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
      </svg>
    ),
  },
  {
    label: "Mercancías",
    to: ERoutePaths.MERCANCIAS,
    icon: <IconSeguimiento />,
  },
  {
    label: "Notificaciones",
    to: ERoutePaths.NOTIFICACIONES,
    icon: <IconNotificacion />,
    badgeType: 'danger' as const,
    badge: 8,
  },
  {
    label: "Reportes",
    to: ERoutePaths.REPORTES,
    icon: <IconReportes />,
  },
  {
    label: "Configuración",
    to: ERoutePaths.CONFIGURACION,
    icon: <IconConfiguracion />,
  },
  {
    label: "Cerrar sesión",
    to: ERoutePaths.LOGIN,
    className: "mt-auto border-t border-gray-200 pt-4",
    icon: <IconLogout />,
  }
];

// ============================================
// TIPOS E INTERFACES
// ============================================

interface InDenunciaTableData {
  id: string;
  nroDenuncia: string;
  fechaIngreso: string;
  estado: string;
  aduana: string;
  rutDeudor: string;
  nombreDeudor: string;
  tipoInfraccion: string;
  diasVencimiento: number;
  montoEstimado: string;
}

interface InCargoTableData {
  id: string;
  nroCargo: string;
  fechaIngreso: string;
  estado: string;
  aduana: string;
  rutDeudor: string;
  nombreDeudor: string;
  total: string;
  diasVencimiento: number;
}

interface InGiroTableData {
  id: string;
  nroGiro: string;
  tipoGiro: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: string;
  montoTotal: string;
  emitidoA: string;
}

interface InReclamoTableData {
  id: string;
  nroReclamo: string;
  tipoReclamo: string;
  fechaIngreso: string;
  estado: string;
  denunciaAsociada: string;
  reclamante: string;
  diasRespuesta: number;
}

interface InNotificacionTableData {
  id: string;
  nroNotificacion: string;
  tipo: string;
  fechaEnvio: string;
  estado: string;
  destinatario: string;
  email: string;
  expedienteId: string;
}

// Nuevas interfaces para el sistema de notificaciones
interface NotificacionHallazgo {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroHallazgo: string; // Formato PFI-XXX
  fechaGeneracion: string; // Formato dd-mm-aaaa
  tipoHallazgo: 'Infraccional' | 'Penal';
  leido: boolean;
}

interface NotificacionDenuncia {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroDenuncia: string;
  tipoDenuncia: 'Infraccional' | 'Penal';
  fechaGeneracion: string;
  leido: boolean;
}

interface NotificacionReclamo {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroReclamo: string;
  tipoReclamo: 'TTA' | 'Reposición Administrativa';
  fechaGeneracion: string;
  leido: boolean;
}

interface NotificacionCargo {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroCargo: string;
  fechaGeneracion: string;
  leido: boolean;
}

// ============================================
// FILTROS
// ============================================

const FILTERS_DASHBOARD = [
  {
    label: "Número de expediente",
    id: "nroExpediente",
    type: "text",
    labelClassName: "font-medium text-sm text-gray-700",
    placeholder: "Ej: 993519",
  },
  {
    label: "RUT deudor/denunciado",
    id: "rutDeudor",
    type: "text",
    labelClassName: "font-medium text-sm text-gray-700",
    placeholder: "12.345.678-9",
  },
  {
    label: "Estado",
    id: "estado",
    type: "select",
    labelClassName: "font-medium text-sm text-gray-700",
    options: ["Todos", "Pendiente", "En Proceso", "Resuelto", "Rechazado"],
  },
  {
    label: "Aduana",
    id: "aduana",
    type: "select",
    labelClassName: "font-medium text-sm text-gray-700",
    options: ["Todas", "Valparaíso", "Santiago", "Antofagasta", "Iquique", "Los Andes"],
  },
  {
    label: "Fecha desde",
    id: "fechaDesde",
    type: "date",
    icon: "CalendarDays",
    labelClassName: "font-medium text-sm text-gray-700",
  },
  {
    label: "Fecha hasta",
    id: "fechaHasta",
    type: "date",
    icon: "CalendarDays",
    labelClassName: "font-medium text-sm text-gray-700",
  },
];

const FILTERS_DENUNCIAS = [
  {
    label: "N° Denuncia",
    id: "nroDenuncia",
    type: "text",
    labelClassName: "font-medium text-sm text-gray-700",
    placeholder: "Ej: 993519",
  },
  {
    label: "RUT denunciado",
    id: "rutDenunciado",
    type: "text",
    labelClassName: "font-medium text-sm text-gray-700",
    placeholder: "12.345.678-9",
  },
  {
    label: "Estado",
    id: "estado",
    type: "select",
    labelClassName: "font-medium text-sm text-gray-700",
    options: ["Todos", "Ingresada", "En Revisión", "Formulada", "Notificada", "Cerrada"],
  },
  {
    label: "Aduana",
    id: "aduana",
    type: "select",
    labelClassName: "font-medium text-sm text-gray-700",
    options: ["Todas", "Valparaíso", "Santiago", "Antofagasta", "Iquique", "Los Andes"],
  },
  {
    label: "Tipo infracción",
    id: "tipoInfraccion",
    type: "select",
    labelClassName: "font-medium text-sm text-gray-700",
    options: ["Todos", "Contrabando", "Fraude Aduanero", "Declaración Falsa", "Otros"],
  },
  {
    label: "Fecha desde",
    id: "fechaDesde",
    type: "date",
    icon: "CalendarDays",
    labelClassName: "font-medium text-sm text-gray-700",
  },
];

// ============================================
// COLUMNAS DE TABLAS
// ============================================

const COLUMNS_DENUNCIAS: InHeaderTable<InDenunciaTableData>[] = [
  { key: 'nroDenuncia', label: 'N° Denuncia', sortable: true },
  { key: 'fechaIngreso', label: 'Fecha Ingreso', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'aduana', label: 'Aduana', sortable: true },
  { key: 'rutDeudor', label: 'RUT Deudor', sortable: true },
  { key: 'nombreDeudor', label: 'Nombre Deudor', sortable: true },
  { key: 'tipoInfraccion', label: 'Tipo Infracción', sortable: true },
  { key: 'diasVencimiento', label: 'Días Plazo', sortable: true },
];

const COLUMNS_CARGOS: InHeaderTable<InCargoTableData>[] = [
  { key: 'nroCargo', label: 'N° Cargo', sortable: true },
  { key: 'fechaIngreso', label: 'Fecha Ingreso', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'aduana', label: 'Aduana', sortable: true },
  { key: 'rutDeudor', label: 'RUT Deudor', sortable: true },
  { key: 'nombreDeudor', label: 'Nombre Deudor', sortable: true },
  { key: 'total', label: 'Monto Total', sortable: true },
  { key: 'diasVencimiento', label: 'Días Plazo', sortable: true },
];

const COLUMNS_GIROS: InHeaderTable<InGiroTableData>[] = [
  { key: 'nroGiro', label: 'N° Giro', sortable: true },
  { key: 'tipoGiro', label: 'Tipo', sortable: true },
  { key: 'fechaEmision', label: 'Fecha Emisión', sortable: true },
  { key: 'fechaVencimiento', label: 'Vencimiento', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'montoTotal', label: 'Monto', sortable: true },
  { key: 'emitidoA', label: 'Emitido A', sortable: true },
];

const COLUMNS_RECLAMOS: InHeaderTable<InReclamoTableData>[] = [
  { key: 'nroReclamo', label: 'N° Reclamo', sortable: true },
  { key: 'tipoReclamo', label: 'Tipo', sortable: true },
  { key: 'fechaIngreso', label: 'Fecha Ingreso', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'denunciaAsociada', label: 'Denuncia Asociada', sortable: true },
  { key: 'reclamante', label: 'Reclamante', sortable: true },
  { key: 'diasRespuesta', label: 'Días Respuesta', sortable: true },
];

const COLUMNS_NOTIFICACIONES: InHeaderTable<InNotificacionTableData>[] = [
  { key: 'nroNotificacion', label: 'N° Notificación', sortable: true },
  { key: 'tipo', label: 'Tipo', sortable: true },
  { key: 'fechaEnvio', label: 'Fecha Envío', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'destinatario', label: 'Destinatario', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
];

// ============================================
// NOTA: Los datos mock ahora están centralizados en src/data/
// Este archivo solo contiene configuración de UI (menú, filtros, columnas)
// ============================================

// ============================================
// EXPORT
// ============================================

const CONSTANTS_APP = {
  // Configuración de UI
  ITEMS_SIDEBAR_MENU,
  FILTERS_DASHBOARD,
  FILTERS_DENUNCIAS,
  // Columnas de tablas
  COLUMNS_DENUNCIAS,
  COLUMNS_CARGOS,
  COLUMNS_GIROS,
  COLUMNS_RECLAMOS,
  COLUMNS_NOTIFICACIONES,
};

export default CONSTANTS_APP;

// Tipos se mantienen para compatibilidad con componentes existentes
export type {
  InDenunciaTableData,
  InCargoTableData,
  InGiroTableData,
  InReclamoTableData,
  InNotificacionTableData,
  NotificacionHallazgo,
  NotificacionDenuncia,
  NotificacionReclamo,
  NotificacionCargo,
};
