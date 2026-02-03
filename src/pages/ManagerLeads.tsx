import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, AlertTriangle, Clock, UserX, Eye, Edit } from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerLeads: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [issueFilter, setIssueFilter] = useState('All Issues');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const leads = [
    {
      id: '1',
      buyerName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      agent: 'Arjun Mehta',
      agentId: '1',
      project: 'Godrej Meridien',
      stage: 'Negotiation',
      status: 'Hot',
      lastActivity: '2 hours ago',
      nextFollowUp: 'Today, 4:00 PM',
      isStale: false,
      isOverdue: false,
      score: 9
    },
    {
      id: '2',
      buyerName: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      agent: 'Rajesh Kumar',
      agentId: '3',
      project: 'DLF The Crest',
      stage: 'Site Visit Scheduled',
      status: 'Warm',
      lastActivity: '1 day ago',
      nextFollowUp: 'Tomorrow, 10:00 AM',
      isStale: false,
      isOverdue: false,
      score: 7
    },
    {
      id: '3',
      buyerName: 'Amit Patel',
      phone: '+91 76543 21098',
      email: 'amit.patel@email.com',
      agent: 'Vikram Singh',
      agentId: '5',
      project: 'Godrej Park Avenue',
      stage: 'Contacted',
      status: 'Cold',
      lastActivity: '5 days ago',
      nextFollowUp: '2 days ago',
      isStale: true,
      isOverdue: true,
      score: 4
    },
    {
      id: '4',
      buyerName: 'Sneha Gupta',
      phone: '+91 65432 10987',
      email: 'sneha.gupta@email.com',
      agent: 'Priya Sharma',
      agentId: '2',
      project: 'Prestige Lakeside',
      stage: 'New Lead',
      status: 'Hot',
      lastActivity: '30 minutes ago',
      nextFollowUp: 'Today, 11:00 AM',
      isStale: false,
      isOverdue: false,
      score: 8
    },
    {
      id: '5',
      buyerName: 'Vikram Singh',
      phone: '+91 54321 09876',
      email: 'vikram.singh@email.com',
      agent: 'Rajesh Kumar',
      agentId: '3',
      project: 'Brigade Gateway',
      stage: 'Contacted',
      status: 'Warm',
      lastActivity: '3 days ago',
      nextFollowUp: 'Yesterday, 2:00 PM',
      isStale: true,
      isOverdue: true,
      score: 6
    }
  ];

  const stageFilters = ['All Stages', 'New Lead', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Booking Initiated'];
  const issueFilters = ['All Issues', 'Stale Leads', 'Overdue Follow-ups', 'High Priority'];

  const agents = [
    { id: '1', name: 'Arjun Mehta' },
    { id: '2', name: 'Priya Sharma' },
    { id: '3', name: 'Rajesh Kumar' },
    { id: '4', name: 'Sneha Gupta' },
    { id: '5', name: 'Vikram Singh' }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New Lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Site Visit Scheduled':
      case 'Site Visit Completed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Booking Initiated':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Booked / Closed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cold':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All Stages' || lead.stage === stageFilter;
    const matchesIssue = issueFilter === 'All Issues' ||
                        (issueFilter === 'Stale Leads' && lead.isStale) ||
                        (issueFilter === 'Overdue Follow-ups' && lead.isOverdue) ||
                        (issueFilter === 'High Priority' && lead.score >= 8);
    return matchesSearch && matchesStage && matchesIssue;
  });

  const handleReassign = (leadId: string) => {
    setSelectedLead(leadId);
    setShowReassignModal(true);
  };

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
                LEAD MANAGEMENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">All Leads & Interventions</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by buyer, project, or agent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1 overflow-x-auto">
              {stageFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStageFilter(filter)}
                  className={`flex-shrink-0 py-2 px-3 rounded-md text-xs font-medium font-montserrat transition-all duration-200 ${
                    stageFilter === filter
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
              {issueFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setIssueFilter(filter)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium font-montserrat transition-all duration-200 ${
                    issueFilter === filter
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
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600 font-montserrat">{leads.length}</div>
            <div className="text-xs text-neutral-500 font-montserrat">Total</div>
          </div>
          <div>
            <div className="text-sm font-bold text-red-600 font-montserrat">
              {leads.filter(l => l.isStale).length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Stale</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-600 font-montserrat">
              {leads.filter(l => l.isOverdue).length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Overdue</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 font-montserrat">
              {leads.filter(l => l.score >= 8).length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Priority</div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="px-4 py-6 space-y-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className={`bg-white rounded-xl shadow-sm border p-4 ${
              lead.isStale ? 'border-red-200 bg-red-50' :
              lead.isOverdue ? 'border-orange-200 bg-orange-50' :
              'border-neutral-100'
            }`}
          >
            {/* Issue Badges */}
            {(lead.isStale || lead.isOverdue) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {lead.isStale && (
                  <div className="flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium font-montserrat rounded-md">
                    <AlertTriangle className="w-3 h-3 mr-1" strokeWidth={2} />
                    Stale Lead (No activity 72+ hours)
                  </div>
                )}
                {lead.isOverdue && (
                  <div className="flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium font-montserrat rounded-md">
                    <Clock className="w-3 h-3 mr-1" strokeWidth={2} />
                    Overdue Follow-up
                  </div>
                )}
              </div>
            )}

            {/* Lead Info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                  {lead.buyerName}
                </h3>
                <p className="text-sm text-neutral-600 font-montserrat mb-1">{lead.phone}</p>
                <p className="text-sm text-neutral-500 font-montserrat">{lead.project}</p>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStageColor(lead.stage)}`}>
                  {lead.stage}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </div>
              </div>
            </div>

            {/* Agent & Activity */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Agent:</span>
                <span className="font-medium text-neutral-800 font-montserrat">{lead.agent}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Last Activity:</span>
                <span className={`font-medium font-montserrat ${
                  lead.isStale ? 'text-red-600' : 'text-neutral-800'
                }`}>
                  {lead.lastActivity}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Next Follow-up:</span>
                <span className={`font-medium font-montserrat ${
                  lead.isOverdue ? 'text-orange-600' : 'text-neutral-800'
                }`}>
                  {lead.nextFollowUp}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <span className="text-neutral-600 font-montserrat">Lead Score:</span>
                <span className={`font-medium font-montserrat ${
                  lead.score >= 8 ? 'text-green-600' :
                  lead.score >= 6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {lead.score}/10
                </span>
              </div>
            </div>

            {/* Manager Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-1" strokeWidth={1.5} />
                View
              </button>
              <button
                onClick={() => handleReassign(lead.id)}
                className="flex-1 bg-orange-100 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-orange-200 transition-colors flex items-center justify-center"
              >
                <UserX className="w-4 h-4 mr-1" strokeWidth={1.5} />
                Reassign
              </button>
              <button className="flex-1 bg-neutral-100 text-neutral-700 py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center">
                <Edit className="w-4 h-4 mr-1" strokeWidth={1.5} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Reassign Lead
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Select New Agent
              </label>
              <select className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer">
                <option value="">Choose agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Reason for Reassignment
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                placeholder="Optional notes..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReassignModal(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Reassigning lead:', selectedLead);
                  setShowReassignModal(false);
                }}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerLeads;
