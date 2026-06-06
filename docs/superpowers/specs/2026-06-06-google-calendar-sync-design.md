# Google Calendar Sync - Design Spec

## Overview

When Andy blocks or unblocks a date in the admin dashboard, a corresponding all-day event is automatically created or deleted in his Google Calendar. One-way sync - the website is the source of truth, Google Calendar is a read-only mirror.

---

## Event Format

### With matching enquiry

When Andy blocks a date and an enquiry exists for that date:

- **Title**: "MF - [Event Type] - [Region] - [Client Name]"
  - e.g. "MF - Wedding - Bristol - Sarah Jenkins"
- **Description**:
  ```
  Client: Sarah Jenkins
  Email: sarah@example.com
  Phone: 07700 900123
  Event: Wedding
  Guests: 100-250
  Region: Bristol
  Notes: Outdoor ceremony, need gazebo setup by 2pm
  ```

### Without matching enquiry

When Andy blocks a date with no corresponding enquiry (personal day off, holding a date, etc.):

- **Title**: "Meat Freaks - Blocked"
- **Description**: empty

### Matching logic

At block time, search all stored enquiries for one where `enquiry.date === blocked date`. If multiple enquiries match the same date, use the most recently submitted one.

---

## How It Works

### Blocking a date

1. Andy taps a date in the admin calendar
2. `/api/admin/dates` POST saves the date to Vercel KV (existing behaviour)
3. After KV save, search enquiries in KV for a matching date
4. Create an all-day event in Google Calendar via the service account
5. Store the Google Calendar event ID in KV alongside the booked date so we can delete it later

### Unblocking a date

1. Andy taps a blocked date to unblock it
2. `/api/admin/dates` DELETE removes the date from KV (existing behaviour)
3. Look up the stored Google Calendar event ID for that date
4. Delete the event from Google Calendar
5. Remove the event ID mapping from KV

### KV storage change

Currently `booked-dates` is a simple array of date strings: `["2026-07-12", "2026-07-19"]`

Change to an array of objects to store the Google Calendar event ID:

```json
[
  { "date": "2026-07-12", "calEventId": "abc123" },
  { "date": "2026-07-19", "calEventId": null }
]
```

The public `/api/availability` endpoint must still return a flat array of date strings - it maps from the new format.

---

## Authentication

### Service account

- Google Cloud service account with Google Calendar API access
- No OAuth, no user login, no token refresh needed
- Set and forget once configured

### Setup steps (one-time)

1. Create a Google Cloud project
2. Enable the Google Calendar API
3. Create a service account, download the JSON key
4. Andy shares his Google Calendar with the service account email address (gives it "Make changes to events" permission)
5. Add env vars to Vercel

### Environment variables

| Variable | Value | Notes |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | The full JSON key contents | Stringified JSON, stored as one env var |
| `GOOGLE_CALENDAR_ID` | Andy's calendar ID | Usually his Gmail address, or found in Google Calendar settings |

---

## Files

| File | Action | Purpose |
|---|---|---|
| `src/lib/google-calendar.ts` | Create | Google Calendar API client - create/delete events |
| `src/lib/availability.ts` | Modify | Update booked dates format to include calEventId, update getBookedDates to return flat array for public API |
| `src/app/api/admin/dates/route.ts` | Modify | Call Google Calendar after KV operations |

### New dependency

- `googleapis` npm package (Google's official API client, includes Calendar API)

---

## Failure Handling

- If Google Calendar API fails, the date is still blocked/unblocked in KV
- The admin UI is not blocked by calendar sync failures
- Errors are logged server-side via `console.error`
- If the service account env vars are not set, calendar sync is silently skipped (graceful degradation for local dev)

---

## Out of Scope

- Two-way sync (Google Calendar changes don't propagate back to the website)
- Updating calendar events when enquiry details change
- Multiple calendar support
- Calendar event reminders or notifications (Andy gets those from Google Calendar natively)
