# Google SSO Implementation - Verification Guide

## Setup Instructions

### 1. Configure Google Client ID

Add to `.env.local` (create if it doesn't exist):

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Important:** Restart Vite dev server after adding/changing environment variables.

### 2. GIS Script Loading

Google Identity Services is loaded in:
- **File:** `index.html` (line 8)
- **Script:** `<script src="https://accounts.google.com/gsi/client" async defer></script>`

## Implementation Files

### Core Auth Files (src/auth/)

1. **googleIdentity.ts**
   - Loads and initializes Google Identity Services
   - Requests Google ID tokens (JWT)
   - Never logs full tokens (only first 10 chars in DEV mode)

2. **auth.ts**
   - Token storage (`localStorage`: `revelius_auth_token`, `revelius_auth_expires_at`)
   - Exchange Google ID token with backend (`GET /auth/login`)
   - Status check (`GET /auth/status`)
   - Token refresh (`GET /auth/refresh`)
   - Logout (`GET /auth/logout`)

3. **apiClient.ts**
   - Fetch wrapper with auto-retry on 401/403
   - Attempts refresh once, retries request once
   - Redirects to `/auth?reason=expired` if refresh fails

4. **ProtectedRoute.tsx**
   - Guards all protected routes
   - Checks token → status → refresh (if needed)
   - Redirects to `/auth?reason=expired` if authentication fails

### Updated Files

1. **pages/AuthPage.tsx**
   - Wired "Continue with Google" button to `handleGoogleSignIn()`
   - Shows error banner if `VITE_GOOGLE_CLIENT_ID` missing
   - Shows "Your session expired" banner if `?reason=expired`
   - Loading state on button during sign-in

2. **components/Header.tsx**
   - "Sign out" button in user dropdown
   - Calls `logout()` and navigates to `/auth`

3. **App.tsx**
   - `/auth` route (no sidebar/header)
   - All other routes wrapped in `<ProtectedRoute>`

## Verification Steps

### Console Logs (Development Mode Only)

Open browser DevTools Console (F12) and look for `[Auth]` prefixed messages:

**Successful Sign-In Flow:**
```
[Auth] Google ID token received: eyJhbGciOi... (1234 chars)
[Auth] Exchanging Google ID token with backend...
[Auth] Token stored: Bgu1hpqk9i...
[Auth] Status check: authenticated
[Auth] Redirecting to /auth after sign out
```

**Protected Route Check:**
```
[Auth] Status check: authenticated
```

**Token Refresh:**
```
[Auth] Received 401, attempting refresh...
[Auth] Attempting token refresh...
[Auth] Token refresh successful
[Auth] Token stored: NewToken12...
```

**Session Expired:**
```
[Auth] No token found, redirecting to login
[Auth] Authentication failed, redirecting to login
```

### Network Tab (F12 → Network)

Monitor these requests:

1. **GIS Script Load**
   - URL: `https://accounts.google.com/gsi/client`
   - Status: `200 OK`
   - Type: `script`

2. **Token Exchange**
   - URL: `GET /auth/login`
   - Headers: `Authorization: Bearer <google-id-token>`
   - Response: `{ "data": { "session_token": "...", "expires_in": 3600 }, "success": true }`

3. **Status Check**
   - URL: `GET /auth/status`
   - Headers: `Authorization: Bearer <session-token>`
   - Response: `{ "data": { "authenticated": true }, "success": true }`

4. **Token Refresh**
   - URL: `GET /auth/refresh`
   - Headers: `Authorization: Bearer <session-token>`
   - Response: `{ "data": { "session_token": "new-token" }, "success": true }`

5. **Logout**
   - URL: `GET /auth/logout`
   - Headers: `Authorization: Bearer <session-token>`
   - Response: `200 OK`

### localStorage (F12 → Application → Local Storage)

Check for these keys:

- `revelius_auth_token` - Session token after login
- `revelius_auth_expires_at` - Token expiration timestamp (ms)

### Test Scenarios

#### 1. Fresh Login
1. Navigate to `/auth`
2. Click "Continue with Google"
3. Complete Google sign-in
4. Should redirect to `/dashboard`
5. Check Console for `[Auth]` logs
6. Check Network for `/auth/login` and `/auth/status` calls
7. Check localStorage for `revelius_auth_token`

#### 2. Session Expiry
1. While logged in, clear `revelius_auth_token` from localStorage
2. Navigate to any protected route (e.g., `/dashboard`)
3. Should redirect to `/auth?reason=expired`
4. Should show banner: "Your session expired. Please log in again."

#### 3. Token Refresh
1. While logged in, make an API call that returns 401
2. Check Console for refresh attempt
3. Check Network for `/auth/refresh` call
4. Original request should be retried automatically

#### 4. Sign Out
1. While logged in, click user icon in top-right
2. Click "Sign out"
3. Should redirect to `/auth`
4. `revelius_auth_token` should be removed from localStorage

#### 5. Missing Client ID
1. Remove `VITE_GOOGLE_CLIENT_ID` from `.env.local`
2. Restart dev server
3. Navigate to `/auth`
4. Click "Continue with Google"
5. Should show error: "Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID."

## Security Notes

- ✅ Client ID is public (safe to expose)
- ✅ No client secret in frontend
- ✅ Full tokens never logged (only first 10 chars in DEV)
- ✅ All logs are DEV-only (`import.meta.env.DEV`)
- ✅ Tokens stored in localStorage (same-origin only)
- ✅ All API calls use `credentials: 'include'` for cookie support
- ✅ Authorization header sent as `Bearer <token>`

## Troubleshooting

### "Google Identity Services not loaded"
- Check Network tab for GIS script (`accounts.google.com/gsi/client`)
- Ad blockers may block Google scripts
- Try refreshing page

### "Sign-in popup blocked"
- Browser may block popups
- Check browser popup settings for localhost
- GIS uses a special popup/prompt that usually bypasses blockers

### "Backend exchange failed"
- Check Network tab for `/auth/login` response
- Verify backend is configured to accept Google ID tokens
- Check backend logs for errors

### "Session expired" loop
- Check if `/auth/status` endpoint exists and is working
- Verify token is being stored correctly in localStorage
- Check if backend token format matches what frontend expects

### Environment variable not working
- Ensure `.env.local` is in project root
- Restart dev server after changing `.env` files
- Check file is not named `.env.local.txt` or similar
