# Google SSO Authentication Implementation

## Overview

This document describes the hardened Google SSO authentication implementation in the Revelius React app.

## Architecture

### File Structure

```
src/
├── lib/
│   └── auth/
│       ├── logger.ts          # Dev-only authentication logger
│       ├── storage.ts         # Token storage utilities (localStorage)
│       ├── api.ts             # Auth API calls (login, status, refresh, logout)
│       └── googleAuth.ts      # Google Identity Services integration
├── components/
│   ├── ProtectedRoute.tsx     # Route protection component
│   └── Header.tsx             # Updated with sign-out functionality
├── pages/
│   └── AuthPage.tsx           # Google SSO login page
├── config/
│   └── env.ts                 # Updated with VITE_GOOGLE_CLIENT_ID
└── App.tsx                    # Updated with protected routes
```

## Implementation Details

### 1. Dev-Only Logging (`lib/auth/logger.ts`)

All authentication milestones are logged **only in development mode** (`import.meta.env.DEV`):

- ✅ GIS loaded
- 🔘 Login button clicked
- 🎫 Google credential received (first 16 chars + length)
- 🔍 Decoded JWT payload (aud, exp, iss, email)
- ❌ Client ID mismatch (if any)
- 🔄 Exchanging token with backend
- ✅ Backend exchange success (status code + token/cookie mode)
- 💾 Stored app token (first 10 chars only)
- 🍪 Cookie session mode
- ✅ Auth status ok
- ❌ Auth status failed
- 🚀 Redirecting to dashboard
- 🔄 Token refresh attempts

**To view logs:** Open browser DevTools Console (F12) while in development mode.

### 2. Token Storage (`lib/auth/storage.ts`)

Manages authentication tokens in localStorage:

- `revelius_session_token` - Main session token
- `revelius_refresh_token` - Refresh token (optional)
- `revelius_token_expires_at` - Token expiration timestamp

Functions:
- `storeTokens()` - Store session and refresh tokens
- `getTokens()` - Retrieve all stored tokens
- `getSessionToken()` - Get session token (most common)
- `clearTokens()` - Clear all tokens (on logout)
- `hasTokens()` - Check if tokens exist

### 3. Auth API (`lib/auth/api.ts`)

Handles communication with backend authentication endpoints:

#### Endpoints Used:
- `GET /auth/login` - Exchange Google ID token for backend session
- `GET /auth/status` - Check authentication status
- `GET /auth/refresh` - Refresh authentication token
- `GET /auth/logout` - Sign out

#### Functions:
- `exchangeGoogleToken(googleIdToken)` - Exchange Google token with backend
- `checkAuthStatus()` - Verify authentication status
- `refreshAuthToken()` - Refresh expired token
- `logout()` - Sign out and clear tokens
- `verifyAuthWithRefresh()` - Check status with automatic refresh fallback

### 4. Google SSO Integration (`lib/auth/googleAuth.ts`)

Manages Google Identity Services (GIS) flow:

#### Key Features:
- Loads GIS script from `https://accounts.google.com/gsi/client`
- Decodes JWT payload (without signature verification - done on backend)
- Validates JWT audience (`aud`) matches configured `VITE_GOOGLE_CLIENT_ID`
- Guards against missing credentials
- Handles GIS initialization and callback

#### Validation Guards:
- ❌ Missing credential → "Google sign-in did not return a token."
- ❌ Failed JWT decode → "Failed to decode Google credential"
- ❌ Audience mismatch → "Client ID mismatch: token audience does not match this app."

### 5. Protected Routes (`components/ProtectedRoute.tsx`)

Protects all app routes by:

1. **Quick check:** If no tokens exist → redirect to `/auth?reason=expired`
2. **Backend verification:** Calls `verifyAuthWithRefresh()`:
   - Checks auth status with `GET /auth/status`
   - If unauthorized → attempts refresh with `GET /auth/refresh`
   - If still unauthorized → redirect to `/auth?reason=expired`
