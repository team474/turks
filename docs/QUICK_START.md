# 🚀 Quick Start - Shopify Forms + Flow

## One-Time Setup (5 minutes)

### Step 1: Get Shopify Admin API Token

```
Shopify Admin → Settings → Apps and sales channels → Develop apps
→ Create app → Name it "Forms Integration"
→ Configure Admin API → Enable:
   ✅ write_customers
   ✅ read_customers
→ Install app → Copy Admin API access token
```

### Step 2: Add to Environment

```env
# .env.local
SHOPIFY_STORE_DOMAIN=https://your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Server

```bash
npm run dev
# or
pnpm dev
```

### Step 4: Test Forms

✅ **Email Capture** (footer): Enter email → Submit → Check success message  
✅ **Contact Form** (/contact-us): Fill form → Submit → Check success message

### Step 5: Verify in Shopify

```
Shopify Admin → Customers

Look for:
- Email capture: Tag "footer_signup", Marketing "Subscribed"
- Contact form: Tag "contact_inquiry", Full message in Notes
```

---

## Automation Setup (10 minutes)

### Option 1: Shopify Flow (Recommended)

**Best for:** Complete automation, no external tools needed

**Setup:**
1. Install Shopify Flow app (free on Shopify Plus, paid on other plans)
2. Follow guide: [Shopify Flow Setup](./SHOPIFY_FLOW_SETUP.md)
3. Start with Flow 1: Contact Inquiry Notification

**What you get:**
- Email notifications for inquiries
- Auto-responses to customers
- Welcome emails for subscribers
- Follow-up reminders
- Advanced segmentation

---

### Option 2: Manual Workflow

**Best for:** Small volume, personal touch

**Workflow:**
1. Check Shopify Admin daily
2. Filter customers by tag: `needs_response`
3. Read inquiry in Notes
4. Respond via email
5. Remove `needs_response` tag

---

## 📊 What Gets Created

### Email Capture (Footer)
```
Customer:
├── Email only
├── Tag: footer_signup
└── Marketing: subscribed

Use for: Email campaigns, newsletters, promotions
```

### Contact Form
```
Customer:
├── Full name (First + Last)
├── Email
├── Phone (optional)
├── Tags: contact_inquiry, needs_response
├── Marketing: not_subscribed
├── Notes: Full inquiry with timestamp
└── Metafields: contact count, last contact date

Use for: Customer support, sales follow-up, tracking
```

---

## 🎯 Recommended Flows

### Must-Have Flows

1. **Contact Inquiry Notification**
   - Trigger: Tag added = `contact_inquiry`
   - Action: Email you the inquiry
   - Time: 5 minutes to set up

2. **Auto-Response**
   - Trigger: Tag added = `contact_inquiry`
   - Action: Email customer confirmation
   - Time: 5 minutes to set up

3. **Newsletter Welcome**
   - Trigger: Tag added = `footer_signup`
   - Action: Send welcome email with discount
   - Time: 10 minutes to set up

**Full guide:** [Shopify Flow Setup](./SHOPIFY_FLOW_SETUP.md)

---

## ✅ Testing Checklist

### Email Capture
- [ ] Form visible in footer
- [ ] Email validation works
- [ ] Success message shows
- [ ] Customer created in Shopify
- [ ] Has `footer_signup` tag
- [ ] Marketing status = subscribed
- [ ] Welcome email sent (if Flow configured)

### Contact Form
- [ ] Form accessible at /contact-us
- [ ] All fields work (name, email, phone, message)
- [ ] Success message shows
- [ ] Customer created/updated in Shopify
- [ ] Has `contact_inquiry` and `needs_response` tags
- [ ] Message appears in Notes
- [ ] Notification received (if Flow configured)
- [ ] Auto-response sent (if Flow configured)

---

## 🆘 Troubleshooting

### Forms not working

**Error: "Shopify Admin API not configured"**
```
Fix: Add SHOPIFY_ADMIN_ACCESS_TOKEN to .env.local
Then restart server
```

**Error: 401 Unauthorized**
```
Fix: Token needs write_customers and read_customers scopes
Regenerate token with correct permissions
```

### Customer not created

**Check:**
1. Token is valid and has correct scopes
2. SHOPIFY_STORE_DOMAIN includes `https://`
3. Server logs for error details
4. Browser console for errors

### No notifications

**If using Shopify Flow:**
1. Check workflow is turned ON
2. Verify trigger matches tag exactly
3. Check Flow run history for errors
4. Test with your own email first

---

## 📁 File Structure

```
your-project/
├── app/api/
│   ├── email-capture/
│   │   └── route.ts          ← Email capture endpoint
│   └── contact/
│       └── route.ts           ← Contact form endpoint (cleaned up!)
│
├── components/landing-page/
│   ├── EmailCaptureForm.tsx   ← Email form component
│   ├── ContactForm.tsx        ← Contact form (unchanged)
│   └── Footer.tsx             ← Uses EmailCaptureForm
│
└── docs/
    ├── QUICK_START.md         ← This file
    ├── SHOPIFY_FLOW_SETUP.md  ← Flow automation guide
    └── [other docs]
```

---

## 💰 Costs

| Item | Cost | Required? |
|------|------|-----------|
| Shopify Admin API | Free | ✅ Yes |
| Shopify Flow | Free (Plus) / $15/mo (others) | No, but recommended |
| External Webhooks | Removed | N/A |
| Email Server | Not needed | N/A |

**Total Monthly Cost: $0-15**

---

## 🎓 Next Steps

### Week 1
- [ ] Complete setup above
- [ ] Test both forms
- [ ] Install Shopify Flow
- [ ] Set up Flow 1: Inquiry notification

### Week 2
- [ ] Set up Flow 2: Auto-response
- [ ] Set up Flow 3: Newsletter welcome
- [ ] Monitor customer tags
- [ ] Respond to test inquiries

### Week 3
- [ ] Add advanced flows
- [ ] Create customer segments
- [ ] Launch email campaign
- [ ] Analyze conversion metrics

---

## 📚 Full Documentation

- **[Shopify Flow Setup](./SHOPIFY_FLOW_SETUP.md)** - Complete automation guide (7 flows)
- **[Email Capture Details](./EMAIL_CAPTURE_SETUP.md)** - Technical deep-dive
- **[Integrations Overview](./SHOPIFY_INTEGRATIONS_OVERVIEW.md)** - Complete system overview

---

## 🎉 You're Ready!

Your forms now:
- ✅ Work without email servers
- ✅ Create Shopify customers
- ✅ Track full inquiry history
- ✅ Ready for Flow automation
- ✅ Scalable and maintainable

**Start with the 5-minute setup above, then add automations when ready!** 🚀

