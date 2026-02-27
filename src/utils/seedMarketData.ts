import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const seedMarketData = async () => {
  const today = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  const sampleNews = [
    {
      title: "Dubai Marina Property Prices Surge 12% in Q4 2024",
      source: "Property Finder",
      source_url: "https://www.propertyfinder.ae",
      summary: "Dubai Marina continues to lead the luxury property market with a remarkable 12% price increase in Q4 2024. The area has seen unprecedented demand from international investors, particularly from Europe and Asia. Waterfront properties are commanding premium prices, with penthouses exceeding AED 3,000 per square foot. Market analysts predict sustained growth through 2025.",
      area: "Dubai Marina",
      trend_score: 92,
      investor_signal: "BUY" as const,
      tags: ["luxury", "waterfront", "investment"],
      sentiment: "Positive" as const,
      price_change_percent: 12.3,
      impact_points: [
        "Strong international investor demand driving premium pricing",
        "Waterfront properties showing exceptional appreciation potential",
        "Limited new supply creating scarcity value in prime locations"
      ],
      publish_date: today,
      processing_status: "completed"
    },
    {
      title: "Business Bay Emerges as Top Commercial Hub with Record Transactions",
      source: "Bayut",
      source_url: "https://www.bayut.com",
      summary: "Business Bay has recorded the highest number of commercial property transactions in Dubai for 2024, with over 2,500 deals closed. The area's strategic location and excellent infrastructure continue to attract multinational corporations. Office space rentals have increased by 8% year-over-year, while retail spaces remain highly sought after.",
      area: "Business Bay",
      trend_score: 88,
      investor_signal: "BUY" as const,
      tags: ["commercial", "office", "retail"],
      sentiment: "Positive" as const,
      price_change_percent: 8.5,
      impact_points: [
        "Record transaction volumes indicate strong market confidence",
        "Corporate expansion driving sustained rental demand",
        "Mixed-use developments offering diversified investment opportunities"
      ],
      publish_date: today,
      processing_status: "completed"
    },
    {
      title: "Palm Jumeirah Luxury Villas Set New Price Records",
      source: "Property Finder",
      source_url: "https://www.propertyfinder.ae",
      summary: "Ultra-luxury villas on Palm Jumeirah's fronds have set new price records, with several properties selling above AED 100 million. The iconic development continues to attract ultra-high-net-worth individuals seeking exclusive waterfront living. Recent infrastructure upgrades and new amenities have further enhanced the area's appeal.",
      area: "Palm Jumeirah",
      trend_score: 95,
      investor_signal: "BUY" as const,
      tags: ["luxury", "villas", "ultra-high-end"],
      sentiment: "Positive" as const,
      price_change_percent: 15.7,
      impact_points: [
        "Ultra-luxury segment showing exceptional resilience and growth",
        "Limited inventory of beachfront villas creating premium valuations",
        "Strong rental yields attracting investment-focused buyers"
      ],
      publish_date: yesterday,
      processing_status: "completed"
    },
    {
      title: "Downtown Dubai Residential Market Shows Steady Growth",
      source: "Bayut",
      source_url: "https://www.bayut.com",
      summary: "Downtown Dubai's residential sector continues its steady growth trajectory with a 6% increase in average property prices. The area's world-class amenities, including proximity to Dubai Mall and Burj Khalifa, maintain strong appeal for both end-users and investors. New developments are seeing strong pre-sale performance.",
      area: "Downtown Dubai",
      trend_score: 78,
      investor_signal: "HOLD" as const,
      tags: ["residential", "lifestyle", "prime-location"],
      sentiment: "Positive" as const,
      price_change_percent: 6.2,
      impact_points: [
        "Consistent appreciation in prime central location",
        "Strong rental demand from corporate executives and tourists",
        "Upcoming metro expansion enhancing connectivity value"
      ],
      publish_date: yesterday,
      processing_status: "completed"
    },
    {
      title: "JBR Beachfront Properties Maintain Premium Status",
      source: "Property Finder",
      source_url: "https://www.propertyfinder.ae",
      summary: "Jumeirah Beach Residence (JBR) continues to command premium prices as one of Dubai's most sought-after beachfront locations. The area's vibrant lifestyle, excellent dining options, and proximity to the beach ensure consistent demand. Properties with sea views are trading at significant premiums over non-view units.",
      area: "JBR",
      trend_score: 82,
      investor_signal: "HOLD" as const,
      tags: ["beachfront", "lifestyle", "tourism"],
      sentiment: "Positive" as const,
      price_change_percent: 7.1,
      impact_points: [
        "Beachfront lifestyle maintaining strong appeal to international buyers",
        "Short-term rental market providing attractive yield opportunities",
        "Limited beachfront inventory supporting price stability"
      ],
      publish_date: today,
      processing_status: "completed"
    },
    {
      title: "Arabian Ranches Community Experiences Steady Demand",
      source: "Bayut",
      source_url: "https://www.bayut.com",
      summary: "The family-oriented community of Arabian Ranches continues to see steady demand from families seeking villa lifestyles. While price growth has moderated to 3%, the area maintains its appeal due to excellent schools, golf courses, and community facilities. The suburban location offers a peaceful alternative to high-rise living.",
      area: "Arabian Ranches",
      trend_score: 65,
      investor_signal: "WATCH" as const,
      tags: ["family", "villas", "community"],
      sentiment: "Neutral" as const,
      price_change_percent: 3.2,
      impact_points: [
        "Family-focused developments maintaining stable long-term demand",
        "Quality schools and amenities supporting residential appeal",
        "Moderate price growth suggesting market maturity"
      ],
      publish_date: yesterday,
      processing_status: "completed"
    }
  ];

  const areaTrends = [
    {
      area_name: "Dubai Marina",
      avg_price_sqft: 1850,
      transaction_volume: 324,
      price_change_percent: 12.3,
      sentiment_score: 0.85,
      investor_signal: "BUY",
      date: new Date().toISOString().split('T')[0]
    },
    {
      area_name: "Business Bay",
      avg_price_sqft: 1420,
      transaction_volume: 412,
      price_change_percent: 8.5,
      sentiment_score: 0.78,
      investor_signal: "BUY",
      date: new Date().toISOString().split('T')[0]
    },
    {
      area_name: "Palm Jumeirah",
      avg_price_sqft: 2350,
      transaction_volume: 156,
      price_change_percent: 15.7,
      sentiment_score: 0.92,
      investor_signal: "BUY",
      date: new Date().toISOString().split('T')[0]
    },
    {
      area_name: "Downtown Dubai",
      avg_price_sqft: 1680,
      transaction_volume: 287,
      price_change_percent: 6.2,
      sentiment_score: 0.65,
      investor_signal: "HOLD",
      date: new Date().toISOString().split('T')[0]
    },
    {
      area_name: "JBR",
      avg_price_sqft: 1590,
      transaction_volume: 198,
      price_change_percent: 7.1,
      sentiment_score: 0.72,
      investor_signal: "HOLD",
      date: new Date().toISOString().split('T')[0]
    }
  ];

  const managerAnalytics = {
    date: new Date().toISOString().split('T')[0],
    top_performing_area: "Palm Jumeirah",
    highest_lead_area: "Business Bay",
    avg_closing_days: 47.5,
    weekly_growth_percent: 8.7,
    overall_sentiment: "Market showing robust growth with strong investor confidence across premium segments. Waterfront and central locations leading performance.",
    total_transactions: 1377,
    top_areas: [
      { area: "Palm Jumeirah", priceChange: 15.7, signal: "BUY" },
      { area: "Dubai Marina", priceChange: 12.3, signal: "BUY" },
      { area: "Business Bay", priceChange: 8.5, signal: "BUY" },
      { area: "JBR", priceChange: 7.1, signal: "HOLD" },
      { area: "Downtown Dubai", priceChange: 6.2, signal: "HOLD" }
    ]
  };

  try {
    const { data: existingNews } = await supabase
      .from('market_news')
      .select('id')
      .limit(1);

    if (existingNews && existingNews.length > 0) {
      console.log('Data already exists, skipping seed');
      return { success: true, message: 'Data already exists' };
    }

    const { data: newsData, error: newsError } = await supabase
      .from('market_news')
      .insert(sampleNews);

    if (newsError) {
      console.error('News insert error:', newsError);
      throw newsError;
    }

    const { data: trendsData, error: trendsError } = await supabase
      .from('area_trends')
      .insert(areaTrends);

    if (trendsError) {
      console.error('Trends insert error:', trendsError);
      throw trendsError;
    }

    const { data: analyticsData, error: analyticsError } = await supabase
      .from('manager_analytics')
      .insert(managerAnalytics);

    if (analyticsError) {
      console.error('Analytics insert error:', analyticsError);
      throw analyticsError;
    }

    console.log('Market data seeded successfully');
    return { success: true, message: 'Market data seeded successfully' };
  } catch (error: any) {
    console.error('Error seeding data:', error);

    if (error?.code === '23505') {
      console.log('Data already exists (duplicate key), treating as success');
      return { success: true, message: 'Data already exists' };
    }

    return { success: false, error };
  }
};
