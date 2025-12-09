import { Icon } from "he-button-custom-library";
import { Badge, getEstadoBadgeVariant } from "../../../components/UI";
import type { BadgeVariant } from "../../../components/UI";
import type { Denuncia, Articulo, PermisosEstado } from '../../../data/types';
import { useNavigate } from "react-router-dom";
import { ERoutePaths } from "../../../routes/routes";

interface DenunciaResumenProps {
  denuncia: Denuncia;
  articulo: Articulo | null;
  permisos: PermisosEstado;
}

export const DenunciaResumen: React.FC<DenunciaResumenProps> = ({ 
  denuncia, 
  articulo,
  permisos: _permisos,
}) => {
  const navigate = useNavigate();
  void _permisos; // Mark as intentionally unused
  return (
    <div className="space-y-6">
      {/* Datos Generales */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="FileText" size={18} />
          Datos Generales
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">N° Denuncia</p>
            <p className="font-medium">{denuncia.numeroDenuncia}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">N° Interno</p>
            <p className="font-medium">{denuncia.numeroInterno || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de Denuncia</p>
            <Badge variant={(denuncia.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant}>
              {denuncia.tipoDenuncia}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <Badge variant={getEstadoBadgeVariant(denuncia.estado)} dot>
              {denuncia.estado}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha Emisión</p>
            <p className="font-medium">{denuncia.fechaEmision || denuncia.fechaIngreso}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha Ocurrencia</p>
            <p className="font-medium">{denuncia.fechaOcurrencia || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Aduana</p>
            <p className="font-medium">{denuncia.aduana}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Aduana Emisión</p>
            <p className="font-medium">{denuncia.aduanaEmision || denuncia.aduana}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sección</p>
            <p className="font-medium">{denuncia.seccion || '-'}</p>
          </div>
          {denuncia.hallazgoOrigen && (
            <div>
              <p className="text-sm text-gray-500">Hallazgo Origen</p>
              <Badge variant="warning">{denuncia.hallazgoOrigen}</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Tipificación */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="Scale" size={18} />
          Tipificación
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo de Infracción</p>
            <p className="font-medium">{denuncia.tipoInfraccion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Artículo</p>
            <p className="font-medium">
              {articulo ? articulo.nombre : denuncia.codigoArticulo || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Norma Infringida</p>
            <p className="font-medium text-sm">{denuncia.normaInfringida || '-'}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm text-gray-500">Fundamento Legal</p>
            <p className="font-medium text-sm">{denuncia.fundamentoLegal || '-'}</p>
          </div>
        </div>
      </div>

      {/* Montos */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="DollarSign" size={18} />
          Montos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Monto Estimado</p>
            <p className="text-xl font-bold text-gray-900">{denuncia.montoEstimado}</p>
          </div>
          {denuncia.tipoDenuncia === 'Infraccional' && (
            <>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-500">Multa</p>
                <p className="text-xl font-bold text-amber-600">
                  {denuncia.multa ? `$${denuncia.multa.toLocaleString('es-CL')}` : '-'}
                </p>
                {articulo && (
                  <p className="text-xs text-gray-500 mt-1">
                    Rango: ${articulo.multaMinima?.toLocaleString('es-CL')} - ${articulo.multaMaxima?.toLocaleString('es-CL')}
                  </p>
                )}
              </div>
              {articulo?.permiteAllanamiento && denuncia.multaAllanamiento && (
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-500">Multa Allanamiento</p>
                  <p className="text-xl font-bold text-teal-600">
                    ${denuncia.multaAllanamiento.toLocaleString('es-CL')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {articulo.porcentajeAllanamiento}% de reducción
                  </p>
                </div>
              )}
            </>
          )}
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-500">Monto Derechos</p>
            <p className="text-xl font-bold text-emerald-600">
              {denuncia.montoDerechos ? `$${denuncia.montoDerechos.toLocaleString('es-CL')}` : '-'}
            </p>
          </div>
          {denuncia.montoDerechosCancelados !== undefined && denuncia.montoDerechosCancelados > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Derechos Cancelados</p>
              <p className="text-xl font-bold text-blue-600">
                ${denuncia.montoDerechosCancelados.toLocaleString('es-CL')}
              </p>
            </div>
          )}
        </div>
        
        {/* Otros montos */}
        {(denuncia.montoRetencion || denuncia.montoNoDeclarado) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            {denuncia.montoRetencion && (
              <div>
                <p className="text-sm text-gray-500">Monto Retención</p>
                <p className="font-medium">${denuncia.montoRetencion.toLocaleString('es-CL')}</p>
              </div>
            )}
            {denuncia.montoNoDeclarado && (
              <div>
                <p className="text-sm text-gray-500">Monto No Declarado</p>
                <p className="font-medium">${denuncia.montoNoDeclarado.toLocaleString('es-CL')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tipificación Penal (solo si es penal) */}
      {denuncia.tipoDenuncia === 'Penal' && (
        <div className="card p-5 border-l-4 border-l-red-500">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Icon name="Gavel" size={18} />
            Datos Denuncia Penal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Denunciante</p>
              <p className="font-medium">{denuncia.codigoDenunciante || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">N° Oficio</p>
              <p className="font-medium">{denuncia.numeroOficio || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha Oficio</p>
              <p className="font-medium">{denuncia.fechaOficio || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Flags */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="Flag" size={18} />
          Indicadores
        </h4>
        <div className="flex flex-wrap gap-3">
          {denuncia.autodenuncio && (
            <Badge variant="info" size="md">
              <Icon name="User" size={14} className="mr-1" />
              Autodenuncia
            </Badge>
          )}
          {denuncia.retencion && (
            <Badge variant="warning" size="md">
              <Icon name="Lock" size={14} className="mr-1" />
              Con Retención
            </Badge>
          )}
          {denuncia.mercanciaAfecta && (
            <Badge variant={"error" as BadgeVariant} size="md">
              <Icon name="Package" size={14} className="mr-1" />
              Mercancía Afecta
            </Badge>
          )}
          {denuncia.observada && (
            <Badge variant={"error" as BadgeVariant} size="md">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              Observada
            </Badge>
          )}
          {!denuncia.autodenuncio && !denuncia.retencion && !denuncia.mercanciaAfecta && !denuncia.observada && (
            <span className="text-gray-500 text-sm">Sin indicadores especiales</span>
          )}
        </div>
      </div>

      {/* Descripción de Hechos */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="FileText" size={18} />
          Descripción de los Hechos
        </h4>
        <div 
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ 
            __html: denuncia.descripcionHechos || '<p class="text-gray-500">Sin descripción</p>' 
          }}
        />
      </div>

      {/* Mercancía */}
      {denuncia.mercanciaDescripcion && (
        <div className="card p-5">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Icon name="Package" size={18} />
            Mercancía Involucrada
          </h4>
          <p className="text-gray-700">{denuncia.mercanciaDescripcion}</p>
          {denuncia.mercanciaId && (
            <button
              className="mt-3 text-aduana-azul hover:underline text-sm flex items-center gap-1"
              onClick={() => navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', denuncia.mercanciaId!))}
            >
              <Icon name="ExternalLink" size={14} />
              Ver detalle de mercancía
            </button>
          )}
        </div>
      )}

      {/* Asignación */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="UserCheck" size={18} />
          Asignación
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Funcionario</p>
            <p className="font-medium">{denuncia.loginFuncionario || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fiscalizador</p>
            <p className="font-medium">{denuncia.loginFiscalizador || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Etapa Formulación</p>
            <p className="font-medium">{denuncia.etapaFormulacion || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenunciaResumen;

