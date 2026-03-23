import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CreditCard as Edit, BarChart3, Copy, Plus, Clock, Facebook, Instagram, Globe, MessageCircle, Target, TrendingUp, Users, Mail, Phone, Star, CheckCircle, AlertCircle, Activity, Sparkles, X, ArrowUpDown, AlertTriangle, Flame, ThermometerSun, Snowflake, Filter, Award, List, Map, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AICampaignScore from '../components/AICampaignScore';
import AIAudienceBuilder from '../components/AIAudienceBuilder';
import AIContentGenerator from '../components/AIContentGenerator';
import SmartBudgetSplit from '../components/SmartBudgetSplit';
import GeoHeatmap from '../components/GeoHeatmap';
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
  const [showHotLeadsOnly, setShowHotLeadsOnly] = useState(false);
  const [leadsViewMode, setLeadsViewMode] = useState<'table' | 'map'>('table');
  const [automationSettings, setAutomationSettings] = useState({
    autoFollowUp: true,
    whatsappAutoReply: false,
    smartLeadPrioritization: true
  });

  useEffect(() => {
    fetchCampaignData();
    fetchAvailableProperties();
  }, [id]);

  const fetchAvailableProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('trending_score', { ascending: false });

      if (!error && data) {
        const sortedProperties = data.sort((a, b) => {
          const scoreA = (a.conversion_rate || 0) * 2 + (a.trending_score || 0);
          const scoreB = (b.conversion_rate || 0) * 2 + (b.trending_score || 0);
          return scoreB - scoreA;
        });
        setAvailableProperties(sortedProperties);
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

        if (campaignRes.data.automation_settings) {
          setAutomationSettings({
            autoFollowUp: campaignRes.data.automation_settings.autoFollowUp ?? true,
            whatsappAutoReply: campaignRes.data.automation_settings.whatsappAutoReply ?? false,
            smartLeadPrioritization: campaignRes.data.automation_settings.smartLeadPrioritization ?? true
          });
        }
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

  const handleAutomationToggle = async (setting: 'autoFollowUp' | 'whatsappAutoReply' | 'smartLeadPrioritization') => {
    const newSettings = {
      ...automationSettings,
      [setting]: !automationSettings[setting]
    };

    setAutomationSettings(newSettings);

    try {
      await supabase
        .from('campaigns')
        .update({ automation_settings: newSettings })
        .eq('id', id);

      await supabase.from('campaign_activities').insert({
        campaign_id: id,
        activity_type: 'automation_change',
        description: `${setting === 'autoFollowUp' ? 'Auto-follow-up messages' : setting === 'whatsappAutoReply' ? 'WhatsApp auto-reply' : 'Smart lead prioritization'} ${newSettings[setting] ? 'enabled' : 'disabled'}`,
        metadata: { setting, enabled: newSettings[setting] }
      });
    } catch (error) {
      console.error('Error updating automation settings:', error);
      setAutomationSettings(automationSettings);
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
        },
        channel_budget_split: campaign.channel_budget_split || {},
        audience_config: campaign.audience_config || {},
        automation_settings: campaign.automation_settings || {},
        ai_score: campaign.ai_score || null,
        cta: campaign.cta || null
      };

      const { data, error } = await supabase
        .from('campaigns')
        .insert(newCampaign)
        .select()
        .single();

      if (error) {
        alert('Failed to duplicate campaign: ' + error.message);
        return;
      }

      if (data) {
        if (properties.length > 0) {
          const propertyInserts = properties.map(prop => ({
            campaign_id: data.id,
            project_id: prop.project_id,
            is_suggested: prop.is_suggested || false
          }));
          await supabase.from('campaign_properties').insert(propertyInserts);
        }

        await supabase.from('campaign_activities').insert({
          campaign_id: data.id,
          activity_type: 'campaign_launched',
          description: `Campaign duplicated from "${campaign.title}"`,
          metadata: { original_campaign_id: campaign.id }
        });

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

  const getLeadTemperature = (score: number): 'hot' | 'warm' | 'cold' => {
    if (score >= 80) return 'hot';
    if (score >= 50) return 'warm';
    return 'cold';
  };

  const getTemperatureIcon = (score: number) => {
    const temp = getLeadTemperature(score);
    if (temp === 'hot') return <Flame className="w-4 h-4" />;
    if (temp === 'warm') return <ThermometerSun className="w-4 h-4" />;
    return <Snowflake className="w-4 h-4" />;
  };

  const getTemperatureColor = (score: number) => {
    const temp = getLeadTemperature(score);
    if (temp === 'hot') return 'bg-red-100 text-red-700 border-red-200';
    if (temp === 'warm') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-600 border-blue-200';
  };

  const getTemperatureLabel = (score: number) => {
    const temp = getLeadTemperature(score);
    return temp.charAt(0).toUpperCase() + temp.slice(1);
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
      const { data: propertyData } = await supabase
        .from('projects')
        .select('name')
        .eq('id', propertyId)
        .maybeSingle();

      const { error } = await supabase
        .from('campaign_properties')
        .insert({
          campaign_id: id,
          project_id: propertyId,
          is_suggested: isSuggested
        });

      if (!error) {
        await supabase.from('campaign_activities').insert({
          campaign_id: id,
          activity_type: 'property_added',
          description: `Added ${propertyData?.name || 'property'} to campaign${isSuggested ? ' (AI suggested)' : ''}`,
          metadata: { property_id: propertyId, is_suggested: isSuggested }
        });

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

    const scoredProperties = unselectedProperties.map(prop => ({
      ...prop,
      aiScore: calculateRecommendationScore(prop),
      reason: getSmartAIReason(prop)
    }));

    return scoredProperties
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);
  };

  const calculateRecommendationScore = (property: any) => {
    let score = 50;

    if (property.conversion_rate >= 15) score += 30;
    else if (property.conversion_rate >= 10) score += 20;
    else if (property.conversion_rate > 0) score += 10;

    if (property.trending_score >= 60) score += 25;
    else if (property.trending_score >= 40) score += 15;
    else if (property.trending_score > 0) score += 5;

    if (property.is_new_listing) score += 15;

    if (property.leads_last_7_days > 5) score += 10;

    return Math.min(100, score);
  };

  const getSmartAIReason = (property: any) => {
    if (property.conversion_rate >= 15) {
      return `${property.conversion_rate.toFixed(1)}% conversion rate - proven high performer`;
    }
    if (property.trending_score >= 60) {
      return `Trending with ${property.leads_last_7_days || 0} leads in last 7 days`;
    }
    if (property.is_new_listing) {
      return 'Fresh listing with high visibility potential';
    }
    if (property.total_leads > 10) {
      return `Generated ${property.total_leads} total leads - strong track record`;
    }
    if (campaign?.campaign_type && property.location) {
      return `Matches ${campaign.campaign_type} campaign in ${property.location}`;
    }
    return 'High potential based on market analysis';
  };

  const handleRemoveProperty = async (propertyId: string) => {
    try {
      const { data: propertyData } = await supabase
        .from('projects')
        .select('name')
        .eq('id', propertyId)
        .maybeSingle();

      const { error } = await supabase
        .from('campaign_properties')
        .delete()
        .eq('campaign_id', id)
        .eq('project_id', propertyId);

      if (!error) {
        await supabase.from('campaign_activities').insert({
          campaign_id: id,
          activity_type: 'property_removed',
          description: `Removed ${propertyData?.name || 'property'} from campaign`,
          metadata: { property_id: propertyId }
        });

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
              <div className="flex items-center gap-6 mt-3 text-sm text-teal-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'} -
                  {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                </div>
                {campaign.channel_budget_split && Object.keys(campaign.channel_budget_split).length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs opacity-75">Active Channels:</span>
                    <div className="flex items-center gap-2">
                      {Object.entries(campaign.channel_budget_split).map(([channel, budget]: [string, any]) => {
                        if (budget > 0) {
                          const channelIcons: { [key: string]: { icon: any, label: string } } = {
                            facebook: { icon: Facebook, label: 'Facebook' },
                            instagram: { icon: Instagram, label: 'Instagram' },
                            google: { icon: Globe, label: 'Google Ads' },
                            whatsapp: { icon: MessageCircle, label: 'WhatsApp' }
                          };
                          const channelData = channelIcons[channel.toLowerCase()];
                          if (!channelData) return null;
                          const IconComponent = channelData.icon;
                          return (
                            <div key={channel} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg" title={`${channelData.label}: AED ${budget.toLocaleString()}`}>
                              <IconComponent className="w-4 h-4" />
                              <span className="text-xs font-medium">AED {(budget / 1000).toFixed(1)}k</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
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
                        {prop.projects?.conversion_rate >= 15 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            High Conversion
                          </div>
                        )}
                        {prop.projects?.trending_score >= 60 && !prop.projects?.conversion_rate >= 15 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </div>
                        )}
                        {prop.projects?.is_new_listing && !prop.projects?.conversion_rate >= 15 && !prop.projects?.trending_score >= 60 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            New Listing
                          </div>
                        )}
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
                          {prop.projects?.price_range || 'Price on request'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {prop.is_suggested && (
                            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3" />
                              AI Suggested
                            </span>
                          )}
                          {prop.projects?.conversion_rate > 0 && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                              {prop.projects.conversion_rate.toFixed(1)}% conv.
                            </span>
                          )}
                          {prop.projects?.trending_score > 0 && (
                            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                              {Math.round(prop.projects.trending_score)} trending
                            </span>
                          )}
                        </div>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <span className="text-xs text-gray-500">{activities.length} events</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.length > 0 ? activities.map((activity: any) => {
                  const getActivityIcon = (type: string) => {
                    switch(type) {
                      case 'status_change':
                        return { icon: Play, bg: 'bg-teal-100', color: 'text-teal-600' };
                      case 'lead_received':
                        return { icon: Users, bg: 'bg-green-100', color: 'text-green-600' };
                      case 'follow_up_sent':
                        return { icon: Mail, bg: 'bg-blue-100', color: 'text-blue-600' };
                      case 'campaign_launched':
                        return { icon: Play, bg: 'bg-purple-100', color: 'text-purple-600' };
                      case 'campaign_updated':
                        return { icon: Edit, bg: 'bg-blue-100', color: 'text-blue-600' };
                      case 'automation_change':
                        return { icon: Sparkles, bg: 'bg-amber-100', color: 'text-amber-600' };
                      case 'property_added':
                        return { icon: Plus, bg: 'bg-green-100', color: 'text-green-600' };
                      case 'property_removed':
                        return { icon: X, bg: 'bg-red-100', color: 'text-red-600' };
                      default:
                        return { icon: Activity, bg: 'bg-gray-100', color: 'text-gray-600' };
                    }
                  };

                  const formatTimestamp = (timestamp: string) => {
                    const date = new Date(timestamp);
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);

                    if (diffMins < 1) return 'Just now';
                    if (diffMins < 60) return `${diffMins}m ago`;
                    if (diffHours < 24) return `${diffHours}h ago`;
                    if (diffDays < 7) return `${diffDays}d ago`;

                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  };

                  const iconData = getActivityIcon(activity.activity_type);
                  const IconComponent = iconData.icon;

                  return (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`w-8 h-8 rounded-full ${iconData.bg} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-4 h-4 ${iconData.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatTimestamp(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No activity yet</p>
                    <p className="text-xs text-gray-400 mt-1">Activities will appear here as your campaign progresses</p>
                  </div>
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">Campaign Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-blue-700 font-medium">Total Budget</p>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-900">AED {(campaign.budget || 0).toLocaleString()}</p>
                      <p className="text-xs text-blue-600 mt-1">across all channels</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-green-700 font-medium">Properties</p>
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-900">{properties.length}</p>
                      <p className="text-xs text-green-600 mt-1">selected for campaign</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-purple-700 font-medium">Total Leads</p>
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-900">{leads.length}</p>
                      <p className="text-xs text-purple-600 mt-1">
                        {leads.filter(l => l.priority_score >= 80).length} high priority
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-amber-700 font-medium">Conversion Rate</p>
                        <Activity className="w-5 h-5 text-amber-600" />
                      </div>
                      <p className="text-2xl font-bold text-amber-900">{conversionRate}%</p>
                      <p className="text-xs text-amber-600 mt-1">clicks to conversions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">Campaign Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Campaign Type</p>
                      <p className="font-medium text-gray-900 capitalize">{campaign.campaign_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="font-medium text-gray-900">
                        {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'} -
                        {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">AI Campaign Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-teal-600">{campaign.ai_score || 75}</p>
                        <span className="text-sm text-gray-500">/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {campaign.channel_budget_split && Object.keys(campaign.channel_budget_split).length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 mb-4">Channel Budget Distribution</h4>
                    <div className="space-y-3">
                      {Object.entries(campaign.channel_budget_split).map(([channel, budget]: [string, any]) => {
                        if (budget > 0) {
                          const percentage = ((budget / campaign.budget) * 100).toFixed(1);
                          const channelInfo: { [key: string]: { icon: any, color: string, label: string } } = {
                            facebook: { icon: Facebook, color: 'text-blue-600', label: 'Facebook' },
                            instagram: { icon: Instagram, color: 'text-pink-600', label: 'Instagram' },
                            google: { icon: Globe, color: 'text-red-600', label: 'Google Ads' },
                            whatsapp: { icon: MessageCircle, color: 'text-green-600', label: 'WhatsApp' }
                          };
                          const info = channelInfo[channel.toLowerCase()];
                          if (!info) return null;
                          const IconComponent = info.icon;
                          return (
                            <div key={channel}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <IconComponent className={`w-5 h-5 ${info.color}`} />
                                  <span className="font-medium text-gray-900">{info.label}</span>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">AED {budget.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">{percentage}%</p>
                                </div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    channel.toLowerCase() === 'instagram' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                                    channel.toLowerCase() === 'facebook' ? 'bg-blue-600' :
                                    channel.toLowerCase() === 'google' ? 'bg-red-600' :
                                    'bg-green-600'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-900">{analytics?.totals.views?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Views</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-900">{analytics?.totals.clicks?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-600 mt-1">Clicks</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-900">{analytics?.totals.leads?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-600 mt-1">Leads Generated</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-900">{analytics?.totals.conversions?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-600 mt-1">Conversions</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Campaign Leads</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {leads.length} {leads.length === 1 ? 'lead' : 'leads'} generated
                      {leads.filter(l => l.priority_score >= 80).length > 0 && (
                        <span className="ml-2 text-red-600 font-medium">
                          ({leads.filter(l => l.priority_score >= 80).length} hot)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowHotLeadsOnly(!showHotLeadsOnly)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                        showHotLeadsOnly
                          ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      {showHotLeadsOnly ? 'Show All Leads' : 'Show Hot Leads Only'}
                    </button>
                    <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm shadow-sm">
                      <Plus className="w-4 h-4" />
                      Add Lead
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setLeadsViewMode('table')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      leadsViewMode === 'table'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    Table View
                  </button>
                  <button
                    onClick={() => setLeadsViewMode('map')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      leadsViewMode === 'map'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    Map View
                  </button>
                </div>

                {leads.filter(l => l.priority_score >= 80).length > 0 && (
                  <div className="mb-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Flame className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1">Hot Leads Require Attention</h4>
                        <p className="text-sm text-red-800">
                          You have {leads.filter(l => l.priority_score >= 80).length} hot leads based on high engagement, budget match, and quality signals.
                          These leads are most likely to convert - contact them immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {leadsViewMode === 'map' ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {(() => {
                      const filteredLeads = showHotLeadsOnly ? leads.filter(l => l.priority_score >= 80) : leads;
                      const leadsWithLocation = filteredLeads.filter(l => l.latitude && l.longitude);

                      console.log('Campaign Leads Debug:', {
                        totalLeads: leads.length,
                        filteredLeads: filteredLeads.length,
                        leadsWithLocation: leadsWithLocation.length,
                        sampleLead: filteredLeads[0]
                      });

                      if (leadsWithLocation.length === 0) {
                        return (
                          <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                              <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">No Geographic Data Available</h3>
                            <p className="text-gray-600 mb-4">
                              Campaign leads don't have location data yet.
                            </p>
                            <button
                              onClick={() => window.location.href = '/test/geo-heatmap'}
                              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              Seed Location Data
                            </button>
                          </div>
                        );
                      }

                      return (
                        <GeoHeatmap
                          leads={leadsWithLocation.map(lead => ({
                            id: lead.id,
                            name: lead.name,
                            latitude: lead.latitude,
                            longitude: lead.longitude,
                            city: lead.city,
                            state: lead.state,
                            budget: lead.budget,
                            stage: lead.status
                          }))}
                          onLeadClick={(leadId) => {
                            console.log('Lead clicked:', leadId);
                          }}
                        />
                      );
                    })()}
                  </div>
                ) : leads.length > 0 ? (
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
                        {sortedLeads.filter(lead => !showHotLeadsOnly || lead.priority_score >= 80).map((lead: any) => {
                          const priorityLevel = getPriorityLevel(lead.priority_score);
                          const temperature = getLeadTemperature(lead.priority_score);
                          const isHot = temperature === 'hot';

                          return (
                            <tr
                              key={lead.id}
                              className={`transition-all duration-200 ${
                                isHot
                                  ? 'bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-l-4 border-l-red-500 hot-lead-glow'
                                  : temperature === 'warm'
                                  ? 'bg-orange-50/30 hover:bg-orange-50 border-l-4 border-l-orange-300'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-gray-900">{lead.name}</div>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${getTemperatureColor(lead.priority_score)}`}>
                                    {getTemperatureIcon(lead.priority_score)}
                                    {getTemperatureLabel(lead.priority_score)}
                                  </span>
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
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-2xl font-bold ${
                                        lead.priority_score >= 80 ? 'text-red-600' :
                                        lead.priority_score >= 50 ? 'text-orange-600' :
                                        'text-blue-600'
                                      }`}>
                                        {Math.round(lead.priority_score)}
                                      </span>
                                      <span className="text-xs text-gray-400">/100</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      {lead.property_clicks > 0 && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded" title="Property clicks">
                                          {lead.property_clicks} clicks
                                        </span>
                                      )}
                                      {lead.whatsapp_replies > 0 && (
                                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded" title="WhatsApp replies">
                                          {lead.whatsapp_replies} replies
                                        </span>
                                      )}
                                      {lead.visit_count > 1 && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded" title="Site visits">
                                          {lead.visit_count} visits
                                        </span>
                                      )}
                                    </div>
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
                <h3 className="font-semibold text-gray-900 text-lg mb-6">Performance Analytics</h3>

                {(() => {
                  const channelBreakdown = analytics?.daily?.[0]?.channel_breakdown || {};
                  const channels = Object.entries(channelBreakdown).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    leads: value as number
                  })).sort((a, b) => b.leads - a.leads);

                  const topChannel = channels[0];
                  const secondChannel = channels[1];
                  const avgDailyViews = analytics ? Math.round(analytics.totals.views / analytics.daily.length) : 0;
                  const clickRate = analytics?.totals.views > 0 ? ((analytics.totals.clicks / analytics.totals.views) * 100) : 0;
                  const leadRate = analytics?.totals.clicks > 0 ? ((analytics.totals.leads / analytics.totals.clicks) * 100) : 0;
                  const costPerLead = analytics?.totals.leads > 0 ? Math.round((campaign.budget || 0) / analytics.totals.leads) : 0;

                  let insightMessage = '';
                  let insightType: 'success' | 'warning' | 'info' = 'info';

                  if (topChannel && secondChannel && topChannel.leads > 0) {
                    const improvement = ((topChannel.leads - secondChannel.leads) / secondChannel.leads * 100);
                    if (improvement > 50) {
                      insightMessage = `${topChannel.name} is generating ${Math.round(improvement)}% more leads than ${secondChannel.name}. Consider reallocating more budget to ${topChannel.name} for better ROI.`;
                      insightType = 'success';
                    } else if (improvement > 0) {
                      insightMessage = `${topChannel.name} is your top-performing channel. However, ${secondChannel.name} is performing competitively. Maintain balanced budget allocation.`;
                      insightType = 'info';
                    }
                  } else if (clickRate > 0 && clickRate < 3) {
                    insightMessage = `Your click rate is ${clickRate.toFixed(1)}%, which is below the industry average of 3-5%. Consider improving your ad creative and targeting.`;
                    insightType = 'warning';
                  } else if (clickRate >= 3 && leadRate < 5) {
                    insightMessage = `Good click rate at ${clickRate.toFixed(1)}%, but lead conversion at ${leadRate.toFixed(1)}% could be improved. Review your landing page and lead capture forms.`;
                    insightType = 'warning';
                  } else if (clickRate >= 3 && leadRate >= 5) {
                    insightMessage = `Excellent performance! Your ${clickRate.toFixed(1)}% click rate and ${leadRate.toFixed(1)}% lead rate are above industry benchmarks. Keep up the great work!`;
                    insightType = 'success';
                  } else if (costPerLead > 0 && costPerLead < 500) {
                    insightMessage = `Outstanding cost efficiency at AED ${costPerLead} per lead! This is well below market average. Your campaign targeting is highly effective.`;
                    insightType = 'success';
                  } else {
                    insightMessage = `Campaign is collecting data. Check back after 48 hours for personalized insights based on your performance metrics.`;
                    insightType = 'info';
                  }

                  return (
                    <>
                      <div className={`border rounded-lg p-5 mb-6 ${
                        insightType === 'success' ? 'bg-green-50 border-green-200' :
                        insightType === 'warning' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            insightType === 'success' ? 'bg-green-100' :
                            insightType === 'warning' ? 'bg-amber-100' :
                            'bg-blue-100'
                          }`}>
                            <Sparkles className={`w-5 h-5 ${
                              insightType === 'success' ? 'text-green-600' :
                              insightType === 'warning' ? 'text-amber-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold mb-1.5 ${
                              insightType === 'success' ? 'text-green-900' :
                              insightType === 'warning' ? 'text-amber-900' :
                              'text-blue-900'
                            }`}>
                              AI Insight: What's Working
                            </p>
                            <p className={`text-sm leading-relaxed ${
                              insightType === 'success' ? 'text-green-800' :
                              insightType === 'warning' ? 'text-amber-800' :
                              'text-blue-800'
                            }`}>
                              {insightMessage}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-5 bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-teal-600" />
                            <p className="text-sm font-medium text-gray-600">Avg. Daily Views</p>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {avgDailyViews.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {analytics?.totals.views.toLocaleString()} total views
                          </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-medium text-gray-600">Click Rate (%)</p>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {clickRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {analytics?.totals.clicks.toLocaleString()} clicks
                          </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-medium text-gray-600">Lead Rate (%)</p>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {leadRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {analytics?.totals.leads} leads generated
                          </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-purple-600" />
                            <p className="text-sm font-medium text-gray-600">Cost per Lead (AED)</p>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {costPerLead.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            AED {(campaign.budget || 0).toLocaleString()} budget
                          </p>
                        </div>
                      </div>

                      {channels.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                            Channel Performance Breakdown
                          </h4>
                          <div className="space-y-3">
                            {channels.map((channel, index) => {
                              const totalLeads = channels.reduce((sum, c) => sum + c.leads, 0);
                              const percentage = totalLeads > 0 ? (channel.leads / totalLeads * 100) : 0;

                              return (
                                <div key={channel.name} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {channel.name === 'Instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                                      {channel.name === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                                      {channel.name === 'Google' && <Globe className="w-4 h-4 text-red-600" />}
                                      {channel.name === 'Whatsapp' && <MessageCircle className="w-4 h-4 text-green-600" />}
                                      <span className="font-medium text-gray-900">{channel.name}</span>
                                      {index === 0 && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                          Top Performer
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <span className="font-semibold text-gray-900">{channel.leads} leads</span>
                                      <span className="text-sm text-gray-500 ml-2">({percentage.toFixed(0)}%)</span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                      className={`h-2.5 rounded-full transition-all duration-500 ${
                                        channel.name === 'Instagram' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                                        channel.name === 'Facebook' ? 'bg-blue-600' :
                                        channel.name === 'Google' ? 'bg-red-600' :
                                        'bg-green-600'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab === 'automation' && (
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-6">Automation Settings</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-50 to-white border border-teal-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-teal-100 rounded-lg">
                        <Mail className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Auto-follow-up messages</p>
                        <p className="text-sm text-gray-600">Automatically send follow-up messages to new leads within 24 hours</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={automationSettings.autoFollowUp}
                        onChange={() => handleAutomationToggle('autoFollowUp')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-green-100 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">WhatsApp auto-reply</p>
                        <p className="text-sm text-gray-600">Send automated responses to WhatsApp inquiries instantly</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={automationSettings.whatsappAutoReply}
                        onChange={() => handleAutomationToggle('whatsappAutoReply')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-blue-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Smart lead prioritization</p>
                        <p className="text-sm text-gray-600">AI automatically scores and prioritizes leads based on engagement</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={automationSettings.smartLeadPrioritization}
                        onChange={() => handleAutomationToggle('smartLeadPrioritization')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {automationSettings.autoFollowUp && (
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Automated Follow-up Sequence</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">Day 1: Welcome message</p>
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">Immediate</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">Send personalized introduction with property details and viewing options</p>
                          <p className="text-xs text-gray-500 italic">Sent automatically when lead is captured</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">Day 3: Follow-up reminder</p>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">72 hours</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">Check if they have questions or need additional information</p>
                          <p className="text-xs text-gray-500 italic">Skipped if lead has already responded</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">Day 7: Special offer</p>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">1 week</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">Share exclusive promotion, limited-time discount, or priority viewing slot</p>
                          <p className="text-xs text-gray-500 italic">Final automated touchpoint before manual follow-up</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Performance Note</p>
                          <p className="text-xs text-gray-600">Automated sequences have 3x higher response rates than manual outreach. Messages are personalized using campaign and property data.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={property.image || 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={property.name}
                          className="w-full h-40 object-cover"
                        />
                        {property.conversion_rate >= 15 && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-green-500/50 animate-pulse">
                            <Award className="w-3 h-3" />
                            High Conversion
                          </div>
                        )}
                        {property.trending_score >= 60 && property.conversion_rate < 15 && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-orange-500/50 animate-pulse">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </div>
                        )}
                        {property.is_new_listing && property.conversion_rate < 15 && property.trending_score < 60 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-blue-500/50 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            New Listing
                          </div>
                        )}
                        {isSelected && selectedProperty?.is_suggested && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            AI Suggested
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <p className="text-lg font-bold text-teal-600 mb-2">
                          {property.price_range || 'Price on request'}
                        </p>

                        {(property.conversion_rate > 0 || property.trending_score > 0) && (
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {property.conversion_rate > 0 && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                                {property.conversion_rate.toFixed(1)}% conv.
                              </span>
                            )}
                            {property.trending_score > 0 && (
                              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-medium">
                                {Math.round(property.trending_score)} trending
                              </span>
                            )}
                            {property.total_leads > 0 && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {property.total_leads} leads
                              </span>
                            )}
                          </div>
                        )}

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
