# Agent Monitoring System - Requirements Document

## Overview
This document outlines the requirements and implementation details for the Agent Monitoring System within the Manager interface. The system enables managers to monitor agent performance, view detailed metrics, and track activity logs.

## Feature Summary
The Agent Monitoring System consists of three main components:
1. Agent Monitoring Dashboard (List View)
2. Agent Details View
3. Agent Activity Log

---

## 1. Agent Monitoring Dashboard

### 1.1 Purpose
Provide managers with a comprehensive overview of all agents under their supervision, allowing quick assessment of team performance and identification of agents requiring attention.

### 1.2 Features Implemented

#### 1.2.1 Header Section
- **Title**: "AGENT MONITORING" with gradient underline
- **Subtitle**: "Team Performance & Activity"
- **Back Navigation**: Returns to Manager Dashboard

#### 1.2.2 Search Functionality
- Search agents by:
  - Agent name
  - Email address
  - Region/territory
- Real-time filtering as user types
- Icon-based search input with clear visual feedback

#### 1.2.3 Status Filtering
- Filter options:
  - All (default)
  - Excellent
  - Good
  - Average
  - Needs Attention
- Visual pill-style buttons
- Active filter highlighted with white background and shadow
- Color-coded status badges on agent cards

#### 1.2.4 Summary Statistics
- Total agents count
- Excellent performers count
- Average performers count
- Agents needing attention count
- Color-coded metrics (blue, green, yellow, red)

#### 1.2.5 Agent Cards
Each agent card displays:

**Agent Information:**
- Profile avatar with initial
- Full name
- Region/territory
- Email address
- Performance status badge

**Performance Metrics Grid:**
- Total Leads
- Active Leads
- Closed Deals

**Detailed Statistics:**
- Site Visits
- Bookings
- Conversion Rate (color-coded by performance)
- Average Response Time (color-coded by performance)

**Performance Indicators:**
- Last activity timestamp
- Top Performer badge (for excellent status)
- Needs Review badge (for agents needing attention)

**Action Buttons:**
- View Details (primary button)
- Activity Log (secondary button)

#### 1.2.6 Color Coding System
- **Excellent**: Green background, border, and text
- **Good**: Blue background, border, and text
- **Average**: Yellow background, border, and text
- **Needs Attention**: Red background, border, and text

---

## 2. Agent Details View

### 2.1 Purpose
Provide in-depth performance analysis and detailed metrics for individual agents, enabling managers to make informed decisions about coaching, recognition, and resource allocation.

### 2.2 Features Implemented

#### 2.2.1 Header Section
- **Title**: "AGENT DETAILS"
- **Subtitle**: "Performance Overview"
- **Back Navigation**: Returns to Agent Monitoring Dashboard

#### 2.2.2 Agent Profile Card

**Profile Section:**
- Large avatar with gradient background
- Agent name (prominent display)
- Region with location icon
- Top Performer badge (if applicable)

**Contact Information:**
- Phone number with icon
- Email address with icon
- Join date with calendar icon
- Last activity with clock icon

**Monthly Target Progress:**
- Visual progress bar
- Current achievement vs target
- Percentage completion
- Color-coded progress indicator

#### 2.2.3 Time Filter
Filter performance data by:
- Last 7 Days
- Last 30 Days
- Last 90 Days
- This Year

#### 2.2.4 Key Metrics Dashboard
Four primary metrics in grid layout:
- **Total Leads**: All leads assigned
- **Active Leads**: Currently active leads
- **Site Visits**: Number of property tours conducted
- **Deals Closed**: Successfully closed transactions

Each metric displays:
- Large, bold number
- Color-coded by category
- Descriptive label

#### 2.2.5 Performance Indicators
Four key performance ratios with trend analysis:

**Response Rate:**
- Current percentage
- Change from previous period
- Trend indicator (up/down arrow)
- Green color coding

**Visit Rate:**
- Current percentage
- Change from previous period
- Trend indicator
- Blue color coding

**Booking Rate:**
- Current percentage
- Change from previous period
- Trend indicator
- Yellow color coding

**Close Rate:**
- Current percentage
- Change from previous period
- Trend indicator
- Green color coding

#### 2.2.6 Recent Lead Activity
Display of recent leads showing:
- Client name
- Property name
- Lead status (color-coded badge)
- Lead value (in INR)
- Activity timestamp
- Status badges:
  - New Lead (blue)
  - Visit Scheduled (purple)
  - Negotiation (yellow)
  - Closed Won (green)

