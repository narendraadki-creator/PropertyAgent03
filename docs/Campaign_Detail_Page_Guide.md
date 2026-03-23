# Campaign Detail Page - Complete Feature Guide

## Page URL
`/agent/campaigns/:id`

## Header Section

### Display Elements

**Campaign Name & Status**
- Large campaign title (e.g., "Grand Launch Campaign")
- Status badge with color coding:
  - 🟢 **Active**: Green background with green text
  - ⚪ **Draft**: Gray background with gray text
  - 🟡 **Paused**: Yellow background with yellow text
  - 🔵 **Completed**: Blue background with blue text

**Campaign Description**
- Shows full campaign description below the title
- Light teal color for better readability

**Duration Display**
- Clock icon with start and end dates
- Format: "MM/DD/YYYY - MM/DD/YYYY"
- Shows "Not set" if start date is missing
- Shows "Ongoing" if end date is missing

### Action Buttons

**1. Back to Campaigns Button**
- ← Arrow icon with "Back to Campaigns" text
- Returns to campaigns list page
- Styled in light teal/white

**2. Duplicate Button**
- Copy icon with "Duplicate" text
- Creates a copy of the campaign with "(Copy)" suffix
- New campaign is created with:
  - Same project, description, type, budget, dates
  - Same platforms and content
  - Status set to "draft"
  - Performance metrics reset to 0
- Shows success alert when duplicated
- Automatically navigates to the new campaign's detail page

**3. Edit Button**
- Edit (CreditCard) icon with "Edit" text
- Opens the campaign edit page
- URL: `/agent/campaigns/:id/edit`
- Edit page allows updating:
  - Campaign details (title, description, type, budget, dates)
  - Target platforms
  - Generated content
  - Preview and share settings

### Status Control Buttons

**Launch Campaign** (when status = draft)
- Play icon with green background
- Changes status from "draft" to "active"
- Creates activity log entry

**Pause** (when status = active)
- Pause icon with yellow background
- Changes status from "active" to "paused"
- Creates activity log entry

**Resume** (when status = paused)
- Play icon with green background
- Changes status from "paused" to "active"
- Creates activity log entry

**View Analytics**
- Bar chart icon
- Opens analytics view (currently informational)

## Edit Campaign Page

### Features
The edit page (`/agent/campaigns/:id/edit`) provides a 4-step wizard identical to the create flow:

**Step 1: Campaign Details**
- Select Project (required)
- Campaign Title (required)
- Description (optional)
- Campaign Type (required) - 5 types available
- Budget (AED) - optional
- Start Date (optional)
- End Date (optional)

**Step 2: Platform Selection**
- Toggle platforms on/off
- Must select at least one platform
- Visual feedback with checkmarks

**Step 3: Generate Content**
- AI content generation
- Platform-specific formatting
- Custom message option
- Hashtag suggestions

**Step 4: Preview & Share**
- Preview on different platforms
- Social media share buttons
- Update button to save changes

**Navigation:**
- Back button returns to campaign detail page
- Previous/Next buttons for wizard navigation
- Update Campaign button (replaces Create button)

## Main Content Sections

### AI Campaign Score Card
- Shows overall campaign performance score (0-100)
- Displays AI-generated insights and recommendations
- Color-coded score indicator

### Selected Properties Section
- Grid display of associated properties
- Each property shows:
  - Property image
  - Property name
  - Location
  - Price in AED
  - "AI Suggested" badge (if applicable)
- "Add Property" button to associate more properties

### AI Audience Builder
- Configure target audience settings
- Set location preferences
- Define budget ranges
- Select buyer types

### AI Content Generator
- Generate platform-specific content
- Property details integration
- Campaign type customization

### Smart Budget Split
- Visual budget distribution across channels
- Channels: Facebook, Instagram, Google, WhatsApp
- Interactive sliders to adjust allocation
- Real-time total calculation

### Performance Overview Card
- **Total Views**: Blue card with trending up icon
- **Leads Generated**: Green card with users icon
- **Conversion Rate**: Purple card with target icon
- All metrics displayed with large numbers and icons

### Recent Activity Timeline
- Chronological activity feed
- Activity types:
  - Campaign status changes
  - Lead additions
  - Property associations
  - Budget updates
- Each activity shows:
  - Description
  - Timestamp (full date and time)
  - Activity icon

## Tabbed Content Area

### Overview Tab
- Default view
- Summary of all campaign information

### Leads Tab
- **Header**: "Campaign Leads" with "Add Lead" button
- **Table Columns**:
  - Name (lead's full name)
  - Contact (email with mail icon, phone with phone icon)
  - Source (platform badge)
  - Budget (budget range or "-")
  - Priority (star icon with score, color-coded)
  - Status (new/contacted/qualified badges)
- **Empty State**: Shows when no leads exist
  - Users icon
  - "No leads yet" message
  - Helpful text about when leads will appear

### Analytics Tab
- **"What's Working" Insight Box**: Blue banner with AI recommendations
- **Performance Metrics Grid** (4 cards):
  - Avg. Daily Views
  - Click Rate (percentage)
  - Lead Rate (percentage)
  - Cost/Lead (AED)

### Automation Tab
- **Toggle Switches** for:
  - Auto-follow-up messages (default: ON)
  - WhatsApp auto-reply (default: OFF)
  - Smart lead prioritization (default: ON)
- **Follow-up Sequence Timeline**:
  - Day 1: Welcome message (green checkmark)
  - Day 3: Follow-up reminder (yellow alert)
  - Day 7: Special offer (blue star)

## Data Integration

### Supabase Tables Used
- `campaigns` - Main campaign data
- `campaign_properties` - Associated properties (with project join)
- `campaign_leads` - Campaign-specific leads
- `campaign_analytics` - Daily analytics data
- `campaign_activities` - Activity timeline

### Real-time Updates
- Status changes immediately update the UI
- Activity logs are created for all major actions
- Performance metrics calculate from daily analytics

## Error Handling

**Campaign Not Found**
- Shows centered error message
- "Campaign not found" text

**Loading State**
- Centered spinning loader
- Teal-colored spinner
- Covers full screen height

## Functionality Summary

✅ **Working Features:**
1. Campaign header with name, status, and duration
2. Back to campaigns navigation
3. Duplicate campaign functionality with proper data copying
4. Edit campaign button with full edit page
5. Status change controls (Launch/Pause/Resume)
6. Performance metrics display
7. Properties listing
8. Activity timeline
9. Leads table
10. Analytics metrics
11. Automation settings

✅ **Edit Page Features:**
1. 4-step wizard with pre-filled data
2. All fields editable
3. Content regeneration
4. Platform preview
5. Update campaign button
6. Proper navigation back to detail page

## Testing Checklist

- [x] Header displays campaign name correctly
- [x] Status badge shows correct color
- [x] Duration displays start and end dates
- [x] Back button navigates to campaigns list
- [x] Duplicate button creates new campaign with "(Copy)" suffix
- [x] Edit button opens edit page with pre-filled data
- [x] Edit page allows updating all fields
- [x] Update button saves changes to database
- [x] Launch/Pause/Resume buttons change status
- [x] Performance metrics display correctly
- [x] Properties grid shows associated properties
- [x] Leads table displays campaign leads
- [x] Analytics tab shows performance metrics
- [x] Automation settings display correctly
- [x] Activity timeline shows recent actions
