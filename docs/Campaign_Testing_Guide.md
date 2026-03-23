# Campaign Management System - Testing Guide

## Overview
This guide provides step-by-step instructions to test all features of the AI-powered Campaign Management System.

---

## Prerequisites

### 1. Database Setup
- Ensure Supabase is connected (check `.env` file)
- Run migrations to create all necessary tables
- Tables created:
  - `campaigns` (enhanced with AI fields)
  - `campaign_properties`
  - `campaign_leads`
  - `campaign_analytics`
  - `campaign_automation`
  - `campaign_activities`
  - `projects`

### 2. Access the Application
1. Start the dev server (should already be running)
2. Open the application in your browser
3. Switch to **Agent role** (top-right corner if role selector exists)

---

## Testing Steps

### STEP 1: Navigate to Campaigns Page
**Expected Result:** You should see the "My Campaigns" page

**Actions:**
1. Click "Campaigns" icon in the bottom navigation bar
2. Page should load with header "My Campaigns"
3. You should see campaign stats: Total, Active, Draft, Completed (all showing 0 initially)

**What to Check:**
- ✅ Page loads without errors
- ✅ Bottom navigation is visible
- ✅ "Create Campaign" button is visible
- ✅ "Add Sample Data" button is visible (only if no campaigns exist)

---

### STEP 2: Seed Sample Campaign Data
**Expected Result:** Sample campaigns, projects, leads, and analytics are created

**Actions:**
1. Click the "Add Sample Data" button (purple button with database icon)
2. Wait for the process to complete
3. You should see an alert: "Sample campaign data added successfully!"

**What to Check:**
- ✅ Alert shows success message
- ✅ 3 campaign cards appear on the page:
  - "Luxury Waterfront Living Campaign" (Active - Green badge)
  - "First-Time Buyer Special" (Draft - Gray badge)
  - "Investment Opportunity ROI Focus" (Paused - Yellow badge)
- ✅ Campaign stats update:
  - Total Campaigns: 3
  - Active: 1
  - Draft: 1
  - Paused/Other: 1
- ✅ Each card shows views, leads, and clicks metrics

**Troubleshooting:**
- If you see "Failed to seed campaign data", check browser console for error details
- Common issues: Database permissions, missing tables
- Try refreshing the page and clicking "Add Sample Data" again

---

### STEP 3: View Campaign List
**Expected Result:** All campaigns display correctly with proper information

**What to Check:**
- ✅ Campaign cards show:
  - Title
  - Description
  - Status badge (with correct color)
  - Channel icons (F for Facebook, I for Instagram, etc.)
  - Campaign type
  - Performance metrics (Views, Leads, Clicks)
- ✅ Search bar is functional
- ✅ Filter dropdown works (All Status)
- ✅ Cards are clickable

---

### STEP 4: Open Campaign Detail Page
**Expected Result:** Detailed campaign view loads with all sections

**Actions:**
1. Click on the "Luxury Waterfront Living Campaign" card
2. Page should navigate to campaign detail view

**What to Check:**

#### Header Section
- ✅ Campaign name: "Luxury Waterfront Living Campaign"
- ✅ Status badge: "active" (green)
- ✅ "Back to Campaigns" link works
- ✅ "Duplicate" button visible
- ✅ "Edit" button visible
- ✅ Campaign dates displayed
- ✅ Action buttons visible:
  - Pause (since campaign is active)
  - View Analytics

#### AI Campaign Score Card
- ✅ Score displayed (should be 85/100)
- ✅ Score color matches value (green for high scores)
- ✅ Circular progress indicator visible
- ✅ Insights section shows 3 recommendations:
  - "Instagram is generating 60% more leads than Facebook"
  - "Best performing time: 6-9 PM weekdays"
  - "Consider adding more luxury property visuals"

#### Selected Properties Section
- ✅ Section title: "Selected Properties"
- ✅ "Add Property" button visible
- ✅ At least 1 property card displayed with:
  - Property image
  - Property name
  - Location
  - Price (AED formatted)
  - "AI Suggested" badge (on first property)

#### Target Audience Section
- ✅ "AI Audience Builder" component visible
- ✅ Shows configured audience:
  - Locations: Dubai Marina, Palm Jumeirah, Downtown Dubai
  - Budget range: 2M - 10M AED
  - Buyer types: Investor, End-user
