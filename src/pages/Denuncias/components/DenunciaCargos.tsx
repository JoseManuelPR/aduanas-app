import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import { CustomButton } from "../../../components/Button/Button";
import { Badge, getEstadoBadgeVariant, getDiasVencimientoBadgeVariant } from "../../../components/UI";
import { ERoutePaths } from "../../../routes/routes";
import type { Cargo, Denuncia, PermisosEstado } from '../../../data/types';

interface DenunciaCargosProps {
  cargos: Cargo[];
  denuncia: Denuncia;
  permisos: PermisosEstado;
  onGenerarCargo?: () => void;
}

export const DenunciaCargos: React.FC<DenunciaCargosProps> = ({ 
  cargos,
  denuncia: _denuncia,
  permisos,
  onGenerarCargo,
}) => {
  void _denuncia; // Mark as intentionally unused
  const navigate = useNavigate();

  if (cargos.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Receipt" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Sin cargos</h3>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          No hay cargos generados para esta denuncia. 
          {permisos.puedeGenerarCargo 
            ? ' Puede generar un cargo desde el botón de acciones.'
            : ' La denuncia debe estar formalizada para poder generar cargos.'
          }
        </p>
        {permisos.puedeGenerarCargo && onGenerarCargo && (
          <CustomButton 
            variant="primary" 
            className="mt-4 inline-flex items-center gap-2"
            onClick={onGenerarCargo}
          >
            <Icon name="FilePlus" size={16} />
            Generar Cargo
          </CustomButton>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="Receipt" size={18} />
          Cargos Asociados ({cargos.length})
        </h4>
        {permisos.puedeGenerarCargo && onGenerarCargo && (
          <CustomButton 
            variant="primary" 
            className="flex items-center gap-2 text-sm"
            onClick={onGenerarCargo}
          >
            <Icon name="FilePlus" size={16} />
            Generar Cargo
          </CustomButton>
        )}
      </div>

      {/* Lista de cargos */}
      <div className="space-y-3">
        {cargos.map((cargo) => (
          <div 
            key={cargo.id}
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`${ERoutePaths.CARGOS}/${cargo.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-aduana-azul-50 rounded-lg">
                  <Icon name="Receipt" size={24} className="text-aduana-azul" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">Cargo N° {cargo.numeroCargo}</span>
                    <Badge variant={getEstadoBadgeVariant(cargo.estado)} size="sm" dot>
                      {cargo.estado}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {cargo.fechaIngreso}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {cargo.aduana}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      {cargo.nombreDeudor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{cargo.montoTotal}</p>
                <Badge 
                  variant={getDiasVencimientoBadgeVariant(cargo.diasVencimiento)} 
                  size="sm"
                  pulse={cargo.diasVencimiento < 0}
                >
                  {cargo.diasVencimiento < 0 
                    ? `${Math.abs(cargo.diasVencimiento)}d vencido`
                    : `${cargo.diasVencimiento} días`
                  }
                </Badge>
              </div>
            </div>
            
            {/* Resumen de montos */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Derechos</p>
                <p className="font-medium">
                  {cargo.montoDerechos ? `$${cargo.montoDerechos.toLocaleString('es-CL')}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Multa</p>
                <p className="font-medium">
                  {cargo.montoMulta ? `$${cargo.montoMulta.toLocaleString('es-CL')}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Intereses</p>
                <p className="font-medium">
                  {cargo.montoIntereses ? `$${cargo.montoIntereses.toLocaleString('es-CL')}` : '-'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="card p-4 bg-gradient-to-r from-aduana-azul-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Calculator" size={20} className="text-aduana-azul" />
            <span className="font-medium text-gray-900">Total Cargos</span>
          </div>
          <span className="text-xl font-bold text-aduana-azul">
            {cargos.length} cargo{cargos.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DenunciaCargos;

