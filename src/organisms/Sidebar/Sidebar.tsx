import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { SidebarItem } from 'he-button-custom-library';

interface CustomSidebarProps {
  items: (SidebarItem & { badge?: number; badgeType?: 'default' | 'danger' })[];
  platformName?: string;
  platformLogo?: string;
  platformLogoClass?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({
  items,
  platformName = 'DECARE',
  platformLogo,
  platformLogoClass = 'h-10',
  isOpen,
  onToggle,
}) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen pt-16 transition-all duration-300
          bg-white border-r border-gray-200 shadow-sidebar
          ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'}
        `}
      >
        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 z-50 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors flex md:flex"
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo/Platform name */}
        <div className={`border-b border-gray-100 ${isOpen ? 'px-4 py-4' : 'hidden md:flex justify-center items-center py-4 px-2'}`}>
          {platformLogo ? (
            <img
              src={platformLogo}
              alt={platformName}
              className={`${platformLogoClass} ${isOpen ? '' : 'w-8 h-8 object-contain'}`}
            />
          ) : (
            <div className={`font-bold text-aduana-azul ${isOpen ? 'text-xl' : 'text-xs text-center'}`}>
              {isOpen ? platformName : platformName.substring(0, 2)}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto px-3 py-4">
          <div className="flex-1 space-y-1">
            {items.map((item, index) => {
              if (!item.to) return null;
              const isActive = location.pathname === item.to || 
                              (item.to !== '/' && location.pathname.startsWith(item.to));
              const isLogout = item.label.toLowerCase().includes('cerrar') || 
                              item.label.toLowerCase().includes('logout');

              if (isLogout) return null; // Lo renderizamos al final

              return (
                <NavLink
                  key={index}
                  to={item.to}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-aduana-azul-50 text-aduana-azul font-medium border-l-4 border-aduana-azul -ml-1 pl-[calc(0.75rem-4px)]' 
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-aduana-azul' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <>
                      <span className="flex-1 truncate text-sm">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`
                            px-2 py-0.5 text-xs font-semibold rounded-full
                            ${item.badgeType === 'danger' 
                              ? 'bg-aduana-rojo text-white animate-pulse' 
                              : 'bg-aduana-azul-100 text-aduana-azul'}
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!isOpen && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`
                        absolute right-2 top-2 w-2 h-2 rounded-full pointer-events-none
                        ${item.badgeType === 'danger' ? 'bg-aduana-rojo animate-pulse' : 'bg-aduana-azul'}
                      `}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Logout button at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {items.filter(item => 
              item.to && (item.label.toLowerCase().includes('cerrar') || 
              item.label.toLowerCase().includes('logout'))
            ).map((item, index) => (
              <NavLink
                key={`logout-${index}`}
                to={item.to!}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  text-gray-600 hover:bg-red-50 hover:text-aduana-rojo
                `}
              >
                <span className="flex-shrink-0 text-gray-500">{item.icon}</span>
                {isOpen && <span className="flex-1 truncate text-sm">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Version info */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              DECARE v3.16.0
            </p>
            <p className="text-xs text-gray-400 text-center">
              © 2024 Servicio Nacional de Aduanas
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default CustomSidebar;

