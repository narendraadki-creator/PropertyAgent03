# Campaign Feature Testing Guide

Complete step-by-step instructions to test all implemented campaign features.

---

## PRE-REQUISITES

1. **Login to the system**
   - Go to `/login`
   - Use credentials for an agent role user
   - Verify you're redirected to agent dashboard

2. **Ensure test data exists**
   - Run the seed script to create sample campaigns
   - Verify projects exist in the database

---

## FEATURE TESTING STEPS

### 1. CAMPAIGN LIST PAGE

**Path:** `/agent/campaigns`

**Steps:**
1. Navigate to Campaigns from bottom navigation
2. Verify you see a list of campaigns
3. Check that each card shows:
   - Campaign title
   - Status badge (Active/Draft/Paused/Completed)
   - Budget amount
   - Start/End dates
   - Property count
   - Lead count
4. Click "Create Campaign" button
5. Verify you're redirected to campaign creation page

**Expected Result:** Campaign list displays with all information visible

---

### 2. CREATE NEW CAMPAIGN

**Path:** `/agent/campaigns/create`

#### Step 1: Select Project
1. View available projects
2. Select a project by clicking on it
3. Verify project card is highlighted
4. Click "Next"

**Expected:** Selected project is marked, can proceed to next step

#### Step 2: Campaign Details
1. Enter campaign title
2. Enter description
3. Select campaign type from dropdown
4. Enter budget amount
5. Select start date
6. Select end date
7. Click "Next"

**Expected:** All fields accept input, validation works

#### Step 3: Select Platforms
1. Toggle Facebook on/off
2. Toggle Instagram on/off
3. Toggle Twitter on/off
4. Toggle LinkedIn on/off
5. Toggle WhatsApp on/off
6. Verify at least one platform is selected
7. Click "Next"

**Expected:** Platform toggles work, validation prevents proceeding without selection

#### Step 4: Generate Content
1. View the AI-generated content in the preview
2. Click "Generate with AI" to regenerate
3. View social media preview cards
4. Test share buttons (Facebook, Twitter, LinkedIn, WhatsApp)
5. Click "Create Campaign"

**Expected:** Content generates, preview updates, campaign is created

---

### 3. CAMPAIGN DETAIL PAGE - HEADER SECTION

**Path:** `/agent/campaigns/:id`

**Steps:**
1. Click on any campaign from the list
2. Verify header shows:
   - Campaign name
   - Status badge with correct color
   - Duration (start - end dates)
   - Back to Campaigns button
3. Click "Duplicate" button
4. Verify new campaign is created with "(Copy)" suffix
5. Click "Edit" button
6. Verify edit mode opens

**Expected:** All header elements display correctly, buttons work

---

### 4. QUICK ACTION BAR

**On Campaign Detail Page**

#### For Draft Campaigns:
1. Find a draft campaign
2. Click "Launch Campaign" button
3. Verify status changes to "Active"
4. Verify status badge updates to green
5. Check activity timeline for launch event

#### For Active Campaigns:
1. Find an active campaign
2. Click "Pause" button
3. Verify status changes to "Paused"
4. Verify status badge updates to yellow
5. Click "Resume" to reactivate

**Expected:** Status transitions work, UI updates immediately

---

### 5. AI CAMPAIGN SCORE

**On Campaign Detail Page**

**Steps:**
1. Locate the AI Campaign Score card
2. Verify score is displayed (0-100)
3. Check score color coding:
   - Green: 80-100
   - Yellow: 60-79
   - Red: 0-59
4. Read AI-generated insights below the score
5. Verify insights are actionable

**Expected:** Score displays with color coding, insights are visible

---

### 6. PROPERTY SELECTION

**On Campaign Detail Page**

**Steps:**
1. Scroll to "Selected Properties" section
2. Verify properties display with:
   - Property image
   - Property name
   - Location
   - Price in AED
3. Check for "AI Suggested" badge on suggested properties
4. Click "Add Property" button
5. Verify property selection modal/page opens

**Expected:** Properties display with all details, AI suggestions marked

---

### 7. AI AUDIENCE BUILDER

**On Campaign Detail Page**

