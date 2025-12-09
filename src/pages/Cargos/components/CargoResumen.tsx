/**
 * CargoResumen - Resumen del cargo en vista 360°
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { Badge, getEstadoBadgeVariant } from '../../../components/UI';
import { 
  type Cargo, 
  type Denuncia,
  aduanas,
  fundamentosCatalogo,
  normasCatalogo,
  formatMonto,
} from '../../../data';

interface CargoResumenProps {
  cargo: Cargo;
  denuncia: Denuncia | null;
  onVerDenuncia?: () => void;
  onVerMercancia?: () => void;
}

export const CargoResumen: React.FC<CargoResumenProps> = ({
  cargo,
  denuncia,
  onVerDenuncia,
  onVerMercancia,
}) => {
  const aduana = aduanas.find(a => a.codigo === cargo.codigoAduana || a.nombre === cargo.aduana);
  const norma = normasCatalogo.find(n => n.codigo === cargo.norma);
  const fundamento = fundamentosCatalogo.find(f => f.codigo === cargo.fundamento);
  
  return (
    <div className="space-y-6">
      {/* Datos Generales */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-aduana-azul" />
          Datos Generales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">N° Cargo</p>
            <p className="font-semibold text-aduana-azul">{cargo.numeroCargo}</p>
          </div>
          
          {cargo.numeroInterno && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">N° Interno</p>
              <p className="font-medium">{cargo.numeroInterno}</p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Origen</p>
            <Badge variant={cargo.origen === 'DENUNCIA' ? 'info' : 'warning'}>
              {cargo.origen === 'DENUNCIA' ? 'Denuncia' : cargo.origen === 'TRAMITE_ADUANERO' ? 'Trámite Aduanero' : 'Otro'}
            </Badge>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Emisión</p>
            <p className="font-medium">{cargo.fechaEmision || 'Sin emitir'}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Ocurrencia</p>
            <p className="font-medium">{cargo.fechaOcurrencia || '-'}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Ingreso</p>
            <p className="font-medium">{cargo.fechaIngreso}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Aduana</p>
            <p className="font-medium">{aduana?.nombre || cargo.aduana}</p>
          </div>
          
          {cargo.codigoSeccion && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Sección</p>
              <p className="font-medium">{cargo.codigoSeccion}</p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Estado</p>
            <Badge variant={getEstadoBadgeVariant(cargo.estado)} dot>
              {cargo.estado}
            </Badge>
          </div>
        </div>
      </section>
      
      {/* Deudor Principal */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={20} className="text-aduana-azul" />
          Deudor Principal
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">RUT</p>
              <p className="font-semibold">{cargo.rutDeudor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre / Razón Social</p>
              <p className="font-semibold">{cargo.nombreDeudor}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tipificación y Fundamentos */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Scale" size={20} className="text-aduana-azul" />
          Tipificación y Fundamentos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Norma</p>
            <p className="font-medium">
              {norma ? `${norma.codigo} - ${norma.nombre}` : cargo.norma || 'Sin especificar'}
            </p>
            {norma?.descripcion && (
              <p className="text-sm text-gray-500 mt-1">{norma.descripcion}</p>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fundamento</p>
            <p className="font-medium">
              {fundamento ? `${fundamento.codigo} - ${fundamento.nombre}` : cargo.fundamento || 'Sin especificar'}
            </p>
            {fundamento?.descripcion && (
              <p className="text-sm text-gray-500 mt-1">{fundamento.descripcion}</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Descripción de Hechos */}
      {cargo.descripcionHechos && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="AlignLeft" size={20} className="text-aduana-azul" />
            Descripción de Hechos
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{cargo.descripcionHechos}</p>
          </div>
        </section>
      )}
      
      {/* Montos Detallados */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-aduana-azul" />
          Desglose de Montos
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Derechos</p>
              <p className="text-lg font-bold text-emerald-600">{formatMonto(cargo.montoDerechos || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Multas</p>
              <p className="text-lg font-bold text-amber-600">{formatMonto(cargo.montoMulta || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Intereses</p>
              <p className="text-lg font-bold text-red-600">{formatMonto(cargo.montoIntereses || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Reajustes</p>
              <p className="text-lg font-bold text-purple-600">{formatMonto(cargo.montoReajuste || 0)}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-600">Total Cargo</p>
              <p className="text-2xl font-bold text-aduana-azul">{cargo.montoTotal}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Relaciones */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Link" size={20} className="text-aduana-azul" />
          Relaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {denuncia && (
            <div className="border border-gray-200 rounded-lg p-4 hover:border-aduana-azul transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Denuncia Asociada</p>
                  <p className="font-semibold text-aduana-azul">{denuncia.numeroDenuncia}</p>
                  <Badge variant={getEstadoBadgeVariant(denuncia.estado)} className="mt-1">
                    {denuncia.estado}
                  </Badge>
                </div>
                <CustomButton variant="secondary" onClick={onVerDenuncia}>
                  <Icon name="ExternalLink" size={16} />
                  Ver
                </CustomButton>
              </div>
            </div>
          )}
          
          {cargo.mercanciaId && (
            <div className="border border-gray-200 rounded-lg p-4 hover:border-aduana-azul transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mercancía Asociada</p>
                  <p className="font-semibold text-aduana-azul">{cargo.mercanciaId}</p>
                </div>
                <CustomButton variant="secondary" onClick={onVerMercancia}>
                  <Icon name="Package" size={16} />
                  Ver
                </CustomButton>
              </div>
            </div>
          )}
          
          {!denuncia && !cargo.mercanciaId && (
            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
              <Icon name="Link2Off" size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No hay entidades relacionadas</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Observaciones */}
      {cargo.observaciones && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-amber-500" />
            Observaciones
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">{cargo.observaciones}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default CargoResumen;

