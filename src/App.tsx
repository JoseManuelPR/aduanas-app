import { Routes, Route, Navigate } from 'react-router-dom';
import { ERoutePaths } from './routes/routes';

// Pages
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { HallazgosList } from './pages/Hallazgos';
import { DenunciasList, DenunciasForm, DenunciaDetalle } from './pages/Denuncias';
import { ExpedienteDigital } from './pages/Expediente';
import { NotificacionesList } from './pages/Notificaciones';
import { CargosList } from './pages/Cargos';
import { GirosList } from './pages/Giros';
import { ReclamosList } from './pages/Reclamos';
import { ReportesDashboard } from './pages/Reportes';
import { SeguimientoList } from './pages/SeguimientoMercancia';

function App() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to={ERoutePaths.DASHBOARD} replace />} />
      
      {/* Auth */}
      <Route path={ERoutePaths.LOGIN} element={<Login />} />
      
      {/* Dashboard */}
      <Route path={ERoutePaths.DASHBOARD} element={<Dashboard />} />
      
      {/* Hallazgos */}
      <Route path={ERoutePaths.HALLAZGOS} element={<HallazgosList />} />
      
      {/* Denuncias */}
      <Route path={ERoutePaths.DENUNCIAS} element={<DenunciasList />} />
      <Route path={ERoutePaths.DENUNCIAS_NUEVA} element={<DenunciasForm />} />
      <Route path={ERoutePaths.DENUNCIAS_DESDE_HALLAZGO} element={<DenunciasForm />} />
      <Route path={ERoutePaths.HALLAZGOS_GESTIONAR} element={<DenunciasForm />} />
      <Route path={ERoutePaths.DENUNCIAS_DETALLE} element={<DenunciaDetalle />} />
      <Route path={ERoutePaths.DENUNCIAS_EDITAR} element={<DenunciasForm />} />
      
      {/* Expediente Digital */}
      <Route path={ERoutePaths.EXPEDIENTE} element={<ExpedienteDigital />} />
      
      {/* Cargos */}
      <Route path={ERoutePaths.CARGOS} element={<CargosList />} />
      <Route path={ERoutePaths.CARGOS_NUEVO} element={<CargosList />} />
      <Route path={ERoutePaths.CARGOS_DETALLE} element={<CargosList />} />
      
      {/* Giros */}
      <Route path={ERoutePaths.GIROS} element={<GirosList />} />
      <Route path={ERoutePaths.GIROS_NUEVO} element={<GirosList />} />
      <Route path={ERoutePaths.GIROS_DETALLE} element={<GirosList />} />
      
      {/* Reclamos */}
      <Route path={ERoutePaths.RECLAMOS} element={<ReclamosList />} />
      <Route path={ERoutePaths.RECLAMOS_NUEVO} element={<ReclamosList />} />
      <Route path={ERoutePaths.RECLAMOS_DETALLE} element={<ReclamosList />} />
      
      {/* Notificaciones */}
      <Route path={ERoutePaths.NOTIFICACIONES} element={<NotificacionesList />} />
      <Route path={ERoutePaths.NOTIFICACIONES_DETALLE} element={<NotificacionesList />} />
      
      {/* Seguimiento de Mercancía */}
      <Route path={ERoutePaths.SEGUIMIENTO_MERCANCIA} element={<SeguimientoList />} />
      <Route path={ERoutePaths.SEGUIMIENTO_MERCANCIA_DETALLE} element={<SeguimientoList />} />
      
      {/* Reportes e Indicadores */}
      <Route path={ERoutePaths.REPORTES} element={<ReportesDashboard />} />
      <Route path={ERoutePaths.INDICADORES} element={<ReportesDashboard />} />
      <Route path={ERoutePaths.AUDITORIA} element={<ReportesDashboard />} />
      
      {/* Mantenedores - placeholder */}
      <Route path={ERoutePaths.MANTENEDORES} element={<Dashboard />} />
      <Route path={ERoutePaths.MANTENEDORES_ADUANAS} element={<Dashboard />} />
      <Route path={ERoutePaths.MANTENEDORES_SECCIONES} element={<Dashboard />} />
      <Route path={ERoutePaths.MANTENEDORES_FUNDAMENTOS} element={<Dashboard />} />
      <Route path={ERoutePaths.MANTENEDORES_NORMAS} element={<Dashboard />} />
      <Route path={ERoutePaths.MANTENEDORES_USUARIOS} element={<Dashboard />} />
      
      {/* Configuración */}
      <Route path={ERoutePaths.CONFIGURACION} element={<Dashboard />} />
      <Route path={ERoutePaths.PERFIL} element={<Dashboard />} />
      
      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to={ERoutePaths.DASHBOARD} replace />} />
    </Routes>
  );
}

export default App;

