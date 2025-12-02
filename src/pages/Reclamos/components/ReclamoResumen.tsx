/**
 * ReclamoResumen - Resumen del reclamo en vista 360°
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Reclamo, type Aduana, formatMonto } from '../../../data';

interface ReclamoResumenProps {
  reclamo: Reclamo;
  aduana: Aduana | null | undefined;
}

export const ReclamoResumen: React.FC<ReclamoResumenProps> = ({ reclamo, aduana }) => {
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
            <p className="text-sm text-gray-500 mb-1">N° Reclamo</p>
            <p className="font-semibold text-aduana-azul">{reclamo.numeroReclamo}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Tipo de Reclamo</p>
            <Badge variant={reclamo.tipoReclamo === 'TTA' ? 'danger' : 'warning'}>
              {reclamo.tipoReclamo}
            </Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Ingreso</p>
            <p className="font-medium">{reclamo.fechaIngreso}</p>
          </div>
          {reclamo.fechaResolucion && (
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-sm text-emerald-700 mb-1">Fecha Resolución</p>
              <p className="font-medium text-emerald-800">{reclamo.fechaResolucion}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Aduana</p>
            <p className="font-medium">{aduana?.nombre || reclamo.aduana || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Plazo</p>
            <p className="font-medium">{reclamo.plazo || '-'} días</p>
          </div>
        </div>
      </section>
      
      {/* Reclamante */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={20} className="text-aduana-azul" />
          Reclamante
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre</p>
              <p className="font-semibold">{reclamo.reclamante}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">RUT</p>
              <p className="font-semibold">{reclamo.rutReclamante}</p>
            </div>
            {reclamo.representanteLegal && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Representante Legal</p>
                <p className="font-medium">{reclamo.representanteLegal}</p>
              </div>
            )}
            {reclamo.direccionReclamante && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Dirección</p>
                <p className="font-medium">{reclamo.direccionReclamante}</p>
              </div>
            )}
            {reclamo.emailReclamante && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{reclamo.emailReclamante}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Montos */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-aduana-azul" />
          Montos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Monto Reclamado</p>
            <p className="text-2xl font-bold text-aduana-azul">
              {reclamo.montoReclamado ? formatMonto(reclamo.montoReclamado) : '-'}
            </p>
          </div>
          <div className={`rounded-lg p-4 text-center ${reclamo.montoResuelto ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
            <p className={`text-sm mb-1 ${reclamo.montoResuelto ? 'text-emerald-700' : 'text-gray-500'}`}>
              Monto Resuelto
            </p>
            <p className={`text-2xl font-bold ${reclamo.montoResuelto ? 'text-emerald-600' : 'text-gray-400'}`}>
              {reclamo.montoResuelto ? formatMonto(reclamo.montoResuelto) : 'Pendiente'}
            </p>
          </div>
        </div>
      </section>
      
      {/* Resolución */}
      {reclamo.resolucion && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FileCheck" size={20} className="text-emerald-500" />
            Resolución
          </h3>
          <div className={`border rounded-lg p-4 ${
            reclamo.tipoResolucion === 'Acogida' ? 'bg-emerald-50 border-emerald-200' : 
            reclamo.tipoResolucion === 'Rechazada' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <p className="font-medium mb-2">{reclamo.tipoResolucion}</p>
            <p>{reclamo.resolucion}</p>
            {reclamo.fundamentoResolucion && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <p className="text-sm font-medium mb-1">Fundamento:</p>
                <p className="text-sm opacity-80">{reclamo.fundamentoResolucion}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ReclamoResumen;