#### 2.2.7 Action Buttons
- **View Activity Log**: Navigate to detailed activity timeline
- **Send Message**: Initiate communication with agent

---

## 3. Agent Activity Log

### 3.1 Purpose
Provide a comprehensive, chronological record of all agent activities, enabling managers to track productivity, identify patterns, and ensure proper lead management.

### 3.2 Features Implemented

#### 3.2.1 Header Section
- **Title**: "ACTIVITY LOG"
- **Subtitle**: Agent name
- **Back Navigation**: Returns to Agent Details

#### 3.2.2 Dual Filter System

**Date Range Filter:**
- Last 7 Days
- Last 30 Days
- Last 90 Days
- All Time

**Activity Type Filter:**
- All (shows all activities)
- Calls (includes calls and follow-ups)
- Emails (email communications)
- Visits (site visits and property visits)
- Deals (closed deals and lost leads)
- Documents (submitted documentation)

#### 3.2.3 Summary Statistics Bar
Quick metrics across the top:
- Total Activities
- Number of Calls
- Number of Visits
- Number of Closed Deals

#### 3.2.4 Activity Timeline

Each activity entry includes:

**Visual Elements:**
- Color-coded icon in circular background
- Activity type indicator
- Timestamp (relative and absolute)

**Activity Details:**
- Activity title
- Detailed description
- Client name
- Property name
- Timestamp in both relative ("2 hours ago") and absolute formats

**Client & Property Information:**
- Highlighted section showing:
  - Client name
  - Associated property

**Activity-Specific Details:**
Various details based on activity type:

**Lead Created:**
- Lead value
- Source of lead
- Priority level

**Client Call:**
- Call duration
- Call outcome
- Next action item

**Site Visit:**
- Visit duration
- Client feedback
- Next action item

**Email Sent:**
- Email subject
- Number of attachments
- Whether email was opened

**Deal Closed:**
- Deal value
- Commission earned
- Payment status

**Client Meeting:**
- Meeting location
- Duration
- Meeting outcome

**Follow-up Call:**
- Call duration
- Outcome
- Next action

**Document Submitted:**
- Document type
- Current status
- Token amount (if applicable)

**Lead Lost:**
- Reason for loss
- Follow-up date
- Notes for future reference

**Property Visit Scheduled:**
- Visit date and time
- Property type
- Client requirements

#### 3.2.5 Activity Type Icons
- **Lead Created**: User icon (blue)
- **Client Call**: Phone icon (green)
- **Site Visit**: Map pin icon (purple)
- **Email**: Mail icon (yellow)
- **Deal Closed**: Check circle icon (green)
- **Meeting**: Users icon (blue)
- **Follow-up**: Phone icon (green)
- **Document**: File text icon (purple)
- **Lead Lost**: X circle icon (red)
- **Visit Scheduled**: Calendar icon (blue)

#### 3.2.6 Empty State
When no activities match filters:
- Alert circle icon
- "No activities found" message
- Clear, centered display

---

## 4. Navigation Flow

### 4.1 Route Structure
```
/manager/agents
├── /manager/agents/:agentId (Agent Details)
└── /manager/agents/:agentId/activity (Activity Log)
```

### 4.2 Navigation Paths

**From Agent Monitoring Dashboard:**
- Click "View Details" → Navigate to Agent Details
- Click "Activity Log" → Navigate to Activity Log

**From Agent Details:**
- Click "View Activity Log" → Navigate to Activity Log
- Click back arrow → Return to Agent Monitoring Dashboard

**From Activity Log:**
- Click back arrow → Return to Agent Details

### 4.3 Bottom Navigation
All three screens include Manager Bottom Navigation with access to:
- Dashboard
- Agents (current section)
- Leads
- Analytics
- Profile

---

## 5. Design System

### 5.1 Color Palette

**Primary Colors:**
- Primary-600: Main brand color
- Accent-gold: Highlight color for gradients

**Status Colors:**
- Green: Excellent performance, successful actions
- Blue: Good performance, neutral information
- Yellow: Average performance, warnings
- Red: Needs attention, errors
- Purple: Special actions, visits

**Neutral Colors:**
- Neutral-50: Background
- Neutral-100: Cards, borders
- Neutral-500: Secondary text
- Neutral-600: Primary text
- Neutral-800: Headings

