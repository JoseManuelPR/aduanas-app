/**
 * InvolucradoDetalle - Ficha del Involucrado (Vista 360°)
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { CustomButton } from "../../components/Button/Button";
import { Badge, Tabs, Tab } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

import {
  getInvolucradoPorId,
  getPermisosInvolucrado,
  getHistorialCasos,
  formatRut,
  inactivarInvolucrado,
  activarInvolucrado,
  getTodasLasNotificaciones,
  usuarioActual,
  type Involucrado,
  type DireccionInvolucrado,
  type HistorialCasoInvolucrado,
} from '../../data';

const InvolucradoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('datos');
  const [involucrado, setInvolucrado] = useState<Involucrado | null>(() => {
    if (!id) return null;
    return getInvolucradoPorId(id) || null;
  });
  
  const permisos = useMemo(() => involucrado ? getPermisosInvolucrado(involucrado) : null, [involucrado]);
  const historialCasos = useMemo(() => involucrado ? getHistorialCasos(involucrado) : [], [involucrado]);
  const allNotifications = getTodasLasNotificaciones();
  
  if (!involucrado) {
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
            <Icon name="UserX" size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Involucrado no encontrado</h2>
            <p className="text-gray-500 mt-2">El involucrado que buscas no existe o ha sido eliminado.</p>
            <button
              onClick={() => navigate(ERoutePaths.INVOLUCRADOS)}
              className="mt-4 px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark"
            >
              Volver a Involucrados
            </button>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  const getRutFormateado = (): string => {
    if (involucrado.tipoIdentificacion === 'RUT') {
      return formatRut(`${involucrado.numeroIdentificacion}${involucrado.digitoVerificador || ''}`);
    }
    return involucrado.numeroIdentificacion;
  };
  
  const handleToggleEstado = () => {
    if (involucrado.estado === 'Activo') {
      inactivarInvolucrado(involucrado.id);
      setInvolucrado({ ...involucrado, estado: 'Inactivo' });
    } else {
      activarInvolucrado(involucrado.id);
      setInvolucrado({ ...involucrado, estado: 'Activo' });
    }
  };
  
  const tabs: Tab[] = [
    { id: 'datos', label: 'Datos Generales', icon: <Icon name="User" size={18} /> },
    { id: 'direcciones', label: 'Direcciones', icon: <Icon name="MapPin" size={18} />, badge: involucrado.direcciones.length },
    { id: 'historial', label: 'Historial de Casos', icon: <Icon name="FileText" size={18} />, badge: historialCasos.length, badgeVariant: 'info' as const },
  ];
  
  const renderDatosGenerales = () => (
    <div className="space-y-6">
      {/* Identificación */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="CreditCard" size={20} className="text-aduana-azul" />
          Identificación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Tipo Identificación</p>
            <p className="font-medium">{involucrado.tipoIdentificacion}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">N° Identificación</p>
            <p className="font-semibold font-mono text-aduana-azul">{getRutFormateado()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Tipo Persona</p>
            <Badge variant={involucrado.tipoPersona === 'Jurídica' ? 'info' : 'default'}>
              {involucrado.tipoPersona}
            </Badge>
          </div>
        </div>
      </section>
      
      {/* Datos personales o de empresa */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name={involucrado.tipoPersona === 'Jurídica' ? 'Building' : 'User'} size={20} className="text-aduana-azul" />
          {involucrado.tipoPersona === 'Jurídica' ? 'Datos de la Empresa' : 'Datos Personales'}
        </h3>
        
        {involucrado.tipoPersona === 'Natural' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Nombre</p>
              <p className="font-medium">{involucrado.nombre || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Apellido Paterno</p>
              <p className="font-medium">{involucrado.apellidoPaterno || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Apellido Materno</p>
              <p className="font-medium">{involucrado.apellidoMaterno || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Nacionalidad</p>
              <p className="font-medium">{involucrado.nacionalidad || '-'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Razón Social</p>
              <p className="font-medium">{involucrado.razonSocial || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Giro</p>
              <p className="font-medium">{involucrado.giro || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Nacionalidad</p>
              <p className="font-medium">{involucrado.nacionalidad || '-'}</p>
            </div>
            {involucrado.representanteLegalNombre && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Representante Legal</p>
                  <p className="font-medium">{involucrado.representanteLegalNombre}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">RUT Representante</p>
                  <p className="font-mono">{involucrado.representanteLegalRut || '-'}</p>
                </div>
              </>
            )}
          </div>
        )}
      </section>
      
      {/* Contacto */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Mail" size={20} className="text-aduana-azul" />
          Datos de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Email Principal</p>
            <p className="font-medium text-aduana-azul">{involucrado.email || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Email Secundario</p>
            <p className="font-medium">{involucrado.emailSecundario || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Teléfono Principal</p>
            <p className="font-medium">{involucrado.telefono || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Teléfono Secundario</p>
            <p className="font-medium">{involucrado.telefonoSecundario || '-'}</p>
          </div>
        </div>
      </section>
      
      {/* Observaciones */}
      {involucrado.observaciones && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-aduana-azul" />
            Observaciones
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{involucrado.observaciones}</p>
          </div>
        </section>
      )}
      
      {/* Auditoría */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-aduana-azul" />
          Información de Auditoría
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Fecha Creación</p>
            <p className="font-medium">{involucrado.fechaCreacion}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Usuario Creación</p>
            <p className="font-medium">{involucrado.usuarioCreacion}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Última Modificación</p>
            <p className="font-medium">{involucrado.fechaModificacion || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Usuario Modificación</p>
            <p className="font-medium">{involucrado.usuarioModificacion || '-'}</p>
          </div>
        </div>
      </section>
    </div>
  );
  
  const renderDirecciones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-aduana-azul" />
          Direcciones Registradas
        </h3>
        <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
          <Icon name="Plus" size={16} />
          Agregar Dirección
        </CustomButton>
      </div>
      
      {involucrado.direcciones.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Icon name="MapPin" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay direcciones registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {involucrado.direcciones.map((dir: DireccionInvolucrado) => (
            <div 
              key={dir.id} 
              className={`bg-white border rounded-lg p-4 ${dir.esPrincipal ? 'border-aduana-azul ring-1 ring-aduana-azul/20' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={dir.esPrincipal ? 'info' : 'default'}>
                    {dir.tipoDireccion}
                  </Badge>
                  {dir.esPrincipal && (
                    <span className="text-xs text-aduana-azul bg-aduana-azul/10 px-2 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Icon name="Edit" size={14} className="text-gray-500" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Icon name="Trash2" size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
              
              <p className="font-medium text-gray-900">
                {dir.direccion}{dir.numero ? ` ${dir.numero}` : ''}{dir.departamento ? `, ${dir.departamento}` : ''}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {dir.comuna}, {dir.region}
              </p>
              {dir.codigoPostal && (
                <p className="text-xs text-gray-400 mt-1">CP: {dir.codigoPostal}</p>
              )}
              {dir.pais && dir.pais !== 'Chile' && (
                <p className="text-xs text-gray-400">{dir.pais}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  const renderHistorial = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon name="FileText" size={20} className="text-aduana-azul" />
        Historial de Casos Asociados
      </h3>
      
      {historialCasos.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Icon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay casos asociados a este involucrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historialCasos.map((caso: HistorialCasoInvolucrado, index: number) => {
                const getTipoIcon = () => {
                  switch (caso.tipo) {
                    case 'DENUNCIA': return <Icon name="FileWarning" size={16} className="text-red-500" />;
                    case 'CARGO': return <Icon name="FileText" size={16} className="text-amber-500" />;
                    case 'GIRO': return <Icon name="DollarSign" size={16} className="text-emerald-500" />;
                    case 'RECLAMO': return <Icon name="AlertTriangle" size={16} className="text-purple-500" />;
                    default: return null;
                  }
                };
                
                const getRoute = () => {
                  switch (caso.tipo) {
                    case 'DENUNCIA': return ERoutePaths.DENUNCIAS_DETALLE.replace(':id', caso.id);
                    case 'CARGO': return ERoutePaths.CARGOS_DETALLE.replace(':id', caso.id);
                    case 'GIRO': return ERoutePaths.GIROS_DETALLE.replace(':id', caso.id);
                    case 'RECLAMO': return ERoutePaths.RECLAMOS_DETALLE.replace(':id', caso.id);
                    default: return '#';
                  }
                };
                
                return (
                  <tr key={`${caso.tipo}-${caso.id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getTipoIcon()}
                        <span className="font-medium">{caso.tipo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-aduana-azul">{caso.numero}</td>
                    <td className="px-4 py-3 text-gray-600">{caso.fecha}</td>
                    <td className="px-4 py-3">
                      <Badge variant="proceso">{caso.estado}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{caso.tipoInvolucrado}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {caso.monto || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => navigate(getRoute())}
                        className="text-aduana-azul hover:text-aduana-azul-dark"
                      >
                        <Icon name="ExternalLink" size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'datos':
        return renderDatosGenerales();
      case 'direcciones':
        return renderDirecciones();
      case 'historial':
        return renderHistorial();
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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ERoutePaths.INVOLUCRADOS)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="ArrowLeft" size={20} className="text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-aduana-azul">{involucrado.nombreCompleto}</h1>
                  <Badge variant={involucrado.tipoPersona === 'Jurídica' ? 'info' : 'default'}>
                    {involucrado.tipoPersona}
                  </Badge>
                  <Badge variant={involucrado.estado === 'Activo' ? 'success' : 'default'} dot>
                    {involucrado.estado}
                  </Badge>
                </div>
                <p className="text-gray-500 mt-1 font-mono">
                  {getRutFormateado()} • {involucrado.tipoIdentificacion}
                </p>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="flex items-center gap-3">
              {permisos?.puedeEditar && (
                <CustomButton
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => navigate(ERoutePaths.INVOLUCRADOS_EDITAR.replace(':id', involucrado.id))}
                >
                  <Icon name="Edit" size={18} />
                  Editar
                </CustomButton>
              )}
              {permisos?.puedeInactivar && (
                <CustomButton
                  variant={involucrado.estado === 'Activo' ? 'secondary' : 'primary'}
                  className={`flex items-center gap-2 ${involucrado.estado === 'Activo' ? 'text-red-600 border-red-300 hover:bg-red-50' : ''}`}
                  onClick={handleToggleEstado}
                >
                  <Icon name={involucrado.estado === 'Activo' ? 'UserMinus' : 'UserCheck'} size={18} />
                  {involucrado.estado === 'Activo' ? 'Inactivar' : 'Activar'}
                </CustomButton>
              )}
            </div>
          </div>
        </div>
        
        {/* Alerta si no se puede eliminar */}
        {permisos && !permisos.puedeEliminar && permisos.motivoNoEliminar && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <Icon name="AlertTriangle" size={24} className="text-amber-500" />
            <p className="text-amber-700">{permisos.motivoNoEliminar}</p>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">Denuncias</p>
            <p className="text-2xl font-bold text-red-600">{involucrado.denunciasAsociadas?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">Cargos</p>
            <p className="text-2xl font-bold text-amber-600">{involucrado.cargosAsociados?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">Giros</p>
            <p className="text-2xl font-bold text-emerald-600">{involucrado.girosAsociados?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">Reclamos</p>
            <p className="text-2xl font-bold text-purple-600">{involucrado.reclamosAsociados?.length || 0}</p>
          </div>
        </div>
        
        {/* Tabs y Contenido */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default InvolucradoDetalle;

