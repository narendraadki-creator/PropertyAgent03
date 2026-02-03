import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Users, ClipboardList, CheckCircle,
  AlertTriangle, Clock, Target, ArrowRight, Eye, Bell
} from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const kpiData = [
    {
      label: 'Total Leads',
      value: '342',
      change: '+12%',
      trend: 'up',
      icon: ClipboardList,
      color: 'blue'
    },
    {
      label: 'Active Leads',
      value: '187',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Bookings Initiated',
      value: '45',
      change: '+15%',
      trend: 'up',
      icon: Target,
      color: 'purple'
    },
    {
      label: 'Closed Deals',
      value: '28',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'teal'
    },
    {
      label: 'Stale Leads',
      value: '23',
      change: '-3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  const agentPerformance = [
    {
      id: '1',
      name: 'Arjun Mehta',
      leads: 45,
      visits: 28,
      bookings: 8,
      conversion: 17.8,
      status: 'excellent'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      leads: 38,
      visits: 22,
      bookings: 6,
      conversion: 15.8,
      status: 'good'
    },
    {
      id: '3',
      name: 'Rajesh Kumar',
      leads: 52,
      visits: 18,
      bookings: 5,
      conversion: 9.6,
      status: 'average'
    },
    {
      id: '4',
      name: 'Sneha Gupta',
      leads: 41,
      visits: 31,
      bookings: 9,
      conversion: 22.0,
      status: 'excellent'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      leads: 29,
      visits: 12,
      bookings: 2,
      conversion: 6.9,
      status: 'needs_attention'
    }
  ];

  const pipelineData = [
    { stage: 'New', count: 45, color: 'bg-blue-500' },
    { stage: 'Visit', count: 32, color: 'bg-purple-500' },
    { stage: 'Negotiation', count: 28, color: 'bg-orange-500' },
    { stage: 'Booking', count: 18, color: 'bg-teal-500' }
  ];

  const alerts = [
    {
      id: '1',
      type: 'critical',
      title: '8 leads untouched > 48 hrs',
      description: '5 assigned to Rajesh Kumar, 3 to Vikram Singh',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'warning',
      title: '12 stale leads detected',
      description: 'No activity in last 72 hours',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'info',
      title: '15 follow-ups due today',
      description: 'Reminders sent to respective agents',
      timestamp: '1 day ago'
    }
  ];

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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-neutral-200 bg-neutral-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                MANAGER DASHBOARD
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Sales Team Performance Overview</p>
            </div>
            <button
              onClick={() => navigate('/manager/alerts')}
              className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Bell className="w-6 h-6 text-neutral-600" strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${kpi.color}-100`}>
                    <Icon className={`w-5 h-5 text-${kpi.color}-600`} strokeWidth={1.5} />
                  </div>
                  <div className={`flex items-center text-xs font-medium font-montserrat ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" strokeWidth={2} />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
                  {kpi.value}
                </div>
                <div className="text-xs text-neutral-500 font-montserrat">
                  {kpi.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline View */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">Pipeline Overview</h2>
            <button
              onClick={() => navigate('/manager/analytics')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700 flex items-center"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {pipelineData.map((stage, index) => (
              <div key={index} className="text-center">
                <div className={`${stage.color} h-24 rounded-lg flex items-center justify-center mb-2`}>
                  <span className="text-2xl font-bold text-white font-montserrat">{stage.count}</span>
                </div>
                <span className="text-xs text-neutral-600 font-montserrat">{stage.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">Agent Performance</h2>
            <button
              onClick={() => navigate('/manager/agents')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700 flex items-center"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-3">
            {agentPerformance.slice(0, 3).map((agent) => (
              <div
                key={agent.id}
                onClick={() => navigate(`/manager/agents/${agent.id}`)}
                className="p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold font-montserrat">
                        {agent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800 font-montserrat">{agent.name}</h3>
                      <p className="text-xs text-neutral-500 font-montserrat">
                        {agent.leads} leads assigned
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(agent.status)}`}>
                    {agent.conversion}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-bold text-neutral-800 font-montserrat">{agent.visits}</div>
                    <div className="text-xs text-neutral-500 font-montserrat">Visits</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-800 font-montserrat">{agent.bookings}</div>
                    <div className="text-xs text-neutral-500 font-montserrat">Bookings</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-green-600 font-montserrat">{agent.conversion}%</div>
                    <div className="text-xs text-neutral-500 font-montserrat">Conversion</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">Alerts & Actions</h2>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium font-montserrat rounded-full">
              {alerts.filter(a => a.type === 'critical').length} Critical
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start">
                  <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${getAlertIcon(alert.type)}`} strokeWidth={1.5} />
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-800 font-montserrat mb-1">{alert.title}</h3>
                    <p className="text-sm text-neutral-600 font-montserrat mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-montserrat flex items-center">
                        <Clock className="w-3 h-3 mr-1" strokeWidth={1.5} />
                        {alert.timestamp}
                      </span>
                      <button className="text-primary-600 text-xs font-medium font-montserrat hover:text-primary-700 flex items-center">
                        <Eye className="w-3 h-3 mr-1" strokeWidth={2} />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerDashboard;
