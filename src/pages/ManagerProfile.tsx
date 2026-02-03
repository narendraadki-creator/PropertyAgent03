import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Award, Settings, LogOut } from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerProfile: React.FC = () => {
  const navigate = useNavigate();

  const manager = {
    name: 'Sarah Williams',
    email: 'sarah.williams@propertyagent.com',
    phone: '+91 98765 00000',
    region: 'Delhi NCR & North India',
    designation: 'Sales Manager',
    teamSize: 12,
    stats: {
      totalLeads: 342,
      closedDeals: 28,
      teamConversion: 26.7,
      avgResponseTime: 3.2
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/manager/dashboard')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROFILE
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Manager Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <span className="text-primary-600 font-bold text-3xl font-montserrat">
                {manager.name.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
              {manager.name}
            </h2>
            <p className="text-neutral-600 font-montserrat mb-2">{manager.designation}</p>
            <div className="flex items-center text-neutral-500 text-sm font-montserrat">
              <Award className="w-4 h-4 mr-1" strokeWidth={1.5} />
              Managing {manager.teamSize} agents
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
              <Mail className="w-5 h-5 text-neutral-400 mr-3" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-xs text-neutral-500 font-montserrat">Email</div>
                <div className="text-sm font-medium text-neutral-800 font-montserrat">{manager.email}</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
              <Phone className="w-5 h-5 text-neutral-400 mr-3" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-xs text-neutral-500 font-montserrat">Phone</div>
                <div className="text-sm font-medium text-neutral-800 font-montserrat">{manager.phone}</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
              <MapPin className="w-5 h-5 text-neutral-400 mr-3" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-xs text-neutral-500 font-montserrat">Region</div>
                <div className="text-sm font-medium text-neutral-800 font-montserrat">{manager.region}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
            Team Performance
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 font-montserrat mb-1">
                {manager.stats.totalLeads}
              </div>
              <div className="text-xs text-neutral-600 font-montserrat">Total Leads</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 font-montserrat mb-1">
                {manager.stats.closedDeals}
              </div>
              <div className="text-xs text-neutral-600 font-montserrat">Closed Deals</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 font-montserrat mb-1">
                {manager.stats.teamConversion}%
              </div>
              <div className="text-xs text-neutral-600 font-montserrat">Conversion Rate</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 font-montserrat mb-1">
                {manager.stats.avgResponseTime}h
              </div>
              <div className="text-xs text-neutral-600 font-montserrat">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <button className="w-full flex items-center p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100">
            <Settings className="w-5 h-5 text-neutral-600 mr-3" strokeWidth={1.5} />
            <span className="flex-1 text-left text-neutral-800 font-montserrat">Settings</span>
          </button>

          <button className="w-full flex items-center p-4 hover:bg-neutral-50 transition-colors">
            <LogOut className="w-5 h-5 text-red-600 mr-3" strokeWidth={1.5} />
            <span className="flex-1 text-left text-red-600 font-montserrat">Logout</span>
          </button>
        </div>
      </div>

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerProfile;
