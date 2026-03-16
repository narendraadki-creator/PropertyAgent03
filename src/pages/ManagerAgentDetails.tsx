import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MapPin, TrendingUp, TrendingDown,
  Award, AlertCircle, Calendar, Clock, Target, Users,
  CheckCircle, XCircle, Eye, MessageSquare, Star
} from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerAgentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const [timeFilter, setTimeFilter] = useState('7days');

  const agent = {
    id: agentId || '1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@propertyagent.com',
    phone: '+91 98765 43210',
    region: 'Gurgaon & Delhi NCR',
    status: 'excellent',
    joinedDate: 'Jan 15, 2024',
    totalLeads: 45,
    activeLeads: 28,
    visits: 28,
    bookings: 8,
    closed: 6,
    conversion: 17.8,
    avgResponseTime: 2.5,
    lastActivity: '30 min ago',
    monthlyTarget: 10,
    achievedThisMonth: 6
  };

  const performanceMetrics = [
    {
      label: 'Response Rate',
      value: '94%',
      change: '+5%',
      trend: 'up',
      color: 'green'
    },
    {
      label: 'Visit Rate',
      value: '62%',
      change: '+8%',
      trend: 'up',
      color: 'blue'
    },
    {
      label: 'Booking Rate',
      value: '18%',
      change: '-2%',
      trend: 'down',
      color: 'yellow'
    },
    {
      label: 'Close Rate',
      value: '13%',
      change: '+3%',
      trend: 'up',
      color: 'green'
    }
  ];

  const recentLeads = [
    {
      id: 'L001',
      client: 'Rahul Verma',
      property: 'Marina Heights Tower A',
      status: 'visit_scheduled',
      value: '₹1.2 Cr',
      stage: 'Visit Scheduled',
      date: '2 hours ago'
    },
    {
      id: 'L002',
      client: 'Anita Desai',
      property: 'Skyline Residency',
      status: 'negotiation',
      value: '₹95 L',
      stage: 'Negotiation',
      date: '5 hours ago'
    },
    {
      id: 'L003',
      client: 'Karthik Iyer',
      property: 'Green Valley Apartments',
      status: 'closed',
      value: '₹1.5 Cr',
      stage: 'Closed Won',
      date: '1 day ago'
    },
    {
      id: 'L004',
      client: 'Pooja Sharma',
      property: 'Urban Square',
      status: 'new',
      value: '₹80 L',
      stage: 'New Lead',
      date: '2 days ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'visit_scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'closed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/manager/agents')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                AGENT DETAILS
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Performance Overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Profile Card */}
      <div className="bg-white border-b border-neutral-100 px-4 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl font-montserrat">
                {agent.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 font-montserrat">{agent.name}</h2>
              <p className="text-sm text-neutral-500 font-montserrat flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" strokeWidth={1.5} />
                {agent.region}
              </p>
            </div>
          </div>

          {agent.status === 'excellent' && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium font-montserrat flex items-center border border-green-200">
              <Award className="w-3 h-3 mr-1" strokeWidth={2} />
              Top Performer
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-neutral-600 font-montserrat">
            <Phone className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            {agent.phone}
          </div>
          <div className="flex items-center text-sm text-neutral-600 font-montserrat">
            <Mail className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            {agent.email}
          </div>
          <div className="flex items-center text-sm text-neutral-600 font-montserrat">
            <Calendar className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            Joined: {agent.joinedDate}
          </div>
          <div className="flex items-center text-sm text-neutral-600 font-montserrat">
            <Clock className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            Last active: {agent.lastActivity}
          </div>
        </div>

        {/* Monthly Target Progress */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700 font-montserrat flex items-center">
              <Target className="w-4 h-4 mr-1" strokeWidth={1.5} />
              Monthly Target Progress
            </span>
            <span className="text-sm font-bold text-primary-600 font-montserrat">
              {agent.achievedThisMonth}/{agent.monthlyTarget}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${(agent.achievedThisMonth / agent.monthlyTarget) * 100}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 font-montserrat">
            {Math.round((agent.achievedThisMonth / agent.monthlyTarget) * 100)}% completed
          </p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-white border-b border-neutral-100 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto">
          {['7days', '30days', '90days', 'year'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-montserrat whitespace-nowrap transition-all ${
                timeFilter === filter
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {filter === '7days' && 'Last 7 Days'}
              {filter === '30days' && 'Last 30 Days'}
              {filter === '90days' && 'Last 90 Days'}
              {filter === 'year' && 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4 py-6">
        <h3 className="text-sm font-bold text-neutral-800 font-montserrat mb-4 uppercase tracking-wide">
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="text-2xl font-bold text-primary-600 font-montserrat mb-1">
              {agent.totalLeads}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Total Leads</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="text-2xl font-bold text-blue-600 font-montserrat mb-1">
              {agent.activeLeads}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Active Leads</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="text-2xl font-bold text-purple-600 font-montserrat mb-1">
              {agent.visits}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Site Visits</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="text-2xl font-bold text-green-600 font-montserrat mb-1">
              {agent.closed}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Deals Closed</div>
          </div>
        </div>

        {/* Performance Indicators */}
        <h3 className="text-sm font-bold text-neutral-800 font-montserrat mb-4 uppercase tracking-wide">
          Performance Indicators
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500 font-montserrat">{metric.label}</span>
                {metric.trend === 'up' ? (
                  <TrendingUp className={`w-4 h-4 text-${metric.color}-600`} strokeWidth={2} />
                ) : (
                  <TrendingDown className="w-4 h-4 text-yellow-600" strokeWidth={2} />
                )}
              </div>
              <div className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
                {metric.value}
              </div>
              <div className={`text-xs font-medium font-montserrat ${
                metric.trend === 'up' ? `text-${metric.color}-600` : 'text-yellow-600'
              }`}>
                {metric.change} from last period
              </div>
            </div>
          ))}
        </div>

        {/* Recent Leads Activity */}
        <h3 className="text-sm font-bold text-neutral-800 font-montserrat mb-4 uppercase tracking-wide">
          Recent Lead Activity
        </h3>
        <div className="space-y-3">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-neutral-800 font-montserrat">{lead.client}</h4>
                  <p className="text-sm text-neutral-500 font-montserrat">{lead.property}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                  {lead.stage}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 font-montserrat">Value: <span className="font-bold text-neutral-800">{lead.value}</span></span>
                <span className="text-xs text-neutral-400 font-montserrat">{lead.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/manager/agents/${agent.id}/activity`)}
            className="bg-primary-600 text-white py-3 px-4 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
            View Activity Log
          </button>
          <button
            className="bg-neutral-100 text-neutral-700 py-3 px-4 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Send Message
          </button>
        </div>
      </div>

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerAgentDetails;
