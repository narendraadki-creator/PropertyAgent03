import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface AIContentGeneratorProps {
  propertyName?: string;
  propertyType?: string;
  onGenerate: (content: { title: string; description: string; cta: string }) => void;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ propertyName, propertyType, onGenerate }) => {
  const [audienceType, setAudienceType] = useState<'luxury' | 'investor' | 'firsttime'>('luxury');
  const [copied, setCopied] = useState(false);

  const generateContent = () => {
    const templates = {
      luxury: {
        title: `Exclusive ${propertyName || 'Luxury Property'} - Premium Living Awaits`,
        description: `Experience unparalleled luxury in this stunning ${propertyType || 'residence'}. Featuring world-class amenities, breathtaking views, and sophisticated design. This is more than a home - it's a lifestyle statement.`,
        cta: 'Schedule Private Viewing'
      },
      investor: {
        title: `High-ROI Investment Opportunity - ${propertyName || 'Premium Property'}`,
        description: `Smart investment with projected 8-12% annual returns. Prime location, high rental demand, and strong appreciation potential. Perfect for portfolio diversification.`,
        cta: 'Get Investment Analysis'
      },
      firsttime: {
        title: `Your Dream Home Awaits - ${propertyName || 'Perfect Starter Home'}`,
        description: `Start your homeownership journey with this beautiful ${propertyType || 'property'}. Flexible payment plans, prime location near schools and amenities. Your family deserves this!`,
        cta: 'Book a Visit Today'
      }
    };

    onGenerate(templates[audienceType]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Campaign Content</h3>
        <button
          onClick={generateContent}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Target Audience</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setAudienceType('luxury')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              audienceType === 'luxury'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Luxury Buyers
          </button>
          <button
            onClick={() => setAudienceType('investor')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              audienceType === 'investor'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Investors
          </button>
          <button
            onClick={() => setAudienceType('firsttime')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              audienceType === 'firsttime'
                ? 'bg-teal-600 text-white'
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
              placeholder="Enter ad title or generate with AI"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              onClick={() => handleCopy('Ad title')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea
            rows={4}
            placeholder="Enter description or generate with AI"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Call to Action</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option>Call Now</option>
            <option>WhatsApp Us</option>
            <option>Book Visit</option>
            <option>Get Brochure</option>
            <option>Schedule Viewing</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator;
