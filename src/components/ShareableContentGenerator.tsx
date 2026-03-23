import { useState, useEffect } from 'react';
import { Project, CampaignType, SocialPlatform } from '../types';
import { generateCampaignContent, generatePlatformSpecificContent } from '../utils/campaignContentGenerator';
import { Wand2, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/socialMediaHelpers';

interface ShareableContentGeneratorProps {
  project: Partial<Project>;
  campaignType: CampaignType;
  onContentGenerated?: (content: string, hashtags: string[]) => void;
}

export default function ShareableContentGenerator({
  project,
  campaignType,
  onContentGenerated
}: ShareableContentGeneratorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('facebook');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp'];

  const handleGenerate = () => {
    const baseContent = generateCampaignContent({
      project,
      campaignType,
      customMessage: customMessage || undefined
    });

    const platformContent = generatePlatformSpecificContent(baseContent, selectedPlatform);

    setGeneratedContent(platformContent);
    setHashtags(baseContent.hashtags);

    if (onContentGenerated) {
      onContentGenerated(platformContent, baseContent.hashtags);
    }
  };

  useEffect(() => {
    if (project && campaignType) {
      handleGenerate();
    }
  }, [project.id, campaignType]);

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCampaignTypeLabel = (type: CampaignType) => {
    const labels: Record<CampaignType, string> = {
      launch: 'Launch Campaign',
      promotion: 'Promotional Campaign',
      milestone: 'Milestone Announcement',
      price_drop: 'Price Revision Campaign',
      custom: 'Custom Campaign'
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Generate Campaign Content
        </h3>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-teal-800">
            <strong>Campaign Type:</strong> {getCampaignTypeLabel(campaignType)}
          </p>
          <p className="text-sm text-teal-800 mt-1">
            <strong>Project:</strong> {project.name || 'Not specified'}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Platform
        </label>
        <div className="grid grid-cols-5 gap-2">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                selectedPlatform === platform
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Message (Optional)
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Add a custom message to personalize your campaign..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
      >
        <Wand2 className="w-5 h-5" />
        Generate Content
      </button>

      {generatedContent && (
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-300 flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Generated Content</h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{generatedContent}</p>
            </div>
          </div>

          {hashtags.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Suggested Hashtags</h5>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> You can edit the generated content before sharing. Click "Copy" to copy it to your clipboard and paste it into your social media platform.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
