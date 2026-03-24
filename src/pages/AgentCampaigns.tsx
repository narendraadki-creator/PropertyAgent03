import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '../types';
import { supabase } from '../lib/supabase';
import { Plus, Filter, Search, Rocket, Database, Sparkles } from 'lucide-react';
import { seedCampaignData } from '../utils/seedCampaignData';
import CampaignCard from '../components/CampaignCard';

export default function AgentCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    console.log('Initialized auth, user:', user ? user.id : 'none');
    fetchCampaigns();
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched campaigns:', data?.length || 0);

      if (data) {
        const formattedCampaigns: Campaign[] = data.map((campaign: any) => ({
          id: campaign.id,
          projectId: campaign.project_id,
          agentId: campaign.agent_id,
          title: campaign.title,
          description: campaign.description,
          campaignType: campaign.campaign_type,
          status: campaign.status,
          budget: campaign.budget,
          startDate: campaign.start_date,
          endDate: campaign.end_date,
          targetPlatforms: campaign.target_platforms || [],
          creativeAssets: campaign.creative_assets || {},
          contentTemplate: campaign.content_template || {},
          performanceMetrics: campaign.performance_metrics || { shares: 0, clicks: 0, views: 0 },
          createdAt: campaign.created_at,
          updatedAt: campaign.updated_at
        }));
        setCampaigns(formattedCampaigns);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaign: Campaign) => {
    if (!confirm(`Are you sure you want to delete "${campaign.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id);

      if (error) throw error;

      setCampaigns(campaigns.filter(c => c.id !== campaign.id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedCampaignData();
      await fetchCampaigns();
      alert('Sample campaign data added successfully! Click on any campaign to view details.');
    } catch (error: any) {
      console.error('Error seeding data:', error);
      alert(`Failed to seed campaign data: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    completed: campaigns.filter(c => c.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
              <p className="text-teal-100">Create and manage social media campaigns for projects</p>
            </div>
            <div className="flex items-center gap-2">
              {campaigns.length === 0 && (
                <button
                  onClick={handleSeedData}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
                >
                  <Database className="w-5 h-5" />
                  Add Sample Data
                </button>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/agent/templates')}
                  className="flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors shadow-lg border-2 border-teal-600"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Templates
                </button>
                <button
                  onClick={() => navigate('/agent/campaigns/create')}
                  className="flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Campaign
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-teal-100 text-sm mb-1">Total Campaigns</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-teal-100 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-teal-100 text-sm mb-1">Draft</p>
              <p className="text-3xl font-bold">{stats.draft}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-teal-100 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {campaigns.length === 0
                ? 'Create your first campaign to start promoting projects on social media'
                : 'Try adjusting your search or filters'}
            </p>
            {campaigns.length === 0 && (
              <button
                onClick={() => navigate('/agent/campaigns/create')}
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onView={(campaign) => navigate(`/agent/campaigns/${campaign.id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
