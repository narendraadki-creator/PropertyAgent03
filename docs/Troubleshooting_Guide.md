# Campaign Management System - Troubleshooting Guide

## Issue: "Loading campaigns..." Never Finishes

### Problem
After clicking "OK" on the success dialog, the page shows "Loading campaigns..." indefinitely and no campaign cards appear.

### Root Cause
The campaigns were created without an `agent_id`, so the fetch query filtered them out.

### Solution Applied
1. ✅ Updated seed function to include current user's ID as `agent_id`
2. ✅ Cleaned up orphaned campaigns (11 campaigns without agent_id)
3. ✅ Improved fetch logic with better error handling and logging

### How to Fix If Still Happening
1. Open browser console (F12)
2. Check for errors
3. Look for log message: "Fetched campaigns: X" (should show a number > 0)
4. If it shows 0, refresh the page and try "Add Sample Data" again

---

## Issue: "Failed to seed campaign data" - Check Constraint Error

### Problem
Error message: `new row for relation "campaigns" violates check constraint "campaigns_campaign_type_check"`

### Root Cause
Using invalid campaign types. Only these are allowed:
- `launch`
- `promotion`
- `milestone`
- `price_drop`
- `custom`

### Solution Applied
✅ Updated all sample campaigns to use valid types:
- Luxury Waterfront → `launch`
- First-Time Buyer → `promotion`
- Investment Opportunity → `price_drop`

---

## Issue: No Authentication / User Not Found

### Problem
Error: "You must be logged in to seed campaign data"

### Solution
1. Check if you're logged in (top-right corner)
2. If not, sign up or log in
3. Ensure you're using Agent role
4. Try seeding again

---

## Issue: RLS Policy Denying Access

### Problem
Error about permissions or "new row violates row-level security policy"

### Check RLS Policies
```sql
-- Check if authenticated users can insert campaigns
SELECT * FROM pg_policies WHERE tablename = 'campaigns' AND cmd = 'INSERT';
```

### Expected Policies
- Agents can insert campaigns with their own agent_id
- Anon users can insert (for seeding without auth)

---

## Issue: Campaigns Show But No Details Load

### Problem
Campaign list appears but clicking a card shows empty detail page

### Solution
1. Check browser console for 404 errors
2. Verify campaign IDs are valid UUIDs
3. Check RLS policies allow reading campaign details
4. Ensure all related tables have proper data:
   - `campaign_properties`
   - `campaign_leads`
   - `campaign_analytics`
   - `campaign_activities`

---

## Issue: Analytics Show 0 or NaN

### Problem
Analytics tab shows incorrect calculations (0, NaN, Infinity)

### Root Cause
Missing or invalid analytics data

### Solution
The seed function creates 30 days of analytics data. If missing:
1. Check if `campaign_analytics` table has data
2. Verify calculations in component
3. Ensure numeric fields are not null

---

## Issue: Budget Split Doesn't Total 100%

### Problem
Budget percentages don't add up to 100% or total budget

### Solution
1. Check that all channel budgets are numbers (not strings)
2. Verify total budget is set correctly
3. Click "Auto Optimize" to recalculate
4. Ensure no negative values

---

## Issue: Images Not Loading (Broken Image Icons)

### Problem
Property images show broken image icons

### Root Cause
External URLs from Pexels might be blocked or slow

### Solution
1. Check internet connection
2. Check if firewall blocks external images
3. Verify URLs in browser:
   - https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg
   - https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg
   - https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg

---

## Issue: Status Changes Don't Work

### Problem
Clicking "Launch", "Pause", or "Resume" doesn't change status

### Debug Steps
1. Open browser console
2. Click status button
3. Check for errors
4. Verify user has permission to update campaign
5. Check RLS policies for UPDATE operations

---

## Issue: Mobile View Broken

### Problem
Layout breaks on mobile screens

### Solution
1. Clear browser cache
2. Refresh page
3. Check viewport meta tag in index.html
4. Test on actual device (not just dev tools)

---

## Common Database Issues

### Check Supabase Connection
```javascript
// In browser console
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

### Verify Tables Exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'campaign%'
ORDER BY table_name;
```

Expected tables:
- campaigns
- campaign_activities
- campaign_analytics
- campaign_automation
- campaign_leads
- campaign_properties