**Steps:**
1. Locate "Target Audience" section
2. View current audience configuration
3. Click "Generate with AI" button
4. Verify audience is auto-generated based on property type
5. Check suggested locations
6. Verify budget range is set
7. Review buyer type recommendations

**Expected:** AI generates relevant audience based on property

---

### 8. AI CONTENT GENERATOR

**On Campaign Detail Page**

**Steps:**
1. Scroll to "Campaign Content" section
2. Click "Generate for Luxury Buyers" button
3. Verify content is generated
4. Click "Generate for Investors" button
5. Compare content tone and focus
6. Click "Generate for First-time Buyers"
7. Verify content is appropriate for audience type
8. Copy generated content

**Expected:** Different content generated for each audience type

---

### 9. SMART BUDGET SPLIT

**On Campaign Detail Page - Right Sidebar**

**Steps:**
1. Locate "Budget Distribution" card
2. View current budget allocation:
   - Facebook budget
   - Instagram budget
   - Google Ads budget
   - WhatsApp budget
3. Check that total equals campaign budget
4. Verify visual percentage indicators
5. Note performance-based recommendations

**Expected:** Budget split displays, totals match campaign budget

---

### 10. PERFORMANCE OVERVIEW

**On Campaign Detail Page - Right Sidebar**

**Steps:**
1. Locate "Performance Overview" section
2. Verify three metric cards:
   - Total Views (blue background)
   - Leads Generated (green background)
   - Conversion Rate (purple background)
3. Check that numbers are formatted correctly
4. Verify icons are displayed
5. Check for trend indicators

**Expected:** All metrics display with correct formatting and colors

---

### 11. LEADS DASHBOARD

**On Campaign Detail Page - Leads Tab**

**Steps:**
1. Click "Leads" tab
2. Verify leads table displays with columns:
   - Name
   - Contact (email/phone with icons)
   - Source
   - Budget
   - Priority (star rating)
   - Status
3. Check priority score color coding:
   - Red: 80-100 (high priority)
   - Yellow: 60-79 (medium priority)
   - Gray: 0-59 (low priority)
4. Verify status badges:
   - Blue: New
   - Yellow: Contacted
   - Green: Closed
5. Click "Add Lead" button
6. Sort leads by different columns

**Expected:** Leads table shows all data, priority highlighting works

---

### 12. SMART LEAD PRIORITY

**On Leads Tab**

**Steps:**
1. View the leads table
2. Identify leads with high priority scores (80+)
3. Verify they have red star icons
4. Check that high-priority leads stand out visually
5. Verify priority score is calculated based on:
   - Budget range
   - Engagement level
   - Source quality

**Expected:** High-value leads are visually highlighted

---

### 13. PERFORMANCE ANALYTICS

**On Campaign Detail Page - Analytics Tab**

**Steps:**
1. Click "Analytics" tab
2. Read "What's Working" insight card
3. Verify insight is specific and actionable
4. View performance metric cards:
   - Avg. Daily Views
   - Click Rate (%)
   - Lead Rate (%)
   - Cost per Lead (AED)
5. Verify calculations are correct
6. Check for data visualization

**Expected:** Analytics display with insights and calculated metrics

---

### 14. WHAT'S WORKING INSIGHT

**On Analytics Tab**

**Steps:**
1. Locate the blue insight card
2. Read the AI-generated insight
3. Verify it mentions:
   - Best performing channel
   - Specific percentage/metric
   - Actionable recommendation
4. Check for trend icon
5. Verify insight updates based on actual data

**Expected:** Insight provides specific, actionable information

---

### 15. AUTOMATION SETTINGS

**On Campaign Detail Page - Automation Tab**

**Steps:**
1. Click "Automation" tab
2. Test toggle switches:
   - Auto-follow-up messages (toggle on/off)
   - WhatsApp auto-reply (toggle on/off)
   - Smart lead prioritization (toggle on/off)
3. Verify toggles save state
4. Read descriptions for each automation

**Expected:** Toggles work, settings persist

---

### 16. FOLLOW-UP SEQUENCES

**On Automation Tab**

**Steps:**
1. Scroll to "Follow-up Sequence" section
2. Verify three sequence steps:
   - Day 1: Welcome message (green check icon)
   - Day 3: Follow-up reminder (yellow alert icon)
   - Day 7: Special offer (blue star icon)
