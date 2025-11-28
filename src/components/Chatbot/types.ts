/**
 * Tipos para el Chatbot Asistente - Sistema DECARE
 * Servicio Nacional de Aduanas de Chile
 */

// ============================================
// TIPOS DE MENSAJES
// ============================================

export type MessageSender = 'bot' | 'user';

export type MessageType = 
  | 'text'
  | 'traceability'
  | 'legal_suggestion'
  | 'statistics'
  | 'error'
  | 'welcome'
  | 'quick_actions';

export interface QuickAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  navigateTo?: string;
  filters?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  timestamp: Date;
  // Para mensajes de trazabilidad
  traceabilityData?: TraceabilityResponse;
  // Para sugerencias legales
  legalSuggestion?: LegalSuggestionResponse;
  // Para estadísticas
  statisticsData?: StatisticsResponse;
  // Acciones rápidas
  quickActions?: QuickAction[];
  // Metadata
  metadata?: {
    entityId?: string;
    entityType?: string;
    isError?: boolean;
    isTyping?: boolean;
  };
}

// ============================================
// RESPUESTAS DE TRAZABILIDAD
// ============================================

export interface TraceabilityResponse {
  found: boolean;
  entityType: 'denuncia' | 'hallazgo' | 'giro' | 'reclamo' | 'mercancia';
  entityId: string;
  summary: {
    numero: string;
    estado: string;
    fecha: string;
    responsable?: string;
    aduana?: string;
  };
  details: {
    label: string;
    value: string;
    icon?: string;
  }[];
  relatedEntities?: {
    hallazgos?: { count: number; summary: string };
    giros?: { count: number; summary: string };
    reclamos?: { count: number; summary: string };
    mercancias?: { count: number; summary: string };
    cargos?: { count: number; summary: string };
  };
  criticalActions?: {
    id: string;
    description: string;
    deadline?: string;
    priority: 'alta' | 'media' | 'baja';
  }[];
  aiRecommendation?: string;
}

// ============================================
// RESPUESTAS DE SUGERENCIAS LEGALES
// ============================================

export interface LegalSuggestionResponse {
  recognized: boolean;
  description: string;
  suggestion: {
    norma: string;
    articulo: string;
    articuloNumero: string;
    descripcionBreve: string;
    sancion?: string;
    explicacion: string;
  };
  confidence: number;
  alternativeArticles?: {
    codigo: string;
    nombre: string;
    relevancia: number;
  }[];
}

// ============================================
// RESPUESTAS DE ESTADÍSTICAS
// ============================================

export interface StatisticsResponse {
  period: {
    from: string;
    to: string;
    label: string;
  };
  total: number;
  breakdown: {
    label: string;
    value: number;
    color?: string;
  }[];
  navigateTo?: string;
  filters?: Record<string, string>;
}

// ============================================
// CATÁLOGO NORMATIVO MOCK
// ============================================

export interface NormativeCatalogEntry {
  id: string;
  codigoNorma: string;
  nombreNorma: string;
  articulo: string;
  descripcionBreve: string;
  tipoInfraccion: string[];
  keywords: string[];
  sancionTipica: string;
  comentarioOperativo?: string;
}

// ============================================
// INTENTS DEL CHATBOT
// ============================================

export type ChatIntent = 
  | 'traceability_denuncia'
  | 'traceability_hallazgo'
  | 'traceability_giro'
  | 'traceability_reclamo'
  | 'traceability_mercancia'
  | 'critical_actions'
  | 'legal_suggestion'
  | 'statistics_count'
  | 'statistics_period'
  | 'navigation_bi'
  | 'help'
  | 'greeting'
  | 'unknown';

export interface IntentMatch {
  intent: ChatIntent;
  confidence: number;
  entities: {
    id?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    description?: string;
  };
}

// ============================================
// CONTEXTO DEL CHATBOT
// ============================================

export interface ChatbotContext {
  currentPage?: string;
  currentEntityId?: string;
  currentEntityType?: string;
  lastIntent?: ChatIntent;
  conversationHistory: ChatMessage[];
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    estado?: string;
    aduana?: string;
  };
}

// ============================================
// PROPS DEL COMPONENTE
// ============================================

export interface ChatbotProps {
  currentPage?: string;
  currentEntityId?: string;
  currentEntityType?: string;
  onNavigate?: (path: string, filters?: Record<string, string>) => void;
}

export interface ChatbotButtonProps {
  isOpen: boolean;
  hasUnread: boolean;
  onClick: () => void;
}

export interface ChatWindowProps {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: QuickAction) => void;
}

