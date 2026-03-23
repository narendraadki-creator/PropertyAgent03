import { TrendingUp, TrendingDown, DollarSign, Target, Award, Users } from 'lucide-react';

interface ROIData {
  total_spend: number;
  deals_closed: number;
  revenue_generated: number;
  roi_percentage: number;
  cost_per_lead: number;
  conversion_rate: number;
  avg_deal_value: number;
}

interface CampaignROICardProps {
  roi: ROIData;
  leadsCount: number;
}

export default function CampaignROICard({ roi, leadsCount }: CampaignROICardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const isPositiveROI = roi.roi_percentage >= 0;
  const profit = roi.revenue_generated - roi.total_spend;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">ROI Performance</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          isPositiveROI ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isPositiveROI ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
          <span className="font-bold">{formatPercentage(roi.roi_percentage)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Total Spend</span>
          </div>
          <div className="text-xl font-bold text-blue-900">
            {formatCurrency(roi.total_spend)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Revenue</span>
          </div>
          <div className="text-xl font-bold text-green-900">
            {formatCurrency(roi.revenue_generated)}
          </div>
        </div>

        <div className={`bg-gradient-to-br rounded-lg p-4 ${
          isPositiveROI
            ? 'from-emerald-50 to-emerald-100'
            : 'from-red-50 to-red-100'
        }`}>
          <div className={`flex items-center gap-2 mb-2 ${
            isPositiveROI ? 'text-emerald-600' : 'text-red-600'
          }`}>
            <Award className="w-4 h-4" />
            <span className="text-xs font-medium">Profit</span>
          </div>
          <div className={`text-xl font-bold ${
            isPositiveROI ? 'text-emerald-900' : 'text-red-900'
          }`}>
            {formatCurrency(profit)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">Deals Closed</span>
          </div>
          <div className="text-xl font-bold text-purple-900">
            {roi.deals_closed}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-lg font-bold text-gray-900">
            {roi.conversion_rate.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {roi.deals_closed} deals from {leadsCount} leads
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Cost Per Lead</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(roi.cost_per_lead)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {leadsCount} leads generated
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Avg Deal Value</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(roi.avg_deal_value)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Per closed deal
          </div>
        </div>
      </div>

      {roi.deals_closed === 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">No Deals Closed Yet</h4>
              <p className="text-sm text-amber-800">
                Track your deals to calculate accurate ROI metrics and campaign performance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
