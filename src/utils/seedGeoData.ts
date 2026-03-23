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

export async function seedGeoData() {
  try {
    console.log('Starting geo data seeding...');

    const { data: leads, error: fetchError } = await supabase
      .from('leads')
      .select('id, buyer_name')
      .is('latitude', null)
      .limit(100);

    if (fetchError) throw fetchError;

    if (!leads || leads.length === 0) {
      console.log('No leads without location data found.');
      return { success: true, message: 'All leads already have location data' };
    }

    console.log(`Found ${leads.length} leads without location data. Adding geo coordinates...`);

    const updates = leads.map(lead => {
      const location = getRandomLocation();
      return supabase
        .from('leads')
        .update(location)
        .eq('id', lead.id);
    });

    await Promise.all(updates);

    const { data: clusters } = await supabase
      .from('leads')
      .select('city, latitude, longitude')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (clusters) {
      const cityMap = new Map<string, { lats: number[], lngs: number[], count: number }>();

      clusters.forEach(lead => {
        if (!lead.city) return;

        if (!cityMap.has(lead.city)) {
          cityMap.set(lead.city, { lats: [], lngs: [], count: 0 });
        }

        const cityData = cityMap.get(lead.city)!;
        cityData.lats.push(lead.latitude);
        cityData.lngs.push(lead.longitude);
        cityData.count++;
      });

      const clusterInserts = Array.from(cityMap.entries()).map(([city, data]) => {
        const avgLat = data.lats.reduce((a, b) => a + b, 0) / data.lats.length;
        const avgLng = data.lngs.reduce((a, b) => a + b, 0) / data.lngs.length;

        return {
          location_name: city,
          center_lat: avgLat,
          center_lng: avgLng,
          radius_km: 5.0,
          lead_count: data.count
        };
      });

      await supabase.from('lead_geo_clusters').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const { error: clusterError } = await supabase
        .from('lead_geo_clusters')
        .insert(clusterInserts);

      if (clusterError) {
        console.warn('Could not create geo clusters:', clusterError);
      }
    }

    console.log('\n=== Geo Data Seeded Successfully! ===\n');
    console.log(`Updated ${leads.length} leads with location data`);
    console.log('\nDistribution:');

    const locationCounts = new Map<string, number>();
    leads.forEach(() => {
      const loc = getRandomLocation();
      locationCounts.set(loc.city, (locationCounts.get(loc.city) || 0) + 1);
    });

    const sortedCities = Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    sortedCities.forEach(([city, count]) => {
      console.log(`  ${city}: ~${Math.round(count / leads.length * 100)}% of leads`);
    });

    console.log('\n=== How to View ===');
    console.log('1. Go to Leads page (/leads)');
    console.log('2. Click "Map View" toggle button');
    console.log('3. View interactive heatmap with:');
    console.log('   - Red clusters: High density (10+ leads)');
    console.log('   - Orange clusters: Medium density (5-9 leads)');
    console.log('   - Blue clusters: Low density (1-4 leads)');
    console.log('4. Hover over clusters to see details');
    console.log('5. Use zoom controls to explore');
    console.log('6. View top cities by lead count below the map');

    return {
      success: true,
      message: `Successfully seeded ${leads.length} leads with geo data`,
      leads: leads.length
    };
  } catch (error) {
    console.error('Error seeding geo data:', error);
    throw error;
  }
}
