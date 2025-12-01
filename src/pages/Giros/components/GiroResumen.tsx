/**
 * GiroResumen - Resumen del giro en vista 360°
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { Badge } from '../../../components/UI';
import { 
  type Giro, 
  type Cargo,
  type Denuncia,
  formatMonto,
  aduanas,
} from '../../../data';

interface GiroResumenProps {
  giro: Giro;
  cargo: Cargo | null;
  denuncia: Denuncia | null;
  onVerCargo?: () => void;
  onVerDenuncia?: () => void;
  onVerDeudor?: () => void;
}

export const GiroResumen: React.FC<GiroResumenProps> = ({
  giro,
  cargo,
  denuncia,
  onVerCargo,
  onVerDenuncia,
  onVerDeudor,
}) => {
  const aduana = aduanas.find(a => a.codigo === giro.codigoAduana || a.nombre === giro.aduana);
  
  // Obtener color del tipo de giro
  const getTipoGiroInfo = (tipo: string) => {
    switch (tipo) {
      case 'F09': return { color: 'bg-blue-100 text-blue-800', desc: 'Giro desde Cargo' };
      case 'F16': return { color: 'bg-amber-100 text-amber-800', desc: 'Giro desde Denuncia' };
      case 'F17': return { color: 'bg-purple-100 text-purple-800', desc: 'Otros Giros' };
      default: return { color: 'bg-gray-100 text-gray-800', desc: 'Giro' };
    }
  };
  
  const tipoInfo = getTipoGiroInfo(giro.tipoGiro);
  
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
            <p className="text-sm text-gray-500 mb-1">N° Giro</p>
            <p className="font-semibold text-aduana-azul">{giro.numeroGiro}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Tipo de Giro</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tipoInfo.color}`}>
              {giro.tipoGiro} - {tipoInfo.desc}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Origen</p>
            <Badge variant={
              giro.origenGiro === 'CARGO' ? 'info' : 
              giro.origenGiro === 'DENUNCIA' ? 'warning' : 'default'
            }>
              {giro.origenGiro === 'CARGO' ? 'Desde Cargo' : 
               giro.origenGiro === 'DENUNCIA' ? 'Desde Denuncia' : 'Manual'}
            </Badge>
            {giro.numeroEntidadOrigen && (
              <p className="text-sm mt-1 text-gray-600">N° {giro.numeroEntidadOrigen}</p>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Emisión</p>
            <p className="font-medium">{giro.fechaEmision}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Fecha Vencimiento</p>
            <p className="font-medium">{giro.fechaVencimiento}</p>
            {giro.plazo && (
              <p className="text-xs text-gray-500 mt-1">
                Plazo: {giro.plazo} días {giro.diaHabil ? '(hábiles)' : '(corridos)'}
              </p>
            )}
          </div>
          
          {giro.fechaNotificacion && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Fecha Notificación</p>
              <p className="font-medium">{giro.fechaNotificacion}</p>
            </div>
          )}
          
          {giro.fechaPago && (
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-sm text-emerald-700 mb-1">Fecha de Pago Completo</p>
              <p className="font-medium text-emerald-800">{giro.fechaPago}</p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Aduana</p>
            <p className="font-medium">{aduana?.nombre || giro.aduana || '-'}</p>
          </div>
        </div>
      </section>
      
      {/* Deudor */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={20} className="text-aduana-azul" />
          Deudor
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div>
                <p className="text-sm text-gray-500 mb-1">Emitido A</p>
                <p className="font-semibold">{giro.emitidoA}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">RUT</p>
                <p className="font-semibold">{giro.rutDeudor}</p>
              </div>
              {giro.direccionDeudor && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dirección</p>
                  <p className="font-medium">{giro.direccionDeudor}</p>
                </div>
              )}
              {giro.emailDeudor && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{giro.emailDeudor}</p>
                </div>
              )}
            </div>
            <CustomButton variant="secondary" onClick={onVerDeudor}>
              <Icon name="ExternalLink" size={16} />
              Ver Deudor
            </CustomButton>
          </div>
        </div>
      </section>
      
      {/* Montos */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-aduana-azul" />
          Resumen de Montos
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Monto Total</p>
              <p className="text-2xl font-bold text-aduana-azul">{giro.montoTotal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Monto Pagado</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatMonto(giro.montoPagado || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Saldo Pendiente</p>
              <p className={`text-2xl font-bold ${
                (giro.saldoPendiente || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {formatMonto(giro.saldoPendiente || 0)}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Relaciones */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Link" size={20} className="text-aduana-azul" />
          Entidades Relacionadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cargo && (
            <div className="border border-gray-200 rounded-lg p-4 hover:border-aduana-azul transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cargo Asociado</p>
                  <p className="font-semibold text-aduana-azul">{cargo.numeroCargo}</p>
                  <p className="text-sm text-gray-600">{cargo.montoTotal}</p>
                </div>
                <CustomButton variant="secondary" onClick={onVerCargo}>
                  <Icon name="ExternalLink" size={16} />
                  Ver
                </CustomButton>
              </div>
            </div>
          )}
          
          {denuncia && (
            <div className="border border-gray-200 rounded-lg p-4 hover:border-aduana-azul transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Denuncia Asociada</p>
                  <p className="font-semibold text-aduana-azul">{denuncia.numeroDenuncia}</p>
                  <Badge variant={denuncia.tipoDenuncia === 'Penal' ? 'error' : 'warning'}>
                    {denuncia.tipoDenuncia}
                  </Badge>
                </div>
                <CustomButton variant="secondary" onClick={onVerDenuncia}>
                  <Icon name="ExternalLink" size={16} />
                  Ver
                </CustomButton>
              </div>
            </div>
          )}
          
          {giro.mercanciaId && (
            <div className="border border-gray-200 rounded-lg p-4 hover:border-aduana-azul transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mercancía Asociada</p>
                  <p className="font-semibold text-aduana-azul">{giro.mercanciaId}</p>
                  <p className="text-xs text-gray-500">Liberación condicionada al pago</p>
                </div>
                <CustomButton variant="secondary">
                  <Icon name="Package" size={16} />
                  Ver
                </CustomButton>
              </div>
            </div>
          )}
          
          {!cargo && !denuncia && !giro.mercanciaId && (
            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
              <Icon name="Link2Off" size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Sin entidades relacionadas (giro manual)</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Comprobante */}
      {giro.numeroComprobante && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FileCheck" size={20} className="text-emerald-500" />
            Comprobante de Pago
          </h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Icon name="Receipt" size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800">N° {giro.numeroComprobante}</p>
                <p className="text-sm text-emerald-700">
                  Fecha de pago: {giro.fechaPago}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Motivo anulación */}
      {giro.estado === 'Anulado' && giro.motivoAnulacion && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="XCircle" size={20} className="text-red-500" />
            Motivo de Anulación
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{giro.motivoAnulacion}</p>
          </div>
        </section>
      )}
      
      {/* Observaciones */}
      {giro.observaciones && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-amber-500" />
            Observaciones
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">{giro.observaciones}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default GiroResumen;

