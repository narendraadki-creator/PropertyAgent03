import React from 'react';
import { Home, FileText, Calendar, MessageCircle, User, Bell, TrendingUp, Megaphone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';

const AgentBottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = mockNotifications.filter(n => !n.isRead && n.targetRole === 'agent').length;

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: TrendingUp, label: 'Trends', path: '/market-trends', active: location.pathname === '/market-trends' },
    { icon: FileText, label: 'Leads', path: '/leads', active: location.pathname === '/leads' },
    { icon: Megaphone, label: 'Campaigns', path: '/agent/campaigns', active: location.pathname.startsWith('/agent/campaigns') },
    { icon: Bell, label: 'Alerts', path: '/notifications', active: location.pathname === '/notifications', badge: unreadCount },
    { icon: User, label: 'Profile', path: '/profile', active: location.pathname === '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-primary-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={1.5} />
              <span className="text-xs font-medium font-montserrat">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold font-montserrat rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgentBottomNavigation;