import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Star, Tag, Clock, Plus, CheckCircle, Edit, Calendar, MessageCircle, TrendingUp, AlertCircle, Video, FileText, ArrowRight } from 'lucide-react';
import { mockLeads, mockTodayReminders } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';

const LeadDetailsPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newReminder, setNewReminder] = useState({
    type: 'call',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium'
  });

  const lead = mockLeads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Lead not found</h2>
          <button 
            onClick={() => navigate('/leads')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to leads
          </button>
        </div>
      </div>
    );
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700';
      case 'Site Visit':
        return 'bg-purple-100 text-purple-700';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return 'bg-red-100 text-red-700';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cold':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStageUpdate = (newStage: string) => {
    console.log(`Updating lead ${leadId} stage to ${newStage}`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log(`Adding note to lead ${leadId}: ${newNote}`);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleAddReminder = () => {
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
    { id: 'reminders', label: 'Reminders' }
  ];

  const activityTimeline = [
    {
      id: '1',
      type: 'stage_change',
      title: 'Stage Updated',
      description: `Lead moved to ${lead.stage}`,
      timestamp: '2 hours ago',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: '2',
      type: 'call',
      title: 'Phone Call Logged',
      description: 'Discussed budget and preferences. Very interested in 3BHK units.',
      timestamp: '5 hours ago',
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: '3',
      type: 'note',
      title: 'Note Added',
      description: 'Prefers east-facing units for morning sunlight',
      timestamp: '1 day ago',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Reminder Set',
      description: 'Site visit scheduled for this weekend',
      timestamp: '1 day ago',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: '5',
      type: 'email',
      title: 'Email Sent',
      description: 'Sent floor plans and pricing details',
      timestamp: '2 days ago',
      icon: Mail,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  const getNextActions = (stage: string) => {
    switch (stage) {
      case 'New':
        return [
          { label: 'Make First Call', icon: Phone, action: 'call', primary: true },
          { label: 'Send Email', icon: Mail, action: 'email' },
          { label: 'Schedule Meeting', icon: Calendar, action: 'meeting' }
        ];
      case 'Contacted':
        return [
          { label: 'Schedule Site Visit', icon: Video, action: 'schedule_visit', primary: true },
          { label: 'Send Brochure', icon: FileText, action: 'send_brochure' },
          { label: 'Follow Up Call', icon: Phone, action: 'call' }
        ];
      case 'Site Visit':
        return [
          { label: 'Complete Visit', icon: CheckCircle, action: 'complete_visit', primary: true },
          { label: 'Send Follow-up', icon: Mail, action: 'followup' },
          { label: 'Reschedule', icon: Calendar, action: 'reschedule' }
        ];
      case 'Negotiation':
        return [
          { label: 'Initiate Booking', icon: ArrowRight, action: 'start_booking', primary: true },
          { label: 'Send Quote', icon: FileText, action: 'send_quote' },
          { label: 'Schedule Call', icon: Phone, action: 'call' }
        ];
      default:
        return [
          { label: 'Update Stage', icon: TrendingUp, action: 'update_stage', primary: true },
          { label: 'Add Note', icon: FileText, action: 'add_note' },
          { label: 'Set Reminder', icon: Clock, action: 'add_reminder' }
        ];
    }
  };

  const nextActions = getNextActions(lead.stage);

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/leads')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  PROPERTY AGENT
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Lead Details</p>
              </div>
            </div>
            
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Edit className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Lead Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-800 font-montserrat">
                {lead.buyerName}
              </h2>
              <div className="flex items-center">
                <Star className={`w-5 h-5 mr-1 ${getScoreColor(lead.score)}`} strokeWidth={1.5} />
                <span className={`text-lg font-bold font-montserrat ${getScoreColor(lead.score)}`}>
                  {lead.score}/10
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" strokeWidth={1.5} />
                <span className="font-montserrat">{lead.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" strokeWidth={1.5} />
                <span className="font-montserrat">{lead.email}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium font-montserrat rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStageColor(lead.stage)}`}>
              {lead.stage}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(lead.status)}`}>
              {lead.status}
            </div>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700 font-montserrat">Lead Progress</span>
            <select
              value={lead.stage}
              onChange={(e) => handleStageUpdate(e.target.value)}
              className="text-sm px-3 py-1 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
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

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddNote(true)}
            className="flex-1 flex items-center justify-center py-2 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat text-sm hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Add Note
          </button>
          <button 
            onClick={() => setShowAddReminder(true)}
            className="flex-1 flex items-center justify-center py-2 px-4 bg-yellow-100 text-yellow-700 rounded-lg font-medium font-montserrat text-sm hover:bg-yellow-200 transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Set Reminder
          </button>
          <button className="flex-1 flex items-center justify-center py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors">
            <MessageCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Message
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-30">
        <div className="overflow-x-auto">
          <div className="flex space-x-0 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium font-montserrat whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 pb-32">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Lead Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-neutral-600 font-montserrat">Project Interest:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.projectName}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-neutral-600 font-montserrat">Developer:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.developerName}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-neutral-600 font-montserrat">Budget Range:</span>
                  <span className="font-medium text-primary-600 font-montserrat">{lead.budget}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-neutral-600 font-montserrat">Requirements:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.requirements}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-neutral-600 font-montserrat">Last Interaction:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.lastInteraction}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Notes History</h3>
              <button 
                onClick={() => setShowAddNote(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Add Note
              </button>
            </div>
            
            <div className="space-y-3">
              {lead.notes.map((note, index) => (
                <div key={index} className="bg-white rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-800 font-montserrat">Note #{lead.notes.length - index}</span>
                    <span className="text-xs text-neutral-500 font-montserrat">2 hours ago</span>
                  </div>
                  <p className="text-sm text-neutral-600 font-montserrat">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Reminders</h3>
              <button 
                onClick={() => setShowAddReminder(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Add Reminder
              </button>
            </div>
            
            <div className="space-y-3">
              {lead.reminders.map((reminder) => (
                <div key={reminder.id} className={`bg-white rounded-lg border p-4 ${
                  reminder.isCompleted ? 'border-green-200 bg-green-50' : 'border-neutral-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        reminder.isCompleted ? 'bg-green-500' : 
                        reminder.priority === 'high' ? 'bg-red-100' :
                        reminder.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {reminder.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
                        ) : (
                          <Clock className={`w-4 h-4 ${
                            reminder.priority === 'high' ? 'text-red-600' :
                            reminder.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} strokeWidth={1.5} />
                        )}
                      </div>
                      <span className={`text-sm font-medium font-montserrat ${
                        reminder.isCompleted ? 'text-green-800' : 'text-neutral-800'
                      }`}>
                        {reminder.title}
                      </span>
                    </div>
                    <span className={`text-xs font-montserrat ${
                      reminder.isCompleted ? 'text-green-600' : 'text-neutral-500'
                    }`}>
                      {reminder.dueDate} {reminder.dueTime}
                    </span>
                  </div>
                  <p className={`text-sm font-montserrat ${
                    reminder.isCompleted ? 'text-green-700' : 'text-neutral-600'
                  }`}>
                    {reminder.description}
                  </p>
                  {!reminder.isCompleted && (
                    <button 
                      onClick={() => console.log(`Marking reminder ${reminder.id} as completed`)}
                      className="mt-2 text-primary-600 text-xs font-medium font-montserrat hover:text-primary-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Activity Timeline</h3>

            {/* Automation Suggestion */}
            <div className="bg-gradient-to-r from-accent-gold/10 to-primary-600/10 border border-accent-gold/30 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-accent-gold mr-3 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-neutral-800 font-montserrat mb-1">
                    Suggested Next Action
                  </h4>
                  <p className="text-sm text-neutral-600 font-montserrat mb-3">
                    {lead.stage === 'Negotiation' ?
                      'Lead is in negotiation stage. Consider initiating booking process.' :
                      lead.stage === 'Site Visit' ?
                      'Site visit scheduled. Prepare property details and confirm attendance.' :
                      'Follow up with the lead to maintain engagement and move forward.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {nextActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => console.log(`Action: ${action.action}`)}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium font-montserrat transition-colors ${
                            action.primary
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-1" strokeWidth={1.5} />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {activityTimeline.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${activity.bgColor} mr-3 flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-neutral-800 font-montserrat">
                            {activity.title}
                          </h4>
                          <span className="text-xs text-neutral-500 font-montserrat">
                            {activity.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 font-montserrat">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Add Note
            </h3>
            
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none mb-4"
              placeholder="Add your notes about this lead..."
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddNote(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Add Reminder
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reminder Type
                </label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                >
                  <option value="call">Phone Call</option>
                  <option value="site_visit">Site Visit</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  placeholder="Reminder title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Description
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                  placeholder="Reminder details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.dueTime}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, dueTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Priority
                </label>
                <select
                  value={newReminder.priority}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddReminder(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      <AgentBottomNavigation />
    </RoleBasedLayout>
  );
};

export default LeadDetailsPage;