3. Read descriptions for each step
4. Check visual timeline flow

**Expected:** Sequence displays with icons and descriptions

---

### 17. ACTIVITY TIMELINE

**On Campaign Detail Page - Right Sidebar**

**Steps:**
1. Locate "Recent Activity" section
2. Verify activities are listed chronologically
3. Check for different activity types:
   - Campaign launched
   - Status changes
   - Lead received
   - Follow-up sent
4. Verify timestamps are formatted correctly
5. Check that most recent is at the top

**Expected:** Activity timeline shows recent events with timestamps

---

### 18. CHANNEL DISTRIBUTION

**On Campaign Detail Page**

**Steps:**
1. View channel icons in campaign summary
2. Verify selected channels are displayed:
   - Facebook icon
   - Instagram icon
   - Google Ads icon
   - WhatsApp icon
3. Check that only active channels are shown
4. Verify budget allocation per channel

**Expected:** Active channels displayed with budget allocation

---

### 19. DUPLICATE CAMPAIGN

**On Campaign Detail Page**

**Steps:**
1. Click "Duplicate" button in header
2. Verify confirmation or immediate duplication
3. Check that new campaign is created with:
   - Same title + "(Copy)" suffix
   - Status set to "Draft"
   - Same budget and settings
   - New unique ID
4. Verify redirect to new campaign detail page

**Expected:** Campaign duplicated successfully, set to draft status

---

### 20. EDIT CAMPAIGN

**On Campaign Detail Page**

**Steps:**
1. Click "Edit" button in header
2. Verify navigation to edit page/mode
3. Update campaign title
4. Change budget amount
5. Modify end date
6. Save changes
7. Verify updates are reflected

**Expected:** Campaign details can be edited and saved

---

## MOBILE RESPONSIVENESS

### Test on Mobile Viewport

**Steps:**
1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Test on different screen sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
4. Verify:
   - Cards stack vertically
   - Text is readable
   - Buttons are touchable
   - Tables scroll horizontally
   - Navigation works
   - No horizontal overflow

**Expected:** All features work on mobile devices

---

## QUICK VERIFICATION CHECKLIST

Use this checklist for rapid testing:

- [ ] Can create new campaign
- [ ] AI Score displays correctly
- [ ] Properties show with images
- [ ] AI Audience Builder generates audience
- [ ] AI Content Generator creates content
- [ ] Budget Split shows all channels
- [ ] Leads table displays with priority
- [ ] Analytics show insights
- [ ] Automation toggles work
- [ ] Follow-up sequence visible
- [ ] Activity timeline updates
- [ ] Status changes work (Draft → Active → Paused)
- [ ] Duplicate campaign works
- [ ] Edit campaign works
- [ ] Mobile view responsive

---

## COMMON ISSUES & TROUBLESHOOTING

### No campaigns showing
- Check if user is logged in as agent
- Verify campaigns exist in database
- Run seed script: Check Campaign_Testing_Guide.md

### No leads in campaign
- Campaigns need to be active to generate leads
- Check campaign_leads table in database
- Verify lead generation is configured

### AI features not working
- Check if campaign has required data (property type, budget)
- Verify components are receiving correct props
- Check browser console for errors

### Analytics showing zeros
- New campaigns won't have analytics data
- Need to seed campaign_analytics table
- Wait for campaign to run and collect data

---

## DATABASE VERIFICATION

Check data directly in Supabase:

1. **Campaigns:** `SELECT * FROM campaigns ORDER BY created_at DESC;`
2. **Properties:** `SELECT * FROM campaign_properties WHERE campaign_id = 'xxx';`
3. **Leads:** `SELECT * FROM campaign_leads WHERE campaign_id = 'xxx';`
4. **Analytics:** `SELECT * FROM campaign_analytics WHERE campaign_id = 'xxx';`
5. **Activities:** `SELECT * FROM campaign_activities WHERE campaign_id = 'xxx';`

---

## NEXT STEPS

After testing all features:

1. Document any bugs found
2. Note missing features from requirements
3. Test performance with large datasets
4. Verify security (RLS policies)
5. Test concurrent user access
