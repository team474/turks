# Email Capture Setup Guide

This guide explains how to configure the email capture functionality in the footer to send customer events for email capture consent to Shopify via the API.

## What Was Implemented

### 1. **Backend API Route** (`app/api/email-capture/route.ts`)
- Handles email submissions securely
- Implements rate limiting (10 requests per 5 minutes per IP)
- Includes honeypot spam protection
- Creates/updates Shopify customers with email marketing consent
- Uses Shopify Admin API to properly track consent

### 2. **Frontend Component** (`components/landing-page/EmailCaptureForm.tsx`)
- User-friendly email input form with loading states
- Success/error message display
- Integrates with Shopify's Customer Privacy API
- Emits custom analytics events for tracking
- Client-side validation

### 3. **Updated Footer** (`components/landing-page/Footer.tsx`)
- Replaced static form with the new `EmailCaptureForm` component

## Setup Instructions

### Step 1: Create a Shopify Admin API Access Token

1. **Go to your Shopify Admin Panel**
   - Navigate to: `Settings` → `Apps and sales channels` → `Develop apps`

2. **Create a new app** (if you don't have one already)
   - Click "Create an app"
   - Name it something like "Email Capture" or "Newsletter Integration"

3. **Configure Admin API access**
   - Click on your app
   - Go to "Configuration" tab
   - Under "Admin API access scopes", enable:
     - ✅ `write_customers` - Required to create/update customers
     - ✅ `read_customers` - Required to search for existing customers
     - ✅ `write_marketing_events` - Optional, for advanced marketing tracking

4. **Install the app** and **reveal the Admin API access token**
   - Click "Install app"
   - Reveal and copy the Admin API access token (you'll only see this once!)

### Step 2: Update Environment Variables

Add the following to your `.env.local` file:

```env
# Shopify Admin API (required for email capture)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx

# These should already exist from your storefront setup
SHOPIFY_STORE_DOMAIN=https://your-store.myshopify.com
```

⚠️ **Important**: 
- Never commit the `.env.local` file to version control
- The `SHOPIFY_STORE_DOMAIN` should include `https://`
- The Admin access token starts with `shpat_`

### Step 3: Update Production Environment Variables

If you're deploying to Vercel, Netlify, or another hosting platform:

1. Go to your project settings
2. Add the environment variable:
   - Name: `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - Value: Your admin API access token

### Step 4: Test the Implementation

1. **Start your development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to your site** and scroll to the footer

3. **Test the form**:
   - Enter a valid email address
   - Click submit
   - You should see a success message

4. **Verify in Shopify**:
   - Go to Shopify Admin → Customers
   - Find the newly created customer
   - Check that "Email marketing" status is "Subscribed"
   - Look for the "footer_signup" tag

## How It Works

### Backend Flow

1. User submits email via the form
2. API route validates the email and checks for spam (honeypot)
3. API attempts to create a new customer in Shopify with:
   ```json
   {
     "email": "user@example.com",
     "email_marketing_consent": {
       "state": "subscribed",
       "opt_in_level": "single_opt_in",
       "consent_updated_at": "2025-01-01T00:00:00Z"
     },
     "tags": "footer_signup"
   }
   ```
4. If customer already exists:
   - API searches for the customer by email
   - Updates their email marketing consent to "subscribed"
5. Returns success/error message to frontend

### Frontend Flow

1. User enters email and submits form
2. Form shows loading state
3. Makes POST request to `/api/email-capture`
4. On success:
   - Updates Shopify Customer Privacy API (if available)
   - Emits custom analytics event `turks:email_capture_consent`
   - Shows success message
   - Clears the form
5. On error:
   - Shows user-friendly error message

### Privacy & Consent Tracking

The implementation tracks consent in multiple ways:

1. **Shopify Customer Record**: 
   - Sets `email_marketing_consent.state` to "subscribed"
   - Records consent timestamp
   - Marks consent level as "single_opt_in"

2. **Customer Privacy API** (frontend):
   ```javascript
   window.Shopify.customerPrivacy.setTrackingConsent({
     marketing: true
   })
   ```

3. **Custom Analytics Event** (frontend):
   ```javascript
   window.Shopify.analytics.publish('turks:email_capture_consent', {
     email: email,
     consent: true,
     source: 'footer',
     timestamp: new Date().toISOString()
   })
   ```

## Features Included

### Security Features
- ✅ Rate limiting (10 requests per 5 minutes per IP)
- ✅ Honeypot spam protection
- ✅ Email validation (backend & frontend)
- ✅ Content-Type validation
- ✅ CORS protection (API route is same-origin only)

### User Experience
- ✅ Loading spinner during submission
- ✅ Success/error message display
- ✅ Form clears after successful submission
- ✅ Disabled state during submission
- ✅ Accessible (ARIA labels, proper focus management)

### Error Handling
- ✅ Handles duplicate email submissions gracefully
- ✅ Updates existing customers instead of failing
- ✅ Provides user-friendly error messages
- ✅ Logs errors for debugging

## Compliance & Best Practices

### GDPR & Privacy Compliance
- ✅ Explicit consent captured before subscribing
- ✅ Consent timestamp recorded
- ✅ Customer can be easily unsubscribed via Shopify admin
- ✅ "Single opt-in" level clearly specified

### Recommendations
1. **Add a privacy policy link** near the email form
2. **Consider implementing double opt-in** for stricter compliance
3. **Add unsubscribe functionality** if you send emails directly
4. **Review your region's marketing regulations** (GDPR, CAN-SPAM, CASL, etc.)

## Troubleshooting

### "Email subscription service not configured" error
- Check that `SHOPIFY_ADMIN_ACCESS_TOKEN` is set in your environment variables
- Verify that `SHOPIFY_STORE_DOMAIN` includes `https://`

### Shopify API returns 401 Unauthorized
- Your Admin API access token may be invalid
- Regenerate the token in Shopify Admin
- Ensure the token has `write_customers` and `read_customers` scopes

### Customers aren't being created
- Check browser console for errors
- Check server logs (Vercel logs, local console, etc.)
- Verify API scopes in Shopify Admin
- Test the API endpoint directly with curl:
  ```bash
  curl -X POST http://localhost:3000/api/email-capture \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  ```

### Rate limiting issues during development
- The rate limiter resets when you restart the server
- Current limit: 10 requests per 5 minutes per IP
- Adjust `MAX_REQUESTS_PER_WINDOW` in `route.ts` if needed

## API Reference

### POST `/api/email-capture`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "message": "Subscribed successfully!"
}
```

**Error Responses:**

- **400 Bad Request**: Invalid email format
  ```json
  {
    "error": "Invalid email address",
    "details": { ... }
  }
  ```

- **415 Unsupported Media Type**: Wrong content type
  ```json
  {
    "error": "Invalid content type"
  }
  ```

- **429 Too Many Requests**: Rate limit exceeded
  ```json
  {
    "error": "Too many requests. Please try again later."
  }
  ```

- **500 Internal Server Error**: Server or Shopify API error
  ```json
  {
    "error": "Failed to subscribe. Please try again."
  }
  ```

## Next Steps

### Optional Enhancements

1. **Add email confirmation/double opt-in**
   - Send a confirmation email with a verification link
   - Only set consent to "subscribed" after verification

2. **Integrate with email service provider**
   - Sync to Klaviyo, Mailchimp, SendGrid, etc.
   - Use Shopify's native email marketing or a third-party app

3. **Add welcome email automation**
   - Set up a Shopify Flow or app to trigger welcome emails
   - Send a discount code or special offer

4. **Track conversion metrics**
   - Monitor subscription rates
   - A/B test different CTAs
   - Track email engagement

5. **Add preference center**
   - Let users choose what types of emails they want
   - Provide easy unsubscribe options

## Support

If you encounter any issues or have questions:

1. Check the browser console for client-side errors
2. Check server logs for backend errors
3. Verify environment variables are set correctly
4. Review Shopify Admin API logs
5. Check that your app has the correct API scopes

## Resources

- [Shopify Admin API - Customers](https://shopify.dev/docs/api/admin-rest/2024-10/resources/customer)
- [Shopify Customer Privacy API](https://shopify.dev/docs/api/customer-privacy)
- [Shopify Web Pixels API](https://shopify.dev/docs/api/web-pixels-api)
- [Email Marketing Consent](https://help.shopify.com/en/manual/customers/manage-customers/customer-consent)

