/**
 * MercanciaResumen - Resumen de la mercancía en vista 360°
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Mercancia, type Aduana, type EstadoMercancia } from '../../../data';

interface MercanciaResumenProps {
  mercancia: Mercancia;
  aduana: Aduana | null | undefined;
}

export const MercanciaResumen: React.FC<MercanciaResumenProps> = ({ mercancia, aduana }) => {
  const getEstadoBadgeVariant = (estado: EstadoMercancia) => {
    const variantMap: Record<EstadoMercancia, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      'En Custodia': 'warning',
      'Comisada': 'danger',
      'Entregada': 'success',
      'Subastada': 'info',
      'Destruida': 'default',
      'Donada': 'success',
      'Entregada por RAP': 'success',
      'Incautada Judicialmente': 'danger',
      'Pendiente Disposición': 'warning',
      'En Tránsito': 'info',
      'En Puerto': 'warning',
      'En Depósito': 'warning',
      'Retenida': 'danger',
      'Liberada': 'success',
    };
    return variantMap[estado] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Datos Generales */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Package" size={20} className="text-aduana-azul" />
          Datos Generales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Código Mercancía</p>
            <p className="font-semibold font-mono text-aduana-azul">{mercancia.codigoMercancia || mercancia.id}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Estado</p>
            <Badge variant={getEstadoBadgeVariant(mercancia.estado)} dot>
              {mercancia.estado}
            </Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Ingreso</p>
            <p className="font-medium">{mercancia.fechaIngreso}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
            <p className="text-sm text-gray-500 mb-1">Descripción</p>
            <p className="font-medium">{mercancia.descripcion}</p>
            {mercancia.descripcionDetallada && (
              <p className="text-sm text-gray-600 mt-1">{mercancia.descripcionDetallada}</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Clasificación Arancelaria */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Tag" size={20} className="text-aduana-azul" />
          Clasificación Arancelaria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Partida</p>
            <p className="font-semibold">{mercancia.partida || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Subpartida</p>
            <p className="font-medium">{mercancia.subpartida || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Posición Arancelaria</p>
            <p className="font-medium">{mercancia.posicionArancelaria || '-'}</p>
          </div>
        </div>
      </section>
      
      {/* Cantidades y Medidas */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Scale" size={20} className="text-aduana-azul" />
          Cantidades y Medidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Cantidad</p>
            <p className="text-xl font-bold text-aduana-azul">{mercancia.cantidad.toLocaleString('es-CL')}</p>
            <p className="text-xs text-gray-500">{mercancia.unidadMedida}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">N° Bultos</p>
            <p className="text-xl font-bold">{mercancia.numeroBultos?.toLocaleString('es-CL') || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Peso Bruto</p>
            <p className="text-xl font-bold">{mercancia.pesoBruto?.toLocaleString('es-CL') || '-'}</p>
            <p className="text-xs text-gray-500">kg</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Peso Neto</p>
            <p className="text-xl font-bold">{mercancia.pesoNeto?.toLocaleString('es-CL') || '-'}</p>
            <p className="text-xs text-gray-500">kg</p>
          </div>
        </div>
      </section>
      
      {/* Valores */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-aduana-azul" />
          Valores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Valor FOB</p>
            <p className="text-xl font-bold text-aduana-azul">
              {mercancia.valorFOB ? `$${mercancia.valorFOB.toLocaleString('es-CL')}` : '-'}
            </p>
            {mercancia.moneda && <p className="text-xs text-gray-500">{mercancia.moneda}</p>}
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
            <p className="text-sm text-emerald-700 mb-1">Valor CIF</p>
            <p className="text-xl font-bold text-emerald-600">
              {mercancia.valorCIF ? `$${mercancia.valorCIF.toLocaleString('es-CL')}` : '-'}
            </p>
            {mercancia.moneda && <p className="text-xs text-emerald-600">{mercancia.moneda}</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Valor Aduanero</p>
            <p className="text-xl font-bold">
              {mercancia.valorAduanero ? `$${mercancia.valorAduanero.toLocaleString('es-CL')}` : '-'}
            </p>
            {mercancia.moneda && <p className="text-xs text-gray-500">{mercancia.moneda}</p>}
          </div>
        </div>
      </section>
      
      {/* Origen y Ubicación */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-aduana-azul" />
          Origen y Ubicación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">País Origen</p>
            <p className="font-medium">{mercancia.paisOrigen || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Aduana Ingreso</p>
            <p className="font-medium">{aduana?.nombre || mercancia.nombreAduanaIngreso || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Ubicación Actual</p>
            <p className="font-medium">{mercancia.ubicacion || '-'}</p>
          </div>
          {mercancia.bodega && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Bodega</p>
              <p className="font-medium">{mercancia.bodega}</p>
              {mercancia.seccionBodega && (
                <p className="text-xs text-gray-500">Sección: {mercancia.seccionBodega}</p>
              )}
            </div>
          )}
          {mercancia.contenedor && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Contenedor</p>
              <p className="font-mono font-medium">{mercancia.contenedor}</p>
            </div>
          )}
          {mercancia.manifiesto && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Manifiesto</p>
              <p className="font-medium">{mercancia.manifiesto}</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Disposición Final */}
      {mercancia.disposicionFinal && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FileCheck" size={20} className="text-emerald-500" />
            Disposición Final
          </h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-emerald-700 mb-1">Tipo Disposición</p>
                <Badge variant="success">{mercancia.disposicionFinal}</Badge>
              </div>
              <div>
                <p className="text-sm text-emerald-700 mb-1">Fecha</p>
                <p className="font-medium text-emerald-800">{mercancia.fechaDisposicionFinal || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-emerald-700 mb-1">N° Resolución</p>
                <p className="font-medium text-emerald-800">{mercancia.resolucionDisposicion || '-'}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MercanciaResumen;

