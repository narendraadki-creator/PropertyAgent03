# Real Estate CRM - Lead Management System Documentation

## Table of Contents
1. [Overview](#1-overview)
2. [Agent Leads Module](#2-agent-leads-module-detailed)
3. [Agent Manager Leads Module](#3-agent-manager-leads-module-detailed)
4. [Lead Flow](#4-lead-flow-end-to-end)
5. [Lead Assignment Logic](#5-lead-assignment-logic)
6. [Lead Status System](#6-lead-status-system)
7. [Smart Lead Features](#7-smart-lead-features)
8. [Communication Features](#8-communication-features)
9. [Activity Tracking](#9-activity-tracking)
10. [Analytics & Performance](#10-analytics-performance)
11. [Data Model](#11-data-model-database-design)
12. [System Architecture](#12-system-architecture)
13. [Flow Diagram](#13-flow-diagram-text-format)
14. [Advanced Features](#14-advanced-features)

---

## 1. OVERVIEW

### What are Leads in a Real Estate System?

A **Lead** is a potential customer who has shown interest in buying, renting, or investing in real estate properties. Leads are the lifeblood of real estate business - they represent opportunities that need to be nurtured and converted into actual sales.

**Lead Information Includes:**
- Personal details (Name, Email, Phone)
- Requirements (Budget, Location, Property Type)
- Source (How they found you - Campaign, Website, Referral)
- Intent level (How serious they are about buying)
- Engagement history (Calls, messages, visits)

### Difference Between Agent Leads and Manager Leads

#### Agent Leads
**Who:** Individual sales agents who work directly with customers

**What they see:**
- Only leads assigned to them personally
- Leads they need to follow up with
- Their own performance metrics

**What they can do:**
- Contact leads (call, WhatsApp, email)
- Update lead status
- Schedule property viewings
- Add notes and activities
- Track their own conversions

**Purpose:** Focus on converting their assigned leads into sales

**Example:**
```
Agent: Sarah Johnson
Her Leads Dashboard shows:
- 23 active leads assigned to her
- 5 hot leads requiring immediate attention
- 12 follow-ups pending
- Her conversion rate: 18%
```

#### Agent Manager Leads (Manager Dashboard)
**Who:** Team managers who oversee multiple agents

**What they see:**
- ALL leads in the system (entire team)
- All agents' performance
- Lead distribution across team
- Team-wide analytics

**What they can do:**
- View all leads (global access)
- Assign/reassign leads to agents
- Monitor team performance
- Identify bottlenecks
- Optimize lead distribution
- Set targets and track progress

**Purpose:** Ensure efficient lead management across the entire team and maximize conversions

**Example:**
```
Manager: Ahmed Hassan
His Dashboard shows:
- 156 total leads across 8 agents
- Agent Sarah: 23 leads (18% conversion)
- Agent Mohammed: 19 leads (22% conversion)
- 12 unassigned leads
- Average team response time: 45 minutes
```

### Key Differences

| Aspect | Agent Leads | Manager Leads |
|--------|-------------|---------------|
| **Access** | Only their assigned leads | All leads in system |
| **Assignment** | Cannot assign leads | Can assign/reassign leads |
| **View** | Personal performance | Team performance |
| **Focus** | Convert individual leads | Optimize team efficiency |
| **Actions** | Contact, update status | Monitor, assign, analyze |
| **Goals** | Close deals | Maximize team conversions |

---

## 2. AGENT LEADS MODULE (DETAILED)

### View Assigned Leads

**Dashboard Overview:**

Agents see a personalized dashboard showing only leads assigned to them.

```
MY LEADS DASHBOARD

Quick Stats:
├─ Total Leads: 23
├─ New Leads: 5
├─ In Progress: 12
├─ Viewing Scheduled: 4
└─ Closed This Month: 6

Priority Alerts:
🔴 3 Hot Leads (Contact within 1 hour)
🟠 8 Warm Leads (Follow up today)
🔵 12 Cold Leads (Long-term nurture)

Recent Activity:
├─ Mohammed Ahmed replied 2 min ago
├─ Sarah Wilson viewing scheduled tomorrow
└─ Ali Hassan requested callback
```

**Leads List View:**

```javascript
// Agent Leads Query
async function getAgentLeads(agentId) {
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      property:properties(*),
      campaign:campaigns(*),
      activities:lead_activities(*)
    `)
    .eq('assigned_agent_id', agentId)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  return leads;
}
```

**Display Format:**

```
┌──────────────────────────────────────────────────────────────┐
│ 🔴 MOHAMMED AHMED                          2 minutes ago     │
├──────────────────────────────────────────────────────────────┤
│ 📱 +971 50 123 4567  |  📧 mohammed@email.com               │
│ 💰 Budget: AED 1.5M - 2M  |  📍 Dubai Marina                 │
│ 🏠 Looking for: 2BR Apartment                                │
│ 📊 Status: Interested  |  🔥 Priority: HOT                   │
│                                                               │
│ Last Activity: Replied to WhatsApp                           │
│ "Yes, I'm very interested. Can we schedule viewing?"         │
│                                                               │
│ [📞 Call] [💬 WhatsApp] [📧 Email] [🏢 Schedule Visit]      │
│ [View Details] →                                             │
└──────────────────────────────────────────────────────────────┘
```

### Lead Details Page

When agent clicks on a lead, they see comprehensive information:

**Section 1: Lead Profile**
```
┌─────────────────────────────────────────────┐
│ LEAD PROFILE                                 │
├─────────────────────────────────────────────┤
│ Name: Mohammed Ahmed                         │
│ Email: mohammed@email.com                    │
│ Phone: +971 50 123 4567                      │
│ WhatsApp: +971 50 123 4567                   │
│                                              │
│ Source: Facebook Campaign                    │
│ Campaign: Summer Sale 2026                   │
│ First Contact: 2 days ago                    │
│ Last Activity: 5 minutes ago                 │
└─────────────────────────────────────────────┘
```

**Section 2: Requirements**
```
┌─────────────────────────────────────────────┐
│ REQUIREMENTS                                 │
├─────────────────────────────────────────────┤
│ Budget Range: AED 1.5M - 2M                  │
│ Preferred Location: Dubai Marina             │
│ Property Type: Apartment                     │
│ Bedrooms: 2-3 BR                             │
│ Move-in Timeline: 1-3 months                 │
│ Financing: Bank mortgage needed              │
│                                              │
│ Additional Notes:                            │
│ "Looking for sea view, parking essential"   │
└─────────────────────────────────────────────┘
```

**Section 3: Lead Score & Priority**
```
┌─────────────────────────────────────────────┐
│ LEAD INTELLIGENCE                            │
├─────────────────────────────────────────────┤
│ Priority: 🔴 HOT                            │
│ Score: 85/100                                │
│                                              │
│ Score Breakdown:                             │
│ ✓ Budget matches properties (20 pts)        │
│ ✓ Quick response time (15 pts)              │
│ ✓ Requested viewing (25 pts)                │
│ ✓ Engagement score high (15 pts)            │
│ ✓ Timeline urgent (10 pts)                  │
│                                              │
│ Recommendation:                              │
│ 🎯 Contact within 1 hour for best results   │
└─────────────────────────────────────────────┘
```

**Section 4: Activity Timeline**
```
┌─────────────────────────────────────────────┐
│ ACTIVITY TIMELINE                            │
├─────────────────────────────────────────────┤
│ 🕐 5 minutes ago                             │
│ 💬 Lead replied via WhatsApp                │
│ "Yes, I'm very interested. Can we schedule  │
│  viewing?"                                   │
│                                              │
│ 🕐 2 hours ago                               │
│ 📤 You sent WhatsApp follow-up              │
│ "Hi Mohammed, following up on the Marina    │
│  property..."                                │
│                                              │
│ 🕐 Yesterday at 3:45 PM                     │
│ 📞 You called (Duration: 8 min)             │
│ Note: "Discussed budget and requirements.   │
│        Very interested in sea view units"    │
│                                              │
│ 🕐 2 days ago                                │
│ 🎯 Lead created from Campaign               │
│ Source: Facebook - Summer Sale               │
└─────────────────────────────────────────────┘
```

### Lead Status Management

**Available Statuses:**

```javascript
const leadStatuses = {
  NEW: {
    label: 'New',
    color: 'blue',
    icon: '🆕',
    description: 'Lead just arrived, no contact yet',
    sla: 'Contact within 1 hour',
    nextActions: ['Call', 'WhatsApp', 'Email']
  },

  CONTACTED: {
    label: 'Contacted',
    color: 'yellow',
    icon: '📞',
    description: 'Initial contact made',
    sla: 'Follow up within 24 hours',
    nextActions: ['Schedule viewing', 'Send details', 'Follow up']
  },

  INTERESTED: {
    label: 'Interested',
    color: 'green',
    icon: '✅',
    description: 'Lead showed positive interest',
    sla: 'Schedule viewing within 48 hours',
    nextActions: ['Schedule viewing', 'Send options', 'Arrange bank meeting']
  },

  VIEWING_SCHEDULED: {
    label: 'Viewing Scheduled',
    color: 'purple',
    icon: '📅',
    description: 'Property viewing arranged',
    sla: 'Confirm 24h before viewing',
    nextActions: ['Confirm viewing', 'Send directions', 'Prepare documents']
  },

  NEGOTIATING: {
    label: 'Negotiating',
    color: 'orange',
    icon: '💼',
    description: 'In price/terms negotiation',
    sla: 'Respond to offers within 4 hours',
    nextActions: ['Counter offer', 'Discuss terms', 'Arrange closing']
  },

  NOT_INTERESTED: {
    label: 'Not Interested',
    color: 'red',
    icon: '❌',
    description: 'Lead declined or not qualified',
    sla: 'Add to nurture list',
    nextActions: ['Add notes', 'Set reminder for future', 'Mark reason']
  },

  CLOSED_WON: {
    label: 'Closed - Won',
    color: 'green',
    icon: '🎉',
    description: 'Deal successfully closed',
    sla: 'Complete post-sale tasks',
    nextActions: ['Process paperwork', 'Request referral', 'Ask for review']
  },

  CLOSED_LOST: {
    label: 'Closed - Lost',
    color: 'gray',
    icon: '📊',
    description: 'Lead went with competitor or postponed',
    sla: 'Document reason for loss',
    nextActions: ['Add loss reason', 'Schedule follow-up in 6 months']
  }
};
```

**Status Update Flow:**

```javascript
async function updateLeadStatus(leadId, newStatus, agentId, notes) {
  // 1. Update lead status
  const { data: lead } = await supabase
    .from('leads')
    .update({
      status: newStatus,
      updated_at: new Date()
    })
    .eq('id', leadId)
    .select()
    .single();

  // 2. Log status change in history
  await supabase.from('lead_status_history').insert({
    lead_id: leadId,
    old_status: lead.previous_status,
    new_status: newStatus,
    changed_by: agentId,
    notes: notes,
    changed_at: new Date()
  });

  // 3. Create activity record
  await supabase.from('lead_activities').insert({
    lead_id: leadId,
    agent_id: agentId,
    activity_type: 'status_change',
    description: `Status changed from ${lead.previous_status} to ${newStatus}`,
    notes: notes,
    created_at: new Date()
  });

  // 4. Trigger automation based on new status
  await triggerStatusAutomation(leadId, newStatus);

  // 5. Update agent metrics
  await updateAgentMetrics(agentId);

  return lead;
}
```

### Lead Actions

#### 1. Call Action

```javascript
async function initiateCall(lead, agent) {
  // Log call initiation
  const callRecord = await supabase.from('lead_activities').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    activity_type: 'call_initiated',
    description: `Call initiated to ${lead.phone}`,
    created_at: new Date()
  });

  // Open phone dialer
  window.location.href = `tel:${lead.phone}`;

  // Show call tracking modal
  showCallTrackingModal({
    leadId: lead.id,
    leadName: lead.first_name,
    phone: lead.phone,
    onCallEnd: async (duration, outcome, notes) => {
      // Update call record with results
      await supabase.from('lead_activities').insert({
        lead_id: lead.id,
        agent_id: agent.id,
        activity_type: 'call_completed',
        description: `Call completed - ${outcome}`,
        duration: duration,
        notes: notes,
        created_at: new Date()
      });

      // Update lead based on outcome
      if (outcome === 'interested') {
        await updateLeadStatus(lead.id, 'INTERESTED', agent.id, notes);
      }
    }
  });
}
```

**Call Tracking Modal:**
```
┌─────────────────────────────────────────────┐
│ CALL WITH MOHAMMED AHMED                     │
├─────────────────────────────────────────────┤
│ Duration: 00:05:23                           │
│                                              │
│ Call Outcome:                                │
│ ( ) Answered - Interested                   │
│ ( ) Answered - Not Interested               │
│ ( ) Answered - Callback Later               │
│ ( ) No Answer                                │
│ ( ) Wrong Number                             │
│                                              │
│ Notes:                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ Discussed budget and timeline.          │ │
│ │ Very interested in sea view units.      │ │
│ │ Wants viewing this weekend.             │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Next Action:                                 │
│ [Schedule Viewing] [Send Details] [Set     │
│  Reminder]                                   │
│                                              │
│ [Save] [Cancel]                              │
└─────────────────────────────────────────────┘
```

#### 2. WhatsApp Action

```javascript
async function sendWhatsAppMessage(lead, agent, message) {
  // 1. Log activity
  await supabase.from('lead_activities').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    activity_type: 'whatsapp_sent',
    description: 'WhatsApp message sent',
    message_content: message,
    created_at: new Date()
  });

  // 2. Send via WhatsApp Business API
  const response = await fetch(
    `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: lead.phone,
        type: 'text',
        text: { body: message }
      })
    }
  );

  // 3. Update last contacted timestamp
  await supabase.from('leads').update({
    last_contacted_at: new Date(),
    last_contact_method: 'whatsapp'
  }).eq('id', lead.id);

  // 4. Update agent activity metrics
  await supabase.rpc('increment_agent_whatsapp_count', {
    agent_id: agent.id
  });

  return response.json();
}
```

**WhatsApp Quick Templates:**
```
┌─────────────────────────────────────────────┐
│ SEND WHATSAPP TO MOHAMMED AHMED              │
├─────────────────────────────────────────────┤
│ Quick Templates:                             │
│                                              │
│ [Introduction]                               │
│ "Hi Mohammed! I'm Sarah from Prime Realty.  │
│  Thank you for your interest in..."          │
│                                              │
│ [Follow-up]                                  │
│ "Hi Mohammed, following up on our           │
│  conversation about the Marina property..."  │
│                                              │
│ [Property Details]                           │
│ "Hi Mohammed! Here are the details of the   │
│  2BR apartment we discussed:                 │
│  📍 Location: Dubai Marina                   │
│  💰 Price: AED 1.8M..."                      │
│                                              │
│ [Viewing Reminder]                           │
│ "Hi Mohammed! Reminder: Your viewing is     │
│  scheduled for tomorrow at 3 PM..."          │
│                                              │
│ Custom Message:                              │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Add: [Property Link] [Brochure] [Location] │
│                                              │
│ [Send] [Save as Template]                    │
└─────────────────────────────────────────────┘
```

#### 3. Email Action

```javascript
async function sendEmail(lead, agent, emailData) {
  // Prepare email
  const email = {
    to: lead.email,
    from: agent.email,
    subject: emailData.subject,
    html: emailData.html,
    attachments: emailData.attachments
  };

  // Send via SendGrid
  await sendgrid.send(email);

  // Log activity
  await supabase.from('lead_activities').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    activity_type: 'email_sent',
    description: `Email sent: ${emailData.subject}`,
    email_subject: emailData.subject,
    created_at: new Date()
  });

  // Update lead
  await supabase.from('leads').update({
    last_contacted_at: new Date(),
    last_contact_method: 'email'
  }).eq('id', lead.id);
}
```

#### 4. Schedule Visit

```javascript
async function schedulePropertyViewing(lead, agent, viewingData) {
  // Create viewing appointment
  const { data: viewing } = await supabase
    .from('property_viewings')
    .insert({
      lead_id: lead.id,
      agent_id: agent.id,
      property_id: viewingData.propertyId,
      scheduled_date: viewingData.date,
      scheduled_time: viewingData.time,
      duration: 30, // minutes
      status: 'scheduled',
      notes: viewingData.notes,
      created_at: new Date()
    })
    .select()
    .single();

  // Update lead status
  await updateLeadStatus(lead.id, 'VIEWING_SCHEDULED', agent.id,
    `Viewing scheduled for ${viewingData.date} at ${viewingData.time}`
  );

  // Send confirmation to lead
  await sendWhatsAppMessage(lead, agent, `
Hi ${lead.first_name}! 👋

Your property viewing is confirmed:

📅 Date: ${formatDate(viewingData.date)}
🕐 Time: ${viewingData.time}
📍 Location: ${viewingData.propertyAddress}

I'll meet you at the property entrance. Please let me know if you need directions or have any questions.

See you soon!
${agent.first_name}
  `);

  // Create calendar reminder for agent
  await createAgentReminder(agent.id, {
    type: 'viewing',
    title: `Property viewing with ${lead.first_name}`,
    datetime: `${viewingData.date} ${viewingData.time}`,
    lead_id: lead.id,
    viewing_id: viewing.id
  });

  // Send reminder 24h before viewing
  await scheduleReminderNotification(viewing.id, {
    time: '24h_before',
    recipient: lead.phone,
    message: `Reminder: Your property viewing is tomorrow at ${viewingData.time}`
  });

  return viewing;
}
```

**Schedule Visit Form:**
```
┌─────────────────────────────────────────────┐
│ SCHEDULE VIEWING FOR MOHAMMED AHMED          │
├─────────────────────────────────────────────┤
│ Select Property:                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🏢 Marina Heights Tower - 2BR           │ │
│ │ AED 1.8M | Dubai Marina                 │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Date:                                        │
│ [📅 Select Date] → Tomorrow, March 27       │
│                                              │
│ Time Slots Available:                        │
│ ( ) 10:00 AM                                │
│ (•) 3:00 PM                                 │
│ ( ) 5:00 PM                                 │
│                                              │
│ Duration: [30 minutes ▼]                    │
│                                              │
│ Meeting Point:                               │
│ ( ) Property entrance                        │
│ ( ) Office                                   │
│ ( ) Custom location                          │
│                                              │
│ Notes:                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ Lead specifically interested in sea     │ │
│ │ view units and parking space.           │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ ☑ Send confirmation to lead                 │
│ ☑ Add to my calendar                        │
│ ☑ Send reminder 24h before                  │
│                                              │
│ [Schedule Viewing] [Cancel]                  │
└─────────────────────────────────────────────┘
```

### Notes and Activity Tracking

**Add Note Feature:**

```javascript
async function addLeadNote(lead, agent, noteData) {
  const note = await supabase.from('lead_notes').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    note_type: noteData.type, // 'general', 'call_summary', 'meeting_notes'
    content: noteData.content,
    is_important: noteData.important || false,
    created_at: new Date()
  }).select().single();

  // Create activity entry
  await supabase.from('lead_activities').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    activity_type: 'note_added',
    description: `Note added: ${noteData.content.substring(0, 50)}...`,
    created_at: new Date()
  });

  return note;
}
```

**Notes Display:**
```
┌─────────────────────────────────────────────┐
│ NOTES & COMMENTS                             │
├─────────────────────────────────────────────┤
│                                              │
│ Add New Note:                                │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│ Type: [General ▼]  ☑ Mark as important    │
│ [Add Note]                                   │
│                                              │
│ ─────────────────────────────────────────── │
│                                              │
│ ⭐ Important Note - Sarah J. - 2 hours ago  │
│ "Client has mortgage pre-approval for       │
│  AED 2M. Very serious buyer. Wants quick    │
│  closing - willing to pay 5% above asking   │
│  for right property."                        │
│                                              │
│ 📝 Call Summary - Sarah J. - Yesterday      │
│ "Discussed 3 properties in Marina. Client   │
│  prefers higher floors (15+) with parking.  │
│  Budget flexible up to 2M if right fit."    │
│                                              │
│ 📝 General - Sarah J. - 3 days ago          │
│ "First contact made. Client very polite     │
│  and responsive. Referred by Ahmed Khan."   │
│                                              │
└─────────────────────────────────────────────┘
```

### Follow-up Reminders

**Reminder System:**

```javascript
async function createFollowUpReminder(lead, agent, reminderData) {
  const reminder = await supabase.from('lead_reminders').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    reminder_type: reminderData.type, // 'call', 'email', 'visit', 'custom'
    reminder_datetime: reminderData.datetime,
    message: reminderData.message,
    priority: reminderData.priority, // 'high', 'medium', 'low'
    status: 'pending',
    created_at: new Date()
  }).select().single();

  // Schedule notification
  await scheduleNotification({
    time: reminderData.datetime,
    recipient: agent.id,
    type: 'reminder',
    message: `Reminder: ${reminderData.message}`,
    action_url: `/leads/${lead.id}`
  });

  return reminder;
}

// Check and send due reminders (runs every 5 minutes)
async function processDueReminders() {
  const { data: reminders } = await supabase
    .from('lead_reminders')
    .select('*, lead:leads(*), agent:users(*)')
    .eq('status', 'pending')
    .lte('reminder_datetime', new Date())
    .order('priority', { ascending: false });

  for (const reminder of reminders) {
    // Send notification to agent
    await sendAgentNotification(reminder.agent.id, {
      title: `Reminder: ${reminder.reminder_type}`,
      message: reminder.message,
      lead: reminder.lead,
      action: 'view_lead',
      action_url: `/leads/${reminder.lead.id}`
    });

    // Mark as sent
    await supabase.from('lead_reminders')
      .update({ status: 'sent', sent_at: new Date() })
      .eq('id', reminder.id);
  }
}
```

**Reminders Dashboard:**
```
┌─────────────────────────────────────────────┐
│ MY REMINDERS                                 │
├─────────────────────────────────────────────┤
│ Today                                        │
│ ├─ 🔴 3:00 PM - Call Mohammed Ahmed         │
│ │   Follow up on viewing feedback           │
│ │   [Snooze] [Complete] [View Lead]         │
│ │                                            │
│ ├─ 🟠 5:00 PM - Email Sarah Wilson          │
│ │   Send payment plan options               │
│ │   [Snooze] [Complete] [View Lead]         │
│                                              │
│ Tomorrow                                     │
│ ├─ 10:00 AM - Property viewing with Ali     │
│ │   Marina Heights Tower                     │
│ │   [Reschedule] [Cancel] [View Lead]       │
│                                              │
│ This Week                                    │
│ ├─ Thu 2:00 PM - Follow up with Emma        │
│ ├─ Fri 11:00 AM - Send docs to Ahmed        │
│ └─ Sat 4:00 PM - Check-in with John         │
│                                              │
│ [Add Reminder]                               │
└─────────────────────────────────────────────┘
```

---

## 3. AGENT MANAGER LEADS MODULE (DETAILED)

### View All Leads (Global Access)

Manager sees ALL leads across all agents in the team.

**Manager Dashboard Overview:**

```
MANAGER DASHBOARD - LEADS OVERVIEW

Team Performance:
├─ Total Active Leads: 156
├─ New Leads (24h): 23
├─ Viewings Scheduled: 18
├─ Deals in Negotiation: 12
└─ Closed This Month: 34

Distribution:
├─ Assigned: 144 leads
├─ Unassigned: 12 leads ⚠️
└─ Overdue Follow-ups: 8 leads ⚠️

Team Stats:
├─ Average Response Time: 45 minutes
├─ Team Conversion Rate: 19.5%
└─ Average Deal Value: AED 1.8M

Alerts:
🔴 8 leads overdue for follow-up
🟠 12 unassigned leads
🟡 3 agents below target performance
```

**All Leads View:**

```javascript
async function getManagerAllLeads(managerId, filters) {
  // Get all leads for manager's team
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      assigned_agent:users!assigned_agent_id(*),
      property:properties(*),
      campaign:campaigns(*),
      activities:lead_activities(count)
    `)
    .eq('team_id', managerId) // Manager's team
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (filters.agent_id) {
    leads = leads.filter(l => l.assigned_agent_id === filters.agent_id);
  }
  if (filters.status) {
    leads = leads.filter(l => l.status === filters.status);
  }
  if (filters.source) {
    leads = leads.filter(l => l.source === filters.source);
  }
  if (filters.date_from && filters.date_to) {
    leads = leads.filter(l =>
      new Date(l.created_at) >= filters.date_from &&
      new Date(l.created_at) <= filters.date_to
    );
  }

  return leads;
}
```

### Filter Leads

**Advanced Filtering Interface:**

```
┌─────────────────────────────────────────────────────────────┐
│ FILTER LEADS                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Agent:                                                       │
│ [All Agents ▼]                                              │
│   - All Agents (156)                                         │
│   - Sarah Johnson (23)                                       │
│   - Mohammed Ali (19)                                        │
│   - Ahmed Hassan (21)                                        │
│   - Fatima Khan (18)                                         │
│   - Unassigned (12)                                          │
│                                                              │
│ Status:                                                      │
│ [All Statuses ▼]                                            │
│   - All Statuses                                             │
│   - New (45)                                                 │
│   - Contacted (38)                                           │
│   - Interested (29)                                          │
│   - Viewing Scheduled (18)                                   │
│   - Negotiating (12)                                         │
│   - Not Interested (8)                                       │
│                                                              │
│ Source:                                                      │
│ [All Sources ▼]                                             │
│   - All Sources                                              │
│   - Facebook Campaign (67)                                   │
│   - Instagram (34)                                           │
│   - Google Ads (28)                                          │
│   - Website Form (18)                                        │
│   - WhatsApp (9)                                             │
│                                                              │
│ Priority:                                                    │
│ [ ] Hot  [ ] Warm  [ ] Cold                                 │
│                                                              │
│ Date Range:                                                  │
│ From: [📅 Select Date]  To: [📅 Select Date]               │
│ Quick: [Today] [This Week] [This Month] [All Time]         │
│                                                              │
│ Budget Range:                                                │
│ Min: [500K ▼]  Max: [5M ▼]                                 │
│                                                              │
│ [Apply Filters] [Reset] [Save as Preset]                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Filtered Results View:**

```
Showing 23 leads (Filtered: Agent: Sarah Johnson, Status: All)

┌──────────────────────────────────────────────────────────────┐
│ 🔴 MOHAMMED AHMED                   Agent: Sarah J.  2d ago  │
├──────────────────────────────────────────────────────────────┤
│ Status: Interested  |  Budget: 1.5M-2M  |  Source: Facebook │
│ Last Contact: 2 hours ago  |  Next Action: Schedule viewing │
│ [View] [Reassign]                                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 🟠 FATIMA ABDULLAH                  Agent: Sarah J.  3d ago  │
├──────────────────────────────────────────────────────────────┤
│ Status: Contacted  |  Budget: 1M-1.5M  |  Source: Instagram │
│ Last Contact: Yesterday  |  Next Action: Follow up          │
│ [View] [Reassign]                                            │
└──────────────────────────────────────────────────────────────┘

[Load More...]
```

### Assign Leads to Agents

**Manual Assignment:**

```javascript
async function assignLeadToAgent(leadId, agentId, managerId, reason) {
  // Update lead assignment
  const { data: lead } = await supabase
    .from('leads')
    .update({
      assigned_agent_id: agentId,
      assigned_at: new Date(),
      assigned_by: managerId
    })
    .eq('id', leadId)
    .select()
    .single();

  // Log assignment
  await supabase.from('lead_assignments').insert({
    lead_id: leadId,
    agent_id: agentId,
    assigned_by: managerId,
    assignment_reason: reason,
    assigned_at: new Date()
  });

  // Create activity
  await supabase.from('lead_activities').insert({
    lead_id: leadId,
    agent_id: agentId,
    activity_type: 'assigned',
    description: `Lead assigned by manager`,
    created_at: new Date()
  });

  // Notify agent
  await sendAgentNotification(agentId, {
    title: 'New Lead Assigned',
    message: `${lead.first_name} ${lead.last_name} has been assigned to you`,
    action_url: `/leads/${leadId}`
  });

  // Update agent metrics
  await supabase.rpc('increment_agent_lead_count', { agent_id: agentId });

  return lead;
}
```

**Assignment Interface:**

```
┌─────────────────────────────────────────────┐
│ ASSIGN LEAD                                  │
├─────────────────────────────────────────────┤
│ Lead: Mohammed Ahmed                         │
│ Budget: AED 1.5M - 2M                        │
│ Location: Dubai Marina                       │
│                                              │
│ Select Agent:                                │
│ ┌─────────────────────────────────────────┐ │
│ │ (•) Sarah Johnson                       │ │
│ │     Current Leads: 23                   │ │
│ │     Conversion Rate: 18%                │ │
│ │     Avg Response: 32 min                │ │
│ │     Specialization: Marina area         │ │
│ │                                         │ │
│ │ ( ) Mohammed Ali                        │ │
│ │     Current Leads: 19                   │ │
│ │     Conversion Rate: 22%                │ │
│ │     Avg Response: 28 min                │ │
│ │     Specialization: Luxury properties   │ │
│ │                                         │ │
│ │ ( ) Ahmed Hassan                        │ │
│ │     Current Leads: 21                   │ │
│ │     Conversion Rate: 16%                │ │
│ │     Avg Response: 45 min                │ │
│ │     Specialization: Investment props    │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Assignment Reason:                           │
│ ( ) Round robin                              │
│ ( ) Location expertise                       │
│ (•) Best conversion rate                    │
│ ( ) Agent availability                       │
│ ( ) Custom                                   │
│                                              │
│ Notes:                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ High-value lead, prioritize             │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ ☑ Notify agent immediately                  │
│                                              │
│ [Assign] [Cancel]                            │
└─────────────────────────────────────────────┘
```

### Reassign Leads

**Reassignment Scenarios:**

1. Agent not responding to leads
2. Agent overloaded
3. Agent on leave
4. Better expertise match

```javascript
async function reassignLead(leadId, fromAgentId, toAgentId, managerId, reason) {
  // Get current lead data
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  // Update assignment
  await supabase.from('leads').update({
    assigned_agent_id: toAgentId,
    previous_agent_id: fromAgentId,
    reassigned_at: new Date(),
    reassigned_by: managerId,
    reassignment_reason: reason
  }).eq('id', leadId);

  // Log reassignment
  await supabase.from('lead_reassignments').insert({
    lead_id: leadId,
    from_agent_id: fromAgentId,
    to_agent_id: toAgentId,
    reassigned_by: managerId,
    reason: reason,
    reassigned_at: new Date()
  });

  // Create activity
  await supabase.from('lead_activities').insert({
    lead_id: leadId,
    activity_type: 'reassigned',
    description: `Lead reassigned from Agent ${fromAgentId} to Agent ${toAgentId}`,
    notes: reason,
    created_at: new Date()
  });

  // Notify both agents
  await sendAgentNotification(fromAgentId, {
    title: 'Lead Reassigned',
    message: `${lead.first_name} ${lead.last_name} has been reassigned to another agent`,
    reason: reason
  });

  await sendAgentNotification(toAgentId, {
    title: 'New Lead Assigned',
    message: `${lead.first_name} ${lead.last_name} has been assigned to you`,
    action_url: `/leads/${leadId}`,
    priority: 'high'
  });

  // Update metrics
  await supabase.rpc('decrement_agent_lead_count', { agent_id: fromAgentId });
  await supabase.rpc('increment_agent_lead_count', { agent_id: toAgentId });

  return lead;
}
```

### Bulk Assignment

Assign multiple leads at once:

```javascript
async function bulkAssignLeads(leadIds, assignmentRules, managerId) {
  const results = {
    success: [],
    failed: []
  };

  for (const leadId of leadIds) {
    try {
      // Get lead details
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      // Determine best agent based on rules
      let agentId;

      if (assignmentRules.method === 'round_robin') {
        agentId = await getNextRoundRobinAgent();
      } else if (assignmentRules.method === 'location_based') {
        agentId = await getAgentByLocationExpertise(lead.preferred_location);
      } else if (assignmentRules.method === 'least_loaded') {
        agentId = await getLeastLoadedAgent();
      } else if (assignmentRules.method === 'best_performer') {
        agentId = await getBestPerformingAgent();
      } else if (assignmentRules.method === 'specific_agent') {
        agentId = assignmentRules.agent_id;
      }

      // Assign lead
      await assignLeadToAgent(leadId, agentId, managerId, assignmentRules.reason);

      results.success.push({ leadId, agentId });
    } catch (error) {
      results.failed.push({ leadId, error: error.message });
    }
  }

  return results;
}
```

**Bulk Assignment Interface:**

```
┌─────────────────────────────────────────────┐
│ BULK ASSIGN LEADS                            │
├─────────────────────────────────────────────┤
│ Selected Leads: 12                           │
│                                              │
│ Assignment Method:                           │
│ ( ) Round Robin - Distribute evenly         │
│ ( ) Location Based - Match agent expertise  │
│ ( ) Least Loaded - Assign to agent with     │
│     fewest leads                             │
│ (•) Best Performer - Assign to top agents   │
│ ( ) Specific Agent - All to one agent       │
│                                              │
│ Priority:                                    │
│ ( ) Assign hot leads first                  │
│ (•) Assign oldest leads first               │
│ ( ) Random distribution                      │
│                                              │
│ ☑ Notify agents immediately                 │
│ ☑ Set follow-up reminders                   │
│                                              │
│ [Preview Assignment] [Assign All] [Cancel]  │
└─────────────────────────────────────────────┘
```

### Monitor Agent Performance

**Agent Performance Dashboard:**

```
AGENT PERFORMANCE METRICS

┌────────────────────────────────────────────────────────────────┐
│ INDIVIDUAL AGENT PERFORMANCE                                    │
├────────────────────────────────────────────────────────────────┤
│ Agent: Sarah Johnson                                            │
│                                                                 │
│ This Month:                                                     │
│ ├─ Leads Assigned: 23                                          │
│ ├─ Leads Contacted: 21 (91%)                                   │
│ ├─ Viewings Scheduled: 12                                      │
│ ├─ Deals Closed: 4                                             │
│ └─ Conversion Rate: 17.4% 📊                                   │
│                                                                 │
│ Response Metrics:                                               │
│ ├─ Avg First Response: 28 minutes ⚡                           │
│ ├─ Avg Follow-up Time: 18 hours                               │
│ └─ Contact Attempts per Lead: 3.2                              │
│                                                                 │
│ Revenue:                                                        │
│ ├─ Total Commission: AED 87,500                                │
│ ├─ Avg Deal Value: AED 1.75M                                   │
│ └─ Target Progress: 76% of monthly goal 📈                     │
│                                                                 │
│ Quality Score: 8.5/10                                           │
│ ├─ Lead satisfaction: 9/10                                     │
│ ├─ Response time: 8/10                                         │
│ └─ Conversion rate: 8/10                                       │
│                                                                 │
│ [View Detailed Report] [Set Target] [Send Feedback]            │
└────────────────────────────────────────────────────────────────┘
```

**Team Comparison:**

```javascript
async function getTeamPerformanceComparison(managerId, period) {
  const { data: agents } = await supabase
    .from('users')
    .select(`
      id,
      first_name,
      last_name,
      leads:leads(count),
      closed_leads:leads(count).eq('status', 'CLOSED_WON'),
      activities:lead_activities(count)
    `)
    .eq('role', 'agent')
    .eq('manager_id', managerId);

  // Calculate metrics for each agent
  const performance = agents.map(agent => {
    const totalLeads = agent.leads[0].count;
    const closedLeads = agent.closed_leads[0].count;
    const conversionRate = (closedLeads / totalLeads * 100).toFixed(2);

    return {
      agent_id: agent.id,
      name: `${agent.first_name} ${agent.last_name}`,
      total_leads: totalLeads,
      closed_leads: closedLeads,
      conversion_rate: conversionRate,
      activities: agent.activities[0].count,
      activity_per_lead: (agent.activities[0].count / totalLeads).toFixed(1)
    };
  });

  // Sort by conversion rate
  performance.sort((a, b) => b.conversion_rate - a.conversion_rate);

  return performance;
}
```

**Team Performance Table:**

```
TEAM PERFORMANCE COMPARISON (This Month)

┌─────────────────┬───────┬────────┬──────────┬────────────┐
│ Agent           │ Leads │ Closed │ Conv. %  │ Avg Resp   │
├─────────────────┼───────┼────────┼──────────┼────────────┤
│ Mohammed Ali    │  19   │   5    │  26.3%   │ 22 min 🌟 │
│ Sarah Johnson   │  23   │   4    │  17.4%   │ 28 min     │
│ Ahmed Hassan    │  21   │   3    │  14.3%   │ 42 min     │
│ Fatima Khan     │  18   │   2    │  11.1%   │ 38 min     │
│ Ali Abdullah    │  16   │   2    │  12.5%   │ 51 min ⚠️  │
├─────────────────┼───────┼────────┼──────────┼────────────┤
│ TEAM AVERAGE    │  19.4 │   3.2  │  16.3%   │ 36 min     │
└─────────────────┴───────┴────────┴──────────┴────────────┘

Top Performer: Mohammed Ali (26.3% conversion)
Needs Attention: Ali Abdullah (slow response time)

[Export Report] [Schedule Review Meetings] [Set Team Targets]
```

---

## 4. LEAD FLOW (END-TO-END)

### Complete Lead Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 1: LEAD GENERATION                                        │
└─────────────────────────────────────────────────────────────────┘

Lead Source Options:
├─ Campaign (Facebook/Instagram/Google Ad)
├─ Website Contact Form
├─ WhatsApp Direct Message
├─ Phone Call (Tracked number)
├─ Walk-in (Property office)
└─ Referral (Existing client)

↓

Example: Lead from Facebook Campaign

User sees ad → Clicks → Lands on campaign page → Fills form:
- Name: Mohammed Ahmed
- Email: mohammed@email.com
- Phone: +971 50 123 4567
- Budget: AED 1.5M - 2M
- Looking for: 2BR in Dubai Marina

↓

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 2: LEAD CAPTURED & STORED                                │
└─────────────────────────────────────────────────────────────────┘

Lead Data Stored in Database:

INSERT INTO leads (
  first_name: 'Mohammed',
  last_name: 'Ahmed',
  email: 'mohammed@email.com',
  phone: '+971501234567',

  budget_min: 1500000,
  budget_max: 2000000,
  preferred_location: 'Dubai Marina',
  bedrooms_required: 2,

  source: 'facebook',
  campaign_id: 'cmp_123',

  status: 'NEW',
  priority: 'WARM',
  score: 65,

  created_at: NOW(),
  assigned_agent_id: NULL  // Not yet assigned
)

↓

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 3: LEAD ASSIGNMENT                                        │
└─────────────────────────────────────────────────────────────────┘

Auto Assignment Logic Triggered:

STEP 1: Check assignment rules
IF auto_assign_enabled = TRUE THEN

  STEP 2: Determine assignment method
  SWITCH assignment_method:

    CASE 'round_robin':
      agent = get_next_agent_in_rotation()

    CASE 'location_based':
      agent = get_agent_with_expertise('Dubai Marina')

    CASE 'least_loaded':
      agent = get_agent_with_fewest_leads()

    CASE 'best_performer':
      agent = get_highest_conversion_rate_agent()

  STEP 3: Assign lead
  UPDATE leads SET assigned_agent_id = agent.id WHERE id = lead.id

  STEP 4: Notify agent
  SEND notification TO agent

ELSE
  // Manual assignment by manager
  ADD lead TO unassigned_pool
  NOTIFY manager OF new_lead
END IF

Result: Lead assigned to Sarah Johnson (Location expert for Marina)

↓

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 4: LEAD APPEARS IN DASHBOARDS                            │
└─────────────────────────────────────────────────────────────────┘

Lead now visible in:

1. Agent Dashboard (Sarah's view):
   ├─ New lead notification appears
   ├─ Lead shows in "My Leads" list
   ├─ Priority: WARM (requires contact within 2 hours)
   └─ Action: Contact lead

2. Manager Dashboard:
   ├─ Lead shows in "All Leads"
   ├─ Assigned to: Sarah Johnson
   ├─ Status: NEW
   └─ Waiting for first contact

↓

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 5: AGENT ACTIONS                                         │
└─────────────────────────────────────────────────────────────────┘

Sarah's Action Timeline:

[10:30 AM] Lead assigned
  └─ Sarah receives notification

[10:35 AM] Sarah reviews lead details
  └─ Checks budget, location, requirements
  └─ Sees lead is from successful campaign

[10:40 AM] Sarah initiates WhatsApp contact
  └─ Sends: "Hi Mohammed! Thank you for your interest..."
  └─ System logs: activity_type = 'whatsapp_sent'
  └─ Lead status changes: NEW → CONTACTED

[11:15 AM] Mohammed replies
  └─ "Yes, very interested. Can we schedule viewing?"
  └─ System detects reply → Lead priority: WARM → HOT
  └─ Sarah gets immediate notification

[11:20 AM] Sarah schedules viewing
  └─ Books: Tomorrow 3 PM at Marina Heights Tower
  └─ System logs: activity_type = 'viewing_scheduled'
  └─ Lead status changes: CONTACTED → VIEWING_SCHEDULED
  └─ Confirmation sent to Mohammed
  └─ Calendar reminder created for Sarah

[Next Day 3:00 PM] Property viewing conducted
  └─ Sarah marks viewing as completed
  └─ Adds notes: "Very impressed, wants to see 2 more units"
  └─ Lead status changes: VIEWING_SCHEDULED → INTERESTED

[Next Day 4:00 PM] Sarah sends follow-up
  └─ Sends details of 2 similar properties
  └─ Mohammed responds positively

[3 Days Later] Second viewing
  └─ Mohammed loves Unit 15B
  └─ Lead status: INTERESTED → NEGOTIATING

[1 Week Later] Deal negotiations
  └─ Price agreed
  └─ Payment plan finalized
  └─ Lead status: NEGOTIATING → CLOSED_WON 🎉

↓

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 6: MANAGER MONITORING                                    │
└─────────────────────────────────────────────────────────────────┘

Throughout the journey, Manager sees:

[Real-time Updates]
├─ Lead assigned to Sarah ✓
├─ First contact made within 10 minutes ✓ (Target: < 1 hour)
├─ Lead responded positively ✓
├─ Viewing scheduled ✓
├─ Lead progressing normally ✓
└─ Deal closed ✓ (Conversion!)

[Performance Impact]
├─ Sarah's metrics updated:
│   ├─ Leads handled: +1
│   ├─ Conversion rate: 17.4% → 18.2%
│   ├─ Response time average: 28 min (maintained)
│   └─ Commission earned: +AED 22,500
│
└─ Team metrics updated:
    ├─ Total conversions this month: +1
    ├─ Team conversion rate: 16.3% → 16.8%
    └─ Revenue generated: +AED 22,500

[Manager Actions Taken]
├─ None required (lead progressing well)
├─ If slow: Would reassign or follow up with Sarah
└─ If stuck: Would provide coaching/support

↓

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 7: POST-CONVERSION                                       │
└─────────────────────────────────────────────────────────────────┘

After deal closed:

1. Lead marked as: CLOSED_WON
2. Commission calculated and recorded
3. Paperwork initiated
4. Customer satisfaction survey sent
5. Request for referral/review
6. Add to VIP customer list for future opportunities
7. Analytics updated for campaign ROI calculation
```

---

## 5. LEAD ASSIGNMENT LOGIC

### Auto Assignment Methods

#### 1. Round Robin Assignment

Fair distribution - each agent gets leads in rotation.

```javascript
async function roundRobinAssignment(lead) {
  // Get all active agents sorted by last assignment time
  const { data: agents } = await supabase
    .from('users')
    .select('id, first_name, last_name, last_lead_assigned_at')
    .eq('role', 'agent')
    .eq('status', 'active')
    .eq('available', true)
    .order('last_lead_assigned_at', { ascending: true });

  if (agents.length === 0) {
    throw new Error('No available agents');
  }

  // Assign to agent who hasn't received a lead in longest time
  const nextAgent = agents[0];

  // Update lead
  await supabase.from('leads').update({
    assigned_agent_id: nextAgent.id,
    assigned_at: new Date()
  }).eq('id', lead.id);

  // Update agent's last assignment time
  await supabase.from('users').update({
    last_lead_assigned_at: new Date()
  }).eq('id', nextAgent.id);

  return nextAgent;
}
```

**Example:**
```
Agents and their last assignment times:
├─ Sarah: 2 hours ago  ← Will get next lead
├─ Ahmed: 1 hour ago
├─ Fatima: 30 min ago
└─ Ali: 15 min ago

New lead arrives → Assigned to Sarah (longest wait)

After assignment:
├─ Ahmed: 1 hour ago   ← Will get next lead
├─ Fatima: 30 min ago
├─ Ali: 15 min ago
└─ Sarah: Just now
```

#### 2. Location-Based Assignment

Assign based on agent's location expertise.

```javascript
async function locationBasedAssignment(lead) {
  // Get agents who specialize in the lead's preferred location
  const { data: agents } = await supabase
    .from('users')
    .select('*, agent_locations!inner(*)')
    .eq('role', 'agent')
    .eq('status', 'active')
    .eq('agent_locations.location', lead.preferred_location)
    .order('agent_locations.success_rate', { ascending: false });

  if (agents.length === 0) {
    // No specialist available, fall back to round robin
    return await roundRobinAssignment(lead);
  }

  // Assign to agent with best success rate in this location
  const bestAgent = agents[0];

  await assignLeadToAgent(lead.id, bestAgent.id, 'system', 'location_expertise');

  return bestAgent;
}
```

**Example:**
```
Lead: Preferred location = "Dubai Marina"

Agents with Marina expertise:
├─ Sarah: 15 deals in Marina (80% close rate) ← Selected
├─ Ahmed: 8 deals in Marina (65% close rate)
└─ Ali: 3 deals in Marina (50% close rate)

Result: Lead assigned to Sarah (best performer in Marina)
```

#### 3. Availability-Based Assignment

Assign to agents who are currently available.

```javascript
async function availabilityBasedAssignment(lead) {
  // Get agents who are currently available and not at capacity
  const { data: agents } = await supabase
    .from('users')
    .select(`
      *,
      active_leads:leads(count)
    `)
    .eq('role', 'agent')
    .eq('status', 'active')
    .eq('available', true)
    .lt('active_leads.count', 'max_leads_capacity');

  if (agents.length === 0) {
    // All agents at capacity, queue lead
    await queueLead(lead.id);
    return null;
  }

  // Sort by current load (ascending)
  agents.sort((a, b) => a.active_leads[0].count - b.active_leads[0].count);

  // Assign to least loaded available agent
  const leastLoadedAgent = agents[0];

  await assignLeadToAgent(lead.id, leastLoadedAgent.id, 'system', 'least_loaded');

  return leastLoadedAgent;
}
```

**Example:**
```
Agents and their current lead count (max capacity: 25):
├─ Sarah: 12 leads (48% capacity) ← Selected
├─ Ahmed: 18 leads (72% capacity)
├─ Fatima: 23 leads (92% capacity)
└─ Ali: 25 leads (100% capacity) - At capacity

Result: Lead assigned to Sarah (most available)
```

#### 4. Performance-Based Assignment

Assign to best performing agents.

```javascript
async function performanceBasedAssignment(lead) {
  // Get agents ranked by conversion rate
  const { data: agents } = await supabase
    .from('agent_performance_view')
    .select('*')
    .eq('status', 'active')
    .eq('available', true)
    .order('conversion_rate', { ascending: false })
    .order('avg_response_time', { ascending: true })
    .limit(5); // Top 5 performers

  if (agents.length === 0) {
    return await roundRobinAssignment(lead);
  }

  // Distribute among top performers using round robin
  const selectedAgent = agents[0];

  await assignLeadToAgent(lead.id, selectedAgent.id, 'system', 'top_performer');

  return selectedAgent;
}
```

**Example:**
```
Top performing agents:
├─ Mohammed: 26% conversion, 22 min avg response ← Selected
├─ Sarah: 18% conversion, 28 min avg response
├─ Ahmed: 16% conversion, 42 min avg response
└─ Fatima: 14% conversion, 38 min avg response

Result: Lead assigned to Mohammed (best metrics)
```

### Manual Assignment

Manager manually selects agent.

```javascript
async function manualAssignment(lead, agentId, managerId, reason) {
  // Validate agent
  const { data: agent } = await supabase
    .from('users')
    .select('*')
    .eq('id', agentId)
    .eq('role', 'agent')
    .single();

  if (!agent) {
    throw new Error('Invalid agent');
  }

  // Check if agent at capacity
  const { count: currentLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('assigned_agent_id', agentId)
    .in('status', ['NEW', 'CONTACTED', 'INTERESTED', 'VIEWING_SCHEDULED']);

  if (currentLeads >= agent.max_leads_capacity) {
    throw new Error('Agent at maximum capacity');
  }

  // Assign lead
  await assignLeadToAgent(lead.id, agentId, managerId, reason);

  return agent;
}
```

### Reassignment Logic

Automatically reassign if conditions met.

```javascript
async function checkAndReassignStaledLeads() {
  // Find leads that need reassignment
  const { data: staleLeads } = await supabase
    .from('leads')
    .select('*, assigned_agent:users(*)')
    .in('status', ['NEW', 'CONTACTED'])
    .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)) // 24h old
    .is('last_contacted_at', null); // Never contacted

  for (const lead of staleLeads) {
    // Escalate to manager
    await notifyManager({
      title: 'Stale Lead Alert',
      message: `Lead ${lead.first_name} assigned to ${lead.assigned_agent.first_name} for 24h with no contact`,
      lead_id: lead.id,
      actions: [
        { label: 'Reassign', action: 'reassign_lead' },
        { label: 'Remind Agent', action: 'remind_agent' },
        { label: 'Ignore', action: 'ignore' }
      ]
    });
  }
}

async function autoReassignIfAgentInactive(agentId) {
  // Check if agent inactive
  const { data: agent } = await supabase
    .from('users')
    .select('*')
    .eq('id', agentId)
    .single();

  if (agent.status !== 'active' || !agent.available) {
    // Get all active leads for this agent
    const { data: activeLeads } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_agent_id', agentId)
      .in('status', ['NEW', 'CONTACTED', 'INTERESTED']);

    // Reassign each lead
    for (const lead of activeLeads) {
      const newAgent = await roundRobinAssignment(lead);

      await reassignLead(
        lead.id,
        agentId,
        newAgent.id,
        'system',
        'Previous agent unavailable'
      );
    }
  }
}
```

**Pseudo Code Summary:**

```
FUNCTION assign_lead(lead):

  IF auto_assignment_enabled THEN

    // Determine method
    IF assignment_method = 'round_robin' THEN
      agent = get_next_agent_in_rotation()

    ELSE IF assignment_method = 'location' THEN
      agent = get_location_expert(lead.location)
      IF agent IS NULL THEN
        agent = get_next_agent_in_rotation()
      END IF

    ELSE IF assignment_method = 'availability' THEN
      agent = get_least_loaded_agent()
      IF agent IS NULL THEN
        queue_lead(lead)
        RETURN NULL
      END IF

    ELSE IF assignment_method = 'performance' THEN
      agent = get_best_performer()

    END IF

    // Assign
    UPDATE leads SET assigned_agent_id = agent.id
    CREATE assignment_record
    NOTIFY agent
    UPDATE agent_metrics

    RETURN agent

  ELSE
    // Manual assignment
    ADD lead TO unassigned_queue
    NOTIFY manager
    RETURN NULL

  END IF

END FUNCTION

FUNCTION check_reassignment(lead):

  // Check if lead needs reassignment
  IF lead.created_at > 24_hours_ago AND lead.last_contacted_at IS NULL THEN
    NOTIFY manager
    RETURN 'stale_lead'
  END IF

  IF agent.status = 'inactive' OR agent.available = FALSE THEN
    new_agent = assign_lead(lead)
    RETURN 'agent_inactive'
  END IF

  IF lead.priority = 'HOT' AND no_contact_for_1_hour THEN
    ESCALATE to_manager
    RETURN 'hot_lead_neglected'
  END IF

  RETURN 'ok'

END FUNCTION
```

---

## 6. LEAD STATUS SYSTEM

### Status Lifecycle

```
Lead Created
    ↓
┌──────────┐
│   NEW    │ → Lead just arrived, no contact made yet
└──────────┘
    ↓ (Agent makes first contact)
    ↓
┌──────────┐
│ CONTACTED│ → Initial contact made, awaiting response
└──────────┘
    ↓ (Lead shows interest)
    ↓
┌──────────────┐
│  INTERESTED  │ → Lead expressed positive interest
└──────────────┘
    ↓ (Viewing scheduled)
    ↓
┌────────────────────┐
│ VIEWING_SCHEDULED  │ → Property viewing arranged
└────────────────────┘
    ↓ (After viewing)
    ↓
┌──────────────┐
│ NEGOTIATING  │ → Discussing price/terms
└──────────────┘
    ↓
    ├─────────────────┬─────────────────┐
    ↓                 ↓                 ↓
┌─────────────┐  ┌──────────────┐  ┌───────────────┐
│ CLOSED_WON  │  │ CLOSED_LOST  │  │ NOT_INTERESTED│
│ 🎉 Success! │  │ Lost to      │  │ Not qualified │
│             │  │ competitor   │  │ or declined   │
└─────────────┘  └──────────────┘  └───────────────┘
```

### Status Effects on Automation

```javascript
const statusAutomation = {
  NEW: {
    triggers: [
      {
        delay: '1 hour',
        condition: 'no_contact_made',
        action: 'send_reminder_to_agent',
        message: 'You have a new lead waiting for first contact'
      },
      {
        delay: '4 hours',
        condition: 'no_contact_made',
        action: 'escalate_to_manager',
        message: 'Lead not contacted within 4 hours'
      }
    ]
  },

  CONTACTED: {
    triggers: [
      {
        delay: '24 hours',
        condition: 'no_lead_response',
        action: 'send_followup_message',
        message: 'Automated follow-up sent to lead'
      },
      {
        delay: '48 hours',
        condition: 'no_lead_response',
        action: 'send_reminder_to_agent',
        message: 'No response from lead in 48 hours'
      }
    ]
  },

  INTERESTED: {
    triggers: [
      {
        delay: '48 hours',
        condition: 'no_viewing_scheduled',
        action: 'send_reminder_to_agent',
        message: 'Interested lead - schedule viewing soon'
      }
    ]
  },

  VIEWING_SCHEDULED: {
    triggers: [
      {
        delay: '24 hours before',
        action: 'send_reminder_to_lead',
        message: 'Reminder: Your viewing is tomorrow'
      },
      {
        delay: '2 hours before',
        action: 'send_reminder_to_agent',
        message: 'Viewing with {lead_name} in 2 hours'
      },
      {
        delay: '24 hours after',
        condition: 'viewing_not_marked_complete',
        action: 'prompt_agent_for_feedback',
        message: 'Please update viewing outcome'
      }
    ]
  },

  NEGOTIATING: {
    triggers: [
      {
        delay: '7 days',
        condition: 'still_negotiating',
        action: 'send_reminder_to_agent',
        message: 'Negotiation taking long - follow up needed'
      }
    ]
  },

  NOT_INTERESTED: {
    triggers: [
      {
        delay: '90 days',
        action: 'add_to_reengagement_campaign',
        message: 'Attempt to re-engage cold lead'
      }
    ]
  }
};
```

### Status Change Analytics

```javascript
async function trackStatusChange(leadId, oldStatus, newStatus, agentId) {
  // Calculate time in previous status
  const { data: lastChange } = await supabase
    .from('lead_status_history')
    .select('changed_at')
    .eq('lead_id', leadId)
    .order('changed_at', { ascending: false })
    .limit(1)
    .single();

  const timeInStatus = lastChange
    ? Date.now() - new Date(lastChange.changed_at)
    : null;

  // Record status change
  await supabase.from('lead_status_history').insert({
    lead_id: leadId,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: agentId,
    time_in_previous_status: timeInStatus,
    changed_at: new Date()
  });

  // Update analytics
  await supabase.from('status_analytics').upsert({
    agent_id: agentId,
    status_from: oldStatus,
    status_to: newStatus,
    count: supabase.sql`count + 1`,
    avg_time: supabase.sql`(avg_time * count + ${timeInStatus}) / (count + 1)`
  });
}
```

**Status Analytics Report:**

```
LEAD STATUS FLOW ANALYSIS

Average Time in Each Status:
├─ NEW: 3.2 hours
├─ CONTACTED: 2.1 days
├─ INTERESTED: 4.5 days
├─ VIEWING_SCHEDULED: 1.8 days
└─ NEGOTIATING: 5.3 days

Conversion Funnel:
NEW (100 leads)
├─ → CONTACTED: 95 (95% contact rate)
├─ → INTERESTED: 67 (71% interest rate)
├─ → VIEWING_SCHEDULED: 45 (67% viewing rate)
├─ → NEGOTIATING: 28 (62% negotiation rate)
└─ → CLOSED_WON: 18 (64% close rate)

Overall Conversion: 18% (18 won / 100 leads)

Drop-off Points:
⚠️ CONTACTED → INTERESTED: 28% drop (needs improvement)
✓ VIEWING → NEGOTIATING: 38% drop (acceptable)
✓ NEGOTIATING → CLOSED: 36% drop (good)
```

---

## 7. SMART LEAD FEATURES

### Lead Prioritization (Hot/Warm/Cold)

**Priority Classification:**

```javascript
function calculateLeadPriority(lead, interactions, externalData) {
  let score = 0;

  // 1. BUDGET MATCH (25 points)
  if (lead.budget_min >= 500000 && lead.budget_max <= 10000000) {
    score += 15; // Realistic budget
  }
  if (lead.budget_max >= lead.budget_min * 1.5) {
    score += 10; // Flexible budget
  }

  // 2. ENGAGEMENT (30 points)
  if (interactions.replied_to_message) score += 12;
  if (interactions.opened_property_links) score += 8;
  if (interactions.requested_viewing) score += 10;

  // 3. TIMELINE (20 points)
  if (lead.timeline === 'asap' || lead.timeline === '1_month') score += 20;
  else if (lead.timeline === '1_3_months') score += 15;
  else if (lead.timeline === '3_6_months') score += 10;
  else score += 5;

  // 4. SOURCE QUALITY (15 points)
  const sourceScores = {
    referral: 15,
    google_search: 12,
    website_direct: 10,
    facebook: 8,
    instagram: 6
  };
  score += sourceScores[lead.source] || 5;

  // 5. COMPLETENESS (10 points)
  if (lead.email && lead.phone) score += 5;
  if (lead.message && lead.message.length > 50) score += 5;

  // BONUS
  if (externalData?.previous_buyer) score += 10;
  if (interactions.response_time < 300) score += 5; // Replied within 5 min

  // Calculate priority
  if (score >= 75) return { priority: 'HOT', color: 'red', score };
  if (score >= 50) return { priority: 'WARM', color: 'orange', score };
  return { priority: 'COLD', color: 'blue', score };
}
```

**Priority-Based Actions:**

```javascript
const priorityActions = {
  HOT: {
    sla: '15 minutes',
    actions: [
      'Immediate agent notification (SMS + push)',
      'Auto-call agent if no action in 10 minutes',
      'Manager alert if no contact in 30 minutes',
      'Priority placement in agent dashboard'
    ],
    automation: [
      'Send immediate welcome message',
      'Assign to best performing agent',
      'Flag for manager monitoring'
    ]
  },

  WARM: {
    sla: '2 hours',
    actions: [
      'Agent notification (push)',
      'Standard placement in dashboard',
      'Reminder after 1 hour if no contact'
    ],
    automation: [
      'Send welcome message after 30 minutes',
      'Assign using standard logic',
      'Schedule follow-up reminder'
    ]
  },

  COLD: {
    sla: '24 hours',
    actions: [
      'Add to agent queue',
      'Email notification to agent',
      'Follow-up reminder after 12 hours'
    ],
    automation: [
      'Add to nurture sequence',
      'Send automated introduction email',
      'Schedule weekly check-ins'
    ]
  }
};
```

### Lead Scoring System

**Comprehensive Scoring Model:**

```javascript
async function calculateLeadScore(leadId) {
  const lead = await getLeadWithDetails(leadId);

  const scores = {
    demographic: 0,
    engagement: 0,
    intent: 0,
    source: 0,
    timing: 0
  };

  // DEMOGRAPHIC SCORE (20 points)
  if (lead.budget_min >= 1000000) scores.demographic += 10;
  if (lead.has_mortgage_preapproval) scores.demographic += 10;

  // ENGAGEMENT SCORE (30 points)
  const engagementMetrics = await getEngagementMetrics(leadId);
  scores.engagement += Math.min(30, engagementMetrics.total_interactions * 3);

  // INTENT SCORE (25 points)
  if (lead.requested_viewing) scores.intent += 15;
  if (lead.asked_about_financing) scores.intent += 5;
  if (lead.timeline === 'urgent') scores.intent += 5;

  // SOURCE SCORE (15 points)
  const sourceQuality = {
    referral: 15,
    google_organic: 12,
    repeat_visitor: 12,
    paid_search: 10,
    social_media: 7
  };
  scores.source = sourceQuality[lead.source] || 5;

  // TIMING SCORE (10 points)
  const hourOfDay = new Date(lead.created_at).getHours();
  if (hourOfDay >= 9 && hourOfDay <= 17) scores.timing += 10; // Business hours
  else scores.timing += 5;

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Save score
  await supabase.from('leads').update({
    score: totalScore,
    score_breakdown: scores,
    score_updated_at: new Date()
  }).eq('id', leadId);

  return { totalScore, breakdown: scores };
}
```

**Score-Based Lead Routing:**

```
Lead Score Distribution:

90-100 points: VIP Leads
├─ Assign to senior agents only
├─ Immediate contact (< 5 min)
├─ Manager notification
└─ Premium service treatment

75-89 points: High Priority
├─ Assign to top performers
├─ Contact within 15 minutes
└─ Standard premium process

50-74 points: Medium Priority
├─ Regular assignment logic
├─ Contact within 2 hours
└─ Standard process

25-49 points: Low Priority
├─ Assign to junior agents for practice
├─ Contact within 24 hours
└─ Automated nurture sequence

0-24 points: Very Low Priority
├─ Automated nurture only
├─ Review after 30 days
└─ Possible spam/invalid lead
```

---

## 8. COMMUNICATION FEATURES

### WhatsApp Integration

**Full Implementation:**

```javascript
// Send WhatsApp message
async function sendWhatsApp(lead, agent, message) {
  const response = await fetch(
    `${WHATSAPP_API}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: lead.phone,
        type: 'text',
        text: { body: message }
      })
    }
  );

  // Log activity
  await logCommunication({
    lead_id: lead.id,
    agent_id: agent.id,
    type: 'whatsapp',
    direction: 'outbound',
    content: message,
    status: 'sent'
  });

  return response.json();
}

// Receive WhatsApp messages (webhook)
app.post('/webhooks/whatsapp', async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body;

    // Find lead by phone
    const lead = await findLeadByPhone(from);

    if (lead) {
      // Log incoming message
      await logCommunication({
        lead_id: lead.id,
        type: 'whatsapp',
        direction: 'inbound',
        content: text,
        status: 'received'
      });

      // Update lead priority (engagement detected)
      if (lead.priority === 'COLD') {
        await updateLeadPriority(lead.id, 'WARM');
      }

      // Notify assigned agent
      await notifyAgent(lead.assigned_agent_id, {
        title: `${lead.first_name} replied on WhatsApp`,
        message: text,
        action_url: `/leads/${lead.id}`
      });

      // Check for auto-reply triggers
      await checkAutoReplyTriggers(lead, text);
    }
  }

  res.sendStatus(200);
});
```

### Call Tracking

```javascript
async function trackPhoneCall(lead, agent, callData) {
  const call = await supabase.from('phone_calls').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    direction: callData.direction, // 'inbound' or 'outbound'
    phone_number: callData.phone,
    duration: callData.duration, // in seconds
    outcome: callData.outcome, // 'answered', 'no_answer', 'voicemail'
    recording_url: callData.recording_url,
    notes: callData.notes,
    created_at: new Date()
  }).select().single();

  // Update lead activity
  await supabase.from('leads').update({
    last_contacted_at: new Date(),
    last_contact_method: 'phone',
    contact_attempts: supabase.sql`contact_attempts + 1`
  }).eq('id', lead.id);

  // Log in activity timeline
  await logCommunication({
    lead_id: lead.id,
    agent_id: agent.id,
    type: 'phone_call',
    direction: callData.direction,
    duration: callData.duration,
    outcome: callData.outcome,
    notes: callData.notes
  });

  return call;
}
```

### Email Communication

```javascript
async function sendEmailToLead(lead, agent, emailData) {
  // Send via SendGrid
  const email = {
    to: lead.email,
    from: {
      email: agent.email,
      name: `${agent.first_name} ${agent.last_name}`
    },
    subject: emailData.subject,
    html: emailData.html,
    attachments: emailData.attachments,
    tracking_settings: {
      click_tracking: { enable: true },
      open_tracking: { enable: true }
    }
  };

  const response = await sendgrid.send(email);

  // Log email
  await supabase.from('emails').insert({
    lead_id: lead.id,
    agent_id: agent.id,
    subject: emailData.subject,
    body: emailData.html,
    status: 'sent',
    sent_at: new Date()
  });

  return response;
}

// Track email opens and clicks
app.post('/webhooks/sendgrid', async (req, res) => {
  const events = req.body;

  for (const event of events) {
    if (event.event === 'open') {
      await trackEmailOpen(event.sg_message_id, event.timestamp);
    } else if (event.event === 'click') {
      await trackEmailClick(event.sg_message_id, event.url, event.timestamp);
    }
  }

  res.sendStatus(200);
});
```

### Auto-Reply System

```javascript
const autoReplyTriggers = {
  keywords: {
    price: {
      trigger: ['price', 'cost', 'how much'],
      response: async (lead) => {
        const property = await getPropertyForLead(lead.id);
        return `The property is priced at AED ${property.price.toLocaleString()}. We also have flexible payment plans available. Would you like me to send you the details?`;
      }
    },

    viewing: {
      trigger: ['viewing', 'visit', 'see property', 'tour'],
      response: async (lead) => {
        return `I'd be happy to arrange a viewing for you! What day works best? We have availability:\n\n1️⃣ Tomorrow\n2️⃣ This weekend\n3️⃣ Next week\n\nReply with a number or suggest a time.`;
      }
    },

    location: {
      trigger: ['location', 'where', 'address'],
      response: async (lead) => {
        const property = await getPropertyForLead(lead.id);
        return `The property is located at:\n📍 ${property.address}\n\nI can send you the exact location on Google Maps if you'd like?`;
      }
    }
  },

  timeouts: {
    no_response_24h: {
      trigger: 'no_response_for_24_hours',
      response: (lead) => {
        return `Hi ${lead.first_name}! 👋\n\nI wanted to follow up on the property you were interested in. Is this still something you'd like to explore?\n\nLet me know if you have any questions!`;
      }
    }
  }
};

async function checkAutoReplyTriggers(lead, messageText) {
  const lowerText = messageText.toLowerCase();

  // Check keyword triggers
  for (const [key, trigger] of Object.entries(autoReplyTriggers.keywords)) {
    if (trigger.trigger.some(keyword => lowerText.includes(keyword))) {
      const response = await trigger.response(lead);

      // Send auto-reply
      await sendWhatsApp(lead, { id: 'system' }, response);

      // Log as automated response
      await logCommunication({
        lead_id: lead.id,
        type: 'whatsapp',
        direction: 'outbound',
        content: response,
        is_automated: true
      });

      break; // Only one auto-reply per message
    }
  }
}
```

### Follow-up Sequences

```javascript
const followUpSequences = {
  new_lead: [
    {
      delay: '0 minutes',
      channel: 'whatsapp',
      message: (lead) => `Hi ${lead.first_name}! 👋\n\nThank you for your interest in our properties. I'm ${lead.agent.first_name}, your dedicated property consultant.\n\nI'd love to help you find your perfect home. When would be a good time for a quick call?`
    },
    {
      delay: '2 hours',
      condition: 'no_response',
      channel: 'email',
      subject: 'Your Property Search',
      message: (lead) => `Dear ${lead.first_name},\n\nThank you for reaching out. I've attached a brochure with properties matching your requirements...\n\nBest regards,\n${lead.agent.first_name}`
    },
    {
      delay: '24 hours',
      condition: 'no_response',
      channel: 'whatsapp',
      message: (lead) => `Hi ${lead.first_name},\n\nJust following up on the property inquiry. I found some great options in your budget range.\n\nWould you like me to send you the details?`
    },
    {
      delay: '3 days',
      condition: 'no_response',
      channel: 'email',
      subject: 'Still Interested?',
      message: (lead) => `Hi ${lead.first_name},\n\nI wanted to check if you're still looking for a property. If the timing isn't right now, I'm happy to follow up later.\n\nLet me know how I can help!`
    }
  ],

  post_viewing: [
    {
      delay: '2 hours',
      channel: 'whatsapp',
      message: (lead) => `Hi ${lead.first_name},\n\nIt was great showing you the property today! Do you have any questions or would you like to see any other units?`
    },
    {
      delay: '24 hours',
      condition: 'no_response',
      channel: 'phone',
      action: 'remind_agent_to_call'
    },
    {
      delay: '3 days',
      channel: 'email',
      subject: 'Viewing Follow-up',
      message: (lead) => `Hope you're doing well!\n\nI wanted to follow up on the viewing. I also have 2 similar properties that just became available...\n\nWould you like details?`
    }
  ]
};
```

---

## 9. ACTIVITY TRACKING

### Activity Timeline

**All trackable activities:**

```javascript
const activityTypes = {
  // Lead events
  'lead_created': 'Lead created from {source}',
  'lead_assigned': 'Lead assigned to {agent}',
  'lead_reassigned': 'Lead reassigned from {old_agent} to {new_agent}',

  // Communication
  'whatsapp_sent': 'WhatsApp message sent',
  'whatsapp_received': 'WhatsApp message received',
  'email_sent': 'Email sent: {subject}',
  'email_opened': 'Email opened',
  'email_clicked': 'Email link clicked',
  'call_made': 'Phone call made ({duration} min)',
  'call_received': 'Incoming call ({duration} min)',
  'sms_sent': 'SMS sent',

  // Actions
  'viewing_scheduled': 'Property viewing scheduled for {date}',
  'viewing_completed': 'Property viewing completed',
  'viewing_cancelled': 'Viewing cancelled',
  'offer_made': 'Offer made: AED {amount}',
  'offer_accepted': 'Offer accepted',
  'offer_rejected': 'Offer rejected',

  // Status changes
  'status_changed': 'Status changed from {old} to {new}',
  'priority_updated': 'Priority updated to {priority}',

  // Notes
  'note_added': 'Note added',
  'reminder_set': 'Reminder set for {date}',

  // Documents
  'document_sent': 'Document sent: {document_name}',
  'document_signed': 'Document signed'
};
```

**Activity Logging:**

```javascript
async function logActivity(activityData) {
  const activity = await supabase.from('lead_activities').insert({
    lead_id: activityData.lead_id,
    agent_id: activityData.agent_id,
    activity_type: activityData.type,
    description: activityData.description,
    metadata: activityData.metadata,
    created_at: new Date()
  }).select().single();

  // Trigger real-time update
  await broadcastActivityUpdate(activityData.lead_id, activity);

  return activity;
}
```

**Activity Timeline Display:**

```
┌─────────────────────────────────────────────────────────────┐
│ ACTIVITY TIMELINE - MOHAMMED AHMED                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 📅 Today - March 26, 2026                                   │
│                                                              │
│ 🕐 2:30 PM                                                  │
│ 📧 Email Opened                                             │
│ Mohammed opened "Payment Plan Options" email                │
│ └─ Clicked: Payment calculator link                         │
│                                                              │
│ 🕐 11:45 AM                                                 │
│ 💬 WhatsApp Sent by Sarah J.                               │
│ "Hi Mohammed! Following up on yesterday's viewing..."       │
│ └─ Delivered ✓                                              │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│                                                              │
│ 📅 Yesterday - March 25, 2026                               │
│                                                              │
│ 🕐 3:00 PM                                                  │
│ 🏠 Property Viewing Completed                               │
│ Marina Heights Tower - Unit 15B                             │
│ Duration: 45 minutes                                         │
│ └─ Note: "Very impressed with sea view and layout"         │
│                                                              │
│ 🕐 2:45 PM                                                  │
│ 📞 Call Made by Sarah J.                                    │
│ Duration: 3 min 24 sec                                       │
│ └─ Note: "Confirmed viewing, on the way"                   │
│                                                              │
│ 🕐 10:30 AM                                                 │
│ 📅 Viewing Scheduled                                        │
│ Date: March 25, 3:00 PM                                      │
│ Property: Marina Heights Tower                               │
│ └─ Confirmation sent to lead ✓                              │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│                                                              │
│ 📅 March 24, 2026                                           │
│                                                              │
│ 🕐 4:20 PM                                                  │
│ 💬 WhatsApp Received from Mohammed                          │
│ "Yes, I'm very interested. Can we schedule viewing?"        │
│ └─ Priority updated: WARM → HOT 🔥                         │
│                                                              │
│ 🕐 10:45 AM                                                 │
│ 💬 WhatsApp Sent by Sarah J.                               │
│ "Hi Mohammed! Thank you for your interest..."               │
│ └─ Delivered ✓  Read ✓✓                                    │
│                                                              │
│ 🕐 10:35 AM                                                 │
│ 👤 Lead Assigned to Sarah Johnson                           │
│ Assignment method: Location expertise                        │
│                                                              │
│ 🕐 10:32 AM                                                 │
│ 🎯 Lead Created                                             │
│ Source: Facebook Campaign - Summer Sale                     │
│ Budget: AED 1.5M - 2M                                        │
│ Location: Dubai Marina                                       │
│                                                              │
│ [Load More Activity...]                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Communication History

```javascript
async function getCommunicationHistory(leadId) {
  const { data: communications } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .in('activity_type', [
      'whatsapp_sent',
      'whatsapp_received',
      'email_sent',
      'email_opened',
      'call_made',
      'call_received',
      'sms_sent'
    ])
    .order('created_at', { ascending: false });

  return communications;
}
```

**Communication Summary:**

```
COMMUNICATION SUMMARY

Total Interactions: 18
├─ WhatsApp: 12 messages
│  ├─ Sent: 7
│  └─ Received: 5
├─ Email: 3 emails
│  ├─ Sent: 3
│  ├─ Opened: 2 (67% open rate)
│  └─ Clicked: 1 (33% click rate)
├─ Phone Calls: 3 calls
│  ├─ Outbound: 2 (avg 5 min)
│  └─ Inbound: 1 (2 min)
└─ SMS: 0

Response Rate: 71% (5 responses / 7 outbound messages)
Avg Response Time: 2.5 hours

Last Contact: 2 hours ago (WhatsApp)
Next Scheduled: Tomorrow 3 PM (Viewing)
```

---

## 10. ANALYTICS & PERFORMANCE

### Agent Analytics

**Agent Performance Metrics:**

```javascript
async function getAgentPerformance(agentId, period) {
  // Get basic stats
  const { data: stats } = await supabase.rpc('calculate_agent_performance', {
    agent_id: agentId,
    start_date: period.start,
    end_date: period.end
  });

  return {
    // Lead metrics
    total_leads: stats.total_leads,
    new_leads: stats.new_leads,
    active_leads: stats.active_leads,
    closed_leads: stats.closed_won,
    lost_leads: stats.closed_lost,

    // Conversion metrics
    conversion_rate: (stats.closed_won / stats.total_leads * 100).toFixed(2),
    win_rate: (stats.closed_won / (stats.closed_won + stats.closed_lost) * 100).toFixed(2),

    // Response metrics
    avg_first_response: stats.avg_first_response_minutes,
    avg_response_time: stats.avg_response_time_hours,
    contact_attempts_per_lead: stats.total_contacts / stats.total_leads,

    // Activity metrics
    total_calls: stats.total_calls,
    total_emails: stats.total_emails,
    total_whatsapp: stats.total_whatsapp,
    total_viewings: stats.total_viewings,

    // Revenue metrics
    total_commission: stats.total_commission,
    avg_deal_value: stats.avg_deal_value,
    pipeline_value: stats.pipeline_value,

    // Quality metrics
    lead_satisfaction: stats.avg_satisfaction_score,
    viewing_to_offer_rate: (stats.offers_made / stats.viewings_conducted * 100).toFixed(2),
    offer_acceptance_rate: (stats.offers_accepted / stats.offers_made * 100).toFixed(2)
  };
}
```

**Agent Dashboard:**

```
MY PERFORMANCE - MARCH 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEADS OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Leads: 23          Active: 19          Closed: 4
Conversion Rate: 17.4%   Win Rate: 80%       Lost: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Avg First Response: 28 minutes ⚡ (Target: < 1 hour)
Avg Follow-up Time: 18 hours     (Target: < 24 hours)
Contact Attempts/Lead: 3.2       (Healthy: 3-5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVITY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calls: 47              Emails: 31           WhatsApp: 89
Viewings: 12           Offers Made: 6       Accepted: 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVENUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Commission: AED 87,500
Avg Deal Value: AED 1.75M
Pipeline Value: AED 8.2M

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Monthly Target: AED 120,000
Progress: 76% ████████████████░░░░░
Deals Closed: 4 / 6
Days Remaining: 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Manager Analytics

**Team Performance Dashboard:**

```javascript
async function getTeamAnalytics(managerId, period) {
  const { data: teamStats } = await supabase.rpc('calculate_team_performance', {
    manager_id: managerId,
    start_date: period.start,
    end_date: period.end
  });

  return {
    // Team metrics
    total_agents: teamStats.active_agents,
    total_leads: teamStats.total_leads,
    unassigned_leads: teamStats.unassigned_leads,

    // Performance
    team_conversion_rate: (teamStats.total_won / teamStats.total_leads * 100).toFixed(2),
    avg_response_time: teamStats.avg_first_response_minutes,
    team_revenue: teamStats.total_commission,

    // Individual performance
    best_performer: teamStats.agents.sort((a, b) => b.conversion_rate - a.conversion_rate)[0],
    fastest_responder: teamStats.agents.sort((a, b) => a.avg_response - b.avg_response)[0],
    highest_revenue: teamStats.agents.sort((a, b) => b.revenue - a.revenue)[0],

    // Alerts
    underperformers: teamStats.agents.filter(a => a.conversion_rate < 10),
    slow_responders: teamStats.agents.filter(a => a.avg_response > 60),
    overloaded_agents: teamStats.agents.filter(a => a.active_leads > 25)
  };
}
```

**Team Dashboard:**

```
TEAM PERFORMANCE DASHBOARD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEAM OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Agents: 8              Total Leads: 156
Avg Leads/Agent: 19.5         Unassigned: 12 ⚠️

Team Conversion: 16.3%        Target: 20%
Avg Response: 45 min          Target: < 30 min

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP PERFORMERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥇 Mohammed Ali
   Conversion: 26.3% | Leads: 19 | Closed: 5 | Revenue: AED 95K

🥈 Sarah Johnson
   Conversion: 17.4% | Leads: 23 | Closed: 4 | Revenue: AED 87K

🥉 Ahmed Hassan
   Conversion: 14.3% | Leads: 21 | Closed: 3 | Revenue: AED 72K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEEDS ATTENTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Ali Abdullah
   Issue: Slow response time (avg 51 min)
   Action: [Schedule Coaching] [Review Process]

⚠️ Fatima Khan
   Issue: Low conversion rate (11.1%)
   Action: [Analyze Lost Deals] [Training Needed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEAD SOURCE PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Facebook: 67 leads (22% conversion) ✓ Best
Instagram: 34 leads (15% conversion)
Google: 28 leads (18% conversion) ✓ Good
Website: 18 leads (12% conversion)
WhatsApp: 9 leads (33% conversion) ✓ Highest quality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Lead Source Performance

```javascript
async function analyzeLeadSourcePerformance(managerId, period) {
  const { data: sources } = await supabase
    .from('leads')
    .select('source, status')
    .gte('created_at', period.start)
    .lte('created_at', period.end);

  const analysis = {};

  sources.forEach(lead => {
    if (!analysis[lead.source]) {
      analysis[lead.source] = {
        total: 0,
        converted: 0,
        lost: 0,
        active: 0
      };
    }

    analysis[lead.source].total++;

    if (lead.status === 'CLOSED_WON') analysis[lead.source].converted++;
    else if (lead.status === 'CLOSED_LOST') analysis[lead.source].lost++;
    else analysis[lead.source].active++;
  });

  // Calculate conversion rates
  Object.keys(analysis).forEach(source => {
    const data = analysis[source];
    data.conversion_rate = (data.converted / data.total * 100).toFixed(2);
    data.loss_rate = (data.lost / data.total * 100).toFixed(2);
  });

  return analysis;
}
```

---

## 11. DATA MODEL (DATABASE DESIGN)

### Database Schema

```sql
-- ============================================
-- LEADS TABLE (Core table)
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp_number VARCHAR(20),

  -- Requirements
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  preferred_location VARCHAR(255),
  property_type VARCHAR(50), -- 'apartment', 'villa', 'townhouse'
  bedrooms_required INTEGER,
  bathrooms_required INTEGER,
  move_in_timeline VARCHAR(50), -- 'asap', '1_month', '1_3_months', '3_6_months'
  financing_needed BOOLEAN DEFAULT FALSE,
  message TEXT,

  -- Attribution
  source VARCHAR(50), -- 'facebook', 'instagram', 'google', 'website', 'whatsapp', 'referral'
  campaign_id UUID REFERENCES campaigns(id),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- Assignment
  assigned_agent_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP,
  assigned_by UUID REFERENCES users(id), -- Agent or Manager who assigned
  previous_agent_id UUID, -- For reassignments
  reassignment_count INTEGER DEFAULT 0,

  -- Classification
  status VARCHAR(30) DEFAULT 'NEW',
    -- 'NEW', 'CONTACTED', 'INTERESTED', 'VIEWING_SCHEDULED',
    -- 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'NOT_INTERESTED'
  priority VARCHAR(10) DEFAULT 'COLD', -- 'HOT', 'WARM', 'COLD'
  score INTEGER DEFAULT 0, -- 0-100 lead score
  score_breakdown JSONB,

  -- Activity Tracking
  last_contacted_at TIMESTAMP,
  last_contact_method VARCHAR(20), -- 'phone', 'email', 'whatsapp'
  last_activity_at TIMESTAMP,
  contact_attempts INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,

  -- Engagement Metrics
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0,
  whatsapp_replies INTEGER DEFAULT 0,
  property_views INTEGER DEFAULT 0,

  -- Conversion Data
  viewing_count INTEGER DEFAULT 0,
  offer_amount DECIMAL(12, 2),
  deal_value DECIMAL(12, 2),
  commission_amount DECIMAL(12, 2),
  closed_at TIMESTAMP,
  lost_reason TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),

  -- Geo Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city VARCHAR(100),
  country VARCHAR(100)
);

CREATE INDEX idx_leads_assigned_agent ON leads(assigned_agent_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_score ON leads(score DESC);

-- ============================================
-- USERS TABLE (Agents & Managers)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),

  -- Profile
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),

  -- Role
  role VARCHAR(20), -- 'agent', 'manager', 'admin', 'developer'
  manager_id UUID REFERENCES users(id),
  team_id UUID,

  -- Agent Settings
  max_leads_capacity INTEGER DEFAULT 25,
  available BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'on_leave'

  -- Specialization
  expertise_locations TEXT[],
  expertise_property_types TEXT[],
  languages TEXT[],

  -- Performance
  total_leads_handled INTEGER DEFAULT 0,
  total_leads_converted INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  avg_response_time_minutes INTEGER,
  total_commission_earned DECIMAL(12, 2) DEFAULT 0,

  -- Tracking
  last_lead_assigned_at TIMESTAMP,
  last_active_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- LEAD_ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE lead_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),

  assignment_method VARCHAR(50),
    -- 'round_robin', 'location_based', 'manual', 'performance_based'
  assignment_reason TEXT,

  assigned_at TIMESTAMP DEFAULT NOW(),
  unassigned_at TIMESTAMP,

  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_assignments_lead ON lead_assignments(lead_id);
CREATE INDEX idx_assignments_agent ON lead_assignments(agent_id);

-- ============================================
-- LEAD_ACTIVITIES TABLE
-- ============================================
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),

  activity_type VARCHAR(50),
    -- 'whatsapp_sent', 'whatsapp_received', 'email_sent', 'email_opened',
    -- 'call_made', 'call_received', 'viewing_scheduled', 'viewing_completed',
    -- 'status_changed', 'note_added', 'document_sent', etc.

  description TEXT,
  metadata JSONB,
    -- Stores type-specific data like call duration, email subject, etc.

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_activities_agent ON lead_activities(agent_id);
CREATE INDEX idx_activities_type ON lead_activities(activity_type);
CREATE INDEX idx_activities_created ON lead_activities(created_at DESC);

-- ============================================
-- LEAD_STATUS_HISTORY TABLE
-- ============================================
CREATE TABLE lead_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

  old_status VARCHAR(30),
  new_status VARCHAR(30),

  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  notes TEXT,

  time_in_previous_status BIGINT, -- milliseconds

  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_history_lead ON lead_status_history(lead_id);
CREATE INDEX idx_status_history_changed ON lead_status_history(changed_at DESC);

-- ============================================
-- LEAD_NOTES TABLE
-- ============================================
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),

  note_type VARCHAR(30), -- 'general', 'call_summary', 'viewing_notes', 'important'
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE, -- Only visible to agent

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_lead ON lead_notes(lead_id);
CREATE INDEX idx_notes_agent ON lead_notes(agent_id);

-- ============================================
-- LEAD_REMINDERS TABLE
-- ============================================
CREATE TABLE lead_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),

  reminder_type VARCHAR(30), -- 'call', 'email', 'viewing', 'follow_up'
  reminder_datetime TIMESTAMP NOT NULL,
  message TEXT,
  priority VARCHAR(10) DEFAULT 'medium', -- 'high', 'medium', 'low'

  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'completed', 'cancelled'
  sent_at TIMESTAMP,
  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reminders_agent ON lead_reminders(agent_id);
CREATE INDEX idx_reminders_datetime ON lead_reminders(reminder_datetime);
CREATE INDEX idx_reminders_status ON lead_reminders(status);

-- ============================================
-- PROPERTY_VIEWINGS TABLE
-- ============================================
CREATE TABLE property_viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),

  scheduled_date DATE,
  scheduled_time TIME,
  duration INTEGER, -- minutes
  location VARCHAR(500),

  status VARCHAR(20) DEFAULT 'scheduled',
    -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'

  outcome VARCHAR(30),
    -- 'interested', 'very_interested', 'not_interested', 'wants_to_think'
  feedback TEXT,
  agent_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT
);

CREATE INDEX idx_viewings_lead ON property_viewings(lead_id);
CREATE INDEX idx_viewings_agent ON property_viewings(agent_id);
CREATE INDEX idx_viewings_date ON property_viewings(scheduled_date);

-- ============================================
-- PHONE_CALLS TABLE
-- ============================================
CREATE TABLE phone_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES users(id),

  direction VARCHAR(10), -- 'inbound', 'outbound'
  phone_number VARCHAR(20),
  duration INTEGER, -- seconds

  outcome VARCHAR(30),
    -- 'answered', 'no_answer', 'voicemail', 'busy', 'wrong_number'

  recording_url VARCHAR(500),
  transcript TEXT,
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_calls_lead ON phone_calls(lead_id);
CREATE INDEX idx_calls_agent ON phone_calls(agent_id);

-- ============================================
-- EMAILS TABLE
-- ============================================
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES users(id),

  direction VARCHAR(10), -- 'sent', 'received'
  subject VARCHAR(500),
  body TEXT,
  html_body TEXT,

  status VARCHAR(20), -- 'sent', 'delivered', 'opened', 'clicked', 'bounced'
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,

  attachments JSONB,
  email_provider_id VARCHAR(255), -- SendGrid message ID

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emails_lead ON emails(lead_id);
CREATE INDEX idx_emails_status ON emails(status);

-- ============================================
-- WHATSAPP_MESSAGES TABLE
-- ============================================
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES users(id),

  direction VARCHAR(10), -- 'sent', 'received'
  message_content TEXT,
  message_type VARCHAR(20), -- 'text', 'image', 'document', 'template'

  status VARCHAR(20), -- 'sent', 'delivered', 'read', 'failed'
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,

  whatsapp_message_id VARCHAR(255),
  is_automated BOOLEAN DEFAULT FALSE,

  metadata JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_lead ON whatsapp_messages(lead_id);
CREATE INDEX idx_whatsapp_direction ON whatsapp_messages(direction);

-- ============================================
-- AGENT_PERFORMANCE_VIEW (Materialized View)
-- ============================================
CREATE MATERIALIZED VIEW agent_performance_view AS
SELECT
  u.id as agent_id,
  u.first_name,
  u.last_name,
  u.email,

  -- Lead counts
  COUNT(l.id) as total_leads,
  COUNT(CASE WHEN l.status IN ('NEW', 'CONTACTED', 'INTERESTED', 'VIEWING_SCHEDULED', 'NEGOTIATING') THEN 1 END) as active_leads,
  COUNT(CASE WHEN l.status = 'CLOSED_WON' THEN 1 END) as closed_won,
  COUNT(CASE WHEN l.status = 'CLOSED_LOST' THEN 1 END) as closed_lost,

  -- Conversion metrics
  CASE
    WHEN COUNT(l.id) > 0
    THEN ROUND((COUNT(CASE WHEN l.status = 'CLOSED_WON' THEN 1 END)::DECIMAL / COUNT(l.id) * 100), 2)
    ELSE 0
  END as conversion_rate,

  -- Response metrics
  AVG(EXTRACT(EPOCH FROM (l.last_contacted_at - l.created_at)) / 60)::INTEGER as avg_first_response_minutes,

  -- Revenue
  SUM(CASE WHEN l.status = 'CLOSED_WON' THEN l.commission_amount ELSE 0 END) as total_commission,
  AVG(CASE WHEN l.status = 'CLOSED_WON' THEN l.deal_value ELSE NULL END) as avg_deal_value,

  -- Activity counts
  COUNT(DISTINCT pc.id) as total_calls,
  COUNT(DISTINCT e.id) as total_emails,
  COUNT(DISTINCT wm.id) as total_whatsapp,
  COUNT(DISTINCT pv.id) as total_viewings,

  u.status,
  u.available

FROM users u
LEFT JOIN leads l ON u.id = l.assigned_agent_id
LEFT JOIN phone_calls pc ON l.id = pc.lead_id
LEFT JOIN emails e ON l.id = e.lead_id
LEFT JOIN whatsapp_messages wm ON l.id = wm.lead_id
LEFT JOIN property_viewings pv ON l.id = pv.lead_id

WHERE u.role = 'agent'

GROUP BY u.id, u.first_name, u.last_name, u.email, u.status, u.available;

CREATE INDEX idx_agent_perf_conversion ON agent_performance_view(conversion_rate DESC);
CREATE INDEX idx_agent_perf_response ON agent_performance_view(avg_first_response_minutes);
```

---

## 12. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Web Application                                    │  │
│  │                                                            │  │
│  │  Agent View:                                              │  │
│  │  ├─ My Leads Dashboard                                    │  │
│  │  ├─ Lead Details Page                                     │  │
│  │  ├─ Communication Interface (WhatsApp/Email/Call)        │  │
│  │  ├─ Calendar & Reminders                                  │  │
│  │  └─ Performance Dashboard                                 │  │
│  │                                                            │  │
│  │  Manager View:                                            │  │
│  │  ├─ All Leads Dashboard                                   │  │
│  │  ├─ Team Performance Analytics                            │  │
│  │  ├─ Lead Assignment Interface                             │  │
│  │  ├─ Agent Monitoring                                      │  │
│  │  └─ Reports & Insights                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase Client SDK                                      │  │
│  │  ├─ Real-time Subscriptions (New leads, updates)         │  │
│  │  ├─ Database Queries                                      │  │
│  │  ├─ Authentication                                        │  │
│  │  └─ File Storage                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase (PostgreSQL + Edge Functions)                   │  │
│  │                                                            │  │
│  │  Database:                                                │  │
│  │  ├─ leads                                                 │  │
│  │  ├─ users (agents, managers)                              │  │
│  │  ├─ lead_activities                                       │  │
│  │  ├─ lead_assignments                                      │  │
│  │  ├─ lead_status_history                                   │  │
│  │  ├─ property_viewings                                     │  │
│  │  ├─ phone_calls, emails, whatsapp_messages               │  │
│  │  └─ lead_notes, lead_reminders                            │  │
│  │                                                            │  │
│  │  Edge Functions:                                          │  │
│  │  ├─ /api/leads/assign → Auto-assign leads                │  │
│  │  ├─ /api/leads/score → Calculate lead scores             │  │
│  │  ├─ /webhooks/whatsapp → Handle WhatsApp messages        │  │
│  │  ├─ /webhooks/sendgrid → Track email opens/clicks        │  │
│  │  ├─ /automation/reminders → Process scheduled reminders  │  │
│  │  └─ /analytics/calculate → Generate reports              │  │
│  │                                                            │  │
│  │  Real-time:                                               │  │
│  │  ├─ Lead creation notifications                           │  │
│  │  ├─ Status updates                                        │  │
│  │  ├─ Activity feed updates                                 │  │
│  │  └─ Performance metrics refresh                           │  │
│  │                                                            │  │
│  │  Row Level Security:                                      │  │
│  │  ├─ Agents see only their assigned leads                 │  │
│  │  ├─ Managers see all team leads                           │  │
│  │  └─ Activity logs visible to assigned agent + manager    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │  WhatsApp Business │  │  SendGrid (Email)  │               │
│  │  API               │  │  ├─ Send emails    │               │
│  │  ├─ Send messages  │  │  ├─ Track opens    │               │
│  │  ├─ Receive msgs   │  │  └─ Track clicks   │               │
│  │  └─ Templates      │  └────────────────────┘               │
│  └────────────────────┘                                        │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │  Twilio (SMS/Calls)│  │  Pusher (Realtime) │               │
│  │  ├─ Send SMS       │  │  └─ Notifications  │               │
│  │  └─ Call tracking  │  └────────────────────┘               │
│  └────────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ (UI library)
- TypeScript (Type safety)
- Vite (Build tool)
- TailwindCSS (Styling)
- React Router (Navigation)
- Recharts (Analytics visualization)
- @supabase/supabase-js (Backend client)

**Backend:**
- Supabase
  - PostgreSQL (Database)
  - PostgREST (Auto API)
  - Edge Functions (Serverless - Deno)
  - Realtime (WebSocket subscriptions)
  - Auth (User management)

**External Integrations:**
- WhatsApp Business API
- SendGrid (Email)
- Twilio (SMS/Voice)
- Google Maps (Geocoding)

---

## 13. FLOW DIAGRAM (TEXT FORMAT)

```
┌═════════════════════════════════════════════════════════════════┐
│                    COMPLETE LEAD MANAGEMENT FLOW                 │
└═════════════════════════════════════════════════════════════════┘

[1] LEAD GENERATION
    ↓
    Lead captured from:
    ├─ Campaign (Facebook/Instagram/Google)
    ├─ Website contact form
    ├─ WhatsApp direct message
    ├─ Phone call (tracked number)
    └─ Walk-in or referral
    ↓
[2] LEAD STORED
    ↓
    Database INSERT:
    ├─ Personal info (name, email, phone)
    ├─ Requirements (budget, location, property type)
    ├─ Attribution (source, campaign, UTM params)
    ├─ Initial status: NEW
    ├─ Initial priority: calculated based on data
    ��─ Timestamp recorded
    ↓
[3] LEAD ASSIGNMENT
    ↓
    IF auto_assignment = TRUE:
    │
    ├─ ROUND ROBIN → Next agent in rotation
    ├─ LOCATION → Agent with location expertise
    ├─ AVAILABILITY → Least loaded agent
    └─ PERFORMANCE → Best performing agent
    │
    ↓ Lead assigned to Agent
    │
    ELSE:
    │
    └─ Add to unassigned queue → Manager assigns manually
    ↓
[4] NOTIFICATIONS
    ↓
    ├─ Agent receives notification:
    │  ├─ Push notification
    │  ├─ Email alert
    │  └─ Dashboard badge
    │
    └─ Manager receives notification:
       └─ New lead assigned log
    ↓
[5] AGENT REVIEWS LEAD
    ↓
    Agent opens lead details:
    ├─ Reviews requirements
    ├─ Checks budget & timeline
    ├─ Views source information
    └─ Plans contact strategy
    ↓
[6] FIRST CONTACT (Multiple channels)
    ↓
    ├─ WhatsApp (preferred)
    ├─ Phone call
    └─ Email
    ↓
    Activity logged:
    ├─ Type: whatsapp_sent / call_made / email_sent
    ├─ Timestamp recorded
    ├─ Content saved
    └─ Status: NEW → CONTACTED
    ↓
[7] LEAD RESPONDS
    ↓
    IF response positive:
    │
    ├─ Priority: WARM/COLD → HOT
    ├─ Status: CONTACTED → INTERESTED
    ├─ Agent notified immediately
    └─ Manager sees progress update
    │
    ↓
[8] SCHEDULE VIEWING
    │
    ├─ Agent schedules viewing
    ├─ Status: INTERESTED → VIEWING_SCHEDULED
    ├─ Calendar entry created
    ├─ Confirmation sent to lead
    └─ Reminder scheduled (24h before)
    │
    ↓
[9] PROPERTY VIEWING
    │
    ├─ Viewing conducted
    ├─ Agent adds notes and feedback
    ├─ Outcome recorded (interested/not interested)
    └─ Photos/documents shared if requested
    │
    ↓
[10] NEGOTIATION (if interested)
     │
     ├─ Status: VIEWING_SCHEDULED → NEGOTIATING
     ├─ Price discussions
     ├─ Payment plan options
     ├─ Offer made & recorded
     └─ Terms finalized
     │
     ↓
[11] CLOSING
     │
     ├─────────────────┬─────────────────┐
     ↓                 ↓                 ↓
     WON               LOST              NOT INTERESTED
     │                 │                 │
     ├─ Deal value     ├─ Lost reason   ├─ Reason captured
     ├─ Commission     ├─ Competitor?   ├─ Add to nurture
     ├─ Paperwork      ├─ Budget?       ├─ Schedule follow-up
     ├─ Close date     ├─ Timeline?     └─ Mark as closed
     ├─ Agent metrics  └─ Add to
     │  updated           long-term
     └─ Manager           nurture
        notified
     │
     ↓
[12] POST-CLOSE (if won)
     │
     ├─ Customer satisfaction survey
     ├─ Request referral
     ├─ Add to VIP list
     ├─ Analytics updated
     └─ Commission processed

┌═════════════════════════════════════════════════════════════════┐
│                    PARALLEL: MANAGER MONITORING                  │
└═════════════════════════════════════════════════════════════════┘

Throughout the entire journey, Manager:

├─ Views lead in "All Leads" dashboard
├─ Monitors agent activity
├─ Tracks response times
├─ Checks lead progression
├─ Reviews notes and updates
└─ Can intervene if needed:
   ├─ Reassign if agent slow
   ├─ Escalate if hot lead neglected
   ├─ Coach agent if stuck
   └─ Optimize assignment strategy

┌═════════════════════════════════════════════════════════════════┐
│                    PARALLEL: AUTOMATION SYSTEM                   │
└═════════════════════════════════════════════════════════════════┘

Automated actions running in parallel:

├─ [NEW status] → If no contact in 1h → Remind agent
├─ [NEW status] → If no contact in 4h → Escalate to manager
├─ [CONTACTED] → If no response in 24h → Send auto follow-up
├─ [INTERESTED] → If no viewing scheduled in 48h → Remind agent
├─ [VIEWING_SCHEDULED] → Send reminder 24h before viewing
├─ [Any status] → If no activity in 7 days → Re-engagement message
└─ [HOT priority] → If no contact in 15 min → Alert manager
```

---

## 14. ADVANCED FEATURES

### 1. Auto Lead Assignment AI

**Machine Learning Model for Optimal Assignment:**

```javascript
async function aiBasedLeadAssignment(lead) {
  // Get historical conversion data
  const { data: history } = await supabase
    .from('lead_agent_match_history')
    .select(`
      lead_budget,
      lead_location,
      lead_source,
      agent_id,
      converted
    `)
    .eq('converted', true)
    .limit(1000);

  // Build feature vector for new lead
  const leadFeatures = {
    budget_range: categorizeBudget(lead.budget_min, lead.budget_max),
    location: lead.preferred_location,
    source: lead.source,
    priority: lead.priority,
    timeline: lead.move_in_timeline
  };

  // Calculate match scores for each available agent
  const agents = await getAvailableAgents();
  const agentScores = [];

  for (const agent of agents) {
    // Calculate historical success rate with similar leads
    const similarLeads = history.filter(h =>
      h.lead_budget === leadFeatures.budget_range &&
      h.lead_location === leadFeatures.location &&
      h.agent_id === agent.id
    );

    const successRate = similarLeads.length > 0
      ? similarLeads.filter(l => l.converted).length / similarLeads.length
      : agent.overall_conversion_rate;

    // Factor in current load
    const loadFactor = 1 - (agent.current_leads / agent.max_capacity);

    // Factor in response time
    const responseFactor = agent.avg_response_time < 30 ? 1.2 : 1.0;

    // Calculate final score
    const score = (successRate * 0.5) + (loadFactor * 0.3) + (responseFactor * 0.2);

    agentScores.push({ agent, score });
  }

  // Select agent with highest score
  agentScores.sort((a, b) => b.score - a.score);
  const selectedAgent = agentScores[0].agent;

  // Assign lead
  await assignLeadToAgent(lead.id, selectedAgent.id, 'system', 'ai_optimization');

  return selectedAgent;
}
```

### 2. Lead Aging Alerts

**Alert system for leads not progressing:**

```javascript
async function checkLeadAging() {
  const now = new Date();

  // Define aging thresholds
  const agingRules = [
    {
      status: 'NEW',
      threshold_hours: 1,
      severity: 'critical',
      action: 'escalate_to_manager'
    },
    {
      status: 'CONTACTED',
      threshold_hours: 48,
      severity: 'high',
      action: 'remind_agent'
    },
    {
      status: 'INTERESTED',
      threshold_hours: 72,
      severity: 'medium',
      action: 'suggest_followup'
    },
    {
      status: 'VIEWING_SCHEDULED',
      threshold_days: 7,
      severity: 'low',
      action: 'check_progress'
    }
  ];

  for (const rule of agingRules) {
    const threshold = rule.threshold_hours
      ? new Date(now - rule.threshold_hours * 60 * 60 * 1000)
      : new Date(now - rule.threshold_days * 24 * 60 * 60 * 1000);

    const { data: agedLeads } = await supabase
      .from('leads')
      .select('*, assigned_agent:users(*)')
      .eq('status', rule.status)
      .lt('updated_at', threshold);

    for (const lead of agedLeads) {
      await createAgingAlert({
        lead_id: lead.id,
        agent_id: lead.assigned_agent_id,
        severity: rule.severity,
        message: `Lead in ${rule.status} for ${rule.threshold_hours || rule.threshold_days * 24} hours`,
        action: rule.action
      });

      // Execute action
      if (rule.action === 'escalate_to_manager') {
        await notifyManager(lead.assigned_agent.manager_id, {
          title: 'Stale Lead Alert',
          lead: lead,
          agent: lead.assigned_agent
        });
      } else if (rule.action === 'remind_agent') {
        await notifyAgent(lead.assigned_agent_id, {
          title: 'Lead Needs Attention',
          lead: lead,
          priority: 'high'
        });
      }
    }
  }
}

// Run every hour
setInterval(checkLeadAging, 60 * 60 * 1000);
```

### 3. SLA Tracking (Service Level Agreement)

**Track and enforce response time SLAs:**

```javascript
const slaDefinitions = {
  HOT: {
    first_response: 15, // minutes
    follow_up: 60, // minutes
    viewing_schedule: 24 // hours
  },
  WARM: {
    first_response: 120, // 2 hours
    follow_up: 24 * 60, // 24 hours
    viewing_schedule: 48 // hours
  },
  COLD: {
    first_response: 24 * 60, // 24 hours
    follow_up: 7 * 24 * 60, // 7 days
    viewing_schedule: 14 * 24 // 14 days
  }
};

async function trackSLACompliance(leadId) {
  const lead = await getLeadDetails(leadId);
  const sla = slaDefinitions[lead.priority];

  const compliance = {
    lead_id: leadId,
    priority: lead.priority,
    checks: []
  };

  // Check first response SLA
  if (lead.last_contacted_at) {
    const responseTime = (new Date(lead.last_contacted_at) - new Date(lead.created_at)) / 60000; // minutes
    const firstResponseMet = responseTime <= sla.first_response;

    compliance.checks.push({
      metric: 'first_response',
      target: sla.first_response,
      actual: responseTime,
      met: firstResponseMet
    });

    if (!firstResponseMet) {
      // SLA breached - notify manager
      await notifyManager(lead.assigned_agent.manager_id, {
        title: 'SLA Breach',
        message: `First response SLA breached for ${lead.first_name} (${lead.priority})`,
        lead_id: leadId,
        agent_id: lead.assigned_agent_id
      });
    }
  }

  // Save compliance record
  await supabase.from('sla_compliance').insert(compliance);

  return compliance;
}
```

### 4. Intelligent Notifications System

**Smart notification system to avoid alert fatigue:**

```javascript
const notificationEngine = {
  // Prioritize notifications
  prioritize: async (notifications) => {
    return notifications.sort((a, b) => {
      const priority = { critical: 4, high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });
  },

  // Batch similar notifications
  batch: async (notifications, windowMinutes = 15) => {
    const batched = {};

    notifications.forEach(notif => {
      const key = `${notif.type}_${notif.agent_id}`;

      if (!batched[key]) {
        batched[key] = {
          type: notif.type,
          agent_id: notif.agent_id,
          items: [],
          created_at: notif.created_at
        };
      }

      batched[key].items.push(notif);
    });

    // Send batched notifications
    for (const batch of Object.values(batched)) {
      if (batch.items.length > 1) {
        await sendBatchedNotification(batch);
      } else {
        await sendNotification(batch.items[0]);
      }
    }
  },

  // Respect quiet hours
  respectQuietHours: async (notification, agentId) => {
    const agent = await getAgent(agentId);
    const now = new Date();
    const hour = now.getHours();

    if (agent.quiet_hours_enabled) {
      if (hour < agent.quiet_start || hour > agent.quiet_end) {
        // Outside quiet hours - send immediately
        return true;
      } else {
        // In quiet hours - queue for later unless critical
        if (notification.priority === 'critical') {
          return true; // Send anyway
        } else {
          await queueNotificationForLater(notification, agent.quiet_end);
          return false;
        }
      }
    }

    return true; // No quiet hours, send immediately
  },

  // Prevent duplicate notifications
  deduplicate: async (notification) => {
    const { data: recent } = await supabase
      .from('notifications')
      .select('*')
      .eq('agent_id', notification.agent_id)
      .eq('type', notification.type)
      .eq('lead_id', notification.lead_id)
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000)); // Last 5 min

    return recent.length === 0; // True if no duplicates
  }
};

async function sendSmartNotification(notification) {
  // Check for duplicates
  if (!await notificationEngine.deduplicate(notification)) {
    return { status: 'duplicate', sent: false };
  }

  // Respect quiet hours
  if (!await notificationEngine.respectQuietHours(notification, notification.agent_id)) {
    return { status: 'queued', sent: false };
  }

  // Send notification
  await sendNotification(notification);

  return { status: 'sent', sent: true };
}
```

---

## SUMMARY

This Real Estate CRM Lead Management System provides:

1. **Complete Lead Lifecycle Management** - From capture to conversion
2. **Role-Based Access** - Separate views for Agents and Managers
3. **Intelligent Assignment** - Multiple assignment strategies including AI-based
4. **Multi-Channel Communication** - WhatsApp, Email, Phone, SMS
5. **Activity Tracking** - Complete timeline of all lead interactions
6. **Performance Analytics** - Individual and team metrics
7. **Automation** - Follow-ups, reminders, alerts, escalations
8. **Smart Features** - Lead scoring, prioritization, SLA tracking
9. **Real-time Updates** - Live notifications and dashboard updates
10. **Scalable Architecture** - Built on modern, cloud-native stack

The system ensures no lead falls through the cracks while providing agents with the tools they need to convert efficiently and managers with visibility to optimize team performance.

---

**Document Version:** 1.0
**Last Updated:** March 26, 2026
**System:** Real Estate CRM - Lead Management
