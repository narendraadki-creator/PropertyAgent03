import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface AIContentGeneratorProps {
  propertyName?: string;
  propertyType?: string;
  onGenerate: (content: { title: string; description: string; cta: string }) => void;
  initialTitle?: string;
  initialDescription?: string;
  initialCta?: string;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  propertyName,
  propertyType,
  onGenerate,
  initialTitle = '',
  initialDescription = '',
  initialCta = 'Call Now'
}) => {
  const [audienceType, setAudienceType] = useState<'luxury' | 'investor' | 'firsttime'>('luxury');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{ title: string; description: string; cta: string } | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [cta, setCta] = useState(initialCta);
  const [showSuccess, setShowSuccess] = useState(false);

  const generateContent = () => {
    console.log('Generating content for audience type:', audienceType);

    const templates = {
      luxury: {
        title: `Exclusive ${propertyName || 'Luxury Property'} - Premium Living Awaits`,
        description: `Experience unparalleled luxury in this stunning ${propertyType || 'residence'}. Featuring world-class amenities, breathtaking views, and sophisticated design. This is more than a home - it's a lifestyle statement for the discerning elite.`,
        cta: 'Schedule Private Viewing'
      },
      investor: {
        title: `High-ROI Investment Opportunity - ${propertyName || 'Premium Property'}`,
        description: `Smart investment with projected 8-12% annual returns in Dubai's thriving real estate market. Prime location ensures high rental demand and strong appreciation potential. Perfect addition for portfolio diversification and wealth building.`,
        cta: 'Get Investment Analysis'
      },
      firsttime: {
        title: `Your Dream Home Awaits - ${propertyName || 'Perfect Starter Home'}`,
        description: `Start your homeownership journey with this beautiful ${propertyType || 'property'}. Flexible payment plans available, prime location near schools and amenities. Make your family's dream of homeownership a reality!`,
        cta: 'Book a Visit Today'
      }
    };

    const content = templates[audienceType];
    setGeneratedContent(content);
    setTitle(content.title);
    setDescription(content.description);
    setCta(content.cta);
    setShowSuccess(true);
    onGenerate(content);

    console.log('Generated content:', content);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Campaign Content</h3>
          {generatedContent && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>
        <button
          onClick={generateContent}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Select Audience Type</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setAudienceType('luxury')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              audienceType === 'luxury'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Luxury Buyers
          </button>
          <button
            onClick={() => setAudienceType('investor')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              audienceType === 'investor'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Investors
          </button>
          <button
            onClick={() => setAudienceType('firsttime')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              audienceType === 'firsttime'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            First-time Buyers
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Ad Title</label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Click 'Generate with AI' to create content"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              onClick={() => handleCopy('title', title)}
              disabled={!title}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy title"
            >
              {copiedField === 'title' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <div className="relative">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Click 'Generate with AI' to create content"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            <button
              onClick={() => handleCopy('description', description)}
              disabled={!description}
              className="absolute right-2 top-2 p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy description"
            >
              {copiedField === 'description' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Call to Action</label>
          <select
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="Call Now">Call Now</option>
            <option value="WhatsApp Us">WhatsApp Us</option>
            <option value="Book Visit">Book Visit</option>
            <option value="Get Brochure">Get Brochure</option>
            <option value="Schedule Viewing">Schedule Viewing</option>
            <option value="Schedule Private Viewing">Schedule Private Viewing</option>
            <option value="Get Investment Analysis">Get Investment Analysis</option>
            <option value="Book a Visit Today">Book a Visit Today</option>
          </select>
        </div>
      </div>

      {showSuccess && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-900 mb-1">
                Content Generated Successfully!
              </p>
              <p className="text-xs text-purple-700">
                Created {audienceType === 'luxury' ? 'luxury-focused' : audienceType === 'investor' ? 'investment-focused' : 'first-time buyer-friendly'} content optimized for your target audience
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
