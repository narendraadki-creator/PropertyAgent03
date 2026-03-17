import { Project, CampaignType, SocialPlatform } from '../types';

export interface ContentGenerationOptions {
  project: Partial<Project>;
  campaignType: CampaignType;
  platform?: SocialPlatform;
  customMessage?: string;
}

export interface GeneratedContent {
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullContent: string;
}

const formatPrice = (price: string): string => {
  return price;
};

const getLocationHashtags = (location: string): string[] => {
  const cleanLocation = location.replace(/,/g, '').trim();
  const parts = cleanLocation.split(' ');
  const hashtags: string[] = [];

  parts.forEach(part => {
    if (part.length > 2) {
      hashtags.push(`#${part}Homes`);
      hashtags.push(`#${part}RealEstate`);
    }
  });

  return hashtags.slice(0, 2);
};

const getPropertyTypeHashtags = (type?: string): string[] => {
  if (!type) return [];

  const typeMap: Record<string, string[]> = {
    'Apartment': ['#LuxuryApartments', '#ApartmentLiving'],
    'Villa': ['#VillaLife', '#LuxuryVillas'],
    'Flat': ['#NewFlats', '#ModernLiving'],
    'Plot': ['#ResidentialPlots', '#LandInvestment'],
    'Office': ['#CommercialSpace', '#OfficeSpace']
  };

  return typeMap[type] || [];
};

const getCampaignTypeEmoji = (type: CampaignType): string => {
  const emojiMap: Record<CampaignType, string> = {
    'launch': '🚀',
    'promotion': '🎉',
    'milestone': '🏆',
    'price_drop': '💰',
    'custom': '✨'
  };

  return emojiMap[type];
};

export const generateCampaignContent = (options: ContentGenerationOptions): GeneratedContent => {
  const { project, campaignType, customMessage } = options;

  let headline = '';
  let body = '';
  let callToAction = '';
  const hashtags: string[] = [];

  const emoji = getCampaignTypeEmoji(campaignType);

  switch (campaignType) {
    case 'launch':
      headline = `${emoji} Introducing ${project.name || 'Your Dream Home'}!`;
      body = `Discover luxury living at its finest.\n\n`;
      if (project.location) body += `📍 Location: ${project.location}\n`;
      if (project.startingPrice) body += `💰 Starting at: ${formatPrice(project.startingPrice)}\n`;
      if (project.type) body += `🏠 Property Type: ${project.type}\n`;
      if (project.possessionDate) body += `🎯 Possession: ${project.possessionDate}\n`;
      body += `\n✨ Limited units available!`;
      callToAction = 'Book your dream home now! Contact us for more details.';
      hashtags.push('#NewLaunch', '#LuxuryHomes', '#RealEstate');
      break;

    case 'promotion':
      headline = `${emoji} Special Offer on ${project.name || 'Premium Properties'}!`;
      body = `Don't miss out on this exclusive opportunity!\n\n`;
      if (project.location) body += `📍 ${project.location}\n`;
      if (project.startingPrice) body += `💸 Special Price: ${formatPrice(project.startingPrice)}\n`;
      body += `\n🎁 ${customMessage || 'Limited time offer - Book now and save!'}`;
      callToAction = 'Hurry! Offer valid for a limited period only.';
      hashtags.push('#SpecialOffer', '#LimitedTimeOffer', '#DealAlert');
      break;

    case 'milestone':
      headline = `${emoji} ${project.name || 'Our Project'} - Milestone Achieved!`;
      body = `We're proud to announce a major milestone in our journey!\n\n`;
      if (customMessage) body += `${customMessage}\n\n`;
      if (project.location) body += `📍 ${project.location}\n`;
      body += `\nThank you for your trust and support!`;
      callToAction = 'Join us in celebrating this achievement!';
      hashtags.push('#MilestoneAchieved', '#Progress', '#TrustedBuilder');
      break;

    case 'price_drop':
      headline = `${emoji} Price Revision at ${project.name || 'Premium Project'}!`;
      body = `Great news! We've revised our pricing to make your dream home more affordable.\n\n`;
      if (project.location) body += `📍 Location: ${project.location}\n`;
      if (project.startingPrice) body += `💰 New Starting Price: ${formatPrice(project.startingPrice)}\n`;
      body += `\n⏰ Don't wait - Limited units at revised prices!`;
      callToAction = 'Schedule a site visit today!';
      hashtags.push('#PriceRevision', '#AffordableHomes', '#BestDeal');
      break;

    case 'custom':
      headline = `${emoji} ${project.name || 'Discover Your Dream Home'}`;
      body = customMessage || `Explore the finest in luxury living.\n\n`;
      if (project.location) body += `📍 ${project.location}\n`;
      if (project.startingPrice) body += `💰 Starting at: ${formatPrice(project.startingPrice)}\n`;
      callToAction = 'Contact us for more information!';
      hashtags.push('#RealEstate', '#PropertyInvestment');
      break;
  }

  if (project.location) {
    hashtags.push(...getLocationHashtags(project.location));
  }

  if (project.type) {
    hashtags.push(...getPropertyTypeHashtags(project.type));
  }

  const fullContent = `${headline}\n\n${body}\n\n${callToAction}\n\n${hashtags.join(' ')}`;

  return {
    headline,
    body,
    callToAction,
    hashtags: [...new Set(hashtags)].slice(0, 10),
    fullContent
  };
};

export const generatePlatformSpecificContent = (
  baseContent: GeneratedContent,
  platform: SocialPlatform
): string => {
  const { headline, body, callToAction, hashtags } = baseContent;

  switch (platform) {
    case 'twitter':
      const twitterContent = `${headline}\n\n${body.substring(0, 150)}...\n\n${hashtags.slice(0, 3).join(' ')}`;
      return twitterContent.length > 280 ? twitterContent.substring(0, 277) + '...' : twitterContent;

    case 'facebook':
    case 'linkedin':
      return `${headline}\n\n${body}\n\n${callToAction}\n\n${hashtags.join(' ')}`;

    case 'instagram':
      return `${headline}\n\n${body}\n\n${callToAction}\n\n.\n.\n.\n${hashtags.join(' ')}`;

    case 'whatsapp':
      return `*${headline}*\n\n${body}\n\n_${callToAction}_`;

    default:
      return baseContent.fullContent;
  }
};

export const getPlatformCharacterLimit = (platform: SocialPlatform): number => {
  const limits: Record<SocialPlatform, number> = {
    'twitter': 280,
    'facebook': 63206,
    'instagram': 2200,
    'linkedin': 3000,
    'whatsapp': 4096,
    'other': 10000
  };

  return limits[platform];
};

export const suggestHashtags = (project: Partial<Project>, campaignType: CampaignType): string[] => {
  const suggestions: string[] = [];

  const baseHashtags = ['#RealEstate', '#PropertyInvestment', '#DreamHome'];
  suggestions.push(...baseHashtags);

  if (project.location) {
    suggestions.push(...getLocationHashtags(project.location));
  }

  if (project.type) {
    suggestions.push(...getPropertyTypeHashtags(project.type));
  }

  const campaignHashtags: Record<CampaignType, string[]> = {
    'launch': ['#NewLaunch', '#ComingSoon', '#BookNow'],
    'promotion': ['#SpecialOffer', '#LimitedOffer', '#DealAlert'],
    'milestone': ['#MilestoneAchieved', '#Progress', '#Celebration'],
    'price_drop': ['#PriceRevision', '#BestDeal', '#AffordableHomes'],
    'custom': ['#Featured', '#TrendingNow']
  };

  suggestions.push(...campaignHashtags[campaignType]);

  return [...new Set(suggestions)];
};