- ✅ "Generate with AI" button visible

#### Content Builder Section
- ✅ "AI Content Generator" component visible
- ✅ Shows ad copy options for:
  - Luxury buyers
  - Investors
  - First-time buyers
- ✅ "Generate with AI" button works

#### Budget Distribution Section (Right Sidebar)
- ✅ "Smart Budget Split" card visible
- ✅ Total budget shown: AED 15,000
- ✅ "Auto Optimize" button visible
- ✅ 4 channels displayed:
  - Facebook Ads (25% - AED 3,750)
  - Instagram Ads (40% - AED 6,000)
  - Google Ads (25% - AED 3,750)
  - WhatsApp Broadcast (15% - AED 1,500)
- ✅ Progress bars show percentages
- ✅ Each channel has editable input field
- ✅ Total allocated amount matches budget

#### Performance Overview (Right Sidebar)
- ✅ Three cards displayed:
  - Total Views (with number)
  - Leads Generated (with number matching leads count)
  - Conversion Rate (percentage)
- ✅ Icons displayed correctly
- ✅ Numbers are properly formatted

#### Recent Activity Section (Right Sidebar)
- ✅ Activity timeline visible
- ✅ Shows recent activities:
  - "Campaign launched"
  - "New lead received from Instagram"
  - "Follow-up message sent to 3 leads"
- ✅ Each activity has timestamp
- ✅ Activity icons displayed

---

### STEP 5: Test Tabs Navigation
**Expected Result:** Tab switching works correctly

**Actions:**
1. Click each tab at the bottom of the page

#### Overview Tab
- ✅ Default tab (already visible)
- ✅ Shows all summary cards

#### Leads Tab (should show "Leads (3)")
- ✅ Tab label shows lead count
- ✅ "Add Lead" button visible
- ✅ Leads table displayed with columns:
  - Name
  - Contact (email/phone)
  - Source
  - Budget
  - Priority (star rating)
  - Status
- ✅ 3 sample leads visible:
  - Ahmed Al-Mansouri (Priority: 85, Status: contacted)
  - Sarah Johnson (Priority: 92, Status: new)
  - Mohammed Hassan (Priority: 95, Status: new)
- ✅ Priority scores show star icons with colors:
  - 80+: Red (high priority)
  - 60-79: Yellow (medium priority)
  - Below 60: Gray (low priority)
- ✅ Status badges have correct colors:
  - new: Blue
  - contacted: Yellow
  - closed: Green

#### Analytics Tab
- ✅ "What's Working" insight card visible
- ✅ Shows message: "Instagram is generating 60% more leads than Facebook"
- ✅ 4 metric cards displayed:
  - Avg. Daily Views
  - Click Rate (%)
  - Lead Rate (%)
  - Cost/Lead (AED)
- ✅ All calculations show numbers (not 0/NaN)

#### Automation Tab
- ✅ 3 automation toggles visible:
  - Auto-follow-up messages (ON by default)
  - WhatsApp auto-reply (OFF by default)
  - Smart lead prioritization (ON by default)
- ✅ Toggles are interactive
- ✅ Follow-up sequence section visible
- ✅ 3 sequence steps shown:
  - Day 1: Welcome message (green checkmark)
  - Day 3: Follow-up reminder (yellow alert)
  - Day 7: Special offer (blue star)

---

### STEP 6: Test Campaign Actions

#### Test Pause Campaign
**Actions:**
1. Click "Pause" button in action bar
2. Wait for update

**What to Check:**
- ✅ Status badge changes to "paused" (yellow)
- ✅ "Pause" button changes to "Resume" button
- ✅ New activity appears in timeline: "Campaign paused"

#### Test Resume Campaign
**Actions:**
1. Click "Resume" button
2. Wait for update

**What to Check:**
- ✅ Status badge changes back to "active" (green)
- ✅ Button changes back to "Pause"
- ✅ New activity appears: "Campaign launched"

#### Test Duplicate Campaign
**Actions:**
1. Click "Duplicate" button
2. Wait for navigation

**What to Check:**
- ✅ Navigates to new campaign detail page
- ✅ Campaign title includes "(Copy)"
- ✅ Status is "draft"
- ✅ All other details are copied

---

