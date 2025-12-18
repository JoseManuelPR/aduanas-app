/**
 * ReclamoOrigen - Información sobre el origen del reclamo (denuncia, cargo, giro)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { 
  type Reclamo, 
  type Denuncia, 
  type Cargo, 
  type Giro,
} from '../../../data';
import { ERoutePaths } from '../../../routes/routes';

interface ReclamoOrigenProps {
  reclamo: Reclamo;
  denuncia: Denuncia | null | undefined;
  cargo: Cargo | null | undefined;
  giro: Giro | null | undefined;
}

export const ReclamoOrigen: React.FC<ReclamoOrigenProps> = ({ 
  reclamo, 
  denuncia, 
  cargo, 
  giro 
}) => {
  const navigate = useNavigate();
  
  const getEstadoBadgeVariant = (estado: string) => {
    const variantMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      'Cerrada': 'default',
      'Emitido': 'success',
      'Pagado': 'success',
      'En Proceso': 'warning',
      'Pendiente': 'warning',
      'Anulado': 'danger',
      'Vencido': 'danger',
    };
    return variantMap[estado] || 'info';
  };

  return (
    <div className="space-y-6">
      {/* Tipo de Origen */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Link" size={20} className="text-aduana-azul" />
          Origen del Reclamo
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${
              reclamo.origenReclamo === 'DENUNCIA' ? 'bg-red-100' : 
              reclamo.origenReclamo === 'CARGO' ? 'bg-amber-100' : 
              reclamo.origenReclamo === 'GIRO' ? 'bg-emerald-100' : 'bg-gray-200'
            }`}>
              <Icon 
                name={
                  reclamo.origenReclamo === 'DENUNCIA' ? 'AlertTriangle' : 
                  reclamo.origenReclamo === 'CARGO' ? 'FileText' : 
                  reclamo.origenReclamo === 'GIRO' ? 'Receipt' : 'File'
                } 
                size={24} 
                className={
                  reclamo.origenReclamo === 'DENUNCIA' ? 'text-red-600' : 
                  reclamo.origenReclamo === 'CARGO' ? 'text-amber-600' : 
                  reclamo.origenReclamo === 'GIRO' ? 'text-emerald-600' : 'text-gray-600'
                }
              />
            </div>
            <div>
              <p className="font-semibold text-lg">{reclamo.origenReclamo}</p>
              {reclamo.numeroEntidadOrigen && (
                <p className="text-gray-500">N° {reclamo.numeroEntidadOrigen}</p>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Denuncia Asociada */}
      {denuncia && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-red-500" />
            Denuncia Asociada
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg text-aduana-azul">{denuncia.numeroDenuncia}</p>
                <Badge variant={getEstadoBadgeVariant(denuncia.estado)}>
                  {denuncia.estado}
                </Badge>
              </div>
              <button
                onClick={() => navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', denuncia.id))}
                className="text-aduana-azul hover:text-aduana-azul-dark flex items-center gap-1 text-sm"
              >
                <Icon name="ExternalLink" size={16} />
                Ver detalle
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tipo</p>
                <p className="font-medium">{denuncia.tipoDenuncia}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha</p>
                <p className="font-medium">{denuncia.fechaCreacion}</p>
              </div>
              {denuncia.montoEstimado && (
                <div>
                  <p className="text-gray-500">Monto</p>
                  <p className="font-medium">${denuncia.montoEstimado}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Cargo Asociado */}
      {cargo && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FileText" size={20} className="text-amber-500" />
            Cargo Asociado
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg text-aduana-azul">{cargo.numeroCargo}</p>
                <Badge variant={getEstadoBadgeVariant(cargo.estado)}>
                  {cargo.estado}
                </Badge>
              </div>
              <button
                onClick={() => navigate(ERoutePaths.CARGOS_DETALLE.replace(':id', cargo.id))}
                className="text-aduana-azul hover:text-aduana-azul-dark flex items-center gap-1 text-sm"
              >
                <Icon name="ExternalLink" size={16} />
                Ver detalle
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Origen</p>
                <p className="font-medium">{cargo.origen}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha Generación</p>
                <p className="font-medium">{cargo.fechaGeneracion}</p>
              </div>
              <div>
                <p className="text-gray-500">Monto Total</p>
                <p className="font-medium text-amber-600">${cargo.montoTotal}</p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Giro Asociado */}
      {giro && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Receipt" size={20} className="text-emerald-500" />
            Giro Asociado
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg text-aduana-azul">{giro.numeroGiro}</p>
                <Badge variant={getEstadoBadgeVariant(giro.estado)}>
                  {giro.estado}
                </Badge>
              </div>
              <button
                onClick={() => navigate(ERoutePaths.GIROS_DETALLE.replace(':id', giro.id))}
                className="text-aduana-azul hover:text-aduana-azul-dark flex items-center gap-1 text-sm"
              >
                <Icon name="ExternalLink" size={16} />
                Ver detalle
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tipo</p>
                <p className="font-medium">{giro.tipoGiro}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha Emisión</p>
                <p className="font-medium">{giro.fechaEmision}</p>
              </div>
              <div>
                <p className="text-gray-500">Monto</p>
                <p className="font-medium text-emerald-600">${giro.montoTotal}</p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Sin entidad origen */}
      {!denuncia && !cargo && !giro && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Icon name="Info" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontró la entidad de origen asociada.</p>
        </div>
      )}
    </div>
  );
};

export default ReclamoOrigen;

