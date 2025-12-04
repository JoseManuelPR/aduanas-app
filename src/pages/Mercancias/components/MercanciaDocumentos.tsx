/**
 * MercanciaDocumentos - Documentos asociados a la mercancía
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Mercancia, type Denuncia, type Cargo } from '../../../data';
import { ERoutePaths } from '../../../routes/routes';

interface MercanciaDocumentosProps {
  mercancia: Mercancia;
  denuncia: Denuncia | null | undefined;
  cargo: Cargo | null | undefined;
}

export const MercanciaDocumentos: React.FC<MercanciaDocumentosProps> = ({ 
  mercancia,
  denuncia,
  cargo
}) => {
  const navigate = useNavigate();

  // Recopilar todos los documentos de los seguimientos
  const documentosSeguimiento = mercancia.seguimientos?.flatMap(s => 
    (s.documentosAdjuntos || []).map(doc => ({
      nombre: doc,
      tipo: s.tipoEvento,
      fecha: s.fechaEvento,
      evento: s.tipoEvento,
    }))
  ) || [];

  return (
    <div className="space-y-6">
      {/* Entidades relacionadas */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Link" size={20} className="text-aduana-azul" />
          Entidades Relacionadas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Denuncia */}
          {denuncia ? (
            <div 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', denuncia.id))}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Icon name="FileWarning" size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Denuncia Asociada</p>
                    <p className="font-semibold text-aduana-azul">{denuncia.numeroDenuncia}</p>
                    <Badge variant="info" className="mt-1">{denuncia.estado}</Badge>
                  </div>
                </div>
                <Icon name="ExternalLink" size={16} className="text-gray-400" />
              </div>
            </div>
          ) : mercancia.denunciaNumero ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Icon name="FileWarning" size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Denuncia Referenciada</p>
                  <p className="font-medium text-gray-700">{mercancia.denunciaNumero}</p>
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Cargo */}
          {cargo ? (
            <div 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(ERoutePaths.CARGOS_DETALLE.replace(':id', cargo.id))}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Icon name="FileText" size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cargo Asociado</p>
                    <p className="font-semibold text-aduana-azul">{cargo.numeroCargo}</p>
                    <Badge variant="warning" className="mt-1">{cargo.estado}</Badge>
                  </div>
                </div>
                <Icon name="ExternalLink" size={16} className="text-gray-400" />
              </div>
            </div>
          ) : mercancia.cargoNumero ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Icon name="FileText" size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cargo Referenciado</p>
                  <p className="font-medium text-gray-700">{mercancia.cargoNumero}</p>
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Expediente Digital */}
          {mercancia.expedienteDigitalId && (
            <div 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(ERoutePaths.EXPEDIENTE.replace(':id', mercancia.expedienteDigitalId!))}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Icon name="FolderOpen" size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expediente Digital</p>
                    <p className="font-semibold text-aduana-azul">{mercancia.expedienteDigitalId}</p>
                    <p className="text-xs text-gray-400 mt-1">Fotos, actas, documentos</p>
                  </div>
                </div>
                <Icon name="ExternalLink" size={16} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>
        
        {!denuncia && !cargo && !mercancia.denunciaNumero && !mercancia.cargoNumero && !mercancia.expedienteDigitalId && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Icon name="Link" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay entidades relacionadas registradas.</p>
          </div>
        )}
      </section>
      
      {/* Documentos de eventos */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-aduana-azul" />
          Documentos Generados
        </h3>
        
        {documentosSeguimiento.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Icon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay documentos generados en los eventos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentosSeguimiento.map((doc, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon name="FileText" size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.nombre}</p>
                    <p className="text-sm text-gray-500">{doc.evento}</p>
                    <p className="text-xs text-gray-400 mt-1">{doc.fecha}</p>
                  </div>
                  <Icon name="Download" size={16} className="text-aduana-azul" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Tipos de documentos esperados */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-aduana-azul" />
          Tipos de Documentos
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-4">
            Los siguientes tipos de documentos pueden ser almacenados en el expediente digital de la mercancía:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { nombre: 'Acta de Inventario', icono: 'ClipboardList' },
              { nombre: 'Acta de Comiso', icono: 'Ban' },
              { nombre: 'Acta de Destrucción', icono: 'Trash2' },
              { nombre: 'Acta de Entrega', icono: 'Truck' },
              { nombre: 'Fotografías', icono: 'Camera' },
              { nombre: 'Resolución', icono: 'FileCheck' },
              { nombre: 'Informe Técnico', icono: 'FileText' },
              { nombre: 'Certificados', icono: 'Award' },
            ].map((tipo) => (
              <div key={tipo.nombre} className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name={tipo.icono as "ClipboardList" | "Ban" | "Trash2" | "Truck" | "Camera" | "FileCheck" | "FileText" | "Award"} size={16} className="text-gray-400" />
                {tipo.nombre}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MercanciaDocumentos;

