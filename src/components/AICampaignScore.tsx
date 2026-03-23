import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

interface AICampaignScoreProps {
  score: number;
  insights?: string[];
}

const AICampaignScore: React.FC<AICampaignScoreProps> = ({ score, insights = [] }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className={`rounded-lg p-4 ${getScoreBgColor(score)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-5 h-5 ${getScoreColor(score)}`} />
          <h3 className="font-semibold text-gray-900">Campaign Strength Score</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{getScoreLabel(score)}</span>
          <span className="text-gray-600">{score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {insights && insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AICampaignScore;
