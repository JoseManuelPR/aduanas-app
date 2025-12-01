/**
 * GiroForm - Formulario para crear/editar giros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from '../../constants/sidebar-menu';
import CustomLayout from '../../Layout/Layout';
import { CustomButton } from '../../components/Button/Button';
import InputField from '../../organisms/InputField/InputField';
import { Badge } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import {
  getCargoPorId,
  getDenunciaPorId,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  crearGiro,
  formatMonto,
  type Giro,
  type GiroCuenta,
  type TipoGiro,
  type OrigenGiro,
} from '../../data';

// Interfaz para el formulario
interface GiroFormData {
  tipoGiro: TipoGiro;
  origenGiro: OrigenGiro;
  entidadOrigenId: string;
  numeroEntidadOrigen: string;
  fechaEmision: string;
  fechaVencimiento: string;
  plazo: number;
  diaHabil: boolean;
  emitidoA: string;
  rutDeudor: string;
  direccionDeudor: string;
  emailDeudor: string;
  codigoAduana: string;
  cuentas: GiroCuenta[];
  observaciones: string;
}

const initialFormData: GiroFormData = {
  tipoGiro: 'F09',
  origenGiro: 'MANUAL',
  entidadOrigenId: '',
  numeroEntidadOrigen: '',
  fechaEmision: new Date().toISOString().split('T')[0],
  fechaVencimiento: '',
  plazo: 30,
  diaHabil: true,
  emitidoA: '',
  rutDeudor: '',
  direccionDeudor: '',
  emailDeudor: '',
  codigoAduana: '',
  cuentas: [],
  observaciones: '',
};

export const GiroForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cargoIdParam = searchParams.get('cargoId');
  const denunciaIdParam = searchParams.get('denunciaId');
  
  const [formData, setFormData] = useState<GiroFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const allNotifications = getTodasLasNotificaciones();
  
  // Precargar datos si viene de un cargo
  useEffect(() => {
    if (cargoIdParam) {
      const cargo = getCargoPorId(cargoIdParam);
      if (cargo) {
        // Calcular fecha de vencimiento
        const fechaEmision = new Date();
        const fechaVencimiento = new Date(fechaEmision);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
        
        setFormData({
          tipoGiro: 'F09',
          origenGiro: 'CARGO',
          entidadOrigenId: cargo.id,
          numeroEntidadOrigen: cargo.numeroCargo,
          fechaEmision: fechaEmision.toISOString().split('T')[0],
          fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
          plazo: 30,
          diaHabil: true,
          emitidoA: cargo.nombreDeudor,
          rutDeudor: cargo.rutDeudor,
          direccionDeudor: cargo.infractores?.[0]?.direccion || '',
          emailDeudor: cargo.infractores?.[0]?.email || '',
          codigoAduana: cargo.codigoAduana || '',
          cuentas: cargo.cuentas?.map((c, idx) => ({
            id: `gc-new-${idx}`,
            codigoCuenta: c.codigoCuenta,
            nombreCuenta: c.nombreCuenta,
            monto: c.monto,
            moneda: c.moneda,
            orden: c.orden,
          })) || [],
          observaciones: `Giro generado desde Cargo ${cargo.numeroCargo}`,
        });
      }
    }
  }, [cargoIdParam]);
  
  // Precargar datos si viene de una denuncia
  useEffect(() => {
    if (denunciaIdParam) {
      const denuncia = getDenunciaPorId(denunciaIdParam);
      if (denuncia) {
        const fechaEmision = new Date();
        const fechaVencimiento = new Date(fechaEmision);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
        
        // Crear cuentas basadas en los montos de la denuncia
        const cuentas: GiroCuenta[] = [];
        if (denuncia.montoDerechos) {
          cuentas.push({
            id: 'gc-new-1',
            codigoCuenta: '101',
            nombreCuenta: 'Derechos Aduaneros',
            monto: denuncia.montoDerechos,
            moneda: 'CLP',
            orden: 1,
          });
        }
        if (denuncia.multa) {
          cuentas.push({
            id: 'gc-new-2',
            codigoCuenta: '201',
            nombreCuenta: 'Multa',
            monto: denuncia.multa,
            moneda: 'CLP',
            orden: 2,
          });
        }
        
        setFormData({
          tipoGiro: 'F16',
          origenGiro: 'DENUNCIA',
          entidadOrigenId: denuncia.id,
          numeroEntidadOrigen: denuncia.numeroDenuncia,
          fechaEmision: fechaEmision.toISOString().split('T')[0],
          fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
          plazo: 30,
          diaHabil: true,
          emitidoA: denuncia.nombreDeudor,
          rutDeudor: denuncia.rutDeudor,
          direccionDeudor: denuncia.involucrados?.[0]?.direccion || '',
          emailDeudor: denuncia.involucrados?.[0]?.email || '',
          codigoAduana: denuncia.aduana || '',
          cuentas: cuentas,
          observaciones: `Giro generado desde Denuncia ${denuncia.numeroDenuncia}`,
        });
      }
    }
  }, [denunciaIdParam]);
  
  // Calcular total de cuentas
  const totalCuentas = useMemo(() => {
    return formData.cuentas.reduce((sum, c) => sum + c.monto, 0);
  }, [formData.cuentas]);
  
  // Calcular fecha de vencimiento automáticamente
  useEffect(() => {
    if (formData.fechaEmision && formData.plazo > 0) {
      const fechaEmision = new Date(formData.fechaEmision);
      const fechaVencimiento = new Date(fechaEmision);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + formData.plazo);
      setFormData(prev => ({
        ...prev,
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
      }));
    }
  }, [formData.fechaEmision, formData.plazo]);
  
  // Handlers
  const handleChange = (field: keyof GiroFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleAgregarCuenta = () => {
    const nuevaCuenta: GiroCuenta = {
      id: `gc-new-${Date.now()}`,
      codigoCuenta: '',
      nombreCuenta: '',
      monto: 0,
      moneda: 'CLP',
      orden: formData.cuentas.length + 1,
    };
    setFormData(prev => ({
      ...prev,
      cuentas: [...prev.cuentas, nuevaCuenta],
    }));
  };
  
  const handleEliminarCuenta = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cuentas: prev.cuentas.filter(c => c.id !== id),
    }));
  };
  
  const handleUpdateCuenta = (id: string, field: keyof GiroCuenta, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      cuentas: prev.cuentas.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };
  
  // Validación
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.emitidoA) newErrors.emitidoA = 'Ingrese el nombre del deudor';
    if (!formData.rutDeudor) newErrors.rutDeudor = 'Ingrese el RUT del deudor';
    if (!formData.fechaEmision) newErrors.fechaEmision = 'Seleccione fecha de emisión';
    if (!formData.codigoAduana) newErrors.codigoAduana = 'Seleccione una aduana';
    if (formData.cuentas.length === 0) newErrors.cuentas = 'Debe agregar al menos una cuenta';
    if (totalCuentas <= 0) newErrors.total = 'El monto total debe ser mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleEmitir = () => {
    if (validate()) {
      setShowConfirmModal(true);
    }
  };
  
  const confirmarEmision = () => {
    const aduana = aduanas.find(a => a.codigo === formData.codigoAduana);
    
    const giroData: Partial<Giro> = {
      tipoGiro: formData.tipoGiro,
      origenGiro: formData.origenGiro,
      entidadOrigenId: formData.entidadOrigenId || undefined,
      numeroEntidadOrigen: formData.numeroEntidadOrigen || undefined,
      fechaEmision: formData.fechaEmision,
      fechaVencimiento: formData.fechaVencimiento,
      plazo: formData.plazo,
      diaHabil: formData.diaHabil,
      emitidoA: formData.emitidoA,
      rutDeudor: formData.rutDeudor,
      direccionDeudor: formData.direccionDeudor || undefined,
      emailDeudor: formData.emailDeudor || undefined,
      aduana: aduana?.nombre,
      codigoAduana: formData.codigoAduana,
      montoTotal: formatMonto(totalCuentas),
      montoTotalNumero: totalCuentas,
      montoPagado: 0,
      saldoPendiente: totalCuentas,
      cuentas: formData.cuentas,
      pagos: [],
      observaciones: formData.observaciones || undefined,
      estado: 'Emitido',
      diasVencimiento: formData.plazo,
      ...(formData.origenGiro === 'CARGO' && {
        cargoAsociado: formData.entidadOrigenId,
        cargoNumero: formData.numeroEntidadOrigen,
      }),
      ...(formData.origenGiro === 'DENUNCIA' && {
        denunciaAsociada: formData.entidadOrigenId,
        denunciaNumero: formData.numeroEntidadOrigen,
      }),
    };
    
    crearGiro(giroData);
    setShowConfirmModal(false);
    alert('Giro emitido exitosamente');
    navigate(ERoutePaths.GIROS);
  };
  
  // Obtener info del tipo de giro
  const getTipoGiroInfo = (tipo: TipoGiro) => {
    switch (tipo) {
      case 'F09': return { color: 'bg-blue-100 text-blue-800 border-blue-300', desc: 'Giro desde Cargo' };
      case 'F16': return { color: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Giro desde Denuncia' };
      case 'F17': return { color: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'Otros Giros' };
    }
  };
  
  return (
    <CustomLayout
      platformName="DECARE"
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
                onClick={() => navigate(ERoutePaths.GIROS)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <span className="text-sm text-gray-500">Giros /</span>
              <span className="text-sm font-medium text-aduana-azul">Emitir Giro</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Emitir Nuevo Giro</h1>
            {formData.origenGiro !== 'MANUAL' && formData.numeroEntidadOrigen && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <Icon name="Link" size={14} />
                Desde {formData.origenGiro === 'CARGO' ? 'Cargo' : 'Denuncia'}: {formData.numeroEntidadOrigen}
              </p>
            )}
          </div>
          
          {/* Card resumen total */}
          <div className={`rounded-lg p-4 min-w-[200px] border ${getTipoGiroInfo(formData.tipoGiro).color}`}>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={formData.tipoGiro === 'F09' ? 'info' : formData.tipoGiro === 'F16' ? 'warning' : 'default'}>
                {formData.tipoGiro}
              </Badge>
              <span className="text-sm">{getTipoGiroInfo(formData.tipoGiro).desc}</span>
            </div>
            <p className="text-2xl font-bold">{formatMonto(totalCuentas)}</p>
            <p className="text-xs opacity-75">{formData.cuentas.length} cuenta(s)</p>
          </div>
        </div>
        
        {/* Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos Generales */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-aduana-azul" />
                Datos Generales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Giro *
                  </label>
                  <select
                    value={formData.tipoGiro}
                    onChange={(e) => handleChange('tipoGiro', e.target.value as TipoGiro)}
                    disabled={formData.origenGiro !== 'MANUAL'}
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      formData.origenGiro !== 'MANUAL' ? 'bg-gray-100' : ''
                    }`}
                  >
                    <option value="F09">F09 - Desde Cargo</option>
                    <option value="F16">F16 - Desde Denuncia</option>
                    <option value="F17">F17 - Otros</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aduana *
                  </label>
                  <select
                    value={formData.codigoAduana}
                    onChange={(e) => handleChange('codigoAduana', e.target.value)}
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
                
                <InputField
                  label="Fecha Emisión *"
                  id="fechaEmision"
                  type="date"
                  value={formData.fechaEmision}
                  onChange={(e) => handleChange('fechaEmision', e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plazo (días)
                    </label>
                    <input
                      type="number"
                      value={formData.plazo}
                      onChange={(e) => handleChange('plazo', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vencimiento
                    </label>
                    <input
                      type="date"
                      value={formData.fechaVencimiento}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Deudor */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="User" size={20} className="text-aduana-azul" />
                Datos del Deudor
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Emitido A (Nombre) *"
                  id="emitidoA"
                  type="text"
                  value={formData.emitidoA}
                  onChange={(e) => handleChange('emitidoA', e.target.value)}
                  placeholder="Nombre o razón social"
                  errorMessage={errors.emitidoA}
                />
                
                <InputField
                  label="RUT *"
                  id="rutDeudor"
                  type="text"
                  value={formData.rutDeudor}
                  onChange={(e) => handleChange('rutDeudor', e.target.value)}
                  placeholder="12.345.678-9"
                  errorMessage={errors.rutDeudor}
                />
                
                <InputField
                  label="Dirección"
                  id="direccionDeudor"
                  type="text"
                  value={formData.direccionDeudor}
                  onChange={(e) => handleChange('direccionDeudor', e.target.value)}
                  placeholder="Dirección del deudor"
                />
                
                <InputField
                  label="Email"
                  id="emailDeudor"
                  type="email"
                  value={formData.emailDeudor}
                  onChange={(e) => handleChange('emailDeudor', e.target.value)}
                  placeholder="correo@ejemplo.cl"
                />
              </div>
            </div>
            
            {/* Cuentas */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="Calculator" size={20} className="text-aduana-azul" />
                  Cuentas del Giro
                </h3>
                <CustomButton variant="secondary" onClick={handleAgregarCuenta}>
                  <Icon name="Plus" size={16} />
                  Agregar Cuenta
                </CustomButton>
              </div>
              
              {errors.cuentas && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <Icon name="AlertCircle" size={18} className="text-red-500" />
                  <p className="text-sm text-red-700">{errors.cuentas}</p>
                </div>
              )}
              
              {formData.cuentas.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Icon name="Calculator" size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No hay cuentas agregadas</p>
                  <CustomButton variant="secondary" className="mt-3" onClick={handleAgregarCuenta}>
                    <Icon name="Plus" size={16} />
                    Agregar cuenta
                  </CustomButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.cuentas.map((cuenta, idx) => (
                    <div key={cuenta.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-500 w-6">{idx + 1}</span>
                      <input
                        type="text"
                        value={cuenta.codigoCuenta}
                        onChange={(e) => handleUpdateCuenta(cuenta.id, 'codigoCuenta', e.target.value)}
                        placeholder="Código"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={cuenta.nombreCuenta}
                        onChange={(e) => handleUpdateCuenta(cuenta.id, 'nombreCuenta', e.target.value)}
                        placeholder="Nombre de la cuenta"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="relative w-40">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={cuenta.monto || ''}
                          onChange={(e) => handleUpdateCuenta(cuenta.id, 'monto', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold"
                        />
                      </div>
                      <button
                        onClick={() => handleEliminarCuenta(cuenta.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Total */}
                  <div className="flex items-center justify-end gap-4 pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-aduana-azul">
                      {formatMonto(totalCuentas)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Observaciones */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="MessageSquare" size={20} className="text-aduana-azul" />
                Observaciones
              </h3>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Observaciones adicionales del giro..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
              />
            </div>
          </div>
          
          {/* Columna lateral - Resumen */}
          <div className="space-y-6">
            {/* Card de resumen */}
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Resumen del Giro</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Tipo</span>
                  <Badge variant={formData.tipoGiro === 'F09' ? 'info' : formData.tipoGiro === 'F16' ? 'warning' : 'default'}>
                    {formData.tipoGiro}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Origen</span>
                  <span className="font-medium">
                    {formData.origenGiro === 'CARGO' ? 'Cargo' : 
                     formData.origenGiro === 'DENUNCIA' ? 'Denuncia' : 'Manual'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Cuentas</span>
                  <span className="font-medium">{formData.cuentas.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Plazo</span>
                  <span className="font-medium">{formData.plazo} días</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Vencimiento</span>
                  <span className="font-medium">{formData.fechaVencimiento || '-'}</span>
                </div>
                
                <div className="pt-4 border-t-2 border-aduana-azul">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total a Emitir</span>
                    <span className="text-2xl font-bold text-aduana-azul">
                      {formatMonto(totalCuentas)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="mt-6 space-y-3">
                <CustomButton 
                  variant="primary" 
                  className="w-full"
                  onClick={handleEmitir}
                  disabled={totalCuentas <= 0}
                >
                  <Icon name="Send" size={16} />
                  Emitir Giro
                </CustomButton>
                <CustomButton 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate(ERoutePaths.GIROS)}
                >
                  Cancelar
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowConfirmModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-aduana-azul/10 flex items-center justify-center mb-4">
                  <Icon name="Receipt" size={24} className="text-aduana-azul" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Confirmar Emisión de Giro</h3>
                <p className="text-gray-600 mb-4">
                  ¿Está seguro que desea emitir este giro por <strong>{formatMonto(totalCuentas)}</strong>?
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  El giro será emitido a nombre de <strong>{formData.emitidoA}</strong>
                </p>
                <div className="flex gap-3">
                  <CustomButton 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancelar
                  </CustomButton>
                  <CustomButton 
                    variant="primary" 
                    className="flex-1"
                    onClick={confirmarEmision}
                  >
                    Emitir Giro
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomLayout>
  );
};

export default GiroForm;

