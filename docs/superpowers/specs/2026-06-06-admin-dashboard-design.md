# Meat Freaks Admin Dashboard - Design Spec

## Overview

A protected `/admin` area on the existing Meat Freaks site where Andy can:

1. View all incoming enquiries
2. Manage the availability calendar (block/unblock dates)

No third-party tools. No technical knowledge required. Works on mobile.

---

## Auth

### Magic Link Login

- Andy visits `/admin` and enters his email address.
- If the email matches one listed in the `ADMIN_EMAILS` environment variable, a login link is sent via Resend.
- If the email does not match, the UI shows the same "check your inbox" message but no email is sent. No information leakage.
- The login link contains a signed JWT token as a URL parameter.
- On clicking the link, the token is verified and an httpOnly secure cookie is set.
- The cookie/token is valid for 7 days. After expiry, Andy logs in again.
- No username, no password, no account creation.

### Environment Variables

| Variable | Example | Purpose |
|---|---|---|
| `ADMIN_EMAILS` | `meatfreaksltd@gmail.com` | Comma-separated list of allowed admin emails |
| `ADMIN_JWT_SECRET` | `a-random-64-char-string` | Secret for signing/verifying JWT tokens |

### Token Structure

```json
{
  "email": "meatfreaksltd@gmail.com",
  "iat": 1717689600,
  "exp": 1718294400
}
```

Signed with HS256 using `ADMIN_JWT_SECRET`.

### Cookie

- Name: `mf-admin-token`
- httpOnly: true
- secure: true (HTTPS only)
- sameSite: lax
- path: `/admin`
- maxAge: 7 days

---

## Storage - Vercel KV

All data stored in Vercel KV (Redis). Two keys:

### `booked-dates`

A JSON array of date strings in `YYYY-MM-DD` format.

```json
["2026-07-12", "2026-07-19", "2026-08-02"]
```

This replaces the current `src/data/booked-dates.json` file. The public `/api/availability` endpoint reads from KV instead of the filesystem.

### `enquiries`

A JSON array of enquiry objects. Each object matches the existing `EnquiryPayload` type with an added `id` field.

```json
[
  {
    "id": "enq_1717689600123",
    "lane": "festival",
    "eventType": "festival",
    "date": "2026-08-15",
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "phone": "07700 900123",
    "region": "Bristol",
    "guests": "100-250",
    "notes": "Food festival, outdoor pitch",
    "submittedAt": "2026-06-06T10:00:00.000Z"
  }
]
```

### Fallback

If Vercel KV is not configured (env vars missing), fall back to the existing JSON file approach for local development.

---

## Pages and Routes

### Frontend Pages

| Route | Type | Purpose |
|---|---|---|
| `/admin` | Client component | Login page - email input + "Send login link" button |
| `/admin/dashboard` | Client component | Protected dashboard - enquiries list + calendar tabs |

### API Routes

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/admin/auth` | POST | Send magic link email to verified admin email | None (email whitelist check) |
| `/api/admin/auth` | GET | Verify token from magic link, set cookie, redirect to dashboard | Token in URL |
| `/api/admin/dates` | GET | Return all booked dates | Cookie |
| `/api/admin/dates` | POST | Add a booked date `{ date: "YYYY-MM-DD" }` | Cookie |
| `/api/admin/dates` | DELETE | Remove a booked date `{ date: "YYYY-MM-DD" }` | Cookie |
| `/api/admin/enquiries` | GET | Return all enquiries (newest first) | Cookie |

### Auth Middleware

All `/api/admin/*` routes (except `/api/admin/auth` POST) verify the `mf-admin-token` cookie. If invalid or expired, return 401.

### Public API Changes

`/api/availability` is updated to read from Vercel KV instead of the JSON file.

`/api/enquiry` POST is updated to write to Vercel KV instead of the JSON file.

---

## Admin Dashboard UI

### Layout

- Dark header bar matching the site header style (charcoal bg, ember accents)
- "Meat Freaks Admin" title with a "Log out" link
- Two tab buttons: "Enquiries" and "Calendar"
- Active tab has ember underline

### Tab 1: Enquiries

- Scrollable list of all submissions, newest first
- Each enquiry is a card showing:
  - Name (bold)
  - Event type (pill/badge)
  - Date (or "Flexible" in muted text)
  - Region
  - Guests
  - Time submitted (relative, e.g. "2 hours ago")
- Tapping a card expands it to show:
  - Phone number
  - Full notes
  - Email (as a mailto link)
- No reply functionality - Andy replies via his normal email
- No delete/archive functionality for v1

### Tab 2: Calendar

- Month-view grid matching the public enquiry calendar style
- Month/year header with prev/next navigation arrows
- 7-column Mon-Sun grid
- Cell states:
  - **Available** (default): bone background, tappable
  - **Blocked**: accent background (ember), white text
  - **Past**: greyed out, not tappable
- Tapping an available date blocks it (immediate save, no confirm dialog)
- Tapping a blocked date unblocks it (immediate save)
- Toast/flash confirmation: "Date blocked" or "Date unblocked" appears briefly
- No restriction on how far ahead Andy can block dates

### Mobile Optimisation

- Dashboard is mobile-first. Andy will primarily use his phone.
- Enquiry cards are full-width, stacked vertically
- Calendar cells use `aspect-ratio: 1` for consistent touch targets
- Tabs are full-width buttons at the top
- No horizontal scrolling anywhere
- Min touch target: 48px on all interactive elements

---

## Magic Link Email

Sent via Resend using the existing `RESEND_API_KEY`.

```
From: noreply@meatfreaks.co.uk (or EMAIL_FROM env var)
To: meatfreaksltd@gmail.com
Subject: Your Meat Freaks admin login link

Hi Andy,

Here's your login link for the Meat Freaks admin dashboard:

[Log in to admin dashboard]

This link expires in 15 minutes. If you didn't request this, you can ignore this email.

Meat Freaks
```

The login link format: `https://www.meatfreaksltd.com/api/admin/auth?token=<jwt>`

The JWT in the magic link email is short-lived (15 minutes). Once verified, the cookie set is long-lived (7 days).

---

## Dependencies

### npm packages

- `jose` - lightweight JWT signing/verification (no need for full jsonwebtoken package)
- `@vercel/kv` - Vercel KV client

### Vercel KV Setup

Andy (or Joshua) needs to:

1. Go to Vercel project Settings > Storage
2. Click "Create Database" > KV
3. This auto-populates `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` env vars

### Environment Variables (new)

| Variable | Value |
|---|---|
| `ADMIN_EMAILS` | `meatfreaksltd@gmail.com` |
| `ADMIN_JWT_SECRET` | Random 64-character string |

---

## Migration Path

1. Deploy the admin dashboard code
2. Enable Vercel KV in the project
3. Existing `src/data/booked-dates.json` data is seeded into KV on first read if KV is empty
4. Remove filesystem-based storage code after confirming KV works
5. Give Andy the `/admin` URL and tell him to enter his email

---

## Out of Scope (v1)

- Replying to enquiries from the dashboard
- Enquiry status tracking (quoted/confirmed/completed)
- Deleting or archiving enquiries
- Multiple admin roles or permissions
- Enquiry search or filtering
- Email notifications when new enquiries arrive (already handled by existing owner email)
