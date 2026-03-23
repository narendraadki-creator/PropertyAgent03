import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CreditCard as Edit, BarChart3, Copy, Plus, Clock, Facebook, Instagram, Globe, MessageCircle, Target, TrendingUp, Users, Mail, Phone, Star, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AICampaignScore from '../components/AICampaignScore';
import AIAudienceBuilder from '../components/AIAudienceBuilder';
import AIContentGenerator from '../components/AIContentGenerator';
import SmartBudgetSplit from '../components/SmartBudgetSplit';

export default function AgentCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'analytics' | 'automation'>('overview');

  useEffect(() => {
    fetchCampaignData();
  }, [id]);

  const fetchCampaignData = async () => {
    try {
      console.log('Fetching campaign with ID:', id);

      const [campaignRes, propertiesRes, leadsRes, analyticsRes, activitiesRes] = await Promise.all([
        supabase.from('campaigns').select('*').eq('id', id).maybeSingle(),
        supabase.from('campaign_properties').select('*, projects(*)').eq('campaign_id', id),
        supabase.from('campaign_leads').select('*').eq('campaign_id', id).order('created_at', { ascending: false }),
        supabase.from('campaign_analytics').select('*').eq('campaign_id', id).order('date', { ascending: false }).limit(30),
        supabase.from('campaign_activities').select('*').eq('campaign_id', id).order('created_at', { ascending: false }).limit(10)
      ]);

      console.log('Campaign response:', campaignRes);

      if (campaignRes.error) {
        console.error('Error fetching campaign:', campaignRes.error);
      }

      if (campaignRes.data) {
        setCampaign(campaignRes.data);
      } else {
        console.log('No campaign found with ID:', id);
      }

      if (propertiesRes.data) setProperties(propertiesRes.data);
      if (leadsRes.data) setLeads(leadsRes.data);
      if (analyticsRes.data && analyticsRes.data.length > 0) {
        const totals = analyticsRes.data.reduce((acc, day) => ({
          views: acc.views + (day.views || 0),
          clicks: acc.clicks + (day.clicks || 0),
          leads: acc.leads + (day.leads || 0),
          conversions: acc.conversions + (day.conversions || 0)
        }), { views: 0, clicks: 0, leads: 0, conversions: 0 });
        setAnalytics({ daily: analyticsRes.data, totals });
      }
      if (activitiesRes.data) setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await supabase.from('campaigns').update({ status: newStatus }).eq('id', id);

      await supabase.from('campaign_activities').insert({
        campaign_id: id,
        activity_type: 'status_change',
        description: `Campaign ${newStatus === 'active' ? 'launched' : newStatus === 'paused' ? 'paused' : 'completed'}`,
        metadata: { previous_status: campaign.status, new_status: newStatus }
      });

      setCampaign({ ...campaign, status: newStatus });
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const handleDuplicate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newCampaign = {
        project_id: campaign.project_id,
        agent_id: user?.id || campaign.agent_id,
        title: `${campaign.title} (Copy)`,
        description: campaign.description,
        campaign_type: campaign.campaign_type,
        status: 'draft',
        budget: campaign.budget,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        target_platforms: campaign.target_platforms,
        creative_assets: campaign.creative_assets,
        content_template: campaign.content_template,
        performance_metrics: {
          shares: 0,
          clicks: 0,
          views: 0
        }
      };

      const { data, error } = await supabase
        .from('campaigns')
        .insert(newCampaign)
        .select()
        .single();

      if (error) {
        console.error('Duplicate error:', error);
        alert('Failed to duplicate campaign: ' + error.message);
        return;
      }

      if (data) {
        alert('Campaign duplicated successfully!');
        navigate(`/agent/campaigns/${data.id}`);
      }
    } catch (error: any) {
      console.error('Error duplicating campaign:', error);
      alert('Failed to duplicate campaign: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Campaign not found</p>
      </div>
    );
  }

  const conversionRate = analytics?.totals.clicks > 0
    ? ((analytics.totals.conversions / analytics.totals.clicks) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/agent/campaigns')}
            className="flex items-center gap-2 text-teal-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{campaign.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              <p className="text-teal-100">{campaign.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-teal-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'} -
                  {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDuplicate()}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button
                onClick={() => navigate(`/agent/campaigns/${id}/edit`)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-1 rounded-lg inline-flex">
            {campaign.status === 'draft' && (
              <button
                onClick={() => handleStatusChange('active')}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Launch Campaign
              </button>
            )}
            {campaign.status === 'active' && (
              <button
                onClick={() => handleStatusChange('paused')}
                className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            {campaign.status === 'paused' && (
              <button
                onClick={() => handleStatusChange('active')}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            )}
            <button className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20 transition-colors">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <AICampaignScore
              score={campaign.ai_score || 75}
              insights={[
                'Instagram is generating 60% more leads than Facebook',
                'Best performing time: 6-9 PM weekdays',
                'Consider adding more luxury property visuals'
              ]}
            />

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Selected Properties</h3>
                <button className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((prop: any) => (
                    <div key={prop.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={prop.projects?.image || 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={prop.projects?.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 mb-1">{prop.projects?.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{prop.projects?.location}</p>
                        <p className="text-lg font-bold text-teal-600">
                          AED {prop.projects?.price?.toLocaleString()}
                        </p>
                        {prop.is_suggested && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full mt-2">
                            <Star className="w-3 h-3" />
                            AI Suggested
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No properties selected yet</p>
              )}
            </div>

            <AIAudienceBuilder
              config={campaign.audience_config || { locations: [], budgetMin: 0, budgetMax: 0, buyerTypes: [] }}
              onChange={(config) => {
                supabase.from('campaigns').update({ audience_config: config }).eq('id', id);
              }}
              propertyType="luxury"
            />

            <AIContentGenerator
              propertyName={properties[0]?.projects?.name}
              propertyType={campaign.campaign_type}
              onGenerate={(content) => console.log(content)}
            />
          </div>

          <div className="space-y-6">
            <SmartBudgetSplit
              totalBudget={campaign.budget || 10000}
              distribution={campaign.channel_budget_split || { facebook: 2500, instagram: 4000, google: 2000, whatsapp: 1500 }}
              onChange={(distribution) => {
                supabase.from('campaigns').update({ channel_budget_split: distribution }).eq('id', id);
              }}
            />

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.totals.views?.toLocaleString() || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Leads Generated</p>
                    <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activities.length > 0 ? activities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'leads'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('automation')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'automation'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Automation
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'leads' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Campaign Leads</h3>
                  <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm">
                    <Plus className="w-4 h-4" />
                    Add Lead
                  </button>
                </div>

                {leads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contact</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Source</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Budget</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Priority</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead: any) => (
                          <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{lead.name}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1 text-sm">
                                {lead.email && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Mail className="w-3 h-3" />
                                    {lead.email}
                                  </div>
                                )}
                                {lead.phone && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Phone className="w-3 h-3" />
                                    {lead.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {lead.source}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{lead.budget_range || '-'}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <Star className={`w-4 h-4 ${getPriorityColor(lead.priority_score)}`} />
                                <span className="text-sm font-medium">{lead.priority_score}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No leads yet</p>
                    <p className="text-sm text-gray-500 mt-1">Leads will appear here when your campaign is active</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">What's Working</p>
                      <p className="text-sm text-blue-800">
                        Instagram is generating 60% more leads than Facebook. Consider increasing Instagram budget allocation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Avg. Daily Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics ? Math.round(analytics.totals.views / analytics.daily.length) : 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Click Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.totals.views > 0
                        ? ((analytics.totals.clicks / analytics.totals.views) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Lead Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.totals.clicks > 0
                        ? ((analytics.totals.leads / analytics.totals.clicks) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Cost/Lead</p>
                    <p className="text-2xl font-bold text-gray-900">
                      AED {analytics?.totals.leads > 0
                        ? Math.round((campaign.budget || 0) / analytics.totals.leads)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'automation' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Automation Settings</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Auto-follow-up messages</p>
                      <p className="text-sm text-gray-600">Automatically send follow-up messages to new leads</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp auto-reply</p>
                      <p className="text-sm text-gray-600">Send automated responses to WhatsApp inquiries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Smart lead prioritization</p>
                      <p className="text-sm text-gray-600">AI automatically scores and prioritizes leads</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Follow-up Sequence</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Day 1: Welcome message</p>
                        <p className="text-sm text-gray-600">Send introduction and property details</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Day 3: Follow-up reminder</p>
                        <p className="text-sm text-gray-600">Check if they have questions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Day 7: Special offer</p>
                        <p className="text-sm text-gray-600">Share exclusive promotion or viewing slot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
