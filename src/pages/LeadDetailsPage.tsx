import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Star, Tag, Clock, Plus, CheckCircle, Edit, Calendar, MessageCircle, TrendingUp, AlertCircle, Video, FileText, ArrowRight, Save, X } from 'lucide-react';
import { mockLeads, mockTodayReminders } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LeadDetailsPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showStageUpdate, setShowStageUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [newNote, setNewNote] = useState('');
  const [newReminder, setNewReminder] = useState({
    type: 'call',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium'
  });

  const leadData = mockLeads.find(l => l.id === leadId);

  const [editedLead, setEditedLead] = useState({
    stage: leadData?.stage || 'New',
    status: leadData?.status || 'Warm',
    nextFollowUp: leadData?.nextFollowUp || '',
    score: leadData?.score || 5,
    requirements: leadData?.requirements || ''
  });

  if (!leadData) {
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

  const lead = { ...leadData, ...editedLead };

  const allStages = [
    'New Lead',
    'Contacted',
    'Site Visit Scheduled',
    'Site Visit Completed',
    'Negotiation',
    'Booking Initiated',
    'Booked / Closed',
    'Lost / Dropped'
  ];

  const getCurrentStageIndex = () => {
    return allStages.indexOf(lead.stage);
  };

  const getNextStage = () => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex < allStages.length - 1 && currentIndex !== -1) {
      return allStages[currentIndex + 1];
    }
    return null;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New Lead':
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Site Visit Scheduled':
      case 'Site Visit':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Site Visit Completed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Booking Initiated':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Booked / Closed':
      case 'Closed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Lost / Dropped':
        return 'bg-red-100 text-red-700 border-red-200';
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStageUpdate = (newStage: string) => {
    setEditedLead(prev => ({ ...prev, stage: newStage }));
    setShowStageUpdate(false);
    showSuccessMessage();
  };

  const handleMoveToNextStage = () => {
    const nextStage = getNextStage();
    if (nextStage) {
      handleStageUpdate(nextStage);
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving lead changes:', editedLead);
    setIsEditing(false);
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
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
      case 'New Lead':
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
      case 'Site Visit Scheduled':
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
  const nextStage = getNextStage();

  return (
    <RoleBasedLayout user={mockCurrentUser}>
      <div className="min-h-screen bg-neutral-50 pb-20">
        {/* Success Message */}
        {updateSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <CheckCircle className="w-5 h-5 mr-2" strokeWidth={2} />
            <span className="font-medium font-montserrat">Lead updated successfully!</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/leads')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-colors ${
                    isEditing ? 'bg-primary-100 text-primary-600' : 'hover:bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <Edit className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
                {lead.buyerName}
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">{lead.projectName}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-neutral-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium font-montserrat transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stage Progression */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
                  Lead Stage
                </h3>

                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg border font-medium font-montserrat ${getStageColor(lead.stage)}`}>
                    {lead.stage}
                  </div>
                </div>

                {nextStage && !['Booked / Closed', 'Lost / Dropped'].includes(lead.stage) && (
                  <div className="space-y-3">
                    <button
                      onClick={handleMoveToNextStage}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium font-montserrat hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center justify-center shadow-md"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" strokeWidth={2} />
                      Move to {nextStage}
                    </button>

                    <button
                      onClick={() => setShowStageUpdate(true)}
                      className="w-full bg-neutral-100 text-neutral-700 py-3 px-4 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" strokeWidth={1.5} />
                      Change Stage
                    </button>
                  </div>
                )}

                {/* Stage Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-neutral-600 font-montserrat mb-2">
                    <span>Progress</span>
                    <span>{Math.round((getCurrentStageIndex() / (allStages.length - 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-600 to-accent-gold transition-all duration-500"
                      style={{ width: `${(getCurrentStageIndex() / (allStages.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-800 font-montserrat">
                    Lead Details
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" strokeWidth={1.5} />
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <Phone className="w-5 h-5 text-neutral-400 mr-3" strokeWidth={1.5} />
                    <div className="flex-1">
                      <div className="text-xs text-neutral-500 font-montserrat">Phone</div>
                      <div className="text-sm font-medium text-neutral-800 font-montserrat">{lead.phone}</div>
                    </div>
                    <a href={`tel:${lead.phone}`} className="text-primary-600 hover:text-primary-700">
                      <Phone className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  </div>

                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <Mail className="w-5 h-5 text-neutral-400 mr-3" strokeWidth={1.5} />
                    <div className="flex-1">
                      <div className="text-xs text-neutral-500 font-montserrat">Email</div>
                      <div className="text-sm font-medium text-neutral-800 font-montserrat">{lead.email}</div>
                    </div>
                    <a href={`mailto:${lead.email}`} className="text-primary-600 hover:text-primary-700">
                      <Mail className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  </div>

                  {/* Status */}
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-xs text-neutral-500 font-montserrat mb-2">Status</div>
                    {isEditing ? (
                      <select
                        value={editedLead.status}
                        onChange={(e) => setEditedLead(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 font-medium"
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                      </select>
                    ) : (
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </div>
                    )}
                  </div>

                  {/* Next Follow-up */}
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-neutral-500 font-montserrat">Next Follow-up</div>
                      <Clock className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                    </div>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={editedLead.nextFollowUp}
                        onChange={(e) => setEditedLead(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                        className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 text-sm"
                      />
                    ) : (
                      <div className="text-sm font-medium text-neutral-800 font-montserrat">
                        {lead.nextFollowUp || 'Not scheduled'}
                      </div>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-xs text-neutral-500 font-montserrat mb-1">Budget</div>
                    <div className="text-sm font-medium text-neutral-800 font-montserrat">{lead.budget}</div>
                  </div>

                  {/* Requirements */}
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-xs text-neutral-500 font-montserrat mb-2">Requirements</div>
                    {isEditing ? (
                      <textarea
                        value={editedLead.requirements}
                        onChange={(e) => setEditedLead(prev => ({ ...prev, requirements: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 text-sm resize-none"
                      />
                    ) : (
                      <div className="text-sm font-medium text-neutral-800 font-montserrat">{lead.requirements}</div>
                    )}
                  </div>

                  {/* Lead Score */}
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-neutral-500 font-montserrat">Lead Score</div>
                      <Star className="w-4 h-4 text-accent-gold" strokeWidth={1.5} fill="currentColor" />
                    </div>
                    <div className={`text-2xl font-bold font-montserrat ${getScoreColor(lead.score)}`}>
                      {lead.score}/10
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                {isEditing && (
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors flex items-center justify-center"
                    >
                      <X className="w-5 h-5 mr-1" strokeWidth={1.5} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <Save className="w-5 h-5 mr-1" strokeWidth={1.5} />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="flex items-center justify-center py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium font-montserrat hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-1" strokeWidth={1.5} />
                    Add Note
                  </button>
                  <button
                    onClick={() => setShowAddReminder(true)}
                    className="flex items-center justify-center py-3 px-4 bg-orange-50 text-orange-700 rounded-lg font-medium font-montserrat hover:bg-orange-100 transition-colors"
                  >
                    <Clock className="w-5 h-5 mr-1" strokeWidth={1.5} />
                    Set Reminder
                  </button>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center py-3 px-4 bg-green-50 text-green-700 rounded-lg font-medium font-montserrat hover:bg-green-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-1" strokeWidth={1.5} />
                    Call
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center justify-center py-3 px-4 bg-purple-50 text-purple-700 rounded-lg font-medium font-montserrat hover:bg-purple-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-1" strokeWidth={1.5} />
                    Email
                  </a>
                </div>
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

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Notes</h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-1" strokeWidth={1.5} />
                  Add Note
                </button>
              </div>

              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note, index) => (
                  <div key={index} className="bg-white rounded-lg border border-neutral-200 p-4">
                    <p className="text-neutral-700 font-montserrat mb-2">{note}</p>
                    <span className="text-xs text-neutral-500 font-montserrat">
                      {lead.lastInteraction}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="text-lg font-medium text-neutral-600 mb-2">No notes yet</h4>
                  <p className="text-neutral-400 font-montserrat text-sm mb-4">
                    Add your first note to track important information
                  </p>
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-1" strokeWidth={1.5} />
                    Add Note
                  </button>
                </div>
              )}
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
                  <Plus className="w-5 h-5 mr-1" strokeWidth={1.5} />
                  Add Reminder
                </button>
              </div>

              {lead.reminders && lead.reminders.length > 0 ? (
                lead.reminders.map((reminder) => (
                  <div key={reminder.id} className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-neutral-800 font-montserrat mb-1">
                          {reminder.title}
                        </h4>
                        <p className="text-sm text-neutral-600 font-montserrat mb-2">
                          {reminder.description}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium font-montserrat ${
                        reminder.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : reminder.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {reminder.priority}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-neutral-500 font-montserrat">
                      <Clock className="w-4 h-4 mr-1" strokeWidth={1.5} />
                      {reminder.dueDate} at {reminder.dueTime}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                  <Clock className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="text-lg font-medium text-neutral-600 mb-2">No reminders set</h4>
                  <p className="text-neutral-400 font-montserrat text-sm mb-4">
                    Add reminders to stay on top of follow-ups
                  </p>
                  <button
                    onClick={() => setShowAddReminder(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-1" strokeWidth={1.5} />
                    Add Reminder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stage Update Modal */}
      {showStageUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Update Lead Stage
            </h3>

            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              {allStages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleStageUpdate(stage)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium font-montserrat transition-colors border ${
                    stage === lead.stage
                      ? getStageColor(stage) + ' border-2'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowStageUpdate(false)}
              className="w-full py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              rows={5}
              className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none mb-6"
              placeholder="Enter your note here..."
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
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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

    </RoleBasedLayout>
  );
};

export default LeadDetailsPage;
