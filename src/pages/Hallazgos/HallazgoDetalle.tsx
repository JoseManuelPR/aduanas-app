import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { CustomButton } from "../../components/Button/Button";
import { Badge, getDiasVencimientoBadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getHallazgoPorId,
  getTodasLasNotificaciones,
  usuarioActual,
  type Hallazgo,
  type EstadoHallazgo,
  // Hallazgos externos
  getHallazgoExternoPorTransactionId,
  type HallazgoProcesado,
} from '../../data';

// Mapeo de variantes para estados de hallazgo
const getEstadoHallazgoBadgeVariant = (estado: EstadoHallazgo): "default" | "success" | "warning" | "error" | "info" => {
  switch (estado) {
    case 'Ingresado':
      return 'info';
    case 'En Análisis':
      return 'warning';
    case 'Notificar Denuncia':
      return 'error';
    case 'Derivado':
      return 'default';
    case 'Cerrado':
      return 'success';
    case 'Convertido a Denuncia':
      return 'success';
    default:
      return 'default';
  }
};

interface InfoCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-aduana-azul to-aduana-azul-dark px-4 py-3 flex items-center gap-2">
      <Icon name={icon as any} size={18} className="text-white" />
      <h3 className="text-white font-medium">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  badge?: boolean;
  badgeVariant?: "default" | "success" | "warning" | "error" | "info";
  highlight?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, badge, badgeVariant = 'default', highlight }) => (
  <div className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-amber-50 -mx-2 px-2 rounded' : ''}`}>
    <span className="text-sm text-gray-600">{label}</span>
    {badge ? (
      <Badge variant={badgeVariant}>{value || '-'}</Badge>
    ) : (
      <span className={`text-sm font-medium ${highlight ? 'text-amber-700' : 'text-gray-900'}`}>
        {value || '-'}
      </span>
    )}
  </div>
);

