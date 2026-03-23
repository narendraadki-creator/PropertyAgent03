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

  const handleGenerateAudience = () => {
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

    onChange(suggestions);
    setShowAISuggestions(true);
  };

  const locations = ['Dubai Marina', 'Downtown Dubai', 'JVC', 'Arabian Ranches', 'Dubai Hills', 'Palm Jumeirah'];
  const buyerTypes = ['Investor', 'End-user', 'First-time Buyer', 'Tenant'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Target Audience</h3>
        <button
          onClick={handleGenerateAudience}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          AI Audience Builder
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
                  const newLocations = config.locations.includes(location)
                    ? config.locations.filter(l => l !== location)
                    : [...config.locations, location];
                  onChange({ ...config, locations: newLocations });
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  config.locations.includes(location)
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
                value={config.budgetMin}
                onChange={(e) => onChange({ ...config, budgetMin: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="500,000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max (AED)</label>
              <input
                type="number"
                value={config.budgetMax}
                onChange={(e) => onChange({ ...config, budgetMax: Number(e.target.value) })}
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
                  const newTypes = config.buyerTypes.includes(type)
                    ? config.buyerTypes.filter(t => t !== type)
                    : [...config.buyerTypes, type];
                  onChange({ ...config, buyerTypes: newTypes });
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  config.buyerTypes.includes(type)
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
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Sparkles className="w-4 h-4 inline mr-1" />
            AI has optimized your audience based on {propertyType || 'property'} type
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAudienceBuilder;
