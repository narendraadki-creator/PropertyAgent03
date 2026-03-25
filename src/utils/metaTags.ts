import { Campaign } from '../types';

const DEFAULT_CAMPAIGN_IMAGE = 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function updateMetaTags(campaign: Campaign): void {
  const title = campaign.title;
  const description = campaign.description || `${campaign.title} - View campaign details`;
  const imageUrl = campaign.creativeAssets?.projectImage || campaign.creativeAssets?.images?.[0] || DEFAULT_CAMPAIGN_IMAGE;
  const url = `${window.location.origin}/agent/campaigns/${campaign.id}`;

  document.title = title;

  updateOrCreateMetaTag('og:title', title);
  updateOrCreateMetaTag('og:description', description);
  updateOrCreateMetaTag('og:image', imageUrl);
  updateOrCreateMetaTag('og:url', url);
  updateOrCreateMetaTag('og:type', 'website');

  updateOrCreateMetaTag('twitter:card', 'summary_large_image');
  updateOrCreateMetaTag('twitter:title', title);
  updateOrCreateMetaTag('twitter:description', description);
  updateOrCreateMetaTag('twitter:image', imageUrl);

  updateOrCreateMetaTag('description', description, 'name');
}

function updateOrCreateMetaTag(property: string, content: string, attributeName: string = 'property'): void {
  if (!content) return;

  let element = document.querySelector(`meta[${attributeName}="${property}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, property);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function resetMetaTags(): void {
  document.title = 'Property Agent - Discover, Manage, Book Properties';

  const metaTags = [
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'og:type',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image'
  ];

  metaTags.forEach(tag => {
    const element = document.querySelector(`meta[property="${tag}"]`) ||
                    document.querySelector(`meta[name="${tag}"]`);
    if (element) {
      element.remove();
    }
  });
}
