import { SocialPlatform } from '../types';

export interface ShareOptions {
  platform: SocialPlatform;
  url?: string;
  text?: string;
  hashtags?: string[];
  via?: string;
}

export const getPlatformShareUrl = (options: ShareOptions): string => {
  const { platform, url, text, hashtags, via } = options;

  const encodedUrl = encodeURIComponent(url || window.location.href);
  const encodedText = encodeURIComponent(text || '');
  const hashtagString = hashtags?.map(h => h.replace('#', '')).join(',') || '';

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    case 'twitter':
      let twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
      if (url) twitterUrl += `&url=${encodedUrl}`;
      if (hashtagString) twitterUrl += `&hashtags=${encodeURIComponent(hashtagString)}`;
      if (via) twitterUrl += `&via=${encodeURIComponent(via)}`;
      return twitterUrl;

    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    case 'whatsapp':
      const whatsappText = text ? `${text}\n\n${url || ''}` : url || '';
      return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

    case 'instagram':
      return '';

    default:
      return '';
  }
};

export const openShareWindow = (url: string, platform: SocialPlatform): void => {
  const width = 600;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1`;

  if (platform === 'whatsapp') {
    window.open(url, '_blank');
  } else {
    window.open(url, 'share', features);
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const canUseNativeShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

export const shareViaNavigator = async (data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> => {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      return false;
    }
    return false;
  }
};

export const getPlatformIconName = (platform: SocialPlatform): string => {
  const iconMap: Record<SocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    linkedin: 'Linkedin',
    whatsapp: 'MessageCircle',
    other: 'Share2'
  };

  return iconMap[platform];
};

export const getPlatformColor = (platform: SocialPlatform): string => {
  const colorMap: Record<SocialPlatform, string> = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    whatsapp: '#25D366',
    other: '#6B7280'
  };

  return colorMap[platform];
};

export const getPlatformName = (platform: SocialPlatform): string => {
  const nameMap: Record<SocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    other: 'Other'
  };

  return nameMap[platform];
};

export const getPlatformImageDimensions = (platform: SocialPlatform): { width: number; height: number } => {
  const dimensions: Record<SocialPlatform, { width: number; height: number }> = {
    facebook: { width: 1200, height: 630 },
    instagram: { width: 1080, height: 1080 },
    twitter: { width: 1200, height: 675 },
    linkedin: { width: 1200, height: 627 },
    whatsapp: { width: 1080, height: 1080 },
    other: { width: 1200, height: 630 }
  };

  return dimensions[platform];
};

export const getBestPostingTimes = (platform: SocialPlatform): string[] => {
  const times: Record<SocialPlatform, string[]> = {
    facebook: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
    instagram: ['11:00 AM - 1:00 PM', '7:00 PM - 9:00 PM'],
    twitter: ['8:00 AM - 10:00 AM', '6:00 PM - 9:00 PM'],
    linkedin: ['7:00 AM - 9:00 AM', '5:00 PM - 6:00 PM'],
    whatsapp: ['9:00 AM - 11:00 AM', '8:00 PM - 10:00 PM'],
    other: ['9:00 AM - 5:00 PM']
  };

  return times[platform];
};

export const generateCampaignLandingUrl = (campaignId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/campaigns/${campaignId}`;
};

export const generateUTMUrl = (baseUrl: string, campaign: string, source: SocialPlatform): string => {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
};

export const downloadAsImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

export const generateQRCode = async (text: string): Promise<string> => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
};
