import { supabase } from '../lib/supabase';

const manilaLocations = [
  { city: 'Makati', lat: 14.5547, lng: 121.0244, state: 'Metro Manila' },
  { city: 'Taguig', lat: 14.5176, lng: 121.0509, state: 'Metro Manila' },
  { city: 'Quezon City', lat: 14.6760, lng: 121.0437, state: 'Metro Manila' },
  { city: 'Pasig', lat: 14.5764, lng: 121.0851, state: 'Metro Manila' },
  { city: 'Manila', lat: 14.5995, lng: 120.9842, state: 'Metro Manila' },
  { city: 'Mandaluyong', lat: 14.5794, lng: 121.0359, state: 'Metro Manila' },
  { city: 'Pasay', lat: 14.5378, lng: 121.0014, state: 'Metro Manila' },
  { city: 'Parañaque', lat: 14.4793, lng: 121.0198, state: 'Metro Manila' },
  { city: 'Las Piñas', lat: 14.4453, lng: 120.9820, state: 'Metro Manila' },
  { city: 'Muntinlupa', lat: 14.4082, lng: 121.0409, state: 'Metro Manila' },
  { city: 'San Juan', lat: 14.6019, lng: 121.0355, state: 'Metro Manila' },
  { city: 'Marikina', lat: 14.6507, lng: 121.1029, state: 'Metro Manila' },
  { city: 'Caloocan', lat: 14.6488, lng: 120.9830, state: 'Metro Manila' },
  { city: 'Valenzuela', lat: 14.7006, lng: 120.9830, state: 'Metro Manila' },
  { city: 'Malabon', lat: 14.6625, lng: 120.9559, state: 'Metro Manila' },
];

function getRandomLocation() {
  const location = manilaLocations[Math.floor(Math.random() * manilaLocations.length)];

  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;

  return {
    city: location.city,
    state: location.state,
    country: 'Philippines',
    latitude: location.lat + latOffset,
    longitude: location.lng + lngOffset,
    postal_code: `${1000 + Math.floor(Math.random() * 800)}`
  };
}

export async function seedCampaignGeoData(campaignId?: string) {
  try {
    console.log('Starting campaign geo data seeding...');

    let query = supabase
      .from('campaign_leads')
      .select('id, name, campaign_id')
      .is('latitude', null);

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
      console.log(`Filtering for campaign ID: ${campaignId}`);
    }

    const { data: campaignLeads, error: fetchError } = await query.limit(100);

    if (fetchError) throw fetchError;

    if (!campaignLeads || campaignLeads.length === 0) {
      console.log('No campaign leads without location data found.');
      return { success: true, message: 'All campaign leads already have location data' };
    }

    console.log(`Found ${campaignLeads.length} campaign leads without location data. Adding geo coordinates...`);

    const updates = campaignLeads.map(lead => {
      const location = getRandomLocation();
      return supabase
        .from('campaign_leads')
        .update(location)
        .eq('id', lead.id);
    });

    await Promise.all(updates);

    console.log('\n=== Campaign Geo Data Seeded Successfully! ===\n');
    console.log(`Updated ${campaignLeads.length} campaign leads with location data`);

    const locationCounts = new Map<string, number>();
    campaignLeads.forEach(() => {
      const loc = getRandomLocation();
      locationCounts.set(loc.city, (locationCounts.get(loc.city) || 0) + 1);
    });

    const sortedCities = Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    console.log('\nDistribution:');
    sortedCities.forEach(([city, count]) => {
      console.log(`  ${city}: ~${Math.round(count / campaignLeads.length * 100)}% of leads`);
    });

    console.log('\n=== How to View ===');
    console.log('1. Go to Campaign Details page');
    console.log('2. Click on "Leads" tab');
    console.log('3. Click "Map View" toggle button');
    console.log('4. View interactive heatmap with:');
    console.log('   - Red clusters: High density (10+ leads)');
    console.log('   - Orange clusters: Medium density (5-9 leads)');
    console.log('   - Blue clusters: Low density (1-4 leads)');
    console.log('5. Hover over clusters to see details');
    console.log('6. Use zoom controls to explore');
    console.log('7. Toggle "Show Hot Leads Only" to filter by priority');

    return {
      success: true,
      message: `Successfully seeded ${campaignLeads.length} campaign leads with geo data`,
      leads: campaignLeads.length
    };
  } catch (error) {
    console.error('Error seeding campaign geo data:', error);
    throw error;
  }
}
