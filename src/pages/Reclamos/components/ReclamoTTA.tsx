/**
 * ReclamoTTA - Información específica del Tribunal Tributario y Aduanero
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Reclamo, formatMonto } from '../../../data';

interface ReclamoTTAProps {
  reclamo: Reclamo;
}

export const ReclamoTTA: React.FC<ReclamoTTAProps> = ({ reclamo }) => {
  const tta = reclamo.datosTTA;
  
  if (!tta) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Icon name="Info" size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Este reclamo no tiene datos de TTA asociados.</p>
      </div>
    );
  }

  const getFalloBadgeVariant = (fallo?: string) => {
    if (!fallo) return 'default';
    const map: Record<string, 'success' | 'danger' | 'warning' | 'default' | 'info'> = {
      'Acogido': 'success',
      'Rechazado': 'danger',
      'Acogido Parcialmente': 'warning',
      'Inadmisible': 'default',
      'Desistido': 'info',
    };
    return map[fallo] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Identificación TTA */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Scale" size={20} className="text-aduana-azul" />
          Identificación TTA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">ROL TTA</p>
            <p className="font-semibold text-lg text-aduana-azul">
              {tta.rolTTA || 'Pendiente de asignación'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Tribunal Competente</p>
            <p className="font-medium">{tta.tribunalCompetente || '-'}</p>
          </div>
        </div>
      </section>
      
      {/* Admisibilidad */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={20} className="text-aduana-azul" />
          Admisibilidad
        </h3>
        <div className={`rounded-lg p-5 border ${
          tta.admisible === true ? 'bg-emerald-50 border-emerald-200' : 
          tta.admisible === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon 
              name={tta.admisible ? 'CheckCircle' : tta.admisible === false ? 'XCircle' : 'Clock'} 
              size={24} 
              className={tta.admisible ? 'text-emerald-500' : tta.admisible === false ? 'text-red-500' : 'text-gray-400'}
            />
            <Badge variant={tta.admisible ? 'success' : tta.admisible === false ? 'danger' : 'warning'}>
              {tta.admisible === true ? 'Admitido' : tta.admisible === false ? 'Inadmisible' : 'Pendiente'}
            </Badge>
          </div>
          {tta.fechaAdmisibilidad && (
            <p className="text-sm">
              <span className="text-gray-600">Fecha: </span>
              <span className="font-medium">{tta.fechaAdmisibilidad}</span>
            </p>
          )}
          {tta.motivoInadmisibilidad && (
            <p className="mt-2 text-sm text-red-700">
              <span className="font-medium">Motivo: </span>
              {tta.motivoInadmisibilidad}
            </p>
          )}
        </div>
      </section>
      
      {/* Plazos */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} className="text-aduana-azul" />
          Plazos y Fechas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Presentación TTA</p>
            <p className="font-medium">{tta.fechaPresentacionTTA || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Plazo Probatorio</p>
            <p className="font-medium">{tta.plazoProbatorio ? `${tta.plazoProbatorio} días` : '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Vencimiento Probatorio</p>
            <p className="font-medium">{tta.fechaVencimientoProbatorio || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Contestación</p>
            <p className="font-medium">{tta.fechaContestacion || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Audiencia</p>
            <p className="font-medium">{tta.fechaAudiencia || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Sentencia</p>
            <p className="font-medium">{tta.fechaSentencia || '-'}</p>
          </div>
        </div>
      </section>
      
      {/* Fallo Primera Instancia */}
      {tta.fallo1raInstancia && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FileCheck" size={20} className="text-aduana-azul" />
            Fallo Primera Instancia
          </h3>
          <div className={`rounded-lg p-5 border ${
            tta.fallo1raInstancia === 'Acogido' ? 'bg-emerald-50 border-emerald-200' :
            tta.fallo1raInstancia === 'Rechazado' ? 'bg-red-50 border-red-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <Badge variant={getFalloBadgeVariant(tta.fallo1raInstancia)}>
                {tta.fallo1raInstancia}
              </Badge>
              {tta.montoFallo1ra && (
                <p className="text-lg font-bold">{formatMonto(tta.montoFallo1ra)}</p>
              )}
            </div>
            {tta.fundamentoFallo1ra && (
              <p className="text-sm">{tta.fundamentoFallo1ra}</p>
            )}
          </div>
        </section>
      )}
      
      {/* Apelación */}
      {tta.tieneApelacion && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="CornerUpRight" size={20} className="text-amber-500" />
            Apelación
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-amber-700 mb-1">¿Quién Apela?</p>
                <p className="font-medium text-amber-800">{tta.quienApela || '-'}</p>
              </div>
              {tta.fechaApelacion && (
                <div>
                  <p className="text-sm text-amber-700 mb-1">Fecha Apelación</p>
                  <p className="font-medium text-amber-800">{tta.fechaApelacion}</p>
                </div>
              )}
            </div>
            {tta.falloApelacion && (
              <div className="mt-4 pt-4 border-t border-amber-300">
                <p className="text-sm text-amber-700 mb-2">Fallo Apelación:</p>
                <Badge variant={getFalloBadgeVariant(tta.falloApelacion)}>
                  {tta.falloApelacion}
                </Badge>
                {tta.fundamentoFalloApelacion && (
                  <p className="mt-2 text-sm text-amber-800">{tta.fundamentoFalloApelacion}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Fallo Final */}
      {tta.falloFinal && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Gavel" size={20} className="text-emerald-600" />
            Fallo Final
          </h3>
          <div className={`rounded-lg p-5 border ${
            tta.falloFinal === 'Acogido' ? 'bg-emerald-50 border-emerald-200' :
            tta.falloFinal === 'Rechazado' ? 'bg-red-50 border-red-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <Badge variant={getFalloBadgeVariant(tta.falloFinal)}>
                {tta.falloFinal}
              </Badge>
              {tta.montoFalloFinal && (
                <p className="text-2xl font-bold">{formatMonto(tta.montoFalloFinal)}</p>
              )}
            </div>
            {tta.fechaFalloFinal && (
              <p className="text-sm mb-2">
                <span className="opacity-70">Fecha: </span>
                <span className="font-medium">{tta.fechaFalloFinal}</span>
              </p>
            )}
            {tta.fundamentoFalloFinal && (
              <p className="text-sm mt-2">{tta.fundamentoFalloFinal}</p>
            )}
          </div>
        </section>
      )}
      
      {/* Documentos TTA */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Folder" size={20} className="text-aduana-azul" />
          Documentos TTA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tta.informeAduanas && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-aduana-azul" />
                <div>
                  <p className="text-sm text-gray-500">Informe Aduanas</p>
                  <p className="font-medium text-aduana-azul">{tta.informeAduanas}</p>
                </div>
              </div>
            </div>
          )}
          {tta.escritoPresentacion && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-aduana-azul" />
                <div>
                  <p className="text-sm text-gray-500">Escrito Presentación</p>
                  <p className="font-medium text-aduana-azul">{tta.escritoPresentacion}</p>
                </div>
              </div>
            </div>
          )}
          {tta.contestacionDemanda && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-aduana-azul" />
                <div>
                  <p className="text-sm text-gray-500">Contestación Demanda</p>
                  <p className="font-medium text-aduana-azul">{tta.contestacionDemanda}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {!tta.informeAduanas && !tta.escritoPresentacion && !tta.contestacionDemanda && (
          <p className="text-gray-400 italic text-center py-4">
            No hay documentos TTA registrados.
          </p>
        )}
      </section>
      
      {/* Observaciones TTA */}
      {tta.observaciones && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-amber-500" />
            Observaciones TTA
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <p className="text-amber-800">{tta.observaciones}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReclamoTTA;

