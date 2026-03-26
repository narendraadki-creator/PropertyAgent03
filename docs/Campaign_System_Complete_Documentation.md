# Real Estate Campaign Management System - Complete Documentation

## Table of Contents
1. [Overview](#1-overview)
2. [Campaign Module](#2-campaign-module-detailed)
3. [Campaign Features](#3-campaign-features-explain-each)
4. [Social Media Integration](#4-social-media-integration)
5. [Lead Flow](#5-lead-flow-end-to-end)
6. [Campaign Details Page Logic](#6-campaign-details-page-logic)
7. [Data Model](#7-data-model-database-design)
8. [Tracking System](#8-tracking-system)
9. [Analytics](#9-analytics)
10. [System Architecture](#10-system-architecture)
11. [Complete Flow Diagram](#11-complete-flow-diagram)
12. [Bonus Advanced Features](#12-bonus-advanced-features)

---

## 1. OVERVIEW

### What is a Campaign?

A **Campaign** is a coordinated marketing effort designed to promote one or more real estate properties across multiple digital channels (Facebook, Instagram, Google Ads, WhatsApp) with the goal of generating qualified leads.

Think of it as a complete marketing package that includes:
- Property information
- Target audience
- Marketing content
- Budget allocation
- Performance tracking
- Lead capture and management

### Purpose of Campaign System in Real Estate

The campaign system automates and streamlines the entire marketing process for real estate agents and developers:

1. **Single Dashboard Control** - Manage all marketing channels from one place
2. **Automated Lead Generation** - Capture leads automatically from all platforms
3. **Performance Tracking** - See which channels perform best in real-time
4. **Cost Optimization** - Automatically redistribute budget to best-performing channels
5. **Lead Nurturing** - Auto-follow-up sequences keep leads warm

### Key Goals

#### 1. Lead Generation
- Capture qualified buyer leads from multiple channels
- Store complete lead information (name, email, phone, budget, preferences)
- Track lead source and campaign attribution

#### 2. Marketing Automation
- Auto-distribute ads across Facebook, Instagram, Google
- Auto-respond to WhatsApp inquiries
- Auto-follow-up with leads (Day 1, Day 3, Day 7)
- Auto-prioritize hot leads

#### 3. Performance Tracking
- Real-time analytics on impressions, clicks, leads
- Cost per lead calculation
- Channel performance comparison
- ROI measurement

---

## 2. CAMPAIGN MODULE (DETAILED)

### Campaign Creation

**Step-by-step process:**

1. **Basic Information**
   - Campaign Name (e.g., "Summer Sale - Marina Views")
   - Campaign Type (Property Launch, Special Offer, Open House)
   - Start Date & End Date
   - Total Budget

2. **Property Selection**
   - Choose one or more properties to promote
   - Each property contributes:
     - Images for ad creatives
     - Price for ad copy
     - Location for targeting
     - Description for content

3. **Target Audience**
   - Location filters (Dubai Marina, Downtown, etc.)
   - Budget range (500K-1M, 1M-2M)
   - Buyer type (Investor, End User, First-time Buyer)
   - Age range, interests

4. **Content Creation**
   - Campaign title and description
   - Use AI to generate variations:
     - Luxury buyer version
     - Investor-focused version
     - First-time buyer version
   - Add call-to-action (Book Now, Get Details, Schedule Visit)

5. **Channel Selection**
   - Facebook Ads
   - Instagram Ads
   - Google Search Ads
   - WhatsApp Broadcast

6. **Budget Distribution**
   - Manual: Set fixed amount per channel
   - Auto-Optimize: System adjusts based on performance

### Campaign Status

Campaigns move through different states:

```
DRAFT → ACTIVE → PAUSED → COMPLETED
  ↓       ↓        ↓
DELETED  ACTIVE   ACTIVE
```

**Status Definitions:**

1. **Draft**
   - Campaign created but not launched
   - Can edit all fields
   - No ads running
   - No budget spent

2. **Active**
   - Campaign is live
   - Ads running on selected platforms
   - Budget being spent
   - Leads being captured
   - Can pause or edit budget

3. **Paused**
   - Campaign temporarily stopped
   - Ads stopped running
   - No budget being spent
   - Historical data preserved
   - Can resume anytime

4. **Completed**
   - End date reached
   - Ads automatically stopped
   - Final analytics available
   - Cannot reactivate (must duplicate)
   - Full performance report generated

### Campaign Duplication

Allows agents to reuse successful campaigns:

```javascript
function duplicateCampaign(originalCampaign) {
  const newCampaign = {
    ...originalCampaign,
    id: generateNewId(),
    name: originalCampaign.name + " (Copy)",
    status: "DRAFT",
    startDate: null,
    endDate: null,
    createdAt: new Date(),
    // Reset performance metrics
    impressions: 0,
    clicks: 0,
    leads: 0,
    spent: 0
  };

  return newCampaign;
}
```

**What gets copied:**
- Target audience settings
- Content templates
- Channel selection
- Budget distribution ratios
- Selected properties
- Automation sequences

**What gets reset:**
- Campaign dates
- Performance metrics
- Lead list
- Status (set to Draft)

### Campaign Analytics

Real-time dashboard showing:

1. **Performance Metrics**
   - Total Impressions
   - Total Clicks
   - Total Leads
   - Conversion Rate (Leads/Clicks)
   - Cost Per Lead

2. **Channel Breakdown**
   ```
   Facebook:  1,234 impressions → 45 clicks → 12 leads (CPL: AED 83)
   Instagram:   987 impressions → 32 clicks →  8 leads (CPL: AED 125)
   Google:      543 impressions → 28 clicks → 15 leads (CPL: AED 67)
   ```

3. **Lead Timeline**
   - Hourly lead capture graph
   - Peak performance times
   - Day-by-day comparison

4. **Geographic Data**
   - Where leads are coming from
   - Heatmap visualization
   - Best-performing locations

---

## 3. CAMPAIGN FEATURES (EXPLAIN EACH)

### 1. Budget Distribution

**Purpose:** Allocate marketing budget across different advertising channels efficiently.

#### Manual Budget Distribution

Agent manually sets how much to spend on each channel:

```
Total Budget: AED 10,000

Manual Split:
- Facebook:  AED 4,000 (40%)
- Instagram: AED 3,000 (30%)
- Google:    AED 3,000 (30%)
```

**When to use:**
- You know which channels work best
- Testing a specific strategy
- Limited to certain platforms

#### Auto-Optimize Budget Distribution

System automatically redistributs budget based on performance:

```
Initial Budget: AED 10,000

Day 1 Split:
- Facebook:  AED 3,333 (33.3%)
- Instagram: AED 3,333 (33.3%)
- Google:    AED 3,334 (33.3%)

Day 3 Analysis:
- Facebook:  12 leads (CPL: AED 92)
- Instagram: 5 leads  (CPL: AED 167)
- Google:    18 leads (CPL: AED 62)

Auto-Adjusted Split:
- Facebook:  AED 3,000 (30%)  ← Reduced
- Instagram: AED 2,000 (20%)  ← Reduced
- Google:    AED 5,000 (50%)  ← Increased (best performer)
```

**Optimization Logic:**

```javascript
function autoOptimizeBudget(channels, totalBudget) {
  // Calculate cost per lead for each channel
  channels.forEach(channel => {
    channel.cpl = channel.spent / channel.leads;
    channel.score = 1 / channel.cpl; // Lower CPL = Higher score
  });

  // Calculate total score
  const totalScore = channels.reduce((sum, ch) => sum + ch.score, 0);

  // Redistribute budget proportionally to performance
  channels.forEach(channel => {
    channel.newBudget = (channel.score / totalScore) * totalBudget;
  });

  return channels;
}
```

**When to use:**
- First time running campaign
- Want to maximize ROI
- Don't know which channel performs best

---

### 2. Selected Properties

**Why Properties are Required:**

Properties are the foundation of a campaign. Without a property, there's nothing to advertise.

**How Property Data is Used:**

1. **Images** → Ad Creatives
   ```
   Property: Marina Heights Tower
   Images: [exterior.jpg, living_room.jpg, balcony_view.jpg]

   Ad Creative:
   - Primary image: exterior.jpg
   - Carousel: All 3 images
   - Video: Auto-generated slideshow
   ```

2. **Price** → Ad Copy
   ```
   Property Price: AED 1,250,000

   Ad Headline: "Own Your Dream Home for AED 1.25M"
   Ad Description: "Luxury 2BR apartment starting from AED 1.25M"
   ```

3. **Location** → Targeting
   ```
   Property Location: Dubai Marina

   Target Audience:
   - People living within 10km of Dubai Marina
   - People who searched for "Dubai Marina apartments"
   - People interested in Marina lifestyle
   ```

4. **Amenities** → Selling Points
   ```
   Property Amenities: [Pool, Gym, Parking, Security]

   Ad Content:
   "✓ Swimming Pool
    ✓ State-of-art Gym
    ✓ Covered Parking
    ✓ 24/7 Security"
   ```

#### Multi-Property Campaigns

Promote multiple properties in one campaign:

```
Campaign: "Summer Sale - Beachfront Living"

Properties:
1. Marina Heights (AED 1.25M)
2. Beach Towers (AED 1.8M)
3. Palm Residence (AED 2.5M)

Strategy:
- Different ads for different budget segments
- Carousel ads showing all 3 options
- Dynamic ads showing most relevant property to user
```

**Benefits:**
- Reach wider audience
- Offer choices
- Cross-sell opportunities
- Higher conversion rates

---

### 3. Target Audience

**Purpose:** Show ads only to people most likely to buy.

#### Location Filters

```
Target Locations:
1. People living in Dubai
2. People who recently moved to Dubai
3. People searching for Dubai properties
4. Expats in nearby cities (Abu Dhabi, Sharjah)
```

**Location Radius Targeting:**
```
Property: Downtown Dubai

Targeting Strategy:
- 5km radius: Premium targeting (higher bid)
- 10km radius: Standard targeting
- 20km radius: Awareness targeting (lower bid)
```

#### Budget Filters

```
Property Price: AED 1,500,000

Target Audience by Income:
- Household income: AED 50K+/month
- Job titles: Manager, Director, CEO, Doctor, Engineer
- Interests: Luxury cars, Fine dining, Travel
```

**Budget Range Segments:**
```
Portfolio Campaigns:

Segment 1: AED 500K - 1M
- First-time buyers
- Young professionals
- Studio & 1BR units

Segment 2: AED 1M - 2M
- Growing families
- Mid-career professionals
- 2BR & 3BR units

Segment 3: AED 2M+
- Investors
- High net worth individuals
- Penthouses & luxury units
```

#### Buyer Type

**Investor Targeting:**
```
Interests:
- Real estate investment
- Stock market
- Business opportunities
- ROI, rental yield

Ad Messaging:
"8% Guaranteed ROI - Prime Investment Opportunity"
"Handover Q4 2025 - Rent from Day 1"
```

**End User Targeting:**
```
Interests:
- Home decoration
- Family activities
- Schools, hospitals
- Community lifestyle

Ad Messaging:
"Your Dream Family Home Awaits"
"Walk to School - 5 Min to Metro"
```

**First-time Buyer Targeting:**
```
Demographics:
- Age: 25-35
- Relationship: Engaged, Newly married
- Life events: Recently moved, New job

Ad Messaging:
"Own for Less Than Rent - AED 4,500/month"
"No Down Payment - Move in Today"
```

#### AI Audience Builder Logic

```javascript
function buildAudienceWithAI(property, campaignGoal) {
  const audience = {
    demographics: {},
    interests: [],
    behaviors: [],
    locations: []
  };

  // Analyze property price
  if (property.price < 1000000) {
    audience.demographics.age = "25-40";
    audience.demographics.income = "Medium";
    audience.interests.push("First home", "Affordable housing");
  } else if (property.price > 3000000) {
    audience.demographics.age = "35-65";
    audience.demographics.income = "High";
    audience.interests.push("Luxury lifestyle", "Premium brands");
  }

  // Analyze location
  if (property.location.includes("Marina")) {
    audience.interests.push("Beach lifestyle", "Water sports", "Dining");
    audience.locations.push("Dubai Marina", "JBR", "Jumeirah");
  }

  // Analyze amenities
  if (property.amenities.includes("Kids Pool")) {
    audience.demographics.family_status = "Parents";
    audience.interests.push("Family activities", "Children education");
  }

  return audience;
}
```

---

### 4. Campaign Content

#### Title + Description

**Basic Components:**
```
Title: What + Where + Why
Description: Benefits + Features + Urgency + CTA
```

**Examples:**

*Luxury Campaign:*
```
Title: "Waterfront Luxury Living in Dubai Marina"

Description:
"Experience unparalleled elegance in this stunning 3BR apartment with
panoramic sea views. Premium finishes, smart home technology, and
exclusive beach access.

Only 2 units remaining - Schedule your private viewing today."
```

*Investor Campaign:*
```
Title: "8% ROI - Prime Investment Opportunity"

Description:
"Secure your financial future with this high-yield investment property.
Guaranteed 8% annual returns, handover Q4 2025, rent from day one.

Payment plan: 20% down, 80% on handover. Book now with AED 10,000 only."
```

*First-time Buyer Campaign:*
```
Title: "Own Your First Home for AED 3,999/Month"

Description:
"Stop renting. Start owning. This beautiful 1BR apartment costs less
than your monthly rent. Modern design, prime location, ready to move.

No hidden fees. Flexible payment plans. Free property consultation."
```

#### AI-Generated Content

**Content Variation System:**

```javascript
function generateCampaignContent(property, targetAudience) {
  const templates = {
    luxury: {
      adjectives: ["exquisite", "stunning", "elegant", "prestigious"],
      features: ["panoramic views", "premium finishes", "exclusive access"],
      cta: ["Schedule private viewing", "Experience luxury today"]
    },
    investor: {
      adjectives: ["profitable", "high-yield", "prime", "strategic"],
      features: ["guaranteed ROI", "rental income", "capital appreciation"],
      cta: ["Calculate your returns", "Book consultation"]
    },
    firstTime: {
      adjectives: ["affordable", "perfect", "modern", "convenient"],
      features: ["easy payment plan", "move-in ready", "no hidden costs"],
      cta: ["Start your journey", "Own your dream home"]
    }
  };

  const template = templates[targetAudience];

  const content = {
    headline: `${randomChoice(template.adjectives)} ${property.type} in ${property.location}`,
    description: buildDescription(property, template.features),
    cta: randomChoice(template.cta)
  };

  return content;
}
```

**Content for Different Buyer Types:**

1. **Luxury Buyers**
```
Focus: Exclusivity, Premium, Lifestyle
Tone: Sophisticated, Aspirational
Keywords: Exclusive, Prestigious, Bespoke, Refined

Example:
"Indulge in sophisticated living at its finest. This bespoke residence
offers breathtaking vistas, designer interiors, and access to an
exclusive private club. A masterpiece crafted for the discerning few."
```

2. **Investors**
```
Focus: ROI, Numbers, Returns
Tone: Professional, Data-driven
Keywords: ROI, Yield, Appreciation, Investment

Example:
"Smart investment, guaranteed returns. 8% annual ROI with full property
management included. Prime location ensures strong capital appreciation.
Projected 25% value growth over 5 years. Book your investor meeting today."
```

3. **First-time Buyers**
```
Focus: Affordability, Simplicity, Support
Tone: Friendly, Reassuring
Keywords: Easy, Affordable, Simple, Supported

Example:
"Your first home made easy! We'll guide you every step of the way.
Affordable monthly payments, no hidden costs, and move-in support
included. Our team helps with everything from bank approvals to
furniture packages. Start your homeownership journey today!"
```

---

### 5. Campaign Strength Score

**Purpose:** Give agents a clear indicator of how well their campaign is set up and performing.

#### Score Calculation

```javascript
function calculateCampaignScore(campaign) {
  let score = 0;
  const weights = {
    setup: 30,      // Campaign configuration
    content: 25,    // Quality of content
    performance: 45 // Actual results
  };

  // 1. SETUP SCORE (30 points)
  let setupScore = 0;

  if (campaign.properties.length > 0) setupScore += 5;
  if (campaign.properties.length > 2) setupScore += 3; // Multiple properties
  if (campaign.targetAudience) setupScore += 5;
  if (campaign.budget > 5000) setupScore += 5;
  if (campaign.channels.length >= 3) setupScore += 5;
  if (campaign.hasImages) setupScore += 4;
  if (campaign.hasVideo) setupScore += 3;

  // 2. CONTENT SCORE (25 points)
  let contentScore = 0;

  if (campaign.title.length > 30) contentScore += 5;
  if (campaign.description.length > 100) contentScore += 5;
  if (campaign.hasCTA) contentScore += 5;
  if (campaign.hasHashtags) contentScore += 3;
  if (campaign.contentVariations >= 3) contentScore += 4;
  if (campaign.hasUrgency) contentScore += 3;

  // 3. PERFORMANCE SCORE (45 points)
  let performanceScore = 0;

  const ctr = campaign.clicks / campaign.impressions;
  const conversionRate = campaign.leads / campaign.clicks;
  const cpl = campaign.spent / campaign.leads;

  // CTR Score (15 points)
  if (ctr > 0.05) performanceScore += 15;      // Excellent (5%+)
  else if (ctr > 0.03) performanceScore += 12; // Good (3-5%)
  else if (ctr > 0.02) performanceScore += 8;  // Average (2-3%)
  else if (ctr > 0.01) performanceScore += 4;  // Poor (1-2%)

  // Conversion Rate Score (15 points)
  if (conversionRate > 0.20) performanceScore += 15;      // Excellent (20%+)
  else if (conversionRate > 0.15) performanceScore += 12; // Good (15-20%)
  else if (conversionRate > 0.10) performanceScore += 8;  // Average (10-15%)
  else if (conversionRate > 0.05) performanceScore += 4;  // Poor (5-10%)

  // Cost Per Lead Score (15 points)
  if (cpl < 50) performanceScore += 15;       // Excellent (<50 AED)
  else if (cpl < 100) performanceScore += 12; // Good (50-100 AED)
  else if (cpl < 150) performanceScore += 8;  // Average (100-150 AED)
  else if (cpl < 200) performanceScore += 4;  // Poor (150-200 AED)

  score = setupScore + contentScore + performanceScore;

  return {
    total: score,
    grade: getGrade(score),
    breakdown: { setupScore, contentScore, performanceScore }
  };
}

function getGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}
```

#### Factors Affecting Score

**1. Click-Through Rate (CTR)**
```
CTR = (Clicks / Impressions) × 100

Excellent: > 5%
Good:      3-5%
Average:   2-3%
Poor:      < 2%

Impact: If CTR is low, improve:
- Ad creative (use better images)
- Headline (make it more compelling)
- Targeting (reach more relevant audience)
```

**2. Engagement Rate**
```
Engagement = (Likes + Comments + Shares + Saves) / Impressions

High Engagement = More people interested = Higher score

Impact: If engagement is low, improve:
- Content quality (tell a story)
- Call-to-action (ask questions)
- Visual appeal (use professional photos)
```

**3. Channel Performance**
```
Best Channel = Channel with lowest CPL and highest conversion

If one channel performs 2x better than others:
- Increase its budget (+bonus points)
- Use similar strategy on other channels
```

#### Recommendations System

```javascript
function generateRecommendations(campaign, score) {
  const recommendations = [];

  // Low CTR recommendations
  if (campaign.ctr < 0.02) {
    recommendations.push({
      priority: "HIGH",
      category: "Content",
      issue: "Low click-through rate (CTR < 2%)",
      suggestions: [
        "Use more eye-catching property images",
        "Update headline to include price or unique benefit",
        "Add urgency ('Limited units', 'Ending soon')",
        "Test different ad formats (carousel, video)"
      ],
      expectedImpact: "+30% CTR"
    });
  }

  // High CPL recommendations
  if (campaign.cpl > 150) {
    recommendations.push({
      priority: "HIGH",
      category: "Budget",
      issue: "High cost per lead (CPL > AED 150)",
      suggestions: [
        "Narrow your target audience (too broad wastes budget)",
        "Exclude low-performing locations",
        "Lower bids on underperforming channels",
        "Improve landing page to increase conversions"
      ],
      expectedImpact: "-40% CPL"
    });
  }

  // Low conversion recommendations
  if (campaign.conversionRate < 0.10) {
    recommendations.push({
      priority: "MEDIUM",
      category: "Landing Page",
      issue: "Low conversion rate (< 10%)",
      suggestions: [
        "Simplify lead form (fewer fields)",
        "Add WhatsApp click-to-chat button",
        "Display trust signals (awards, reviews)",
        "Ensure mobile-friendly design"
      ],
      expectedImpact: "+50% conversion rate"
    });
  }

  // Channel optimization
  const bestChannel = findBestChannel(campaign.channels);
  const worstChannel = findWorstChannel(campaign.channels);

  if (bestChannel.cpl < worstChannel.cpl * 2) {
    recommendations.push({
      priority: "MEDIUM",
      category: "Channels",
      issue: `${bestChannel.name} performs 2x better than ${worstChannel.name}`,
      suggestions: [
        `Increase ${bestChannel.name} budget by 20%`,
        `Decrease ${worstChannel.name} budget by 20%`,
        `Copy ${bestChannel.name} strategy to other channels`
      ],
      expectedImpact: "+15% overall ROI"
    });
  }

  return recommendations;
}
```

**Recommendation Categories:**

1. **Content Optimization**
   - Better images
   - Stronger headlines
   - Clearer CTAs
   - More urgency

2. **Targeting Refinement**
   - Narrow audience
   - Exclude poor performers
   - Add lookalike audiences
   - Geographic optimization

3. **Budget Allocation**
   - Shift budget to best channels
   - Increase bid for hot times
   - Reduce spend on poor performers
   - Test new channels

4. **Landing Page**
   - Simplify forms
   - Add trust signals
   - Improve mobile experience
   - Add live chat

---

### 6. Automation System

**Purpose:** Automatically nurture leads without manual work.

#### Auto Follow-up Messages

```javascript
const followUpSequence = {
  day1: {
    delay: "immediate",
    channel: "whatsapp",
    message: `Hi {firstName}! 👋

Thank you for your interest in {propertyName}.

I'm {agentName}, your dedicated property consultant. I'd love to help you find your perfect home.

Quick question: When would be a good time for a quick call to discuss your requirements?

Reply:
1️⃣ Today
2️⃣ Tomorrow
3️⃣ This weekend`,

    triggers: {
      reply: "mark_as_hot_lead",
      noReply: "send_day3_followup"
    }
  },

  day3: {
    delay: "72 hours",
    condition: "no_reply_to_day1",
    channel: "whatsapp",
    message: `Hi {firstName},

I wanted to follow up on {propertyName} you viewed.

Here are some details you might find interesting:

📍 Location: {location}
💰 Price: AED {price}
🏠 Size: {bedrooms} BR, {sqft} sqft
✨ Special offer: {currentOffer}

Still interested? I can arrange a viewing at your convenience.

[View Full Details] {propertyLink}`,

    triggers: {
      reply: "mark_as_warm_lead",
      noReply: "send_day7_followup"
    }
  },

  day7: {
    delay: "168 hours",
    condition: "no_reply_to_day3",
    channel: "email",
    message: {
      subject: "Last chance: {propertyName} - {specialOffer}",
      body: `Dear {firstName},

I noticed you showed interest in {propertyName} last week.

I wanted to reach out one last time because we currently have:

🎁 Special limited-time offer: {offer}
⏰ Valid until: {offerEndDate}

If now is not the right time, no problem at all! But I'd hate for you to miss out on this opportunity.

Here are some similar properties that might interest you:

{recommendedProperties}

Best regards,
{agentName}
{agentPhone} | {agentEmail}`
    },

    triggers: {
      reply: "mark_as_warm_lead",
      noReply: "mark_as_cold_lead",
      link_click: "mark_as_hot_lead"
    }
  }
};
```

#### WhatsApp Auto-Reply

```javascript
const whatsappAutoReply = {
  // When lead sends first message
  initial_contact: {
    trigger: "first_whatsapp_message",
    response: `Hello! 👋

Thank you for contacting us about {propertyName}.

I'm an automated assistant. Let me help you quickly:

What would you like to know?
1️⃣ Price & Payment Plans
2️⃣ Schedule a Viewing
3️⃣ Property Details
4️⃣ Talk to Agent

Reply with a number or type your question.`,

    next_action: "wait_for_user_choice"
  },

  // User asks about price
  price_inquiry: {
    trigger: "message_contains(['price', 'cost', 'payment'])",
    response: `💰 PRICE DETAILS:

Property: {propertyName}
Price: AED {price}

PAYMENT PLANS:
1️⃣ Cash Buyer: 2% discount
2️⃣ Bank Finance: 20% down, 80% mortgage
3️⃣ Developer Plan: 10% down, 90% over 3 years

Monthly Payment: Starting from AED {monthlyPayment}

Would you like to:
📅 Schedule viewing
🏦 Get mortgage pre-approval
📱 Talk to agent now`,

    next_action: "wait_for_user_choice"
  },

  // User wants to schedule viewing
  schedule_viewing: {
    trigger: "message_contains(['viewing', 'visit', 'see property'])",
    response: `📅 SCHEDULE YOUR VIEWING:

Available time slots:

Tomorrow:
⏰ 10:00 AM
⏰ 2:00 PM
⏰ 5:00 PM

This Weekend:
⏰ Saturday 11:00 AM
⏰ Sunday 3:00 PM

Reply with your preferred time, or suggest another time that works for you.

Note: Viewings typically take 30 minutes.`,

    next_action: "create_viewing_appointment"
  },

  // Outside business hours
  after_hours: {
    trigger: "time_is_outside_business_hours",
    response: `Thank you for your message!

Our office hours are:
🕐 Monday-Friday: 9 AM - 7 PM
🕐 Saturday: 10 AM - 5 PM
⛔ Sunday: Closed

Your message has been received and our team will respond first thing during business hours.

For urgent inquiries, call: {emergencyNumber}

In the meantime, you can:
📱 Browse properties: {websiteLink}
📧 Email us: {email}`,

    next_action: "queue_for_agent_response"
  }
};
```

#### Lead Prioritization

**Hot/Warm/Cold Classification:**

```javascript
function classifyLead(lead, interactions) {
  let score = 0;

  // ENGAGEMENT SIGNALS (40 points)
  if (interactions.repliedToMessage) score += 15;
  if (interactions.clickedPropertyLink) score += 10;
  if (interactions.watchedVideo) score += 8;
  if (interactions.viewedMultipleProperties) score += 7;

  // INTENT SIGNALS (30 points)
  if (lead.askedAboutPrice) score += 10;
  if (lead.requestedViewing) score += 15;
  if (lead.askedAboutFinancing) score += 5;

  // QUALIFICATION SIGNALS (30 points)
  if (lead.budgetMatches) score += 10;
  if (lead.providedFullDetails) score += 10;
  if (lead.timeframeSoon) score += 10; // "Looking to buy in 1-3 months"

  // CLASSIFY
  if (score >= 70) return {
    priority: "HOT",
    color: "red",
    action: "Call immediately",
    sla: "Respond within 5 minutes"
  };

  if (score >= 40) return {
    priority: "WARM",
    color: "orange",
    action: "Follow up today",
    sla: "Respond within 2 hours"
  };

  return {
    priority: "COLD",
    color: "blue",
    action: "Add to nurture sequence",
    sla: "Respond within 24 hours"
  };
}
```

**Lead Priority Dashboard:**

```
🔴 HOT LEADS (Call Now!)
├─ Mohammed Ahmed - Requested viewing for Marina Tower
│  Last activity: 5 minutes ago
│  Budget: AED 1.5M (Matches property)
│  Phone: +971 50 123 4567 [CALL NOW]
│
├─ Sarah Johnson - Asked about payment plans
│  Last activity: 12 minutes ago
│  Budget: AED 2M (Qualified)
│  Phone: +971 55 987 6543 [CALL NOW]

🟠 WARM LEADS (Follow Up Today)
├─ Ali Hassan - Viewed property page 3 times
│  Last activity: 2 hours ago
│  Budget: Not disclosed
│  Action: Send WhatsApp message
│
├─ Emma Wilson - Clicked property link
│  Last activity: 4 hours ago
│  Budget: AED 1M
│  Action: Send pricing details

🔵 COLD LEADS (Nurture Sequence)
├─ Ahmed Khan - Filled form only
│  Last activity: 2 days ago
│  Budget: Unknown
│  Action: Auto follow-up sequence
```

#### Follow-up Sequences

**Sequence Logic:**

```
Lead Captured
    ↓
Immediate: Welcome message (WhatsApp)
    ↓
[Wait 10 minutes]
    ↓
Did lead reply?
    YES → Mark as HOT → Agent takes over
    NO → Continue sequence
    ↓
[Wait 3 days]
    ↓
Day 3: Send property details + similar options (WhatsApp)
    ↓
Did lead engage?
    YES → Mark as WARM → Agent follows up
    NO → Continue sequence
    ↓
[Wait 4 days]
    ↓
Day 7: Last follow-up + special offer (Email)
    ↓
Did lead engage?
    YES → Mark as WARM → Agent follows up
    NO → Mark as COLD → Add to long-term nurture
    ↓
[Wait 30 days]
    ↓
Month 2: New property launches matching their criteria
    ↓
[Continue quarterly nurture]
```

**Automation Rules:**

```javascript
const automationRules = {
  rule1: {
    name: "Instant Hot Lead Alert",
    trigger: "lead_requests_viewing OR lead_provides_phone",
    action: [
      "Send SMS to agent immediately",
      "Mark lead as HOT",
      "Create viewing appointment",
      "Send confirmation to lead"
    ]
  },

  rule2: {
    name: "Weekend Lead Handler",
    trigger: "lead_captured_on_weekend",
    action: [
      "Send auto-reply: 'Thanks! We'll call Monday 9 AM'",
      "Queue for Monday morning agent",
      "Send property brochure via email"
    ]
  },

  rule3: {
    name: "Engagement Decay Prevention",
    trigger: "warm_lead_no_activity_for_5_days",
    action: [
      "Send: 'Hi! Still looking for a property?'",
      "Offer: 'I found 3 new properties matching your budget'",
      "Include: Links to new listings"
    ]
  },

  rule4: {
    name: "Re-engagement Campaign",
    trigger: "cold_lead_60_days_no_activity",
    action: [
      "Send: 'New Year Sale - Prices reduced by 10%'",
      "Offer: 'Free property consultation + market report'",
      "If reply: Move to WARM and assign agent"
    ]
  }
};
```

---

### 7. Share Functionality

**Purpose:** Enable agents to share campaigns across multiple platforms with optimized previews.

#### Dynamic Platform Selection

```javascript
const shareConfig = {
  // Platform capabilities
  platforms: {
    whatsapp: {
      available: true,
      preview: "rich_link",
      supports: ["text", "link", "image_via_og"],
      maxLength: 65536,
      method: "wa.me"
    },

    facebook: {
      available: true,
      preview: "rich_card",
      supports: ["text", "link", "image", "video"],
      maxLength: 63206,
      method: "sharer.php"
    },

    instagram: {
      available: true,
      preview: "story",
      supports: ["image", "video"],
      maxLength: 2200,
      method: "copy_to_clipboard",
      note: "Manual paste required"
    },

    linkedin: {
      available: true,
      preview: "rich_card",
      supports: ["text", "link", "image"],
      maxLength: 3000,
      method: "sharing/share-offsite"
    },

    twitter: {
      available: true,
      preview: "card",
      supports: ["text", "link", "image_via_og"],
      maxLength: 280,
      method: "intent/tweet"
    },

    email: {
      available: true,
      preview: "html",
      supports: ["text", "html", "image", "link"],
      maxLength: "unlimited",
      method: "mailto"
    }
  }
};
```

#### Campaign-Based Sharing

**Share URL Structure:**

```
Standard Campaign URL:
https://yourapp.com/campaign/{campaignId}

Example:
https://yourapp.com/campaign/cmp_abc123

With Tracking:
https://yourapp.com/campaign/cmp_abc123?source=whatsapp&agent=ag_xyz789
```

**Dynamic Content Per Platform:**

```javascript
function generateShareContent(campaign, platform) {
  const baseContent = {
    title: campaign.name,
    description: campaign.description,
    image: campaign.creativeAssets?.projectImage || DEFAULT_IMAGE,
    url: `${BASE_URL}/campaign/${campaign.id}`
  };

  switch(platform) {
    case 'whatsapp':
      return {
        text: `${campaign.name}

${campaign.description}

📍 ${campaign.location}
💰 ${campaign.price}

${campaign.urgency || '⏰ Limited time offer'}

👉 View details: ${baseContent.url}?source=whatsapp`,

        preview: "auto_generated_from_og_tags"
      };

    case 'facebook':
      return {
        url: baseContent.url + "?source=facebook",
        quote: campaign.description,
        hashtag: campaign.hashtags?.[0] || "#RealEstate"
      };

    case 'instagram':
      return {
        caption: `${campaign.name}

${truncate(campaign.description, 100)}

${campaign.hashtags?.join(' ') || ''}

Link in bio 👆`,

        action: "copy_link_to_clipboard",
        instruction: "Paste the link in your Instagram bio or story link"
      };

    case 'linkedin':
      return {
        url: baseContent.url + "?source=linkedin",
        title: campaign.name,
        summary: campaign.description
      };

    case 'twitter':
      const tweetText = `${campaign.name}\n\n${truncate(campaign.description, 180)}\n\n${campaign.hashtags?.slice(0, 3).join(' ') || ''}`;

      return {
        text: tweetText,
        url: baseContent.url + "?source=twitter"
      };

    case 'email':
      return {
        subject: campaign.name,
        body: generateEmailHTML(campaign, baseContent.url + "?source=email")
      };
  }
}
```

#### OG Meta Tags Usage

**Meta Tags in HTML Head:**

```html
<!-- Open Graph Tags for Rich Previews -->
<head>
  <!-- Basic OG Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yourapp.com/campaign/cmp_abc123" />
  <meta property="og:title" content="Luxury Marina Living - 2BR from AED 1.5M" />
  <meta property="og:description" content="Stunning waterfront apartment with panoramic sea views. Premium finishes, smart home technology, and exclusive beach access." />
  <meta property="og:image" content="https://yourcdn.com/property-images/marina-tower.jpg" />

  <!-- Image Dimensions (Recommended for best preview) -->
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Marina Tower luxury apartment exterior view" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Luxury Marina Living - 2BR from AED 1.5M" />
  <meta name="twitter:description" content="Stunning waterfront apartment with panoramic sea views." />
  <meta name="twitter:image" content="https://yourcdn.com/property-images/marina-tower.jpg" />

  <!-- WhatsApp Specific (uses OG tags) -->
  <meta property="og:site_name" content="Prime Properties" />
  <meta property="og:locale" content="en_US" />
</head>
```

**Dynamic Meta Tag Generation:**

```javascript
// On campaign redirect page
function setMetaTags(campaign) {
  const property = campaign.properties[0];
  const image = campaign.creativeAssets?.projectImage || DEFAULT_IMAGE;

  const metaTags = {
    'og:title': campaign.name,
    'og:description': `${campaign.description}\n\n📍 ${property.location}\n💰 AED ${property.price.toLocaleString()}`,
    'og:image': image,
    'og:url': `${BASE_URL}/campaign/${campaign.id}`,
    'og:type': 'website',
    'og:image:width': '1200',
    'og:image:height': '630'
  };

  // Update or create meta tags
  Object.entries(metaTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  });
}
```

#### Preview Generation

**WhatsApp Preview:**

```
┌──────────────────────────────────────┐
│ [Property Image]                      │
│                                       │
│ Luxury Marina Living - 2BR from 1.5M  │
│                                       │
│ Stunning waterfront apartment with   │
│ panoramic sea views. Premium finish  │
│                                       │
│ 📍 Dubai Marina | 💰 AED 1,500,000   │
│                                       │
│ 🌐 yourapp.com                        │
└──────────────────────────────────────┘
```

**Facebook Preview:**

```
┌──────────────────────────────────────┐
│  [Large Property Image 1200x630]     │
├──────────────────────────────────────┤
│ YOURAPP.COM                           │
│                                       │
│ Luxury Marina Living - 2BR from 1.5M  │
│                                       │
│ Stunning waterfront apartment with   │
│ panoramic sea views. Premium finishes │
│ smart home technology, and exclusive  │
│ beach access. Only 2 units remaining  │
└──────────────────────────────────────┘
   [Like] [Comment] [Share]
```

**Email Preview:**

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <img src="{propertyImage}" alt="{propertyName}" width="100%" />
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <h2>{campaignName}</h2>
        <p>{campaignDescription}</p>

        <table width="100%" style="margin: 20px 0;">
          <tr>
            <td><strong>📍 Location:</strong></td>
            <td>{location}</td>
          </tr>
          <tr>
            <td><strong>💰 Price:</strong></td>
            <td>AED {price}</td>
          </tr>
          <tr>
            <td><strong>🏠 Type:</strong></td>
            <td>{bedrooms} BR, {sqft} sqft</td>
          </tr>
        </table>

        <a href="{campaignUrl}"
           style="display: inline-block; background: #007bff; color: white;
                  padding: 12px 30px; text-decoration: none; border-radius: 5px;">
          View Property Details
        </a>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. SOCIAL MEDIA INTEGRATION

### 1. Facebook Ads Integration

**API: Meta Ads API (Facebook Marketing API)**

#### Campaign Structure

```
Campaign (Campaign objective: Lead Generation)
    ├─ Ad Set 1 (Audience: Dubai, Age 25-45, Budget: AED 100/day)
    │   ├─ Ad 1 (Creative: Image + Headline + CTA)
    │   ├─ Ad 2 (Creative: Video + Headline + CTA)
    │   └─ Ad 3 (Creative: Carousel + Headline + CTA)
    │
    ├─ Ad Set 2 (Audience: Abu Dhabi, Age 35-55, Budget: AED 80/day)
    │   ├─ Ad 1 (Creative: Image + Headline + CTA)
    │   └─ Ad 2 (Creative: Video + Headline + CTA)
    │
    └─ Ad Set 3 (Lookalike: Previous buyers, Budget: AED 120/day)
        └─ Ad 1 (Creative: Image + Headline + CTA)
```

#### Implementation

```javascript
// 1. Create Campaign
async function createFacebookCampaign(campaignData) {
  const FB_AD_ACCOUNT_ID = 'act_123456789';
  const ACCESS_TOKEN = 'your_facebook_access_token';

  // Step 1: Create Campaign
  const campaign = await fetch(`https://graph.facebook.com/v18.0/${FB_AD_ACCOUNT_ID}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: campaignData.name,
      objective: 'LEAD_GENERATION', // or 'OUTCOME_TRAFFIC' for website visits
      status: 'PAUSED', // Start paused, activate after review
      special_ad_categories: ['HOUSING'], // Required for real estate
      access_token: ACCESS_TOKEN
    })
  });

  const campaignResult = await campaign.json();
  const fbCampaignId = campaignResult.id;

  // Step 2: Create Ad Set (Targeting + Budget)
  const adSet = await fetch(`https://graph.facebook.com/v18.0/${FB_AD_ACCOUNT_ID}/adsets`, {
    method: 'POST',
    body: JSON.stringify({
      name: `${campaignData.name} - Ad Set 1`,
      campaign_id: fbCampaignId,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      daily_budget: campaignData.budget * 100, // In cents

      // Targeting
      targeting: {
        geo_locations: {
          countries: ['AE'],
          cities: [
            { key: '2562305', name: 'Dubai' }
          ],
          location_types: ['home', 'recent']
        },
        age_min: 25,
        age_max: 55,
        genders: [0], // All genders
        interests: [
          { id: '6003139266461', name: 'Real estate' },
          { id: '6003020834693', name: 'Luxury goods' }
        ],
        behaviors: [
          { id: '6015559470583', name: 'Likely to move' }
        ],
        custom_audiences: [] // Add retargeting audiences
      },

      status: 'PAUSED',
      access_token: ACCESS_TOKEN
    })
  });

  const adSetResult = await adSet.json();
  const fbAdSetId = adSetResult.id;

  // Step 3: Create Ad Creative
  const creative = await fetch(`https://graph.facebook.com/v18.0/${FB_AD_ACCOUNT_ID}/adcreatives`, {
    method: 'POST',
    body: JSON.stringify({
      name: `${campaignData.name} - Creative 1`,
      object_story_spec: {
        page_id: 'your_page_id',
        link_data: {
          link: `${BASE_URL}/campaign/${campaignData.id}?source=facebook`,
          message: campaignData.description,
          name: campaignData.name,
          description: campaignData.subtitle,
          call_to_action: {
            type: 'LEARN_MORE', // or 'SIGN_UP', 'APPLY_NOW'
            value: {
              link: `${BASE_URL}/campaign/${campaignData.id}?source=facebook`
            }
          },
          image_hash: 'uploaded_image_hash', // Upload image first
          caption: 'yourwebsite.com'
        }
      },
      access_token: ACCESS_TOKEN
    })
  });

  const creativeResult = await creative.json();
  const fbCreativeId = creativeResult.id;

  // Step 4: Create Ad
  const ad = await fetch(`https://graph.facebook.com/v18.0/${FB_AD_ACCOUNT_ID}/ads`, {
    method: 'POST',
    body: JSON.stringify({
      name: `${campaignData.name} - Ad 1`,
      adset_id: fbAdSetId,
      creative: { creative_id: fbCreativeId },
      status: 'PAUSED',
      access_token: ACCESS_TOKEN
    })
  });

  const adResult = await ad.json();

  return {
    campaignId: fbCampaignId,
    adSetId: fbAdSetId,
    creativeId: fbCreativeId,
    adId: adResult.id
  };
}
```

#### Lead Form Integration

```javascript
// Create Facebook Lead Form
async function createLeadForm(campaignData) {
  const form = await fetch(`https://graph.facebook.com/v18.0/{page_id}/leadgen_forms`, {
    method: 'POST',
    body: JSON.stringify({
      name: `${campaignData.name} - Lead Form`,
      privacy_policy_url: 'https://yourwebsite.com/privacy',

      // Form questions
      questions: [
        {
          type: 'FULL_NAME',
          key: 'full_name'
        },
        {
          type: 'EMAIL',
          key: 'email'
        },
        {
          type: 'PHONE',
          key: 'phone_number'
        },
        {
          type: 'CUSTOM',
          key: 'budget',
          label: 'What is your budget?',
          options: [
            { key: '500k_1m', value: 'AED 500K - 1M' },
            { key: '1m_2m', value: 'AED 1M - 2M' },
            { key: '2m_plus', value: 'AED 2M+' }
          ]
        },
        {
          type: 'CUSTOM',
          key: 'timeframe',
          label: 'When are you looking to buy?',
          options: [
            { key: 'asap', value: 'As soon as possible' },
            { key: '1_3_months', value: '1-3 months' },
            { key: '3_6_months', value: '3-6 months' },
            { key: 'just_looking', value: 'Just browsing' }
          ]
        }
      ],

      // Thank you screen
      thank_you_page: {
        title: 'Thank You!',
        body: 'We will contact you shortly to discuss your requirements.',
        button_text: 'View Property',
        button_type: 'VIEW_WEBSITE',
        website_url: `${BASE_URL}/campaign/${campaignData.id}`
      },

      access_token: ACCESS_TOKEN
    })
  });

  return await form.json();
}
```

#### Webhook for Lead Capture

```javascript
// Webhook endpoint to receive leads from Facebook
app.post('/webhooks/facebook/leads', async (req, res) => {
  const body = req.body;

  // Verify webhook
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.changes.forEach(async (change) => {
        if (change.field === 'leadgen') {
          const leadgenId = change.value.leadgen_id;
          const formId = change.value.form_id;
          const pageId = change.value.page_id;

          // Fetch lead data from Facebook
          const leadData = await fetch(
            `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${ACCESS_TOKEN}`
          );

          const lead = await leadData.json();

          // Extract field values
          const leadInfo = {};
          lead.field_data.forEach(field => {
            leadInfo[field.name] = field.values[0];
          });

          // Save to database
          await supabase.from('leads').insert({
            campaign_id: getCampaignIdFromFormId(formId),
            source: 'facebook',
            first_name: leadInfo.full_name?.split(' ')[0],
            last_name: leadInfo.full_name?.split(' ').slice(1).join(' '),
            email: leadInfo.email,
            phone: leadInfo.phone_number,
            budget: leadInfo.budget,
            timeframe: leadInfo.timeframe,
            status: 'new',
            priority: calculatePriority(leadInfo),
            created_at: new Date()
          });

          // Trigger automation
          await sendWelcomeMessage(leadInfo.phone_number, leadInfo.full_name);
        }
      });
    });

    res.sendStatus(200);
  }
});

// Webhook verification (required by Facebook)
app.get('/webhooks/facebook/leads', (req, res) => {
  const VERIFY_TOKEN = 'your_verify_token';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
```

---

### 2. Instagram Ads Integration

**Connected via Facebook Ads Manager**

Instagram ads use the same Meta Ads API as Facebook. The only difference is the placement configuration.

```javascript
async function createInstagramAd(campaignData, fbCampaignId) {
  // Create Ad Set with Instagram placements
  const adSet = await fetch(`https://graph.facebook.com/v18.0/${FB_AD_ACCOUNT_ID}/adsets`, {
    method: 'POST',
    body: JSON.stringify({
      name: `${campaignData.name} - Instagram`,
      campaign_id: fbCampaignId,

      // Instagram-specific placements
      publisher_platforms: ['instagram'],
      instagram_positions: ['stream', 'story', 'explore'],

      // Or multi-platform
      // publisher_platforms: ['facebook', 'instagram'],
      // facebook_positions: ['feed', 'right_hand_column'],
      // instagram_positions: ['stream', 'story'],

      daily_budget: campaignData.instagramBudget * 100,
      optimization_goal: 'LINK_CLICKS',
      billing_event: 'IMPRESSIONS',

      targeting: {
        geo_locations: { countries: ['AE'] },
        age_min: 25,
        age_max: 45,
        interests: [
          { id: '6003139266461', name: 'Real estate' },
          { id: '6003050295186', name: 'Luxury lifestyle' },
          { id: '6003348604581', name: 'Architecture' }
        ]
      },

      access_token: ACCESS_TOKEN
    })
  });

  const adSetResult = await adSet.json();

  // Create Instagram-optimized creative
  const creative = await fetch(`https://graph.facebook.com/v18.0/${FB_AD_ACCOUNT_ID}/adcreatives`, {
    method: 'POST',
    body: JSON.stringify({
      name: `${campaignData.name} - Instagram Creative`,
      object_story_spec: {
        instagram_actor_id: 'your_instagram_business_account_id',
        link_data: {
          link: `${BASE_URL}/campaign/${campaignData.id}?source=instagram`,
          message: truncate(campaignData.description, 125), // Instagram caption limit
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              link: `${BASE_URL}/campaign/${campaignData.id}?source=instagram`
            }
          },

          // For Stories
          image_url: campaignData.storyImage, // 9:16 aspect ratio

          // For Feed
          // image_url: campaignData.feedImage, // 1:1 or 4:5 aspect ratio
        }
      },
      access_token: ACCESS_TOKEN
    })
  });

  return await creative.json();
}
```

**Media Requirements:**

```javascript
const instagramAdSpecs = {
  feed: {
    aspectRatio: '4:5', // or '1:1'
    minResolution: '600x750',
    recommendedResolution: '1080x1350',
    fileSize: 'max 30MB',
    caption: 'max 2200 characters',
    hashtags: 'max 30'
  },

  story: {
    aspectRatio: '9:16',
    minResolution: '600x1067',
    recommendedResolution: '1080x1920',
    fileSize: 'max 30MB',
    duration: '5-15 seconds (video)',
    interactiveCTA: ['See More', 'Swipe Up', 'Learn More']
  },

  reels: {
    aspectRatio: '9:16',
    resolution: '1080x1920',
    duration: '15-90 seconds',
    fileSize: 'max 4GB',
    audio: 'required for best performance'
  }
};
```

---

### 3. Google Ads Integration

**API: Google Ads API**

#### Setup

```javascript
const { GoogleAdsApi } = require('google-ads-api');

const client = new GoogleAdsApi({
  client_id: 'your_client_id',
  client_secret: 'your_client_secret',
  developer_token: 'your_developer_token'
});

const customer = client.Customer({
  customer_id: '1234567890',
  refresh_token: 'your_refresh_token'
});
```

#### Create Search Campaign

```javascript
async function createGoogleSearchCampaign(campaignData) {
  // 1. Create Campaign
  const campaign = await customer.campaigns.create({
    name: campaignData.name,
    status: 'PAUSED',
    advertising_channel_type: 'SEARCH',
    bidding_strategy_type: 'MAXIMIZE_CONVERSIONS',

    // Budget
    campaign_budget: {
      name: `${campaignData.name} Budget`,
      amount_micros: campaignData.budget * 1000000, // Convert to micros
      delivery_method: 'STANDARD'
    },

    // Networks
    network_settings: {
      target_google_search: true,
      target_search_network: true,
      target_content_network: false,
      target_partner_search_network: false
    }
  });

  // 2. Create Ad Group
  const adGroup = await customer.adGroups.create({
    name: `${campaignData.name} - Ad Group 1`,
    campaign: campaign.resource_name,
    status: 'ENABLED',
    type: 'SEARCH_STANDARD',

    // Bidding
    cpc_bid_micros: 5000000 // AED 5 max CPC
  });

  // 3. Add Keywords
  const keywords = [
    'dubai apartments for sale',
    'buy apartment dubai marina',
    'luxury apartments dubai',
    'property for sale dubai',
    `${campaignData.location} apartments`
  ];

  for (const keyword of keywords) {
    await customer.adGroupCriteria.create({
      ad_group: adGroup.resource_name,
      status: 'ENABLED',
      keyword: {
        text: keyword,
        match_type: 'PHRASE' // or 'EXACT', 'BROAD'
      },

      // Negative keywords
      negative: false
    });
  }

  // 4. Create Responsive Search Ad
  const ad = await customer.ads.create({
    ad_group: adGroup.resource_name,
    status: 'ENABLED',

    responsive_search_ad: {
      headlines: [
        { text: campaignData.name },
        { text: `From AED ${campaignData.price.toLocaleString()}` },
        { text: `${campaignData.bedrooms}BR in ${campaignData.location}` },
        { text: 'Limited Units Available' },
        { text: 'Book Your Viewing Today' }
      ],

      descriptions: [
        { text: truncate(campaignData.description, 90) },
        { text: `Premium amenities. Prime location. ${campaignData.cta}` }
      ],

      path1: 'property',
      path2: campaignData.id,

      final_urls: [`${BASE_URL}/campaign/${campaignData.id}?source=google_search`]
    }
  });

  return {
    campaign: campaign.resource_name,
    adGroup: adGroup.resource_name,
    ad: ad.resource_name
  };
}
```

#### Create Display Campaign

```javascript
async function createGoogleDisplayCampaign(campaignData) {
  const campaign = await customer.campaigns.create({
    name: `${campaignData.name} - Display`,
    status: 'PAUSED',
    advertising_channel_type: 'DISPLAY',

    // Targeting
    targeting_setting: {
      target_restrictions: [
        {
          targeting_dimension: 'AUDIENCE',
          bid_only: false
        }
      ]
    }
  });

  const adGroup = await customer.adGroups.create({
    name: `${campaignData.name} - Display Ad Group`,
    campaign: campaign.resource_name,
    type: 'DISPLAY_STANDARD'
  });

  // Add Display Ad (Responsive Display Ad)
  const ad = await customer.ads.create({
    ad_group: adGroup.resource_name,

    responsive_display_ad: {
      marketing_images: [
        {
          asset: 'path_to_uploaded_image_asset' // 1200x628 recommended
        }
      ],

      square_marketing_images: [
        {
          asset: 'path_to_uploaded_square_image' // 1200x1200
        }
      ],

      headlines: [
        { text: campaignData.name }
      ],

      long_headline: {
        text: `${campaignData.name} - From AED ${campaignData.price.toLocaleString()}`
      },

      descriptions: [
        { text: truncate(campaignData.description, 90) }
      ],

      business_name: 'Your Business Name',

      final_urls: [`${BASE_URL}/campaign/${campaignData.id}?source=google_display`],

      call_to_action_text: 'LEARN_MORE'
    }
  });

  return ad;
}
```

#### Landing Page Tracking

```javascript
// Add conversion tracking to landing page
const googleAdsConversion = `
<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-CONVERSION_ID');

  // Track lead submission
  function trackLeadSubmission() {
    gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
      'value': 1.0,
      'currency': 'AED'
    });
  }
</script>
`;

// In your lead form submission
const handleLeadSubmit = async (formData) => {
  // Save lead
  await saveLead(formData);

  // Track conversion
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
      'transaction_id': formData.leadId
    });
  }
};
```

---

### 4. WhatsApp Integration

**API: WhatsApp Business API**

#### Setup

```javascript
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = 'your_phone_number_id';
const WHATSAPP_ACCESS_TOKEN = 'your_whatsapp_access_token';
```

#### Broadcast Messaging

```javascript
async function sendWhatsAppBroadcast(campaignData, phoneNumbers) {
  const results = [];

  for (const phoneNumber of phoneNumbers) {
    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'template',
            template: {
              name: 'property_campaign', // Pre-approved template
              language: { code: 'en' },
              components: [
                {
                  type: 'header',
                  parameters: [
                    {
                      type: 'image',
                      image: {
                        link: campaignData.creativeAssets.projectImage
                      }
                    }
                  ]
                },
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: campaignData.name },
                    { type: 'text', text: campaignData.location },
                    { type: 'text', text: `AED ${campaignData.price.toLocaleString()}` }
                  ]
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: 0,
                  parameters: [
                    {
                      type: 'text',
                      text: campaignData.id // Appended to button URL
                    }
                  ]
                }
              ]
            }
          })
        }
      );

      const result = await response.json();
      results.push({ phoneNumber, success: true, messageId: result.messages[0].id });

      // Track broadcast
      await supabase.from('whatsapp_broadcasts').insert({
        campaign_id: campaignData.id,
        phone_number: phoneNumber,
        message_id: result.messages[0].id,
        status: 'sent',
        sent_at: new Date()
      });

      // Rate limiting (avoid spam)
      await sleep(1000); // 1 second between messages

    } catch (error) {
      results.push({ phoneNumber, success: false, error: error.message });
    }
  }

  return results;
}
```

#### Message Template (Pre-approval required)

```
Template Name: property_campaign
Category: MARKETING
Language: English

