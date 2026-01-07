/**
 * CargoForm - Formulario para crear/editar cargos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import InputField from '../../organisms/InputField/InputField';
import { Badge, Stepper } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import {
  getCargoPorId,
  getDenunciaPorId,
  getReclamoPorId,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  secciones,
  normasCatalogo,
  fundamentosCatalogo,
  crearCargo,
  actualizarCargo,
  formatMonto,
  type Cargo,
  type CargoCuenta,
  type CargoInfractor,
  type CargoDocumentoAduanero,
} from '../../data';

import { ModalConfirmacion, ModalAgregarCuenta } from './components';

// Interfaz para el formulario
interface CargoFormData {
  // Datos generales
  numeroInterno: string;
  fechaGeneracion: string;
  fechaOcurrencia: string;
  fechaIngreso: string;
  origen: 'DENUNCIA' | 'TRAMITE_ADUANERO' | 'OTRO';
  codigoAduana: string;
  codigoAduanaDestino: string;
  codigoSeccion: string;
  aduanaNotificacion: string;
  jefeRevisor: string;
  seccionInfraccion: string;
  area: string;
  subarea: string;
  tieneReclamoAsociado: boolean;
  
  // Tipificación
  norma: string;
  fundamento: string;
  descripcionHechos: string;
  
  // Relaciones
  denunciaAsociada: string;
  mercanciaId: string;
  
  // Deudor principal
  rutDeudor: string;
  nombreDeudor: string;
  
  // Cuentas, infractores, documentos
  cuentas: CargoCuenta[];
  infractores: CargoInfractor[];
  documentosAduaneros: CargoDocumentoAduanero[];
  
  // Observaciones
  observaciones: string;
}

const initialFormData: CargoFormData = {
  numeroInterno: '',
  fechaGeneracion: new Date().toISOString().split('T')[0],
  fechaOcurrencia: '',
  fechaIngreso: new Date().toISOString().split('T')[0],
  origen: 'TRAMITE_ADUANERO',
  codigoAduana: '',
  codigoAduanaDestino: '',
  codigoSeccion: '',
  aduanaNotificacion: '',
  jefeRevisor: '',
  seccionInfraccion: '',
  area: '',
  subarea: '',
  tieneReclamoAsociado: false,
  norma: '',
  fundamento: '',
  descripcionHechos: '',
  denunciaAsociada: '',
  mercanciaId: '',
  rutDeudor: '',
  nombreDeudor: '',
  cuentas: [],
  infractores: [],
  documentosAduaneros: [],
  observaciones: '',
};

const toInputDate = (fecha: string): string => {
  if (!fecha) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  const partes = fecha.split('-');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return fecha;
};

export const CargoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const denunciaIdParam = searchParams.get('denunciaId');
  const reclamoIdParam = searchParams.get('reclamoId');
  
  const isEditing = !!id;
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CargoFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModalCuenta, setShowModalCuenta] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [cuentaEditando] = useState<CargoCuenta | undefined>();
  
  const allNotifications = getTodasLasNotificaciones();
  
  // Cargar cargo existente si es edición
  useEffect(() => {
    if (id) {
      const cargo = getCargoPorId(id);
      if (cargo) {
        setFormData({
          numeroInterno: cargo.numeroInterno || '',
          fechaGeneracion: toInputDate(cargo.fechaGeneracion || ''),
          fechaOcurrencia: toInputDate(cargo.fechaOcurrencia || ''),
          fechaIngreso: toInputDate(cargo.fechaIngreso),
          origen: cargo.origen || 'TRAMITE_ADUANERO',
          codigoAduana: cargo.codigoAduana || '',
          codigoAduanaDestino: cargo.codigoAduanaDestino || '',
          codigoSeccion: cargo.codigoSeccion || '',
          aduanaNotificacion: cargo.codigoAduanaDestino || cargo.codigoAduana || '',
          jefeRevisor: '',
          seccionInfraccion: '',
          area: '',
          subarea: '',
          tieneReclamoAsociado: false,
          norma: cargo.norma || '',
          fundamento: cargo.fundamento || '',
          descripcionHechos: cargo.descripcionHechos || '',
          denunciaAsociada: cargo.denunciaAsociada || '',
          mercanciaId: cargo.mercanciaId || '',
          rutDeudor: cargo.rutDeudor,
          nombreDeudor: cargo.nombreDeudor,
          cuentas: cargo.cuentas || [],
          infractores: cargo.infractores || [],
          documentosAduaneros: cargo.documentosAduaneros || [],
          observaciones: cargo.observaciones || '',
        });
      }
    }
  }, [id]);
  
  // Precargar datos si viene de una denuncia
  useEffect(() => {
    if (denunciaIdParam && !isEditing) {
      const denuncia = getDenunciaPorId(denunciaIdParam);
      if (denuncia) {
        setFormData(prev => ({
          ...prev,
          origen: 'DENUNCIA',
          denunciaAsociada: denuncia.id,
          fechaIngreso: toInputDate(denuncia.fechaIngreso),
          codigoAduana: aduanas.find(a => a.nombre === denuncia.aduana)?.codigo || denuncia.aduana,
          codigoSeccion: denuncia.seccion || '',
          aduanaNotificacion: aduanas.find(a => a.nombre === denuncia.aduanaEmision)?.codigo || '',
          seccionInfraccion: denuncia.tipoInfraccion || '',
          tieneReclamoAsociado: !!(denuncia.reclamosAsociados && denuncia.reclamosAsociados.length > 0),
          rutDeudor: denuncia.rutDeudor,
          nombreDeudor: denuncia.nombreDeudor,
          descripcionHechos: denuncia.descripcionHechos || '',
          mercanciaId: denuncia.mercanciaId || '',
          // Precargar involucrados como infractores
          infractores: denuncia.involucrados?.map((inv, idx) => ({
            id: `temp-${idx}`,
            idInvolucrado: inv.id,
            rut: inv.rut,
            nombre: inv.nombre,
            tipoInfractor: inv.tipoInvolucrado,
            direccion: inv.direccion,
            email: inv.email,
            telefono: inv.telefono,
            esPrincipal: inv.esPrincipal,
            porcentajeResponsabilidad: inv.esPrincipal ? 100 : 0,
          })) || [],
        }));
      }
    }
  }, [denunciaIdParam, isEditing]);

  // Precargar datos si viene del módulo de Reclamos
  useEffect(() => {
    if (reclamoIdParam && !isEditing) {
      const reclamo = getReclamoPorId(reclamoIdParam);
      if (reclamo) {
        setFormData(prev => ({
          ...prev,
          origen: 'OTRO',
          tieneReclamoAsociado: true, // Automático desde módulo Reclamos
          rutDeudor: reclamo.rutReclamante,
          nombreDeudor: reclamo.reclamante,
        }));
      }
    }
  }, [reclamoIdParam, isEditing]);
  
  // Calcular total de cuentas
  const totalCuentas = useMemo(() => {
    return formData.cuentas.reduce((sum, c) => sum + c.monto, 0);
  }, [formData.cuentas]);
  
  // Secciones filtradas por aduana
  const seccionesFiltradas = useMemo(() => {
    if (!formData.codigoAduana) return [];
    return secciones.filter(s => s.aduanaCodigo === formData.codigoAduana);
  }, [formData.codigoAduana]);
  
  // Denuncia asociada
  const denunciaAsociada = useMemo(() => {
    if (!formData.denunciaAsociada) return null;
    return getDenunciaPorId(formData.denunciaAsociada);
  }, [formData.denunciaAsociada]);

  const buildObservaciones = useMemo(() => {
    const meta = [
      formData.aduanaNotificacion && `Aduana Notificación: ${formData.aduanaNotificacion}`,
      formData.seccionInfraccion && `Sección infracción: ${formData.seccionInfraccion}`,
      formData.area && `Área: ${formData.area}`,
      formData.subarea && `Subárea: ${formData.subarea}`,
      formData.jefeRevisor && `Jefe revisor: ${formData.jefeRevisor}`,
      formData.tieneReclamoAsociado ? 'Reclamo asociado (desde módulo Reclamos)' : '',
    ].filter(Boolean).join(' | ');
    return [formData.observaciones || '', meta].filter(Boolean).join(' • ');
  }, [
    formData.aduanaNotificacion,
    formData.seccionInfraccion,
    formData.area,
    formData.subarea,
    formData.jefeRevisor,
    formData.tieneReclamoAsociado,
    formData.observaciones,
  ]);
  
  // Handlers
  const handleChange = (field: keyof CargoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleAgregarCuenta = (cuenta: Omit<CargoCuenta, 'id'>) => {
    const nuevaCuenta: CargoCuenta = {
      ...cuenta,
      id: `cuenta-${Date.now()}`,
    };
    setFormData(prev => ({
      ...prev,
      cuentas: [...prev.cuentas, nuevaCuenta],
    }));
    setShowModalCuenta(false);
  };
  
  const handleEliminarCuenta = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cuentas: prev.cuentas.filter(c => c.id !== id),
    }));
  };
  
  const handleAgregarInfractor = () => {
    const nuevoInfractor: CargoInfractor = {
      id: `infractor-${Date.now()}`,
      idInvolucrado: '',
      rut: '',
      nombre: '',
      tipoInfractor: 'Infractor Principal',
      esPrincipal: formData.infractores.length === 0,
      porcentajeResponsabilidad: formData.infractores.length === 0 ? 100 : 0,
    };
    setFormData(prev => ({
      ...prev,
      infractores: [...prev.infractores, nuevoInfractor],
    }));
  };
  
  const handleEliminarInfractor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      infractores: prev.infractores.filter(i => i.id !== id),
    }));
  };
  
  const handleUpdateInfractor = (id: string, field: keyof CargoInfractor, value: any) => {
    setFormData(prev => ({
      ...prev,
      infractores: prev.infractores.map(i => 
        i.id === id ? { ...i, [field]: value } : i
      ),
    }));
  };
  
  // Validación
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Datos generales
        if (!formData.codigoAduana) newErrors.codigoAduana = 'Seleccione una aduana';
        if (!formData.fechaGeneracion) newErrors.fechaGeneracion = 'Ingrese fecha de emisión';
        if (!formData.rutDeudor) newErrors.rutDeudor = 'Ingrese RUT del deudor';
        if (!formData.nombreDeudor) newErrors.nombreDeudor = 'Ingrese nombre del deudor';
        break;
        
      case 1: // Tipificación
        if (!formData.norma) newErrors.norma = 'Seleccione una norma';
        if (!formData.fundamento) newErrors.fundamento = 'Seleccione un fundamento';
        if (!formData.descripcionHechos) newErrors.descripcionHechos = 'Ingrese descripción de hechos';
        break;
        
      case 2: // Cuentas
        if (formData.cuentas.length === 0) {
          newErrors.cuentas = 'Debe agregar al menos una cuenta de cargo';
        }
        break;
        
      case 3: // Infractores
        if (formData.infractores.length === 0) {
          newErrors.infractores = 'Debe agregar al menos un infractor';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleGuardarBorrador = () => {
    // Guardar como borrador
    const cargoData: Partial<Cargo> = {
      numeroInterno: formData.numeroInterno,
      fechaGeneracion: formData.fechaGeneracion,
      fechaOcurrencia: formData.fechaOcurrencia,
      fechaIngreso: formData.fechaIngreso,
      origen: formData.origen,
      codigoAduana: formData.codigoAduana,
      aduana: aduanas.find(a => a.codigo === formData.codigoAduana)?.nombre || formData.codigoAduana,
      codigoSeccion: formData.codigoSeccion,
      norma: formData.norma,
      fundamento: formData.fundamento,
      descripcionHechos: formData.descripcionHechos,
      denunciaAsociada: formData.denunciaAsociada,
      denunciaNumero: denunciaAsociada?.numeroDenuncia,
      mercanciaId: formData.mercanciaId,
      rutDeudor: formData.rutDeudor,
      nombreDeudor: formData.nombreDeudor,
      cuentas: formData.cuentas,
      infractores: formData.infractores,
      documentosAduaneros: formData.documentosAduaneros,
      observaciones: buildObservaciones,
      montoTotal: formatMonto(totalCuentas),
      estado: 'Borrador',
    };
    
    if (isEditing && id) {
      actualizarCargo(id, cargoData);
      alert('Cargo actualizado exitosamente');
    } else {
      crearCargo(cargoData);
      alert('Cargo guardado como borrador');
    }
    
    navigate(ERoutePaths.CARGOS);
  };
  
  const handleEmitir = () => {
    // Validar todos los pasos
    let allValid = true;
    for (let i = 0; i <= 3; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        allValid = false;
        break;
      }
    }
    
    if (allValid) {
      setShowModalConfirm(true);
    }
  };
  
  const confirmarGeneracion = () => {
    const cargoData: Partial<Cargo> = {
      numeroInterno: formData.numeroInterno,
      fechaGeneracion: formData.fechaGeneracion,
      fechaOcurrencia: formData.fechaOcurrencia,
      fechaIngreso: formData.fechaIngreso,
      origen: formData.origen,
      codigoAduana: formData.codigoAduana,
      aduana: aduanas.find(a => a.codigo === formData.codigoAduana)?.nombre || formData.codigoAduana,
      codigoSeccion: formData.codigoSeccion,
      norma: formData.norma,
      fundamento: formData.fundamento,
      descripcionHechos: formData.descripcionHechos,
      denunciaAsociada: formData.denunciaAsociada,
      denunciaNumero: denunciaAsociada?.numeroDenuncia,
      mercanciaId: formData.mercanciaId,
      rutDeudor: formData.rutDeudor,
      nombreDeudor: formData.nombreDeudor,
      cuentas: formData.cuentas,
      infractores: formData.infractores,
      documentosAduaneros: formData.documentosAduaneros,
      observaciones: buildObservaciones,
      montoTotal: formatMonto(totalCuentas),
      estado: 'Emitido',
    };
    
    if (isEditing && id) {
      actualizarCargo(id, cargoData);
    } else {
      crearCargo(cargoData);
    }
    
    setShowModalConfirm(false);
    alert('Cargo generado exitosamente');
    navigate(ERoutePaths.CARGOS);
  };
  
  // Steps
  const steps = [
    { id: 0, label: 'Datos Generales', icon: <Icon name="FileText" size={16} /> },
    { id: 1, label: 'Tipificación', icon: <Icon name="Scale" size={16} /> },
    { id: 2, label: 'Cuentas', icon: <Icon name="Calculator" size={16} /> },
    { id: 3, label: 'Infractores', icon: <Icon name="Users" size={16} /> },
    { id: 4, label: 'Revisión', icon: <Icon name="CheckCircle" size={16} /> },
  ];
  
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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => navigate(ERoutePaths.CARGOS)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <span className="text-sm text-gray-500">Cargos /</span>
              <span className="text-sm font-medium text-aduana-azul">
                {isEditing ? 'Editar' : 'Nuevo'} Cargo
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Cargo' : 'Crear Nuevo Cargo'}
            </h1>
            {denunciaAsociada && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <Icon name="Link" size={14} />
                Desde Denuncia: {denunciaAsociada.numeroDenuncia}
              </p>
            )}
            {denunciaAsociada && (
              <p className="text-xs text-gray-500 ml-7">
                ID denuncia: {denunciaAsociada.id}
              </p>
            )}
          </div>
          
          {/* Card resumen total */}
          <div className="bg-gradient-to-r from-aduana-azul to-blue-600 text-white rounded-lg p-4 min-w-[200px]">
            <p className="text-sm text-white/80">Total Cargo</p>
            <p className="text-2xl font-bold">{formatMonto(totalCuentas)}</p>
            <p className="text-xs text-white/60">{formData.cuentas.length} cuenta(s)</p>
          </div>
        </div>
        
        {/* Stepper */}
        <div className="card p-4">
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={(stepId) => setActiveStep(Number(stepId))}
          />
        </div>
        
        {/* Contenido del step */}
        <div className="card p-6">
          {/* Step 0: Datos Generales */}
          {activeStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-aduana-azul" />
                Datos Generales del Cargo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  label="N° Interno"
                  id="numeroInterno"
                  type="text"
                  value={formData.numeroInterno}
                  onChange={(e) => handleChange('numeroInterno', e.target.value)}
                  placeholder="INT-2024-XXXXX"
                />
                
                <InputField
                  label="Fecha Emisión *"
                  id="fechaGeneracion"
                  type="date"
                  value={formData.fechaGeneracion}
                  onChange={(e) => handleChange('fechaGeneracion', e.target.value)}
                  errorMessage={errors.fechaGeneracion}
                />
                
                <InputField
                  label="Fecha Ocurrencia"
                  id="fechaOcurrencia"
                  type="date"
                  value={formData.fechaOcurrencia}
                  onChange={(e) => handleChange('fechaOcurrencia', e.target.value)}
                />
            
            <InputField
              label="Fecha Ingreso"
              id="fechaIngreso"
              type="date"
              value={formData.fechaIngreso}
              onChange={(e) => handleChange('fechaIngreso', e.target.value)}
              disabled
            />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origen *
                  </label>
                  <select
                    value={formData.origen}
                    onChange={(e) => handleChange('origen', e.target.value)}
                    disabled={!!denunciaIdParam}
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      denunciaIdParam ? 'bg-gray-100' : ''
                    }`}
                  >
                    <option value="DENUNCIA">Denuncia</option>
                    <option value="TRAMITE_ADUANERO">Trámite Aduanero</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aduana *
                  </label>
                  <select
                    value={formData.codigoAduana}
                    onChange={(e) => {
                      handleChange('codigoAduana', e.target.value);
                      handleChange('codigoSeccion', '');
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.codigoAduana ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione aduana...</option>
                    {aduanas.map(aduana => (
                      <option key={aduana.id} value={aduana.codigo}>
                        {aduana.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.codigoAduana && (
                    <p className="text-sm text-red-500 mt-1">{errors.codigoAduana}</p>
                  )}
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aduana Notificación
                </label>
                <select
                  value={formData.aduanaNotificacion}
                  onChange={(e) => handleChange('aduanaNotificacion', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccione aduana...</option>
                  {aduanas.map(aduana => (
                    <option key={aduana.id} value={aduana.codigo}>
                      {aduana.nombre}
                    </option>
                  ))}
                </select>
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sección
                  </label>
                  <select
                    value={formData.codigoSeccion}
                    onChange={(e) => handleChange('codigoSeccion', e.target.value)}
                    disabled={!formData.codigoAduana}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccione sección...</option>
                    {seccionesFiltradas.map(seccion => (
                      <option key={seccion.id} value={seccion.codigo}>
                        {seccion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              
              <InputField
                label="Sección Infracción"
                id="seccionInfraccion"
                type="text"
                value={formData.seccionInfraccion}
                onChange={(e) => handleChange('seccionInfraccion', e.target.value)}
                placeholder="Pre-cargado desde denuncia"
              />
              
              <InputField
                label="Jefe Revisor"
                id="jefeRevisor"
                type="text"
                value={formData.jefeRevisor}
                onChange={(e) => handleChange('jefeRevisor', e.target.value)}
                placeholder="Nombre del jefe revisor"
              />
              
              <InputField
                label="Área"
                id="area"
                type="text"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="Área responsable"
              />
              
              <InputField
                label="Subárea"
                id="subarea"
                type="text"
                value={formData.subarea}
                onChange={(e) => handleChange('subarea', e.target.value)}
                placeholder="Subárea responsable"
              />
              </div>
              
              {/* Deudor */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Icon name="User" size={18} />
                  Datos del Deudor Principal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="RUT Deudor *"
                    id="rutDeudor"
                    type="text"
                    value={formData.rutDeudor}
                    onChange={(e) => handleChange('rutDeudor', e.target.value)}
                    placeholder="12.345.678-9"
                    errorMessage={errors.rutDeudor}
                    disabled={!!denunciaIdParam}
                  />
                  
                  <InputField
                    label="Nombre / Razón Social *"
                    id="nombreDeudor"
                    type="text"
                    value={formData.nombreDeudor}
                    onChange={(e) => handleChange('nombreDeudor', e.target.value)}
                    placeholder="Nombre completo"
                    errorMessage={errors.nombreDeudor}
                    disabled={!!denunciaIdParam}
                  />
                </div>
              </div>
              
              {/* Mercancía */}
              {formData.mercanciaId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <Icon name="Package" size={16} />
                      Mercancía asociada: <span className="font-medium">{formData.mercanciaId}</span>
                    </p>
                    <CustomButton
                      variant="secondary"
                      onClick={() => navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', formData.mercanciaId))}
                    >
                      <Icon name="ExternalLink" size={14} />
                      Ver mercancía
                    </CustomButton>
                  </div>
                </div>
              )}
              
              {/* Indicador de reclamo - solo lectura, se determina automáticamente */}
              {formData.tieneReclamoAsociado && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                  <Icon name="AlertCircle" size={18} className="text-amber-600" />
                  <span className="text-sm text-amber-800 font-medium">
                    Este cargo tiene reclamo(s) asociado(s)
                  </span>
                  <Badge variant="warning" size="sm">Automático</Badge>
                </div>
              )}
            </div>
          )}
          
          {/* Step 1: Tipificación */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icon name="Scale" size={20} className="text-aduana-azul" />
                Tipificación y Fundamentos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Norma *
                  </label>
                  <select
                    value={formData.norma}
                    onChange={(e) => handleChange('norma', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.norma ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione norma...</option>
                    {normasCatalogo.filter(n => n.vigente).map(norma => (
                      <option key={norma.id} value={norma.codigo}>
                        {norma.codigo} - {norma.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.norma && (
                    <p className="text-sm text-red-500 mt-1">{errors.norma}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fundamento *
                  </label>
                  <select
                    value={formData.fundamento}
                    onChange={(e) => handleChange('fundamento', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.fundamento ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione fundamento...</option>
                    {fundamentosCatalogo.filter(f => f.vigente).map(fundamento => (
                      <option key={fundamento.id} value={fundamento.codigo}>
                        {fundamento.codigo} - {fundamento.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.fundamento && (
                    <p className="text-sm text-red-500 mt-1">{errors.fundamento}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de Hechos *
                </label>
                <textarea
                  value={formData.descripcionHechos}
                  onChange={(e) => handleChange('descripcionHechos', e.target.value)}
                  rows={6}
                  placeholder="Describa detalladamente los hechos que fundamentan el cargo..."
                  className={`w-full px-4 py-2.5 border rounded-lg resize-none ${
                    errors.descripcionHechos ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.descripcionHechos && (
                  <p className="text-sm text-red-500 mt-1">{errors.descripcionHechos}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.descripcionHechos.length} caracteres
                </p>
              </div>
            </div>
          )}
          
          {/* Step 2: Cuentas */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="Calculator" size={20} className="text-aduana-azul" />
                    Cuentas de Cargo
                  </h3>
                  <p className="text-sm text-gray-500">
                    Agregue las cuentas que conforman el cargo
                  </p>
                </div>
                <CustomButton variant="primary" onClick={() => setShowModalCuenta(true)}>
                  <Icon name="Plus" size={16} />
                  Agregar Cuenta
                </CustomButton>
              </div>
              
              {errors.cuentas && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 flex items-center gap-2">
                    <Icon name="AlertCircle" size={18} />
                    {errors.cuentas}
                  </p>
                </div>
              )}
              
              {formData.cuentas.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Icon name="Calculator" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">No hay cuentas registradas</p>
                  <CustomButton variant="secondary" onClick={() => setShowModalCuenta(true)}>
                    <Icon name="Plus" size={16} />
                    Agregar primera cuenta
                  </CustomButton>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moneda</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.cuentas.map(cuenta => (
                        <tr key={cuenta.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-sm">{cuenta.codigoCuenta}</td>
                          <td className="px-4 py-3">{cuenta.nombreCuenta}</td>
                          <td className="px-4 py-3">{cuenta.moneda}</td>
                          <td className="px-4 py-3 text-right font-semibold text-aduana-azul">
                            {formatMonto(cuenta.monto)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleEliminarCuenta(cuenta.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-aduana-azul/5 border-t-2 border-aduana-azul">
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-right font-bold">TOTAL</td>
                        <td className="px-4 py-4 text-right text-xl font-bold text-aduana-azul">
                          {formatMonto(totalCuentas)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Infractores */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="Users" size={20} className="text-aduana-azul" />
                    Infractores
                  </h3>
                  <p className="text-sm text-gray-500">
                    Registre los infractores asociados al cargo
                  </p>
                </div>
                <CustomButton variant="primary" onClick={handleAgregarInfractor}>
                  <Icon name="UserPlus" size={16} />
                  Agregar Infractor
                </CustomButton>
              </div>
              
              {errors.infractores && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 flex items-center gap-2">
                    <Icon name="AlertCircle" size={18} />
                    {errors.infractores}
                  </p>
                </div>
              )}
              
              {formData.infractores.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Icon name="Users" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">No hay infractores registrados</p>
                  <CustomButton variant="secondary" onClick={handleAgregarInfractor}>
                    <Icon name="UserPlus" size={16} />
                    Agregar infractor
                  </CustomButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.infractores.map((infractor, idx) => (
                    <div key={infractor.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={infractor.esPrincipal ? 'error' : 'default'}>
                            {infractor.esPrincipal ? 'Principal' : `Infractor ${idx + 1}`}
                          </Badge>
                        </div>
                        <button
                          onClick={() => handleEliminarInfractor(infractor.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          label="RUT *"
                          id={`rut-${infractor.id}`}
                          type="text"
                          value={infractor.rut}
                          onChange={(e) => handleUpdateInfractor(infractor.id, 'rut', e.target.value)}
                          placeholder="12.345.678-9"
                        />
                        
                        <InputField
                          label="Nombre *"
                          id={`nombre-${infractor.id}`}
                          type="text"
                          value={infractor.nombre}
                          onChange={(e) => handleUpdateInfractor(infractor.id, 'nombre', e.target.value)}
                          placeholder="Nombre completo"
                        />
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo Infractor
                          </label>
                          <select
                            value={infractor.tipoInfractor}
                            onChange={(e) => handleUpdateInfractor(infractor.id, 'tipoInfractor', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                          >
                            <option value="Infractor Principal">Infractor Principal</option>
                            <option value="Infractor Secundario">Infractor Secundario</option>
                            <option value="Responsable Solidario">Responsable Solidario</option>
                            <option value="Agente de Aduanas">Agente de Aduanas</option>
                            <option value="Importador">Importador</option>
                            <option value="Exportador">Exportador</option>
                            <option value="Transportista">Transportista</option>
                          </select>
                        </div>
                        
                        <InputField
                          label="% Responsabilidad"
                          id={`resp-${infractor.id}`}
                          type="number"
                          value={infractor.porcentajeResponsabilidad?.toString() || ''}
                          onChange={(e) => handleUpdateInfractor(infractor.id, 'porcentajeResponsabilidad', Number(e.target.value))}
                          placeholder="0-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Revisión */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icon name="CheckCircle" size={20} className="text-aduana-azul" />
                Revisión del Cargo
              </h3>
              
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Datos Generales</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="text-gray-500">Origen:</span> {formData.origen}</p>
                    <p><span className="text-gray-500">Aduana:</span> {aduanas.find(a => a.codigo === formData.codigoAduana)?.nombre || '-'}</p>
                    <p><span className="text-gray-500">Fecha Emisión:</span> {formData.fechaGeneracion}</p>
                    <p><span className="text-gray-500">Deudor:</span> {formData.nombreDeudor} ({formData.rutDeudor})</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Tipificación</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="text-gray-500">Norma:</span> {formData.norma || '-'}</p>
                    <p><span className="text-gray-500">Fundamento:</span> {formData.fundamento || '-'}</p>
                  </div>
                </div>
              </div>
              
              {/* Total */}
              <div className="bg-gradient-to-r from-aduana-azul to-blue-600 text-white rounded-lg p-6 text-center">
                <p className="text-white/80">Total del Cargo</p>
                <p className="text-4xl font-bold mt-2">{formatMonto(totalCuentas)}</p>
                <p className="text-white/60 mt-1">
                  {formData.cuentas.length} cuenta(s) • {formData.infractores.length} infractor(es)
                </p>
              </div>
              
              {/* Validaciones */}
              {formData.cuentas.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-amber-500" />
                  <p className="text-amber-700">No se puede generar cargo sin cuentas de cargo</p>
                </div>
              )}
              
              {formData.infractores.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-amber-500" />
                  <p className="text-amber-700">Debe registrar al menos un infractor</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Navegación */}
        <div className="flex items-center justify-between">
          <CustomButton 
            variant="secondary"
            onClick={() => navigate(ERoutePaths.CARGOS)}
          >
            <Icon name="X" size={16} />
            Cancelar
          </CustomButton>
          
          <div className="flex gap-3">
            {activeStep > 0 && (
              <CustomButton variant="secondary" onClick={handleBack}>
                <Icon name="ArrowLeft" size={16} />
                Anterior
              </CustomButton>
            )}
            
            {activeStep < 4 ? (
              <CustomButton variant="primary" onClick={handleNext}>
                Siguiente
                <Icon name="ArrowRight" size={16} />
              </CustomButton>
            ) : (
              <>
                <CustomButton variant="secondary" onClick={handleGuardarBorrador}>
                  <Icon name="Save" size={16} />
                  Guardar Borrador
                </CustomButton>
                <CustomButton 
                  variant="primary" 
                  onClick={handleEmitir}
                  disabled={formData.cuentas.length === 0 || formData.infractores.length === 0}
                >
                  <Icon name="Send" size={16} />
                  Emitir Cargo
                </CustomButton>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal agregar cuenta */}
      <ModalAgregarCuenta
        isOpen={showModalCuenta}
        onClose={() => setShowModalCuenta(false)}
        onSave={handleAgregarCuenta}
        cuentaEditar={cuentaEditando}
      />
      
      {/* Modal confirmación emisión */}
      <ModalConfirmacion
        isOpen={showModalConfirm}
        onClose={() => setShowModalConfirm(false)}
        onConfirm={confirmarGeneracion}
        title="Confirmar Generación de Cargo"
        message={`¿Está seguro que desea generar este cargo por ${formatMonto(totalCuentas)}?\n\nEsta acción cambiará el estado a "Generado" y no podrá ser revertida.`}
        confirmText="Generar Cargo"
        confirmVariant="primary"
      />
    </CustomLayout>
  );
};

export default CargoForm;