### STEP 7: Test Budget Auto-Optimization
**Expected Result:** Budget splits automatically when optimized

**Actions:**
1. In the Smart Budget Split card, click "Auto Optimize"
2. Observe the changes

**What to Check:**
- ✅ Channel budgets recalculate
- ✅ Progress bars animate to new percentages
- ✅ Total allocated amount still equals total budget
- ✅ New distribution appears:
  - Facebook: ~25%
  - Instagram: ~40% (highest)
  - Google: ~20%
  - WhatsApp: ~15%

---

### STEP 8: Test Manual Budget Editing
**Expected Result:** Budget can be edited manually

**Actions:**
1. Click on any channel's budget input field
2. Change the value (e.g., change Facebook from 3750 to 5000)
3. Press Enter or click outside

**What to Check:**
- ✅ Progress bar updates
- ✅ Percentage recalculates
- ✅ Total allocated amount updates
- ✅ No errors in console

---

### STEP 9: Test Back Navigation
**Expected Result:** Returns to campaign list

**Actions:**
1. Click "Back to Campaigns" link at top
2. Page should navigate back

**What to Check:**
- ✅ Returns to campaigns list page
- ✅ All campaigns still visible
- ✅ Campaign stats updated (if any changes were made)

---

### STEP 10: Test Draft Campaign
**Expected Result:** Draft campaign shows "Launch" button

**Actions:**
1. Click on "First-Time Buyer Special" card (Draft status)
2. View campaign detail page

**What to Check:**
- ✅ Status badge shows "draft" (gray)
- ✅ Action bar shows "Launch Campaign" button (green with play icon)
- ✅ No "Pause" button visible
- ✅ All sections load correctly
- ✅ AI Score shows 72/100
- ✅ Budget shows AED 8,000

#### Test Launch Campaign
**Actions:**
1. Click "Launch Campaign" button
2. Wait for update

**What to Check:**
- ✅ Status changes to "active" (green)
- ✅ Button changes to "Pause"
- ✅ Activity added to timeline

---

### STEP 11: Test Paused Campaign
**Expected Result:** Paused campaign shows "Resume" button

**Actions:**
1. Go back to campaigns list
2. Click on "Investment Opportunity ROI Focus" card (Paused status)
3. View campaign detail page

**What to Check:**
- ✅ Status badge shows "paused" (yellow)
- ✅ Action bar shows "Resume" button (green)
- ✅ AI Score shows 68/100
- ✅ Budget shows AED 12,000
- ✅ Different channel distribution visible

---

### STEP 12: Test Search Functionality
**Expected Result:** Campaigns filter based on search

**Actions:**
1. Return to campaigns list
2. Type "Luxury" in the search bar
3. Observe results

**What to Check:**
- ✅ Only "Luxury Waterfront Living Campaign" shows
- ✅ Other campaigns hidden
- ✅ Clear search to see all campaigns again

---

### STEP 13: Test Filter Dropdown
**Expected Result:** Campaigns filter by status

**Actions:**
1. Click "All Status" dropdown
2. Select "Active"
3. Observe results

**What to Check:**
- ✅ Dropdown shows options: All Status, Active, Draft, Paused, Completed
- ✅ Only active campaigns show when "Active" selected
- ✅ Filter resets when "All Status" selected

---

### STEP 14: Test Create New Campaign
**Expected Result:** Navigate to campaign creation form

**Actions:**
1. Click "Create Campaign" button
2. Page should navigate to create campaign form

**What to Check:**
- ✅ Navigates to `/agent/campaigns/create`
- ✅ Campaign creation form loads
- ✅ All form fields are present

---

### STEP 15: Mobile Responsiveness
**Expected Result:** Layout adapts to mobile screens

**Actions:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Navigate through campaign pages

**What to Check:**
- ✅ Bottom navigation stays at bottom
- ✅ Campaign cards stack vertically
- ✅ All content is readable
- ✅ Buttons are tap-friendly
- ✅ No horizontal scrolling
- ✅ Tabs work on mobile
- ✅ Sidebar sections stack on mobile

---

## Feature Checklist

### ✨ Core Features
- ✅ Campaign listing with status badges
- ✅ Campaign detail page with all sections
- ✅ Create, view, edit, duplicate campaigns
- ✅ Launch/pause/resume campaigns
- ✅ Real-time status updates

