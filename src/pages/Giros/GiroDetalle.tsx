/**
 * GiroDetalle - Vista 360° del Giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import { Badge, Modal, Tabs } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';
import { ArchivoViewer } from '../../components/ArchivoViewer';
import { FileUploader, type UploadedFileInfo } from '../../components/FileUploader';

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
  getOrCrearExpedientePorEntidad,
  agregarArchivosAExpediente,
  eliminarArchivoDeExpediente,
  getPermisosArchivo,
  type ExpedienteDigital,
  type ArchivoExpediente,
  type TipoArchivoExpediente,
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
  const [expediente, setExpediente] = useState<ExpedienteDigital | null>(null);
  const [modalSubirArchivo, setModalSubirArchivo] = useState(false);
  const [modalVisualizarArchivo, setModalVisualizarArchivo] = useState<{ isOpen: boolean; archivoId?: string }>({
    isOpen: false,
  });
  
  const allNotifications = getTodasLasNotificaciones();

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const inferTipoArchivo = (fileName: string): TipoArchivoExpediente => {
    const extension = '.' + (fileName.split('.').pop()?.toLowerCase() || '');
    switch (extension) {
      case '.pdf':
        return 'PDF';
      case '.xml':
        return 'XML';
      case '.doc':
        return 'DOC';
      case '.docx':
        return 'DOCX';
      case '.xls':
        return 'XLS';
      case '.xlsx':
        return 'XLSX';
      case '.jpg':
      case '.jpeg':
        return 'JPG';
      case '.png':
        return 'PNG';
      case '.zip':
        return 'ZIP';
      case '.rar':
        return 'RAR';
      case '.msg':
        return 'MSG';
      case '.eml':
        return 'EML';
      case '.txt':
      default:
        return 'TXT';
    }
  };

  const getIconForArchivo = (archivo: ArchivoExpediente): string => {
    switch (archivo.tipo) {
      case 'PDF':
      case 'DOC':
      case 'DOCX':
        return 'FileText';
      case 'XML':
        return 'Code';
      case 'XLS':
      case 'XLSX':
        return 'FileSpreadsheet';
      case 'JPG':
      case 'PNG':
        return 'Image';
      case 'ZIP':
      case 'RAR':
        return 'FolderArchive';
      default:
        return 'File';
    }
  };
  
  // Obtener giro
  const giro = useMemo(() => {
    if (!id) return null;
    return getGiroPorId(id);
  }, [id]);

  // Obtener/crear expediente digital del giro
  useEffect(() => {
    if (!giro) return;
    const exp = getOrCrearExpedientePorEntidad(giro.id, 'GIRO', giro.numeroGiro);
    setExpediente({
      ...exp,
      archivos: [...(exp.archivos || [])],
      timeline: [...(exp.timeline || [])],
    });
  }, [giro]);
  
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
      id: 'archivos',
      label: 'Archivos',
      icon: <Icon name="Paperclip" size={16} />,
      badge: expediente?.archivos?.length || 0,
    },
    { 
      id: 'historial', 
      label: 'Historial', 
      icon: <Icon name="Clock" size={16} /> 
    },
  ], [giro, expediente?.archivos?.length]);
  
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

  const handleUploadComplete = (files: UploadedFileInfo[]) => {
    if (!expediente) return;

    const ahora = new Date();
    const fechaSubida = ahora.toISOString().split('T')[0];
    const horaSubida = ahora.toTimeString().slice(0, 5);

    const nuevosArchivos: ArchivoExpediente[] = files.map((fileInfo, idx) => {
      const archivoId = `archivo-${Date.now()}-${idx}`;
      const extension = fileInfo.file.name.split('.').pop()?.toLowerCase() || '';
      const tipo = inferTipoArchivo(fileInfo.file.name);

      return {
        id: archivoId,
        expedienteId: expediente.id,
        nombre: fileInfo.file.name,
        nombreOriginal: fileInfo.file.name,
        tipo,
        extension,
        tamanio: formatFileSize(fileInfo.file.size),
        tamanioBytes: fileInfo.file.size,
        fechaSubida,
        horaSubida,
        usuarioSubida: usuarioActual.login || 'usuario',
        nombreUsuarioSubida: usuarioActual.name,
        estado: 'Vigente',
        categoria: fileInfo.categoria,
        origen: 'Manual',
        descripcion: fileInfo.descripcion || undefined,
        rutaArchivo: `/expedientes/${expediente.id}/${fileInfo.file.name}`,
        urlDescarga: `/api/expedientes/archivos/${archivoId}/descargar`,
        urlVisualizacion: `/api/expedientes/archivos/${archivoId}/visualizar`,
      };
    });

    const actualizado = agregarArchivosAExpediente(
      expediente.id,
      nuevosArchivos,
      usuarioActual.login || 'usuario'
    );

    if (actualizado) {
      setExpediente({
        ...actualizado,
        archivos: [...(actualizado.archivos || [])],
        timeline: [...(actualizado.timeline || [])],
      });
    }
  };

  const handleDescargarArchivo = (archivoId: string) => {
    if (!expediente) return;
    const archivo = expediente.archivos.find((a) => a.id === archivoId);
    if (!archivo) return;
    alert(`Descarga simulada: ${archivo.nombre}`);
  };

  const handleEliminarArchivo = (archivoId: string) => {
    if (!expediente) return;
    if (!confirm('¿Está seguro que desea eliminar este archivo?')) return;

    const actualizado = eliminarArchivoDeExpediente(
      expediente.id,
      archivoId,
      usuarioActual.login || 'usuario'
    );

    if (actualizado) {
      setExpediente({
        ...actualizado,
        archivos: [...(actualizado.archivos || [])],
        timeline: [...(actualizado.timeline || [])],
      });
    }
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
              {giro.emitidoA} • {(giro.tipoIdDeudor || 'RUT')}: {giro.rutDeudor}
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

            {activeTab === 'archivos' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">Archivos del Giro</h4>
                  <CustomButton
                    variant="primary"
                    className="flex items-center gap-2 text-sm"
                    onClick={() => setModalSubirArchivo(true)}
                  >
                    <Icon name="Upload" size={16} />
                    Subir Archivo
                  </CustomButton>
                </div>

                {!expediente ? (
                  <div className="card p-8 text-center">
                    <Icon name="Loader" size={40} className="mx-auto text-gray-300 mb-3 animate-spin" />
                    <p className="text-gray-600">Cargando expediente...</p>
                  </div>
                ) : expediente.archivos.length === 0 ? (
                  <div className="card p-8 text-center">
                    <Icon name="FileX" size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">No hay archivos adjuntos en este giro.</p>
                    <p className="text-sm text-gray-500 mt-1">Puedes subir comprobantes, notificaciones u otros documentos.</p>
                  </div>
                ) : (
                  <div className="card overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Archivo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Categoría
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Fecha
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Usuario
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tamaño
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {expediente.archivos.map((archivo) => {
                          const permisosArchivo = getPermisosArchivo(archivo, usuarioActual.role);
                          return (
                            <tr key={archivo.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Icon
                                    name={getIconForArchivo(archivo) as any}
                                    size={18}
                                    className="text-aduana-azul"
                                  />
                                  <div>
                                    <span className="font-medium text-gray-900">{archivo.nombre}</span>
                                    {archivo.descripcion && (
                                      <p className="text-xs text-gray-500">{archivo.descripcion}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="info" size="sm">
                                  {archivo.categoria}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{archivo.fechaSubida}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {archivo.nombreUsuarioSubida || archivo.usuarioSubida}
                              </td>
                              <td className="px-4 py-3 text-gray-600">{archivo.tamanio}</td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                  {permisosArchivo.puedeVisualizar && (
                                    <button
                                      className="p-1 text-gray-500 hover:text-aduana-azul"
                                      title="Ver archivo"
                                      onClick={() =>
                                        setModalVisualizarArchivo({ isOpen: true, archivoId: archivo.id })
                                      }
                                    >
                                      <Icon name="Eye" size={16} />
                                    </button>
                                  )}
                                  {permisosArchivo.puedeDescargar && (
                                    <button
                                      className="p-1 text-gray-500 hover:text-emerald-600"
                                      onClick={() => handleDescargarArchivo(archivo.id)}
                                      title="Descargar"
                                    >
                                      <Icon name="Download" size={16} />
                                    </button>
                                  )}
                                  {permisosArchivo.puedeEliminar && (
                                    <button
                                      className="p-1 text-gray-500 hover:text-red-600"
                                      onClick={() => handleEliminarArchivo(archivo.id)}
                                      title="Eliminar"
                                    >
                                      <Icon name="Trash2" size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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

      {/* Modal subir archivo */}
      <Modal
        isOpen={modalSubirArchivo}
        onClose={() => setModalSubirArchivo(false)}
        size="lg"
        showCloseButton={false}
      >
        {expediente ? (
          <FileUploader
            expedienteId={expediente.id}
            onUploadComplete={handleUploadComplete}
            onClose={() => setModalSubirArchivo(false)}
          />
        ) : null}
      </Modal>

      {/* Modal visualizar archivo */}
      <Modal
        isOpen={modalVisualizarArchivo.isOpen}
        onClose={() => setModalVisualizarArchivo({ isOpen: false })}
        size="full"
        showCloseButton={false}
      >
        {(() => {
          const archivoSeleccionado = expediente?.archivos.find(
            (archivo) => archivo.id === modalVisualizarArchivo.archivoId
          );
          return archivoSeleccionado ? (
            <ArchivoViewer
              archivo={archivoSeleccionado}
              onClose={() => setModalVisualizarArchivo({ isOpen: false })}
            />
          ) : null;
        })()}
      </Modal>
    </CustomLayout>
  );
};

export default GiroDetalle;

