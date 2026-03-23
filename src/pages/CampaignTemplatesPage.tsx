import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Crown, TrendingUp, Zap, Home, Sparkles, Heart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CampaignTemplateCard from '../components/CampaignTemplateCard';

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  category: string;
  default_budget: number;
  default_duration_days: number;
  default_platforms: Record<string, number>;
  default_content: Record<string, any>;
  default_audience_criteria: Record<string, any>;
  usage_count: number;
}

export default function CampaignTemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<CampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates', icon: Filter },
    { id: 'luxury', name: 'Luxury', icon: Crown },
    { id: 'investor', name: 'Investor', icon: TrendingUp },
    { id: 'urgent', name: 'Urgent Sale', icon: Zap },
    { id: 'first-time', name: 'First-Time', icon: Home },
    { id: 'pre-selling', name: 'Pre-Selling', icon: Sparkles },
    { id: 'family', name: 'Family', icon: Heart },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.target_audience.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = (template: CampaignTemplate) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/agent/campaigns/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/agent/campaigns')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Campaign Templates Library</h1>
            <p className="text-teal-100 text-lg">
              Choose from professionally designed campaign templates to jumpstart your marketing
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-white/70 ml-3" />
            <input
              type="text"
              placeholder="Search templates by name, audience, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/60 py-3 px-2"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-white text-teal-700 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <CampaignTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Use Campaign Templates?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600 text-sm">
                Pre-configured campaigns with proven settings and targeting
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600 text-sm">
                Based on successful campaigns from top-performing agents
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Customization</h3>
              <p className="text-gray-600 text-sm">
                Use as-is or customize to match your specific needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
