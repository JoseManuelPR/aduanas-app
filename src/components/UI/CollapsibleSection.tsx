import React, { useState } from 'react';
import { Icon } from "he-button-custom-library";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  iconName?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  badge?: React.ReactNode;
  priority?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  className?: string;
  headerClassName?: string;
}

/**
 * CollapsibleSection - Sección colapsable con animación suave
 * Permite reducir la densidad visual mostrando/ocultando contenido
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  iconName,
  children,
  defaultExpanded = true,
  badge,
  priority,
  className = '',
  headerClassName = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getPriorityStyles = () => {
    switch (priority) {
      case 'critical':
        return 'border-l-4 border-l-red-500 bg-red-50/30';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50/30';
      case 'medium':
        return 'border-l-4 border-l-amber-500 bg-amber-50/30';
      case 'low':
        return 'border-l-4 border-l-blue-500 bg-blue-50/30';
      case 'info':
        return 'border-l-4 border-l-aduana-azul bg-aduana-azul-50/30';
      default:
        return '';
    }
  };

  return (
    <div className={`card overflow-hidden ${getPriorityStyles()} ${className}`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between p-4 
          hover:bg-gray-50/50 transition-colors duration-200
          text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-aduana-azul-200
          ${headerClassName}
        `}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          {(icon || iconName) && (
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${priority === 'critical' ? 'bg-red-100 text-red-600' :
                priority === 'high' ? 'bg-orange-100 text-orange-600' :
                priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                priority === 'low' ? 'bg-blue-100 text-blue-600' :
                priority === 'info' ? 'bg-aduana-azul-100 text-aduana-azul' :
                'bg-gray-100 text-gray-600'
              }
            `}>
              {icon || (iconName && <Icon name={iconName as any} size={18} />)}
            </div>
          )}
          
          {/* Title */}
          <h4 className="font-semibold text-gray-900">{title}</h4>
          
          {/* Badge */}
          {badge && (
            <div className="ml-2">{badge}</div>
          )}
        </div>

        {/* Expand/Collapse Icon */}
        <div className={`
          w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center
          transition-transform duration-300
          ${isExpanded ? 'rotate-180' : 'rotate-0'}
        `}>
          <Icon name="ChevronDown" size={16} className="text-gray-500" />
        </div>
      </button>

      {/* Content - Collapsible */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;

