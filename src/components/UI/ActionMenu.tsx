/**
 * ActionMenu - Menú contextual para acciones en tablas
 * Reduce ruido visual agrupando acciones en un dropdown
 */

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from 'he-button-custom-library';

export interface ActionMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  label?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ items, label = 'Acciones' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-center gap-1.5
          px-3 py-1.5 min-h-[36px] min-w-[36px]
          text-sm font-medium
          bg-white border border-gray-200 rounded-lg
          text-gray-700 hover:bg-gray-50 hover:border-gray-300
          focus:outline-none focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul
          transition-all duration-150
          ${isOpen ? 'bg-gray-50 border-gray-300 ring-2 ring-aduana-azul/20' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={label}
      >
        <Icon name="MoreVertical" size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 mt-1 z-50
            min-w-[160px] py-1
            bg-white rounded-lg shadow-lg
            border border-gray-200
            animate-fade-in
          "
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2
                text-sm text-left
                transition-colors duration-150
                ${item.disabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : item.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              role="menuitem"
            >
              {item.icon && <Icon name={item.icon} size={14} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
