import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Users, CheckCircle, AlertCircle, Bell, Gift, Star } from 'lucide-react';
import { mockDevelopers, mockProperties } from '../data/mockData';
import { mockLeads, mockBookings, mockTodayReminders, mockNotifications, mockPromotions } from '../data/mockData';
import SearchFilters from '../components/SearchFilters';
import DeveloperCard from '../components/DeveloperCard';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDeveloperClick = (developerId: string) => {
    navigate(`/developer/${developerId}`);
  };

  const unreadNotifications = mockNotifications.filter(n => !n.isRead && n.targetRole === 'agent');
  const activePromotions = mockPromotions.filter(p => p.isActive && new Date(p.validUntil) > new Date());

  // Calculate dashboard stats
  const leadsByStage = {
    new: mockLeads.filter(l => l.stage === 'New').length,
    contacted: mockLeads.filter(l => l.stage === 'Contacted').length,
    siteVisit: mockLeads.filter(l => l.stage === 'Site Visit').length,
    negotiation: mockLeads.filter(l => l.stage === 'Negotiation').length,
    closed: mockLeads.filter(l => l.stage === 'Closed').length
  };

  const bookingsByStage = {
    token: mockBookings.filter(b => b.stage === 'Token').length,
    agreement: mockBookings.filter(b => b.stage === 'Agreement').length,
    closure: mockBookings.filter(b => b.stage === 'Final Closure').length
  };

  const todayReminders = mockTodayReminders.filter(r => !r.isCompleted);
  const overdueReminders = mockTodayReminders.filter(r => 
    new Date(r.dueDate + ' ' + r.dueTime) < new Date() && !r.isCompleted
  );

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Hero Section */}
      <div className="bg-white pb-12">
        <div className="pt-16 pb-8 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-extra-wide text-primary-600 font-montserrat mb-4">
            PROPERTY AGENT
            <div className="w-32 h-1 bg-gradient-to-r from-accent-gold to-primary-600 mx-auto mt-3 rounded-full"></div>
          </h1>
          <p className="text-neutral-500 font-montserrat text-lg font-light">
            Discover • Manage • Book Properties in Real-Time
          </p>
        </div>
        
        {/* Search Filters */}
        <SearchFilters />
      </div>

      {/* Notifications & Promotions */}
      <div className="px-4 py-6">
        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Notifications</h3>
              <span className="text-sm text-primary-600 font-montserrat">
                {unreadNotifications.length} new
              </span>
            </div>
            
            <div className="space-y-3">
              {unreadNotifications.slice(0, 2).map((notification) => (
                <div key={notification.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-neutral-800 font-montserrat mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-neutral-600 font-montserrat mb-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-neutral-500 font-montserrat">
                        {notification.createdAt}
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {unreadNotifications.length > 2 && (
              <button 
                onClick={() => navigate('/notifications')}
                className="w-full text-center py-2 text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
              >
                View all {unreadNotifications.length} notifications
              </button>
            )}
          </div>
        )}

        {/* Active Promotions */}
        {activePromotions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Active Promotions</h3>
              <button 
                onClick={() => navigate('/promotions')}
                className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {activePromotions.slice(0, 2).map((promotion) => {
                const property = mockProperties.find(p => p.id === promotion.propertyId);
                return (
                  <div key={promotion.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-accent-gold bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-accent-gold" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-800 font-montserrat mb-1">
                          {promotion.title}
                        </h4>
                        <p className="text-sm text-neutral-600 font-montserrat mb-2">
                          {promotion.message}
                        </p>
                        {property && (
                          <p className="text-xs text-primary-600 font-montserrat mb-2">
                            {property.name} • {property.location}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500 font-montserrat">
                            Valid until {new Date(promotion.validUntil).toLocaleDateString()}
                          </span>
                          <button 
                            onClick={() => navigate(`/property/${promotion.propertyId}`)}
                            className="text-primary-600 text-xs font-medium font-montserrat hover:text-primary-700"
                          >
                            View Property
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Developer Results */}
      <div className="px-4 py-8 pb-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
            Featured Developers
          </h2>
          <p className="text-neutral-500 font-montserrat text-sm">
            Discover properties from India's leading developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockDevelopers.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              onClick={() => handleDeveloperClick(developer.id)}
            />
          ))}
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default LandingPage;