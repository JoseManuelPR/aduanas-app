import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import { Badge } from "../../../components/UI";
import type { BadgeVariant } from "../../../components/UI";
import { ERoutePaths } from "../../../routes/routes";
import type { Giro, Denuncia } from '../../../data/types';

interface DenunciaGirosProps {
  giros: Giro[];
  denuncia: Denuncia;
}

export const DenunciaGiros: React.FC<DenunciaGirosProps> = ({ 
  giros,
  denuncia: _denuncia,
}) => {
  void _denuncia; // Mark as intentionally unused
  const navigate = useNavigate();

  const getTipoGiroBadge = (tipo: Giro['tipoGiro']): { variant: BadgeVariant, label: string } => {
    switch (tipo) {
      case 'F09':
        return { variant: 'info', label: 'F09 - Derechos' };
      case 'F16':
        return { variant: 'warning', label: 'F16 - Multas' };
      case 'F17':
        return { variant: 'default', label: 'F17 - Intereses' };
      default:
        return { variant: 'default', label: tipo };
    }
  };

  const getEstadoGiroVariant = (estado: Giro['estado']): BadgeVariant => {
    switch (estado) {
      case 'Emitido':
        return 'info';
      case 'Pagado':
        return 'success';
      case 'Vencido':
        return 'error';
      case 'Anulado':
        return 'default';
      case 'Parcialmente Pagado':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Calcular totales
  const totalEmitido = giros.reduce((acc, g) => {
    const monto = parseFloat(g.montoTotal.replace(/[^0-9.-]+/g, '')) || 0;
    return acc + monto;
  }, 0);

  const totalPagado = giros
    .filter(g => g.estado === 'Pagado')
    .reduce((acc, g) => {
      const monto = parseFloat(g.montoTotal.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + monto;
    }, 0);

  const totalVencido = giros
    .filter(g => g.estado === 'Vencido')
    .reduce((acc, g) => {
      const monto = parseFloat(g.montoTotal.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + monto;
    }, 0);

  if (giros.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="CreditCard" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Sin giros</h3>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          No hay giros emitidos para esta denuncia. Los giros se generan a partir de los cargos asociados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="CreditCard" size={18} />
          Giros Emitidos ({giros.length})
        </h4>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500">Total Emitido</p>
          <p className="text-xl font-bold text-blue-600">
            ${totalEmitido.toLocaleString('es-CL')}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-l-emerald-500">
          <p className="text-sm text-gray-500">Total Pagado</p>
          <p className="text-xl font-bold text-emerald-600">
            ${totalPagado.toLocaleString('es-CL')}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-500">Total Vencido</p>
          <p className="text-xl font-bold text-red-600">
            ${totalVencido.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      {/* Lista de giros */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Giro</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Emisión</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {giros.map((giro) => {
              const tipoBadge = getTipoGiroBadge(giro.tipoGiro);
              return (
                <tr key={giro.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{giro.numeroGiro}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tipoBadge.variant} size="sm">{tipoBadge.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{giro.fechaEmision}</td>
                  <td className="px-4 py-3 text-gray-600">{giro.fechaVencimiento}</td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant={getEstadoGiroVariant(giro.estado)} 
                      size="sm" 
                      dot
                      pulse={giro.estado === 'Vencido'}
                    >
                      {giro.estado}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-gray-900">{giro.montoTotal}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="p-1 text-gray-500 hover:text-aduana-azul" 
                        title="Ver detalle"
                        onClick={() => navigate(`${ERoutePaths.GIROS}/${giro.id}`)}
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-emerald-600" 
                        title="Imprimir"
                      >
                        <Icon name="Printer" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Alerta si hay giros vencidos */}
      {giros.some(g => g.estado === 'Vencido') && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Icon name="AlertCircle" size={20} className="text-red-600" />
          <div>
            <p className="font-medium text-red-800">Existen giros vencidos</p>
            <p className="text-sm text-red-600">
              {giros.filter(g => g.estado === 'Vencido').length} giro(s) se encuentran vencidos y pendientes de pago.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DenunciaGiros;

