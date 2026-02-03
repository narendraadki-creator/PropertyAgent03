import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Phone, Mail, MessageCircle, Eye, Plus, Clock, Star, Tag, Calendar, CheckCircle } from 'lucide-react';
import { mockLeads } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Stages');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'call',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium'
  });

  const stageFilters = ['All Stages', 'New Lead', 'Contacted', 'Site Visit Scheduled', 'Site Visit Completed', 'Negotiation', 'Booking Initiated', 'Closed'];
  const statusFilters = ['All Status', 'Hot', 'Warm', 'Cold'];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Site Visit':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Closed':
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

  const filteredLeads = mockLeads.filter(lead => {
    const matchesStage = activeFilter === 'All Stages' || lead.stage === activeFilter;
    const matchesStatus = statusFilter === 'All Status' || lead.status === statusFilter;
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesStatus && matchesSearch;
  });

  const handleAddNote = (leadId: string) => {
    if (newNote.trim()) {
      console.log(`Adding note to lead ${leadId}: ${newNote}`);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleAddReminder = (leadId: string) => {
    if (newReminder.title && newReminder.dueDate && newReminder.dueTime) {
      console.log(`Adding reminder to lead ${leadId}:`, newReminder);
      setNewReminder({
        type: 'call',
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium'
      });
      setShowAddReminder(false);
    }
  };

  const handleStageUpdate = (leadId: string, newStage: string) => {
    console.log(`Updating lead ${leadId} stage to ${newStage}`);
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
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
            <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
              {stageFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-2 px-2 rounded-md text-xs font-medium font-montserrat transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
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
              {mockLeads.filter(l => l.stage === 'New').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">New</div>
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Contacted').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Contacted</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Site Visit').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Site Visit</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Negotiation').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Negotiation</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Closed').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Closed</div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="px-4 py-6 pb-24">
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat">
                      {lead.buyerName}
                    </h3>
                    <div className="flex items-center">
                      <Star className={`w-4 h-4 mr-1 ${getScoreColor(lead.score)}`} strokeWidth={1.5} />
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
                      <span className="font-montserrat">{lead.email}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium font-montserrat rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
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

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Project:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.projectName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Developer:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.developerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Budget:</span>
                  <span className="font-medium text-primary-600 font-montserrat">{lead.budget}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Requirements:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.requirements}</span>
                </div>
                {lead.nextFollowUp && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Next Follow-up:</span>
                    <span className="font-medium text-accent-gold font-montserrat">{lead.nextFollowUp}</span>
                  </div>
                )}
              </div>

              {/* Recent Notes */}
              {lead.notes.length > 0 && (
                <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                  <h5 className="text-sm font-medium text-neutral-700 font-montserrat mb-2">Latest Note:</h5>
                  <p className="text-sm text-neutral-600 font-montserrat">
                    {lead.notes[lead.notes.length - 1]}
                  </p>
                  {lead.notes.length > 1 && (
                    <button className="text-xs text-primary-600 font-montserrat hover:text-primary-700 mt-1">
                      View all {lead.notes.length} notes
                    </button>
                  )}
                </div>
              )}

              {/* Active Reminders */}
              {lead.reminders.filter(r => !r.isCompleted).length > 0 && (
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
                  <select
                    value={lead.stage}
                    onChange={(e) => handleStageUpdate(lead.id, e.target.value)}
                    className="text-xs px-2 py-1 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                <div className="flex space-x-1">
                  {['New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed'].map((stage, index) => (
                    <div
                      key={stage}
                      className={`flex-1 h-2 rounded-full ${
                        ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed'].indexOf(lead.stage) >= index
                          ? 'bg-primary-600'
                          : 'bg-neutral-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-1" strokeWidth={1.5} />
                  Call
                </button>
                <button className="flex-1 bg-neutral-100 text-neutral-700 py-2 px-3 rounded-lg text-sm font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-1" strokeWidth={1.5} />
                  Message
                </button>
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
      </div>

      <AgentBottomNavigation />
    </RoleBasedLayout>
  );
};

export default LeadsPage;
                      