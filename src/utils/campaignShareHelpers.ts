import { Campaign } from '../types';

export interface CampaignShareData {
  message: string;
  encodedMessage: string;
  shareUrl: string;
}

export function generateCampaignShareData(campaign: Campaign): CampaignShareData {
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/agent/campaigns/${campaign.id}`;

  const location = campaign.description?.match(/📍\s*([^💰\n]+)/)?.[1]?.trim() || 'Prime Location';
  const price = campaign.budget ? `AED ${campaign.budget.toLocaleString()}` : 'Contact for Price';

  const message = `🏡 ${campaign.title}
📍 ${location}
💰 ${price}

View Details:
${shareUrl}`;

  const encodedMessage = encodeURIComponent(message);

  return {
    message,
    encodedMessage,
    shareUrl
  };
}

export function shareToWhatsApp(message: string): void {
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');
}

export function shareToFacebook(shareUrl: string): void {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(url, '_blank');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
