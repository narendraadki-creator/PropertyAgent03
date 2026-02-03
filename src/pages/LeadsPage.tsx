import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Phone, Mail, MessageCircle, Eye, Plus, Clock, Star, Tag, Calendar, CheckCircle, Edit2, ChevronDown } from 'lucide-react';
import { mockLeads } from '../data/mockData';
import { Lead } from '../types';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeFilter, setActiveFilter] = useState('All Stages');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatedLeadId, setUpdatedLeadId] = useState<string | null>(null);

  const stageFilters = ['All Stages', 'New Lead', 'Contacted', 'Site Visit Scheduled', 'Site Visit Completed', 'Negotiation', 'Booking Initiated', 'Closed'];
  const statusFilters = ['All Status', 'Hot', 'Warm', 'Cold'];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
      case 'New Lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Site Visit':
      case 'Site Visit Scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Site Visit Completed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Booking Initiated':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Closed':
      case 'Booked / Closed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
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
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStageProgress = (stage: string): number => {
    const stageMap: { [key: string]: number } = {
      'New Lead': 0,
      'New': 0,
      'Contacted': 1,
      'Site Visit Scheduled': 2,
      'Site Visit Completed': 2,
      'Site Visit': 2,
      'Negotiation': 3,
      'Booking Initiated': 4,
      'Booked / Closed': 4,
      'Closed': 4,
      'Lost / Dropped': -1
    };
    return stageMap[stage] ?? 0;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStage = activeFilter === 'All Stages' || lead.stage === activeFilter;
    const matchesStatus = statusFilter === 'All Status' || lead.status === statusFilter;
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesStatus && matchesSearch;
  });

  const handleStageUpdate = (leadId: string, newStage: string) => {
    console.log('=== STAGE UPDATE ===');
    console.log('Lead ID:', leadId);
    console.log('New Stage:', newStage);
    console.log('Current leads:', leads);

    setLeads(prevLeads => {
      const updated = prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, stage: newStage } : lead
      );
      console.log('Updated leads:', updated);
      return updated;
    });

    showUpdateFeedback(leadId);
  };

  const handleStatusUpdate = (leadId: string, newStatus: 'Hot' | 'Warm' | 'Cold') => {
    console.log('=== STATUS UPDATE ===');
    console.log('Lead ID:', leadId);
    console.log('New Status:', newStatus);
    console.log('Current leads:', leads);

    setLeads(prevLeads => {
      const updated = prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      );
      console.log('Updated leads:', updated);
      return updated;
    });

    showUpdateFeedback(leadId);
  };

  const showUpdateFeedback = (leadId: string) => {
    setUpdatedLeadId(leadId);
    setTimeout(() => setUpdatedLeadId(null), 2000);
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Success Toast */}
      {updatedLeadId && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
          <CheckCircle className="w-5 h-5 mr-2" strokeWidth={2} />
          <span className="font-medium font-montserrat">Lead updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROPERTY AGENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Lead Management CRM</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads by name, project, or developer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="space-y-3">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1 min-w-max">
                {stageFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`py-2 px-3 rounded-md text-xs font-medium font-montserrat transition-all duration-200 whitespace-nowrap ${
                      activeFilter === filter
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium font-montserrat transition-all duration-200 ${
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
      </div>

      {/* Pipeline Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600 font-montserrat">
              {leads.filter(l => l.stage === 'New' || l.stage === 'New Lead').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">New</div>
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-600 font-montserrat">
              {leads.filter(l => l.stage === 'Contacted').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Contacted</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-600 font-montserrat">
              {leads.filter(l => l.stage === 'Site Visit' || l.stage === 'Site Visit Scheduled').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Site Visit</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-600 font-montserrat">
              {leads.filter(l => l.stage === 'Negotiation').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Negotiation</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 font-montserrat">
              {leads.filter(l => l.stage === 'Closed' || l.stage === 'Booked / Closed').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Closed</div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="px-4 py-6 pb-24">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8 text-center">
            <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No leads found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`bg-white rounded-xl shadow-sm border p-4 transition-all duration-300 ${
                  updatedLeadId === lead.id
                    ? 'border-green-400 shadow-md'
                    : 'border-neutral-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-neutral-800 font-montserrat">
                        {lead.buyerName}
                      </h3>
                      <div className="flex items-center">
                        <Star className={`w-4 h-4 mr-1 ${getScoreColor(lead.score)}`} strokeWidth={1.5} fill="currentColor" />
                        <span className={`text-sm font-bold font-montserrat ${getScoreColor(lead.score)}`}>
                          {lead.score}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" strokeWidth={1.5} />
                        <span className="font-montserrat">{lead.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" strokeWidth={1.5} />
                        <span className="font-montserrat truncate max-w-[150px]">{lead.email}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium font-montserrat rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-3">
                    <div className="relative">
                      <select
                        value={lead.stage}
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleStageUpdate(lead.id, e.target.value);
                        }}
                        className={`pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium font-montserrat border-2 cursor-pointer focus:ring-2 focus:ring-primary-600 focus:outline-none hover:shadow-md transition-all appearance-none ${getStageColor(lead.stage)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                        <option value="Site Visit Completed">Site Visit Completed</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Booking Initiated">Booking Initiated</option>
                        <option value="Booked / Closed">Booked / Closed</option>
                        <option value="Lost / Dropped">Lost / Dropped</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" strokeWidth={2.5} />
                    </div>
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleStatusUpdate(lead.id, e.target.value as 'Hot' | 'Warm' | 'Cold');
                        }}
                        className={`pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium font-montserrat border-2 cursor-pointer focus:ring-2 focus:ring-primary-600 focus:outline-none hover:shadow-md transition-all appearance-none ${getStatusColor(lead.status)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Project:</span>
                    <span className="font-medium text-neutral-800 font-montserrat text-right">{lead.projectName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Developer:</span>
                    <span className="font-medium text-neutral-800 font-montserrat text-right">{lead.developerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Budget:</span>
                    <span className="font-medium text-primary-600 font-montserrat">{lead.budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Requirements:</span>
                    <span className="font-medium text-neutral-800 font-montserrat text-right">{lead.requirements}</span>
                  </div>
                  {lead.nextFollowUp && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500 font-montserrat">Next Follow-up:</span>
                      <span className="font-medium text-accent-gold font-montserrat flex items-center">
                        <Clock className="w-3 h-3 mr-1" strokeWidth={1.5} />
                        {lead.nextFollowUp}
                      </span>
                    </div>
                  )}
                </div>

                {/* Recent Notes */}
                {lead.notes && lead.notes.length > 0 && (
                  <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                    <h5 className="text-sm font-medium text-neutral-700 font-montserrat mb-2">Latest Note:</h5>
                    <p className="text-sm text-neutral-600 font-montserrat">
                      {lead.notes[lead.notes.length - 1]}
                    </p>
                    {lead.notes.length > 1 && (
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="text-xs text-primary-600 font-montserrat hover:text-primary-700 mt-1"
                      >
                        View all {lead.notes.length} notes
                      </button>
                    )}
                  </div>
                )}

                {/* Active Reminders */}
                {lead.reminders && lead.reminders.filter(r => !r.isCompleted).length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-yellow-600 mr-2" strokeWidth={1.5} />
                      <h5 className="text-sm font-medium text-yellow-700 font-montserrat">Upcoming Reminder:</h5>
                    </div>
                    {lead.reminders.filter(r => !r.isCompleted).slice(0, 1).map(reminder => (
                      <div key={reminder.id}>
                        <p className="text-sm font-medium text-yellow-800 font-montserrat">{reminder.title}</p>
                        <p className="text-xs text-yellow-700 font-montserrat">
                          {reminder.dueDate} at {reminder.dueTime}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stage Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700 font-montserrat">Lead Progress</span>
                    <span className="text-xs text-neutral-500 font-montserrat">
                      {getStageProgress(lead.stage) >= 0 ? `${getStageProgress(lead.stage) + 1}/5` : 'N/A'}
                    </span>
                  </div>

                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          getStageProgress(lead.stage) >= index
                            ? 'bg-gradient-to-r from-primary-600 to-accent-gold'
                            : 'bg-neutral-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    Call
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex-1 bg-neutral-100 text-neutral-700 py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center"
                  >
                    <Mail className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    Email
                  </a>
                  <button
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="flex-1 bg-accent-gold text-white py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-accent-gold/90 transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default LeadsPage;
