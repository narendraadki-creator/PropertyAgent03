# Authentication Debugging Guide

## The "Must Be Logged In" Error

This is the most common error when trying to seed campaign data. Here's how to fix it.

## Why Does This Happen?

The authentication session takes 1-2 seconds to load after the page loads. If you click "Add Sample Data" too quickly, the system doesn't detect you're logged in yet.

## The Fix (Works 99% of the Time)

### Quick Fix
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Wait 2-3 seconds** (count: one Mississippi, two Mississippi, three Mississippi)
3. **Try again**

That's it! The auth session will be loaded and ready.

---

## Detailed Debugging Steps

### Step 1: Check If You're Actually Logged In

Look at the **top-right corner** of the page:
- ✅ **Shows profile icon or name** = You're logged in
- ❌ **Shows "Login" button** = You're NOT logged in (go log in first!)

### Step 2: Open Browser Console

1. Press **F12** to open DevTools
2. Click the **Console** tab
3. Look for errors (red text)

### Step 3: Check Auth State Manually

Paste this in the console and press Enter:

```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id || 'NOT LOGGED IN');
```

**Expected output:**
```
User ID: 12345678-1234-1234-1234-123456789abc
```

**If you see:**
```
User ID: NOT LOGGED IN
```

Then you need to log in or refresh the page.

### Step 4: Check Session

Paste this in console:

```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session exists:', session ? 'YES' : 'NO');
console.log('Access token:', session?.access_token ? 'PRESENT' : 'MISSING');
```

**Expected output:**
```
Session exists: YES
Access token: PRESENT
```

### Step 5: Force Session Refresh

If session is missing, try:

```javascript
const { data, error } = await supabase.auth.refreshSession();
console.log('Refresh result:', error ? error.message : 'SUCCESS');
```

---

## Common Scenarios

### Scenario 1: Just Opened the App

**Problem:** Clicked too fast before auth loaded

**Solution:**
- Wait 2-3 seconds after page load
- OR refresh page (Ctrl+Shift+R) and wait

### Scenario 2: Been Using the App a While

**Problem:** Session expired

**Solution:**
- Log out
- Log back in
- Try again

### Scenario 3: Switching Between Tabs/Windows

**Problem:** Auth state not synced across tabs

**Solution:**
- Refresh the current tab
- Close extra tabs
- Use one tab only

### Scenario 4: Incognito/Private Mode

**Problem:** Session not persisting

**Solution:**
- Use regular browser window
- Check browser settings allow cookies
- Allow localStorage

---

## Prevention Tips

### Always Do This First
Before clicking "Add Sample Data":

1. ✅ Hard refresh (Ctrl+Shift+R)
2. ✅ Wait 3 seconds
3. ✅ Check top-right shows profile
4. ✅ Now click "Add Sample Data"

### Development Best Practices

If you're developing:
- Keep browser console open
- Watch for auth errors
- Enable localStorage in browser settings
- Don't block cookies from Supabase domain

---

## Advanced Debugging

### Check Environment Variables

Make sure `.env` file has:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...long_key_here
```

Verify in console:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));
```

### Check Supabase Client

```javascript
console.log('Supabase client:', supabase);
console.log('Auth:', supabase.auth);
```

Should show objects, not `undefined`.

### Check Network Requests

1. Open DevTools → **Network** tab
2. Filter by **Fetch/XHR**
3. Click "Add Sample Data"
4. Look for requests to Supabase

**Should see:**
- POST to `/auth/v1/user`
- POST to `/rest/v1/campaigns`
- Status: 200 or 201

**If you see:**
- Status: 401 = Not authenticated
- Status: 403 = RLS policy blocking

### Check Local Storage

In console:

```javascript
console.log('Auth tokens:', localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token'));
```

Should show a long JSON string with tokens.

If `null`, auth is not persisted.

---

## Still Not Working?

### Nuclear Option: Clear Everything

1. Open DevTools
2. Right-click the refresh button
3. Select **"Empty Cache and Hard Reload"**
4. Or manually:
   - Application tab → Clear storage → Clear site data
5. Log in again
6. Try seeding

### Check Supabase Dashboard

1. Go to Supabase dashboard
2. Click **Authentication** → **Users**
3. Verify your user exists
4. Check user ID matches what console shows

### Check RLS Policies

In Supabase SQL editor:

```sql
-- Check if anonymous can insert campaigns
SELECT * FROM pg_policies
WHERE tablename = 'campaigns'
  AND cmd = 'INSERT';
```

Should show policies allowing:
- Authenticated users to insert
- Optionally: Anonymous users (for seeding)

---

## Quick Reference

| Symptom | Fix |
|---------|-----|
| "Must be logged in" error | Hard refresh + wait 3 sec |
| Profile not showing | Log in first |
| Worked before, now broken | Session expired - log out/in |
| Console shows "User: null" | Refresh page |
| No errors but nothing happens | Check RLS policies |
| Seeding works but no campaigns show | Check agent_id matches user ID |

---

## Test Your Auth Status Right Now

Run this complete test in console:

```javascript
(async () => {
  console.log('=== AUTH STATUS TEST ===');

  const { data: { session } } = await supabase.auth.getSession();
  console.log('1. Session exists:', session ? '✅ YES' : '❌ NO');

  const { data: { user } } = await supabase.auth.getUser();
  console.log('2. User logged in:', user ? '✅ YES' : '❌ NO');

  if (user) {
    console.log('3. User ID:', user.id);
    console.log('4. Email:', user.email);
  }

  const { count } = await supabase
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', user?.id);
  console.log('5. Your campaigns:', count);

  console.log('=== TEST COMPLETE ===');
  console.log(user && session ? '✅ AUTH WORKING!' : '❌ AUTH PROBLEM!');
})();
```

**Expected output:**
```
=== AUTH STATUS TEST ===
1. Session exists: ✅ YES
2. User logged in: ✅ YES
3. User ID: abc-123-def-456
4. Email: you@example.com
5. Your campaigns: 3
=== TEST COMPLETE ===
✅ AUTH WORKING!
```

If anything shows ❌, follow the fix for that specific step.

---

**Pro Tip:** Bookmark this page and check it FIRST whenever you see auth errors!

**Last Updated:** March 23, 2026
