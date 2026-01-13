import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import { Badge, Tabs, Timeline, getEstadoBadgeVariant, Modal } from '../../components/UI';
import { DocumentoAduaneroViewer } from '../../components/DocumentoAduaneroViewer';
import { ArchivoViewer } from '../../components/ArchivoViewer';
import { FileUploader, UploadedFileInfo } from '../../components/FileUploader';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import {
  denuncias,
  getTodasLasNotificaciones,
  usuarioActual,
  getExpedientePorEntidad,
  expedientesDigitales,
  getDocumentosAduanerosPorDenuncia,
  getPermisosArchivo,
} from '../../data';

// Configuración de contexto de estados
const ESTADO_CONTEXTO: Record<string, {
  responsable: string;
  descripcion: string;
  siguientePaso: string;
  icono: string;
  color: string;
}> = {
  'En Revisión': {
    responsable: 'Jefe de Sección',
    descripcion: 'Verificando documentación y tipificación',
    siguientePaso: 'Formulación de la denuncia',
    icono: 'Search',
    color: 'blue',
  },
  'Ingresada': {
    responsable: 'Funcionario Fiscalizador',
    descripcion: 'Denuncia ingresada al sistema',
    siguientePaso: 'Revisión por Jefe de Sección',
    icono: 'FileInput',
    color: 'blue',
  },
  'Borrador': {
    responsable: 'Funcionario Fiscalizador',
    descripcion: 'Preparación de documentación',
    siguientePaso: 'Completar e ingresar denuncia',
    icono: 'Edit',
    color: 'gray',
  },
  'Formulada': {
    responsable: 'Sistema',
    descripcion: 'Denuncia formulada formalmente',
    siguientePaso: 'Notificación al denunciado',
    icono: 'FileCheck',
    color: 'emerald',
  },
  'Notificada': {
    responsable: 'Sistema de Notificaciones',
    descripcion: 'En espera de respuesta del denunciado',
    siguientePaso: 'Registro de respuesta o vencimiento de plazo',
    icono: 'Bell',
    color: 'amber',
  },
  'En Proceso': {
    responsable: 'Administrador de Audiencia',
    descripcion: 'Tramitación activa del caso',
    siguientePaso: 'Resolución del proceso',
    icono: 'Clock',
    color: 'blue',
  },
  'Cerrada': {
    responsable: 'Sistema',
    descripcion: 'Proceso finalizado',
    siguientePaso: 'Archivado',
    icono: 'CheckCircle',
    color: 'emerald',
  },
};

// Requisitos de completitud del expediente
interface RequisitoExpediente {
  id: string;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  verificar: (data: { documentosAduaneros: any[]; archivos: any[]; denuncia: any }) => boolean;
}

// Definir requisitos del expediente
const REQUISITOS_EXPEDIENTE: RequisitoExpediente[] = [
  {
    id: 'registro',
    nombre: 'Registro creado',
    descripcion: 'Expediente digital generado en el sistema',
    obligatorio: true,
    verificar: () => true, // Siempre cumplido si existe el expediente
  },
  {
    id: 'denuncia',
    nombre: 'Denuncia ingresada',
    descripcion: 'Formulario de denuncia completado',
    obligatorio: true,
    verificar: ({ denuncia }) => !!denuncia?.numeroDenuncia,
  },
  {
    id: 'documentos_aduaneros',
    nombre: 'Documentos aduaneros',
    descripcion: 'DUS, DIN u otros documentos aduaneros asociados',
    obligatorio: true,
    verificar: ({ documentosAduaneros }) => documentosAduaneros.length > 0,
  },
  {
    id: 'archivos_respaldo',
    nombre: 'Archivos de respaldo',
    descripcion: 'Evidencia fotográfica o documental',
    obligatorio: false,
    verificar: ({ archivos }) => archivos.length > 0,
  },
  {
    id: 'resolucion',
    nombre: 'Resolución',
    descripcion: 'Resolución o dictamen del caso',
    obligatorio: false,
    verificar: ({ denuncia }) => denuncia?.estado === 'Cerrada' || denuncia?.estado === 'Archivada',
  },
];

