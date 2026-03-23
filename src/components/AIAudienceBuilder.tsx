import React, { useState } from 'react';
import { Sparkles, MapPin, DollarSign, Users } from 'lucide-react';

interface AudienceConfig {
  locations: string[];
  budgetMin: number;
  budgetMax: number;
  buyerTypes: string[];
}

interface AIAudienceBuilderProps {
  config: AudienceConfig;
  onChange: (config: AudienceConfig) => void;
  propertyType?: string;
}

const AIAudienceBuilder: React.FC<AIAudienceBuilderProps> = ({ config, onChange, propertyType }) => {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const safeConfig: AudienceConfig = {
    locations: config?.locations || [],
    budgetMin: config?.budgetMin || 0,
    budgetMax: config?.budgetMax || 0,
    buyerTypes: config?.buyerTypes || []
  };

  const handleGenerateAudience = () => {
    console.log('Generating AI audience for property type:', propertyType);

    const suggestions: AudienceConfig = {
      locations: propertyType === 'luxury'
        ? ['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai']
        : ['Dubai Hills', 'JVC', 'Arabian Ranches'],
      budgetMin: propertyType === 'luxury' ? 2000000 : 500000,
      budgetMax: propertyType === 'luxury' ? 10000000 : 2000000,
      buyerTypes: propertyType === 'luxury'
        ? ['Investor', 'End-user']
        : ['First-time Buyer', 'End-user']
    };

    console.log('AI generated suggestions:', suggestions);
    onChange(suggestions);
    setShowAISuggestions(true);
    setAiGenerated(true);

    setTimeout(() => setShowAISuggestions(false), 5000);
  };

  const locations = ['Dubai Marina', 'Downtown Dubai', 'JVC', 'Arabian Ranches', 'Dubai Hills', 'Palm Jumeirah'];
  const buyerTypes = ['Investor', 'End-user', 'First-time Buyer', 'Tenant'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Target Audience</h3>
          {aiGenerated && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>
        <button
          onClick={handleGenerateAudience}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            Locations
          </label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => {
                  const newLocations = safeConfig.locations.includes(location)
                    ? safeConfig.locations.filter(l => l !== location)
                    : [...safeConfig.locations, location];
                  onChange({ ...safeConfig, locations: newLocations });
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  safeConfig.locations.includes(location)
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            Budget Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Min (AED)</label>
              <input
                type="number"
                value={safeConfig.budgetMin}
                onChange={(e) => onChange({ ...safeConfig, budgetMin: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="500,000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max (AED)</label>
              <input
                type="number"
                value={safeConfig.budgetMax}
                onChange={(e) => onChange({ ...safeConfig, budgetMax: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="2,000,000"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4" />
            Buyer Type
          </label>
          <div className="flex flex-wrap gap-2">
            {buyerTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  const newTypes = safeConfig.buyerTypes.includes(type)
                    ? safeConfig.buyerTypes.filter(t => t !== type)
                    : [...safeConfig.buyerTypes, type];
                  onChange({ ...safeConfig, buyerTypes: newTypes });
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  safeConfig.buyerTypes.includes(type)
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showAISuggestions && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-900 mb-1">
                AI Audience Generated Successfully!
              </p>
              <p className="text-xs text-purple-700">
                Optimized for {propertyType || 'property'} type properties with {safeConfig.locations.length} locations,
                budget range AED {safeConfig.budgetMin.toLocaleString()} - {safeConfig.budgetMax.toLocaleString()},
                targeting {safeConfig.buyerTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAudienceBuilder;
