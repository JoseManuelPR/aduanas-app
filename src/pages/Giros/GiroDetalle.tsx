/**
 * GiroDetalle - Vista 360° del Giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import { Badge, Tabs } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import {
  getGiroPorId,
  getTodasLasNotificaciones,
  usuarioActual,
  getPermisosGiro,
  puedeRegistrarPago,
  puedeAnularGiro,
  getCargoPorId,
  getDenunciaPorId,
  formatMonto,
} from '../../data';

// Sub-componentes
import { GiroResumen } from './components/GiroResumen';
import { GiroCuentas } from './components/GiroCuentas';
import { GiroPagos } from './components/GiroPagos';
import { GiroTimeline } from './components/GiroTimeline';
import { ModalRegistrarPago } from './components/ModalRegistrarPago';
import { ModalAnularGiro } from './components/ModalAnularGiro';

export const GiroDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('resumen');
  const [showModalPago, setShowModalPago] = useState(false);
  const [showModalAnular, setShowModalAnular] = useState(false);
  
  const allNotifications = getTodasLasNotificaciones();
  
  // Obtener giro
  const giro = useMemo(() => {
    if (!id) return null;
    return getGiroPorId(id);
  }, [id]);
  
  // Obtener permisos según estado
  const permisos = useMemo(() => {
    if (!giro) return null;
    return getPermisosGiro(giro.estado);
  }, [giro]);
  
  // Validación para registrar pago
  const validacionPago = useMemo(() => {
    if (!giro) return { valido: false, errores: [] };
    return puedeRegistrarPago(giro);
  }, [giro]);
  
  // Validación para anular
  const validacionAnular = useMemo(() => {
    if (!giro) return { valido: false, errores: [] };
    return puedeAnularGiro(giro);
  }, [giro]);
  
  // Datos relacionados
  const cargoAsociado = useMemo(() => {
    if (!giro?.cargoAsociado && !giro?.entidadOrigenId) return null;
    if (giro.origenGiro === 'CARGO') {
      return getCargoPorId(giro.entidadOrigenId || giro.cargoAsociado || '');
    }
    return null;
  }, [giro]);
  
  const denunciaAsociada = useMemo(() => {
    if (!giro?.denunciaAsociada && !giro?.entidadOrigenId) return null;
    if (giro.origenGiro === 'DENUNCIA') {
      return getDenunciaPorId(giro.entidadOrigenId || giro.denunciaAsociada || '');
    }
    return null;
  }, [giro]);
  
  // Definir tabs
  const tabs = useMemo(() => [
    { 
      id: 'resumen', 
      label: 'Resumen', 
      icon: <Icon name="FileText" size={16} /> 
    },
    { 
      id: 'cuentas', 
      label: 'Cuentas', 
      icon: <Icon name="Calculator" size={16} />,
      badge: giro?.cuentas?.length || 0,
    },
    { 
      id: 'pagos', 
      label: 'Pagos', 
      icon: <Icon name="CreditCard" size={16} />,
      badge: giro?.pagos?.length || 0,
      badgeVariant: (giro?.pagos?.length || 0) > 0 ? 'success' as const : undefined,
    },
    { 
      id: 'historial', 
      label: 'Historial', 
      icon: <Icon name="Clock" size={16} /> 
    },
  ], [giro]);
  
  // Handlers
  const handleRegistrarPago = () => {
    if (!validacionPago.valido) {
      alert('No se puede registrar pago:\n' + validacionPago.errores.join('\n'));
      return;
    }
    setShowModalPago(true);
  };
  
  const handleAnularGiro = () => {
    if (!validacionAnular.valido) {
      alert('No se puede anular el giro:\n' + validacionAnular.errores.join('\n'));
      return;
    }
    setShowModalAnular(true);
  };
  
  // Obtener badge variant según estado
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Pagado': return 'success';
      case 'Parcialmente Pagado': return 'warning';
      case 'Vencido': return 'error';
      case 'Anulado': return 'error';
      case 'Notificado': return 'info';
      default: return 'proceso';
    }
  };
  
  if (!giro) {
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
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Giro no encontrado</h2>
            <p className="text-gray-500 mt-2">El giro solicitado no existe o fue eliminado.</p>
            <CustomButton 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate(ERoutePaths.GIROS)}
            >
              Volver a Giros
            </CustomButton>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  const montoTotal = giro.montoTotalNumero || parseInt(giro.montoTotal.replace(/[$,.]/g, ''));
  const saldoPendiente = giro.saldoPendiente ?? (montoTotal - (giro.montoPagado || 0));
  
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
        {/* Banner de giro vencido */}
        {giro.estado === 'Vencido' && giro.diasVencimiento && giro.diasVencimiento < 0 && (
          <div className="bg-red-600 text-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="AlertTriangle" size={24} />
              <div>
                <p className="font-bold">Giro vencido hace {Math.abs(giro.diasVencimiento)} días</p>
                <p className="text-sm text-white/80">
                  Fecha de vencimiento: {giro.fechaVencimiento} • Saldo pendiente: {formatMonto(saldoPendiente)}
                </p>
              </div>
            </div>
            {permisos?.puedeRegistrarPago && (
              <CustomButton 
                variant="secondary" 
                className="bg-white text-red-600 hover:bg-red-50"
                onClick={handleRegistrarPago}
              >
                <Icon name="CreditCard" size={16} />
                Registrar Pago
              </CustomButton>
            )}
          </div>
        )}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => navigate(ERoutePaths.GIROS)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <span className="text-sm text-gray-500">Giros /</span>
              <span className="text-sm font-medium text-aduana-azul">{giro.numeroGiro}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Giro {giro.numeroGiro}
              <Badge 
                variant={giro.tipoGiro === 'F09' ? 'info' : giro.tipoGiro === 'F16' ? 'warning' : 'default'}
              >
                {giro.tipoGiro}
              </Badge>
              <Badge variant={getEstadoBadgeVariant(giro.estado)} dot pulse={giro.estado === 'Vencido'}>
                {giro.estado}
              </Badge>
            </h1>
            <p className="text-gray-600 mt-1">
              {giro.emitidoA} • RUT: {giro.rutDeudor}
            </p>
          </div>
          
          {/* Acciones principales */}
          <div className="flex flex-wrap gap-2">
            {permisos?.puedeRegistrarPago && (
              <CustomButton 
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleRegistrarPago}
              >
                <Icon name="CreditCard" size={16} />
                Registrar Pago
              </CustomButton>
            )}
            {permisos?.puedeNotificar && giro.estado === 'Emitido' && (
              <CustomButton 
                variant="secondary"
                onClick={() => alert('Funcionalidad de notificación')}
              >
                <Icon name="Bell" size={16} />
                Notificar
              </CustomButton>
            )}
            {permisos?.puedeAnular && (
              <CustomButton 
                variant="secondary"
                className="text-red-600 hover:bg-red-50"
                onClick={handleAnularGiro}
              >
                <Icon name="XCircle" size={16} />
                Anular Giro
              </CustomButton>
            )}
            {cargoAsociado && (
              <CustomButton 
                variant="secondary"
                onClick={() => navigate(`/cargos/${cargoAsociado.id}`)}
              >
                <Icon name="FileText" size={16} />
                Ver Cargo
              </CustomButton>
            )}
            {denunciaAsociada && (
              <CustomButton 
                variant="secondary"
                onClick={() => navigate(`/denuncias/${denunciaAsociada.id}`)}
              >
                <Icon name="FileText" size={16} />
                Ver Denuncia
              </CustomButton>
            )}
          </div>
        </div>
        
        {/* Cards de montos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 border-l-4 border-l-aduana-azul bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Giro</p>
                <p className="text-2xl font-bold text-aduana-azul">{giro.montoTotal}</p>
              </div>
              <div className="p-3 bg-aduana-azul/10 rounded-full">
                <Icon name="Receipt" size={24} className="text-aduana-azul" />
              </div>
            </div>
          </div>
          
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm text-gray-600">Monto Pagado</p>
            <p className="text-xl font-bold text-emerald-600">{formatMonto(giro.montoPagado || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {giro.pagos?.length || 0} pago(s) registrado(s)
            </p>
          </div>
          
          <div className={`card p-4 border-l-4 ${saldoPendiente > 0 ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
            <p className="text-sm text-gray-600">Saldo Pendiente</p>
            <p className={`text-xl font-bold ${saldoPendiente > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatMonto(saldoPendiente)}
            </p>
            {saldoPendiente === 0 && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                <Icon name="CheckCircle" size={12} />
                Pagado completo
              </p>
            )}
          </div>
          
          <div className={`card p-4 border-l-4 ${
            giro.diasVencimiento && giro.diasVencimiento < 0 
              ? 'border-l-red-500' 
              : giro.diasVencimiento && giro.diasVencimiento <= 5 
                ? 'border-l-amber-500' 
                : 'border-l-purple-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencimiento</p>
                <p className="text-sm font-medium">{giro.fechaVencimiento}</p>
                {giro.diasVencimiento !== undefined && (
                  <Badge 
                    variant={
                      giro.diasVencimiento < 0 ? 'error' : 
                      giro.diasVencimiento <= 5 ? 'warning' : 'info'
                    }
                    pulse={giro.diasVencimiento < 0}
                    className="mt-1"
                  >
                    {giro.diasVencimiento < 0 
                      ? `${Math.abs(giro.diasVencimiento)} días vencido` 
                      : giro.diasVencimiento === 0 
                        ? 'Vence hoy' 
                        : `${giro.diasVencimiento} días`}
                  </Badge>
                )}
              </div>
              <Icon name="Calendar" size={20} className="text-purple-500" />
            </div>
          </div>
        </div>
        
        {/* Barra de progreso de pago */}
        {saldoPendiente > 0 && (giro.montoPagado || 0) > 0 && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso de Pago</span>
              <span className="text-sm text-gray-500">
                {Math.round(((giro.montoPagado || 0) / montoTotal) * 100)}% completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                style={{ width: `${Math.min(((giro.montoPagado || 0) / montoTotal) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Pagado: {formatMonto(giro.montoPagado || 0)}</span>
              <span>Pendiente: {formatMonto(saldoPendiente)}</span>
            </div>
          </div>
        )}
        
        {/* Tabs y contenido */}
        <div className="card overflow-hidden">
          <Tabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="p-6">
            {activeTab === 'resumen' && (
              <GiroResumen 
                giro={giro} 
                cargo={cargoAsociado ?? null}
                denuncia={denunciaAsociada ?? null}
                onVerCargo={() => cargoAsociado && navigate(`/cargos/${cargoAsociado.id}`)}
                onVerDenuncia={() => denunciaAsociada && navigate(`/denuncias/${denunciaAsociada.id}`)}
                onVerDeudor={() => alert('Ver detalle del deudor')}
              />
            )}
            
            {activeTab === 'cuentas' && (
              <GiroCuentas 
                cuentas={giro.cuentas || []}
                totalGiro={montoTotal}
              />
            )}
            
            {activeTab === 'pagos' && (
              <GiroPagos 
                pagos={giro.pagos || []}
                montoTotal={montoTotal}
                saldoPendiente={saldoPendiente}
                puedeRegistrar={permisos?.puedeRegistrarPago || false}
                onRegistrarPago={handleRegistrarPago}
              />
            )}
            
            {activeTab === 'historial' && (
              <GiroTimeline giro={giro} />
            )}
          </div>
        </div>
      </div>
      
      {/* Modal registrar pago */}
      <ModalRegistrarPago
        isOpen={showModalPago}
        onClose={() => setShowModalPago(false)}
        giro={giro}
        saldoPendiente={saldoPendiente}
        onPagoRegistrado={() => {
          setShowModalPago(false);
          // Recargar página o refrescar datos
          window.location.reload();
        }}
      />
      
      {/* Modal anular giro */}
      <ModalAnularGiro
        isOpen={showModalAnular}
        onClose={() => setShowModalAnular(false)}
        giro={giro}
        onAnulado={() => {
          setShowModalAnular(false);
          navigate(ERoutePaths.GIROS);
        }}
      />
    </CustomLayout>
  );
};

export default GiroDetalle;