### Check Data Seeding
```sql
-- Count records in each table
SELECT 'campaigns' as table_name, COUNT(*) FROM campaigns
UNION ALL
SELECT 'campaign_leads', COUNT(*) FROM campaign_leads
UNION ALL
SELECT 'campaign_analytics', COUNT(*) FROM campaign_analytics
UNION ALL
SELECT 'campaign_activities', COUNT(*) FROM campaign_activities;
```

---

## Browser Console Commands for Debugging

### Check Current User
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user?.id);
```

### Manually Fetch Campaigns
```javascript
const { data, error } = await supabase
  .from('campaigns')
  .select('*')
  .eq('agent_id', user?.id);
console.log('Campaigns:', data, 'Error:', error);
```

### Check Campaign Count
```javascript
const { count } = await supabase
  .from('campaigns')
  .select('*', { count: 'exact', head: true })
  .eq('agent_id', user?.id);
console.log('Total campaigns:', count);
```

---

## Network Issues

### Check API Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click "Add Sample Data"
4. Look for requests to Supabase:
   - POST to `/rest/v1/projects`
   - POST to `/rest/v1/campaigns`
   - POST to `/rest/v1/campaign_leads`
   - POST to `/rest/v1/campaign_analytics`
   - POST to `/rest/v1/campaign_activities`

### Expected Response Status
- 200 OK (if RLS allows)
- 201 Created (successful insert)
- 400 Bad Request (check constraint violation)
- 401 Unauthorized (authentication issue)
- 403 Forbidden (RLS policy denying access)

---

## Performance Issues

### Slow Loading
If campaigns take > 5 seconds to load:

1. Check database indexes
2. Verify RLS policies are not too complex
3. Check network latency to Supabase
4. Consider pagination for large datasets

### Memory Issues
If browser becomes slow:

1. Clear browser cache
2. Close unused tabs
3. Check for memory leaks in console
4. Reduce analytics data range

---

## Quick Reset Procedure

If everything is broken and you want to start fresh:

### Step 1: Delete All Campaign Data
```sql
-- WARNING: This deletes ALL campaign data!
DELETE FROM campaign_activities;
DELETE FROM campaign_analytics;
DELETE FROM campaign_leads;
DELETE FROM campaign_properties;
DELETE FROM campaign_automation;
DELETE FROM campaigns;
DELETE FROM projects;
```

### Step 2: Refresh Browser
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear cache and reload

### Step 3: Seed Again
- Navigate to Campaigns page
- Click "Add Sample Data"
- Wait for success message
- Click "OK"
- Campaigns should appear

---

## Still Having Issues?

### Collect Debug Information
1. Browser console logs
2. Network tab showing failed requests
3. Screenshot of error message
4. Steps to reproduce

### Check These Files
- `/src/utils/seedCampaignData.ts` - Seeding logic
- `/src/pages/AgentCampaigns.tsx` - Campaign list page
- `/src/pages/AgentCampaignDetail.tsx` - Campaign detail page
- `/src/lib/supabase.ts` - Supabase client config
- `.env` - Environment variables

### Environment Variables
Verify your `.env` file contains:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Known Limitations

1. **Authentication Required**: You must be logged in to create/view campaigns
2. **Agent Role Only**: Campaigns are agent-specific (filtered by agent_id)
3. **External Images**: Property images load from Pexels (requires internet)
4. **Sample Data**: Seeding creates 3 campaigns + all related data (~100 DB rows)
5. **No Duplicate Protection**: Clicking "Add Sample Data" multiple times creates duplicates

---

## Testing Checklist After Fixes

- [ ] Refresh page completely (Ctrl+Shift+R)
- [ ] Verify you're logged in
- [ ] Check browser console has no errors
- [ ] Navigate to Campaigns page
- [ ] Click "Add Sample Data"
- [ ] Wait 5-10 seconds
- [ ] Click "OK" on success dialog
- [ ] Verify 3 campaign cards appear
- [ ] Click on first campaign
- [ ] Verify detail page loads with all sections
- [ ] Check console log shows: "Fetched campaigns: 3"

---

**Last Updated:** March 23, 2026
**Version:** 1.1 (with agent_id fixes)
