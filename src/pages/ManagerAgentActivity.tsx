import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Filter, Calendar, Clock, Phone, Mail, MessageSquare,
  Eye, CheckCircle, XCircle, User, MapPin, FileText, DollarSign,
  TrendingUp, Home, Users, AlertCircle, Star
} from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerAgentActivity: React.FC = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');

  const agent = {
    id: agentId || '1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@propertyagent.com'
  };

  const activities = [
    {
      id: 'ACT001',
      type: 'lead_created',
      title: 'New Lead Created',
      description: 'Created lead for Rahul Verma - Marina Heights Tower A',
      client: 'Rahul Verma',
      property: 'Marina Heights Tower A',
      timestamp: '2 hours ago',
      date: '2026-03-16 10:30 AM',
      icon: User,
      color: 'blue',
      details: {
        leadValue: '₹1.2 Cr',
        source: 'Website Inquiry',
        priority: 'High'
      }
    },
    {
      id: 'ACT002',
      type: 'call',
      title: 'Client Call',
      description: 'Called Anita Desai to discuss property visit schedule',
      client: 'Anita Desai',
      property: 'Skyline Residency',
      timestamp: '3 hours ago',
      date: '2026-03-16 09:15 AM',
      icon: Phone,
      color: 'green',
      details: {
        duration: '15 minutes',
        outcome: 'Visit scheduled for tomorrow',
        nextAction: 'Send property brochure'
      }
    },
    {
      id: 'ACT003',
      type: 'site_visit',
      title: 'Site Visit Completed',
      description: 'Conducted property tour for Karthik Iyer at Green Valley Apartments',
      client: 'Karthik Iyer',
      property: 'Green Valley Apartments',
      timestamp: '5 hours ago',
      date: '2026-03-16 07:00 AM',
      icon: MapPin,
      color: 'purple',
      details: {
        duration: '45 minutes',
        clientFeedback: 'Very interested, requested floor plans',
        nextAction: 'Send pricing details'
      }
    },
    {
      id: 'ACT004',
      type: 'email',
      title: 'Email Sent',
      description: 'Sent property details to Pooja Sharma for Urban Square',
      client: 'Pooja Sharma',
      property: 'Urban Square',
      timestamp: '6 hours ago',
      date: '2026-03-16 06:30 AM',
      icon: Mail,
      color: 'yellow',
      details: {
        subject: 'Property Details - Urban Square 2BHK',
        attachments: '3 documents',
        opened: 'Yes'
      }
    },
    {
      id: 'ACT005',
      type: 'deal_closed',
      title: 'Deal Closed',
      description: 'Successfully closed deal with Amit Patel for Sunrise Towers',
      client: 'Amit Patel',
      property: 'Sunrise Towers',
      timestamp: '1 day ago',
      date: '2026-03-15 03:45 PM',
      icon: CheckCircle,
      color: 'green',
      details: {
        dealValue: '₹1.5 Cr',
        commission: '₹1.5 L',
        paymentStatus: 'Token received'
      }
    },
    {
      id: 'ACT006',
      type: 'meeting',
      title: 'Client Meeting',
      description: 'Met with Sanjay Gupta to discuss investment opportunities',
      client: 'Sanjay Gupta',
      property: 'Multiple Properties',
      timestamp: '1 day ago',
      date: '2026-03-15 11:00 AM',
      icon: Users,
      color: 'blue',
      details: {
        location: 'Office',
        duration: '30 minutes',
        outcome: 'Shortlisted 3 properties'
      }
    },
    {
      id: 'ACT007',
      type: 'follow_up',
      title: 'Follow-up Call',
      description: 'Follow-up call with Neha Reddy regarding previous property visit',
      client: 'Neha Reddy',
      property: 'Lake View Residency',
      timestamp: '2 days ago',
      date: '2026-03-14 04:20 PM',
      icon: Phone,
      color: 'green',
      details: {
        duration: '10 minutes',
        outcome: 'Client requested discount',
        nextAction: 'Negotiate with developer'
      }
    },
    {
      id: 'ACT008',
      type: 'document',
      title: 'Document Submitted',
      description: 'Submitted booking form for Vikram Singh - Oceanview Apartments',
      client: 'Vikram Singh',
      property: 'Oceanview Apartments',
      timestamp: '2 days ago',
      date: '2026-03-14 10:30 AM',
      icon: FileText,
      color: 'purple',
      details: {
        documentType: 'Booking Form',
        status: 'Under Review',
        amount: '₹2 L token'
      }
    },
    {
      id: 'ACT009',
      type: 'lead_lost',
      title: 'Lead Marked Lost',
      description: 'Lost lead - Priya Kapoor decided to postpone purchase',
      client: 'Priya Kapoor',
      property: 'City Center Heights',
      timestamp: '3 days ago',
      date: '2026-03-13 02:15 PM',
      icon: XCircle,
      color: 'red',
      details: {
        reason: 'Budget constraints',
        followUpDate: '2026-06-15',
        notes: 'Client interested in future opportunities'
      }
    },
    {
      id: 'ACT010',
      type: 'property_visit',
      title: 'Property Visit Scheduled',
      description: 'Scheduled visit for Deepak Sharma at Marina Heights Tower B',
      client: 'Deepak Sharma',
      property: 'Marina Heights Tower B',
      timestamp: '3 days ago',
      date: '2026-03-13 09:00 AM',
      icon: Calendar,
      color: 'blue',
      details: {
        visitDate: '2026-03-18 11:00 AM',
        propertyType: '3BHK',
        clientRequirements: 'Sea view, high floor'
      }
    }
  ];

  const activityTypes = ['all', 'calls', 'emails', 'visits', 'deals', 'documents'];

  const getFilteredActivities = () => {
    if (filterType === 'all') return activities;

    const typeMap: Record<string, string[]> = {
      calls: ['call', 'follow_up'],
      emails: ['email'],
      visits: ['site_visit', 'property_visit'],
      deals: ['deal_closed', 'lead_lost'],
      documents: ['document']
    };

    return activities.filter(activity =>
      typeMap[filterType]?.includes(activity.type)
    );
  };

  const getActivityColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconBgColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[color] || colors.blue;
  };

  const filteredActivities = getFilteredActivities();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(`/manager/agents/${agentId}`)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                ACTIVITY LOG
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">{agent.name}</p>
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex space-x-2 overflow-x-auto mb-3">
            {['7days', '30days', '90days', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-4 py-2 rounded-lg text-xs font-medium font-montserrat whitespace-nowrap transition-all ${
                  dateFilter === filter
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {filter === '7days' && 'Last 7 Days'}
                {filter === '30days' && 'Last 30 Days'}
                {filter === '90days' && 'Last 90 Days'}
                {filter === 'all' && 'All Time'}
              </button>
            ))}
          </div>

          {/* Activity Type Filter */}
          <div className="flex space-x-2 overflow-x-auto">
            {activityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-xs font-medium font-montserrat whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-white text-primary-600 shadow-sm border border-primary-600'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 font-montserrat">{activities.length}</div>
            <div className="text-xs text-neutral-500 font-montserrat">Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 font-montserrat">
              {activities.filter(a => a.type === 'call' || a.type === 'follow_up').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Calls</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 font-montserrat">
              {activities.filter(a => a.type === 'site_visit').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Visits</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 font-montserrat">
              {activities.filter(a => a.type === 'deal_closed').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Closed</div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-4 py-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-neutral-500 font-montserrat">No activities found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                  {/* Activity Header */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-full ${getIconBgColor(activity.color)} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-neutral-800 font-montserrat">{activity.title}</h3>
                      <p className="text-sm text-neutral-600 font-montserrat mb-2">{activity.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-neutral-500 font-montserrat">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" strokeWidth={1.5} />
                          {activity.timestamp}
                        </span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client & Property Info */}
                  <div className="bg-neutral-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-500 font-montserrat">Client:</span>
                        <p className="font-medium text-neutral-800 font-montserrat">{activity.client}</p>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-montserrat">Property:</span>
                        <p className="font-medium text-neutral-800 font-montserrat">{activity.property}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="space-y-2">
                    {Object.entries(activity.details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 font-montserrat capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium text-neutral-800 font-montserrat">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerAgentActivity;
