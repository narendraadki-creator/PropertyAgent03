import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Eye, UserCheck, AlertCircle, Award } from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerAgents: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const agents = [
    {
      id: '1',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@propertyagent.com',
      phone: '+91 98765 43210',
      region: 'Gurgaon & Delhi NCR',
      status: 'excellent',
      totalLeads: 45,
      activeLeads: 28,
      visits: 28,
      bookings: 8,
      closed: 6,
      conversion: 17.8,
      avgResponseTime: 2.5,
      lastActivity: '30 min ago'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@propertyagent.com',
      phone: '+91 87654 32109',
      region: 'Bangalore',
      status: 'good',
      totalLeads: 38,
      activeLeads: 22,
      visits: 22,
      bookings: 6,
      closed: 5,
      conversion: 15.8,
      avgResponseTime: 3.2,
      lastActivity: '1 hour ago'
    },
    {
      id: '3',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@propertyagent.com',
      phone: '+91 76543 21098',
      region: 'Mumbai',
      status: 'average',
      totalLeads: 52,
      activeLeads: 35,
      visits: 18,
      bookings: 5,
      closed: 3,
      conversion: 9.6,
      avgResponseTime: 6.5,
      lastActivity: '5 hours ago'
    },
    {
      id: '4',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@propertyagent.com',
      phone: '+91 65432 10987',
      region: 'Pune',
      status: 'excellent',
      totalLeads: 41,
      activeLeads: 25,
      visits: 31,
      bookings: 9,
      closed: 7,
      conversion: 22.0,
      avgResponseTime: 1.8,
      lastActivity: '15 min ago'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@propertyagent.com',
      phone: '+91 54321 09876',
      region: 'Delhi NCR',
      status: 'needs_attention',
      totalLeads: 29,
      activeLeads: 18,
      visits: 12,
      bookings: 2,
      closed: 1,
      conversion: 6.9,
      avgResponseTime: 12.5,
      lastActivity: '2 days ago'
    }
  ];

  const statusFilters = ['All', 'Excellent', 'Good', 'Average', 'Needs Attention'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'average':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'needs_attention':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
                         getStatusLabel(agent.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/manager/dashboard')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                AGENT MONITORING
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Team Performance & Activity</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents by name, email, or region"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1 overflow-x-auto">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium font-montserrat transition-all duration-200 whitespace-nowrap ${
                  statusFilter === filter
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600 font-montserrat">{agents.length}</div>
            <div className="text-xs text-neutral-500 font-montserrat">Total</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 font-montserrat">
              {agents.filter(a => a.status === 'excellent').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Excellent</div>
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-600 font-montserrat">
              {agents.filter(a => a.status === 'average').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Average</div>
          </div>
          <div>
            <div className="text-sm font-bold text-red-600 font-montserrat">
              {agents.filter(a => a.status === 'needs_attention').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Attention</div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="px-4 py-6 space-y-4">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg font-montserrat">
                    {agent.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 font-montserrat">{agent.name}</h3>
                  <p className="text-sm text-neutral-500 font-montserrat">{agent.region}</p>
                  <p className="text-xs text-neutral-400 font-montserrat">{agent.email}</p>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(agent.status)}`}>
                {getStatusLabel(agent.status)}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <div className="text-lg font-bold text-neutral-800 font-montserrat">{agent.totalLeads}</div>
                <div className="text-xs text-neutral-500 font-montserrat">Total Leads</div>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600 font-montserrat">{agent.activeLeads}</div>
                <div className="text-xs text-neutral-500 font-montserrat">Active</div>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <div className="text-lg font-bold text-green-600 font-montserrat">{agent.closed}</div>
                <div className="text-xs text-neutral-500 font-montserrat">Closed</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Visits:</span>
                <span className="font-medium text-neutral-800 font-montserrat">{agent.visits}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Bookings:</span>
                <span className="font-medium text-neutral-800 font-montserrat">{agent.bookings}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Conversion:</span>
                <span className={`font-medium font-montserrat ${
                  agent.conversion >= 15 ? 'text-green-600' :
                  agent.conversion >= 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {agent.conversion}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Avg Response:</span>
                <span className={`font-medium font-montserrat ${
                  agent.avgResponseTime <= 3 ? 'text-green-600' :
                  agent.avgResponseTime <= 6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {agent.avgResponseTime}h
                </span>
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center justify-between mb-4 text-xs text-neutral-500 font-montserrat">
              <span>Last activity: {agent.lastActivity}</span>
              {agent.status === 'excellent' && (
                <div className="flex items-center text-green-600">
                  <Award className="w-3 h-3 mr-1" strokeWidth={2} />
                  <span>Top Performer</span>
                </div>
              )}
              {agent.status === 'needs_attention' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-3 h-3 mr-1" strokeWidth={2} />
                  <span>Needs Review</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/manager/agents/${agent.id}`)}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-1" strokeWidth={1.5} />
                View Details
              </button>
              <button
                onClick={() => navigate(`/manager/agents/${agent.id}/activity`)}
                className="flex-1 bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg text-sm font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center"
              >
                <UserCheck className="w-4 h-4 mr-1" strokeWidth={1.5} />
                Activity Log
              </button>
            </div>
          </div>
        ))}
      </div>

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerAgents;
