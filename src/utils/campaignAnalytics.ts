import { supabase } from '../lib/supabase';

export interface ShareAnalytics {
  platform: string;
  count: number;
}

export interface CampaignShareStats {
  totalShares: number;
  byPlatform: ShareAnalytics[];
  topPerformingChannel: string | null;
}

export async function getCampaignShareAnalytics(campaignId: string): Promise<CampaignShareStats> {
  try {
    const { data, error } = await supabase
      .from('campaign_share_events')
      .select('platform')
      .eq('campaign_id', campaignId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        totalShares: 0,
        byPlatform: [],
        topPerformingChannel: null
      };
    }

    const platformCounts: Record<string, number> = {};

    data.forEach(event => {
      platformCounts[event.platform] = (platformCounts[event.platform] || 0) + 1;
    });

    const byPlatform: ShareAnalytics[] = Object.entries(platformCounts)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);

    const topPerformingChannel = byPlatform.length > 0 ? byPlatform[0].platform : null;

    return {
      totalShares: data.length,
      byPlatform,
      topPerformingChannel
    };
  } catch (error) {
    console.error('Error fetching share analytics:', error);
    return {
      totalShares: 0,
      byPlatform: [],
      topPerformingChannel: null
    };
  }
}

export async function getAllCampaignsShareAnalytics(): Promise<Map<string, CampaignShareStats>> {
  try {
    const { data, error } = await supabase
      .from('campaign_share_events')
      .select('campaign_id, platform');

    if (error) throw error;

    const analyticsMap = new Map<string, CampaignShareStats>();

    if (!data || data.length === 0) {
      return analyticsMap;
    }

    const campaignGroups: Record<string, any[]> = {};

    data.forEach(event => {
      if (!campaignGroups[event.campaign_id]) {
        campaignGroups[event.campaign_id] = [];
      }
      campaignGroups[event.campaign_id].push(event);
    });

    Object.entries(campaignGroups).forEach(([campaignId, events]) => {
      const platformCounts: Record<string, number> = {};

      events.forEach(event => {
        platformCounts[event.platform] = (platformCounts[event.platform] || 0) + 1;
      });

      const byPlatform: ShareAnalytics[] = Object.entries(platformCounts)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count);

      const topPerformingChannel = byPlatform.length > 0 ? byPlatform[0].platform : null;

      analyticsMap.set(campaignId, {
        totalShares: events.length,
        byPlatform,
        topPerformingChannel
      });
    });

    return analyticsMap;
  } catch (error) {
    console.error('Error fetching all campaigns share analytics:', error);
    return new Map();
  }
}