Header: [IMAGE]

Body:
🏢 New Property Alert!

{{1}} - Exclusive Opportunity

📍 Location: {{2}}
💰 Starting from: {{3}}

Don't miss out on this limited-time offer!

Tap below to view full details 👇

Footer:
Reply STOP to opt-out

Buttons:
[URL Button] View Property → https://yourwebsite.com/campaign/
[Quick Reply] Interested
[Quick Reply] More Info
```

#### Auto-Reply System

```javascript
// Webhook to receive WhatsApp messages
app.post('/webhooks/whatsapp', async (req, res) => {
  const body = req.body;

  if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
    const message = body.entry[0].changes[0].value.messages[0];
    const from = message.from; // Phone number
    const messageType = message.type;
    const messageContent = message.text?.body || message.interactive?.button_reply?.title;

    // Process incoming message
    await handleIncomingMessage(from, messageContent, messageType);

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

async function handleIncomingMessage(phoneNumber, content, type) {
  const leadContact = await supabase
    .from('leads')
    .select('*')
    .eq('phone', phoneNumber)
    .maybeSingle();

  // New lead - not in database
  if (!leadContact) {
    await sendWhatsAppMessage(phoneNumber, {
      type: 'text',
      text: {
        body: `Hello! 👋\n\nThank you for contacting us. How can I help you today?\n\n1️⃣ Browse properties\n2️⃣ Schedule a viewing\n3️⃣ Speak to an agent\n\nReply with a number or type your question.`
      }
    });

    // Create lead
    await supabase.from('leads').insert({
      phone: phoneNumber,
      source: 'whatsapp',
      status: 'new',
      first_contact: new Date()
    });

    return;
  }

  // Existing lead - check context
  const lowerContent = content.toLowerCase();

  // Price inquiry
  if (lowerContent.includes('price') || lowerContent.includes('cost')) {
    const campaign = await getCampaignForLead(leadContact.id);

    await sendWhatsAppMessage(phoneNumber, {
      type: 'text',
      text: {
        body: `💰 PRICE DETAILS:\n\n${campaign.name}\nStarting from: AED ${campaign.price.toLocaleString()}\n\n📋 Payment Plans Available:\n• Cash Buyer: 2% discount\n• Bank Finance: 20% down\n• Developer Plan: 10% down, 90% over 3 years\n\nWould you like to schedule a viewing?`
      }
    });

    await markLeadAsWarm(leadContact.id);
  }

  // Viewing request
  else if (lowerContent.includes('viewing') || lowerContent.includes('visit')) {
    await sendWhatsAppMessage(phoneNumber, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: '📅 Great! When would you like to visit?\n\nOur viewing slots:'
        },
        action: {
          buttons: [
            { type: 'reply', reply: { id: 'today', title: 'Today' } },
            { type: 'reply', reply: { id: 'tomorrow', title: 'Tomorrow' } },
            { type: 'reply', reply: { id: 'weekend', title: 'Weekend' } }
          ]
        }
      }
    });

    await markLeadAsHot(leadContact.id);
  }

  // Agent request
  else if (lowerContent.includes('agent') || lowerContent.includes('call')) {
    await sendWhatsAppMessage(phoneNumber, {
      type: 'text',
      text: {
        body: `📞 I'll connect you with our agent right away.\n\nYou can also call us directly at:\n+971 4 XXX XXXX\n\nOur agent will contact you within 5 minutes.`
      }
    });

    // Notify agent
    await notifyAgent(leadContact.id, 'Lead requested to speak with agent');
    await markLeadAsHot(leadContact.id);
  }

  // Default response
  else {
    await sendWhatsAppMessage(phoneNumber, {
      type: 'text',
      text: {
        body: `Thanks for your message!\n\nI can help you with:\n\n1️⃣ Property prices & payment plans\n2️⃣ Schedule viewings\n3️⃣ Connect with an agent\n\nWhat would you like to know?`
      }
    });
  }

  // Log interaction
  await supabase.from('whatsapp_interactions').insert({
    lead_id: leadContact.id,
    direction: 'incoming',
    message: content,
    timestamp: new Date()
  });
}

