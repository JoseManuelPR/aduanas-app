import { Routes, Route, Navigate } from 'react-router-dom';
import { ERoutePaths } from './routes/routes';

// Pages
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { DenunciasList, DenunciasForm, DenunciaDetalle } from './pages/Denuncias';
import { ExpedienteDigital } from './pages/Expediente';
import { NotificacionesList } from './pages/Notificaciones';
import { HallazgosList, HallazgoDetalle } from './pages/Hallazgos';
import { CargosList, CargoDetalle, CargoForm } from './pages/Cargos';
import { GirosList, GiroDetalle, GiroForm } from './pages/Giros';
import { ReclamosList, ReclamoDetalle, ReclamoForm } from './pages/Reclamos';
import { AudienciaForm, EmitirActaAudiencia } from './pages/Audiencias';
import { MercanciasList, MercanciaDetalle } from './pages/Mercancias';
import { InvolucradosList, InvolucradoDetalle, InvolucradoForm } from './pages/Involucrados';
import { ReportesDashboard } from './pages/Reportes';
import { Configuracion } from './pages/Configuracion';

function App() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to={ERoutePaths.DASHBOARD} replace />} />
      
      {/* Auth */}
      <Route path={ERoutePaths.LOGIN} element={<Login />} />
      
      {/* Dashboard */}
      <Route path={ERoutePaths.DASHBOARD} element={<Dashboard />} />
      
      {/* Denuncias */}
      <Route path={ERoutePaths.DENUNCIAS} element={<DenunciasList />} />
      <Route path={ERoutePaths.DENUNCIAS_NUEVA} element={<DenunciasForm />} />
      <Route path={ERoutePaths.DENUNCIAS_DETALLE} element={<DenunciaDetalle />} />
      <Route path={ERoutePaths.DENUNCIAS_EDITAR} element={<DenunciasForm />} />
      
      {/* Expediente Digital - Rutas específicas primero */}
      <Route path={ERoutePaths.EXPEDIENTE_DENUNCIA} element={<ExpedienteDigital />} />
      <Route path={ERoutePaths.EXPEDIENTE_CARGO} element={<ExpedienteDigital />} />
      <Route path={ERoutePaths.EXPEDIENTE_RECLAMO} element={<ExpedienteDigital />} />
      <Route path={ERoutePaths.EXPEDIENTE_GIRO} element={<ExpedienteDigital />} />
      <Route path={ERoutePaths.EXPEDIENTE} element={<ExpedienteDigital />} />
      
      {/* Cargos */}
      <Route path={ERoutePaths.CARGOS} element={<CargosList />} />
      <Route path={ERoutePaths.CARGOS_NUEVO} element={<CargoForm />} />
      <Route path={ERoutePaths.CARGOS_DETALLE} element={<CargoDetalle />} />
      <Route path={ERoutePaths.CARGOS_EDITAR} element={<CargoForm />} />
      
      {/* Giros */}
      <Route path={ERoutePaths.GIROS} element={<GirosList />} />
      <Route path={ERoutePaths.GIROS_NUEVO} element={<GiroForm />} />
      <Route path={ERoutePaths.GIROS_DETALLE} element={<GiroDetalle />} />
      
      {/* Reclamos */}
      <Route path={ERoutePaths.RECLAMOS} element={<ReclamosList />} />
      <Route path={ERoutePaths.RECLAMOS_NUEVO} element={<ReclamoForm />} />
      <Route path={ERoutePaths.RECLAMOS_DETALLE} element={<ReclamoDetalle />} />
      <Route path={ERoutePaths.RECLAMOS_EDITAR} element={<ReclamoForm />} />
      
      {/* Audiencias */}
      <Route path={ERoutePaths.AUDIENCIAS_REGISTRAR} element={<AudienciaForm />} />
      <Route path={ERoutePaths.AUDIENCIAS_NUEVA} element={<AudienciaForm />} />
      <Route path={ERoutePaths.AUDIENCIAS_DETALLE} element={<AudienciaForm />} />
      <Route path={ERoutePaths.AUDIENCIAS_EDITAR} element={<AudienciaForm />} />
      {/* Emitir Acta de Audiencia y Resultado */}
      <Route path={ERoutePaths.AUDIENCIAS_EMITIR_ACTA} element={<EmitirActaAudiencia />} />
      
      {/* Hallazgos (PFI) */}
      <Route path={ERoutePaths.HALLAZGOS} element={<HallazgosList />} />
      <Route path={ERoutePaths.HALLAZGOS_DETALLE} element={<HallazgoDetalle />} />
      <Route path={ERoutePaths.HALLAZGOS_GESTIONAR} element={<DenunciasForm />} />
      
      {/* Notificaciones */}
      <Route path={ERoutePaths.NOTIFICACIONES} element={<NotificacionesList />} />
      <Route path={ERoutePaths.NOTIFICACIONES_DETALLE} element={<NotificacionesList />} />
      
      {/* Gestión de Mercancías (solo lectura - datos de sistemas externos) */}
      <Route path={ERoutePaths.MERCANCIAS} element={<MercanciasList />} />
      <Route path={ERoutePaths.MERCANCIAS_DETALLE} element={<MercanciaDetalle />} />
      
      {/* Gestión de Involucrados */}
      <Route path={ERoutePaths.INVOLUCRADOS} element={<InvolucradosList />} />
      <Route path={ERoutePaths.INVOLUCRADOS_NUEVO} element={<InvolucradoForm />} />
      <Route path={ERoutePaths.INVOLUCRADOS_DETALLE} element={<InvolucradoDetalle />} />
      <Route path={ERoutePaths.INVOLUCRADOS_EDITAR} element={<InvolucradoForm />} />
      
      {/* Reportes e Indicadores */}
      <Route path={ERoutePaths.REPORTES} element={<ReportesDashboard />} />
      <Route path={ERoutePaths.INDICADORES} element={<ReportesDashboard />} />
      <Route path={ERoutePaths.AUDITORIA} element={<ReportesDashboard />} />
      
      {/* Configuración */}
      <Route path={ERoutePaths.CONFIGURACION} element={<Configuracion />} />
      <Route path={ERoutePaths.PERFIL} element={<Dashboard />} />
      
      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to={ERoutePaths.DASHBOARD} replace />} />
    </Routes>
  );
}

export default App;

