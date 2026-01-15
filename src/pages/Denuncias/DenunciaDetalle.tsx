import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { CustomButton } from "../../components/Button/Button";
import { Tabs, useToast, StatusHeader } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getDenunciaPorId,
  getTodasLasNotificaciones,
  usuarioActual,
  getPermisosPorEstado,
  cargos,
  giros,
  reclamos,
  getArticuloPorCodigo,
} from '../../data';

// Componentes de las secciones
import { DenunciaResumen } from './components/DenunciaResumen';
import { DenunciaInvolucrados } from './components/DenunciaInvolucrados';
import { DenunciaDocumentos } from './components/DenunciaDocumentos';
import { DenunciaCargos } from './components/DenunciaCargos';
import { DenunciaGiros } from './components/DenunciaGiros';
import { DenunciaReclamos } from './components/DenunciaReclamos';
import { DenunciaTrazabilidad } from './components/DenunciaTrazabilidad';

// Modales
import { ModalConfirmacion } from './components/ModalConfirmacion';
import { ModalAsignarJefeRevisor } from './components/ModalAsignarJefeRevisor';

// Datos de Jefes Revisores
import { 
  registrarAsignacion, 
  getJefeRevisorPorId 
} from '../../data';

export const DenunciaDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  
  // Estados
  const [showModalIngresar, setShowModalIngresar] = useState(false);
  const [showModalGenerarCargo, setShowModalGenerarCargo] = useState(false);
  const [showModalAsignarJefeRevisor, setShowModalAsignarJefeRevisor] = useState(false);
  const [jefeRevisorAsignado, setJefeRevisorAsignado] = useState<string | null>(null);
  
  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();
  
  // Buscar la denuncia
  const denuncia = useMemo(() => getDenunciaPorId(id || ''), [id]);
  
  // Si no existe la denuncia
  if (!denuncia) {
    return (
      <CustomLayout
        platformName="Sistema de Tramitación de Denuncias"
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
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <Icon name="FileX" size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Denuncia no encontrada</h2>
            <p className="text-gray-600 mt-2">La denuncia solicitada no existe o fue eliminada.</p>
            <CustomButton 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate(ERoutePaths.DENUNCIAS)}
            >
              Volver al listado
            </CustomButton>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  // Obtener permisos según estado
  const permisos = getPermisosPorEstado(denuncia.estado);
  
  // Obtener artículo si existe
  const articulo = denuncia.codigoArticulo 
    ? getArticuloPorCodigo(denuncia.codigoArticulo) || null
    : null;
  
  // Obtener cargos, giros y reclamos asociados
  const cargosAsociados = useMemo(() => 
    cargos.filter(c => denuncia.cargosAsociados?.includes(c.id) || c.denunciaAsociada === denuncia.id),
    [denuncia]
  );
  
  const girosAsociados = useMemo(() => 
    giros.filter(g => denuncia.girosAsociados?.includes(g.id) || 
      cargosAsociados.some(c => c.id === g.cargoAsociado)),
    [denuncia, cargosAsociados]
  );
  
  const reclamosAsociados = useMemo(() => 
    reclamos.filter(r => denuncia.reclamosAsociados?.includes(r.id) || r.denunciaAsociada === denuncia.numeroDenuncia),
    [denuncia]
  );
  
  // Timeline de la denuncia
  const timelineItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      description: string;
      date: string;
      time?: string;
      user?: string;
      status: 'completed' | 'current' | 'pending';
    }> = [
      {
        id: '1',
        title: 'Denuncia Creada',
        description: `Se registró la denuncia N° ${denuncia.numeroDenuncia}`,
        date: denuncia.fechaCreacion || denuncia.fechaIngreso,
        time: '09:30',
        user: denuncia.usuarioCreacion || 'Sistema',
        status: 'completed',
      },
    ];
    
    if (denuncia.estado !== 'Borrador') {
      items.push({
        id: '2',
        title: 'Denuncia Ingresada',
        description: 'La denuncia fue ingresada al sistema',
        date: denuncia.fechaIngreso,
        time: '10:00',
        user: denuncia.loginFuncionario || 'Sistema',
        status: 'completed',
      });
    }
    
    if (['Formulada', 'Notificada', 'En Proceso', 'Cerrada'].includes(denuncia.estado)) {
      items.push({
        id: '3',
        title: 'Denuncia Formulada',
        description: 'Se completó la formulación de la denuncia',
        date: denuncia.fechaEmision || '',
        time: '14:30',
        user: denuncia.loginFuncionario || 'Sistema',
        status: 'completed',
      });
    }
    
    if (['Notificada', 'En Proceso', 'Cerrada'].includes(denuncia.estado)) {
      items.push({
        id: '4',
        title: 'Denuncia Notificada',
        description: 'Se notificó al denunciado',
        date: denuncia.fechaEmision || '',
        time: '16:00',
        user: 'Sistema de Notificaciones',
        status: 'completed',
      });
    }
    
    if (denuncia.observada) {
      items.push({
        id: '5',
        title: 'Denuncia Observada',
        description: 'La denuncia fue observada y requiere correcciones',
        date: '-',
        status: 'current',
      });
    }
    
    if (cargosAsociados.length > 0) {
      items.push({
        id: '6',
        title: 'Cargo Generado',
        description: `Se generó el cargo N° ${cargosAsociados[0].numeroCargo}`,
        date: cargosAsociados[0].fechaIngreso,
        time: '11:00',
        user: 'Sistema',
        status: denuncia.estado === 'Cerrada' ? 'completed' : 'current',
      });
    }
    
    if (reclamosAsociados.length > 0) {
      items.push({
        id: '7',
        title: 'Reclamo Ingresado',
        description: `Reclamo ${reclamosAsociados[0].tipoReclamo} N° ${reclamosAsociados[0].numeroReclamo}`,
        date: reclamosAsociados[0].fechaIngreso,
        time: '09:00',
        user: reclamosAsociados[0].reclamante,
        status: 'current',
      });
    }
    
    if (denuncia.estado === 'Cerrada') {
      items.push({
        id: '8',
        title: 'Denuncia Cerrada',
        description: 'El proceso de denuncia ha finalizado',
        date: '-',
        status: 'completed',
      });
    } else {
      items.push({
        id: '9',
        title: 'Pendiente de Cierre',
        description: 'La denuncia aún se encuentra en tramitación',
        date: '-',
        status: 'pending',
      });
    }
    
    return items;
  }, [denuncia, cargosAsociados, reclamosAsociados]);
  
  // Handlers
  const handleIngresar = () => {
    showToast({
      type: 'success',
      title: 'Denuncia Ingresada',
      message: `La denuncia N° ${denuncia.numeroDenuncia} ha sido ingresada exitosamente.`,
      duration: 4000,
    });
    setShowModalIngresar(false);
  };
  
  // CU-005: Handler para asignación de Jefe Revisor
  const handleAsignarJefeRevisor = (jefeRevisorId: string, observaciones?: string) => {
    const jefeRevisor = getJefeRevisorPorId(jefeRevisorId);
    
    if (!jefeRevisor) {
      showToast({
        type: 'error',
        title: 'Error en asignación',
        message: 'No se pudo encontrar el Jefe Revisor seleccionado.',
        duration: 4000,
      });
      return;
    }

    // Registrar la asignación (mock)
    const asignacion = registrarAsignacion(
      denuncia.id,
      denuncia.numeroDenuncia,
      jefeRevisorId,
      usuarioActual.login,
      usuarioActual.role,
      observaciones
    );

    if (asignacion) {
      setJefeRevisorAsignado(jefeRevisor.nombreCompleto);
      showToast({
        type: 'success',
        title: 'Denuncia Asignada e Ingresada',
        message: `La denuncia N° ${denuncia.numeroDenuncia} ha sido asignada a ${jefeRevisor.nombreCompleto} y su estado cambió a "Ingresada / Asignada a Jefe Revisor".`,
        duration: 5000,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Error en asignación',
        message: 'No se pudo completar la asignación. Por favor, intente nuevamente.',
        duration: 4000,
      });
    }

    setShowModalAsignarJefeRevisor(false);
  };
  
  const handleGenerarCargo = () => {
    setShowModalGenerarCargo(false);
    navigate(`${ERoutePaths.CARGOS_NUEVO}?denunciaId=${denuncia.id}`);
  };
  
  const handleCrearReclamo = () => {
    navigate(`${ERoutePaths.RECLAMOS_NUEVO}?origen=DENUNCIA&entidadId=${denuncia.id}&numero=${denuncia.numeroDenuncia}`);
  };
  
  const handleNotificar = () => {
    showToast({
      type: 'info',
      title: 'Notificación en proceso',
      message: 'Se está preparando la notificación electrónica al denunciado.',
      duration: 3000,
    });
  };
  
  // ============================================
  // ALERTAS DE LA DENUNCIA (Críticas para el header)
  // ============================================
  const alertas = useMemo(() => {
    const items: { tipo: 'error' | 'warning' | 'info'; mensaje: string; accion?: string; onAccion?: () => void }[] = [];
    
    if (denuncia.diasVencimiento < 0) {
      items.push({ 
        tipo: 'error', 
        mensaje: `Vencida hace ${Math.abs(denuncia.diasVencimiento)} días`,
        accion: 'Gestionar',
      });
    } else if (denuncia.diasVencimiento === 0) {
      items.push({ 
        tipo: 'error', 
        mensaje: 'Vence hoy',
        accion: 'Atender ahora',
      });
    } else if (denuncia.diasVencimiento <= 5) {
      items.push({ 
        tipo: 'warning', 
        mensaje: `Vence en ${denuncia.diasVencimiento} días` 
      });
    }
    
    if (reclamosAsociados.some(r => ['Ingresado', 'En Análisis'].includes(r.estado))) {
      items.push({ 
        tipo: 'warning', 
        mensaje: 'Reclamo pendiente',
        accion: 'Ver reclamo',
      });
    }
    
    if (girosAsociados.some(g => g.estado === 'Vencido')) {
      items.push({ 
        tipo: 'error', 
        mensaje: 'Giros vencidos' 
      });
    }
    
    if (denuncia.observada) {
      items.push({ 
        tipo: 'warning', 
        mensaje: 'Requiere correcciones' 
      });
    }
    
    return items;
  }, [denuncia, reclamosAsociados, girosAsociados]);
  
  // ============================================
  // MÉTRICAS CRÍTICAS PARA EL HEADER
  // ============================================
  const metricasCriticas = useMemo(() => {
    const metricas: Array<{
      label: string;
      value: string | number;
      variant: 'critical' | 'warning' | 'success' | 'neutral';
      icon?: string;
      description?: string;
    }> = [];
    
    // Días de plazo - siempre mostrar
    if (denuncia.diasVencimiento < 0) {
      metricas.push({
        label: 'Plazo',
        value: `${Math.abs(denuncia.diasVencimiento)}d`,
        variant: 'critical',
        icon: 'Clock',
        description: 'vencido',
      });
    } else if (denuncia.diasVencimiento <= 5) {
      metricas.push({
        label: 'Plazo',
        value: `${denuncia.diasVencimiento}d`,
        variant: denuncia.diasVencimiento === 0 ? 'critical' : 'warning',
        icon: 'Clock',
        description: denuncia.diasVencimiento === 0 ? 'vence hoy' : 'restantes',
      });
    } else {
      metricas.push({
        label: 'Plazo',
        value: `${denuncia.diasVencimiento}d`,
        variant: 'neutral',
        icon: 'Clock',
        description: 'restantes',
      });
    }
    
    // Monto estimado
    metricas.push({
      label: 'Monto',
      value: denuncia.montoEstimado,
      variant: 'neutral',
      icon: 'DollarSign',
    });
    
    // Multa
    if (denuncia.multa) {
      metricas.push({
        label: 'Multa',
        value: `$${denuncia.multa.toLocaleString('es-CL')}`,
        variant: 'warning',
        icon: 'Receipt',
      });
    }
    
    // Derechos
    if (denuncia.montoDerechos) {
      metricas.push({
        label: 'Derechos',
        value: `$${denuncia.montoDerechos.toLocaleString('es-CL')}`,
        variant: 'success',
        icon: 'Landmark',
      });
    }
    
    // Reclamos pendientes
    const reclamosPendientes = reclamosAsociados.filter(r => ['Ingresado', 'En Análisis'].includes(r.estado));
    if (reclamosPendientes.length > 0) {
      metricas.push({
        label: 'Reclamos',
        value: reclamosPendientes.length,
        variant: 'warning',
        icon: 'AlertTriangle',
        description: 'pendientes',
      });
    }
    
    return metricas;
  }, [denuncia, reclamosAsociados]);
  
  // ============================================
  // ACCIONES PRINCIPALES Y SECUNDARIAS
  // ============================================
  const accionesPrincipales = useMemo(() => {
    const acciones = [];
    
    // CU-005: Para denuncias en Borrador, mostrar "Asignar Jefe Revisor" como acción principal
    if (permisos.puedeFormalizar && denuncia.estado === 'Borrador') {
      acciones.push({
        label: 'Asignar Jefe Revisor',
        icon: 'UserCheck',
        onClick: () => setShowModalAsignarJefeRevisor(true),
        variant: 'success' as const,
      });
    } else if (permisos.puedeFormalizar) {
      // Para otros estados que permiten formalizar, mantener "Ingresar"
      acciones.push({
        label: 'Ingresar',
        icon: 'CheckCircle',
        onClick: () => setShowModalIngresar(true),
        variant: 'success' as const,
      });
    }
    
    if (permisos.puedeGenerarCargo) {
      acciones.push({
        label: 'Generar Cargo',
        icon: 'FilePlus',
        onClick: () => setShowModalGenerarCargo(true),
        variant: 'primary' as const,
      });
    }
    
    return acciones;
  }, [permisos, denuncia.estado]);
  
  const accionesSecundarias = useMemo(() => {
    const acciones = [];
    
    if (permisos.puedeEditar) {
      acciones.push({
        label: 'Editar',
        icon: 'Edit',
        onClick: () => navigate(`${ERoutePaths.DENUNCIAS}/${denuncia.id}/editar`),
      });
    }
    
    if (permisos.puedeCrearReclamo) {
      acciones.push({
        label: 'Crear Reclamo',
        icon: 'FileWarning',
        onClick: handleCrearReclamo,
      });
    }
    
    if (permisos.puedeNotificar) {
      acciones.push({
        label: 'Notificar',
        icon: 'Bell',
        onClick: handleNotificar,
      });
    }
    
    acciones.push({
      label: 'Ver Expediente',
      icon: 'FolderOpen',
      onClick: () => navigate(`/expediente/${denuncia.id}`),
    });
    
    return acciones;
  }, [permisos, denuncia.id, navigate]);
  
  // ============================================
  // DETERMINAR VARIANT DEL ESTADO
  // ============================================
  const getEstadoVariant = (): 'success' | 'warning' | 'error' | 'info' => {
    if (denuncia.diasVencimiento < 0 || denuncia.estado === 'Observada') return 'error';
    if (denuncia.diasVencimiento <= 5 || ['En Revisión', 'Notificada'].includes(denuncia.estado)) return 'warning';
    if (denuncia.estado === 'Cerrada') return 'success';
    return 'info';
  };
  
  // ============================================
  // BADGES ADICIONALES
  // ============================================
  const badgesAdicionales = useMemo(() => {
    const badges = [];
    
    if (denuncia.mercanciaAfecta) {
      badges.push(
        <span key="mercancia" className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-amber-200 text-amber-900">
          <Icon name="Package" size={14} />
          Mercancía Afecta
        </span>
      );
    }
    
    if (denuncia.retencion) {
      badges.push(
        <span key="retencion" className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-purple-200 text-purple-900">
          <Icon name="Lock" size={14} />
          Retención
        </span>
      );
    }
    
    return badges;
  }, [denuncia]);
  
  // Tabs del detalle
  const tabs = [
    {
      id: 'resumen',
      label: 'Resumen',
      icon: <Icon name="FileText" size={16} />,
      content: (
        <DenunciaResumen 
          denuncia={denuncia} 
          articulo={articulo}
          permisos={permisos}
        />
      ),
    },
    {
      id: 'involucrados',
      label: 'Involucrados',
      icon: <Icon name="Users" size={16} />,
      badge: denuncia.involucrados?.length || 0,
      content: (
        <DenunciaInvolucrados 
          involucrados={denuncia.involucrados || []}
          permisos={permisos}
        />
      ),
    },
    {
      id: 'documentos',
      label: 'Documentos',
      icon: <Icon name="Folder" size={16} />,
      badge: (denuncia.documentosAdjuntos?.length || 0) + (denuncia.documentosAduaneros?.length || 0),
      content: (
        <DenunciaDocumentos 
          documentosAdjuntos={denuncia.documentosAdjuntos || []}
          documentosAduaneros={denuncia.documentosAduaneros || []}
          permisos={permisos}
        />
      ),
    },
    {
      id: 'cargos',
      label: 'Cargos',
      icon: <Icon name="Receipt" size={16} />,
      badge: cargosAsociados.length,
      badgeVariant: cargosAsociados.length > 0 ? 'info' as const : undefined,
      content: (
        <DenunciaCargos 
          cargos={cargosAsociados}
          denuncia={denuncia}
          permisos={permisos}
          onGenerarCargo={() => setShowModalGenerarCargo(true)}
        />
      ),
    },
    {
      id: 'giros',
      label: 'Giros',
      icon: <Icon name="CreditCard" size={16} />,
      badge: girosAsociados.length,
      badgeVariant: girosAsociados.some(g => g.estado === 'Vencido') ? 'danger' as const : undefined,
      content: (
        <DenunciaGiros 
          giros={girosAsociados}
          denuncia={denuncia}
        />
      ),
    },
    {
      id: 'reclamos',
      label: 'Reclamos',
      icon: <Icon name="AlertTriangle" size={16} />,
      badge: reclamosAsociados.length,
      badgeVariant: reclamosAsociados.length > 0 ? 'warning' as const : undefined,
      content: (
        <DenunciaReclamos 
          reclamos={reclamosAsociados}
          denuncia={denuncia}
          permisos={permisos}
          onCrearReclamo={handleCrearReclamo}
        />
      ),
    },
    {
      id: 'trazabilidad',
      label: 'Trazabilidad',
      icon: <Icon name="GitBranch" size={16} />,
      content: (
        <DenunciaTrazabilidad 
          timeline={timelineItems}
          denuncia={denuncia}
        />
      ),
    },
  ];

  return (
    <CustomLayout
      platformName="Sistema de Tramitación de Denuncias"
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
      <div className="min-h-full space-y-6 animate-fade-in pb-8">
        {/* ═══════════════════════════════════════════════════════════════════
            STATUS HEADER - Cabecera de estado prominente
            Responde: ¿Cuál es el estado crítico y qué debo hacer?
        ═══════════════════════════════════════════════════════════════════ */}
        <StatusHeader
          titulo="Denuncia"
          numero={denuncia.numeroDenuncia}
          subtitulo={`${denuncia.aduana} • ${denuncia.seccion || 'Sin sección'} • N° Interno: ${denuncia.numeroInterno || '-'}`}
          estado={denuncia.estado}
          estadoVariant={getEstadoVariant()}
          tipo={denuncia.tipoDenuncia}
          tipoVariant={denuncia.tipoDenuncia === 'Penal' ? 'error' : 'info'}
          metricasCriticas={metricasCriticas}
          alertas={alertas}
          acciones={accionesPrincipales}
          accionesSecundarias={accionesSecundarias}
          onBack={() => navigate(ERoutePaths.DENUNCIAS)}
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => navigate(ERoutePaths.DASHBOARD) },
            { label: 'Denuncias', onClick: () => navigate(ERoutePaths.DENUNCIAS) },
            { label: `N° ${denuncia.numeroDenuncia}` },
          ]}
          badges={badgesAdicionales}
        />
        
        {/* ═══════════════════════════════════════════════════════════════════
            CONTENT TABS - Información detallada organizada
            Responde: ¿Dónde está la información específica que necesito?
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="animate-fade-in-up animate-delay-200">
          <Tabs tabs={tabs} variant="underline" />
        </section>
        
        {/* ═══════════════════════════════════════════════════════════════════
            MODALS
        ═══════════════════════════════════════════════════════════════════ */}
        <ModalConfirmacion
          isOpen={showModalIngresar}
          onClose={() => setShowModalIngresar(false)}
          onConfirm={handleIngresar}
          titulo="Confirmar Ingreso de Denuncia"
          mensaje={`¿Está seguro que desea ingresar la denuncia N° ${denuncia.numeroDenuncia}? Esta acción iniciará el flujo de trabajo correspondiente y se enviará a revisión.`}
          tipo="info"
          textoConfirmar="Ingresar"
        />
        
        <ModalConfirmacion
          isOpen={showModalGenerarCargo}
          onClose={() => setShowModalGenerarCargo(false)}
          onConfirm={handleGenerarCargo}
          titulo="Generar Cargo"
          mensaje={`¿Desea generar un cargo para la denuncia N° ${denuncia.numeroDenuncia}? Se abrirá el formulario de cargo con los datos pre-llenados.`}
          tipo="info"
          textoConfirmar="Generar Cargo"
        />
        
        {/* CU-005: Modal de Asignación de Jefe Revisor */}
        <ModalAsignarJefeRevisor
          isOpen={showModalAsignarJefeRevisor}
          onClose={() => setShowModalAsignarJefeRevisor(false)}
          onConfirm={handleAsignarJefeRevisor}
          denuncia={denuncia}
        />
      </div>
    </CustomLayout>
  );
};

export default DenunciaDetalle;