3. **Loading state:** Shows spinner while checking authentication

### 6. Auth Page (`pages/AuthPage.tsx`)

Full-featured authentication page with:

#### UI Features:
- Animated gradient background
- Particles.js animation
- Frosted glass card design
- Dismissible error banner
- Loading state
- Dramatic button hover animation

#### Error Handling:
- GIS not loaded
- Google Client ID not configured
- Popup blocked
- No credential returned
- Backend exchange failed (with status code)
- Status check failed / expired session
- Session expired message (from `?reason=expired` query param)

#### Flow:
1. Page loads → Load GIS script
2. GIS ready → Initialize with client ID and callback
3. User clicks "Continue with Google" → Trigger GIS prompt
4. GIS callback receives credential → Validate and exchange
5. Exchange success → Verify status → Redirect to `/dashboard`

### 7. App Routes (`App.tsx`)

Routes are split into two groups:

#### Unprotected:
- `/auth` - Authentication page (no sidebar/header)

#### Protected (wrapped in `<ProtectedRoute>`):
- `/` - Dashboard
- All other app routes (merchants, scans, transactions, etc.)

Protected routes automatically check authentication on mount and when route changes.

### 8. Sign Out (`components/Header.tsx`)

User dropdown in header includes "Sign out" button:

1. Calls `GET /auth/logout` on backend
2. Clears local tokens with `clearTokens()`
3. Redirects to `/auth`

## Configuration

### Environment Variables

Add to `.env` or `.env.local`:

```bash
# Google OAuth2 Client ID (required for SSO)
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com

# Existing API config
VITE_REVELIUS_API_BASE_URL=https://api.revelius.com
VITE_REVELIUS_ACCESS_KEY=your-access-key
VITE_REVELIUS_SECRET_KEY=your-secret-key
```

**Important:** The `VITE_GOOGLE_CLIENT_ID` must match the client ID configured in your Google Cloud Console OAuth2 credentials.

## Testing & Verification

### Console Logs (Development Mode Only)

Open browser DevTools Console (F12) and look for `[Auth]` prefixed messages:

```
[Auth] ✅ GIS loaded (window.google.accounts.id exists)
[Auth] 🔘 Login button clicked
[Auth] 🎫 Google credential received: eyJhbGciOiJSUzI... (1234 chars)
[Auth] 🔍 Decoded JWT payload: { aud: "...", exp: ..., iss: "...", email: "..." }
[Auth] 🔄 Exchanging token with backend...
[Auth] ✅ Backend exchange success (200) - token mode
[Auth] 💾 Stored app token: Bgu1hpqk9i...
[Auth] ✅ Auth status ok
[Auth] 🚀 Redirecting to /dashboard
```

### Network Tab

Monitor these requests in browser DevTools Network tab (F12 → Network):

1. **GET** `https://accounts.google.com/gsi/client` (200 OK)
   - GIS script loading

2. **GET** `https://api.revelius.com/auth/login`
   - Headers include: `Authorization: Bearer <google-id-token>`
   - Response: `{ "data": { "session_token": "...", "refresh_token": "..." }, "success": true }`

3. **GET** `https://api.revelius.com/auth/status`
   - Headers include: `Authorization: Bearer <session-token>`
   - Response: `{ "data": { "authenticated": true }, "success": true }`

4. **GET** `https://api.revelius.com/auth/refresh` (when token expires)
   - Headers include: `Authorization: Bearer <session-token>`
   - Response: `{ "data": { "session_token": "...", "refresh_token": "..." }, "success": true }`

5. **GET** `https://api.revelius.com/auth/logout` (on sign out)
   - Headers include: `Authorization: Bearer <session-token>`

### localStorage

Check browser DevTools Application/Storage → Local Storage → `http://localhost:5174`:

- `revelius_session_token` - Should contain session token after login
- `revelius_refresh_token` - Should contain refresh token (if backend provides it)
- `revelius_token_expires_at` - Should contain expiration timestamp

### Error Scenarios

