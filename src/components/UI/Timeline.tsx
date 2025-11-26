import React from 'react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  user?: string;
  status?: 'completed' | 'current' | 'pending' | 'error';
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusConfig = {
  completed: {
    dotClass: 'bg-emerald-500',
    lineClass: 'bg-emerald-200',
    textClass: 'text-emerald-700',
    icon: (
      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  current: {
    dotClass: 'bg-aduana-azul',
    lineClass: 'bg-aduana-azul-200',
    textClass: 'text-aduana-azul',
    icon: (
      <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="4" />
      </svg>
    ),
  },
  pending: {
    dotClass: 'bg-gray-300',
    lineClass: 'bg-gray-200',
    textClass: 'text-gray-500',
    icon: null,
  },
  error: {
    dotClass: 'bg-aduana-rojo',
    lineClass: 'bg-red-200',
    textClass: 'text-aduana-rojo',
    icon: (
      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => {
        const config = statusConfig[item.status || 'pending'];
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative pl-8 pb-6 last:pb-0">
            {/* Línea vertical */}
            {!isLast && (
              <div
                className={`absolute left-[11px] top-6 w-0.5 h-full ${config.lineClass}`}
              />
            )}

            {/* Punto/Icono */}
            <div
              className={`
                absolute left-0 top-1 w-6 h-6 rounded-full ${config.dotClass}
                flex items-center justify-center ring-4 ring-white
              `}
            >
              {item.icon || config.icon}
            </div>

            {/* Contenido */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className={`font-semibold ${config.textClass}`}>
                  {item.title}
                </h4>
                {item.status === 'current' && (
                  <span className="text-xs font-medium bg-aduana-azul-50 text-aduana-azul px-2 py-0.5 rounded-full">
                    Actual
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                  </svg>
                  {item.date}
                </span>
                {item.time && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>
                    {item.time}
                  </span>
                )}
                {item.user && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                    {item.user}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;

