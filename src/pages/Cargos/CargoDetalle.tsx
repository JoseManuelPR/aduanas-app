/**
 * CargoDetalle - Vista 360° del Cargo
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import { Badge, getEstadoBadgeVariant, Tabs } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import {
  getCargoPorId,
  getTodasLasNotificaciones,
  usuarioActual,
  getPermisosCargo,
  puedeGenerarCargo,
  formatMonto,
  getDenunciaPorId,
  giros,
} from '../../data';

// Sub-componentes
import { CargoResumen } from './components/CargoResumen';
import { CargoCuentas } from './components/CargoCuentas';
import { CargoInfractores } from './components/CargoInfractores';
import { CargoDocumentos } from './components/CargoDocumentos';
import { CargoTimeline } from './components/CargoTimeline';
import { ModalConfirmacion } from './components/ModalConfirmacion';
import { ModalAgregarCuenta } from './components/ModalAgregarCuenta';

export const CargoDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('resumen');
  const [showModalGeneracion, setShowModalGeneracion] = useState(false);
  const [showModalGiro, setShowModalGiro] = useState(false);
  const [showModalCuenta, setShowModalCuenta] = useState(false);
  
  const allNotifications = getTodasLasNotificaciones();
  
  // Obtener cargo
  const cargo = useMemo(() => {
    if (!id) return null;
    return getCargoPorId(id);
  }, [id]);
  
  // Obtener permisos según estado
  const permisos = useMemo(() => {
    if (!cargo) return null;
    return getPermisosCargo(cargo.estado);
  }, [cargo]);
  
  // Validación para generar
  const validacionGeneracion = useMemo(() => {
    if (!cargo) return { valido: false, errores: [] };
    return puedeGenerarCargo(cargo);
  }, [cargo]);
  
  // Datos relacionados
  const denunciaAsociada = useMemo(() => {
    if (!cargo?.denunciaAsociada) return null;
    return getDenunciaPorId(cargo.denunciaAsociada);
  }, [cargo]);
  
  const girosDelCargo = useMemo(() => {
    if (!cargo?.girosGenerados) return [];
    return giros.filter(g => cargo.girosGenerados?.includes(g.id));
  }, [cargo]);
  
  
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
      badge: cargo?.cuentas?.length || 0,
    },
    { 
      id: 'infractores', 
      label: 'Infractores', 
      icon: <Icon name="Users" size={16} />,
      badge: cargo?.infractores?.length || 0,
    },
    { 
      id: 'documentos', 
      label: 'Documentos', 
      icon: <Icon name="Folder" size={16} />,
      badge: cargo?.documentosAduaneros?.length || 0,
    },
    { 
      id: 'giros', 
      label: 'Giros', 
      icon: <Icon name="Receipt" size={16} />,
      badge: girosDelCargo.length,
    },
    { 
      id: 'trazabilidad', 
      label: 'Historial', 
      icon: <Icon name="Clock" size={16} /> 
    },
  ], [cargo, girosDelCargo]);
  
  // Handlers
  const handleGenerarCargo = () => {
    if (!validacionGeneracion.valido) {
      alert('No se puede generar el cargo:\n' + validacionGeneracion.errores.join('\n'));
      return;
    }
    setShowModalGeneracion(true);
  };
  
  const confirmarGeneracion = () => {
    // Aquí iría la lógica de emisión
    setShowModalGeneracion(false);
    alert('Cargo emitido exitosamente');
    // navigate(ERoutePaths.CARGOS);
  };
  
  const handleGenerarGiro = () => {
    setShowModalGiro(true);
  };
  
  const confirmarGenerarGiro = () => {
    setShowModalGiro(false);
    navigate(`${ERoutePaths.GIROS_NUEVO}?cargoId=${cargo?.id}`);
  };
  
  const handleAgregarCuenta = () => {
    setShowModalCuenta(true);
  };
  
  if (!cargo) {
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
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Cargo no encontrado</h2>
            <p className="text-gray-500 mt-2">El cargo solicitado no existe o fue eliminado.</p>
            <CustomButton 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate(ERoutePaths.CARGOS)}
            >
              Volver a Cargos
            </CustomButton>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  // Calcular total de cuentas
  const totalCuentas = cargo.cuentas?.reduce((sum, c) => sum + c.monto, 0) || 0;
  
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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => navigate(ERoutePaths.CARGOS)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <span className="text-sm text-gray-500">Cargos /</span>
              <span className="text-sm font-medium text-aduana-azul">{cargo.numeroCargo}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Cargo {cargo.numeroCargo}
              <Badge variant={getEstadoBadgeVariant(cargo.estado)} dot>
                {cargo.estado}
              </Badge>
            </h1>
            <p className="text-gray-600 mt-1">
              {cargo.nombreDeudor} • RUT: {cargo.rutDeudor}
            </p>
          </div>
          
          {/* Acciones principales */}
          <div className="flex flex-wrap gap-2">
            {permisos?.puedeEditar && (
              <CustomButton 
                variant="secondary"
                onClick={() => navigate(`/cargos/${cargo.id}/editar`)}
              >
                <Icon name="Edit" size={16} />
                Editar
              </CustomButton>
            )}
            {permisos?.puedeGenerar && (
              <CustomButton 
                variant="primary"
                onClick={handleGenerarCargo}
                disabled={!validacionGeneracion.valido}
              >
                <Icon name="Send" size={16} />
                Generar Cargo
              </CustomButton>
            )}
            {permisos?.puedeGenerarGiro && (
              <CustomButton 
                variant="primary"
                onClick={handleGenerarGiro}
              >
                <Icon name="Receipt" size={16} />
                Generar Giro
              </CustomButton>
            )}
            {permisos?.puedeNotificar && (
              <CustomButton 
                variant="secondary"
                onClick={() => alert('Funcionalidad de notificación')}
              >
                <Icon name="Bell" size={16} />
                Notificar
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
        
        {/* Alertas de validación */}
        {permisos?.puedeGenerar && !validacionGeneracion.valido && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Requisitos para generar cargo:</p>
                <ul className="list-disc list-inside text-sm text-amber-700 mt-1">
                  {validacionGeneracion.errores.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
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
              <CargoResumen 
                cargo={cargo} 
                denuncia={denunciaAsociada ?? null}
                onVerDenuncia={() => denunciaAsociada && navigate(`/denuncias/${denunciaAsociada.id}`)}
                onVerMercancia={() => cargo.mercanciaId && navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', cargo.mercanciaId))}
              />
            )}
            
            {activeTab === 'cuentas' && (
              <CargoCuentas 
                cuentas={cargo.cuentas || []}
                puedeEditar={permisos?.puedeEditar || false}
                onAgregar={handleAgregarCuenta}
                totalCalculado={totalCuentas}
              />
            )}
            
            {activeTab === 'infractores' && (
              <CargoInfractores 
                infractores={cargo.infractores || []}
                puedeEditar={permisos?.puedeEditar || false}
              />
            )}
            
            {activeTab === 'documentos' && (
              <CargoDocumentos 
                documentos={cargo.documentosAduaneros || []}
                puedeEditar={permisos?.puedeEditar || false}
              />
            )}
            
            {activeTab === 'giros' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Giros Generados</h3>
                  {permisos?.puedeGenerarGiro && (
                    <CustomButton variant="primary" onClick={handleGenerarGiro}>
                      <Icon name="Plus" size={16} />
                      Generar Giro
                    </CustomButton>
                  )}
                </div>
                
                {girosDelCargo.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon name="Receipt" size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No hay giros generados para este cargo</p>
                    {permisos?.puedeGenerarGiro && (
                      <CustomButton 
                        variant="secondary" 
                        className="mt-4"
                        onClick={handleGenerarGiro}
                      >
                        Generar primer giro
                      </CustomButton>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Giro</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Emisión</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {girosDelCargo.map(giro => (
                          <tr key={giro.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-aduana-azul">{giro.numeroGiro}</td>
                            <td className="px-4 py-3">{giro.tipoGiro}</td>
                            <td className="px-4 py-3">{giro.fechaEmision}</td>
                            <td className="px-4 py-3 font-semibold">{giro.montoTotal}</td>
                            <td className="px-4 py-3">
                              <Badge variant={getEstadoBadgeVariant(giro.estado)} dot>
                                {giro.estado}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <CustomButton 
                                variant="secondary" 
                                className="text-xs"
                                onClick={() => navigate(`/giros/${giro.id}`)}
                              >
                                <Icon name="Eye" size={14} />
                                Ver
                              </CustomButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'trazabilidad' && (
              <CargoTimeline cargo={cargo} />
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación de emisión */}
      <ModalConfirmacion
        isOpen={showModalGeneracion}
        onClose={() => setShowModalGeneracion(false)}
        onConfirm={confirmarGeneracion}
        title="Confirmar Generación de Cargo"
        message={`¿Está seguro que desea generar el cargo ${cargo.numeroCargo}?\n\nEsta acción cambiará el estado a "Generado" y no podrá ser revertida.`}
        confirmText="Generar Cargo"
        confirmVariant="primary"
      />
      
      {/* Modal de confirmación generar giro */}
      <ModalConfirmacion
        isOpen={showModalGiro}
        onClose={() => setShowModalGiro(false)}
        onConfirm={confirmarGenerarGiro}
        title="Generar Giro"
        message={`Se creará un nuevo giro asociado al cargo ${cargo.numeroCargo} por un monto de ${formatMonto(totalCuentas)}.\n\n¿Desea continuar?`}
        confirmText="Crear Giro"
        confirmVariant="primary"
      />
      
      {/* Modal agregar cuenta */}
      <ModalAgregarCuenta
        isOpen={showModalCuenta}
        onClose={() => setShowModalCuenta(false)}
        onSave={(_cuenta) => {
          setShowModalCuenta(false);
          alert('Cuenta agregada exitosamente');
        }}
      />
    </CustomLayout>
  );
};

export default CargoDetalle;

