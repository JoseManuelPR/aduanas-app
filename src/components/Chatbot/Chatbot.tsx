/**
 * Chatbot Asistente - Componente Principal
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Funcionalidades:
 * - Floating button disponible en todas las páginas
 * - Consulta de trazabilidad (denuncias, hallazgos, giros, reclamos)
 * - Sugerencia de base legal según descripción de infracción
 * - Conteo de denuncias por rango de fechas con navegación a BI
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';

import type { 
  ChatMessage, 
  ChatbotProps, 
  QuickAction,
  IntentMatch,
  TraceabilityResponse,
  LegalSuggestionResponse,
  StatisticsResponse,
} from './types';

import {
  normativeCatalog,
  welcomeQuickActions,
  traceabilityQuickActions,
  legalQuickActions,
  statisticsQuickActions,
  dateRangeQuickActions,
  notFoundQuickActions,
  chatbotMessages,
  intentKeywords,
  entityPatterns,
  mockTraceabilityExtras,
  generateMessageId,
} from './chatbotData';

import {
  denuncias,
  getDenunciaPorNumero,
  hallazgos,
  getHallazgoPorNumero,
  giros,
  getGiroPorNumero,
  reclamos,
  getReclamoPorNumero,
  getConteoDenuncias,
} from '../../data';

import { ERoutePaths } from '../../routes/routes';

// ============================================
// COMPONENTE: Floating Button
// ============================================

interface FloatingButtonProps {
  isOpen: boolean;
  hasUnread: boolean;
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ isOpen, hasUnread, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        ${isOpen 
          ? 'bg-gray-600 hover:bg-gray-700 rotate-0' 
          : 'bg-aduana-azul hover:bg-aduana-azul-600 hover:scale-110'
        }
      `}
      aria-label={isOpen ? 'Cerrar chat' : 'Abrir asistente'}
    >
      {isOpen ? (
        <Icon name="X" size={24} className="text-white" />
      ) : (
        <>
          <Icon name="MessageCircle" size={24} className="text-white" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center">
              <span className="absolute inline-flex h-5 w-5 rounded-full bg-aduana-rojo opacity-75 animate-ping"></span>
              <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-aduana-rojo text-white text-xs font-bold">
                1
              </span>
            </span>
          )}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-aduana-azul-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            IA
          </span>
        </>
      )}
    </button>
  );
};

// ============================================
// COMPONENTE: Message Bubble
// ============================================

interface MessageBubbleProps {
  message: ChatMessage;
  onQuickAction: (action: QuickAction) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onQuickAction }) => {
  const isBot = message.sender === 'bot';
  
  const renderContent = () => {
    // Parse markdown-like syntax for bold and italic
    const formatText = (text: string) => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.+?)_/g, '<em class="text-gray-500">$1</em>')
        .replace(/\n/g, '<br/>');
    };

    return (
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
      />
    );
  };

  const renderTraceability = () => {
    if (!message.traceabilityData) return null;
    const data = message.traceabilityData;

    if (!data.found) {
      return (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-800 text-sm">{message.content}</p>
        </div>
      );
    }

    return (
      <div className="mt-3 space-y-3">
        {/* Estado principal */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${data.summary.estado === 'Cerrada' ? 'bg-emerald-100 text-emerald-700' :
                data.summary.estado === 'En Revisión' ? 'bg-blue-100 text-blue-700' :
                data.summary.estado === 'Formulada' ? 'bg-purple-100 text-purple-700' :
                data.summary.estado === 'Notificada' ? 'bg-indigo-100 text-indigo-700' :
                data.summary.estado === 'Observada' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }
            `}>
              {data.summary.estado}
            </span>
            <span className="text-xs text-gray-500">{data.summary.fecha}</span>
          </div>
          <p className="text-sm text-gray-700">
            Registrada en <strong>{data.summary.aduana}</strong>
            {data.summary.responsable && ` por ${data.summary.responsable}`}
          </p>
        </div>

        {/* Detalles */}
        {data.details.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {data.details.map((detail, idx) => (
              <div key={idx} className="p-2 bg-white rounded border border-gray-100">
                <p className="text-xs text-gray-500">{detail.label}</p>
                <p className="text-sm font-medium text-gray-800">{detail.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Entidades relacionadas */}
        {data.relatedEntities && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
              <Icon name="Link" size={12} />
              Información asociada
            </p>
            <div className="space-y-1 text-sm text-blue-700">
              {data.relatedEntities.hallazgos && (
                <p>📋 <strong>Hallazgos:</strong> {data.relatedEntities.hallazgos.summary}</p>
              )}
              {data.relatedEntities.giros && (
                <p>💰 <strong>Giros:</strong> {data.relatedEntities.giros.summary}</p>
              )}
              {data.relatedEntities.reclamos && (
                <p>📝 <strong>Reclamos:</strong> {data.relatedEntities.reclamos.summary}</p>
              )}
              {data.relatedEntities.mercancias && (
                <p>📦 <strong>Mercancías:</strong> {data.relatedEntities.mercancias.summary}</p>
              )}
            </div>
          </div>
        )}

        {/* Acciones críticas */}
        {data.criticalActions && data.criticalActions.length > 0 && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
              <Icon name="AlertTriangle" size={12} />
              Acciones críticas pendientes
            </p>
            <ul className="space-y-1">
              {data.criticalActions.map((action) => (
                <li key={action.id} className="text-sm text-amber-700 flex items-start gap-2">
                  <span className={`
                    mt-1 w-2 h-2 rounded-full flex-shrink-0
                    ${action.priority === 'alta' ? 'bg-red-500' : 
                      action.priority === 'media' ? 'bg-amber-500' : 'bg-blue-500'}
                  `}></span>
                  <span>
                    {action.description}
                    {action.deadline && (
                      <span className="text-xs text-amber-600 ml-1">
                        (antes del {action.deadline})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendación IA */}
        {data.aiRecommendation && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <p className="text-xs font-semibold text-purple-800 mb-1 flex items-center gap-1">
              <Icon name="Sparkles" size={12} />
              Recomendación IA
            </p>
            <p className="text-sm text-purple-700 italic">{data.aiRecommendation}</p>
          </div>
        )}
      </div>
    );
  };

  const renderLegalSuggestion = () => {
    if (!message.legalSuggestion) return null;
    const data = message.legalSuggestion;

    return (
      <div className="mt-3 space-y-3">
        <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-aduana-azul flex items-center justify-center flex-shrink-0">
              <Icon name="Scale" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Base Legal Sugerida</p>
              <p className="font-bold text-gray-900 mt-1">
                {data.suggestion.norma} – {data.suggestion.articulo}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-md border border-gray-100">
            <p className="text-sm font-semibold text-gray-800">
              {data.suggestion.articulo} – "{data.suggestion.descripcionBreve}"
            </p>
            {data.suggestion.sancion && (
              <p className="text-xs text-gray-600 mt-2">
                <strong>Sanción sugerida (demo):</strong> {data.suggestion.sancion}
              </p>
            )}
          </div>

          <div className="mt-3 p-3 bg-emerald-50 rounded-md border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800 mb-1">¿Por qué este artículo?</p>
            <p className="text-sm text-emerald-700">{data.suggestion.explicacion}</p>
          </div>

          {data.alternativeArticles && data.alternativeArticles.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Artículos alternativos:</p>
              <div className="flex flex-wrap gap-2">
                {data.alternativeArticles.map((alt) => (
                  <span 
                    key={alt.codigo}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {alt.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    if (!message.statisticsData) return null;
    const data = message.statisticsData;

    return (
      <div className="mt-3 space-y-3">
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-emerald-600 uppercase tracking-wide">{data.period.label}</p>
              <p className="text-3xl font-bold text-emerald-700">{data.total}</p>
              <p className="text-sm text-emerald-600">denuncias registradas</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Icon name="FileText" size={24} className="text-emerald-600" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-2">Período: {data.period.from} al {data.period.to}</p>

          <div className="space-y-2 mt-3">
            <p className="text-xs font-semibold text-gray-700">Desagregación por estado:</p>
            {data.breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    item.color === 'green' ? 'bg-emerald-500' :
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'yellow' ? 'bg-amber-500' :
                    item.color === 'red' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`}></span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuickActions = () => {
    if (!message.quickActions || message.quickActions.length === 0) return null;

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {message.quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onQuickAction(action)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 hover:scale-105
              ${action.variant === 'primary' 
                ? 'bg-aduana-azul text-white hover:bg-aduana-azul-600 shadow-sm' 
                : action.variant === 'ghost'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-white text-aduana-azul border border-aduana-azul-200 hover:bg-aduana-azul-50'
              }
            `}
          >
            {action.icon && <Icon name={action.icon as any} size={14} />}
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-slide-up`}>
      <div className={`
        max-w-[85%] rounded-2xl px-4 py-3
        ${isBot 
          ? 'bg-white border border-gray-200 shadow-sm rounded-bl-md' 
          : 'bg-aduana-azul text-white rounded-br-md'
        }
      `}>
        {message.metadata?.isTyping ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        ) : (
          <>
            {renderContent()}
            {message.type === 'traceability' && renderTraceability()}
            {message.type === 'legal_suggestion' && renderLegalSuggestion()}
            {message.type === 'statistics' && renderStatistics()}
            {isBot && renderQuickActions()}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE: Chat Window
// ============================================

interface ChatWindowProps {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: QuickAction) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  messages,
  isTyping,
  onClose,
  onSendMessage,
  onQuickAction,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={`
      fixed bottom-24 right-6 z-40
      w-[400px] h-[600px] max-h-[80vh]
      bg-white rounded-2xl shadow-2xl
      flex flex-col overflow-hidden
      border border-gray-200
      transition-all duration-300 ease-out
      ${isOpen 
        ? 'opacity-100 scale-100 translate-y-0' 
        : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
      }
    `}>
      {/* Header */}
      <div className="bg-gradient-to-r from-aduana-azul to-aduana-azul-700 text-white px-5 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Bot" size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Asistente DECARE</h3>
              <p className="text-xs text-white/80">Consulta estados, normativas y estadísticas</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-white/90">En línea (demo)</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onQuickAction={onQuickAction}
          />
        ))}
        {isTyping && (
          <MessageBubble
            message={{
              id: 'typing',
              sender: 'bot',
              type: 'text',
              content: '',
              timestamp: new Date(),
              metadata: { isTyping: true },
            }}
            onQuickAction={() => {}}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ej: ¿Cuál es el estado de la denuncia 993519?"
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-aduana-azul-200 focus:bg-white transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-200
              ${inputValue.trim() && !isTyping
                ? 'bg-aduana-azul text-white hover:bg-aduana-azul-600 shadow-md hover:shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL: Chatbot
// ============================================

export const Chatbot: React.FC<ChatbotProps> = ({
  currentPage,
  currentEntityId,
  currentEntityType,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'bot',
      type: 'welcome',
      content: chatbotMessages.welcome,
      timestamp: new Date(),
      quickActions: welcomeQuickActions,
    };
    setMessages([welcomeMessage]);
  }, []);

  // Context-aware message when page changes
  useEffect(() => {
    if (!isOpen || messages.length <= 1) return;

    // Check if we're on a specific denuncia page
    const denunciaMatch = location.pathname.match(/\/denuncias\/(\d+)/);
    if (denunciaMatch) {
      const contextMessage: ChatMessage = {
        id: generateMessageId(),
        sender: 'bot',
        type: 'text',
        content: chatbotMessages.contextDenuncia(denunciaMatch[1]),
        timestamp: new Date(),
        quickActions: [
          {
            id: 'qa-ctx-trace',
            label: 'Ver trazabilidad de esta denuncia',
            action: `trace_denuncia_${denunciaMatch[1]}`,
            icon: 'Search',
            variant: 'primary',
          },
        ],
      };
      // Only add if not already added
      const alreadyHasContext = messages.some(m => m.content.includes(denunciaMatch[1]) && m.type === 'text');
      if (!alreadyHasContext) {
        setMessages(prev => [...prev, contextMessage]);
      }
    }

    // Check if we're on BI/reports page
    if (location.pathname.includes('/reportes') || location.pathname.includes('/indicadores')) {
      const alreadyHasBIContext = messages.some(m => m.content.includes('módulo de BI'));
      if (!alreadyHasBIContext) {
        const biContextMessage: ChatMessage = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: chatbotMessages.contextBI,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, biContextMessage]);
      }
    }
  }, [location.pathname, isOpen]);

  // ============================================
  // INTENT RECOGNITION
  // ============================================

  const detectIntent = useCallback((input: string): IntentMatch => {
    const lowerInput = input.toLowerCase();
    let bestMatch: IntentMatch = {
      intent: 'unknown',
      confidence: 0,
      entities: {},
    };

    // Check for entity IDs first
    const denunciaMatch = input.match(entityPatterns.denuncia) || input.match(entityPatterns.denunciaSimple);
    const hallazgoMatch = input.match(entityPatterns.hallazgo);
    const giroMatch = input.match(entityPatterns.giro);
    const reclamoMatch = input.match(entityPatterns.reclamo);

    // Extract entities
    if (denunciaMatch) {
      bestMatch.entities.id = denunciaMatch[1];
      bestMatch.entities.type = 'denuncia';
    } else if (hallazgoMatch) {
      bestMatch.entities.id = `PFI-${hallazgoMatch[1]}`;
      bestMatch.entities.type = 'hallazgo';
    } else if (giroMatch) {
      bestMatch.entities.id = giroMatch[1].toUpperCase();
      bestMatch.entities.type = 'giro';
    } else if (reclamoMatch) {
      bestMatch.entities.id = reclamoMatch[1].toUpperCase();
      bestMatch.entities.type = 'reclamo';
    }

    // Match intents by keywords
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      const matchedKeywords = keywords.filter(kw => lowerInput.includes(kw));
      const confidence = matchedKeywords.length / keywords.length;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent: intent as any,
          confidence,
          entities: bestMatch.entities,
        };
      }
    }

    // Override intent based on entities
    if (bestMatch.entities.id) {
      if (bestMatch.entities.type === 'denuncia') bestMatch.intent = 'traceability_denuncia';
      else if (bestMatch.entities.type === 'hallazgo') bestMatch.intent = 'traceability_hallazgo';
      else if (bestMatch.entities.type === 'giro') bestMatch.intent = 'traceability_giro';
      else if (bestMatch.entities.type === 'reclamo') bestMatch.intent = 'traceability_reclamo';
      bestMatch.confidence = Math.max(bestMatch.confidence, 0.8);
    }

    // Check for legal suggestion intent (description-based)
    if (bestMatch.intent === 'unknown' || bestMatch.intent === 'legal_suggestion') {
      const legalKeywords = ['infracción', 'mercancía', 'declarar', 'falso', 'documento', 'oculto', 'contrabando', 'subfacturación'];
      const hasLegalContext = legalKeywords.some(kw => lowerInput.includes(kw));
      if (hasLegalContext && input.length > 30) {
        bestMatch.intent = 'legal_suggestion';
        bestMatch.entities.description = input;
        bestMatch.confidence = 0.7;
      }
    }

    // Default fallbacks
    if (bestMatch.confidence < 0.2) {
      if (lowerInput.includes('hola') || lowerInput.includes('buenos') || lowerInput.includes('hi')) {
        bestMatch.intent = 'greeting';
        bestMatch.confidence = 0.9;
      } else if (lowerInput.includes('ayuda') || lowerInput.includes('help')) {
        bestMatch.intent = 'help';
        bestMatch.confidence = 0.9;
      }
    }

    return bestMatch;
  }, []);

  // ============================================
  // RESPONSE GENERATORS
  // ============================================

  const generateTraceabilityResponse = useCallback((entityId: string, entityType: string): { message: ChatMessage } => {
    let traceData: TraceabilityResponse | null = null;
    let content = '';

    if (entityType === 'denuncia') {
      const denuncia = getDenunciaPorNumero(entityId);
      
      if (denuncia) {
        const extras = mockTraceabilityExtras[entityId as keyof typeof mockTraceabilityExtras];
        
        traceData = {
          found: true,
          entityType: 'denuncia',
          entityId: denuncia.numeroDenuncia,
          summary: {
            numero: denuncia.numeroDenuncia,
            estado: denuncia.estado,
            fecha: denuncia.fechaIngreso,
            responsable: denuncia.loginFuncionario,
            aduana: denuncia.aduana,
          },
          details: [
            { label: 'Tipo', value: denuncia.tipoDenuncia },
            { label: 'Infracción', value: denuncia.tipoInfraccion },
            { label: 'Monto Estimado', value: denuncia.montoEstimado },
            { label: 'Deudor', value: denuncia.nombreDeudor },
          ],
          relatedEntities: {
            hallazgos: extras?.hallazgos ? {
              count: extras.hallazgos.length,
              summary: extras.hallazgos.map(h => `${h.numero} (${h.estado})`).join(', '),
            } : denuncia.hallazgoOrigen ? {
              count: 1,
              summary: `${denuncia.hallazgoOrigen} (origen)`,
            } : undefined,
            giros: (denuncia.girosAsociados?.length || 0) > 0 || extras?.giros ? {
              count: extras?.giros?.length || denuncia.girosAsociados?.length || 0,
              summary: extras?.giros 
                ? extras.giros.map(g => `${g.numero} (${g.estado})`).join(', ')
                : `${denuncia.girosAsociados?.length} giro(s) asociado(s)`,
            } : undefined,
            reclamos: (denuncia.reclamosAsociados?.length || 0) > 0 || extras?.reclamos ? {
              count: extras?.reclamos?.length || denuncia.reclamosAsociados?.length || 0,
              summary: extras?.reclamos
                ? extras.reclamos.map(r => `${r.numero} (${r.estado})`).join(', ')
                : `${denuncia.reclamosAsociados?.length} reclamo(s) en evaluación`,
            } : undefined,
            mercancias: extras?.mercancias ? {
              count: extras.mercancias.length,
              summary: `${extras.mercancias.length} partidas arancelarias asociadas`,
            } : undefined,
          },
          criticalActions: extras?.criticalActions,
          aiRecommendation: extras?.aiRecommendation,
        };

        content = `La denuncia **${denuncia.numeroDenuncia}** se encuentra en estado: **${denuncia.estado}**.`;
      } else {
        traceData = {
          found: false,
          entityType: 'denuncia',
          entityId,
          summary: { numero: entityId, estado: '', fecha: '' },
          details: [],
        };
        content = chatbotMessages.notFound(entityId);
      }
    } else if (entityType === 'hallazgo') {
      const hallazgo = getHallazgoPorNumero(entityId);
      
      if (hallazgo) {
        traceData = {
          found: true,
          entityType: 'hallazgo',
          entityId: hallazgo.numeroHallazgo,
          summary: {
            numero: hallazgo.numeroHallazgo,
            estado: hallazgo.estado,
            fecha: hallazgo.fechaIngreso,
            responsable: hallazgo.funcionarioAsignado,
            aduana: hallazgo.aduana,
          },
          details: [
            { label: 'Tipo', value: hallazgo.tipoHallazgo },
            { label: 'Involucrado', value: hallazgo.nombreInvolucrado },
            { label: 'Monto Estimado', value: hallazgo.montoEstimado },
            { label: 'Días Vencimiento', value: `${hallazgo.diasVencimiento} días` },
          ],
        };
        content = `El hallazgo **${hallazgo.numeroHallazgo}** se encuentra en estado: **${hallazgo.estado}**.`;
      } else {
        content = chatbotMessages.notFound(entityId);
      }
    }

    return {
      message: {
        id: generateMessageId(),
        sender: 'bot',
        type: 'traceability',
        content,
        timestamp: new Date(),
        traceabilityData: traceData || undefined,
        quickActions: traceData?.found ? [
          {
            id: 'qa-detail',
            label: 'Ver detalle completo',
            action: 'view_detail',
            icon: 'FileText',
            variant: 'primary',
            navigateTo: `/denuncias/${entityId}`,
          },
          {
            id: 'qa-bi',
            label: 'Ver en Dashboard BI',
            action: 'navigate_bi',
            icon: 'BarChart2',
            variant: 'secondary',
            navigateTo: '/reportes',
            filters: { denuncia: entityId },
          },
        ] : notFoundQuickActions,
      },
    };
  }, []);

  const generateLegalSuggestionResponse = useCallback((description: string): { message: ChatMessage } => {
    const lowerDesc = description.toLowerCase();
    
    // Find best matching article
    let bestMatch: typeof normativeCatalog[0] | null = null;
    let bestScore = 0;

    for (const entry of normativeCatalog) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (lowerDesc.includes(keyword)) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    // Default to Art. 174 if no match
    if (!bestMatch || bestScore === 0) {
      bestMatch = normativeCatalog.find(n => n.articulo === 'Art. 174') || normativeCatalog[0];
    }

    // Find alternatives
    const alternatives = normativeCatalog
      .filter(n => n.id !== bestMatch?.id)
      .map(n => {
        let score = 0;
        for (const keyword of n.keywords) {
          if (lowerDesc.includes(keyword)) score += 1;
        }
        return { ...n, score };
      })
      .filter(n => n.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const legalSuggestion: LegalSuggestionResponse = {
      recognized: true,
      description: description.substring(0, 100),
      suggestion: {
        norma: bestMatch.nombreNorma,
        articulo: bestMatch.articulo,
        articuloNumero: bestMatch.articulo.replace('Art. ', ''),
        descripcionBreve: bestMatch.descripcionBreve,
        sancion: bestMatch.sancionTipica,
        explicacion: `Esto se alinea con tu caso porque describes ${bestMatch.tipoInfraccion[0].toLowerCase()}, que corresponde a la conducta tipificada en este artículo.`,
      },
      confidence: Math.min(bestScore / 3, 1),
      alternativeArticles: alternatives.map(a => ({
        codigo: a.articulo,
        nombre: a.descripcionBreve,
        relevancia: a.score / bestScore,
      })),
    };

    return {
      message: {
        id: generateMessageId(),
        sender: 'bot',
        type: 'legal_suggestion',
        content: chatbotMessages.legalRecognition(description),
        timestamp: new Date(),
        legalSuggestion,
        quickActions: legalQuickActions,
      },
    };
  }, []);

  const generateStatisticsResponse = useCallback((period?: string): { message: ChatMessage } => {
    const conteo = getConteoDenuncias();
    const today = new Date();
    
    // Mock date range
    const dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    const dateTo = today;

    const statsData: StatisticsResponse = {
      period: {
        from: dateFrom.toLocaleDateString('es-CL'),
        to: dateTo.toLocaleDateString('es-CL'),
        label: 'Noviembre 2025',
      },
      total: conteo.total,
      breakdown: [
        { label: 'Abiertas / Pendientes', value: conteo.pendientes, color: 'yellow' },
        { label: 'En Proceso', value: conteo.enProceso, color: 'blue' },
        { label: 'Cerradas', value: conteo.resueltas, color: 'green' },
      ],
      navigateTo: '/reportes',
      filters: {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      },
    };

    return {
      message: {
        id: generateMessageId(),
        sender: 'bot',
        type: 'statistics',
        content: `En el período del **${statsData.period.from}** al **${statsData.period.to}** hay **${statsData.total} denuncias** registradas (demo).`,
        timestamp: new Date(),
        statisticsData: statsData,
        quickActions: statisticsQuickActions,
      },
    };
  }, []);

  // ============================================
  // MESSAGE HANDLING
  // ============================================

  const handleSendMessage = useCallback(async (input: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'user',
      type: 'text',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Detect intent
    const intentMatch = detectIntent(input);
    let response: ChatMessage;

    switch (intentMatch.intent) {
      case 'traceability_denuncia':
      case 'traceability_hallazgo':
      case 'traceability_giro':
      case 'traceability_reclamo':
        if (intentMatch.entities.id) {
          const { message } = generateTraceabilityResponse(
            intentMatch.entities.id,
            intentMatch.entities.type || 'denuncia'
          );
          response = message;
        } else {
          response = {
            id: generateMessageId(),
            sender: 'bot',
            type: 'text',
            content: '¿Podrías indicarme el número de denuncia que deseas consultar? Por ejemplo: "Estado de la denuncia 993519"',
            timestamp: new Date(),
          };
        }
        break;

      case 'legal_suggestion':
        const { message: legalMessage } = generateLegalSuggestionResponse(
          intentMatch.entities.description || input
        );
        response = legalMessage;
        break;

      case 'statistics_count':
      case 'statistics_period':
        const { message: statsMessage } = generateStatisticsResponse();
        response = statsMessage;
        break;

      case 'help':
        response = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: chatbotMessages.help,
          timestamp: new Date(),
          quickActions: welcomeQuickActions,
        };
        break;

      case 'greeting':
        response = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: '¡Hola! ¿En qué puedo ayudarte hoy? Puedo consultar el estado de denuncias, sugerir artículos por infracción, o mostrarte estadísticas.',
          timestamp: new Date(),
          quickActions: welcomeQuickActions,
        };
        break;

      default:
        response = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: chatbotMessages.unknown,
          timestamp: new Date(),
          quickActions: welcomeQuickActions,
        };
    }

    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  }, [detectIntent, generateTraceabilityResponse, generateLegalSuggestionResponse, generateStatisticsResponse]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    switch (action.action) {
      case 'trace_denuncia':
        handleSendMessage('¿Cuál es el estado de la denuncia 993519?');
        break;
      case 'legal_suggestion':
        handleSendMessage('Se encontró mercancía sin declarar en la carga, ¿qué artículo aplica?');
        break;
      case 'stats_month':
        handleSendMessage('¿Cuántas denuncias hay este mes?');
        break;
      case 'view_detail':
        if (action.navigateTo) {
          navigate(action.navigateTo);
        }
        break;
      case 'navigate_bi':
      case 'navigate_bi_month':
        navigate(ERoutePaths.REPORTES);
        // Add message about navigation
        const navMessage: ChatMessage = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: '📊 Te he llevado al módulo de Reportes. Los filtros del chatbot han sido aplicados: **Noviembre 2025**.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, navMessage]);
        break;
      case 'main_menu':
        const menuMessage: ChatMessage = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: '¿En qué más puedo ayudarte?',
          timestamp: new Date(),
          quickActions: welcomeQuickActions,
        };
        setMessages(prev => [...prev, menuMessage]);
        break;
      case 'filter_open':
        handleSendMessage('Mostrar solo denuncias abiertas');
        break;
      case 'change_dates':
        const dateMessage: ChatMessage = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: 'Selecciona el rango de fechas que deseas consultar:',
          timestamp: new Date(),
          quickActions: dateRangeQuickActions,
        };
        setMessages(prev => [...prev, dateMessage]);
        break;
      case 'range_this_month':
        handleSendMessage('¿Cuántas denuncias hay este mes?');
        break;
      case 'range_this_year':
        handleSendMessage('¿Cuántas denuncias hay este año?');
        break;
      case 'view_norm':
        // Simulate modal or detailed view
        const normMessage: ChatMessage = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: `📖 **Detalle de la Norma**\n\nEl artículo seleccionado forma parte del marco normativo aduanero vigente. Para ver el texto completo, consulta el Compendio de Normas Aduaneras en el portal institucional.\n\n_Esta es una simulación. En producción, se abriría un modal con el detalle completo._`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, normMessage]);
        break;
      case 'use_article':
        const useArticleMessage: ChatMessage = {
          id: generateMessageId(),
          sender: 'bot',
          type: 'text',
          content: '✅ **Artículo aplicado** (simulación)\n\nEl artículo ha sido copiado al formulario de denuncia activo. Verifica la información antes de continuar.\n\n_En producción, esto pre-rellenaría el campo de artículo en el formulario._',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, useArticleMessage]);
        break;
      default:
        // Handle dynamic actions like trace_denuncia_993519
        if (action.action.startsWith('trace_denuncia_')) {
          const denunciaId = action.action.replace('trace_denuncia_', '');
          handleSendMessage(`¿Cuál es el estado de la denuncia ${denunciaId}?`);
        }
    }
  }, [navigate, handleSendMessage]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);

  return (
    <>
      <FloatingButton
        isOpen={isOpen}
        hasUnread={hasUnread}
        onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
      />
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        onClose={() => setIsOpen(false)}
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
      />
    </>
  );
};

export default Chatbot;