async function sendWhatsAppMessage(phoneNumber, messageData) {
  const response = await fetch(
    `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        ...messageData
      })
    }
  );

  return await response.json();
}
```

---

## 5. LEAD FLOW (END-TO-END)

### Complete User Journey

```
STEP 1: User Sees Ad
├─ Platform: Facebook/Instagram/Google
├─ Content: Property image + headline + price
├─ Targeting: Matched user's interests/demographics
└─ Ad ID: fb_ad_abc123

↓

STEP 2: User Clicks Ad
├─ Click tracked in platform
├─ UTM parameters added to URL
├─ Example: yoursite.com/campaign/cmp_123?
│            source=facebook&
│            medium=cpc&
│            campaign=summer_sale&
���            ad_id=fb_ad_abc123
└─ User redirected to landing page

↓

STEP 3: Landing Page Opens
├─ URL: yoursite.com/campaign/cmp_123
├─ Page loads with:
│   ├─ Property images
│   ├─ Property details
│   ├─ Price & payment plans
│   ├─ Lead capture form
│   └─ WhatsApp click-to-chat
├─ UTM params stored in session
└─ Page view tracked

↓

STEP 4: Lead Captured (Multiple Ways)

Option A: Form Submission
├─ User fills form:
│   ├─ Name: Mohammed Ahmed
│   ├─ Email: mohammed@email.com
│   ├─ Phone: +971 50 123 4567
│   ├─ Budget: AED 1-2M
│   └─ Message: Interested in 2BR
├─ Form validation
├─ Submit button clicked
└─ Lead saved to database

Option B: WhatsApp Click
├─ User clicks WhatsApp button
├─ Pre-filled message opens in WhatsApp:
│   "Hi, I'm interested in [Property Name]"
├─ User sends message
├─ Webhook receives message
└─ Lead created automatically

Option C: Call Button
├─ User clicks "Call Now"
├─ Phone number displayed: +971 4 XXX XXXX
├─ Call tracking number used
├─ Call received and logged
└─ Lead created from call log

Option D: Facebook Lead Form (in-platform)
├─ User clicks ad
├─ Form opens within Facebook
├─ Pre-filled with Facebook data
├─ User submits
├─ Webhook receives lead
└─ Lead saved to database

↓

STEP 5: Lead Stored in Database
INSERT INTO leads (
  id: 'lead_xyz789',
  campaign_id: 'cmp_123',
  source: 'facebook',
  medium: 'cpc',
  ad_id: 'fb_ad_abc123',

  first_name: 'Mohammed',
  last_name: 'Ahmed',
  email: 'mohammed@email.com',
  phone: '+971501234567',

  budget: '1000000-2000000',
  message: 'Interested in 2BR',

  status: 'new',
  priority: 'warm',

  created_at: '2026-03-26 14:30:00',
  ip_address: '185.XX.XX.XX',
  user_agent: 'Mozilla/5.0...'
)

↓

STEP 6: Lead Appears in Dashboard

Location 1: Campaign Details Page
├─ URL: /agent/campaigns/cmp_123
├─ "Leads" tab shows:
│   └─ Mohammed Ahmed
│       ├─ Status: New 🔴
│       ├─ Source: Facebook
│       ├─ Time: 2 minutes ago
│       ├─ Phone: +971 50 123 4567
│       └─ [Call] [WhatsApp] [Email]
└─ Lead counter incremented: 127 → 128 leads

Location 2: Leads Dashboard
├─ URL: /agent/leads
├─ All leads view:
│   └─ Mohammed Ahmed added to top
├─ Filtered by:
│   ├─ Campaign: Summer Sale
│   ├─ Status: New
│   └─ Priority: Warm
└─ Search: Searchable by name/phone/email

↓

STEP 7: Automation Triggers

Trigger 1: Welcome Message (Immediate)
├─ Delay: 0 seconds
├─ Channel: WhatsApp
├─ Message:
│   "Hi Mohammed! 👋
│
│   Thank you for your interest in Marina Heights Tower.
│
│   I'm Sarah, your property consultant.
│
│   When would be a good time to call you?
│   1️⃣ Now
│   2️⃣ Later today
│   3️⃣ Tomorrow"
└─ Status: Sent ✓

Trigger 2: Lead Assigned to Agent
├─ Assignment logic:
│   ├─ Round-robin (fair distribution)
│   ├─ OR by territory (Dubai Marina → Agent A)
│   ├─ OR by availability (online agents first)
│   └─ OR by performance (best closer)
├─ Agent assigned: Sarah Johnson
└─ Notification sent to agent:
    "🔔 New lead assigned: Mohammed Ahmed
     Budget: AED 1-2M | Source: Facebook
     [View Lead]"

Trigger 3: Lead Scoring
├─ Calculate priority:
│   ├─ Budget matches property: +20 points
│   ├─ Clicked from Facebook ad: +10 points
│   ├─ Filled complete form: +15 points
│   ├─ Requested viewing: +25 points (if applicable)
│   └─ Total: 45 points
├─ Classification: WARM (40-69 points)
└─ Priority set in database

Trigger 4: CRM Integration
├─ Lead synced to CRM
├─ Create contact record
├─ Create opportunity
├─ Set follow-up task for agent
└─ Add to email nurture sequence

↓

STEP 8: Follow-up Sequence Starts

Day 1 (Immediate):
├─ WhatsApp: Welcome message [SENT]
├─ Email: Welcome email with property brochure
├─ Agent: Notified to call within 5 minutes
└─ Status: Waiting for response

Day 1 (If user replies):
├─ Mark as HOT lead
├─ Agent alerted immediately
├─ Stop auto-sequence
└─ Agent takes over conversation

Day 1 (If no reply after 2 hours):
├─ Send SMS: "Hi Mohammed, did you receive my WhatsApp?"
└─ Continue sequence

Day 3 (If still no reply):
├─ WhatsApp: Property details + similar options
├─ Email: Comparison of 3 properties
└─ Status: Still warm, needs follow-up

Day 7 (Final automated attempt):
├─ Email: Last chance offer
├─ SMS: Special discount ending soon
└─ If no reply → Mark as COLD

Day 30 (Cold leads):
├─ Add to long-term nurture
├─ Monthly newsletter
└─ New launch alerts
```

---

## 6. CAMPAIGN DETAILS PAGE LOGIC

### How User Click Connects to Campaign

**URL Structure:**

```
Ad Click URL:
https://yoursite.com/campaign/cmp_abc123?
  source=facebook&
  medium=cpc&
  campaign=summer_sale&
  ad_id=fb_ad_123&
  adset_id=adset_456&
  creative_id=cr_789

Campaign Page receives:
- Campaign ID: cmp_abc123 (from URL path)
- Source params: source, medium, campaign, ad_id, etc. (from query string)
```

**Page Load Logic:**

```javascript
// Campaign detail page component
function CampaignDetailPage() {
  const { campaignId } = useParams(); // Get from URL: /campaign/:campaignId
  const searchParams = useSearchParams(); // Get query parameters

  useEffect(() => {
    // 1. Store UTM parameters in session
    const trackingData = {
      source: searchParams.get('source'),
      medium: searchParams.get('medium'),
      campaign: searchParams.get('campaign'),
      ad_id: searchParams.get('ad_id'),
      adset_id: searchParams.get('adset_id'),
      creative_id: searchParams.get('creative_id'),
      landing_time: new Date(),
      referrer: document.referrer
    };

    sessionStorage.setItem('tracking_data', JSON.stringify(trackingData));

    // 2. Track page view
    trackPageView(campaignId, trackingData);

    // 3. Load campaign data
    loadCampaignData(campaignId);
  }, [campaignId]);

  return (
    <div>
      {/* Campaign content */}
      <PropertyDetails campaign={campaign} />
      <LeadCaptureForm campaign={campaign} />
    </div>
  );
}

async function trackPageView(campaignId, trackingData) {
  await supabase.from('campaign_page_views').insert({
    campaign_id: campaignId,
    source: trackingData.source,
    medium: trackingData.medium,
    ad_id: trackingData.ad_id,
    timestamp: new Date(),
    ip_address: await getUserIP(),
    user_agent: navigator.userAgent
  });

  // Update campaign impressions count
  await supabase.rpc('increment_campaign_views', {
    campaign_id: campaignId
  });
}
```

### How Lead is Mapped to Campaign

**Form Submission:**

```javascript
async function handleLeadFormSubmit(formData) {
  const { campaignId } = useParams();
  const trackingData = JSON.parse(sessionStorage.getItem('tracking_data') || '{}');

  // Create lead with campaign mapping
  const lead = {
    // Campaign attribution
    campaign_id: campaignId,
    source: trackingData.source || 'direct',
    medium: trackingData.medium || 'organic',
    ad_id: trackingData.ad_id,
    adset_id: trackingData.adset_id,
    creative_id: trackingData.creative_id,

    // Lead information
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    budget: formData.budget,
    message: formData.message,

    // Metadata
    status: 'new',
    priority: calculatePriority(formData),
    created_at: new Date(),
    ip_address: await getUserIP(),
    user_agent: navigator.userAgent,
    landing_page: window.location.href,
    referrer: document.referrer
  };

  // Save to database
  const { data: savedLead, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();

  if (!error) {
    // Update campaign lead count
    await supabase.rpc('increment_campaign_leads', {
      campaign_id: campaignId
    });

    // Trigger automation
    await triggerLeadAutomation(savedLead);

    // Show success message
    showThankYouPage();
  }

  return savedLead;
}
```

### UI Sections

#### 1. Leads List Section

```jsx
function CampaignLeadsList({ campaignId }) {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    source: 'all',
    dateRange: 'all'
  });

  // Real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('campaign_leads')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'leads',
        filter: `campaign_id=eq.${campaignId}`
      }, (payload) => {
        // New lead arrived
        setLeads(prev => [payload.new, ...prev]);

        // Show notification
        showNotification('New lead received!');

        // Play sound
        playNotificationSound();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [campaignId]);

  return (
    <div className="leads-list">
      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setFilters({...filters, priority: e.target.value})}>
          <option value="all">All Priorities</option>
          <option value="hot">🔴 Hot</option>
          <option value="warm">🟠 Warm</option>
          <option value="cold">🔵 Cold</option>
        </select>

        <select onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* Lead Cards */}
      {leads.map(lead => (
        <div key={lead.id} className="lead-card">
          <div className="lead-header">
            <h3>{lead.first_name} {lead.last_name}</h3>
            <span className={`priority-badge ${lead.priority}`}>
              {lead.priority === 'hot' ? '🔴' : lead.priority === 'warm' ? '🟠' : '🔵'}
              {lead.priority.toUpperCase()}
            </span>
          </div>

          <div className="lead-details">
            <p>📧 {lead.email}</p>
            <p>📱 {lead.phone}</p>
            <p>💰 Budget: AED {lead.budget}</p>
            <p>🕐 {formatTimeAgo(lead.created_at)}</p>
            <p>📊 Source: {lead.source}</p>
          </div>

          <div className="lead-message">
            <p>{lead.message}</p>
          </div>

          <div className="lead-actions">
            <button onClick={() => callLead(lead.phone)}>
              📞 Call
            </button>
            <button onClick={() => whatsappLead(lead.phone)}>
              💬 WhatsApp
            </button>
            <button onClick={() => emailLead(lead.email)}>
              📧 Email
            </button>
            <button onClick={() => viewLeadDetails(lead.id)}>
              👁️ View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 2. Analytics Section

```jsx
function CampaignAnalytics({ campaignId }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();

    // Refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [campaignId]);

  async function loadAnalytics() {
    const { data } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();

    setAnalytics(data);
  }

  return (
    <div className="analytics-grid">
      {/* Key Metrics */}
      <div className="metric-card">
        <h4>Total Impressions</h4>
        <p className="metric-value">{analytics?.impressions.toLocaleString()}</p>
        <span className="metric-change">+12% vs yesterday</span>
      </div>

      <div className="metric-card">
        <h4>Clicks</h4>
        <p className="metric-value">{analytics?.clicks.toLocaleString()}</p>
        <span className="metric-change">+8% vs yesterday</span>
      </div>

      <div className="metric-card">
        <h4>Leads</h4>
        <p className="metric-value">{analytics?.leads.toLocaleString()}</p>
        <span className="metric-change">+15% vs yesterday</span>
      </div>

      <div className="metric-card">
        <h4>CTR</h4>
        <p className="metric-value">
          {((analytics?.clicks / analytics?.impressions) * 100).toFixed(2)}%
        </p>
        <span className="metric-change">
          {analytics?.ctr > 3 ? 'Excellent' : 'Average'}
        </span>
      </div>

      <div className="metric-card">
        <h4>Conversion Rate</h4>
        <p className="metric-value">
          {((analytics?.leads / analytics?.clicks) * 100).toFixed(2)}%
        </p>
        <span className="metric-change">
          {analytics?.conversion_rate > 15 ? 'Excellent' : 'Good'}
        </span>
      </div>

      <div className="metric-card">
        <h4>Cost Per Lead</h4>
        <p className="metric-value">
          AED {(analytics?.spent / analytics?.leads).toFixed(2)}
        </p>
        <span className="metric-change">
          {analytics?.cpl < 100 ? 'Great ROI' : 'Optimize budget'}
        </span>
      </div>

      {/* Charts */}
      <div className="chart-container full-width">
        <h4>Leads Over Time</h4>
        <LineChart data={analytics?.daily_leads} />
      </div>

      <div className="chart-container">
        <h4>Leads by Source</h4>
        <PieChart data={analytics?.leads_by_source} />
      </div>

      <div className="chart-container">
        <h4>Channel Performance</h4>
        <BarChart data={analytics?.channel_performance} />
      </div>
    </div>
  );
}
```

#### 3. Timeline Section

```jsx
function CampaignTimeline({ campaignId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadTimelineEvents();

    // Real-time updates
    const subscription = supabase
      .channel('campaign_events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaign_logs',
        filter: `campaign_id=eq.${campaignId}`
      }, (payload) => {
        setEvents(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [campaignId]);

  async function loadTimelineEvents() {
    const { data } = await supabase
      .from('campaign_logs')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(50);

    setEvents(data);
  }

  return (
    <div className="timeline">
      {events.map(event => (
        <div key={event.id} className="timeline-event">
          <div className="event-icon">
            {getEventIcon(event.type)}
          </div>

          <div className="event-content">
            <p className="event-title">{event.title}</p>
            <p className="event-description">{event.description}</p>
            <p className="event-time">{formatTimeAgo(event.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEventIcon(eventType) {
  const icons = {
    'campaign_created': '🎯',
    'campaign_started': '▶️',
    'campaign_paused': '⏸️',
    'lead_received': '👤',
    'lead_contacted': '📞',
    'budget_updated': '💰',
    'ad_approved': '✅',
    'ad_rejected': '❌',
    'milestone_reached': '🎉'
  };

  return icons[eventType] || '📌';
}
```

#### 4. Performance Metrics Section

```jsx
function CampaignPerformance({ campaignId }) {
  const [performance, setPerformance] = useState(null);

  return (
    <div className="performance-section">
      {/* Campaign Health Score */}
      <div className="health-score-card">
        <h3>Campaign Health Score</h3>
        <div className="score-circle">
          <CircularProgress value={performance?.health_score} />
          <span className="score-grade">{performance?.grade}</span>
        </div>

        <div className="score-breakdown">
          <div>Setup: {performance?.setup_score}/30</div>
          <div>Content: {performance?.content_score}/25</div>
          <div>Performance: {performance?.performance_score}/45</div>
        </div>
      </div>

      {/* Channel Comparison */}
      <div className="channel-comparison">
        <h3>Channel Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Budget</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Leads</th>
              <th>CPL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Facebook</td>
              <td>AED 4,000</td>
              <td>15,234</td>
              <td>456</td>
              <td>45</td>
              <td>AED 89</td>
              <td>✅ Good</td>
            </tr>
            <tr>
              <td>Instagram</td>
              <td>AED 3,000</td>
              <td>12,567</td>
              <td>378</td>
              <td>28</td>
              <td>AED 107</td>
              <td>⚠️ Average</td>
            </tr>
            <tr className="best-performer">
              <td>Google</td>
              <td>AED 3,000</td>
              <td>8,945</td>
              <td>523</td>
              <td>67</td>
              <td>AED 45</td>
              <td>🌟 Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Optimization Recommendations</h3>
        {performance?.recommendations.map((rec, index) => (
          <div key={index} className={`recommendation ${rec.priority}`}>
            <span className="priority-badge">{rec.priority}</span>
            <div>
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              <button onClick={() => applyRecommendation(rec)}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. DATA MODEL (DATABASE DESIGN)

```sql
-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
    -- 'draft', 'active', 'paused', 'completed'

  -- Dates
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Budget
  budget DECIMAL(12, 2),
  spent DECIMAL(12, 2) DEFAULT 0,
  budget_distribution_type VARCHAR(20) DEFAULT 'manual',
    -- 'manual', 'auto_optimize'

  -- Targeting
  target_audience JSONB,
    -- { locations: [], budgetRange: [], buyerTypes: [], demographics: {} }

  -- Content
  content_template JSONB,
    -- { title: '', description: '', cta: '', hashtags: [] }
  creative_assets JSONB,
    -- { projectImage: '', images: [], video: '' }

  -- Channels
  target_platforms TEXT[] DEFAULT ARRAY['facebook', 'instagram'],
    -- ['facebook', 'instagram', 'google', 'whatsapp']

  -- Performance
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,

  -- Ownership
  agent_id UUID REFERENCES auth.users(id),
  developer_id UUID REFERENCES auth.users(id),

  -- Campaign Strength
  health_score INTEGER DEFAULT 0,
  grade VARCHAR(2)
);

CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_agent ON campaigns(agent_id);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- ============================================
-- PROPERTIES TABLE
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  address TEXT,

  -- Property Details
  property_type VARCHAR(50),
    -- 'apartment', 'villa', 'townhouse', 'penthouse'
  bedrooms INTEGER,
  bathrooms INTEGER,
  sqft INTEGER,

  -- Pricing
  price DECIMAL(12, 2),
  payment_plans JSONB,
    -- [ { name: '', downPayment: '', monthlyPayment: '' } ]

  -- Media
  images TEXT[],
  videos TEXT[],
  virtual_tour_url VARCHAR(500),
  floor_plan_url VARCHAR(500),

  -- Amenities
  amenities TEXT[],

  -- Status
  status VARCHAR(20) DEFAULT 'available',
    -- 'available', 'reserved', 'sold'

  -- Ownership
  developer_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(property_type);

-- ============================================
-- CAMPAIGN_PROPERTIES (Many-to-Many)
-- ============================================
CREATE TABLE campaign_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

  -- Property-specific campaign settings
  is_primary BOOLEAN DEFAULT FALSE,
  custom_message TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(campaign_id, property_id)
);

CREATE INDEX idx_campaign_properties_campaign ON campaign_properties(campaign_id);
CREATE INDEX idx_campaign_properties_property ON campaign_properties(property_id);

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Campaign Attribution
  campaign_id UUID REFERENCES campaigns(id),
  source VARCHAR(50),
    -- 'facebook', 'instagram', 'google', 'whatsapp', 'direct'
  medium VARCHAR(50),
    -- 'cpc', 'organic', 'referral'
  ad_id VARCHAR(255),
  adset_id VARCHAR(255),
  creative_id VARCHAR(255),

  -- Lead Information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),

  -- Requirements
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  preferred_location VARCHAR(255),
  bedrooms_required INTEGER,
  message TEXT,

  -- Classification
  status VARCHAR(20) DEFAULT 'new',
    -- 'new', 'contacted', 'qualified', 'viewing_scheduled',
    -- 'negotiating', 'converted', 'lost'
  priority VARCHAR(10) DEFAULT 'cold',
    -- 'hot', 'warm', 'cold'
  score INTEGER DEFAULT 0,

  -- Assignment
  assigned_agent_id UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP,

  -- Interaction Tracking
  last_contacted_at TIMESTAMP,
  last_activity_at TIMESTAMP,
  contact_attempts INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  landing_page VARCHAR(500),
  referrer VARCHAR(500),

  -- Geo Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city VARCHAR(100),
  country VARCHAR(100)
);

CREATE INDEX idx_leads_campaign ON leads(campaign_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_agent ON leads(assigned_agent_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_source ON leads(source);

-- ============================================
-- CAMPAIGN_CHANNELS TABLE
-- ============================================
CREATE TABLE campaign_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Channel Info
  platform VARCHAR(50) NOT NULL,
    -- 'facebook', 'instagram', 'google_search', 'google_display', 'whatsapp'

  -- Budget
  allocated_budget DECIMAL(12, 2),
  spent DECIMAL(12, 2) DEFAULT 0,

  -- Platform IDs
  external_campaign_id VARCHAR(255),
  external_adset_id VARCHAR(255),
  external_ad_id VARCHAR(255),

  -- Performance
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'active',
    -- 'active', 'paused', 'completed'

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(campaign_id, platform)
);

CREATE INDEX idx_campaign_channels_campaign ON campaign_channels(campaign_id);
CREATE INDEX idx_campaign_channels_platform ON campaign_channels(platform);

-- ============================================
-- CAMPAIGN_BUDGET_HISTORY TABLE
-- ============================================
CREATE TABLE campaign_budget_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Budget Changes
  previous_budget DECIMAL(12, 2),
  new_budget DECIMAL(12, 2),
  change_reason VARCHAR(255),

  -- Channel-specific
  channel_id UUID REFERENCES campaign_channels(id),
  channel_previous_budget DECIMAL(12, 2),
  channel_new_budget DECIMAL(12, 2),

  -- Metadata
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  is_auto_optimization BOOLEAN DEFAULT FALSE
);

-- ============================================
-- CAMPAIGN_LOGS TABLE
-- ============================================
CREATE TABLE campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Event Info
  event_type VARCHAR(50),
    -- 'created', 'started', 'paused', 'resumed', 'completed',
    -- 'budget_updated', 'lead_received', 'milestone_reached'
  event_title VARCHAR(255),
  event_description TEXT,
  event_data JSONB,

  -- Metadata
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_campaign_logs_campaign ON campaign_logs(campaign_id);
CREATE INDEX idx_campaign_logs_type ON campaign_logs(event_type);
CREATE INDEX idx_campaign_logs_created ON campaign_logs(created_at DESC);

-- ============================================
-- AUTOMATION_SEQUENCES TABLE
-- ============================================
CREATE TABLE automation_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sequence Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_event VARCHAR(50),
    -- 'lead_created', 'no_reply_day3', 'viewing_scheduled'

  -- Conditions
  conditions JSONB,
    -- { leadStatus: 'new', leadPriority: 'warm', source: 'facebook' }

  -- Sequence Steps
  steps JSONB,
    -- [ { delay: '0s', channel: 'whatsapp', message: '' },
    --   { delay: '3d', channel: 'email', message: '' } ]

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Ownership
  created_by UUID REFERENCES auth.users(id),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AUTOMATION_EXECUTIONS TABLE
-- ============================================
CREATE TABLE automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sequence Info
  sequence_id UUID REFERENCES automation_sequences(id),
  lead_id UUID REFERENCES leads(id),

  -- Execution Info
  step_index INTEGER,
  status VARCHAR(20),
    -- 'pending', 'sent', 'failed', 'skipped'

  -- Scheduling
  scheduled_at TIMESTAMP,
  executed_at TIMESTAMP,

  -- Result
  result JSONB,
    -- { success: true, messageId: 'msg_123', error: null }

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_automation_executions_sequence ON automation_executions(sequence_id);
CREATE INDEX idx_automation_executions_lead ON automation_executions(lead_id);
CREATE INDEX idx_automation_executions_scheduled ON automation_executions(scheduled_at);

-- ============================================
-- WHATSAPP_INTERACTIONS TABLE
-- ============================================
CREATE TABLE whatsapp_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Lead Info
  lead_id UUID REFERENCES leads(id),
  phone_number VARCHAR(20),

  -- Message Info
  direction VARCHAR(10),
    -- 'incoming', 'outgoing'
  message_type VARCHAR(20),
    -- 'text', 'template', 'interactive', 'media'
  message_content TEXT,
  message_id VARCHAR(255),

  -- Status
  status VARCHAR(20),
    -- 'sent', 'delivered', 'read', 'failed'

  -- Metadata
  sent_by UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_lead ON whatsapp_interactions(lead_id);
CREATE INDEX idx_whatsapp_phone ON whatsapp_interactions(phone_number);
CREATE INDEX idx_whatsapp_timestamp ON whatsapp_interactions(timestamp DESC);

-- ============================================
-- CAMPAIGN_ANALYTICS (Materialized View for Performance)
-- ============================================
CREATE MATERIALIZED VIEW campaign_analytics AS
SELECT
  c.id AS campaign_id,
  c.name,
  c.status,
  c.budget,
  c.spent,

  -- Performance Metrics
  c.impressions,
  c.clicks,
  c.leads,
  c.conversions,

  -- Calculated Metrics
  CASE
    WHEN c.impressions > 0
    THEN (c.clicks::DECIMAL / c.impressions * 100)
    ELSE 0
  END AS ctr,

  CASE
    WHEN c.clicks > 0
    THEN (c.leads::DECIMAL / c.clicks * 100)
    ELSE 0
  END AS conversion_rate,

  CASE
    WHEN c.leads > 0
    THEN (c.spent / c.leads)
    ELSE 0
  END AS cost_per_lead,

  CASE
    WHEN c.impressions > 0
    THEN (c.spent / c.impressions * 1000)
    ELSE 0
  END AS cpm,

  -- Lead Breakdown
  COUNT(CASE WHEN l.priority = 'hot' THEN 1 END) AS hot_leads,
  COUNT(CASE WHEN l.priority = 'warm' THEN 1 END) AS warm_leads,
  COUNT(CASE WHEN l.priority = 'cold' THEN 1 END) AS cold_leads,

  -- Source Breakdown
  COUNT(CASE WHEN l.source = 'facebook' THEN 1 END) AS facebook_leads,
  COUNT(CASE WHEN l.source = 'instagram' THEN 1 END) AS instagram_leads,
  COUNT(CASE WHEN l.source = 'google' THEN 1 END) AS google_leads,
  COUNT(CASE WHEN l.source = 'whatsapp' THEN 1 END) AS whatsapp_leads,

  -- Dates
  c.created_at,
  c.start_date,
  c.end_date

FROM campaigns c
LEFT JOIN leads l ON c.id = l.campaign_id
GROUP BY c.id;

-- Refresh analytics periodically
CREATE INDEX idx_campaign_analytics_id ON campaign_analytics(campaign_id);

-- ============================================
-- PROJECTS TABLE (for multi-property developments)
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  address TEXT,

  -- Project Details
  developer_name VARCHAR(255),
  total_units INTEGER,
  available_units INTEGER,

  -- Media
  logo VARCHAR(500),
  images TEXT[],
  brochure_url VARCHAR(500),

  -- Dates
  launch_date DATE,
  completion_date DATE,
  handover_date DATE,

  -- Ownership
  developer_id UUID REFERENCES auth.users(id),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 8. TRACKING SYSTEM

### URL Structure

```
Base Campaign URL:
https://yourwebsite.com/campaign/{campaign_id}

With Tracking Parameters:
https://yourwebsite.com/campaign/cmp_abc123?
  source=facebook&              # Traffic source
  medium=cpc&                   # Marketing medium
  campaign=summer_sale_2026&    # Campaign name
  ad_id=fb_ad_123456&          # Facebook Ad ID
  adset_id=fb_adset_789&       # Facebook Ad Set ID
  creative_id=fb_cr_999&       # Creative ID
  placement=feed&              # Where ad was shown
  device=mobile                # Device type
```

### UTM Parameters

```javascript
const utmParams = {
  // Standard UTM parameters
  utm_source: 'facebook',      // Where traffic came from
  utm_medium: 'cpc',           // Type of marketing
  utm_campaign: 'summer_sale', // Campaign name
  utm_term: 'luxury+apartment', // Paid keyword
  utm_content: 'variant_a',    // A/B test variation

  // Custom parameters
  ad_id: 'fb_ad_123',
  adset_id: 'fb_adset_456',
  creative_id: 'fb_cr_789',
  placement: 'instagram_story',
  device: 'mobile',
  agent_id: 'ag_xyz'
};
```

### Click Tracking Implementation

```javascript
// 1. Generate tracking URL
function generateTrackingURL(campaignId, platform, agentId) {
  const baseURL = `${window.location.origin}/campaign/${campaignId}`;

  const params = new URLSearchParams({
    source: platform,
    medium: 'cpc',
    campaign: campaignId,
    agent: agentId,
    timestamp: Date.now()
  });

  return `${baseURL}?${params.toString()}`;
}

// Example usage:
const facebookURL = generateTrackingURL('cmp_123', 'facebook', 'ag_xyz');
// Result: https://yoursite.com/campaign/cmp_123?source=facebook&medium=cpc&campaign=cmp_123&agent=ag_xyz&timestamp=1234567890
```

```javascript
// 2. Track page view when user lands
function trackPageView() {
  const urlParams = new URLSearchParams(window.location.search);

  const trackingData = {
    campaign_id: getCampaignIdFromURL(),
    source: urlParams.get('source') || 'direct',
    medium: urlParams.get('medium') || 'organic',
    ad_id: urlParams.get('ad_id'),
    adset_id: urlParams.get('adset_id'),
    agent_id: urlParams.get('agent'),

    // Additional data
    timestamp: new Date(),
    referrer: document.referrer,
    landing_page: window.location.href,
    user_agent: navigator.userAgent,

    // Screen info
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,

    // Session
    session_id: getOrCreateSessionId()
  };

  // Send to analytics
  await supabase.from('page_views').insert(trackingData);

  // Store in session for later use (form submission)
  sessionStorage.setItem('tracking_data', JSON.stringify(trackingData));

  // Update campaign view count
  await supabase.rpc('increment_views', {
    campaign_id: trackingData.campaign_id,
    source: trackingData.source
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', trackPageView);
```

```javascript
// 3. Track clicks within page
function trackInternalClick(element, action) {
  const trackingData = JSON.parse(sessionStorage.getItem('tracking_data') || '{}');

  const clickData = {
    ...trackingData,
    action: action, // 'view_gallery', 'click_whatsapp', 'scroll_to_form'
    element_id: element.id,
    element_class: element.className,
    element_text: element.textContent?.substring(0, 100),
    timestamp: new Date()
  };

  // Send async (don't wait for response)
  supabase.from('click_events').insert(clickData);
}

// Example usage:
document.getElementById('whatsapp-btn').addEventListener('click', (e) => {
  trackInternalClick(e.target, 'click_whatsapp');
});

document.getElementById('call-btn').addEventListener('click', (e) => {
  trackInternalClick(e.target, 'click_call');
});

document.getElementById('view-gallery').addEventListener('click', (e) => {
  trackInternalClick(e.target, 'view_gallery');
});
```

```javascript
// 4. Track form submission with full attribution
async function trackFormSubmission(formData) {
  const trackingData = JSON.parse(sessionStorage.getItem('tracking_data') || '{}');

  const lead = {
    // Form data
    ...formData,

    // Attribution
    campaign_id: trackingData.campaign_id,
    source: trackingData.source,
    medium: trackingData.medium,
    ad_id: trackingData.ad_id,
    adset_id: trackingData.adset_id,
    agent_id: trackingData.agent_id,

    // Journey data
    session_id: trackingData.session_id,
    referrer: trackingData.referrer,
    landing_page: trackingData.landing_page,

    // Engagement metrics
    time_on_page: Date.now() - new Date(trackingData.timestamp),
    page_views: getPageViewCount(),
    scroll_depth: getMaxScrollDepth(),

    // Device info
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOperatingSystem(),

    // Timestamps
    created_at: new Date()
  };

  // Save lead
  const { data: savedLead } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();

  // Track conversion event
  await supabase.from('conversion_events').insert({
    campaign_id: trackingData.campaign_id,
    lead_id: savedLead.id,
    source: trackingData.source,
    conversion_type: 'lead',
    conversion_value: estimateLeadValue(formData),
    timestamp: new Date()
  });

  // Update campaign conversion count
  await supabase.rpc('increment_conversions', {
    campaign_id: trackingData.campaign_id,
    source: trackingData.source
  });

  return savedLead;
}
```

### Analytics Dashboard Queries

```sql
-- Get campaign performance by source
SELECT
  source,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT session_id) as unique_visitors,
  SUM(CASE WHEN lead_id IS NOT NULL THEN 1 ELSE 0 END) as conversions,
  AVG(time_on_page) as avg_time_on_page
FROM page_views
WHERE campaign_id = 'cmp_123'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY source
ORDER BY conversions DESC;

-- Get conversion funnel
SELECT
  step,
  COUNT(*) as users,
  ROUND(COUNT(*) * 100.0 / FIRST_VALUE(COUNT(*)) OVER (ORDER BY step), 2) as percentage
FROM (
  SELECT DISTINCT session_id, 1 as step FROM page_views WHERE campaign_id = 'cmp_123'
  UNION ALL
  SELECT DISTINCT session_id, 2 FROM click_events WHERE campaign_id = 'cmp_123' AND action = 'scroll_to_form'
  UNION ALL
  SELECT DISTINCT session_id, 3 FROM click_events WHERE campaign_id = 'cmp_123' AND action = 'start_form'
  UNION ALL
  SELECT DISTINCT session_id, 4 FROM leads WHERE campaign_id = 'cmp_123'
) funnel
GROUP BY step
ORDER BY step;

-- Get hourly performance
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as page_views,
  COUNT(DISTINCT session_id) as visitors,
  SUM(CASE WHEN source = 'facebook' THEN 1 ELSE 0 END) as facebook_views,
  SUM(CASE WHEN source = 'instagram' THEN 1 ELSE 0 END) as instagram_views,
  SUM(CASE WHEN source = 'google' THEN 1 ELSE 0 END) as google_views
FROM page_views
WHERE campaign_id = 'cmp_123'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour DESC;
```

---

## 9. ANALYTICS

### Key Metrics

#### 1. Impressions

```
Definition: Number of times your ad was shown

Calculation: Sum of all ad displays across all platforms

Good Benchmark:
- Small campaign: 10,000+ impressions
- Medium campaign: 50,000+ impressions
- Large campaign: 100,000+ impressions

Tracking:
await supabase.rpc('log_impression', {
  campaign_id: 'cmp_123',
  platform: 'facebook',
  count: 1234
});
```

#### 2. Clicks

```
Definition: Number of times users clicked your ad

Calculation: Sum of all ad clicks

Good Benchmark:
- 2-5% of impressions for most campaigns

Tracking:
// Automatically tracked when user lands on campaign page
trackPageView(); // Increments click count
```

#### 3. Leads

```
Definition: Number of users who submitted contact information

Calculation: Count of lead records for campaign

Good Benchmark:
- 10-20% of clicks should convert to leads
- High-performing campaigns: 25%+

Tracking:
const { data: lead } = await supabase
  .from('leads')
  .insert({ campaign_id, ...formData });

// Auto-increments campaign.leads count via trigger
```

#### 4. Conversion Rate

```
Definition: Percentage of clicks that became leads

Formula: (Leads / Clicks) × 100

Example:
- Clicks: 1,000
- Leads: 150
- Conversion Rate: (150 / 1,000) × 100 = 15%

Benchmarks:
- Excellent: 20%+
- Good: 15-20%
- Average: 10-15%
- Poor: < 10%

Query:
SELECT
  campaign_id,
  clicks,
  leads,
  ROUND((leads::DECIMAL / clicks * 100), 2) as conversion_rate
FROM campaigns
WHERE id = 'cmp_123';
```

#### 5. Cost Per Lead (CPL)

```
Definition: Average cost to acquire one lead

Formula: Total Spent / Total Leads

Example:
- Spent: AED 10,000
- Leads: 125
- CPL: 10,000 / 125 = AED 80

Benchmarks (Dubai Real Estate):
- Excellent: < AED 75
- Good: AED 75-125
- Average: AED 125-200
- Poor: > AED 200

Query:
SELECT
  campaign_id,
  spent,
  leads,
  ROUND(spent / NULLIF(leads, 0), 2) as cost_per_lead
FROM campaigns
WHERE id = 'cmp_123';
```

### Advanced Metrics

#### 6. Click-Through Rate (CTR)

```
Formula: (Clicks / Impressions) × 100

Example:
- Impressions: 50,000
- Clicks: 1,500
- CTR: (1,500 / 50,000) × 100 = 3%

Benchmarks:
- Excellent: 5%+
- Good: 3-5%
- Average: 2-3%
- Poor: < 2%
```

#### 7. Cost Per Click (CPC)

```
Formula: Total Spent / Total Clicks

Example:
- Spent: AED 10,000
- Clicks: 2,000
- CPC: 10,000 / 2,000 = AED 5

Benchmarks:
- Excellent: < AED 3
- Good: AED 3-6
- Average: AED 6-10
- Poor: > AED 10
```

#### 8. Return on Ad Spend (ROAS)

```
Formula: Revenue / Ad Spend

Example:
- Commission from conversions: AED 150,000
- Ad Spend: AED 10,000
- ROAS: 150,000 / 10,000 = 15:1

Benchmarks:
- Excellent: 10:1 or higher
- Good: 5:1 to 10:1
- Average: 3:1 to 5:1
- Poor: < 3:1
```

### Analytics Dashboard

```javascript
async function getCampaignAnalytics(campaignId, dateRange) {
  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`
      *,
      leads!inner(count),
      campaign_channels(*)
    `)
    .eq('id', campaignId)
    .single();

  // Calculate metrics
  const metrics = {
    // Basic metrics
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    leads: campaign.leads,
    spent: campaign.spent,
    budget: campaign.budget,

    // Calculated metrics
    ctr: (campaign.clicks / campaign.impressions * 100).toFixed(2),
    conversionRate: (campaign.leads / campaign.clicks * 100).toFixed(2),
    cpl: (campaign.spent / campaign.leads).toFixed(2),
    cpc: (campaign.spent / campaign.clicks).toFixed(2),
    budgetUtilization: (campaign.spent / campaign.budget * 100).toFixed(2),

    // Lead breakdown
    leadsByPriority: await getLeadsByPriority(campaignId),
    leadsBySource: await getLeadsBySource(campaignId),
    leadsByStatus: await getLeadsByStatus(campaignId),

    // Time-based
    leadsToday: await getLeadsToday(campaignId),
    leadsThisWeek: await getLeadsThisWeek(campaignId),
    dailyLeads: await getDailyLeads(campaignId, dateRange),

    // Channel performance
    channelPerformance: campaign.campaign_channels.map(ch => ({
      platform: ch.platform,
      spent: ch.spent,
      impressions: ch.impressions,
      clicks: ch.clicks,
      leads: ch.leads,
      cpl: (ch.spent / ch.leads).toFixed(2),
      ctr: (ch.clicks / ch.impressions * 100).toFixed(2)
    })),

    // Best performers
    bestChannel: getBestChannel(campaign.campaign_channels),
    bestTimeOfDay: await getBestTimeOfDay(campaignId),
    bestDayOfWeek: await getBestDayOfWeek(campaignId)
  };

  return metrics;
}
```

### Reporting

```javascript
async function generateCampaignReport(campaignId) {
  const analytics = await getCampaignAnalytics(campaignId);

  const report = {
    summary: {
      campaignName: analytics.name,
      duration: `${analytics.startDate} - ${analytics.endDate}`,
      status: analytics.status,
      budget: `AED ${analytics.budget.toLocaleString()}`,
      spent: `AED ${analytics.spent.toLocaleString()}`,
      remaining: `AED ${(analytics.budget - analytics.spent).toLocaleString()}`
    },

    performance: {
      totalImpressions: analytics.impressions.toLocaleString(),
      totalClicks: analytics.clicks.toLocaleString(),
      totalLeads: analytics.leads.toLocaleString(),
      ctr: `${analytics.ctr}%`,
      conversionRate: `${analytics.conversionRate}%`,
      costPerLead: `AED ${analytics.cpl}`
    },

    leadQuality: {
      hotLeads: analytics.leadsByPriority.hot,
      warmLeads: analytics.leadsByPriority.warm,
      coldLeads: analytics.leadsByPriority.cold,
      qualificationRate: `${(analytics.leadsByPriority.hot / analytics.leads * 100).toFixed(2)}%`
    },

    channelBreakdown: analytics.channelPerformance.map(ch => ({
      channel: ch.platform,
      performance: ch.cpl < 100 ? 'Excellent' : ch.cpl < 150 ? 'Good' : 'Average',
      leads: ch.leads,
      cpl: `AED ${ch.cpl}`,
      recommendation: ch.leads > analytics.leads / analytics.channelPerformance.length
        ? 'Increase budget'
        : 'Optimize or reduce'
    })),

    recommendations: generateRecommendations(analytics)
  };

  return report;
}
```

---

## 10. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Web Application (Vite + TypeScript)                │  │
│  │  ├─ Agent Dashboard                                       │  │
│  │  ├─ Campaign Management                                   │  │
│  │  ├─ Lead Management                                       │  │
│  │  ├─ Analytics Dashboard                                   │  │
│  │  └─ Settings & Configuration                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase Client (@supabase/supabase-js)                  │  │
│  │  ├─ Authentication                                        │  │
│  │  ├─ Real-time Subscriptions                              │  │
│  │  ├─ Database Queries                                      │  │
│  │  └─ File Storage                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase (PostgreSQL + Edge Functions)                   │  │
│  │  ├─ PostgreSQL Database                                   │  │
│  │  │  ├─ campaigns                                          │  │
│  │  │  ├─ properties                                         │  │
│  │  │  ├─ leads                                              │  │
│  │  │  ├─ campaign_channels                                  │  │
│  │  │  ├─ automation_sequences                               │  │
│  │  │  └─ analytics tables                                   │  │
│  │  │                                                         │  │
│  │  ├─ Edge Functions (Deno Runtime)                         │  │
│  │  │  ├─ /webhooks/facebook → Capture FB leads             │  │
│  │  │  ├─ /webhooks/whatsapp → Handle WhatsApp messages     │  │
│  │  │  ├─ /automation/send-followup → Send automated msgs   │  │
│  │  │  └─ /analytics/calculate-score → Calculate scores     │  │
│  │  │                                                         │  │
│  │  ├─ Row Level Security (RLS)                              │  │
│  │  │  ├─ Agents see only their campaigns                   │  │
│  │  │  ├─ Developers see all campaigns for their projects   │  │
│  │  │  └─ Admins see everything                             │  │
│  │  │                                                         │  │
│  │  ├─ Real-time Database                                    │  │
│  │  │  ├─ New lead notifications                            │  │
│  │  │  ├─ Campaign updates                                   │  │
│  │  │  └─ Analytics refresh                                  │  │
│  │  │                                                         │  │
│  │  └─ Storage                                               │  │
│  │     ├─ Property images                                    │  │
│  │     ├─ Campaign creatives                                 │  │
│  │     └─ Documents (brochures, floor plans)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL APIS                                 │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │  Meta Ads API      │  │  Google Ads API    │               │
│  │  (Facebook & IG)   │  │  (Search & Display)│               │
│  │  ├─ Create ads     │  │  ├─ Create ads     │               │
│  │  ├─ Track metrics  │  │  ├─ Track metrics  │               │
│  │  └─ Receive leads  │  │  └─ Receive clicks │               │
│  └────────────────────┘  └────────────────────┘               │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │  WhatsApp API      │  │  SendGrid/Email    │               │
│  │  ├─ Send messages  │  │  ├─ Send emails    │               │
│  │  ├─ Receive msgs   │  │  └─ Email tracking │               │
│  │  └─ Broadcast      │  └────────────────────┘               │
│  └────────────────────┘                                        │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │  Twilio (SMS)      │  │  Analytics Tools   │               │
│  │  └─ Send SMS       │  │  ├─ Google Analytics│              │
│  └────────────────────┘  │  └─ Mixpanel       │               │
│                          └────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Frontend Stack:**
```
- React 18.3+ (UI framework)
- TypeScript (Type safety)
- Vite (Build tool)
- TailwindCSS (Styling)
- React Router (Navigation)
- Recharts (Analytics charts)
- Lucide Icons (Icons)
- @supabase/supabase-js (Backend client)
```

**Backend Stack:**
```
- Supabase (Backend-as-a-Service)
  ├─ PostgreSQL (Database)
  ├─ PostgREST (Auto-generated REST API)
  ├─ Edge Functions (Serverless functions - Deno runtime)
  ├─ Realtime (WebSocket subscriptions)
  ├─ Storage (File uploads)
  └─ Auth (User authentication)
```

**External Services:**
```
- Meta Business Suite (Facebook & Instagram Ads)
- Google Ads Platform
- WhatsApp Business API
- SendGrid (Email delivery)
- Twilio (SMS)
- Cloudflare (CDN & DNS)
```

---

## 11. COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAMPAIGN CREATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

[Agent Login]
    ↓
[Dashboard] → Click "Create Campaign"
    ↓
[Campaign Form]
    ├─ Enter name, dates, budget
    ├─ Select properties
    ├─ Define target audience
    ├─ Create content (AI-assisted)
    ├─ Choose channels
    └─ Set budget distribution
    ↓
[Review & Confirm]
    ↓
[Save to Database]
    ├─ Insert into campaigns table
    ├─ Create campaign_properties records
    ├─ Create campaign_channels records
    └─ Generate campaign URL
    ↓
[Publish to Ad Platforms]
    ├─ Call Meta Ads API → Create Facebook/Instagram ads
    ├─ Call Google Ads API → Create search/display ads
    └─ Setup WhatsApp broadcast (if selected)
    ↓
[Campaign Status: ACTIVE]
    ├─ Ads go live
    ├─ Start tracking impressions
    └─ Budget starts spending

┌─────────────────────────────────────────────────────────────────┐
│                      LEAD CAPTURE FLOW                           │
└─────────────────────────────────────────────────────────────────┘

[User sees ad on Facebook/Instagram/Google]
    ↓
[User clicks ad]
    ├─ Click tracked in ad platform
    ├─ UTM parameters added to URL
    └─ User redirected to campaign landing page
    ↓
[Landing Page Loads]
    ├─ Campaign data fetched from database
    ├─ Property details displayed
    ├─ UTM params stored in session
    └─ Page view tracked
    ↓
[User Interaction] (Multiple paths possible)
    │
    ├─ Path A: Form Submission
    │   ├─ User fills name, email, phone, budget
    │   ├─ Form validation
    │   ├─ Submit button clicked
    │   └─ → Continue to Lead Saved
    │
    ├─ Path B: WhatsApp Click
    │   ├─ User clicks WhatsApp button
    │   ├─ WhatsApp opens with pre-filled message
    │   ├─ User sends message
    │   ├─ Webhook receives message
    │   └─ → Continue to Lead Saved
    │
    └─ Path C: Call Button
        ├─ User clicks call button
        ├─ Phone app opens
        ├─ Call logged
        └─ → Continue to Lead Saved
    ↓
[Lead Saved to Database]
    ├─ Insert into leads table
    ├─ Campaign ID attached
    ├─ Source/UTM params attached
    ├─ Calculate priority score
    └─ Assign to agent (round-robin or rules-based)
    ↓
[Automation Triggered]
    ├─ Send welcome WhatsApp message (immediate)
    ├─ Send welcome email with brochure
    ├─ Notify assigned agent (push notification)
    └─ Schedule follow-up sequence
    ↓
[Lead Appears in Dashboard]
    ├─ Campaign details page → Leads tab
    ├─ All leads page
    └─ Agent dashboard (if assigned)
    ↓
[Agent Actions]
    ├─ View lead details
    ├─ Call/WhatsApp/Email lead
    ├─ Update lead status
    ├─ Schedule viewing
    └─ Add notes

┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATION FLOW                               │
└─────────────────────────────────────────────────────────────────┘

[Lead Created]
    ↓
[Check Automation Rules]
    ├─ Match lead criteria
    ├─ Find applicable sequences
    └─ Queue first step
    ↓
[Step 1: Immediate Welcome (0 seconds)]
    ├─ Send WhatsApp: "Hi {name}, thanks for your interest..."
    ├─ Log message sent
    └─ Wait for reply
    ↓
[Monitor for Reply]
    ├─ Reply received? → Mark as HOT → Agent takes over → STOP automation
    └─ No reply? → Continue
    ↓
[Wait 72 hours]
    ↓
[Step 2: Follow-up (Day 3)]
    ├─ Send WhatsApp: "Hi {name}, here are property details..."
    ├─ Include property link
    ├─ Log message sent
    └─ Wait for engagement
    ↓
[Monitor for Engagement]
    ├─ Link clicked? → Mark as WARM → Agent follows up → STOP automation
    └─ No engagement? → Continue
    ↓
[Wait 96 hours]
    ↓
[Step 3: Final Attempt (Day 7)]
    ├─ Send Email: "Last chance - Special offer ending soon"
    ├─ Include discount/offer
    ├─ Log email sent
    └─ Wait for response
    ↓
[Monitor for Response]
    ├─ Response received? → Mark as WARM → Agent follows up
    └─ No response? → Mark as COLD → Add to long-term nurture
    ↓
[Long-term Nurture]
    ├─ Monthly newsletter
    ├─ New property alerts
    └─ Re-engagement campaigns

┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS UPDATE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

[Every 15 minutes] (Scheduled job)
    ↓
[Sync Platform Metrics]
    ├─ Call Meta Ads API
    │   ├─ Fetch Facebook impressions, clicks
    │   └─ Fetch Instagram impressions, clicks
    ├─ Call Google Ads API
    │   ├─ Fetch Search ad metrics
    │   └─ Fetch Display ad metrics
    └─ Query WhatsApp broadcast stats
    ↓
[Update Database]
    ├─ Update campaign_channels table
    ├─ Update campaigns aggregated metrics
    └─ Log changes in campaign_logs
    ↓
[Calculate Derived Metrics]
    ├─ CTR = clicks / impressions
    ├─ Conversion Rate = leads / clicks
    ├─ CPL = spent / leads
    └─ Campaign Health Score
    ↓
[Refresh Materialized View]
    ├─ REFRESH MATERIALIZED VIEW campaign_analytics
    └─ Update cached analytics
    ↓
[Trigger Real-time Updates]
    ├─ Broadcast to connected clients
    └─ Update dashboards in real-time
    ↓
[Check for Alerts]
    ├─ Budget > 90% spent? → Alert agent
    ├─ CPL too high? → Send optimization recommendation
    └─ Campaign ending soon? → Notify to extend or complete

┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

User Journey: From Ad to Conversion

[Day 1, 10:30 AM]
User scrolling Facebook feed
    ↓
Sees ad: "Luxury 2BR Marina Apartment - AED 1.5M"
    ↓
Clicks ad (Tracked: Facebook, Feed placement, Mobile)
    ↓
Lands on campaign page (URL: /campaign/cmp_123?source=facebook)
    ↓
Views property images, reads description
    ↓
Scrolls to lead form
    ↓
Fills form: Name, Email, Phone, Budget
    ↓
Clicks "Get Details"
    ↓
[Lead Created in Database]
    ├─ Source: Facebook
    ├─ Priority: Warm
    └─ Assigned to: Agent Sarah
    ↓
[Automation Starts]
[10:31 AM] WhatsApp received: "Hi Mohammed, thanks for your interest..."
    ↓
[10:35 AM] User replies: "Yes, interested. Can I visit tomorrow?"
    ↓
[Lead marked as HOT]
    ↓
[Agent Sarah notified: "🔥 Hot lead - Mohammed wants viewing tomorrow"]
    ↓
[10:40 AM] Agent calls Mohammed
    ↓
[10:45 AM] Viewing scheduled for tomorrow 3 PM
    ↓
[Lead status updated: viewing_scheduled]
    ↓
[Day 2, 3:00 PM]
Viewing conducted
    ↓
[Agent updates: "Viewing completed - Very interested"]
    ↓
[Day 2, 5:00 PM]
Mohammed requests bank financing details
    ↓
[Agent sends payment plan options]
    ↓
[Day 5]
Mohammed makes offer
    ↓
[Lead status updated: negotiating]
    ↓
[Day 8]
Deal closed! 🎉
    ↓
[Lead status updated: converted]
    ↓
[Campaign Analytics Updated]
    ├─ Conversions: +1
    ├─ Revenue: +AED 150,000 (commission)
    └─ ROAS: 15:1
```

---

## 12. BONUS (ADVANCED FEATURES)

### 1. AI Lead Prediction

Predict expected leads based on historical data and campaign setup.

```javascript
async function predictCampaignLeads(campaignData) {
  // Fetch historical campaigns with similar attributes
  const { data: historicalCampaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'completed')
    .gte('leads', 10) // Only successful campaigns
    .order('created_at', { ascending: false })
    .limit(50);

  // Calculate average metrics
  const avgMetrics = {
    ctr: calculateAverage(historicalCampaigns, 'ctr'),
    conversionRate: calculateAverage(historicalCampaigns, 'conversion_rate'),
    cpl: calculateAverage(historicalCampaigns, 'cpl')
  };

  // Apply campaign-specific adjustments
  const adjustments = {
    budget: campaignData.budget > 10000 ? 1.2 : 1.0, // Higher budget = more reach
    channels: campaignData.channels.length >= 3 ? 1.15 : 1.0, // Multi-channel boost
    propertyPrice: campaignData.price > 2000000 ? 0.8 : 1.1, // Luxury = fewer but quality leads
    location: popularLocations.includes(campaignData.location) ? 1.1 : 1.0
  };

  // Calculate predictions
  const expectedImpressions = (campaignData.budget / avgMetrics.cpl) * 100;
  const expectedClicks = expectedImpressions * (avgMetrics.ctr / 100);
  const expectedLeads = expectedClicks * (avgMetrics.conversionRate / 100);

  // Apply adjustments
  const adjustedLeads = expectedLeads *
    adjustments.budget *
    adjustments.channels *
    adjustments.propertyPrice *
    adjustments.location;

  return {
    expectedLeads: Math.round(adjustedLeads),
    expectedLeadsRange: {
      min: Math.round(adjustedLeads * 0.7),
      max: Math.round(adjustedLeads * 1.3)
    },
    confidence: calculateConfidence(historicalCampaigns.length),
    breakdown: {
      expectedImpressions: Math.round(expectedImpressions),
      expectedClicks: Math.round(expectedClicks),
      expectedCPL: avgMetrics.cpl
    }
  };
}

// Usage in campaign creation
const prediction = await predictCampaignLeads({
  budget: 10000,
  channels: ['facebook', 'instagram', 'google'],
  price: 1500000,
  location: 'Dubai Marina'
});

console.log(`Expected leads: ${prediction.expectedLeads} (${prediction.expectedLeadsRange.min} - ${prediction.expectedLeadsRange.max})`);
```

### 2. A/B Testing

Test different ad variations to find what works best.

```javascript
const abTestConfig = {
  testName: 'Headline Variation Test',
  campaignId: 'cmp_123',

  variants: [
    {
      name: 'Variant A - Price Focus',
      headline: 'Own Your Dream Home for AED 1.5M',
      description: 'Luxury 2BR apartment with sea views',
      budget: 2500 // 50% of budget
    },
    {
      name: 'Variant B - Lifestyle Focus',
      headline: 'Wake Up to Marina Views Every Day',
      description: 'Premium waterfront living at its finest',
      budget: 2500 // 50% of budget
    }
  ],

  duration: 7, // days
  successMetric: 'conversion_rate', // or 'cpl', 'ctr'

  // Auto-winner selection
  autoSelectWinner: true,
  winnerThreshold: 0.15 // 15% better performance
};

async function runABTest(config) {
  // Create ads for each variant
  for (const variant of config.variants) {
    await createAdVariant(config.campaignId, variant);
  }

  // Monitor performance daily
  const checkInterval = setInterval(async () => {
    const results = await getVariantPerformance(config.campaignId);

    // Check if we have a clear winner
    const winner = detectWinner(results, config.winnerThreshold);

    if (winner) {
      console.log(`Winner: ${winner.name}`);

      if (config.autoSelectWinner) {
        // Pause losing variants
        await pauseLosingVariants(config.campaignId, winner.id);

        // Reallocate budget to winner
        await reallocateBudget(config.campaignId, winner.id);
      }

      clearInterval(checkInterval);
    }
  }, 24 * 60 * 60 * 1000); // Check daily
}

function detectWinner(results, threshold) {
  const sorted = results.sort((a, b) => b.conversionRate - a.conversionRate);
  const best = sorted[0];
  const second = sorted[1];

  // Winner must be significantly better
  if ((best.conversionRate - second.conversionRate) / second.conversionRate >= threshold) {
    return best;
  }

  return null;
}
```

### 3. Lead Scoring Algorithm

Automatically score leads based on multiple factors.

```javascript
function calculateLeadScore(lead, interactions, externalData) {
  let score = 0;

  // 1. DEMOGRAPHIC SCORE (25 points)
  if (lead.budget_min >= property.price * 0.8) score += 15; // Can afford
  if (lead.budget_max >= property.price * 1.2) score += 5;  // Has buffer
  if (lead.preferred_location === property.location) score += 5; // Location match

  // 2. ENGAGEMENT SCORE (30 points)
  if (interactions.repliedToMessage) score += 10;
  if (interactions.clickedPropertyLink) score += 8;
  if (interactions.watchedVideo) score += 5;
  if (interactions.viewedMultipleTimes) score += 7;

  // 3. INTENT SCORE (25 points)
  if (lead.timeframe === 'asap') score += 15;
  else if (lead.timeframe === '1_3_months') score += 10;
  else if (lead.timeframe === '3_6_months') score += 5;

  if (lead.requestedViewing) score += 10;

  // 4. SOURCE QUALITY SCORE (10 points)
  const sourceScores = {
    'google': 8,        // High intent (searching)
    'facebook': 6,      // Medium intent
    'instagram': 5,     // Lower intent (discovery)
    'referral': 10,     // Very high quality
    'direct': 7         // Returning visitor
  };
  score += sourceScores[lead.source] || 0;

  // 5. EXTERNAL DATA SCORE (10 points)
  if (externalData?.hasLinkedInProfile) score += 3;
  if (externalData?.employmentVerified) score += 4;
  if (externalData?.hasPropertyHistory) score += 3; // Investor

  // BONUS POINTS
  if (lead.providedAllDetails) score += 5;
  if (interactions.responseTime < 300) score += 5; // Replied within 5 min

  // PENALTY POINTS
  if (lead.email?.includes('tempmail')) score -= 10; // Temporary email
  if (interactions.unsubscribed) score -= 20;

  return Math.max(0, Math.min(100, score)); // Clamp between 0-100
}

// Auto-classify based on score
function classifyLead(score) {
  if (score >= 75) return { priority: 'hot', sla: '5 minutes' };
  if (score >= 50) return { priority: 'warm', sla: '2 hours' };
  return { priority: 'cold', sla: '24 hours' };
}
```

### 4. Smart Recommendations Engine

Provide intelligent suggestions to improve campaign performance.

```javascript
async function generateSmartRecommendations(campaignId) {
  const campaign = await getCampaignWithAnalytics(campaignId);
  const recommendations = [];

  // BUDGET RECOMMENDATIONS
  if (campaign.spent / campaign.budget > 0.9 && campaign.daysRemaining > 3) {
    recommendations.push({
      type: 'budget',
      priority: 'high',
      title: 'Budget Running Low',
      message: 'You have spent 90% of your budget but have 3+ days remaining',
      actions: [
        {
          label: 'Increase Budget by 50%',
          action: () => increaseBudget(campaignId, 0.5)
        },
        {
          label: 'Reduce Daily Spend',
          action: () => reduceDailyBudget(campaignId)
        }
      ]
    });
  }

  // CHANNEL OPTIMIZATION
  const bestChannel = campaign.channels.sort((a, b) => a.cpl - b.cpl)[0];
  const worstChannel = campaign.channels.sort((a, b) => b.cpl - a.cpl)[0];

  if (bestChannel.cpl < worstChannel.cpl * 0.5) {
    recommendations.push({
      type: 'channel',
      priority: 'medium',
      title: 'Channel Performance Gap',
      message: `${bestChannel.name} is performing 2x better than ${worstChannel.name}`,
      actions: [
        {
          label: `Increase ${bestChannel.name} Budget`,
          action: () => reallocateBudget(campaignId, bestChannel.id, worstChannel.id)
        }
      ]
    });
  }

  // CONTENT OPTIMIZATION
  if (campaign.ctr < 2) {
    recommendations.push({
      type: 'content',
      priority: 'high',
      title: 'Low Click-Through Rate',
      message: 'Your CTR is below 2%. Try improving your ad creative',
      suggestions: [
        'Use more compelling property images',
        'Add urgency to headline ("Limited units remaining")',
        'Test different ad formats (video, carousel)',
        'Update ad copy to highlight unique benefits'
      ],
      actions: [
        {
          label: 'Generate New Ad Variations with AI',
          action: () => generateAdVariationsAI(campaignId)
        }
      ]
    });
  }

  // TIMING OPTIMIZATION
  const hourlyPerformance = await getHourlyPerformance(campaignId);
  const bestHours = hourlyPerformance
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 3);

  recommendations.push({
    type: 'timing',
    priority: 'low',
    title: 'Optimize Ad Schedule',
    message: `Your best performing hours are ${bestHours.map(h => h.hour).join(', ')}`,
    actions: [
      {
        label: 'Apply Time-based Bidding',
        action: () => applyTimeBasedBidding(campaignId, bestHours)
      }
    ]
  });

  // AUDIENCE EXPANSION
  if (campaign.leads > 50 && campaign.conversionRate > 15) {
    recommendations.push({
      type: 'audience',
      priority: 'medium',
      title: 'Scale Your Success',
      message: 'Your campaign is performing well. Consider expanding your audience',
      actions: [
        {
          label: 'Create Lookalike Audience',
          action: () => createLookalikeAudience(campaignId)
        },
        {
          label: 'Increase Budget by 30%',
          action: () => increaseBudget(campaignId, 0.3)
        }
      ]
    });
  }

  // LEAD FOLLOW-UP
  const unfollowedLeads = await getUnfollowedLeads(campaignId);
  if (unfollowedLeads.length > 10) {
    recommendations.push({
      type: 'lead_management',
      priority: 'high',
      title: 'Uncontacted Leads',
      message: `You have ${unfollowedLeads.length} leads that haven't been contacted`,
      actions: [
        {
          label: 'Send Bulk Follow-up WhatsApp',
          action: () => sendBulkFollowup(unfollowedLeads)
        },
        {
          label: 'Assign to Available Agent',
          action: () => autoAssignLeads(unfollowedLeads)
        }
      ]
    });
  }

  return recommendations.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority];
  });
}
```

---

## SUMMARY

This Real Estate Campaign Management System provides:

1. **Complete Marketing Automation** - From ad creation to lead nurturing
2. **Multi-Channel Integration** - Facebook, Instagram, Google, WhatsApp
3. **Intelligent Lead Management** - Auto-prioritization, scoring, and routing
4. **Real-time Analytics** - Track every metric that matters
5. **AI-Powered Features** - Content generation, predictions, recommendations
6. **Full Attribution** - Know exactly where every lead came from
7. **Automation Sequences** - Never miss a follow-up
8. **Performance Optimization** - Continuous improvement suggestions

The system is built on modern, scalable technology (React + Supabase) and integrates with industry-standard advertising platforms to provide a complete solution for real estate marketing.

---

**Document Version:** 1.0
**Last Updated:** March 26, 2026
**Author:** Campaign System Documentation Team
