import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, BarChart3, User } from 'lucide-react';

const ManagerBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/manager/dashboard' },
    { icon: Users, label: 'Agents', path: '/manager/agents' },
    { icon: ClipboardList, label: 'Leads', path: '/manager/leads' },
    { icon: BarChart3, label: 'Analytics', path: '/manager/analytics' },
    { icon: User, label: 'Profile', path: '/manager/profile' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active
                  ? 'text-primary-600'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={active ? 2 : 1.5} />
              <span className={`text-xs font-montserrat ${active ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ManagerBottomNavigation;