export const HallazgoDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [hallazgo, setHallazgo] = useState<Hallazgo | HallazgoProcesado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExternalHallazgo, setIsExternalHallazgo] = useState(false);

  const allNotifications = getTodasLasNotificaciones();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    // Buscar primero en hallazgos internos
    const hallazgoInterno = getHallazgoPorId(id);
    if (hallazgoInterno) {
      setHallazgo(hallazgoInterno);
      setIsExternalHallazgo(false);
      setIsLoading(false);
      return;
    }

    // Buscar en hallazgos externos por transactionId
    const hallazgoExterno = getHallazgoExternoPorTransactionId(id);
    if (hallazgoExterno) {
      setHallazgo(hallazgoExterno);
      setIsExternalHallazgo(true);
      setIsLoading(false);
      return;
    }

    // No encontrado
    setIsLoading(false);
  }, [id]);

  // Verificar si el hallazgo puede ser gestionado
  const puedeGestionar = (estado: EstadoHallazgo): boolean => {
    return ['Ingresado', 'En Análisis', 'Notificar Denuncia'].includes(estado);
  };

  // Renderizar loading
  if (isLoading) {
    return (
      <CustomLayout
        platformName="Sistema de Tramitación de Denuncias"
        sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
        options={[]}
        onLogout={() => navigate(ERoutePaths.LOGIN)}
        notifications={allNotifications}
        user={{
          initials: usuarioActual.initials,
          name: usuarioActual.name,
          email: usuarioActual.email,
          role: usuarioActual.role,
        }}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aduana-azul mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando hallazgo...</p>
          </div>
        </div>
      </CustomLayout>
    );
  }

  // Renderizar not found
  if (!hallazgo) {
    return (
      <CustomLayout
        platformName="Sistema de Tramitación de Denuncias"
        sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
        options={[]}
        onLogout={() => navigate(ERoutePaths.LOGIN)}
        notifications={allNotifications}
        user={{
          initials: usuarioActual.initials,
          name: usuarioActual.name,
          email: usuarioActual.email,
          role: usuarioActual.role,
        }}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Hallazgo no encontrado</h2>
            <p className="text-gray-500 mt-2">El hallazgo solicitado no existe o ha sido eliminado.</p>
            <CustomButton
              variant="primary"
              className="mt-4"
              onClick={() => navigate(ERoutePaths.HALLAZGOS)}
            >
              Volver al listado
            </CustomButton>
          </div>
        </div>
      </CustomLayout>
    );
  }

  // Determinar si es un hallazgo procesado (externo)
  const hallazgoProcesado = isExternalHallazgo ? hallazgo as HallazgoProcesado : null;

  return (
    <CustomLayout
      platformName="Sistema de Tramitación de Denuncias"
      sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
      options={[]}
      onLogout={() => navigate(ERoutePaths.LOGIN)}
      notifications={allNotifications}
      user={{
        initials: usuarioActual.initials,
        name: usuarioActual.name,
        email: usuarioActual.email,
        role: usuarioActual.role,
      }}
    >
      <div className="min-h-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button 
              onClick={() => navigate(ERoutePaths.HALLAZGOS)}
              className="mt-1 text-gray-500 hover:text-aduana-azul transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Hallazgo {hallazgo.numeroHallazgo}
                </h1>
                <Badge variant={getEstadoHallazgoBadgeVariant(hallazgo.estado)} dot>
                  {hallazgo.estado}
                </Badge>
                <Badge variant={hallazgo.tipoHallazgo === 'Penal' ? 'error' : 'info'}>
                  {hallazgo.tipoHallazgo}
                </Badge>
                {isExternalHallazgo && (
                  <Badge variant="warning">
                    <Icon name="Globe" size={12} className="mr-1" />
                    Origen Externo
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                Detalle completo del hallazgo de fiscalización
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {puedeGestionar(hallazgo.estado) && (
              <CustomButton 
                variant="primary" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate(`/hallazgos/${hallazgo.id}/gestionar`)}
              >
                <Icon name="FileCheck" size={16} className="mr-1" />
                Gestionar Hallazgo
              </CustomButton>
            )}
            <CustomButton 
              variant="secondary"
              onClick={() => {/* Exportar PDF */}}
            >
              <Icon name="FileDown" size={16} className="mr-1" />
              Exportar PDF
            </CustomButton>
          </div>
        </div>

        {/* Alerta de origen externo */}
        {isExternalHallazgo && hallazgoProcesado && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Hallazgo recibido del Sistema PFI</p>
                <p className="text-sm text-blue-700 mt-1">
                  Este hallazgo fue recibido automáticamente desde el sistema externo de denuncias.
                  <br />
                  <span className="font-mono text-xs">
                    Transaction ID: {hallazgoProcesado.transactionId}
                  </span>
                  <span className="mx-2">|</span>
                  <span className="font-mono text-xs">
                    Recibido: {new Date(hallazgoProcesado.timestampRecepcion).toLocaleString('es-CL')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid de información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información General */}
          <InfoCard title="Información General" icon="FileText">
            <InfoRow label="N° Hallazgo" value={hallazgo.numeroHallazgo} highlight />
            <InfoRow label="Fecha de Ingreso" value={hallazgo.fechaIngreso} />
            <InfoRow label="Estado" value={hallazgo.estado} badge badgeVariant={getEstadoHallazgoBadgeVariant(hallazgo.estado)} />
            <InfoRow label="Tipo" value={hallazgo.tipoHallazgo} badge badgeVariant={hallazgo.tipoHallazgo === 'Penal' ? 'error' : 'info'} />
            <InfoRow label="Aduana" value={hallazgo.aduana} />
            <InfoRow 
              label="Días para Vencimiento" 
              value={hallazgo.diasVencimiento < 0 
                ? `${Math.abs(hallazgo.diasVencimiento)} días vencido` 
                : hallazgo.diasVencimiento === 0 
                  ? 'Vence hoy' 
                  : `${hallazgo.diasVencimiento} días`} 
              badge 
              badgeVariant={getDiasVencimientoBadgeVariant(hallazgo.diasVencimiento) as any}
            />
            <InfoRow label="Funcionario Asignado" value={hallazgo.funcionarioAsignado} />
            {hallazgoProcesado?.numeroProvisorio && (
              <InfoRow label="N° Provisorio" value={hallazgoProcesado.numeroProvisorio} />
            )}
          </InfoCard>

          {/* Información del Infractor/Involucrado */}
          <InfoCard title="Información del Involucrado" icon="User">
            {hallazgoProcesado?.infractor ? (
              <>
                <InfoRow label="Tipo de Identificación" value={hallazgoProcesado.infractor.tipoIdentificadorNombre} />
                <InfoRow label="N° Documento" value={hallazgoProcesado.infractor.documentoIdentificador} highlight />
                <InfoRow label="Tipo de Persona" value={hallazgoProcesado.infractor.tipoPersonaNombre} />
                <InfoRow label="Nombre Completo" value={hallazgoProcesado.infractor.nombreCompleto} />
                {hallazgoProcesado.infractor.nombre && (
                  <InfoRow label="Nombre" value={hallazgoProcesado.infractor.nombre} />
                )}
                {hallazgoProcesado.infractor.apellidoPaterno && (
                  <InfoRow label="Apellido Paterno" value={hallazgoProcesado.infractor.apellidoPaterno} />
                )}
                {hallazgoProcesado.infractor.apellidoMaterno && (
                  <InfoRow label="Apellido Materno" value={hallazgoProcesado.infractor.apellidoMaterno} />
                )}
                {hallazgoProcesado.infractor.nacionalidad && (
                  <InfoRow label="Nacionalidad" value={hallazgoProcesado.infractor.nacionalidad} />
                )}
                {hallazgoProcesado.infractor.direccion && (
                  <InfoRow label="Dirección" value={hallazgoProcesado.infractor.direccion} />
                )}
                {hallazgoProcesado.infractor.comuna && (
                  <InfoRow label="Comuna" value={hallazgoProcesado.infractor.comuna} />
                )}
              </>
            ) : (
              <>
                <InfoRow label="RUT" value={hallazgo.rutInvolucrado} highlight />
                <InfoRow label="Nombre" value={hallazgo.nombreInvolucrado} />
                {hallazgo.datosDenuncia?.direccionInvolucrado && (
                  <InfoRow label="Dirección" value={hallazgo.datosDenuncia.direccionInvolucrado} />
                )}
                {hallazgo.datosDenuncia?.emailInvolucrado && (
                  <InfoRow label="Email" value={hallazgo.datosDenuncia.emailInvolucrado} />
                )}
                {hallazgo.datosDenuncia?.telefonoInvolucrado && (
                  <InfoRow label="Teléfono" value={hallazgo.datosDenuncia.telefonoInvolucrado} />
                )}
                {hallazgo.datosDenuncia?.representanteLegal && (
                  <InfoRow label="Representante Legal" value={hallazgo.datosDenuncia.representanteLegal} />
                )}
              </>
            )}
          </InfoCard>

          {/* Información de la Infracción */}
          <InfoCard title="Información de la Infracción" icon="AlertTriangle">
            {hallazgoProcesado ? (
              <>
                <InfoRow label="Código de Artículo" value={hallazgoProcesado.codigoArticulo} highlight />
                {hallazgoProcesado.nombreArticulo && (
                  <InfoRow label="Artículo" value={hallazgoProcesado.nombreArticulo} />
                )}
                <InfoRow 
                  label="Tipo de Infracción" 
                  value={hallazgoProcesado.tipoInfraccionCodigo === '1' ? 'Infraccional' : 'Penal'} 
                  badge 
                  badgeVariant={hallazgoProcesado.tipoInfraccionCodigo === '2' ? 'error' : 'info'} 
                />
                <InfoRow label="Etapa de Formulación" value={hallazgoProcesado.etapaFormulacionNombre || `Código ${hallazgoProcesado.etapaFormulacionCodigo}`} />
                <InfoRow 
                  label="Autodenuncio" 
                  value={hallazgoProcesado.esAutodenuncio ? 'Sí' : 'No'} 
                  badge 
                  badgeVariant={hallazgoProcesado.esAutodenuncio ? 'warning' : 'default'} 
                />
              </>
            ) : (
              <>
                {hallazgo.datosDenuncia?.tipoInfraccion && (
                  <InfoRow label="Tipo de Infracción" value={hallazgo.datosDenuncia.tipoInfraccion} />
                )}
                {hallazgo.datosDenuncia?.normaInfringida && (
                  <InfoRow label="Norma Infringida" value={hallazgo.datosDenuncia.normaInfringida} />
                )}
                {hallazgo.datosDenuncia?.fundamentoLegal && (
                  <InfoRow label="Fundamento Legal" value={hallazgo.datosDenuncia.fundamentoLegal} />
                )}
              </>
            )}
          </InfoCard>

          {/* Información de Multas */}
          <InfoCard title="Información de Multas" icon="DollarSign">
            <InfoRow label="Monto Estimado" value={hallazgo.montoEstimado} highlight />
            {hallazgoProcesado && (
              <>
                <InfoRow label="Multa Máxima" value={`$${hallazgoProcesado.multaMaxima.toLocaleString('es-CL')}`} />
                {hallazgoProcesado.multaSinAllanamiento !== null && (
                  <InfoRow label="Multa Sin Allanamiento" value={`$${hallazgoProcesado.multaSinAllanamiento.toLocaleString('es-CL')}`} />
                )}
                {hallazgoProcesado.multaConAllanamiento !== null && (
                  <InfoRow label="Multa Con Allanamiento" value={`$${hallazgoProcesado.multaConAllanamiento.toLocaleString('es-CL')}`} />
                )}
              </>
            )}
          </InfoCard>
        </div>

        {/* Descripción de los Hechos */}
        <InfoCard title="Descripción de los Hechos" icon="FileEdit">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {hallazgo.descripcion || 'Sin descripción registrada'}
            </p>
          </div>
        </InfoCard>

        {/* Documentos Aduaneros (Solo si es hallazgo externo) */}
        {hallazgoProcesado && hallazgoProcesado.documentosAduanerosProcesados.length > 0 && (
          <InfoCard title="Documentos Aduaneros Asociados" icon="Folder">
            <div className="space-y-3">
              {hallazgoProcesado.documentosAduanerosProcesados.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-aduana-azul/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-aduana-azul" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.tipoDocumentoNombre}</p>
                      <p className="text-sm text-gray-500">
                        {doc.tipoDocumentoSigla && <span className="mr-2">[{doc.tipoDocumentoSigla}]</span>}
                        N° {doc.numeroDocumento}
                        {doc.numeroReferencia && ` | Ref: ${doc.numeroReferencia}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Código: {doc.tipoDocumentoCodigo}</Badge>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Documentos Adjuntos (Solo si es hallazgo interno) */}
        {!isExternalHallazgo && hallazgo.datosDenuncia?.documentosAdjuntos && hallazgo.datosDenuncia.documentosAdjuntos.length > 0 && (
          <InfoCard title="Documentos Adjuntos" icon="Paperclip">
            <div className="space-y-3">
              {hallazgo.datosDenuncia.documentosAdjuntos.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-aduana-azul/10 rounded-lg flex items-center justify-center">
                      <Icon name={doc.tipo === 'pdf' ? 'FileText' : doc.tipo === 'jpg' || doc.tipo === 'png' ? 'Image' : 'File'} size={20} className="text-aduana-azul" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {doc.tamanio} · Subido el {doc.fechaSubida}
                      </p>
                    </div>
                  </div>
                  <CustomButton variant="secondary" className="text-xs">
                    <Icon name="Download" size={14} className="mr-1" />
                    Descargar
                  </CustomButton>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Información adicional de origen (Solo si es hallazgo externo) */}
        {hallazgoProcesado && (
          <InfoCard title="Información del Sistema Origen" icon="Globe">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow label="Usuario Origen" value={hallazgoProcesado.usuarioOrigen} />
              <InfoRow label="Agente de Aduana" value={hallazgoProcesado.agenteAduana || 'No especificado'} />
              <InfoRow label="Transaction ID" value={hallazgoProcesado.transactionId} />
              <InfoRow label="Timestamp Recepción" value={new Date(hallazgoProcesado.timestampRecepcion).toLocaleString('es-CL')} />
            </div>
            {hallazgoProcesado.datosDenuncia?.seccion && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <InfoRow label="Sección" value={hallazgoProcesado.datosDenuncia.seccion} />
              </div>
            )}
          </InfoCard>
        )}

        {/* Acciones finales */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <CustomButton
            variant="secondary"
            onClick={() => navigate(ERoutePaths.HALLAZGOS)}
          >
            <Icon name="ArrowLeft" size={16} className="mr-1" />
            Volver al Listado
          </CustomButton>
          
          <div className="flex gap-2">
            {puedeGestionar(hallazgo.estado) && (
              <CustomButton 
                variant="primary" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate(`/hallazgos/${hallazgo.id}/gestionar`)}
              >
                <Icon name="FileCheck" size={16} className="mr-1" />
                Gestionar Hallazgo
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default HallazgoDetalle;
