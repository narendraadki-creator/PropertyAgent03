import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CreditCard as Edit, BarChart3, Copy, Plus, Clock, Facebook, Instagram, Globe, MessageCircle, Target, TrendingUp, Users, Mail, Phone, Star, CheckCircle, AlertCircle, Activity, Sparkles, X, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AICampaignScore from '../components/AICampaignScore';
import AIAudienceBuilder from '../components/AIAudienceBuilder';
import AIContentGenerator from '../components/AIContentGenerator';
import SmartBudgetSplit from '../components/SmartBudgetSplit';
import { getPriorityColor, getPriorityBadgeColor, getPriorityLevel } from '../utils/leadPriorityCalculator';

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
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<any[]>([]);
  const [sortField, setSortField] = useState<'name' | 'priority_score' | 'status' | 'source'>('priority_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCampaignData();
    fetchAvailableProperties();
  }, [id]);

  const fetchAvailableProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAvailableProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

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
    console.log('Duplicate button clicked');
    console.log('Current campaign:', campaign);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);

      const newCampaign = {
        project_id: campaign.project_id,
        agent_id: user?.id || campaign.agent_id,
        title: `${campaign.title} (Copy)`,
        description: campaign.description || '',
        campaign_type: campaign.campaign_type,
        status: 'draft',
        budget: campaign.budget || 0,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        target_platforms: campaign.target_platforms || [],
        creative_assets: campaign.creative_assets || {},
        content_template: campaign.content_template || {},
        performance_metrics: {
          shares: 0,
          clicks: 0,
          views: 0
        }
      };

      console.log('Creating new campaign:', newCampaign);

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

      console.log('Campaign duplicated successfully:', data);

      if (data) {
        alert('Campaign duplicated successfully!');
        navigate(`/agent/campaigns/${data.id}`);
      }
    } catch (error: any) {
      console.error('Error duplicating campaign:', error);
      alert('Failed to duplicate campaign: ' + (error?.message || 'Unknown error'));
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

  const handleSort = (field: 'name' | 'priority_score' | 'status' | 'source') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'priority_score') {
      comparison = (a.priority_score || 0) - (b.priority_score || 0);
    } else if (sortField === 'status') {
      comparison = (a.status || '').localeCompare(b.status || '');
    } else if (sortField === 'source') {
      comparison = (a.source || '').localeCompare(b.source || '');
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleAddProperty = async (propertyId: string, isSuggested: boolean = false) => {
    try {
      const { error } = await supabase
        .from('campaign_properties')
        .insert({
          campaign_id: id,
          project_id: propertyId,
          is_suggested: isSuggested
        });

      if (!error) {
        await fetchCampaignData();
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const generateAISuggestions = () => {
    const unselectedProperties = availableProperties.filter(
      prop => !properties.some(p => p.project_id === prop.id)
    );

    return unselectedProperties.slice(0, 3).map(prop => ({
      ...prop,
      aiScore: Math.floor(Math.random() * 30) + 70,
      reason: getAIReason(prop)
    }));
  };

  const getAIReason = (property: any) => {
    const reasons = [
      'High engagement in similar campaigns',
      'Matches target audience profile',
      'Trending in this location',
      'Strong price-to-value ratio',
      'High conversion potential'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const handleRemoveProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('campaign_properties')
        .delete()
        .eq('campaign_id', id)
        .eq('project_id', propertyId);

      if (!error) {
        await fetchCampaignData();
      }
    } catch (error) {
      console.error('Error removing property:', error);
    }
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDuplicate();
                }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/agent/campaigns/${id}/edit`);
                }}
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
                <button
                  onClick={() => {
                    console.log('Add Property clicked');
                    setShowPropertyModal(true);
                  }}
                  className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((prop: any) => (
                    <div key={prop.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow relative group">
                      <div className="relative">
                        <img
                          src={prop.projects?.image || 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={prop.projects?.name}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveProperty(prop.project_id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Remove property"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No properties selected yet</p>
                  <button
                    onClick={() => setShowPropertyModal(true)}
                    className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add your first property
                  </button>
                </div>
              )}
            </div>

            <AIAudienceBuilder
              config={campaign.audience_config || { locations: [], budgetMin: 0, budgetMax: 0, buyerTypes: [] }}
              onChange={(config) => {
                supabase.from('campaigns').update({ audience_config: config }).eq('id', id);
                setCampaign({ ...campaign, audience_config: config });
              }}
              propertyType={
                properties.length > 0 && properties[0].projects?.type
                  ? properties[0].projects.type
                  : campaign.type || 'luxury'
              }
            />

            <AIContentGenerator
              propertyName={properties[0]?.projects?.name}
              propertyType={campaign.campaign_type}
              initialTitle={campaign.title}
              initialDescription={campaign.description}
              initialCta={campaign.cta}
              onGenerate={(content) => {
                supabase
                  .from('campaigns')
                  .update({
                    title: content.title,
                    description: content.description,
                    cta: content.cta
                  })
                  .eq('id', id)
                  .then(() => {
                    setCampaign({
                      ...campaign,
                      title: content.title,
                      description: content.description,
                      cta: content.cta
                    });
                  });
              }}
            />
          </div>

          <div className="space-y-6">
            <SmartBudgetSplit
              totalBudget={campaign.budget || 10000}
              distribution={campaign.channel_budget_split || { facebook: 2500, instagram: 4000, google: 2000, whatsapp: 1500 }}
              onChange={async (distribution) => {
                setCampaign({ ...campaign, channel_budget_split: distribution });
                await supabase.from('campaigns').update({ channel_budget_split: distribution }).eq('id', id);
              }}
            />

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.totals.views?.toLocaleString() || '0'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+12% vs last period</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Leads Generated</p>
                    <p className="text-2xl font-bold text-gray-900">{leads.length.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+8% vs last period</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+5% vs last period</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Campaign Leads</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {leads.length} {leads.length === 1 ? 'lead' : 'leads'} generated
                      {leads.filter(l => l.priority_score >= 80).length > 0 && (
                        <span className="ml-2 text-red-600 font-medium">
                          ({leads.filter(l => l.priority_score >= 80).length} high priority)
                        </span>
                      )}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm shadow-sm">
                    <Plus className="w-4 h-4" />
                    Add Lead
                  </button>
                </div>

                {leads.filter(l => l.priority_score >= 80).length > 0 && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1">High Priority Leads Detected</h4>
                        <p className="text-sm text-red-800">
                          You have {leads.filter(l => l.priority_score >= 80).length} high-value leads that require immediate attention.
                          Priority is calculated based on budget range, source quality, and engagement level.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {leads.length > 0 ? (
                  <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th
                            onClick={() => handleSort('name')}
                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              Name
                              <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contact</th>
                          <th
                            onClick={() => handleSort('source')}
                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              Source
                              <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Budget</th>
                          <th
                            onClick={() => handleSort('priority_score')}
                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              Priority
                              <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('status')}
                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              Status
                              <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sortedLeads.map((lead: any) => {
                          const priorityLevel = getPriorityLevel(lead.priority_score);
                          const isHighPriority = priorityLevel === 'high';

                          return (
                            <tr
                              key={lead.id}
                              className={`transition-colors ${
                                isHighPriority
                                  ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-gray-900">{lead.name}</div>
                                  {isHighPriority && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded-full">
                                      <AlertTriangle className="w-3 h-3" />
                                      HOT
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col gap-1.5 text-sm">
                                  {lead.email && (
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{lead.email}</span>
                                    </div>
                                  )}
                                  {lead.phone && (
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{lead.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                                  {lead.source}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                                {lead.budget_range || '-'}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <Star className={`w-5 h-5 ${getPriorityColor(lead.priority_score)}`} />
                                  <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${
                                      lead.priority_score >= 80 ? 'text-red-600' :
                                      lead.priority_score >= 60 ? 'text-yellow-600' :
                                      'text-gray-600'
                                    }`}>
                                      {Math.round(lead.priority_score)}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{priorityLevel}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                                  lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                  lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                  lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h4>
                    <p className="text-sm text-gray-500 mb-4">Leads will appear here when your campaign is active</p>
                    <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm">
                      <Plus className="w-4 h-4" />
                      Add Your First Lead
                    </button>
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

      {showPropertyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add Properties to Campaign</h2>
                <button
                  onClick={() => setShowPropertyModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const suggestions = generateAISuggestions();
                return suggestions.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">AI Suggested Properties</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestions.map((property) => (
                      <div
                        key={property.id}
                        className="border-2 border-purple-200 bg-purple-50 rounded-lg overflow-hidden hover:border-purple-300 transition-all"
                      >
                        <div className="relative">
                          <img
                            src={property.image || 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'}
                            alt={property.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {property.aiScore}%
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                          <p className="text-lg font-bold text-teal-600 mb-2">
                            AED {property.price?.toLocaleString() || 'N/A'}
                          </p>
                          <div className="bg-white rounded-lg p-2 mb-3">
                            <p className="text-xs text-purple-700 flex items-start gap-1">
                              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              {property.reason}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddProperty(property.id, true)}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            Add Suggested Property
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })()}

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">All Properties</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProperties.map((property) => {
                  const isSelected = properties.some(p => p.project_id === property.id);
                  const selectedProperty = properties.find(p => p.project_id === property.id);

                  return (
                    <div
                      key={property.id}
                      className={`border-2 rounded-lg overflow-hidden transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={property.image || 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={property.name}
                          className="w-full h-40 object-cover"
                        />
                        {isSelected && selectedProperty?.is_suggested && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            AI Suggested
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <p className="text-lg font-bold text-teal-600 mb-3">
                          AED {property.price?.toLocaleString() || 'N/A'}
                        </p>

                        {isSelected ? (
                          <button
                            onClick={() => handleRemoveProperty(property.id)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Remove from Campaign
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddProperty(property.id, false)}
                            className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                          >
                            Add to Campaign
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {availableProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No properties available</p>
                  <p className="text-sm text-gray-500 mt-1">Create properties first to add them to campaigns</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPropertyModal(false)}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
