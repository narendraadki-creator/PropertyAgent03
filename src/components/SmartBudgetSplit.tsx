import React from 'react';
import { Sparkles, Facebook, Instagram, Globe, MessageCircle } from 'lucide-react';

interface ChannelBudget {
  facebook: number;
  instagram: number;
  google: number;
  whatsapp: number;
}

interface SmartBudgetSplitProps {
  totalBudget: number;
  distribution: ChannelBudget;
  onChange: (distribution: ChannelBudget) => void;
}

const SmartBudgetSplit: React.FC<SmartBudgetSplitProps> = ({ totalBudget, distribution, onChange }) => {
  const autoOptimize = () => {
    const optimized: ChannelBudget = {
      facebook: Math.round(totalBudget * 0.25),
      instagram: Math.round(totalBudget * 0.40),
      google: Math.round(totalBudget * 0.20),
      whatsapp: Math.round(totalBudget * 0.15)
    };
    onChange(optimized);
  };

  const channels = [
    { key: 'facebook' as const, name: 'Facebook Ads', icon: Facebook, color: 'blue' },
    { key: 'instagram' as const, name: 'Instagram Ads', icon: Instagram, color: 'pink' },
    { key: 'google' as const, name: 'Google Ads', icon: Globe, color: 'green' },
    { key: 'whatsapp' as const, name: 'WhatsApp Broadcast', icon: MessageCircle, color: 'teal' }
  ];

  const getPercentage = (amount: number) => {
    return totalBudget > 0 ? ((amount / totalBudget) * 100).toFixed(0) : 0;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Budget Distribution</h3>
        <button
          onClick={autoOptimize}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Auto Optimize
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Total Budget (AED)</label>
        <input
          type="number"
          value={totalBudget}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
      </div>

      <div className="space-y-4">
        {channels.map(({ key, name, icon: Icon, color }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${color}-600`} />
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{getPercentage(distribution[key])}%</span>
                <input
                  type="number"
                  value={distribution[key]}
                  onChange={(e) => onChange({ ...distribution, [key]: Number(e.target.value) })}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${color}-600 transition-all duration-300`}
                style={{ width: `${getPercentage(distribution[key])}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Allocated</span>
          <span className="font-semibold text-gray-900">
            AED {Object.values(distribution).reduce((a, b) => a + b, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmartBudgetSplit;
