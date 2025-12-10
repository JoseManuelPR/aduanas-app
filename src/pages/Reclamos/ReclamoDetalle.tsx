/**
 * ReclamoDetalle - Vista 360° del reclamo
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge, Tabs, Tab } from '../../components/UI';
import { 
  getReclamoPorId,
  getDenunciaPorId,
  getCargoPorId,
  getGiroPorId,
  getPermisosReclamo,
  puedeRegistrarAdmisibilidad,
  puedeRegistrarFallo,
  registrarAdmisibilidad,
  registrarFallo,
  aduanas,
  getTodasLasNotificaciones,
  usuarioActual,
  type Reclamo,
  type TipoFalloTTA,
  formatMonto,
} from '../../data';
import { ERoutePaths } from '../../routes/routes';
import {
  ReclamoResumen,
  ReclamoFundamentos,
  ReclamoOrigen,
  ReclamoTTA,
  ReclamoTimeline,
  ModalAdmisibilidad,
  ModalRegistrarFallo,
} from './components';

const ReclamoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('resumen');
  const [showModalAdmisibilidad, setShowModalAdmisibilidad] = useState(false);
  const [showModalFallo, setShowModalFallo] = useState(false);
  const [esApelacion, setEsApelacion] = useState(false);
  const [reclamo, setReclamo] = useState<Reclamo | null>(() => {
    if (!id) return null;
    return getReclamoPorId(id) || null;
  });
  
  // Entidades relacionadas
  const denuncia = useMemo(() => {
    if (!reclamo?.entidadOrigenId && !reclamo?.denunciaAsociada) return null;
    const denId = reclamo.origenReclamo === 'DENUNCIA' ? reclamo.entidadOrigenId : reclamo.denunciaAsociada;
    if (!denId) return null;
    return getDenunciaPorId(denId) || null;
  }, [reclamo]);
  
  const cargo = useMemo(() => {
    if (!reclamo?.cargoAsociado && reclamo?.origenReclamo !== 'CARGO') return null;
    const carId = reclamo.entidadOrigenId || reclamo.cargoAsociado;
    if (!carId) return null;
    return getCargoPorId(carId) || null;
  }, [reclamo]);
  
  const giro = useMemo(() => {
    if (!reclamo?.giroAsociado && reclamo?.origenReclamo !== 'GIRO') return null;
    const girId = reclamo.entidadOrigenId || reclamo.giroAsociado;
    if (!girId) return null;
    return getGiroPorId(girId) || null;
  }, [reclamo]);
  
  const aduana = useMemo(() => {
    if (!reclamo?.codigoAduana && !reclamo?.aduana) return null;
    return aduanas.find(a => a.codigo === reclamo.codigoAduana || a.nombre === reclamo.aduana);
  }, [reclamo]);
  
  const permisos = useMemo(() => reclamo ? getPermisosReclamo(reclamo) : null, [reclamo]);
  const allNotifications = getTodasLasNotificaciones();
  
  if (!reclamo) {
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
        <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-[60vh]">
          <div className="text-center">
            <Icon name="FileX" size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Reclamo no encontrado</h2>
            <p className="text-gray-500 mt-2">El reclamo que buscas no existe o ha sido eliminado.</p>
            <button
              onClick={() => navigate(ERoutePaths.RECLAMOS)}
              className="mt-4 px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark"
            >
              Volver a Reclamos
            </button>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  const getEstadoBadgeVariant = () => {
    const variantMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      'Ingresado': 'info',
      'En Admisibilidad': 'warning',
      'Admitido': 'info',
      'En Análisis': 'warning',
      'En Tramitación': 'warning',
      'Pendiente Resolución': 'warning',
      'Derivado a Tribunal': 'info',
      'Fallado': 'success',
      'Resuelto': 'success',
      'Rechazado': 'danger',
      'Acogido': 'success',
      'Acogido Parcialmente': 'warning',
      'Cerrado': 'default',
    };
    return variantMap[reclamo.estado] || 'default';
  };
  
  const handleRegistrarAdmisibilidad = (admisible: boolean, motivo?: string) => {
    const resultado = registrarAdmisibilidad(reclamo.id, admisible, motivo);
    if (resultado.exito && resultado.reclamo) {
      setReclamo(resultado.reclamo);
    }
  };
  
  const handleRegistrarFallo = (tipoFallo: TipoFalloTTA, fundamento: string, monto?: number, esApel?: boolean) => {
    const resultado = registrarFallo(reclamo.id, tipoFallo, fundamento, monto, esApel);
    if (resultado.exito && resultado.reclamo) {
      setReclamo(resultado.reclamo);
    }
  };
  
  const tabs: Tab[] = [
    { id: 'resumen', label: 'Resumen', icon: <Icon name="FileText" size={18} /> },
    { id: 'fundamentos', label: 'Fundamentos', icon: <Icon name="AlignLeft" size={18} /> },
    { id: 'origen', label: 'Origen', icon: <Icon name="Link" size={18} /> },
    ...(reclamo.tipoReclamo === 'TTA' ? [
      { id: 'tta', label: 'Datos TTA', icon: <Icon name="Scale" size={18} />, badge: reclamo.datosTTA?.rolTTA ? 1 : 0, badgeVariant: 'info' as const }
    ] : []),
    { id: 'historial', label: 'Historial', icon: <Icon name="Clock" size={18} /> },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return <ReclamoResumen reclamo={reclamo} aduana={aduana} />;
      case 'fundamentos':
        return <ReclamoFundamentos reclamo={reclamo} />;
      case 'origen':
        return <ReclamoOrigen reclamo={reclamo} denuncia={denuncia} cargo={cargo} giro={giro} />;
      case 'tta':
        return <ReclamoTTA reclamo={reclamo} />;
      case 'historial':
        return <ReclamoTimeline reclamo={reclamo} />;
      default:
        return null;
    }
  };
  
  const validacionAdmisibilidad = puedeRegistrarAdmisibilidad(reclamo);
  const validacionFallo = puedeRegistrarFallo(reclamo);

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
    <div className="flex-1 flex flex-col bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(ERoutePaths.RECLAMOS)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-aduana-azul">{reclamo.numeroReclamo}</h1>
                <Badge variant={reclamo.tipoReclamo === 'TTA' ? 'danger' : 'warning'}>
                  {reclamo.tipoReclamo}
                </Badge>
                <Badge variant={getEstadoBadgeVariant()}>
                  {reclamo.estado}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">
                {reclamo.reclamante} • {reclamo.rutReclamante}
              </p>
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-3">
            {permisos?.puedeEditar && (
              <button
                onClick={() => navigate(ERoutePaths.RECLAMOS_EDITAR.replace(':id', reclamo.id))}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Icon name="Edit" size={18} />
                Editar
              </button>
            )}
            {permisos?.puedeRegistrarAdmisibilidad && validacionAdmisibilidad.valido && (
              <button
                onClick={() => setShowModalAdmisibilidad(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Icon name="CheckCircle" size={18} />
                Registrar Admisibilidad
              </button>
            )}
            {permisos?.puedeRegistrarFallo && validacionFallo.valido && (
              <button
                onClick={() => {
                  setEsApelacion(false);
                  setShowModalFallo(true);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <Icon name="Gavel" size={18} />
                Registrar Fallo
              </button>
            )}
            {permisos?.puedeRegistrarApelacion && (
              <button
                onClick={() => {
                  setEsApelacion(true);
                  setShowModalFallo(true);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Icon name="CornerUpRight" size={18} />
                Registrar Apelación
              </button>
            )}
            <button className="px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark flex items-center gap-2">
              <Icon name="Download" size={18} />
              Exportar
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid auto-grid gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Fecha Ingreso</p>
            <p className="font-semibold text-lg">{reclamo.fechaIngreso}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Plazo</p>
            <p className="font-semibold text-lg">{reclamo.plazo || '-'} días</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Días Transcurridos</p>
            <p className={`font-semibold text-lg ${reclamo.diasRespuesta > (reclamo.plazo || 15) ? 'text-red-600' : ''}`}>
              {reclamo.diasRespuesta}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Monto Reclamado</p>
            <p className="font-semibold text-lg text-aduana-azul">
              {reclamo.montoReclamado ? formatMonto(reclamo.montoReclamado) : '-'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Origen</p>
            <p className="font-semibold text-lg">{reclamo.origenReclamo}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Aduana</p>
            <p className="font-semibold text-lg">{aduana?.nombre || reclamo.aduana || '-'}</p>
          </div>
        </div>
      </div>
      
      {/* Alerta de vencimiento */}
      {reclamo.diasRespuesta > 0 && reclamo.diasRespuesta > (reclamo.plazo || 15) - 5 && !['Cerrado', 'Resuelto', 'Fallado'].includes(reclamo.estado) && (
        <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center gap-3 ${
          reclamo.diasRespuesta > (reclamo.plazo || 15) 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <Icon 
            name="AlertTriangle" 
            size={24} 
            className={reclamo.diasRespuesta > (reclamo.plazo || 15) ? 'text-red-500' : 'text-amber-500'} 
          />
          <div>
            <p className={`font-medium ${reclamo.diasRespuesta > (reclamo.plazo || 15) ? 'text-red-700' : 'text-amber-700'}`}>
              {reclamo.diasRespuesta > (reclamo.plazo || 15) 
                ? '¡Plazo vencido!' 
                : 'Plazo próximo a vencer'}
            </p>
            <p className={`text-sm ${reclamo.diasRespuesta > (reclamo.plazo || 15) ? 'text-red-600' : 'text-amber-600'}`}>
              {reclamo.diasRespuesta > (reclamo.plazo || 15)
                ? `El plazo de ${reclamo.plazo || 15} días ha sido excedido por ${reclamo.diasRespuesta - (reclamo.plazo || 15)} días.`
                : `Quedan ${(reclamo.plazo || 15) - reclamo.diasRespuesta} días para el vencimiento del plazo.`}
            </p>
          </div>
        </div>
      )}
      
      {/* Tabs y Contenido */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Modales */}
      <ModalAdmisibilidad
        reclamo={reclamo}
        isOpen={showModalAdmisibilidad}
        onClose={() => setShowModalAdmisibilidad(false)}
        onConfirm={handleRegistrarAdmisibilidad}
      />
      
      <ModalRegistrarFallo
        reclamo={reclamo}
        isOpen={showModalFallo}
        onClose={() => setShowModalFallo(false)}
        onConfirm={handleRegistrarFallo}
        esApelacion={esApelacion}
      />
    </div>
    </CustomLayout>
  );
};

export default ReclamoDetalle;

