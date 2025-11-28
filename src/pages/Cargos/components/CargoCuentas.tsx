/**
 * CargoCuentas - Gestión de cuentas del cargo
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { Badge } from '../../../components/UI';
import { type CargoCuenta, formatMonto, cuentasCatalogo } from '../../../data';

interface CargoCuentasProps {
  cuentas: CargoCuenta[];
  puedeEditar: boolean;
  onAgregar?: () => void;
  onEditar?: (cuenta: CargoCuenta) => void;
  onEliminar?: (id: string) => void;
  totalCalculado: number;
}

export const CargoCuentas: React.FC<CargoCuentasProps> = ({
  cuentas,
  puedeEditar,
  onAgregar,
  onEditar,
  onEliminar,
  totalCalculado,
}) => {
  // Obtener tipo de cuenta desde el catálogo
  const getTipoCuenta = (codigoCuenta: string) => {
    const cuenta = cuentasCatalogo.find(c => c.codigo === codigoCuenta);
    return cuenta?.tipoCuenta || 'Otro';
  };
  
  // Colores por tipo de cuenta
  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'Derechos': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Multa': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Intereses': return 'text-red-600 bg-red-50 border-red-200';
      case 'Reajuste': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  // Agrupar cuentas por tipo
  const cuentasPorTipo = cuentas.reduce((acc, cuenta) => {
    const tipo = getTipoCuenta(cuenta.codigoCuenta);
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(cuenta);
    return acc;
  }, {} as Record<string, CargoCuenta[]>);
  
  // Calcular subtotales por tipo
  const subtotales = Object.entries(cuentasPorTipo).map(([tipo, cuentasTipo]) => ({
    tipo,
    total: cuentasTipo.reduce((sum, c) => sum + c.monto, 0),
    count: cuentasTipo.length,
  }));
  
  return (
    <div className="space-y-6">
      {/* Header con botón agregar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cuentas de Cargo</h3>
          <p className="text-sm text-gray-500">
            {cuentas.length} cuenta{cuentas.length !== 1 ? 's' : ''} registrada{cuentas.length !== 1 ? 's' : ''}
          </p>
        </div>
        {puedeEditar && (
          <CustomButton variant="primary" onClick={onAgregar}>
            <Icon name="Plus" size={16} />
            Agregar Cuenta
          </CustomButton>
        )}
      </div>
      
      {/* Resumen por tipo */}
      {subtotales.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subtotales.map(({ tipo, total, count }) => (
            <div 
              key={tipo} 
              className={`rounded-lg p-4 border ${getColorTipo(tipo)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{tipo}</span>
                <Badge variant="default">{count}</Badge>
              </div>
              <p className="text-lg font-bold">{formatMonto(total)}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Tabla de cuentas */}
      {cuentas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon name="Calculator" size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">No hay cuentas registradas</p>
          <p className="text-sm text-amber-600 bg-amber-50 inline-block px-4 py-2 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="inline mr-1" />
            No se puede emitir cargo sin cuentas de cargo
          </p>
          {puedeEditar && (
            <div className="mt-4">
              <CustomButton variant="primary" onClick={onAgregar}>
                <Icon name="Plus" size={16} />
                Agregar primera cuenta
              </CustomButton>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Cuenta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moneda</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                {puedeEditar && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cuentas.sort((a, b) => a.orden - b.orden).map((cuenta, idx) => {
                const tipo = getTipoCuenta(cuenta.codigoCuenta);
                return (
                  <tr key={cuenta.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {cuenta.codigoCuenta}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{cuenta.nombreCuenta}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getColorTipo(tipo)}`}>
                        {tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{cuenta.moneda}</td>
                    <td className="px-4 py-3 text-right font-semibold text-aduana-azul">
                      {formatMonto(cuenta.monto)}
                    </td>
                    {puedeEditar && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onEditar?.(cuenta)}
                            className="p-1 text-gray-400 hover:text-aduana-azul transition-colors"
                            title="Editar"
                          >
                            <Icon name="Edit" size={16} />
                          </button>
                          <button 
                            onClick={() => onEliminar?.(cuenta.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Icon name="Trash2" size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-aduana-azul/5 border-t-2 border-aduana-azul">
              <tr>
                <td colSpan={puedeEditar ? 5 : 4} className="px-4 py-4 text-right font-bold text-gray-700">
                  TOTAL CARGO
                </td>
                <td className="px-4 py-4 text-right text-xl font-bold text-aduana-azul">
                  {formatMonto(totalCalculado)}
                </td>
                {puedeEditar && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      
      {/* Botón calcular (feedback visual) */}
      {cuentas.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Icon name="Calculator" size={20} />
            <span className="font-medium">Total calculado automáticamente</span>
          </div>
          <CustomButton 
            variant="secondary" 
            onClick={() => alert(`Total: ${formatMonto(totalCalculado)}`)}
          >
            <Icon name="RefreshCw" size={16} />
            Recalcular
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default CargoCuentas;

