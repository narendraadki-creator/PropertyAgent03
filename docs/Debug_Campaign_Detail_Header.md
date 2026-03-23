# Debug: Campaign Detail Header Issues

## Service Worker Error (Can be Ignored)

The error you're seeing:
```
TypeError: Cannot navigate to URL: https://...local-credentialless.webcontainer-api.io/agent/campaigns
```

This is a **WebContainer service worker issue** and does NOT affect the actual functionality. It's just a warning in the console.

## How to Test if Buttons Actually Work

### Test 1: Click on a Campaign Card

1. Go to `/agent/campaigns`
2. Open browser console (F12)
3. Click on any campaign card
4. **What to check:**
   - Does the page navigate to `/agent/campaigns/{id}`?
   - Does the detail page load?
   - Do you see the campaign name in the header?

### Test 2: Click Duplicate Button

1. On campaign detail page, open console
2. Click the "Duplicate" button
3. **Look for these console logs:**
   ```
   Duplicate button clicked
   Current campaign: {...}
   Current user: abc-123
   Creating new campaign: {...}
   Campaign duplicated successfully: {...}
   ```
4. **What should happen:**
   - Alert box appears: "Campaign duplicated successfully!"
   - Page navigates to new campaign
   - New campaign has "(Copy)" in title

### Test 3: Click Edit Button

1. On campaign detail page
2. Click "Edit" button
3. **Look for these console logs:**
   ```
   Fetching campaign data for edit page, ID: abc-123
   Projects loaded: 5
   Campaign loaded: {...}
   Setting form data from campaign: {...}
   ```
4. **What should happen:**
   - Page navigates to `/agent/campaigns/{id}/edit`
   - Edit form appears with 4 steps
   - Form is pre-filled with campaign data

## Common Scenarios

### Scenario 1: Buttons Don't Do Anything

**Symptom:** Click button, nothing happens
**Check:**
- Are there JavaScript errors in console (in red)?
- Is the button actually clickable? (cursor should change to pointer on hover)
- Try clicking multiple times

**If you see this error:**
```
ReferenceError: navigate is not defined
```
**Solution:** There's a React Router issue

**If you see this error:**
```
Duplicate error: duplicate key value violates unique constraint
```
**Solution:** A campaign with that title already exists

### Scenario 2: Page Doesn't Navigate

**Symptom:** Alert appears but page doesn't change
**Check:**
- Does the URL in the address bar change?
- Does the console show "Navigating to: /agent/campaigns/xyz"?
- Is there a React Router error?

### Scenario 3: Edit Page Shows Blank Form

**Symptom:** Edit page loads but no data appears
**Check console for:**
```
No campaign found with ID: abc-123
```
**Solution:** Campaign doesn't exist or RLS policy blocks access

## Verify What's Actually Not Working

Please specify:
1. **Which button doesn't work?**
   - [ ] Back to Campaigns
   - [ ] Duplicate
   - [ ] Edit
   - [ ] Launch/Pause/Resume (status buttons)

2. **What happens when you click it?**
   - [ ] Nothing at all
   - [ ] Error in console
   - [ ] Alert appears but navigation fails
   - [ ] Page navigates but shows error

3. **Console output:**
   - Copy and paste any red errors
   - Copy and paste the logs when you click the button

## Quick Fix: Clear Browser Cache

Sometimes the issue is cached JavaScript:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Try again

## Database Check

Run this to verify campaigns exist:
```sql
SELECT id, title, status, project_id, agent_id, campaign_type
FROM campaigns
ORDER BY created_at DESC
LIMIT 5;
```

If all fields are populated, the buttons should work.

## Still Not Working?

If buttons still don't respond:
1. Take a screenshot of the page
2. Copy all console output (including warnings)
3. Tell me exactly which button and what happens
4. I'll create a targeted fix
