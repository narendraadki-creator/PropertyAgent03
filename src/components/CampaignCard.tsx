import { useState } from 'react';
import { Campaign } from '../types';
import { Calendar, BarChart3, Eye, Share2, CreditCard as EditIcon, Trash2, Share } from 'lucide-react';
import CampaignShareModal from './CampaignShareModal';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onView?: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onEdit, onDelete, onView }: CampaignCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      launch: 'Launch',
      promotion: 'Promotion',
      milestone: 'Milestone',
      price_drop: 'Price Drop',
      custom: 'Custom'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(campaign.status)}`}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
          <span className="px-3 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700">
            {getCampaignTypeLabel(campaign.campaignType)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.title}</h3>

        {campaign.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{campaign.description}</p>
        )}

        {campaign.startDate && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {formatDate(campaign.startDate)}
              {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
            </span>
          </div>
        )}

        {campaign.targetPlatforms && campaign.targetPlatforms.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {campaign.targetPlatforms.map((platform) => (
                <span
                  key={platform}
                  className="text-sm text-gray-600 capitalize"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {campaign.performanceMetrics?.views || 0}
              </p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {campaign.performanceMetrics?.shares || 0}
              </p>
              <p className="text-xs text-gray-500">Shares</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {campaign.performanceMetrics?.clicks || 0}
              </p>
              <p className="text-xs text-gray-500">Clicks</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {onView && (
            <button
              onClick={() => onView(campaign)}
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            title="Share Campaign"
          >
            <Share className="w-4 h-4" />
          </button>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(campaign);
              }}
              className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Edit Campaign"
            >
              <EditIcon className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(campaign);
              }}
              className="px-4 py-2.5 border border-gray-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete Campaign"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <CampaignShareModal
        campaign={campaign}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
