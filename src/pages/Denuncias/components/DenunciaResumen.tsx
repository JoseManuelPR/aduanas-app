import { Icon } from "he-button-custom-library";
import { Badge, getEstadoBadgeVariant, CollapsibleSection } from "../../../components/UI";
import type { BadgeVariant } from "../../../components/UI";
import type { Denuncia, Articulo, PermisosEstado } from '../../../data/types';
import { useNavigate } from "react-router-dom";
import { ERoutePaths } from "../../../routes/routes";

interface DenunciaResumenProps {
  denuncia: Denuncia;
  articulo: Articulo | null;
  permisos: PermisosEstado;
}

/**
 * DenunciaResumen - Vista de resumen con secciones colapsables
 * 
 * Jerarquía visual:
 * 1. Información de Gestión Inmediata (siempre visible, expandida)
 * 2. Tipificación Legal (expandida por defecto)
 * 3. Información Descriptiva (colapsada por defecto)
 * 4. Información Administrativa (colapsada por defecto)
 */
export const DenunciaResumen: React.FC<DenunciaResumenProps> = ({ 
  denuncia, 
  articulo,
  permisos: _permisos,
}) => {
  const navigate = useNavigate();
  void _permisos; // Mark as intentionally unused
  
  // Determinar prioridad según días de vencimiento
  const getPrioridad = () => {
    if (denuncia.diasVencimiento < 0) return 'critical';
    if (denuncia.diasVencimiento <= 3) return 'high';
    if (denuncia.diasVencimiento <= 7) return 'medium';
    return undefined;
  };

  return (
    <div className="space-y-4">
      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 1: INFORMACIÓN CRÍTICA DE GESTIÓN (Siempre visible)
          Prioridad: ALTA - Lo que el usuario necesita saber de inmediato
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection 
        title="Información de Gestión" 
        iconName="AlertCircle"
        defaultExpanded={true}
        priority={getPrioridad()}
        badge={
          denuncia.diasVencimiento < 0 ? (
            <Badge variant="error" size="sm">Vencida</Badge>
          ) : denuncia.diasVencimiento <= 5 ? (
            <Badge variant="warning" size="sm">Próximo a vencer</Badge>
          ) : null
        }
      >
        <div className="space-y-4">
          {/* Row de estados y fechas críticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="info-grid-item">
              <span className="info-grid-label">Estado</span>
              <Badge variant={getEstadoBadgeVariant(denuncia.estado)} dot size="md">
                {denuncia.estado}
              </Badge>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Fecha Emisión</span>
              <span className="info-grid-value">{denuncia.fechaEmision || denuncia.fechaIngreso}</span>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Funcionario Asignado</span>
              <span className="info-grid-value flex items-center gap-2">
                <Icon name="User" size={14} className="text-gray-400" />
                {denuncia.loginFuncionario || '-'}
              </span>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Etapa</span>
              <span className="info-grid-value">{denuncia.etapaFormulacion || '-'}</span>
            </div>
          </div>

          {/* Indicadores especiales */}
          {(denuncia.autodenuncio || denuncia.retencion || denuncia.mercanciaAfecta || denuncia.observada) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
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
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 2: MONTOS (Información financiera clave)
          Prioridad: ALTA - Datos numéricos importantes
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection 
        title="Montos y Valores" 
        iconName="DollarSign"
        defaultExpanded={true}
        badge={
          <span className="text-sm font-semibold text-gray-900">
            {denuncia.montoEstimado}
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Monto Estimado</p>
            <p className="text-xl font-bold text-gray-900">{denuncia.montoEstimado}</p>
          </div>
          
          {denuncia.tipoDenuncia === 'Infraccional' && (
            <>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Multa</p>
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
                  <p className="text-sm text-gray-500 mb-1">Multa Allanamiento</p>
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
            <p className="text-sm text-gray-500 mb-1">Monto Derechos</p>
            <p className="text-xl font-bold text-emerald-600">
              {denuncia.montoDerechos ? `$${denuncia.montoDerechos.toLocaleString('es-CL')}` : '-'}
            </p>
          </div>
          
          {denuncia.montoDerechosCancelados !== undefined && denuncia.montoDerechosCancelados > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Derechos Cancelados</p>
              <p className="text-xl font-bold text-blue-600">
                ${denuncia.montoDerechosCancelados.toLocaleString('es-CL')}
              </p>
            </div>
          )}
        </div>
        
        {/* Otros montos adicionales */}
        {(denuncia.montoRetencion || denuncia.montoNoDeclarado) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            {denuncia.montoRetencion && (
              <div className="info-grid-item">
                <span className="info-grid-label">Monto Retención</span>
                <span className="info-grid-value">${denuncia.montoRetencion.toLocaleString('es-CL')}</span>
              </div>
            )}
            {denuncia.montoNoDeclarado && (
              <div className="info-grid-item">
                <span className="info-grid-label">Monto No Declarado</span>
                <span className="info-grid-value">${denuncia.montoNoDeclarado.toLocaleString('es-CL')}</span>
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 3: TIPIFICACIÓN LEGAL
          Prioridad: MEDIA - Información técnica legal
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection 
        title="Tipificación Legal" 
        iconName="Scale"
        defaultExpanded={true}
        priority={denuncia.tipoDenuncia === 'Penal' ? 'high' : undefined}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="info-grid-item">
              <span className="info-grid-label">Tipo de Denuncia</span>
              <Badge variant={(denuncia.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant}>
                {denuncia.tipoDenuncia}
              </Badge>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Tipo de Infracción</span>
              <span className="info-grid-value">{denuncia.tipoInfraccion}</span>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Artículo</span>
              <span className="info-grid-value">
                {articulo ? articulo.nombre : denuncia.codigoArticulo || '-'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="info-grid-item">
              <span className="info-grid-label">Norma Infringida</span>
              <span className="info-grid-value text-sm">{denuncia.normaInfringida || '-'}</span>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Fundamento Legal</span>
              <span className="info-grid-value text-sm">{denuncia.fundamentoLegal || '-'}</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 4: DATOS PENALES (Solo si es denuncia penal)
      ═══════════════════════════════════════════════════════════════════ */}
      {denuncia.tipoDenuncia === 'Penal' && (
        <CollapsibleSection 
          title="Datos Denuncia Penal" 
          iconName="Gavel"
          defaultExpanded={true}
          priority="high"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="info-grid-item">
              <span className="info-grid-label">Denunciante</span>
              <span className="info-grid-value">{denuncia.codigoDenunciante || '-'}</span>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">N° Oficio</span>
              <span className="info-grid-value">{denuncia.numeroOficio || '-'}</span>
            </div>
            <div className="info-grid-item">
              <span className="info-grid-label">Fecha Oficio</span>
              <span className="info-grid-value">{denuncia.fechaOficio || '-'}</span>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 5: DESCRIPCIÓN DE HECHOS
          Prioridad: MEDIA - Contexto detallado
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection 
        title="Descripción de los Hechos" 
        iconName="FileText"
        defaultExpanded={false}
      >
        <div 
          className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg"
          dangerouslySetInnerHTML={{ 
            __html: denuncia.descripcionHechos || '<p class="text-gray-500">Sin descripción</p>' 
          }}
        />
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 6: MERCANCÍA (Si aplica)
      ═══════════════════════════════════════════════════════════════════ */}
      {denuncia.mercanciaDescripcion && (
        <CollapsibleSection 
          title="Mercancía Involucrada" 
          iconName="Package"
          defaultExpanded={false}
          priority={denuncia.mercanciaAfecta ? 'medium' : undefined}
        >
          <div className="space-y-3">
            <p className="text-gray-700">{denuncia.mercanciaDescripcion}</p>
            {denuncia.mercanciaId && (
              <button
                className="text-aduana-azul hover:underline text-sm flex items-center gap-1 font-medium"
                onClick={() => navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', denuncia.mercanciaId!))}
              >
                <Icon name="ExternalLink" size={14} />
                Ver detalle de mercancía
              </button>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 7: DATOS ADMINISTRATIVOS
          Prioridad: BAJA - Información de referencia
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection 
        title="Datos Administrativos" 
        iconName="Building"
        defaultExpanded={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="info-grid-item">
            <span className="info-grid-label">N° Denuncia</span>
            <span className="info-grid-value">{denuncia.numeroDenuncia}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">N° Interno</span>
            <span className="info-grid-value">{denuncia.numeroInterno || '-'}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Aduana</span>
            <span className="info-grid-value">{denuncia.aduana}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Aduana Emisión</span>
            <span className="info-grid-value">{denuncia.aduanaEmision || denuncia.aduana}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Sección</span>
            <span className="info-grid-value">{denuncia.seccion || '-'}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Fecha Ocurrencia</span>
            <span className="info-grid-value">{denuncia.fechaOcurrencia || '-'}</span>
          </div>
          {denuncia.hallazgoOrigen && (
            <div className="info-grid-item">
              <span className="info-grid-label">Hallazgo Origen</span>
              <Badge variant="warning">{denuncia.hallazgoOrigen}</Badge>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 8: ASIGNACIÓN
          Prioridad: BAJA - Información de referencia
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection 
        title="Asignación y Responsables" 
        iconName="UserCheck"
        defaultExpanded={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="info-grid-item">
            <span className="info-grid-label">Funcionario</span>
            <span className="info-grid-value flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-aduana-azul-100 flex items-center justify-center">
                <Icon name="User" size={14} className="text-aduana-azul" />
              </div>
              {denuncia.loginFuncionario || '-'}
            </span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Fiscalizador</span>
            <span className="info-grid-value flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Icon name="UserCheck" size={14} className="text-amber-600" />
              </div>
              {denuncia.loginFiscalizador || '-'}
            </span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Usuario Creación</span>
            <span className="info-grid-value">{denuncia.usuarioCreacion || '-'}</span>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default DenunciaResumen;
