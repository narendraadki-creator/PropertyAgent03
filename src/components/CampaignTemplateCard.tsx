import { TrendingUp, Users, Clock, DollarSign, Sparkles, Crown, Target, Home, Zap, Heart } from 'lucide-react';

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
  usage_count: number;
}

interface CampaignTemplateCardProps {
  template: CampaignTemplate;
  onSelect: (template: CampaignTemplate) => void;
}

export default function CampaignTemplateCard({ template, onSelect }: CampaignTemplateCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'luxury':
        return <Crown className="w-5 h-5 text-amber-600" />;
      case 'investor':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'urgent':
        return <Zap className="w-5 h-5 text-red-600" />;
      case 'first-time':
        return <Home className="w-5 h-5 text-green-600" />;
      case 'pre-selling':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'family':
        return <Heart className="w-5 h-5 text-pink-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'luxury':
        return 'bg-amber-50 border-amber-200';
      case 'investor':
        return 'bg-blue-50 border-blue-200';
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'first-time':
        return 'bg-green-50 border-green-200';
      case 'pre-selling':
        return 'bg-purple-50 border-purple-200';
      case 'family':
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'luxury':
        return 'bg-amber-100 text-amber-800';
      case 'investor':
        return 'bg-blue-100 text-blue-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'first-time':
        return 'bg-green-100 text-green-800';
      case 'pre-selling':
        return 'bg-purple-100 text-purple-800';
      case 'family':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer ${getCategoryColor(template.category)}`}
         onClick={() => onSelect(template)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
            {getCategoryIcon(template.category)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getCategoryBadgeColor(template.category)}`}>
              {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
            </span>
          </div>
        </div>
        {template.usage_count > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span>{template.usage_count} uses</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{template.description}</p>

      <div className="space-y-3 mb-5">
        <div className="bg-white rounded-lg p-3">
          <div className="text-sm font-medium text-gray-600 mb-1">Target Audience</div>
          <div className="text-sm text-gray-900">{template.target_audience}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Budget</span>
            </div>
            <div className="font-semibold text-gray-900">{formatBudget(template.default_budget)}</div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Duration</span>
            </div>
            <div className="font-semibold text-gray-900">{template.default_duration_days} days</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 mb-4">
        <div className="text-xs font-medium text-gray-600 mb-2">Platform Distribution</div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(template.default_platforms).map(([platform, percentage]) => (
            <div key={platform} className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
              <span className="font-medium capitalize">{platform}</span>
              <span className="text-gray-600">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
        Use This Template
      </button>
    </div>
  );
}
