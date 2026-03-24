import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { updateMetaTags } from '../utils/metaTags';

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

        const ogDescription = `📍 ${location}\n💰 ${budget}\n\n${campaign.description || ''}`;

        const metaTagsData = {
          id: campaign.id,
          title: campaign.name,
          description: ogDescription,
          creativeAssets: {
            projectImage: propertyImage,
            images: campaign.creative_assets?.images || []
          }
        };

        updateMetaTags(metaTagsData);

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
