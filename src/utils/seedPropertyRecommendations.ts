import { supabase } from '../lib/supabase';

export async function seedPropertyRecommendations() {
  try {
    console.log('Starting property recommendation data seeding...');

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name')
      .limit(10);

    if (projectsError) throw projectsError;
    if (!projects || projects.length === 0) {
      console.log('No projects found. Please create some projects first.');
      return;
    }

    console.log(`Found ${projects.length} projects. Updating with recommendation data...`);

    const updatePromises = projects.map((project, index) => {
      const isHighConversion = index % 3 === 0;
      const isTrending = index % 3 === 1;
      const isNew = index % 3 === 2;

      let updateData: any = {};

      if (isHighConversion) {
        updateData = {
          conversion_rate: 15 + Math.random() * 10,
          total_leads: 50 + Math.floor(Math.random() * 100),
          total_conversions: 10 + Math.floor(Math.random() * 20),
          trending_score: 30 + Math.random() * 20,
          leads_last_7_days: 5 + Math.floor(Math.random() * 10),
          views_last_7_days: 50 + Math.floor(Math.random() * 100),
          is_new_listing: false
        };
      } else if (isTrending) {
        updateData = {
          conversion_rate: 5 + Math.random() * 8,
          total_leads: 20 + Math.floor(Math.random() * 50),
          total_conversions: 2 + Math.floor(Math.random() * 8),
          trending_score: 60 + Math.random() * 30,
          leads_last_7_days: 10 + Math.floor(Math.random() * 15),
          views_last_7_days: 100 + Math.floor(Math.random() * 200),
          is_new_listing: false
        };
      } else {
        updateData = {
          conversion_rate: Math.random() * 5,
          total_leads: Math.floor(Math.random() * 20),
          total_conversions: Math.floor(Math.random() * 3),
          trending_score: Math.random() * 30,
          leads_last_7_days: Math.floor(Math.random() * 5),
          views_last_7_days: Math.floor(Math.random() * 50),
          is_new_listing: true
        };
      }

      return supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id);
    });

    await Promise.all(updatePromises);

    const { data: updatedProjects } = await supabase
      .from('projects')
      .select('name, conversion_rate, trending_score, is_new_listing')
      .order('conversion_rate', { ascending: false });

    console.log('\n=== Property Recommendation Data Seeded Successfully! ===\n');

    console.log('High Conversion Properties (15%+):');
    updatedProjects
      ?.filter(p => p.conversion_rate >= 15)
      .forEach(p => {
        console.log(`  ✓ ${p.name} - ${p.conversion_rate.toFixed(1)}% conversion`);
      });

    console.log('\nTrending Properties (60+ score):');
    updatedProjects
      ?.filter(p => p.trending_score >= 60)
      .forEach(p => {
        console.log(`  📈 ${p.name} - ${Math.round(p.trending_score)} trending score`);
      });

    console.log('\nNew Listings:');
    updatedProjects
      ?.filter(p => p.is_new_listing)
      .forEach(p => {
        console.log(`  ✨ ${p.name}`);
      });

    console.log('\n=== How to Test ===');
    console.log('1. Go to Agent Campaigns page');
    console.log('2. Click on any campaign to view details');
    console.log('3. Click "Add Property" button');
    console.log('4. You\'ll see properties with badges:');
    console.log('   - Green "High Conversion" badge with award icon');
    console.log('   - Orange "Trending" badge with trending icon');
    console.log('   - Blue "New Listing" badge with sparkles icon');
    console.log('5. Check conversion rate and trending scores below each property');
    console.log('6. AI suggestions will prioritize high-performing properties');
    console.log('\nRefresh the page to see the updated properties!');

    return updatedProjects;
  } catch (error) {
    console.error('Error seeding property recommendations:', error);
    throw error;
  }
}
