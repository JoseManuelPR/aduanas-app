/**
 * GiroCuentas - Detalle de cuentas del giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { type GiroCuenta, formatMonto } from '../../../data';

interface GiroCuentasProps {
  cuentas: GiroCuenta[];
  totalGiro: number;
}

export const GiroCuentas: React.FC<GiroCuentasProps> = ({
  cuentas,
  totalGiro,
}) => {
  // Obtener color por tipo de cuenta
  const getColorTipo = (codigoCuenta: string) => {
    if (codigoCuenta.startsWith('1')) return 'text-emerald-600 bg-emerald-50';
    if (codigoCuenta.startsWith('2')) return 'text-amber-600 bg-amber-50';
    if (codigoCuenta.startsWith('3')) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  // Agrupar cuentas por tipo
  const derechos = cuentas.filter(c => c.codigoCuenta.startsWith('1'));
  const multas = cuentas.filter(c => c.codigoCuenta.startsWith('2'));
  const intereses = cuentas.filter(c => c.codigoCuenta.startsWith('3'));
  const otros = cuentas.filter(c => !['1', '2', '3'].includes(c.codigoCuenta[0]));
  
  const totalDerechos = derechos.reduce((sum, c) => sum + c.monto, 0);
  const totalMultas = multas.reduce((sum, c) => sum + c.monto, 0);
  const totalIntereses = intereses.reduce((sum, c) => sum + c.monto, 0);
  const totalOtros = otros.reduce((sum, c) => sum + c.monto, 0);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cuentas del Giro</h3>
          <p className="text-sm text-gray-500">
            Desglose de conceptos que conforman el monto total
          </p>
        </div>
      </div>
      
      {/* Resumen por tipo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-800">Derechos</span>
            <span className="text-xs text-emerald-600">{derechos.length}</span>
          </div>
          <p className="text-lg font-bold text-emerald-700">{formatMonto(totalDerechos)}</p>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-800">Multas</span>
            <span className="text-xs text-amber-600">{multas.length}</span>
          </div>
          <p className="text-lg font-bold text-amber-700">{formatMonto(totalMultas)}</p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-800">Intereses</span>
            <span className="text-xs text-red-600">{intereses.length}</span>
          </div>
          <p className="text-lg font-bold text-red-700">{formatMonto(totalIntereses)}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">Otros</span>
            <span className="text-xs text-gray-600">{otros.length}</span>
          </div>
          <p className="text-lg font-bold text-gray-700">{formatMonto(totalOtros)}</p>
        </div>
      </div>
      
      {/* Tabla de cuentas */}
      {cuentas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon name="Calculator" size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No hay cuentas registradas en este giro</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Cuenta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moneda</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% del Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cuentas.sort((a, b) => a.orden - b.orden).map((cuenta, idx) => {
                const porcentaje = totalGiro > 0 ? (cuenta.monto / totalGiro) * 100 : 0;
                return (
                  <tr key={cuenta.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm px-2 py-1 rounded ${getColorTipo(cuenta.codigoCuenta)}`}>
                        {cuenta.codigoCuenta}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{cuenta.nombreCuenta}</td>
                    <td className="px-4 py-3 text-sm">{cuenta.moneda}</td>
                    <td className="px-4 py-3 text-right font-semibold text-aduana-azul">
                      {formatMonto(cuenta.monto)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500">
                      {porcentaje.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-aduana-azul/5 border-t-2 border-aduana-azul">
              <tr>
                <td colSpan={4} className="px-4 py-4 text-right font-bold text-gray-700">
                  TOTAL GIRO
                </td>
                <td className="px-4 py-4 text-right text-xl font-bold text-aduana-azul">
                  {formatMonto(totalGiro)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-gray-500">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      
      {/* Gráfico visual de distribución */}
      {cuentas.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Distribución del Monto</p>
          <div className="flex h-6 rounded-full overflow-hidden">
            {totalDerechos > 0 && (
              <div 
                className="bg-emerald-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(totalDerechos / totalGiro) * 100}%` }}
                title={`Derechos: ${formatMonto(totalDerechos)}`}
              >
                {((totalDerechos / totalGiro) * 100).toFixed(0)}%
              </div>
            )}
            {totalMultas > 0 && (
              <div 
                className="bg-amber-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(totalMultas / totalGiro) * 100}%` }}
                title={`Multas: ${formatMonto(totalMultas)}`}
              >
                {((totalMultas / totalGiro) * 100).toFixed(0)}%
              </div>
            )}
            {totalIntereses > 0 && (
              <div 
                className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(totalIntereses / totalGiro) * 100}%` }}
                title={`Intereses: ${formatMonto(totalIntereses)}`}
              >
                {((totalIntereses / totalGiro) * 100).toFixed(0)}%
              </div>
            )}
            {totalOtros > 0 && (
              <div 
                className="bg-gray-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${(totalOtros / totalGiro) * 100}%` }}
                title={`Otros: ${formatMonto(totalOtros)}`}
              >
                {((totalOtros / totalGiro) * 100).toFixed(0)}%
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div> Derechos
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded"></div> Multas
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div> Intereses
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div> Otros
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiroCuentas;

