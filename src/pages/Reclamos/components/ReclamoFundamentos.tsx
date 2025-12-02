/**
 * ReclamoFundamentos - Muestra fundamentos y peticiones del reclamo
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { type Reclamo } from '../../../data';

interface ReclamoFundamentosProps {
  reclamo: Reclamo;
}

export const ReclamoFundamentos: React.FC<ReclamoFundamentosProps> = ({ reclamo }) => {
  return (
    <div className="space-y-6">
      {/* Fundamento del Reclamo */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-aduana-azul" />
          Fundamento del Reclamo
        </h3>
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          {reclamo.fundamentoReclamo ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {reclamo.fundamentoReclamo}
            </p>
          ) : (
            <p className="text-gray-400 italic">No se ha registrado el fundamento del reclamo.</p>
          )}
        </div>
      </section>
      
      {/* Peticiones */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="ListOrdered" size={20} className="text-aduana-azul" />
          Peticiones
        </h3>
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          {reclamo.peticiones ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {reclamo.peticiones}
            </p>
          ) : (
            <p className="text-gray-400 italic">No se han registrado peticiones.</p>
          )}
        </div>
      </section>
      
      {/* Descripción */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="AlignLeft" size={20} className="text-aduana-azul" />
          Descripción
        </h3>
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            {reclamo.descripcion || '-'}
          </p>
        </div>
      </section>
      
      {/* Observaciones */}
      {reclamo.observaciones && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-amber-500" />
            Observaciones
          </h3>
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
            <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">
              {reclamo.observaciones}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReclamoFundamentos;