Test these scenarios to verify error handling:

1. **No Google Client ID configured**
   - Remove `VITE_GOOGLE_CLIENT_ID` from `.env`
   - Reload page
   - Expected: Red error banner with message about missing client ID

2. **Block popups**
   - Block popups in browser settings for localhost
   - Click "Continue with Google"
   - Expected: Error about popup being blocked

3. **Expired session**
   - Sign in successfully
   - Manually clear `revelius_session_token` from localStorage
   - Navigate to any protected route (e.g., `/dashboard`)
   - Expected: Redirect to `/auth?reason=expired` with "Your session expired" message

4. **Backend unavailable**
   - Stop backend server
   - Try to sign in
   - Expected: Error banner with network error message

5. **Client ID mismatch**
   - Configure wrong `VITE_GOOGLE_CLIENT_ID` (not matching Google Console)
   - Try to sign in
   - Expected: Error banner about client ID mismatch

## Security Features

### Never Log Full Tokens
- Google credentials: Only first 16 chars + length logged
- Session tokens: Only first 10 chars logged
- All logs are **development-only** (`import.meta.env.DEV`)

### JWT Validation
- Decodes JWT payload locally
- Validates `aud` (audience) matches configured client ID
- Logs decoded fields: `aud`, `exp`, `iss`, `email`
- Full signature verification happens on backend

### Automatic Token Refresh
- Protected routes automatically attempt refresh on 401/403
- Refresh only attempted once per request to avoid loops
- Failure to refresh redirects to login page

### Secure Token Storage
- Tokens stored in localStorage (accessible only to same origin)
- Tokens cleared on logout
- Expired tokens trigger re-authentication

## Flow Diagrams

### Login Flow

```
User clicks "Continue with Google"
    ↓
Load GIS script (if not loaded)
    ↓
Initialize GIS with client ID + callback
    ↓
Trigger GIS prompt/popup
    ↓
User authenticates with Google
    ↓
GIS returns credential (JWT)
    ↓
Decode JWT + validate audience
    ↓
POST /auth/login with Google ID token
    ↓
Backend returns session_token + refresh_token
    ↓
Store tokens in localStorage
    ↓
GET /auth/status (verify session)
    ↓
Redirect to /dashboard
```

### Protected Route Flow

```
User navigates to protected route
    ↓
ProtectedRoute checks localStorage for tokens
    ↓
No tokens? → Redirect to /auth?reason=expired
    ↓
Tokens exist → GET /auth/status
    ↓
Status OK? → Render route
    ↓
Status 401/403? → GET /auth/refresh
    ↓
Refresh OK? → GET /auth/status again
    ↓
Status OK? → Render route
    ↓
Still 401/403? → Clear tokens → Redirect to /auth?reason=expired
```

### Sign Out Flow

```
User clicks "Sign out" in header
    ↓
GET /auth/logout
    ↓
Clear localStorage tokens
    ↓
Redirect to /auth
```

## Troubleshooting

### "GIS not loaded" error
- Check Network tab for failed GIS script load
- Check for ad blockers blocking `accounts.google.com`
- Try refreshing the page

### "Client ID mismatch" error
- Verify `VITE_GOOGLE_CLIENT_ID` in `.env` matches Google Cloud Console
- Check that you're using the Web Application client ID (not Android/iOS)
- Restart dev server after changing `.env`

### "Backend exchange failed" error
- Check Network tab for `/auth/login` response
- Verify backend is running and accessible
- Check backend logs for errors
- Verify backend is configured to accept Google ID tokens

### Protected routes not working
- Check localStorage for `revelius_session_token`
- Check `/auth/status` response in Network tab
- Look for `[Auth]` logs in Console
- Try clearing localStorage and logging in again

## Notes

- All headers sent to backend are signed headers + `Authorization: Bearer <token>`
- No custom fields added to JSON responses
- No hardcoded tokens in production code
- Uses existing `baseURL` from env config
- Compatible with both token-based and cookie-based sessions
