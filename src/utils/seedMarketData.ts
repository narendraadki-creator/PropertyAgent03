import { supabase } from '../lib/supabase';

export const seedMarketData = async () => {
  const today = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  const generateTimestamp = (daysAgo: number) => {
    return new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];
  };

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
      publish_date: generateTimestamp(0),
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
      publish_date: generateTimestamp(1),
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
      publish_date: generateTimestamp(2),
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
      publish_date: generateTimestamp(3),
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
      publish_date: generateTimestamp(4),
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
      publish_date: generateTimestamp(5),
      processing_status: "completed"
    },
    {
      title: "Dubai Hills Estate Becomes Premier Golf Course Living Destination",
      source: "Bayut",
      source_url: "https://www.bayut.com",
      summary: "Dubai Hills Estate is experiencing a surge in demand for golf-adjacent properties, with prices up 9.8% in Q4. The 18-hole championship golf course and proximity to Dubai Hills Mall are key attractions. Villas with golf course views are commanding premiums of 20-25% over similar properties without views.",
      area: "Dubai Hills Estate",
      trend_score: 85,
      investor_signal: "BUY" as const,
      tags: ["golf", "lifestyle", "premium"],
      sentiment: "Positive" as const,
      price_change_percent: 9.8,
      impact_points: [
        "Golf course developments attracting affluent buyers and investors",
        "Strong community amenities supporting long-term value appreciation",
        "Limited golf-adjacent inventory driving competitive bidding"
      ],
      publish_date: generateTimestamp(6),
      processing_status: "completed"
    },
    {
      title: "Dubai Creek Harbour Emerges as Major Investment Hotspot",
      source: "Property Finder",
      source_url: "https://www.propertyfinder.ae",
      summary: "Dubai Creek Harbour is seeing remarkable growth with property values rising 14.2% as the area's infrastructure nears completion. The upcoming Dubai Creek Tower and waterfront promenade are major catalysts. Investors are recognizing the area's potential as prices remain 30% below comparable waterfront developments.",
      area: "Dubai Creek Harbour",
      trend_score: 90,
      investor_signal: "BUY" as const,
      tags: ["waterfront", "development", "value"],
      sentiment: "Positive" as const,
      price_change_percent: 14.2,
      impact_points: [
        "Major infrastructure projects creating significant value appreciation",
        "Entry prices offering attractive investment opportunity versus established areas",
        "Waterfront positioning with strong rental yield potential"
      ],
      publish_date: generateTimestamp(7),
      processing_status: "completed"
    },
    {
      title: "Emirates Hills Luxury Market Remains Ultra-Premium Segment Leader",
      source: "Property Finder",
      source_url: "https://www.propertyfinder.ae",
      summary: "Emirates Hills maintains its position as Dubai's most exclusive residential address with average villa prices exceeding AED 25 million. The gated community saw limited inventory with only 12 transactions in Q4, all above asking price. Ultra-high-net-worth buyers continue to compete for rare listings in this prestigious enclave.",
      area: "Emirates Hills",
      trend_score: 88,
      investor_signal: "HOLD" as const,
      tags: ["ultra-luxury", "exclusive", "gated-community"],
      sentiment: "Positive" as const,
      price_change_percent: 5.5,
      impact_points: [
        "Extreme scarcity maintaining premium valuations in ultra-luxury tier",
        "Established community prestige attracting global elite buyers",
        "Limited transaction volume indicating stable, mature market"
      ],
      publish_date: generateTimestamp(8),
      processing_status: "completed"
    },
    {
      title: "Dubai South Real Estate Gains Momentum with Expo Legacy",
      source: "Bayut",
      source_url: "https://www.bayut.com",
      summary: "Dubai South is experiencing renewed interest post-Expo 2020, with property inquiries up 45% year-over-year. The area's proximity to Al Maktoum International Airport and competitive pricing are attracting first-time buyers and investors. Residential units are priced 40-50% below central Dubai equivalents.",
      area: "Dubai South",
      trend_score: 72,
      investor_signal: "WATCH" as const,
      tags: ["emerging", "value", "airport-proximity"],
      sentiment: "Positive" as const,
      price_change_percent: 4.8,
      impact_points: [
        "Significant value proposition for price-conscious buyers and investors",
        "Airport expansion plans creating long-term infrastructure advantage",
        "Growing community amenities supporting residential appeal"
      ],
      publish_date: generateTimestamp(9),
      processing_status: "completed"
    },
    {
      title: "Bluewaters Island Luxury Apartments See Strong Tourist Demand",
      source: "Property Finder",
      source_url: "https://www.propertyfinder.ae",
      summary: "Bluewaters Island is capitalizing on tourism recovery with luxury apartments achieving 85% occupancy rates. Properties near Ain Dubai and beachfront locations are commanding nightly rates of AED 2,500+. Investors are reporting annual yields of 7-9%, significantly above Dubai's 5% average.",
      area: "Bluewaters Island",
      trend_score: 86,
      investor_signal: "BUY" as const,
      tags: ["tourism", "short-term-rental", "beachfront"],
      sentiment: "Positive" as const,
      price_change_percent: 11.2,
      impact_points: [
        "Tourism-driven rental demand generating exceptional investment yields",
        "Beachfront positioning and Ain Dubai proximity creating unique appeal",
        "Short-term rental regulations favorable for investor returns"
      ],
      publish_date: generateTimestamp(10),
      processing_status: "completed"
    },
    {
      title: "Sustainable City Dubai Attracts Eco-Conscious Buyers",
      source: "Bayut",
      source_url: "https://www.bayut.com",
      summary: "The Sustainable City is experiencing growing demand from environmentally conscious buyers, with prices up 6.5% in 2024. The community's solar-powered homes, urban farms, and zero-waste initiatives are resonating with a new generation of buyers. Family villas are in particularly high demand.",
      area: "The Sustainable City",
      trend_score: 70,
      investor_signal: "HOLD" as const,
      tags: ["sustainable", "eco-friendly", "family"],
      sentiment: "Positive" as const,
      price_change_percent: 6.5,
      impact_points: [
        "Growing eco-conscious buyer segment supporting demand growth",
        "Unique sustainable features differentiating from standard developments",
        "Strong community appeal for families prioritizing environmental values"
      ],
      publish_date: generateTimestamp(11),
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

    for (const newsItem of sampleNews) {
      const { error: newsError } = await supabase
        .from('market_news')
        .insert(newsItem)
        .select();

      if (newsError && newsError.code !== '23505') {
        console.error('News insert error:', newsError);
        throw newsError;
      }
    }

    for (const trend of areaTrends) {
      const { error: trendError } = await supabase
        .from('area_trends')
        .insert(trend)
        .select();

      if (trendError && trendError.code !== '23505') {
        console.error('Trend insert error:', trendError);
        throw trendError;
      }
    }

    const { error: analyticsError } = await supabase
      .from('manager_analytics')
      .insert(managerAnalytics)
      .select();

    if (analyticsError && analyticsError.code !== '23505') {
      console.error('Analytics insert error:', analyticsError);
      throw analyticsError;
    }

    console.log('Market data seeded successfully');
    return { success: true, message: 'Market data seeded successfully' };
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return { success: false, error };
  }
};
