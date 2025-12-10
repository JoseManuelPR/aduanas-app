/**
 * MercanciaDetalle - Vista 360° de la mercancía
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge, Tabs, Tab } from '../../components/UI';
import { 
  getMercanciaPorId,
  getDenunciaPorId,
  getCargoPorId,
  getPermisosMercancia,
  registrarEventoMercancia,
  aduanas,
  getTodasLasNotificaciones,
  usuarioActual,
  type Mercancia,
  type EstadoMercancia,
  type TipoEventoMercancia,
} from '../../data';
import { ERoutePaths } from '../../routes/routes';
import {
  MercanciaResumen,
  MercanciaSeguimiento,
  MercanciaDocumentos,
  ModalRegistrarEvento,
} from './components';

const MercanciaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('resumen');
  const [showModalEvento, setShowModalEvento] = useState(false);
  const [mercancia, setMercancia] = useState<Mercancia | null>(() => {
    if (!id) return null;
    return getMercanciaPorId(id) || null;
  });
  
  // Entidades relacionadas
  const denuncia = useMemo(() => {
    if (!mercancia?.denunciaId) return null;
    return getDenunciaPorId(mercancia.denunciaId) || null;
  }, [mercancia]);
  
  const cargo = useMemo(() => {
    if (!mercancia?.cargoId) return null;
    return getCargoPorId(mercancia.cargoId) || null;
  }, [mercancia]);
  
  const aduana = useMemo(() => {
    if (!mercancia?.codigoAduanaIngreso) return null;
    return aduanas.find(a => a.codigo === mercancia.codigoAduanaIngreso);
  }, [mercancia]);
  
  const permisos = useMemo(() => mercancia ? getPermisosMercancia(mercancia) : null, [mercancia]);
  const allNotifications = getTodasLasNotificaciones();
  
  if (!mercancia) {
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
            <Icon name="Package" size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Mercancía no encontrada</h2>
            <p className="text-gray-500 mt-2">La mercancía que buscas no existe o ha sido eliminada.</p>
            <button
              onClick={() => navigate(ERoutePaths.MERCANCIAS)}
              className="mt-4 px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark"
            >
              Volver a Mercancías
            </button>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  const getEstadoBadgeVariant = (estado: EstadoMercancia): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const variantMap: Record<EstadoMercancia, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      'En Custodia': 'warning',
      'Comisada': 'danger',
      'Entregada': 'success',
      'Subastada': 'info',
      'Destruida': 'default',
      'Donada': 'success',
      'Entregada por RAP': 'success',
      'Incautada Judicialmente': 'danger',
      'Pendiente Disposición': 'warning',
      'En Tránsito': 'info',
      'En Puerto': 'warning',
      'En Depósito': 'warning',
      'Retenida': 'danger',
      'Liberada': 'success',
    };
    return variantMap[estado] || 'default';
  };
  
  const handleRegistrarEvento = (evento: {
    tipoEvento: TipoEventoMercancia;
    fechaEvento: string;
    autoridad?: string;
    nroResolucion?: string;
    fechaResolucion?: string;
    ubicacionNueva?: string;
    observaciones?: string;
    funcionarioResponsable: string;
  }) => {
    const resultado = registrarEventoMercancia(mercancia.id, evento);
    if (resultado.exito && resultado.mercancia) {
      setMercancia(resultado.mercancia);
    }
  };
  
  // Solo Resumen, Seguimiento y Documentos (Items removido - lo mismo que Resumen)
  const tabs: Tab[] = [
    { id: 'resumen', label: 'Resumen', icon: <Icon name="Package" size={18} /> },
    { id: 'seguimiento', label: 'Seguimiento', icon: <Icon name="Clock" size={18} />, badge: mercancia.seguimientos?.length || 0, badgeVariant: 'info' as const },
    { id: 'documentos', label: 'Documentos', icon: <Icon name="FileText" size={18} /> },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return <MercanciaResumen mercancia={mercancia} aduana={aduana} />;
      case 'seguimiento':
        return (
          <MercanciaSeguimiento 
            mercancia={mercancia} 
            onRegistrarEvento={permisos?.puedeRegistrarEvento ? () => setShowModalEvento(true) : undefined}
          />
        );
      case 'documentos':
        return <MercanciaDocumentos mercancia={mercancia} denuncia={denuncia} cargo={cargo} />;
      default:
        return null;
    }
  };

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
              onClick={() => navigate(ERoutePaths.MERCANCIAS)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-aduana-azul font-mono">
                  {mercancia.codigoMercancia || mercancia.id}
                </h1>
                <Badge variant={getEstadoBadgeVariant(mercancia.estado)} dot>
                  {mercancia.estado}
                </Badge>
                {mercancia.tieneAlertaDisposicion && (
                  <Badge variant="warning">
                    <Icon name="AlertTriangle" size={12} className="mr-1" />
                    Alerta
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 mt-1 max-w-xl truncate">
                {mercancia.descripcion}
              </p>
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-3">
            {permisos?.puedeRegistrarEvento && (
              <button
                onClick={() => setShowModalEvento(true)}
                className="px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark flex items-center gap-2"
              >
                <Icon name="Plus" size={18} />
                Registrar Evento
              </button>
            )}
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
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
            <p className="text-sm text-gray-500">Cantidad</p>
            <p className="font-semibold text-lg">{mercancia.cantidad.toLocaleString('es-CL')}</p>
            <p className="text-xs text-gray-400">{mercancia.unidadMedida}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">N° Bultos</p>
            <p className="font-semibold text-lg">{mercancia.numeroBultos?.toLocaleString('es-CL') || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Peso Bruto</p>
            <p className="font-semibold text-lg">{mercancia.pesoBruto?.toLocaleString('es-CL') || '-'}</p>
            <p className="text-xs text-gray-400">kg</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
            <p className="text-sm text-emerald-700">Valor CIF</p>
            <p className="font-semibold text-lg text-emerald-600">
              {mercancia.valorCIF ? `$${mercancia.valorCIF.toLocaleString('es-CL')}` : '-'}
            </p>
            {mercancia.moneda && <p className="text-xs text-emerald-500">{mercancia.moneda}</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Fecha Ingreso</p>
            <p className="font-semibold text-lg">{mercancia.fechaIngreso}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Aduana</p>
            <p className="font-semibold text-lg">{aduana?.nombre || mercancia.codigoAduanaIngreso || '-'}</p>
          </div>
        </div>
      </div>
      
      {/* Alertas */}
      {mercancia.tieneAlertaDisposicion && !mercancia.disposicionFinal && (
        <div className="mx-6 mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Icon name="AlertTriangle" size={24} className="text-amber-500" />
          <div>
            <p className="font-medium text-amber-700">
              Mercancía sin disposición final
            </p>
            <p className="text-sm text-amber-600">
              Esta mercancía requiere que se defina su disposición final (comiso, devolución, destrucción, etc.).
            </p>
          </div>
        </div>
      )}
      
      {mercancia.alertaEventosContradictorios && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <Icon name="AlertCircle" size={24} className="text-red-500" />
          <div>
            <p className="font-medium text-red-700">
              Eventos contradictorios detectados
            </p>
            <p className="text-sm text-red-600">
              Se han detectado eventos que pueden ser contradictorios en el historial de esta mercancía. Revise el seguimiento.
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
      
      {/* Modal Registrar Evento */}
      <ModalRegistrarEvento
        mercancia={mercancia}
        isOpen={showModalEvento}
        onClose={() => setShowModalEvento(false)}
        onConfirm={handleRegistrarEvento}
      />
    </div>
    </CustomLayout>
  );
};

export default MercanciaDetalle;

