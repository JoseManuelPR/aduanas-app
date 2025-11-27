import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  badgeVariant?: 'default' | 'danger' | 'info' | 'warning' | 'success';
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'boxed';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const getTabClasses = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-aduana-azul text-white'
          : 'bg-transparent text-gray-600 hover:bg-gray-100';
      case 'boxed':
        return isActive
          ? 'bg-white text-aduana-azul border-b-2 border-aduana-azul'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100';
      case 'underline':
      default:
        return isActive
          ? 'text-aduana-azul border-b-2 border-aduana-azul'
          : 'text-gray-600 border-b-2 border-transparent hover:text-aduana-azul-400 hover:border-gray-300';
    }
  };

  const containerClasses = {
    underline: 'border-b border-gray-200',
    pills: 'bg-gray-100 p-1 rounded-lg',
    boxed: 'bg-gray-50 rounded-t-lg',
  };

  return (
    <div className={className}>
      <div className={`flex gap-1 ${containerClasses[variant]}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200
              ${variant === 'pills' ? 'rounded-md' : ''}
              ${getTabClasses(activeTab === tab.id)}
            `}
          >
            {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`
                  ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full
                  ${tab.badgeVariant === 'danger' || tab.badgeVariant === 'warning'
                    ? tab.badgeVariant === 'danger' 
                      ? 'bg-aduana-rojo text-white'
                      : 'bg-amber-500 text-white'
                    : tab.badgeVariant === 'info'
                      ? 'bg-blue-500 text-white'
                      : tab.badgeVariant === 'success'
                        ? 'bg-emerald-500 text-white'
                        : activeTab === tab.id
                          ? variant === 'pills'
                            ? 'bg-white/20 text-white'
                            : 'bg-aduana-azul-50 text-aduana-azul'
                          : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 animate-fade-in">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;