### 🤖 AI Features
- ✅ AI Campaign Score (0-100)
- ✅ AI-generated insights
- ✅ AI Audience Builder
- ✅ AI Content Generator
- ✅ Smart Budget Optimization
- ✅ Lead prioritization with scores

### 📊 Analytics & Reporting
- ✅ Performance overview cards
- ✅ Daily analytics tracking
- ✅ Channel breakdown
- ✅ Conversion rate calculation
- ✅ Cost per lead calculation
- ✅ "What's Working" insights

### 👥 Lead Management
- ✅ Lead table with all details
- ✅ Priority scoring (color-coded)
- ✅ Lead status tracking
- ✅ Multiple contact methods
- ✅ Source attribution

### 💰 Budget Management
- ✅ Total budget display
- ✅ Channel-wise distribution
- ✅ Visual progress bars
- ✅ Manual editing
- ✅ Auto-optimization
- ✅ Percentage calculations

### ⚙️ Automation
- ✅ Auto-follow-up toggle
- ✅ WhatsApp auto-reply toggle
- ✅ Lead prioritization toggle
- ✅ Follow-up sequences (Day 1, 3, 7)
- ✅ Automation configuration

### 📱 Properties Integration
- ✅ Link campaigns to properties
- ✅ Property cards with images
- ✅ AI property suggestions
- ✅ Multiple property support

### 🕐 Activity Timeline
- ✅ Campaign launches
- ✅ Lead events
- ✅ Status changes
- ✅ Follow-up tracking
- ✅ Timestamps

### 🎨 UI/UX Features
- ✅ Mobile-first design
- ✅ Color-coded status badges
- ✅ Smooth animations
- ✅ Card-based layout
- ✅ Icon-based navigation
- ✅ Responsive tabs
- ✅ Loading states
- ✅ Empty states

---

## Known Issues & Troubleshooting

### Issue: "Failed to seed campaign data"
**Solutions:**
1. Check browser console for specific error
2. Verify Supabase connection in `.env`
3. Ensure all migrations are applied
4. Check database permissions (RLS policies)
5. Try refreshing the page and clicking again

### Issue: Data not loading
**Solutions:**
1. Check browser console for errors
2. Verify Supabase URL and keys in `.env`
3. Check network tab for failed requests
4. Ensure you're using the correct role (Agent)

### Issue: Images not loading
**Solutions:**
1. Check internet connection (images from Pexels)
2. Images are external URLs, ensure firewall allows access

### Issue: Numbers showing as 0 or NaN
**Solutions:**
1. Ensure analytics data was seeded
2. Check that campaign has associated analytics records
3. Verify calculations in component code

---

## Performance Expectations

### Page Load Times
- Campaign list: < 2 seconds
- Campaign detail: < 3 seconds
- Data seeding: 5-10 seconds

### Database Queries
- All queries use proper indexes
- RLS policies applied to all tables
- Efficient joins for related data

### UI Responsiveness
- Smooth animations (60fps)
- Instant tab switching
- No layout shifts
- Fast interactions

---

## Success Criteria

The system is working correctly if:

1. ✅ All 3 sample campaigns load and display correctly
2. ✅ Campaign detail page shows all 8 sections without errors
3. ✅ AI score and insights are visible
4. ✅ Leads table shows 3 leads with proper data
5. ✅ Budget distribution totals 100% of budget
6. ✅ Status changes work (draft → active → paused)
7. ✅ Analytics tab shows calculated metrics
8. ✅ Automation toggles are interactive
9. ✅ Navigation works smoothly (list ↔ detail)
10. ✅ Mobile view is fully functional

---

## Next Steps After Testing

If all tests pass:
1. ✅ System is ready for production
2. ✅ Create real campaigns with actual data
3. ✅ Connect to real marketing channels
4. ✅ Set up automation workflows

If tests fail:
1. Document specific errors
2. Check browser console logs
3. Verify database schema and data
4. Review Supabase dashboard for issues

---

## Support

For issues or questions:
1. Check browser console for error details
2. Review Supabase logs in dashboard
3. Verify all migrations are applied
4. Ensure proper environment variables

---

**Last Updated:** March 23, 2026
**System Version:** 1.0
**Database Schema:** Latest (with AI enhancements)
