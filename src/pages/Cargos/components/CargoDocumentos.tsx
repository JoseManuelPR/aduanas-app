/**
 * CargoDocumentos - Gestión de documentos aduaneros del cargo
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { Badge } from '../../../components/UI';
import { type CargoDocumentoAduanero, tiposDocumentoAduanero, formatMonto } from '../../../data';

interface CargoDocumentosProps {
  documentos: CargoDocumentoAduanero[];
  puedeEditar: boolean;
  onAgregar?: () => void;
  onVer?: (documento: CargoDocumentoAduanero) => void;
  onEliminar?: (id: string) => void;
}

export const CargoDocumentos: React.FC<CargoDocumentosProps> = ({
  documentos,
  puedeEditar,
  onAgregar,
  onVer,
  onEliminar,
}) => {
  // Obtener nombre del tipo de documento
  const getNombreTipoDoc = (codigo: string) => {
    const tipo = tiposDocumentoAduanero.find(t => t.codigo === codigo || t.sigla === codigo);
    return tipo?.nombre || codigo;
  };
  
  // Obtener icono según tipo
  const getIconoTipo = (tipo: string) => {
    switch (tipo.toUpperCase()) {
      case 'DIN': return 'FileInput';
      case 'DUS': return 'FileOutput';
      case 'BL': return 'Ship';
      case 'AWB': return 'Plane';
      case 'MIC': return 'Truck';
      case 'FAC': return 'Receipt';
      default: return 'FileText';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documentos Aduaneros</h3>
          <p className="text-sm text-gray-500">
            {documentos.length} documento{documentos.length !== 1 ? 's' : ''} asociado{documentos.length !== 1 ? 's' : ''}
          </p>
        </div>
        {puedeEditar && (
          <CustomButton variant="primary" onClick={onAgregar}>
            <Icon name="Plus" size={16} />
            Agregar Documento
          </CustomButton>
        )}
      </div>
      
      {/* Lista de documentos */}
      {documentos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon name="Folder" size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">No hay documentos aduaneros asociados</p>
          {puedeEditar && (
            <CustomButton variant="secondary" onClick={onAgregar}>
              <Icon name="Plus" size={16} />
              Agregar documento
            </CustomButton>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentos.map((documento) => (
            <div 
              key={documento.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-aduana-azul hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-aduana-azul/10 rounded-lg">
                  <Icon 
                    name={getIconoTipo(documento.tipoDocumento)} 
                    size={24} 
                    className="text-aduana-azul" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info">{documento.tipoDocumento}</Badge>
                    <span className="text-sm text-gray-500">{getNombreTipoDoc(documento.tipoDocumento)}</span>
                  </div>
                  
                  <p className="font-semibold text-gray-900 truncate">
                    {documento.numeroDocumento}
                  </p>
                  
                  {documento.numeroAceptacion && (
                    <p className="text-sm text-gray-500">
                      Aceptación: {documento.numeroAceptacion}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {documento.fecha}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {documento.aduana}
                    </span>
                  </div>
                  
                  {documento.descripcion && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {documento.descripcion}
                    </p>
                  )}
                  
                  {documento.montoRelacionado && (
                    <p className="text-sm font-medium text-aduana-azul mt-2">
                      Monto: {formatMonto(documento.montoRelacionado)}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Acciones */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                <CustomButton 
                  variant="secondary" 
                  className="text-xs"
                  onClick={() => onVer?.(documento)}
                >
                  <Icon name="Eye" size={14} />
                  Ver detalle
                </CustomButton>
                {puedeEditar && (
                  <CustomButton 
                    variant="secondary" 
                    className="text-xs text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('¿Está seguro de eliminar este documento?')) {
                        onEliminar?.(documento.id);
                      }
                    }}
                  >
                    <Icon name="Trash2" size={14} />
                    Eliminar
                  </CustomButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Documentos vinculados</p>
            <p className="text-sm text-blue-700">
              Los documentos aduaneros asociados permiten vincular el cargo con las operaciones 
              comerciales que originaron la infracción o diferencia de derechos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoDocumentos;

