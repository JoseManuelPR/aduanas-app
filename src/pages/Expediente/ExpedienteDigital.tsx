import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import { Badge, Tabs, Timeline, ProgressBar, getEstadoBadgeVariant, Modal } from '../../components/UI';
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
  calcularCompletitud,
} from '../../data';

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

  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();

  // Buscar la denuncia por id o usar la primera
  const denunciaData = denuncias.find((d) => d.id === id) || denuncias[0];

  // Obtener expediente digital
  const expediente = getExpedientePorEntidad(denunciaData?.id || 'den-001', 'DENUNCIA') || expedientesDigitales[0];

  // Obtener documentos aduaneros relacionados
  const documentosAduaneros = getDocumentosAduanerosPorDenuncia(denunciaData?.id || 'den-001');

  // Calcular completitud del expediente
  const { porcentaje: completitud, faltantes: documentosFaltantes } = calcularCompletitud(expediente);

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

  // Tabs del expediente
  const tabs = [
    {
      id: 'resumen',
      label: 'Resumen',
      icon: <Icon name="FileText" size={16} />,
      content: (
        <div className="space-y-6">
          {/* Alerta de documentos faltantes */}
          {documentosFaltantes.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Icon name="AlertTriangle" size={20} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    Documentos Obligatorios Faltantes
                  </h4>
                  <p className="text-sm text-amber-800 mb-2">
                    Los siguientes documentos son obligatorios y aún no han sido subidos:
                  </p>
                  <ul className="list-disc list-inside text-sm text-amber-800">
                    {documentosFaltantes.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-l-aduana-azul">
              <p className="text-sm text-gray-500">Estado Actual</p>
              <div className="mt-2">
                <Badge variant={getEstadoBadgeVariant(expediente.estado)} size="md" dot>
                  {expediente.estado}
                </Badge>
              </div>
            </div>
            <div className="card p-5 border-l-4 border-l-amber-500">
              <p className="text-sm text-gray-500">Completitud del Expediente</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completitud}%</p>
              <p className="text-xs text-gray-500">
                {expediente.archivos.length} archivos subidos
              </p>
            </div>
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <p className="text-sm text-gray-500">Última Actualización</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {expediente.fechaModificacion}
              </p>
              <p className="text-xs text-gray-500">{expediente.usuarioUltimaModificacion}</p>
            </div>
          </div>

          {/* Progreso del expediente */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-900 mb-4">Completitud del Expediente</h4>
            <ProgressBar
              value={completitud}
              max={100}
              label={`${completitud}% completado`}
              colorScheme="auto"
              size="lg"
            />
          </div>

          {/* Datos de la entidad asociada */}
          {denunciaData && (
            <div className="card p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="FileText" size={18} />
                Datos de la Denuncia
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Número de Denuncia</p>
                  <p className="font-medium">{denunciaData.numeroDenuncia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">RUT Deudor</p>
                  <p className="font-medium">{denunciaData.rutDeudor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre Deudor</p>
                  <p className="font-medium">{denunciaData.nombreDeudor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Infracción</p>
                  <p className="font-medium">{denunciaData.tipoInfraccion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto Estimado</p>
                  <p className="font-medium text-aduana-rojo">{denunciaData.montoEstimado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aduana</p>
                  <p className="font-medium">{denunciaData.aduana}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'documentos-aduaneros',
      label: 'Documentos Aduaneros',
      icon: <Icon name="FileText" size={16} />,
      badge: documentosAduaneros.length,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Documentos Aduaneros Asociados</h4>
          </div>
          {documentosAduaneros.length === 0 ? (
            <div className="card p-8 text-center">
              <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay documentos aduaneros asociados</p>
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
            {permisos.puedeSubir && (
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
                            name={archivo.tipo === 'PDF' ? 'FileText' : 'File'}
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
                Expediente Digital • {expediente.tipo} • Completitud: {completitud}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {expediente.fechaModificacion}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 ml-10 md:ml-0">
            <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
              <Icon name="Printer" size={16} />
              Imprimir
            </CustomButton>
            <CustomButton variant="secondary" className="flex items-center gap-2 text-sm">
              <Icon name="Download" size={16} />
              Exportar
            </CustomButton>
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