export const ExpedienteDigital: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados para modales
  const [modalDocumentoAduanero, setModalDocumentoAduanero] = useState<{ isOpen: boolean; documentoId?: string }>({
    isOpen: false,
  });
  const [modalSubirArchivo, setModalSubirArchivo] = useState(false);
  const [modalVisualizarArchivo, setModalVisualizarArchivo] = useState<{ isOpen: boolean; archivoId?: string }>({
    isOpen: false,
  });

  // Estado para búsqueda por N° de denuncia
  const [numeroDenunciaBusqueda] = useState('');

  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();

  // Buscar la denuncia por id o por número de denuncia
  const denunciaData = numeroDenunciaBusqueda 
    ? denuncias.find((d) => d.numeroDenuncia.includes(numeroDenunciaBusqueda))
    : denuncias.find((d) => d.id === id) || denuncias[0];

  // Obtener expediente digital
  const expediente = getExpedientePorEntidad(denunciaData?.id || 'den-001', 'DENUNCIA') || expedientesDigitales[0];

  // Obtener documentos aduaneros relacionados
  const documentosAduaneros = getDocumentosAduanerosPorDenuncia(denunciaData?.id || 'den-001');

  // Calcular completitud del expediente con checklist
  const requisitosCompletados = useMemo(() => {
    return REQUISITOS_EXPEDIENTE.map(req => ({
      ...req,
      completado: req.verificar({
        documentosAduaneros,
        archivos: expediente.archivos,
        denuncia: denunciaData,
      }),
    }));
  }, [documentosAduaneros, expediente.archivos, denunciaData]);

  const completitud = useMemo(() => {
    const obligatorios = requisitosCompletados.filter(r => r.obligatorio);
    const completados = obligatorios.filter(r => r.completado).length;
    return Math.round((completados / obligatorios.length) * 100);
  }, [requisitosCompletados]);

  // Obtener contexto del estado actual
  const estadoContexto = ESTADO_CONTEXTO[expediente.estado] || ESTADO_CONTEXTO['En Revisión'];

  // Determinar si faltan documentos críticos
  const faltanDocumentosAduaneros = documentosAduaneros.length === 0;
  const faltanArchivos = expediente.archivos.length === 0;

  // Permisos del usuario actual
  const permisos = {
    puedeSubir: true,
    puedeDescargar: true,
    puedeVisualizar: true,
    puedeEliminar: usuarioActual.role === 'Administrador' || usuarioActual.role === 'Jefe de Sección',
  };

  const handleUploadComplete = (files: UploadedFileInfo[]) => {
    console.log('Archivos subidos:', files);
    // Aquí se implementaría la lógica para enviar los archivos al backend
  };

  const handleDescargarArchivo = (archivoId: string) => {
    console.log('Descargar archivo:', archivoId);
    // Implementar lógica de descarga
  };

  const handleEliminarArchivo = (archivoId: string) => {
    if (confirm('¿Está seguro que desea eliminar este archivo?')) {
      console.log('Eliminar archivo:', archivoId);
      // Implementar lógica de eliminación
    }
  };

  // Tabs del expediente - Sin resumen extenso, sin movimientos
  const tabs = [
    {
      id: 'documentos-aduaneros',
      label: 'Documentos Aduaneros',
      icon: <Icon name="FileText" size={16} />,
      badge: documentosAduaneros.length,
      badgeVariant: (documentosAduaneros.length === 0 ? 'warning' : undefined) as 'warning' | undefined,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Documentos Aduaneros Asociados</h4>
          </div>
          {documentosAduaneros.length === 0 ? (
            <div className="card border-2 border-dashed border-amber-300 bg-amber-50/50 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <Icon name="AlertTriangle" size={32} className="text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Acción requerida: Asociar documento aduanero
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Este expediente requiere al menos un documento aduanero (DUS, DIN, etc.) 
                  para completar el registro. Sin este documento, no podrá avanzar a la siguiente etapa.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <CustomButton 
                    variant="primary"
                    className="flex items-center gap-2"
                    onClick={() => setModalSubirArchivo(true)}
                  >
                    <Icon name="Upload" size={18} />
                    Cargar documento aduanero
                  </CustomButton>
                  <CustomButton 
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Icon name="Search" size={18} />
                    Buscar en sistema
                  </CustomButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Número
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aduana
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documentosAduaneros.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Badge variant="info" size="sm">
                          {doc.tipoDocumento}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">{doc.numeroDocumento}</td>
                      <td className="px-4 py-3 text-gray-600">{doc.fechaEmision}</td>
                      <td className="px-4 py-3 text-gray-600">{doc.aduana}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getEstadoBadgeVariant(doc.estado)} size="sm">
                          {doc.estado}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-1 text-gray-500 hover:text-aduana-azul"
                            onClick={() =>
                              setModalDocumentoAduanero({ isOpen: true, documentoId: doc.id })
                            }
                            title="Ver documento"
                          >
                            <Icon name="Eye" size={16} />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:text-emerald-600"
                            title="Descargar XML"
                          >
                            <Icon name="Download" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'archivos',
      label: 'Archivos',
      icon: <Icon name="Folder" size={16} />,
      badge: expediente.archivos.length,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Archivos del Expediente</h4>
            {permisos.puedeSubir && expediente.archivos.length > 0 && (
              <CustomButton
                variant="primary"
                className="flex items-center gap-2 text-sm"
                onClick={() => setModalSubirArchivo(true)}
              >
                <Icon name="Upload" size={16} />
                Subir Archivo
              </CustomButton>
            )}
          </div>
          {expediente.archivos.length === 0 ? (
            <div className="card border-2 border-dashed border-blue-200 bg-blue-50/30 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon name="FolderOpen" size={32} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Agregar archivos de respaldo
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Suba evidencia fotográfica, actas, informes u otros documentos que respalden este expediente.
                </p>
                <CustomButton 
                  variant="primary"
                  className="flex items-center gap-2 mx-auto"
                  onClick={() => setModalSubirArchivo(true)}
                >
                  <Icon name="Upload" size={18} />
                  Subir primer archivo
                </CustomButton>
              </div>
            </div>
          ) : (
          <div className="card overflow-hidden">
            {/* Leyenda de origen de archivos */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-xs text-gray-600">
              <span className="font-medium">Origen:</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sistema (automático)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Usuario (manual)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Importado
              </span>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Archivo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1 group relative">
                      Categoría
                      <Icon name="HelpCircle" size={12} className="text-gray-400" />
                      <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Las categorías son un catálogo fijo definido por el sistema según normativa aduanera.
                        <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subido por
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
                  // Determinar color del indicador de origen
                  const origenColor = archivo.origen === 'Sistema' || archivo.origen === 'Notificación' 
                    ? 'bg-blue-500' 
                    : archivo.origen === 'Importado' 
                      ? 'bg-purple-500' 
                      : 'bg-emerald-500';
                  // Nombre descriptivo vs técnico
                  const nombreDescriptivo = archivo.nombreOriginal || archivo.descripcion || archivo.nombre;
                  const nombreTecnico = archivo.nombre;
                  
                  return (
                    <tr key={archivo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Indicador visual de origen */}
                          <div className="relative">
                            <Icon
                              name={archivo.tipo === 'PDF' ? 'FileText' : archivo.tipo === 'XML' ? 'Code' : 'File'}
                              size={18}
                              className="text-aduana-azul"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${origenColor} ring-2 ring-white`}></span>
                          </div>
                          <div className="group relative">
                            {/* Nombre descriptivo */}
                            <span className="font-medium text-gray-900 cursor-help">
                              {nombreDescriptivo !== nombreTecnico ? nombreDescriptivo : nombreTecnico}
                            </span>
                            {/* Tooltip con nombre técnico */}
                            {nombreDescriptivo !== nombreTecnico && (
                              <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <p className="font-semibold mb-1">Nombre técnico:</p>
                                <p className="text-gray-300 break-all">{nombreTecnico}</p>
                                <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                              </div>
                            )}
                            {archivo.descripcion && nombreDescriptivo === archivo.nombreOriginal && (
                              <p className="text-xs text-gray-500">{archivo.descripcion}</p>
                            )}
                            {/* Badge de origen automático */}
                            {(archivo.origen === 'Sistema' || archivo.origen === 'Notificación') && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                                <Icon name="Cpu" size={10} />
                                Generado automáticamente
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info" size="sm">
                          {archivo.categoria}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{archivo.fechaSubida}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          {archivo.origen === 'Sistema' || archivo.origen === 'Notificación' ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Icon name="Bot" size={14} />
                              {archivo.nombreUsuarioSubida || 'Sistema'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={14} className="text-gray-400" />
                              {archivo.nombreUsuarioSubida || archivo.usuarioSubida}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{archivo.tamanio}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {/* Botón Ver - siempre visible pero puede estar deshabilitado */}
                          <div className="relative group">
                            <button
                              className={`p-1.5 rounded transition-colors ${
                                permisosArchivo.puedeVisualizar 
                                  ? 'text-gray-500 hover:text-aduana-azul hover:bg-blue-50' 
                                  : 'text-gray-300 cursor-not-allowed'
                              }`}
                              onClick={() => permisosArchivo.puedeVisualizar && setModalVisualizarArchivo({ isOpen: true, archivoId: archivo.id })}
                              disabled={!permisosArchivo.puedeVisualizar}
                            >
                              <Icon name="Eye" size={16} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                              {permisosArchivo.puedeVisualizar ? 'Ver archivo' : 'Sin permiso para ver'}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                            </div>
                          </div>
                          
                          {/* Botón Descargar */}
                          <div className="relative group">
                            <button
                              className={`p-1.5 rounded transition-colors ${
                                permisosArchivo.puedeDescargar 
                                  ? 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50' 
                                  : 'text-gray-300 cursor-not-allowed'
                              }`}
                              onClick={() => permisosArchivo.puedeDescargar && handleDescargarArchivo(archivo.id)}
                              disabled={!permisosArchivo.puedeDescargar}
                            >
                              <Icon name="Download" size={16} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                              {permisosArchivo.puedeDescargar ? 'Descargar archivo' : 'Sin permiso para descargar'}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                            </div>
                          </div>
                          
                          {/* Botón Eliminar - siempre visible pero deshabilitado si no tiene permiso */}
                          <div className="relative group">
                            <button
                              className={`p-1.5 rounded transition-colors ${
                                permisosArchivo.puedeEliminar 
                                  ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                                  : 'text-gray-300 cursor-not-allowed'
                              }`}
                              onClick={() => permisosArchivo.puedeEliminar && handleEliminarArchivo(archivo.id)}
                              disabled={!permisosArchivo.puedeEliminar}
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-w-[200px] text-center">
                              {permisosArchivo.puedeEliminar 
                                ? 'Eliminar archivo' 
                                : permisosArchivo.motivoNoEliminar || 'Sin permiso para eliminar'}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                            </div>
                          </div>
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
      ),
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: <Icon name="Clock" size={16} />,
      content: (
        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 mb-6">Historial del Expediente</h4>
          <Timeline items={expediente.timeline} />
        </div>
      ),
    },
  ];

  // Obtener documento aduanero seleccionado para modal
  const documentoSeleccionado = documentosAduaneros.find(
    (doc) => doc.id === modalDocumentoAduanero.documentoId
  );

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
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{expediente.numeroExpediente}</h1>
                <Badge variant={getEstadoBadgeVariant(expediente.estado)} size="md" dot>
                  {expediente.estado}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">
                Expediente Digital • {expediente.tipo}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {expediente.fechaModificacion}
              </p>
            </div>
          </div>
          {/* Acciones - Priorizar según contexto */}
          <div className="flex flex-wrap gap-2 ml-10 md:ml-0">
            {faltanDocumentosAduaneros || faltanArchivos ? (
              <>
                <CustomButton 
                  variant="primary" 
                  className="flex items-center gap-2 text-sm"
                  onClick={() => setModalSubirArchivo(true)}
                >
                  <Icon name="Upload" size={16} />
                  Cargar documento
                </CustomButton>
                <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
                  <Icon name="Printer" size={16} />
                  Imprimir
                </CustomButton>
              </>
            ) : (
              <>
                <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
                  <Icon name="Printer" size={16} />
                  Imprimir
                </CustomButton>
                <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
                  <Icon name="Download" size={16} />
                  Exportar
                </CustomButton>
              </>
            )}
          </div>
        </div>

        {/* Panel de Estado con Contexto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Estado actual con contexto completo */}
          <div className={`card p-4 border-l-4 ${
            estadoContexto.color === 'blue' ? 'border-l-blue-500 bg-blue-50/50' :
            estadoContexto.color === 'emerald' ? 'border-l-emerald-500 bg-emerald-50/50' :
            estadoContexto.color === 'amber' ? 'border-l-amber-500 bg-amber-50/50' :
            'border-l-gray-400 bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                estadoContexto.color === 'blue' ? 'bg-blue-100' :
                estadoContexto.color === 'emerald' ? 'bg-emerald-100' :
                estadoContexto.color === 'amber' ? 'bg-amber-100' :
                'bg-gray-200'
              }`}>
                <Icon 
                  name={estadoContexto.icono as any} 
                  size={20} 
                  className={
                    estadoContexto.color === 'blue' ? 'text-blue-600' :
                    estadoContexto.color === 'emerald' ? 'text-emerald-600' :
                    estadoContexto.color === 'amber' ? 'text-amber-600' :
                    'text-gray-600'
                  } 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{expediente.estado}</span>
                  <span className="text-xs text-gray-500">·</span>
                  <span className="text-xs text-gray-600">{estadoContexto.descripcion}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Icon name="User" size={14} className="text-gray-400" />
                  <span>Responsable: <strong>{estadoContexto.responsable}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <Icon name="ArrowRight" size={14} />
                  <span>Siguiente: {estadoContexto.siguientePaso}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist de completitud */}
          <div className="card p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 group relative">
                <Icon name="CheckSquare" size={18} className="text-gray-400" />
                <h3 className="font-semibold text-gray-900">Completitud del expediente</h3>
                <button className="text-gray-400 hover:text-aduana-azul transition-colors">
                  <Icon name="HelpCircle" size={16} />
                </button>
                {/* Tooltip explicativo del criterio de completitud */}
                <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <p className="font-semibold mb-2">¿Cómo se calcula?</p>
                  <p className="mb-2">
                    El porcentaje representa el cumplimiento de los <strong>documentos obligatorios</strong> definidos 
                    para este tipo de expediente según normativa vigente.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Registro creado en sistema</li>
                    <li>Denuncia/Cargo ingresado</li>
                    <li>Documento aduanero asociado (DIN/DUS)</li>
                  </ul>
                  <p className="mt-2 text-gray-400 italic">
                    Los documentos opcionales no afectan el porcentaje.
                  </p>
                  <div className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              </div>
              <span className={`text-sm font-bold ${
                completitud === 100 ? 'text-emerald-600' : 
                completitud >= 50 ? 'text-blue-600' : 'text-amber-600'
              }`}>
                {completitud}%
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  completitud === 100 ? 'bg-emerald-500' : 
                  completitud >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${completitud}%` }}
              />
            </div>

            {/* Lista de requisitos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requisitosCompletados.map((req) => (
                <div 
                  key={req.id}
                  className={`flex items-center gap-2 text-sm p-2 rounded-lg group relative ${
                    req.completado 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : req.obligatorio 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-gray-50 text-gray-500'
                  }`}
                  title={req.descripcion}
                >
                  {req.completado ? (
                    <Icon name="CheckCircle" size={16} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Icon 
                      name={req.obligatorio ? "Clock" : "Circle"} 
                      size={16} 
                      className={req.obligatorio ? "text-amber-500 flex-shrink-0" : "text-gray-400 flex-shrink-0"} 
                    />
                  )}
                  <span className="truncate">
                    {req.completado ? '✓' : req.obligatorio ? '⏳' : '○'} {req.nombre}
                  </span>
                  {!req.completado && req.obligatorio && (
                    <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded ml-auto flex-shrink-0">
                      Requerido
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} variant="underline" />
      </div>

      {/* Modal Documento Aduanero */}
      <Modal
        isOpen={modalDocumentoAduanero.isOpen}
        onClose={() => setModalDocumentoAduanero({ isOpen: false })}
        size="full"
        showCloseButton={false}
      >
        {documentoSeleccionado && (
          <DocumentoAduaneroViewer
            documento={documentoSeleccionado}
            onClose={() => setModalDocumentoAduanero({ isOpen: false })}
          />
        )}
      </Modal>

      {/* Modal Subir Archivo */}
      <Modal
        isOpen={modalSubirArchivo}
        onClose={() => setModalSubirArchivo(false)}
        size="lg"
        showCloseButton={false}
      >
        <FileUploader
          expedienteId={expediente.id}
          onUploadComplete={handleUploadComplete}
          onClose={() => setModalSubirArchivo(false)}
        />
      </Modal>

      {/* Modal Visualizar Archivo */}
      <Modal
        isOpen={modalVisualizarArchivo.isOpen}
        onClose={() => setModalVisualizarArchivo({ isOpen: false })}
        size="full"
        showCloseButton={false}
      >
        {(() => {
          const archivoSeleccionado = expediente.archivos.find(
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

export default ExpedienteDigital;
