# Campaign Detail Page - Header Section Testing Guide

## Pre-Test Setup

1. **Navigate to Campaigns Page**
   - Open browser to `http://localhost:5173/agent/campaigns`
   - If no campaigns exist, click "Add Sample Data" button

2. **Open Browser Console**
   - Press F12 or right-click > Inspect
   - Go to Console tab
   - Keep it open to see debug logs

## Test 1: Header Display Elements

**Steps:**
1. Click on any campaign card from the campaigns list
2. Verify the header displays:
   - ✅ Campaign name in large bold text (e.g., "Grand Launch Campaign")
   - ✅ Status badge next to name with color:
     - Draft = Gray background
     - Active = Green background
     - Paused = Yellow background
     - Completed = Blue background
   - ✅ Campaign description below title in light teal color
   - ✅ Clock icon with duration dates
   - ✅ "Back to Campaigns" button at top

**Expected Result:**
- All header elements visible and properly formatted
- Status badge has correct color for campaign status
- Dates display in readable format (MM/DD/YYYY)

## Test 2: Back Button Navigation

**Steps:**
1. From campaign detail page, click "Back to Campaigns" button (top left)

**Expected Result:**
- Navigates back to `/agent/campaigns` page
- Campaign list is visible

**Console Check:**
- No errors in console

## Test 3: Duplicate Button

**Steps:**
1. Navigate to a campaign detail page
2. Look at the browser console
3. Click the "Duplicate" button (top right, has copy icon)

**Expected Console Logs:**
```
Duplicate button clicked
Current campaign: {object with campaign data}
Current user: {user-id}
Creating new campaign: {new campaign object}
Campaign duplicated successfully: {new campaign data}
```

**Expected Result:**
- Alert appears: "Campaign duplicated successfully!"
- Page navigates to new campaign detail page
- New campaign URL is different (different ID)
- New campaign title has "(Copy)" suffix
- New campaign status is "draft"
- All other data matches original campaign

**Console Check:**
- No errors in red
- All logs appear as shown above
- New campaign has different ID than original

## Test 4: Edit Button

**Steps:**
1. Navigate to a campaign detail page (go back to campaigns list and click a campaign)
2. Click the "Edit" button (top right, has edit icon)

**Expected Console Logs:**
```
Fetching campaign data for edit page, ID: {campaign-id}
Projects loaded: {number}
Campaign loaded: {campaign object}
Setting form data from campaign: {campaign object}
```

**Expected Result:**
- Page navigates to `/agent/campaigns/{id}/edit`
- Edit page loads with 4-step wizard
- Step 1 shows pre-filled form fields:
  - Project dropdown has campaign's project selected
  - Title field contains campaign title
  - Description contains campaign description
  - Campaign type button is highlighted
  - Budget field shows campaign budget
  - Start/End dates are filled in

**Console Check:**
- All console logs appear
- No errors
- Campaign data loads successfully

## Test 5: Edit Page Functionality

**Steps:**
1. On edit page (Step 1), modify the title (add " - Updated" to end)
2. Click "Next" button
3. Step 2: Verify platforms are pre-selected (checkmarks shown)
4. Click "Next" button
5. Step 3: Content should be pre-loaded if it exists
6. Click "Next" button
7. Step 4: Click "Update Campaign" button

**Expected Result:**
- Form advances through all 4 steps
- Pre-selected values are maintained
- Update Campaign button saves changes
- Alert appears: "Campaign updated successfully!"
- Navigates back to campaign detail page
- Title now shows " - Updated" suffix

## Test 6: Status Change Buttons

**Steps:**
1. Navigate to a campaign with status = "draft"
2. Verify "Launch Campaign" button is visible (green, with play icon)
3. Click "Launch Campaign"

**Expected Result:**
- Status badge changes from gray to green
- Status text changes from "draft" to "active"
- Button changes to "Pause" (yellow, with pause icon)

**Additional Tests:**
4. Click "Pause" button
5. Verify status changes to "paused" (yellow badge)
6. Verify button changes to "Resume" (green, with play icon)
7. Click "Resume"
8. Verify status changes back to "active" (green badge)

**Console Check:**
- No errors during status changes
- Page updates without refresh

## Common Issues & Solutions

### Issue: Buttons don't respond to clicks
**Check:**
- Open console and look for JavaScript errors
- Verify you're clicking the button, not just hovering
- Check if alert() is being blocked by browser

### Issue: Duplicate creates error
**Check Console for:**
- "Duplicate error: {message}" - Shows what field is causing the issue
- RLS policy errors - User may not have permission
- Missing required fields - Check campaign data integrity

**Solution:**
- Check console for specific error message
- Verify campaign has all required fields (project_id, campaign_type, etc.)

### Issue: Edit page shows blank form
**Check Console for:**
- "No campaign found with ID: {id}"
- Any Supabase query errors

**Solution:**
- Verify campaign ID in URL is valid
- Check if campaign exists in database
- Verify RLS policies allow reading campaign

### Issue: Navigation doesn't work
**Check:**
- Browser console for routing errors
- Verify the route is registered in App.tsx
- Check React Router version compatibility

## Database Verification

If buttons still don't work, verify database state:

```sql
-- Check if campaign exists
SELECT id, title, status, start_date, end_date
FROM campaigns
WHERE id = '{your-campaign-id}';

-- Check if duplicate was created
SELECT id, title, status, created_at
FROM campaigns
WHERE title LIKE '%Copy%'
ORDER BY created_at DESC
LIMIT 5;
```

## Success Criteria

✅ All header elements display correctly
✅ Back button navigates to campaigns list
✅ Duplicate button creates new campaign with "(Copy)" suffix
✅ Edit button opens edit page with pre-filled data
✅ Edit page allows updating campaign
✅ Status buttons change campaign status
✅ No console errors during any operations
✅ All navigation works smoothly

## Debug Mode

To enable verbose logging:
1. All debug logs are already added
2. Open browser console before testing
3. Look for specific log messages mentioned in each test
4. Copy any error messages for troubleshooting
