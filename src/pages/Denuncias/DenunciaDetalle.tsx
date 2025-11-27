import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { CustomButton } from "../../components/Button/Button";
import { Badge, Tabs, getEstadoBadgeVariant, useToast } from "../../components/UI";
import type { BadgeVariant } from "../../components/UI";
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

// Modal de confirmación
import { ModalConfirmacion } from './components/ModalConfirmacion';

export const DenunciaDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  
  // Estados
  const [showModalFormalizar, setShowModalFormalizar] = useState(false);
  const [showModalGenerarCargo, setShowModalGenerarCargo] = useState(false);
  
  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();
  
  // Buscar la denuncia
  const denuncia = useMemo(() => getDenunciaPorId(id || ''), [id]);
  
  // Si no existe la denuncia
  if (!denuncia) {
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
        description: 'La denuncia fue ingresada formalmente al sistema',
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
  const handleFormalizar = () => {
    showToast({
      type: 'success',
      title: 'Denuncia Formalizada',
      message: `La denuncia N° ${denuncia.numeroDenuncia} ha sido formalizada exitosamente.`,
      duration: 4000,
    });
    setShowModalFormalizar(false);
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
  
  // Alertas de la denuncia
  const alertas = useMemo(() => {
    const items: { tipo: 'error' | 'warning' | 'info'; mensaje: string }[] = [];
    
    if (denuncia.diasVencimiento < 0) {
      items.push({ tipo: 'error', mensaje: `Esta denuncia está vencida por ${Math.abs(denuncia.diasVencimiento)} días.` });
    } else if (denuncia.diasVencimiento <= 5) {
      items.push({ tipo: 'warning', mensaje: `Esta denuncia vence en ${denuncia.diasVencimiento} días.` });
    }
    
    if (reclamosAsociados.some(r => ['Ingresado', 'En Análisis'].includes(r.estado))) {
      items.push({ tipo: 'warning', mensaje: 'Existe un reclamo pendiente asociado a esta denuncia.' });
    }
    
    if (girosAsociados.some(g => g.estado === 'Vencido')) {
      items.push({ tipo: 'error', mensaje: 'Existen giros vencidos asociados a esta denuncia.' });
    }
    
    if (denuncia.observada) {
      items.push({ tipo: 'warning', mensaje: 'Esta denuncia ha sido observada y requiere correcciones.' });
    }
    
    return items;
  }, [denuncia, reclamosAsociados, girosAsociados]);
  
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
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(ERoutePaths.DASHBOARD)} className="hover:text-aduana-azul">
            Dashboard
          </button>
          <Icon name="ChevronRight" size={14} />
          <button onClick={() => navigate(ERoutePaths.DENUNCIAS)} className="hover:text-aduana-azul">
            Denuncias
          </button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">N° {denuncia.numeroDenuncia}</span>
        </nav>
        
        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="space-y-2">
            {alertas.map((alerta, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  alerta.tipo === 'error' 
                    ? 'bg-red-50 border-red-200 text-red-800' 
                    : alerta.tipo === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <Icon 
                  name={alerta.tipo === 'error' ? 'AlertCircle' : alerta.tipo === 'warning' ? 'AlertTriangle' : 'Info'} 
                  size={18} 
                />
                <span className="text-sm font-medium">{alerta.mensaje}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(ERoutePaths.DENUNCIAS)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  Denuncia N° {denuncia.numeroDenuncia}
                </h1>
                <Badge variant={getEstadoBadgeVariant(denuncia.estado)} size="md" dot>
                  {denuncia.estado}
                </Badge>
                <Badge variant={(denuncia.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant}>
                  {denuncia.tipoDenuncia}
                </Badge>
                {denuncia.mercanciaAfecta && (
                  <Badge variant="warning" size="sm">
                    <Icon name="Package" size={12} className="mr-1" />
                    Mercancía Afecta
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {denuncia.aduana} • {denuncia.seccion || 'Sin sección'} • N° Interno: {denuncia.numeroInterno || '-'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Fecha emisión: {denuncia.fechaEmision || denuncia.fechaIngreso} • 
                Funcionario: {denuncia.loginFuncionario || '-'}
              </p>
            </div>
          </div>
          
          {/* Acciones principales */}
          <div className="flex flex-wrap gap-2 ml-10 lg:ml-0">
            {permisos.puedeEditar && (
              <CustomButton 
                variant="secondary" 
                className="flex items-center gap-2 text-sm"
                onClick={() => navigate(`${ERoutePaths.DENUNCIAS}/${denuncia.id}/editar`)}
              >
                <Icon name="Edit" size={16} />
                Editar
              </CustomButton>
            )}
            
            {permisos.puedeFormalizar && (
              <CustomButton 
                variant="primary" 
                className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowModalFormalizar(true)}
              >
                <Icon name="CheckCircle" size={16} />
                Formalizar
              </CustomButton>
            )}
            
            {permisos.puedeGenerarCargo && (
              <CustomButton 
                variant="primary" 
                className="flex items-center gap-2 text-sm"
                onClick={() => setShowModalGenerarCargo(true)}
              >
                <Icon name="FilePlus" size={16} />
                Generar Cargo
              </CustomButton>
            )}
            
            {permisos.puedeCrearReclamo && (
              <CustomButton 
                variant="secondary" 
                className="flex items-center gap-2 text-sm"
                onClick={handleCrearReclamo}
              >
                <Icon name="FileWarning" size={16} />
                Crear Reclamo
              </CustomButton>
            )}
            
            {permisos.puedeNotificar && (
              <CustomButton 
                variant="secondary" 
                className="flex items-center gap-2 text-sm"
                onClick={handleNotificar}
              >
                <Icon name="Bell" size={16} />
                Notificar
              </CustomButton>
            )}
            
            <CustomButton 
              variant="secondary" 
              className="flex items-center gap-2 text-sm"
              onClick={() => navigate(`/expediente/${denuncia.id}`)}
            >
              <Icon name="FolderOpen" size={16} />
              Ver Expediente
            </CustomButton>
          </div>
        </div>
        
        {/* Info Cards rápida */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 border-l-4 border-l-aduana-azul">
            <p className="text-sm text-gray-500">Monto Estimado</p>
            <p className="text-xl font-bold text-gray-900">{denuncia.montoEstimado}</p>
          </div>
          <div className="card p-4 border-l-4 border-l-amber-500">
            <p className="text-sm text-gray-500">Multa</p>
            <p className="text-xl font-bold text-amber-600">
              {denuncia.multa ? `$${denuncia.multa.toLocaleString('es-CL')}` : '-'}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm text-gray-500">Derechos</p>
            <p className="text-xl font-bold text-emerald-600">
              {denuncia.montoDerechos ? `$${denuncia.montoDerechos.toLocaleString('es-CL')}` : '-'}
            </p>
          </div>
          <div className={`card p-4 border-l-4 ${
            denuncia.diasVencimiento < 0 ? 'border-l-red-500' : 
            denuncia.diasVencimiento <= 5 ? 'border-l-amber-500' : 'border-l-gray-300'
          }`}>
            <p className="text-sm text-gray-500">Días Plazo</p>
            <p className={`text-xl font-bold ${
              denuncia.diasVencimiento < 0 ? 'text-red-600' : 
              denuncia.diasVencimiento <= 5 ? 'text-amber-600' : 'text-gray-900'
            }`}>
              {denuncia.diasVencimiento < 0 
                ? `${Math.abs(denuncia.diasVencimiento)}d vencido`
                : `${denuncia.diasVencimiento} días`
              }
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs tabs={tabs} variant="underline" />
        
        {/* Modales */}
        <ModalConfirmacion
          isOpen={showModalFormalizar}
          onClose={() => setShowModalFormalizar(false)}
          onConfirm={handleFormalizar}
          titulo="Confirmar Formalización"
          mensaje={`¿Está seguro que desea formalizar la denuncia N° ${denuncia.numeroDenuncia}? Esta acción iniciará el flujo de trabajo correspondiente y se enviará a revisión.`}
          tipo="info"
          textoConfirmar="Formalizar"
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
      </div>
    </CustomLayout>
  );
};

export default DenunciaDetalle;

