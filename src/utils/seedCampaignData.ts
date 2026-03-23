import { supabase } from '../lib/supabase';

export async function seedCampaignData() {
  try {
    console.log('=== SEED DATA START ===');

    const agentId = '00000000-0000-0000-0000-000000000000';
    console.log('Using demo agent ID:', agentId);

    let { data: projects } = await supabase
      .from('projects')
      .select('id')
      .limit(3);

    if (!projects || projects.length === 0) {
      const sampleProjects = [
        {
          name: 'Marina Bay Residences',
          developer_name: 'Emaar Properties',
          location: 'Dubai Marina',
          property_type: 'Apartment',
          price: 2500000,
          bedrooms: 3,
          bathrooms: 3,
          area: 2100,
          description: 'Luxury waterfront living with stunning marina views',
          image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
          amenities: ['Pool', 'Gym', 'Beach Access']
        },
        {
          name: 'Palm Jumeirah Villa',
          developer_name: 'Nakheel',
          location: 'Palm Jumeirah',
          property_type: 'Villa',
          price: 8500000,
          bedrooms: 5,
          bathrooms: 6,
          area: 5500,
          description: 'Exclusive beachfront villa on Palm Jumeirah',
          image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
          amenities: ['Private Beach', 'Pool', 'Garden']
        },
        {
          name: 'Downtown Heights',
          developer_name: 'Emaar Properties',
          location: 'Downtown Dubai',
          property_type: 'Apartment',
          price: 1800000,
          bedrooms: 2,
          bathrooms: 2,
          area: 1400,
          description: 'Modern apartments in the heart of Dubai',
          image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
          amenities: ['Gym', 'Parking', 'Security']
        }
      ];

      const { data: newProjects, error: projectError } = await supabase
        .from('projects')
        .insert(sampleProjects)
        .select('id');

      if (projectError) {
        console.error('Error creating sample projects:', projectError);
        throw new Error('Failed to create sample projects. Please ensure you have the necessary permissions.');
      }

      projects = newProjects;
      console.log('Created sample projects');
    }

    const sampleCampaigns = [
      {
        project_id: projects[0].id,
        agent_id: agentId,
        title: 'Luxury Waterfront Living Campaign',
        description: 'Premium campaign targeting high-net-worth individuals interested in waterfront properties',
        campaign_type: 'launch',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        target_platforms: ['Facebook', 'Instagram', 'Google'],
        ai_score: 85,
        budget: 15000,
        audience_config: {
          locations: ['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai'],
          budgetMin: 2000000,
          budgetMax: 10000000,
          buyerTypes: ['Investor', 'End-user']
        },
        channel_budget_split: {
          facebook: 3750,
          instagram: 6000,
          google: 3750,
          whatsapp: 1500
        },
        automation_settings: {
          autoFollowUp: true,
          whatsappAutoReply: false,
          leadPrioritization: true
        },
        insights: {
          topPerforming: 'Instagram',
          bestTime: '6-9 PM weekdays',
          recommendations: ['Add more luxury property visuals', 'Increase Instagram budget']
        }
      },
      {
        project_id: projects[1]?.id || projects[0].id,
        agent_id: agentId,
        title: 'First-Time Buyer Special',
        description: 'Affordable housing campaign with flexible payment plans',
        campaign_type: 'promotion',
        status: 'draft',
        target_platforms: ['Facebook', 'WhatsApp'],
        ai_score: 72,
        budget: 8000,
        audience_config: {
          locations: ['JVC', 'Arabian Ranches', 'Dubai Hills'],
          budgetMin: 500000,
          budgetMax: 1500000,
          buyerTypes: ['First-time Buyer', 'End-user']
        },
        channel_budget_split: {
          facebook: 4000,
          instagram: 2000,
          google: 1000,
          whatsapp: 1000
        },
        automation_settings: {
          autoFollowUp: true,
          whatsappAutoReply: true,
          leadPrioritization: true
        }
      },
      {
        project_id: projects[2]?.id || projects[0].id,
        agent_id: agentId,
        title: 'Investment Opportunity ROI Focus',
        description: 'High-return investment properties for smart investors',
        campaign_type: 'price_drop',
        status: 'paused',
        start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        target_platforms: ['Google', 'LinkedIn'],
        ai_score: 68,
        budget: 12000,
        audience_config: {
          locations: ['Business Bay', 'DIFC', 'Dubai Marina'],
          budgetMin: 1000000,
          budgetMax: 5000000,
          buyerTypes: ['Investor']
        },
        channel_budget_split: {
          facebook: 2000,
          instagram: 2000,
          google: 6000,
          whatsapp: 2000
        },
        automation_settings: {
          autoFollowUp: true,
          whatsappAutoReply: false,
          leadPrioritization: true
        }
      }
    ];

    const { data: campaigns, error: campaignError } = await supabase
      .from('campaigns')
      .insert(sampleCampaigns)
      .select();

    if (campaignError) throw campaignError;

    if (campaigns && campaigns.length > 0) {
      const campaignProperties = campaigns.map((campaign, index) => ({
        campaign_id: campaign.id,
        project_id: projects[index]?.id || projects[0].id,
        is_suggested: index === 0
      }));

      await supabase.from('campaign_properties').insert(campaignProperties);

      const sampleLeads = [
        {
          campaign_id: campaigns[0].id,
          name: 'Ahmed Al-Mansouri',
          email: 'ahmed.m@example.com',
          phone: '+971 50 123 4567',
          source: 'Instagram',
          budget_range: '3M - 5M AED',
          status: 'contacted',
          engagement_score: 85
        },
        {
          campaign_id: campaigns[0].id,
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+971 55 234 5678',
          source: 'Google',
          budget_range: '5M+ AED',
          status: 'new',
          engagement_score: 90
        },
        {
          campaign_id: campaigns[0].id,
          name: 'Mohammed Hassan',
          email: 'mohammed.h@example.com',
          phone: '+971 56 345 6789',
          source: 'Referral',
          budget_range: '8M - 10M AED',
          status: 'new',
          engagement_score: 95
        },
        {
          campaign_id: campaigns[0].id,
          name: 'Emily Chen',
          email: 'emily.c@example.com',
          phone: '+971 54 567 8901',
          source: 'Facebook',
          budget_range: '1M - 2M AED',
          status: 'new',
          engagement_score: 65
        },
        {
          campaign_id: campaigns[0].id,
          name: 'James Peterson',
          email: 'james.p@example.com',
          phone: '+971 52 678 9012',
          source: 'LinkedIn',
          budget_range: '2M - 3M AED',
          status: 'contacted',
          engagement_score: 75
        },
        {
          campaign_id: campaigns[0].id,
          name: 'Fatima Al-Said',
          email: 'fatima.s@example.com',
          phone: '+971 50 789 0123',
          source: 'Website',
          budget_range: '500K - 1M AED',
          status: 'new',
          engagement_score: 45
        }
      ];

      await supabase.from('campaign_leads').insert(sampleLeads);

      const analyticsData = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        analyticsData.push({
          campaign_id: campaigns[0].id,
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000) + 500,
          clicks: Math.floor(Math.random() * 100) + 50,
          leads: Math.floor(Math.random() * 10) + 2,
          conversions: Math.floor(Math.random() * 3),
          channel_breakdown: {
            facebook: Math.floor(Math.random() * 40) + 10,
            instagram: Math.floor(Math.random() * 60) + 30,
            google: Math.floor(Math.random() * 30) + 10
          }
        });
      }

      await supabase.from('campaign_analytics').insert(analyticsData);

      const activities = [
        {
          campaign_id: campaigns[0].id,
          activity_type: 'status_change',
          description: 'Campaign launched',
          metadata: { status: 'active' }
        },
        {
          campaign_id: campaigns[0].id,
          activity_type: 'lead_received',
          description: 'New lead received from Instagram',
          metadata: { source: 'Instagram', leadName: 'Ahmed Al-Mansouri' }
        },
        {
          campaign_id: campaigns[0].id,
          activity_type: 'follow_up_sent',
          description: 'Follow-up message sent to 3 leads',
          metadata: { count: 3 }
        }
      ];

      await supabase.from('campaign_activities').insert(activities);

      console.log('Sample campaign data seeded successfully!');
      return campaigns;
    }
  } catch (error) {
    console.error('Error seeding campaign data:', error);
    throw error;
  }
}
