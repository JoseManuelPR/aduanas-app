import { useState } from 'react';
import { Icon } from "he-button-custom-library";
import { CustomButton } from "../../../components/Button/Button";
import { Badge } from "../../../components/UI";
import type { BadgeVariant } from "../../../components/UI";
import type { DocumentoAdjunto, DenunciaDocumentoAduanero, PermisosEstado } from '../../../data/types';

interface DenunciaDocumentosProps {
  documentosAdjuntos: DocumentoAdjunto[];
  documentosAduaneros: DenunciaDocumentoAduanero[];
  permisos: PermisosEstado;
  onAgregarAdjunto?: () => void;
  onAgregarAduanero?: () => void;
}

export const DenunciaDocumentos: React.FC<DenunciaDocumentosProps> = ({ 
  documentosAdjuntos,
  documentosAduaneros,
  permisos,
  onAgregarAdjunto,
  onAgregarAduanero,
}) => {
  const [activeTab, setActiveTab] = useState<'adjuntos' | 'aduaneros'>('adjuntos');

  const getIconForDocType = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return <Icon name="FileText" size={24} className="text-red-500" />;
      case 'xls':
      case 'xlsx':
        return <Icon name="FileSpreadsheet" size={24} className="text-emerald-600" />;
      case 'doc':
      case 'docx':
        return <Icon name="FileText" size={24} className="text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Icon name="Image" size={24} className="text-purple-500" />;
      default:
        return <Icon name="File" size={24} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'adjuntos'
              ? 'border-aduana-azul text-aduana-azul'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('adjuntos')}
        >
          <span className="flex items-center gap-2">
            <Icon name="Paperclip" size={16} />
            Documentos Adjuntos ({documentosAdjuntos.length})
          </span>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'aduaneros'
              ? 'border-aduana-azul text-aduana-azul'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('aduaneros')}
        >
          <span className="flex items-center gap-2">
            <Icon name="FileCheck" size={16} />
            Documentos Aduaneros ({documentosAduaneros.length})
          </span>
        </button>
      </div>

      {/* Contenido */}
      {activeTab === 'adjuntos' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">
              Archivos del Expediente
            </h4>
            {permisos.camposEditables.includes('documentosAdjuntos') && onAgregarAdjunto && (
              <CustomButton 
                variant="primary" 
                className="flex items-center gap-2 text-sm"
                onClick={onAgregarAdjunto}
              >
                <Icon name="Upload" size={16} />
                Agregar Documento
              </CustomButton>
            )}
          </div>

          {documentosAdjuntos.length === 0 ? (
            <div className="card p-8 text-center">
              <Icon name="FileX" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Sin documentos</h3>
              <p className="text-gray-600 mt-2">No hay documentos adjuntos en esta denuncia.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documentosAdjuntos.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getIconForDocType(doc.tipo)}
                          <span className="font-medium text-gray-900">{doc.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={"default" as BadgeVariant} size="sm">{doc.tipo.toUpperCase()}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{doc.tamanio}</td>
                      <td className="px-4 py-3 text-gray-600">{doc.fechaSubida}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button className="p-1 text-gray-500 hover:text-aduana-azul" title="Ver">
                            <Icon name="Eye" size={16} />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-emerald-600" title="Descargar">
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

          {/* Área de carga */}
          {permisos.camposEditables.includes('documentosAdjuntos') && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-aduana-azul transition-colors cursor-pointer">
              <Icon name="Upload" size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-2">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                PDF, DOC, XLS, JPG hasta 10MB cada uno
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'aduaneros' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">
              Documentos Aduaneros Asociados
            </h4>
            {permisos.puedeEditar && onAgregarAduanero && (
              <CustomButton 
                variant="primary" 
                className="flex items-center gap-2 text-sm"
                onClick={onAgregarAduanero}
              >
                <Icon name="Plus" size={16} />
                Agregar Documento Aduanero
              </CustomButton>
            )}
          </div>

          {documentosAduaneros.length === 0 ? (
            <div className="card p-8 text-center">
              <Icon name="FileX" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Sin documentos aduaneros</h3>
              <p className="text-gray-600 mt-2">No hay documentos aduaneros asociados a esta denuncia.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentosAduaneros.map((doc) => (
                <div key={doc.id} className="card p-4 border-l-4 border-l-aduana-azul">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-aduana-azul-50 rounded-lg">
                        <Icon name="FileCheck" size={24} className="text-aduana-azul" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="info">{doc.tipoDocumento}</Badge>
                          <span className="font-semibold text-gray-900">{doc.numeroDocumento}</span>
                        </div>
                        {doc.descripcion && (
                          <p className="text-sm text-gray-600 mb-2">{doc.descripcion}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {doc.fecha}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            {doc.aduana}
                          </span>
                          {doc.numeroAceptacion && (
                            <span className="flex items-center gap-1">
                              <Icon name="Hash" size={14} />
                              Aceptación: {doc.numeroAceptacion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-aduana-azul hover:bg-gray-100 rounded" title="Ver">
                        <Icon name="Eye" size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-aduana-azul hover:bg-gray-100 rounded" title="Consultar">
                        <Icon name="ExternalLink" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DenunciaDocumentos;

