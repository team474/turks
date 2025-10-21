# Email Capture Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interaction                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Enters email
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           EmailCaptureForm Component (Client-Side)              │
│  - Validates email format                                       │
│  - Checks honeypot field                                        │
│  - Shows loading state                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/email-capture
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│            API Route: /api/email-capture (Server)               │
│  - Rate limiting (10 req/5min per IP)                          │
│  - Validates email                                              │
│  - Checks honeypot                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Validated
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Shopify Admin API Call                        │
│  POST /admin/api/2024-10/customers.json                        │
│  {                                                              │
│    email: "user@example.com",                                   │
│    email_marketing_consent: {                                   │
│      state: "subscribed",                                       │
│      opt_in_level: "single_opt_in",                            │
│      consent_updated_at: "2025-01-01T00:00:00Z"               │
│    },                                                           │
│    tags: "footer_signup"                                        │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌──────────────────┐
    │ Customer Created  │       │ Customer Exists  │
    │  (Success)        │       │  (422 Error)     │
    └───────────────────┘       └──────────────────┘
                │                           │
                │                           │ Search by email
                │                           ▼
                │               ┌──────────────────────┐
                │               │ GET customers/search │
                │               │ query=email:...      │
                │               └──────────────────────┘
                │                           │
                │                           │ Update customer
                │                           ▼
                │               ┌──────────────────────┐
                │               │ PUT customers/:id    │
                │               │ Update consent       │
                │               └──────────────────────┘
                │                           │
                └───────────────┬───────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Return Success      │
                    │  to Client           │
                    └──────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Client-Side Post-Success Actions                   │
│                                                                 │
│  1. Show success message                                        │
│  2. Clear form                                                  │
│  3. Call Shopify Customer Privacy API                          │
│     window.Shopify.customerPrivacy.setTrackingConsent()        │
│  4. Emit custom analytics event                                 │
│     window.Shopify.analytics.publish('turks:email_capture...')│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shopify Customer Record                      │
│                                                                 │
│  Customer Profile:                                              │
│  ├── Email: user@example.com                                   │
│  ├── Email Marketing: ✅ Subscribed                            │
│  ├── Consent Date: 2025-01-01                                  │
│  ├── Opt-in Level: Single opt-in                               │
│  └── Tags: footer_signup                                        │
│                                                                 │
│  Available in:                                                  │
│  - Shopify Admin → Customers                                   │
│  - Email Marketing Apps (Klaviyo, etc.)                        │
│  - Shopify Email                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
User submits email
        │
        ▼
┌──────────────────┐
│ Rate Limit Check │
└──────────────────┘
        │
        ├─ Exceeded ──→ Return 429 "Too many requests"
        │
        ▼
┌──────────────────┐
│ Honeypot Check   │
└──────────────────┘
        │
        ├─ Spam detected ──→ Return 200 (silent success)
        │
        ▼
┌──────────────────┐
│ Email Validation │
└──────────────────┘
        │
        ├─ Invalid ──→ Return 400 "Invalid email"
        │
        ▼
┌──────────────────┐
│ Create Customer  │
└──────────────────┘
        │
        ├─ Success ──→ Return 200 "Subscribed successfully!"
        │
        ├─ Duplicate (422) ──→ Search & Update ──→ Return 200
        │
        └─ Other Error ──→ Return 500 "Failed to subscribe"
```

## Data Storage Locations

```
┌─────────────────────────────────────────────────────────────────┐
│                     Where Data is Stored                        │
└─────────────────────────────────────────────────────────────────┘

1. Shopify Customer Database
   └── Permanent record with marketing consent

2. Shopify Customer Privacy API
   └── Browser-level consent tracking (localStorage)

3. Shopify Analytics Events
   └── Custom event stream for tracking/reporting

4. Server Logs (temporary)
   └── Rate limiting data (in-memory, resets on restart)
```

## Privacy & Compliance

```
┌─────────────────────────────────────────────────────────────────┐
│                   Consent Tracking Points                       │
└─────────────────────────────────────────────────────────────────┘

Point 1: User Action
├── User explicitly types email and clicks submit
└── Implicit consent through action

Point 2: Shopify Customer Record
├── email_marketing_consent.state = "subscribed"
├── email_marketing_consent.opt_in_level = "single_opt_in"
└── email_marketing_consent.consent_updated_at = [timestamp]

Point 3: Customer Privacy API
├── window.Shopify.customerPrivacy.setTrackingConsent()
└── Records consent in browser for privacy compliance

Point 4: Analytics Event
├── Custom event: 'turks:email_capture_consent'
└── Contains: email, consent: true, source: 'footer', timestamp
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────────┐
│            What Can Use This Email List                         │
└─────────────────────────────────────────────────────────────────┘

✅ Shopify Email
   └── Native email marketing tool

✅ Shopify Flow
   └── Automate welcome emails, tags, etc.

✅ Email Marketing Apps
   ├── Klaviyo
   ├── Mailchimp
   ├── Omnisend
   └── SendGrid
   
✅ Customer Segments
   └── Create segments based on "footer_signup" tag

✅ Custom Integrations
   └── Query Shopify Admin API for subscribers
```

## Testing Checklist

```
□ Valid email submission works
□ Invalid email shows error
□ Duplicate email updates existing customer
□ Success message displays
□ Form clears after success
□ Rate limiting works (after 10 requests)
□ Honeypot catches spam bots
□ Customer appears in Shopify Admin
□ Customer has "Subscribed" status
□ Customer has "footer_signup" tag
□ Browser console shows no errors
□ Mobile responsive design works
```

## Monitoring & Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                  Key Metrics to Track                           │
└─────────────────────────────────────────────────────────────────┘

1. Subscription Rate
   └── Visitors vs. Email Captures

2. Error Rate
   └── Failed submissions vs. Total attempts

3. Duplicate Submissions
   └── Existing customers re-subscribing

4. Geographic Distribution
   └── Where subscribers are from

5. Device Type
   └── Mobile vs. Desktop submissions

6. Time-based Patterns
   └── Peak subscription times

Available through:
- Shopify Analytics
- Custom event tracking
- Server logs
- Google Analytics (if integrated)
```

