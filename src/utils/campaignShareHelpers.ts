import { Campaign } from '../types';
import { supabase } from '../lib/supabase';

export interface CampaignShareData {
  message: string;
  encodedMessage: string;
  shareUrl: string;
}

export type SharePlatform = 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'email' | 'copy_link';

export async function trackShareEvent(campaignId: string, platform: SharePlatform): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('campaign_share_events').insert({
      campaign_id: campaignId,
      platform,
      shared_by: user?.id || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking share event:', error);
  }
}

export function generateCampaignShareData(campaign: Campaign): CampaignShareData {
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/campaign/${campaign.id}`;

  const location = campaign.description?.match(/📍\s*([^💰\n]+)/)?.[1]?.trim() ||
                   (campaign.targetAudience?.toLowerCase().includes('bangalore') ? 'Bangalore, Whitefield' : 'Prime Location');

  const budget = campaign.budget ? `AED ${campaign.budget.toLocaleString()}` : 'Contact for Price';

  const urgencyText = campaign.endDate
    ? `⏰ Don't wait - Limited units at revised prices!`
    : `⏰ Don't wait - Limited units at revised prices!`;

  const ctaText = campaign.ctaText || '_Schedule a site visit today!_';

  const message = `🏡 *${campaign.title}*

${campaign.description || 'Great news! We\'ve revised our pricing to make your dream home more affordable.'}

📍 Location: ${location}

${urgencyText}

${ctaText}`;

  const encodedMessage = encodeURIComponent(message);

  return {
    message,
    encodedMessage,
    shareUrl
  };
}

export function shareToWhatsApp(campaignId: string, encodedMessage?: string): void {
  trackShareEvent(campaignId, 'whatsapp');
  const message = encodedMessage || '';
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');
}

export function shareToFacebook(campaignId: string, shareUrl: string): void {
  trackShareEvent(campaignId, 'facebook');
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(url, '_blank');
}

export function shareToInstagram(campaignId: string): void {
  trackShareEvent(campaignId, 'instagram');
  const baseUrl = window.location.origin;
  const campaignUrl = `${baseUrl}/campaign/${campaignId}`;
  navigator.clipboard.writeText(campaignUrl);
  alert('Campaign link copied! Share it via Instagram app.');
}

export function shareToLinkedIn(campaignId: string, shareUrl: string): void {
  trackShareEvent(campaignId, 'linkedin');
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  window.open(url, '_blank');
}

export function shareToTwitter(campaignId: string, message?: string, shareUrl?: string): void {
  trackShareEvent(campaignId, 'twitter');
  const baseUrl = window.location.origin;
  const campaignUrl = `${baseUrl}/campaign/${campaignId}`;
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(campaignUrl)}`;
  window.open(url, '_blank');
}

export function shareToEmail(campaignId: string, subject: string): void {
  trackShareEvent(campaignId, 'email');
  const baseUrl = window.location.origin;
  const campaignUrl = `${baseUrl}/campaign/${campaignId}`;
  const body = `Check out this property campaign:\n\n${campaignUrl}`;
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

export async function copyToClipboard(campaignId: string, text: string): Promise<void> {
  await trackShareEvent(campaignId, 'copy_link');
  return navigator.clipboard.writeText(text);
}
