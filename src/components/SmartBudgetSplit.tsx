import React, { useState, useEffect } from 'react';
import { Sparkles, Facebook, Instagram, Globe, MessageCircle, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

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
  const [showRecommendations, setShowRecommendations] = useState(false);

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
    {
      key: 'facebook' as const,
      name: 'Facebook Ads',
      icon: Facebook,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      recommendation: 'Great for broad reach and demographics targeting',
      performanceScore: 85
    },
    {
      key: 'instagram' as const,
      name: 'Instagram Ads',
      icon: Instagram,
      color: 'bg-pink-600',
      textColor: 'text-pink-600',
      recommendation: 'Highest engagement for visual content',
      performanceScore: 92
    },
    {
      key: 'google' as const,
      name: 'Google Ads',
      icon: Globe,
      color: 'bg-green-600',
      textColor: 'text-green-600',
      recommendation: 'Best for intent-based searches',
      performanceScore: 78
    },
    {
      key: 'whatsapp' as const,
      name: 'WhatsApp Broadcast',
      icon: MessageCircle,
      color: 'bg-teal-600',
      textColor: 'text-teal-600',
      recommendation: 'Direct communication with warm leads',
      performanceScore: 88
    }
  ];

  const getPercentage = (amount: number) => {
    return totalBudget > 0 ? ((amount / totalBudget) * 100).toFixed(1) : '0';
  };

  const getTotalAllocated = () => {
    return Object.values(distribution).reduce((a, b) => a + b, 0);
  };

  const getVariance = () => {
    return getTotalAllocated() - totalBudget;
  };

  const isBalanced = () => {
    return Math.abs(getVariance()) < 1;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Budget Distribution</h3>
          {isBalanced() && (
            <CheckCircle className="w-4 h-4 text-green-600" title="Budget balanced" />
          )}
        </div>
        <button
          onClick={autoOptimize}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          Auto Optimize
        </button>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Total Campaign Budget</label>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">AED {totalBudget.toLocaleString()}</span>
          <span className="text-sm text-gray-600">allocated across 4 channels</span>
        </div>
      </div>

      {!isBalanced() && (
        <div className={`mb-4 p-3 rounded-lg border flex items-start gap-2 ${
          getVariance() > 0 ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            getVariance() > 0 ? 'text-orange-600' : 'text-blue-600'
          }`} />
          <div>
            <p className={`text-sm font-medium ${
              getVariance() > 0 ? 'text-orange-900' : 'text-blue-900'
            }`}>
              {getVariance() > 0 ? 'Over Budget' : 'Under Budget'}
            </p>
            <p className={`text-xs ${
              getVariance() > 0 ? 'text-orange-700' : 'text-blue-700'
            }`}>
              {getVariance() > 0 ? 'Reduce' : 'Add'} AED {Math.abs(getVariance()).toLocaleString()} to match total budget
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {channels.map(({ key, name, icon: Icon, color, textColor, recommendation, performanceScore }) => (
          <div key={key} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${color} bg-opacity-10`}>
                  <Icon className={`w-4 h-4 ${textColor}`} />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600">Performance: {performanceScore}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    AED {distribution[key].toLocaleString()}
                  </div>
                  <div className={`text-xs font-medium ${textColor}`}>
                    {getPercentage(distribution[key])}%
                  </div>
                </div>
                <input
                  type="number"
                  value={distribution[key]}
                  onChange={(e) => onChange({ ...distribution, [key]: Number(e.target.value) || 0 })}
                  className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full ${color} transition-all duration-300`}
                style={{ width: `${getPercentage(distribution[key])}%` }}
              ></div>
            </div>
            {showRecommendations && (
              <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                <Sparkles className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                {recommendation}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowRecommendations(!showRecommendations)}
        className="w-full mb-4 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-1 py-2"
      >
        <Sparkles className="w-4 h-4" />
        {showRecommendations ? 'Hide' : 'Show'} Performance Recommendations
      </button>

      <div className={`p-4 rounded-lg border-2 ${
        isBalanced()
          ? 'bg-green-50 border-green-200'
          : getVariance() > 0
          ? 'bg-orange-50 border-orange-200'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Total Allocated</span>
          <span className={`text-lg font-bold ${
            isBalanced() ? 'text-green-900' : getVariance() > 0 ? 'text-orange-900' : 'text-blue-900'
          }`}>
            AED {getTotalAllocated().toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Campaign Budget</span>
          <span className="text-gray-900 font-medium">AED {totalBudget.toLocaleString()}</span>
        </div>
        {!isBalanced() && (
          <div className="flex justify-between items-center text-xs mt-1 pt-2 border-t border-gray-300">
            <span className={getVariance() > 0 ? 'text-orange-700' : 'text-blue-700'}>
              {getVariance() > 0 ? 'Over' : 'Under'} Budget
            </span>
            <span className={`font-semibold ${getVariance() > 0 ? 'text-orange-900' : 'text-blue-900'}`}>
              AED {Math.abs(getVariance()).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartBudgetSplit;