### 5.2 Typography
- **Font Family**: Montserrat
- **Headings**: Bold, uppercase with tracking
- **Body Text**: Regular weight
- **Numbers**: Bold for emphasis

### 5.3 Spacing
- Consistent padding: 4px base unit
- Card spacing: 16px (px-4 py-4)
- Grid gaps: 12px-16px

### 5.4 Component Patterns

**Cards:**
- White background
- Rounded corners (rounded-xl)
- Subtle shadow (shadow-sm)
- Border (border-neutral-100)

**Buttons:**
- Primary: bg-primary-600, white text
- Secondary: bg-neutral-100, neutral-700 text
- Rounded (rounded-lg)
- Flex layout with icons

**Badges:**
- Rounded full (pill shape)
- Colored background matching status
- Border for definition
- Small text (text-xs)

---

## 6. Data Structure

### 6.1 Agent Object
```typescript
{
  id: string
  name: string
  email: string
  phone: string
  region: string
  status: 'excellent' | 'good' | 'average' | 'needs_attention'
  joinedDate: string
  totalLeads: number
  activeLeads: number
  visits: number
  bookings: number
  closed: number
  conversion: number
  avgResponseTime: number
  lastActivity: string
  monthlyTarget: number
  achievedThisMonth: number
}
```

### 6.2 Activity Object
```typescript
{
  id: string
  type: 'lead_created' | 'call' | 'site_visit' | 'email' |
        'deal_closed' | 'meeting' | 'follow_up' | 'document' |
        'lead_lost' | 'property_visit'
  title: string
  description: string
  client: string
  property: string
  timestamp: string
  date: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
  details: Record<string, string>
}
```

### 6.3 Performance Metric Object
```typescript
{
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  color: string
}
```

---

## 7. User Experience Features

### 7.1 Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Scrollable filter sections
- Touch-friendly button sizes

### 7.2 Visual Feedback
- Hover states on all interactive elements
- Active states for selected filters
- Color-coded status indicators
- Trend arrows for performance changes
- Progress bars for target tracking

### 7.3 Information Hierarchy
- Clear section headings with uppercase styling
- Consistent use of icons for quick recognition
- Grouped related information
- Prominent display of key metrics

### 7.4 Performance Indicators
- Conversion rates color-coded by threshold:
  - Green: ≥15%
  - Yellow: 10-14%
  - Red: <10%
- Response time color-coded by threshold:
  - Green: ≤3 hours
  - Yellow: 3-6 hours
  - Red: >6 hours

---

## 8. Future Enhancements

### 8.1 Potential Features
- Export activity logs to PDF/CSV
- Direct messaging integration
- Performance comparison charts
- Goal setting and tracking
- Automated performance alerts
- Custom date range selection
- Activity filtering by client or property
- Bulk actions on multiple agents
- Performance trend graphs
- Integration with CRM system

### 8.2 Database Integration
When implementing backend:
- Store agent data in `agents` table
- Store activities in `agent_activities` table
- Track performance metrics in `agent_metrics` table
- Implement real-time activity updates
- Add user authentication and role-based access
- Implement data persistence for filters

---

## 9. Technical Implementation

### 9.1 Components Created
- `ManagerAgents.tsx` - Main monitoring dashboard
- `ManagerAgentDetails.tsx` - Individual agent details
- `ManagerAgentActivity.tsx` - Activity timeline

### 9.2 Dependencies
- React 18.3.1
- React Router DOM 7.8.2
- Lucide React 0.344.0 (for icons)
- Tailwind CSS 3.4.1 (for styling)

### 9.3 Routing Configuration
Routes added to `App.tsx`:
- `/manager/agents` - Agent list
- `/manager/agents/:agentId` - Agent details
- `/manager/agents/:agentId/activity` - Activity log

---

## 10. Success Metrics

### 10.1 Manager Efficiency
- Reduce time to identify underperforming agents
- Enable data-driven coaching decisions
- Track team performance trends
- Monitor individual agent productivity

### 10.2 System Usability
- Intuitive navigation between views
- Quick access to critical information
- Minimal clicks to access detailed data
- Clear visual hierarchy

### 10.3 Data Visibility
- Comprehensive activity tracking
- Real-time performance metrics
- Historical trend analysis
- Detailed lead progression tracking

---

## Document Version
- **Version**: 1.0
- **Date**: March 16, 2026
- **Author**: System Implementation Team
- **Status**: Implemented and Deployed
