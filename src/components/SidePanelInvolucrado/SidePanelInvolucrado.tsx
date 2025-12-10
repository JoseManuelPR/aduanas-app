/**
 * SidePanelInvolucrado - Panel lateral para seleccionar/ver involucrados
 * Se usa desde Denuncias, Cargos, Giros, Reclamos
 */

import React, { useState, useMemo, ChangeEvent } from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../UI';
import {
  involucrados,
  buscarInvolucrados,
  getInvolucradoPorId,
  formatRut,
  type Involucrado,
  type TipoInvolucrado,
} from '../../data';
import {
  TIPOS_IDENTIFICACION_DTTA,
  getPlaceholderPorTipoId,
  type TipoIdentificacionDTTA,
} from '../../constants/tipos-identificacion';

interface SidePanelInvolucradoProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (involucrado: Involucrado, tipoInvolucrado?: TipoInvolucrado) => void;
  selectedId?: string;
  mode?: 'select' | 'view'; // select = seleccionar, view = solo ver ficha
  tipoInvolucradoDefault?: TipoInvolucrado;
}

const tiposInvolucrado: { value: TipoInvolucrado; label: string }[] = [
  { value: 'Infractor Principal', label: 'Infractor Principal' },
  { value: 'Infractor Secundario', label: 'Infractor Secundario' },
  { value: 'Responsable Solidario', label: 'Responsable Solidario' },
  { value: 'Agente de Aduanas', label: 'Agente de Aduanas' },
  { value: 'Importador', label: 'Importador' },
  { value: 'Exportador', label: 'Exportador' },
  { value: 'Transportista', label: 'Transportista' },
];

