/**
 * MercanciaItems - Lista de ítems de la mercancía
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Mercancia, type ItemMercancia } from '../../../data';

interface MercanciaItemsProps {
  mercancia: Mercancia;
}

export const MercanciaItems: React.FC<MercanciaItemsProps> = ({ mercancia }) => {
  const items = mercancia.items || [];
  
  const getEstadoItemVariant = (estado: ItemMercancia['estado']) => {
    const variantMap: Record<ItemMercancia['estado'], 'success' | 'warning' | 'danger' | 'default'> = {
      'Bueno': 'success',
      'Regular': 'warning',
      'Malo': 'danger',
      'Destruido': 'default',
    };
    return variantMap[estado];
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Icon name="Package" size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No hay ítems detallados registrados para esta mercancía.</p>
        <p className="text-sm text-gray-400 mt-2">
          Cantidad total: {mercancia.cantidad.toLocaleString('es-CL')} {mercancia.unidadMedida}
        </p>
      </div>
    );
  }

  const totalValor = items.reduce((sum, item) => sum + (item.valorTotal || 0), 0);
  const totalCantidad = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-aduana-azul-50 rounded-lg p-4 text-center">
          <p className="text-sm text-aduana-azul-600 mb-1">Total Ítems</p>
          <p className="text-2xl font-bold text-aduana-azul">{items.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Cantidad Total</p>
          <p className="text-2xl font-bold">{totalCantidad.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <p className="text-sm text-emerald-600 mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-emerald-600">
            ${totalValor.toLocaleString('es-CL')}
          </p>
        </div>
      </div>
      
      {/* Lista de ítems */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="List" size={20} className="text-aduana-azul" />
          Detalle de Ítems
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">V. Unitario</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">V. Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{item.descripcionItem}</p>
                    {item.serie && (
                      <p className="text-xs text-gray-500">Serie: {item.serie}</p>
                    )}
                    {item.observaciones && (
                      <p className="text-xs text-gray-400 mt-1">{item.observaciones}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium">{item.cantidad.toLocaleString('es-CL')}</span>
                    <span className="text-xs text-gray-500 ml-1">{item.unidadMedida}</span>
                  </td>
                  <td className="px-4 py-3">
                    {item.marca && <p className="font-medium">{item.marca}</p>}
                    {item.modelo && <p className="text-sm text-gray-500">{item.modelo}</p>}
                    {!item.marca && !item.modelo && '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.valorUnitario 
                      ? `$${item.valorUnitario.toLocaleString('es-CL')}` 
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {item.valorTotal 
                      ? `$${item.valorTotal.toLocaleString('es-CL')}` 
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={getEstadoItemVariant(item.estado)}>
                      {item.estado}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-4 py-3 font-semibold">Total</td>
                <td className="px-4 py-3 text-center font-semibold">
                  {totalCantidad.toLocaleString('es-CL')}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                  ${totalValor.toLocaleString('es-CL')}
                </td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MercanciaItems;

