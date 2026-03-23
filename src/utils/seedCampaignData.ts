import { supabase } from '../lib/supabase';

export async function seedCampaignData() {
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .limit(3);

    if (!projects || projects.length === 0) {
      console.log('No projects found. Please add projects first.');
      return;
    }

    const sampleCampaigns = [
      {
        project_id: projects[0].id,
        title: 'Luxury Waterfront Living Campaign',
        description: 'Premium campaign targeting high-net-worth individuals interested in waterfront properties',
        campaign_type: 'luxury',
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
        title: 'First-Time Buyer Special',
        description: 'Affordable housing campaign with flexible payment plans',
        campaign_type: 'affordable',
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
        title: 'Investment Opportunity ROI Focus',
        description: 'High-return investment properties for smart investors',
        campaign_type: 'investment',
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
          priority_score: 85
        },
        {
          campaign_id: campaigns[0].id,
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+971 55 234 5678',
          source: 'Facebook',
          budget_range: '2M - 3M AED',
          status: 'new',
          priority_score: 92
        },
        {
          campaign_id: campaigns[0].id,
          name: 'Mohammed Hassan',
          email: 'mohammed.h@example.com',
          phone: '+971 56 345 6789',
          source: 'Google',
          budget_range: '5M+ AED',
          status: 'new',
          priority_score: 95
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
