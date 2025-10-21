# Email Capture - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Get Shopify Admin API Token

```
Shopify Admin → Settings → Apps and sales channels → Develop apps
→ Create an app → Configure Admin API
→ Enable: write_customers, read_customers
→ Install app → Reveal Admin API access token
```

### 2. Add Environment Variable

Create or update `.env.local`:

```env
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Restart Your Dev Server

```bash
npm run dev
# or
pnpm dev
```

### 4. Test It!

- Scroll to footer
- Enter email
- Click submit
- Check Shopify Admin → Customers

---

## ✅ What Was Created

| File | Purpose |
|------|---------|
| `app/api/email-capture/route.ts` | Backend API for email submission |
| `components/landing-page/EmailCaptureForm.tsx` | Frontend form component |
| `components/landing-page/Footer.tsx` | Updated to use new form |
| `docs/EMAIL_CAPTURE_SETUP.md` | Full documentation |

---

## 🔒 Security Features

- ✅ Rate limiting (10/5min per IP)
- ✅ Honeypot spam protection
- ✅ Email validation
- ✅ Privacy consent tracking

---

## 📊 What Happens When Someone Subscribes

1. **Email submitted** → Validates & checks spam
2. **Creates Shopify customer** with marketing consent
3. **Records consent** via Customer Privacy API
4. **Emits analytics event** `turks:email_capture_consent`
5. **Shows success message** to user

---

## 🎯 Where to Find Subscribers

```
Shopify Admin → Customers
Filter by: Email marketing = "Subscribed"
Look for tag: "footer_signup"
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Service not configured" | Add `SHOPIFY_ADMIN_ACCESS_TOKEN` to `.env.local` |
| 401 Unauthorized | Regenerate token, check scopes |
| Form not working | Check browser console, verify env vars |

---

## 🎨 Customization

### Change Success Message
Edit `components/landing-page/EmailCaptureForm.tsx`:
```typescript
setMessage({ type: 'success', text: 'Your custom message!' });
```

### Change Rate Limit
Edit `app/api/email-capture/route.ts`:
```typescript
const MAX_REQUESTS_PER_WINDOW = 10; // Change this
```

### Change Customer Tag
Edit `app/api/email-capture/route.ts`:
```typescript
tags: 'footer_signup', // Change this
```

---

## 📚 Full Documentation

See [EMAIL_CAPTURE_SETUP.md](./EMAIL_CAPTURE_SETUP.md) for:
- Detailed setup instructions
- API reference
- Privacy compliance info
- Advanced customization options

---

## 💡 Next Steps

1. ✅ **Test thoroughly** in development
2. ✅ **Add privacy policy link** near form
3. ✅ **Deploy** to production with env vars
4. ✅ **Set up welcome email** automation
5. ✅ **Monitor** subscription rates

---

**Need help?** Check the full documentation or review the code comments.

