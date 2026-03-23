import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, CampaignType, SocialPlatform } from '../types';
import { supabase } from '../lib/supabase';
import ShareableContentGenerator from '../components/ShareableContentGenerator';
import SocialMediaPreview from '../components/SocialMediaPreview';
import SocialMediaShareButton from '../components/SocialMediaShareButton';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function AgentEditCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    campaignType: 'launch' as CampaignType,
    startDate: '',
    endDate: '',
    budget: '',
    targetPlatforms: [] as SocialPlatform[],
    customMessage: ''
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('facebook');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    console.log('Fetching campaign data for edit page, ID:', id);
    try {
      const [projectsRes, campaignRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').eq('id', id).maybeSingle()
      ]);

      console.log('Projects loaded:', projectsRes.data?.length);
      console.log('Campaign loaded:', campaignRes.data);

      if (projectsRes.data) {
        setProjects(projectsRes.data as any);
      }

      if (campaignRes.data) {
        const campaign = campaignRes.data;
        console.log('Setting form data from campaign:', campaign);

        setFormData({
          projectId: campaign.project_id || '',
          title: campaign.title || '',
          description: campaign.description || '',
          campaignType: campaign.campaign_type || 'launch',
          startDate: campaign.start_date || '',
          endDate: campaign.end_date || '',
          budget: campaign.budget ? campaign.budget.toString() : '',
          targetPlatforms: campaign.target_platforms || [],
          customMessage: ''
        });

        if (campaign.content_template?.content) {
          setGeneratedContent(campaign.content_template.content);
        }
        if (campaign.content_template?.hashtags) {
          setHashtags(campaign.content_template.hashtags);
        }
        if (campaign.target_platforms?.[0]) {
          setPreviewPlatform(campaign.target_platforms[0]);
        }
      } else {
        console.error('No campaign found with ID:', id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = projects.find(p => p.id === formData.projectId);

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setFormData(prev => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter(p => p !== platform)
        : [...prev.targetPlatforms, platform]
    }));
  };

  const handleContentGenerated = (content: string, tags: string[]) => {
    setGeneratedContent(content);
    setHashtags(tags);
  };

  const handleUpdateCampaign = async () => {
    if (!formData.projectId) {
      alert('Please select a project');
      return;
    }
    if (!formData.title) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          project_id: formData.projectId,
          title: formData.title,
          description: formData.description,
          campaign_type: formData.campaignType,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          start_date: formData.startDate || null,
          end_date: formData.endDate || null,
          target_platforms: formData.targetPlatforms,
          creative_assets: {
            projectImage: selectedProject?.image
          },
          content_template: {
            content: generatedContent,
            hashtags: hashtags
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await supabase.from('campaign_activities').insert({
        campaign_id: id,
        activity_type: 'campaign_updated',
        description: 'Campaign details updated',
        metadata: { updated_fields: ['title', 'description', 'budget', 'dates'] }
      });

      navigate(`/agent/campaigns/${id}`);
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      alert(`Failed to update campaign: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { number: 1, title: 'Campaign Details', description: 'Basic information' },
    { number: 2, title: 'Platform Selection', description: 'Choose where to share' },
    { number: 3, title: 'Content Creation', description: 'Generate content' },
    { number: 4, title: 'Preview & Share', description: 'Review and publish' }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.projectId && formData.title && formData.campaignType;
      case 2:
        return formData.targetPlatforms.length > 0;
      case 3:
        return generatedContent !== '';
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(`/agent/campaigns/${id}`)}
            className="flex items-center gap-2 text-teal-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaign
          </button>
          <h1 className="text-3xl font-bold mb-2">Edit Campaign</h1>
          <p className="text-teal-100">Update your campaign details</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <p className="text-xs font-medium text-gray-700 mt-2 text-center">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Campaign Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Grand Launch - Summer 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the campaign..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(['launch', 'promotion', 'milestone', 'price_drop', 'custom'] as CampaignType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, campaignType: type })}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        formData.campaignType === type
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (AED)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Select Platforms</h2>
              <p className="text-gray-600">Choose the social media platforms where you want to share this campaign</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp'] as SocialPlatform[]).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`p-6 rounded-lg border-2 text-center transition-all ${
                      formData.targetPlatforms.includes(platform)
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-300 hover:border-teal-400'
                    }`}
                  >
                    <div className="text-2xl mb-2 capitalize font-semibold">{platform}</div>
                    {formData.targetPlatforms.includes(platform) && (
                      <div className="flex items-center justify-center gap-1 text-teal-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && selectedProject && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Generate Content</h2>
              <ShareableContentGenerator
                project={selectedProject}
                campaignType={formData.campaignType}
                onContentGenerated={handleContentGenerated}
              />
            </div>
          )}

          {currentStep === 4 && selectedProject && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Preview & Share</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Platform
                </label>
                <select
                  value={previewPlatform}
                  onChange={(e) => setPreviewPlatform(e.target.value as SocialPlatform)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {formData.targetPlatforms.map((platform) => (
                    <option key={platform} value={platform} className="capitalize">
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <SocialMediaPreview
                platform={previewPlatform}
                content={generatedContent}
                imageUrl={selectedProject.image}
                projectName={selectedProject.name}
              />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share on Social Media</h3>
                <SocialMediaShareButton
                  content={generatedContent}
                  hashtags={hashtags}
                  platforms={formData.targetPlatforms}
                  title={formData.title}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleUpdateCampaign}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {saving ? 'Updating...' : 'Update Campaign'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
