# Debugging seller admin login (GET /admin/users/me 401)

If a seller gets **401 Unauthorized** on `GET /admin/users/me` after a successful login (`POST /auth/user/emailpass` and `POST /auth/session` return 200), use the steps below.

## 1. Enable debug logs

In `b2b-medusa/.env` set:

```env
DEBUG_ADMIN_AUTH=true
```

Restart the backend (`npm run dev`). Leave the terminal visible.

## 2. Reproduce the issue

1. Open the Medusa admin login page (e.g. http://localhost:9000/app/login).
2. Sign in with a **seller** account (same email/password used when signing up as seller).
3. Watch the **terminal** (backend) when the dashboard loads and `GET /admin/users/me` is called.

## 3. Interpret terminal output

Look for lines like:

- **`[admin-auth debug] request (before auth)`** – from the first middleware (runs **before** `authenticate()`). So you see this even when the request later gets 401. Check:
  - **`hasCookie`**: if `false`, the browser is not sending the session cookie (e.g. missing `credentials: 'include'` or wrong domain).
  - **`hasSession`**: if `false`, the server hasn’t attached a session to the request yet when our middleware runs (middleware order or session store issue).

- **`[admin-auth debug]`** – from `registerLoggedInUser` (only if `authenticate()` passed):
  - `hasCookie`: whether the request had a `Cookie` header.
  - `hasSession`: whether `req.session` was set (by the framework).
  - `auth_context`: value set by the framework after validating the session.
  - `userId` / `actorType`: if present and `actorType === "user"`, we register `loggedInUser`.

- **`[admin-seller-context debug]`** – from `adminSellerContext`:
  - `hasAuthContext`, `actor_id`, `actor_type`: same idea.

**Common cases:**

| What you see | Likely cause |
|--------------|--------------|
| `hasCookie: false` on `GET /admin/users/me` | Browser is not sending the session cookie. Admin app must use `credentials: 'include'` (or equivalent) for requests to the backend. |
| `hasCookie: true`, `hasSession: false`, `auth_context: (none)` | Session cookie is sent but the framework has not attached the session to `req` when our middlewares run, or session store didn’t find it. Check that the backend that set the cookie (e.g. after `POST /auth/session`) is the same origin/port and that `COOKIE_SECRET` and session store are correct. |
| `hasSession: true`, `auth_context: (none)` | Session exists but has no `auth_context`. The login/session flow may not be storing the user’s auth context in the session (e.g. wrong actor type or missing step after `POST /auth/session`). |
| `auth_context` present, `actorType` not `"user"` | Session is for a different actor (e.g. customer). Seller must log in via the **admin** login (user actor), not the storefront (customer). |

## 4. How the seller should log in

- Sellers use the **same** Medusa admin URL and login form as full admins (e.g. http://localhost:9000/app/login).
- They use the **same** email and password they set when they signed up as a seller (that signup creates both a storefront customer and an admin user).
- They do **not** use the storefront customer login for the dashboard; that would set a customer session, and `GET /admin/users/me` expects a **user** (admin) session.

If you use “Sign up as seller” on the admin login page, after signup use “Sign in” on that same page with the new email/password to open the dashboard (no separate “seller login” URL).
