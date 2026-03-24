import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

export default function CampaignRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaignAndRedirect() {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const { data: campaign, error } = await supabase
          .from('campaigns')
          .select(`
            *,
            project:project_id (
              id,
              name,
              location,
              image,
              starting_price,
              description
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error || !campaign) {
          console.error('Campaign not found:', error);
          navigate('/');
          return;
        }

        const propertyImage = campaign.project?.image || campaign.creative_assets?.project_image || campaign.creative_assets?.images?.[0] || '';
        const location = campaign.project?.location || 'Prime Location';
        const budget = campaign.budget ? `AED ${campaign.budget.toLocaleString()}` : 'Contact for Price';
        const campaignUrl = `${window.location.origin}/campaign/${campaign.id}`;

        const urgencyText = campaign.end_date
          ? `⏰ Limited Time Offer - Ends ${new Date(campaign.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
          : '⏰ Exclusive Opportunity';

        const ctaText = campaign.cta_text || 'View Property Details';

        const ogTitle = `${campaign.name}`;

        const ogDescription = `${campaign.description || ''}

📍 ${location}
💰 ${budget}

${urgencyText}

👉 ${ctaText}`;

        document.title = ogTitle;

        updateOrCreateMetaTag('og:title', ogTitle);
        updateOrCreateMetaTag('og:description', ogDescription);
        updateOrCreateMetaTag('og:image', propertyImage);
        updateOrCreateMetaTag('og:url', campaignUrl);
        updateOrCreateMetaTag('og:type', 'website');
        updateOrCreateMetaTag('og:image:width', '1200');
        updateOrCreateMetaTag('og:image:height', '630');

        updateOrCreateMetaTag('twitter:card', 'summary_large_image');
        updateOrCreateMetaTag('twitter:title', ogTitle);
        updateOrCreateMetaTag('twitter:description', ogDescription);
        updateOrCreateMetaTag('twitter:image', propertyImage);

        updateOrCreateMetaTag('description', ogDescription, 'name');

        if (campaign.project?.id) {
          setTimeout(() => {
            navigate(`/property/${campaign.project.id}`);
          }, 500);
        } else {
          setTimeout(() => {
            navigate('/');
          }, 500);
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    loadCampaignAndRedirect();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return null;
}