export const SidePanelInvolucrado: React.FC<SidePanelInvolucradoProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedId,
  mode = 'select',
  tipoInvolucradoDefault = 'Infractor Principal',
}) => {
  const [tipoIdBusqueda, setTipoIdBusqueda] = useState<TipoIdentificacionDTTA | ''>('');
  const [numeroIdBusqueda, setNumeroIdBusqueda] = useState('');
  const [textoLibre, setTextoLibre] = useState('');
  const [selectedInvolucrado, setSelectedInvolucrado] = useState<Involucrado | null>(() => {
    if (selectedId) return getInvolucradoPorId(selectedId) || null;
    return null;
  });
  const [tipoInvolucrado, setTipoInvolucrado] = useState<TipoInvolucrado>(tipoInvolucradoDefault);
  const [showFicha, setShowFicha] = useState(mode === 'view');

  // Filtrar involucrados activos
  const involucradosFiltrados = useMemo(() => {
    const activos = involucrados.filter(i => i.estado === 'Activo');
    const base = textoLibre.trim()
      ? buscarInvolucrados(textoLibre).filter(i => i.estado === 'Activo')
      : activos;

    const normalizarId = (valor: string) => valor.replace(/\./g, '').replace(/-/g, '').toUpperCase();

    return base.filter(i => {
      if (tipoIdBusqueda && i.tipoIdentificacion !== tipoIdBusqueda) return false;
      if (tipoIdBusqueda && numeroIdBusqueda) {
        const idInv = normalizarId(`${i.numeroIdentificacion}${i.digitoVerificador || ''}`);
        if (!idInv.includes(normalizarId(numeroIdBusqueda))) return false;
      }
      return true;
    });
  }, [textoLibre, tipoIdBusqueda, numeroIdBusqueda]);

  const handleSelect = (inv: Involucrado) => {
    setSelectedInvolucrado(inv);
    setShowFicha(true);
  };

  const handleConfirm = () => {
    if (selectedInvolucrado && onSelect) {
      onSelect(selectedInvolucrado, tipoInvolucrado);
      onClose();
    }
  };

  const getRutFormateado = (inv: Involucrado): string => {
    if (inv.tipoIdentificacion === 'RUT') {
      return formatRut(`${inv.numeroIdentificacion}${inv.digitoVerificador || ''}`);
    }
    return inv.numeroIdentificacion;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="flex-1 bg-black/30" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-aduana-azul px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <Icon name="X" size={24} />
            </button>
            <h2 className="text-lg font-semibold text-white">
              {mode === 'view' ? 'Ficha del Involucrado' : showFicha ? 'Datos del Involucrado' : 'Seleccionar Involucrado'}
            </h2>
          </div>
          {showFicha && mode === 'select' && (
            <button
              onClick={() => {
                setShowFicha(false);
                setSelectedInvolucrado(null);
              }}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1"
            >
              <Icon name="ArrowLeft" size={16} />
              Volver
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!showFicha ? (
            // Lista de involucrados
            <div className="p-4 space-y-4">
              {/* Búsqueda */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documento de identidad</label>
                  <div className="flex gap-2">
                    <select
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                      value={tipoIdBusqueda}
                      onChange={(e) => {
                        const valor = e.target.value as TipoIdentificacionDTTA | '';
                        setTipoIdBusqueda(valor);
                        if (!valor) setNumeroIdBusqueda('');
                      }}
                    >
                      <option value="">Tipo ID</option>
                      {TIPOS_IDENTIFICACION_DTTA.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder={getPlaceholderPorTipoId(tipoIdBusqueda)}
                      disabled={!tipoIdBusqueda}
                      value={numeroIdBusqueda}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNumeroIdBusqueda(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona el tipo de documento y luego ingresa el número.
                  </p>
                </div>

                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={textoLibre}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTextoLibre(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Lista */}
              <div className="space-y-2">
                {involucradosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Icon name="Users" size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No se encontraron involucrados.</p>
                  </div>
                ) : (
                  involucradosFiltrados.map(inv => (
                    <div
                      key={inv.id}
                      onClick={() => handleSelect(inv)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedInvolucrado?.id === inv.id 
                          ? 'border-aduana-azul bg-aduana-azul-50 ring-1 ring-aduana-azul' 
                          : 'border-gray-200 hover:border-aduana-azul/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 truncate">{inv.nombreCompleto}</p>
                            <Badge variant={inv.tipoPersona === 'Jurídica' ? 'info' : 'default'} className="text-xs">
                              {inv.tipoPersona === 'Jurídica' ? 'Empresa' : 'Natural'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 font-mono">{getRutFormateado(inv)}</p>
                          {inv.email && (
                            <p className="text-sm text-gray-400 truncate">{inv.email}</p>
                          )}
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={16} className="flex-shrink-0 mt-0.5" />
                  <p>
                    Mostrando solo involucrados activos. Para agregar uno nuevo, 
                    vaya a <span className="font-medium">Configuraciones → Involucrados</span>.
                  </p>
                </div>
              </div>
            </div>
          ) : selectedInvolucrado && (
            // Ficha del involucrado
            <div className="p-4 space-y-6">
              {/* Encabezado ficha */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedInvolucrado.tipoPersona === 'Jurídica' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    <Icon 
                      name={selectedInvolucrado.tipoPersona === 'Jurídica' ? 'Building' : 'User'} 
                      size={24} 
                      className={selectedInvolucrado.tipoPersona === 'Jurídica' ? 'text-blue-600' : 'text-gray-600'}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedInvolucrado.nombreCompleto}</h3>
                    <p className="text-sm text-gray-500 font-mono">{getRutFormateado(selectedInvolucrado)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={selectedInvolucrado.tipoPersona === 'Jurídica' ? 'info' : 'default'}>
                    {selectedInvolucrado.tipoPersona}
                  </Badge>
                  <Badge variant="success" dot>{selectedInvolucrado.estado}</Badge>
                </div>
              </div>
              
              {/* Datos de contacto */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  Contacto
                </h4>
                <div className="space-y-2 text-sm">
                  {selectedInvolucrado.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-20">Email:</span>
                      <span className="text-aduana-azul">{selectedInvolucrado.email}</span>
                    </div>
                  )}
                  {selectedInvolucrado.telefono && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-20">Teléfono:</span>
                      <span>{selectedInvolucrado.telefono}</span>
                    </div>
                  )}
                  {selectedInvolucrado.nacionalidad && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-20">País:</span>
                      <span>{selectedInvolucrado.nacionalidad}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Direcciones */}
              {selectedInvolucrado.direcciones.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Icon name="MapPin" size={16} />
                    Direcciones
                  </h4>
                  <div className="space-y-2">
                    {selectedInvolucrado.direcciones.map((dir, idx) => (
                      <div key={dir.id || idx} className="bg-gray-50 rounded p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={dir.esPrincipal ? 'info' : 'default'} className="text-xs">
                            {dir.tipoDireccion}
                          </Badge>
                          {dir.esPrincipal && <span className="text-xs text-aduana-azul">Principal</span>}
                        </div>
                        <p>{dir.direccion}</p>
                        <p className="text-gray-500">{dir.comuna}, {dir.region}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Representante legal (si aplica) */}
              {selectedInvolucrado.tipoPersona === 'Jurídica' && selectedInvolucrado.representanteLegalNombre && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Icon name="User" size={16} />
                    Representante Legal
                  </h4>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <p className="font-medium">{selectedInvolucrado.representanteLegalNombre}</p>
                    {selectedInvolucrado.representanteLegalRut && (
                      <p className="text-gray-500 font-mono">{selectedInvolucrado.representanteLegalRut}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Tipo de involucrado (solo en modo select) */}
              {mode === 'select' && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Icon name="Tag" size={16} />
                    Tipo de Involucrado
                  </h4>
                  <select
                    value={tipoInvolucrado}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setTipoInvolucrado(e.target.value as TipoInvolucrado)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  >
                    {tiposInvolucrado.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Observaciones */}
              {selectedInvolucrado.observaciones && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Icon name="MessageSquare" size={16} />
                    Observaciones
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                    {selectedInvolucrado.observaciones}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {mode === 'select' && showFicha && selectedInvolucrado && (
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setShowFicha(false);
                setSelectedInvolucrado(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark flex items-center gap-2"
            >
              <Icon name="Check" size={18} />
              Seleccionar
            </button>
          </div>
        )}
        
        {mode === 'view' && (
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanelInvolucrado;

