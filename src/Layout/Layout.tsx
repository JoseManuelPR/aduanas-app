import { useState } from "react";
import { Header } from 'he-button-custom-library'
import type { SidebarItem } from 'he-button-custom-library'
import CustomSidebar from "../organisms/Sidebar/Sidebar";
import IMAGE_PLATFORM from "../assets/images";
import { NotificationDropdown, NotificationItem } from "../components/NotificationDropdown";
import { Chatbot } from "../components/Chatbot";


interface LayoutProps {
  children: React.ReactNode;
  user: {
    initials: string;
    name: string;
    email: string;
    role: string;
  };
  options: { label: string; onClick: () => void }[];
  sidebarItems: SidebarItem[];
  onLogout: () => void;
  platformName?: string;
  notifications?: NotificationItem[];
}

const CustomLayout = ({ children, user, options, sidebarItems, onLogout, platformName = "ARKHO UI", notifications = [] }: LayoutProps) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  
  // Calcular notificaciones sin leer
  const unreadCount = notifications.filter(n => !n.leido).length;
  
  return (

    <div className="min-h-screen max-w-screen flex flex-col bg-white ">
      <div className="relative">
        <Header
          showThemeToggle={false}
          user={user}
          options={options}
          onLogout={onLogout}
        />
        {/* Notification dropdown positioned absolutely over header */}
        <div className="absolute top-1/2 right-28 -translate-y-1/2 z-50">
          <NotificationDropdown 
            notifications={notifications} 
            unreadCount={unreadCount}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <CustomSidebar
          items={sidebarItems}
          platformName={platformName}
          platformLogo={IMAGE_PLATFORM.ADUANA_LOGO}
          platformLogoClass="h-10"
          isOpen={openSidebar}
          onToggle={() => setOpenSidebar(!openSidebar)}
        />
        <main className={`
            flex-1 p-6 overflow-y-auto transition-all duration-300 
            ${openSidebar ? "md:ml-64" : "md:ml-16"} 
          `}>
          {children}
        </main>
      </div>
      
      {/* Floating Chatbot - Available on all pages */}
      <Chatbot />
    </div>
  );
}

export default CustomLayout;