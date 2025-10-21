# Shopify Flow Setup Guide 🔄

## 🎯 Overview

Your forms now create Shopify customers with specific tags. Use **Shopify Flow** to automate everything - notifications, responses, follow-ups, and more!

---

## 📊 What Your Forms Create

### Email Capture (Footer)
```
Customer created with:
├── Email: user@example.com
├── Tag: footer_signup
└── Marketing Status: subscribed
```

### Contact Form (Contact Page)
```
Customer created/updated with:
├── Email: user@example.com
├── Name: First + Last
├── Phone: (if provided)
├── Tags: contact_inquiry, needs_response
├── Marketing Status: not_subscribed
└── Notes: Full inquiry message with timestamp
```

---

## 🚀 Shopify Flow Basics

### What is Shopify Flow?

**Shopify Flow** is a free automation tool (included with Shopify Plus, or available as an app on other plans) that lets you create workflows triggered by events.

**Access Flow:**
```
Shopify Admin → Settings → Apps and sales channels → Shopify Flow
Or search "Shopify Flow" in the App Store
```

### Flow Structure
```
Trigger → Conditions → Actions
```

Example:
```
Trigger: Customer tagged
Condition: Tag = "contact_inquiry"
Action: Send staff notification email
```

---

## 🎯 Recommended Flow Automations

### Flow 1: Contact Inquiry Notification (Essential)

**Purpose:** Get notified immediately when someone submits contact form

**Setup:**
```
Trigger: Customer tag added
├── Tag name: contact_inquiry

Condition: None (trigger every time)

Actions:
├── Action 1: Send internal email
│   ├── To: your-email@example.com
│   ├── Subject: "New Contact Inquiry from {{customer.firstName}}"
│   └── Body:
│       Name: {{customer.firstName}} {{customer.lastName}}
│       Email: {{customer.email}}
│       Phone: {{customer.phone}}
│       
│       View customer: https://admin.shopify.com/store/YOUR-STORE/customers/{{customer.id}}
│       
│       Check customer notes for full message.
│
└── Action 2 (Optional): Send Slack message
    └── Configure Slack app integration
```

**Result:** You get an email every time someone submits the contact form.

---

### Flow 2: Auto-Response to Contact Inquiries

**Purpose:** Acknowledge receipt of inquiry immediately

**Setup:**
```
Trigger: Customer tag added
├── Tag name: contact_inquiry

Condition: Check if this is their first inquiry
├── Customer tag count where tag = "contact_inquiry"
└── Equals 1

Actions:
├── Action: Send email to customer
    ├── To: {{customer.email}}
    ├── Subject: "We received your inquiry!"
    └── Body:
        Hi {{customer.firstName}},
        
        Thank you for contacting Turk's Bud! We've received your inquiry 
        and one of our team members will respond within 24 hours.
        
        In the meantime, feel free to browse our products at [your-site.com]
        
        Best regards,
        Turk's Bud Team
```

**Result:** Customer gets instant confirmation email.

---

### Flow 3: Newsletter Welcome Email

**Purpose:** Send welcome email to new subscribers

**Setup:**
```
Trigger: Customer tag added
├── Tag name: footer_signup

Condition: Marketing status
├── Email marketing consent state
└── Equals "subscribed"

Actions:
├── Wait: 5 minutes (optional, to avoid instant email)
│
└── Action: Send email to customer
    ├── To: {{customer.email}}
    ├── Subject: "Welcome to Turk's Bud Newsletter! 🌿"
    └── Body:
        Hey there! 👋
        
        Welcome to the Turk's Bud family! You're now subscribed to receive:
        
        ✅ New product launches
        ✅ Exclusive discounts
        ✅ Cannabis tips & education
        ✅ Special promotions
        
        As a welcome gift, here's 10% off your first order: WELCOME10
        
        Shop now: [your-site.com]
        
        Questions? Just reply to this email!
```

**Result:** New subscribers get a warm welcome with a discount code.

---

### Flow 4: Follow-Up on Unanswered Inquiries

**Purpose:** Remind staff to respond if inquiry hasn't been handled

**Setup:**
```
Trigger: Customer tag added
├── Tag name: needs_response

Condition: Wait and check
├── Wait for: 24 hours
└── Check if customer still has tag: needs_response

Actions:
├── Action: Send internal email
    ├── To: your-email@example.com
    ├── Subject: "⚠️ Unanswered Inquiry: {{customer.firstName}}"
    └── Body:
        This customer inquiry hasn't been responded to yet!
        
        Customer: {{customer.firstName}} {{customer.lastName}}
        Email: {{customer.email}}
        Inquiry Date: 24+ hours ago
        
        View: https://admin.shopify.com/store/YOUR-STORE/customers/{{customer.id}}
        
        Please respond ASAP!
```

**Result:** You never miss an inquiry - get reminded after 24 hours.

---

### Flow 5: Convert Inquiries to Subscribers

**Purpose:** Invite people who inquired to join newsletter

**Setup:**
```
Trigger: Customer tag added
├── Tag name: contact_inquiry

Condition: Check marketing status
├── Email marketing consent state
└── Does not equal "subscribed"

Actions:
├── Wait: 7 days
│
├── Condition: Check if they purchased
│   └── Order count = 0
│
└── Action: Send email to customer
    ├── To: {{customer.email}}
    ├── Subject: "Stay in touch with Turk's Bud"
    └── Body:
        Hi {{customer.firstName}},
        
        Thanks for reaching out last week! We hope we answered your questions.
        
        Want to stay updated with new products, special offers, and cannabis tips?
        
        Join our newsletter: [link to your site]
        
        No spam, just good vibes and great deals! 🌿
```

**Result:** Turn inquirers into subscribers over time.

---

### Flow 6: High-Value Lead Alert

**Purpose:** Flag VIP customers who both inquired and subscribed

**Setup:**
```
Trigger: Customer tag added
├── Tag name: footer_signup

Condition: Check if they also inquired
├── Customer has tag: contact_inquiry

Actions:
├── Action 1: Add tag "hot_lead"
│
└── Action 2: Send internal email
    ├── To: sales@your-domain.com
    ├── Subject: "🔥 Hot Lead: {{customer.firstName}}"
    └── Body:
        This customer has:
        ✅ Submitted a contact inquiry
        ✅ Subscribed to newsletter
        
        They're highly engaged! Consider:
        - Personal outreach
        - Special discount
        - Early access to new products
        
        View: https://admin.shopify.com/store/YOUR-STORE/customers/{{customer.id}}
```

**Result:** Identify and prioritize your most engaged leads.

---

### Flow 7: Remove "Needs Response" After Response

**Purpose:** Clean up tags after you respond to inquiries

**Manual Option:**
- When you respond to a customer, manually remove the "needs_response" tag

**Automated Option (Advanced):**
```
Trigger: Customer updated
├── Note field changed

Condition: Check tags
├── Customer has tag: needs_response
└── And note contains: "Response sent" (or similar keyword)

Action: Remove tag
└── Tag name: needs_response
```

**Note:** You'd need to add "Response sent" to customer notes when you reply.

---

## 🎨 Flow Templates to Copy

### Quick Copy-Paste Configs

#### Basic Notification Flow
```yaml
Name: Contact Inquiry Notification
Trigger: Customer tag added = "contact_inquiry"
Action: Send email
  To: your@email.com
  Subject: New Contact Inquiry
  Body: Customer {{customer.firstName}} {{customer.lastName}} ({{customer.email}}) submitted an inquiry. View: https://admin.shopify.com/store/YOUR-STORE/customers/{{customer.id}}
```

#### Newsletter Welcome Flow
```yaml
Name: Newsletter Welcome
Trigger: Customer tag added = "footer_signup"
Condition: Email marketing = subscribed
Action: Send email to customer
  Subject: Welcome to Turk's Bud! 🌿
  Body: Thanks for subscribing! Here's 10% off: WELCOME10
```

---

## 🔧 Setting Up Your First Flow

### Step-by-Step: Contact Inquiry Notification

1. **Open Shopify Flow**
   ```
   Shopify Admin → Apps → Shopify Flow
   ```

2. **Create New Workflow**
   ```
   Click "Create workflow"
   Name it: "Contact Inquiry Notification"
   ```

3. **Add Trigger**
   ```
   Select trigger: "Customer tag added"
   Tag name: contact_inquiry
   ```

4. **Add Action**
   ```
   Click "+" to add action
   Choose: "Send internal email"
   
   Configure:
   - To: your-email@example.com
   - Subject: "New Contact Inquiry"
   - Body: Use template above
   ```

5. **Test & Activate**
   ```
   Click "Turn on workflow"
   Submit a test contact form
   Check your email!
   ```

---

## 📊 Advanced Flow Ideas

### Segment-Based Flows

**Flow: VIP Customer Inquiry**
```
Trigger: Customer tag added = "contact_inquiry"
Condition: Customer total spent > $500
Action: Send email to VIP support team
```

**Flow: First-Time Visitor**
```
Trigger: Customer tag added = "contact_inquiry"
Condition: Customer order count = 0
Action: Send email with first-order discount
```

### Time-Based Flows

**Flow: Weekly Inquiry Digest**
```
Trigger: Scheduled (every Monday 9 AM)
Condition: Customer has tag "needs_response"
Action: Send summary email with all pending inquiries
```

**Flow: Re-Engagement Campaign**
```
Trigger: Customer tag added = "contact_inquiry"
Wait: 30 days
Condition: Customer order count = 0
Action: Send re-engagement email with offer
```

---

## 🎯 Recommended Flow Priority

### Week 1: Essential Flows
1. ✅ Contact Inquiry Notification (Flow 1)
2. ✅ Auto-Response to Inquiries (Flow 2)
3. ✅ Newsletter Welcome Email (Flow 3)

### Week 2: Follow-Up Flows
4. ✅ Unanswered Inquiry Reminder (Flow 4)
5. ✅ High-Value Lead Alert (Flow 6)

### Week 3: Optimization
6. ✅ Convert Inquiries to Subscribers (Flow 5)
7. ✅ Custom flows based on your needs

---

## 📧 Email Templates

### Professional Contact Response Template
```
Subject: Re: Your Inquiry to Turk's Bud

Hi {{customer.firstName}},

Thank you for reaching out to Turk's Bud! We received your message and wanted to acknowledge it right away.

Your inquiry:
"{{customer.note}}"

One of our team members will review your message and respond with detailed information within 24 hours.

In the meantime, feel free to:
- Browse our products: [your-site.com]
- Read our FAQ: [your-site.com/faq]
- Call us: [phone-number]

Best regards,
The Turk's Bud Team

---
This is an automated response. A team member will follow up personally soon.
```

### Newsletter Welcome Template
```
Subject: Welcome to the Turk's Bud Family! 🌿

Hey {{customer.firstName}}! 👋

You're officially part of the Turk's Bud newsletter, and we couldn't be more excited!

Here's what you can expect from us:

🌟 EXCLUSIVE PERKS
- Early access to new strains
- Subscriber-only discounts
- Limited edition releases

📚 CANNABIS EDUCATION
- Growing tips
- Strain spotlights
- Industry news

💰 SPECIAL OFFERS
- Monthly promotions
- Flash sales
- Loyalty rewards

YOUR WELCOME GIFT 🎁
Use code WELCOME10 for 10% off your first order!

[SHOP NOW BUTTON]

Questions? Just hit reply - we're here to help!

Stay lifted,
Turk's Bud Team

P.S. You can unsubscribe anytime, but we promise to keep it real and never spam you.
```

---

## 🔍 Monitoring Your Flows

### Check Flow Performance
```
Shopify Flow → View workflow → Analytics tab

Track:
- Times triggered
- Success rate
- Failed actions
- Average completion time
```

### Debug Failed Flows
```
Shopify Flow → Workflow → Run history

Review:
- Which step failed
- Error message
- Customer details
- Timestamp
```

---

## ✅ Testing Checklist

### Test Contact Form Flow
- [ ] Submit test contact form
- [ ] Check if notification email received
- [ ] Verify customer created in Shopify
- [ ] Confirm tags applied correctly
- [ ] Check customer notes have message
- [ ] Test auto-response email sent

### Test Email Capture Flow
- [ ] Submit test email in footer
- [ ] Check if customer created
- [ ] Verify "footer_signup" tag applied
- [ ] Confirm marketing status = subscribed
- [ ] Test welcome email sent
- [ ] Verify timing (if using delay)

---

## 🆘 Troubleshooting

### Flow Not Triggering

**Check:**
1. Is workflow turned ON? (toggle in Flow)
2. Does trigger match exactly? (tag name is case-sensitive)
3. Check run history for errors
4. Verify customer actually got the tag

**Fix:**
```
1. Go to Shopify Flow
2. Open the workflow
3. Check the toggle is ON
4. Click "Run history"
5. Look for errors or missing triggers
```

### Email Not Sending

**Check:**
1. Email address correct in Flow?
2. Customer has valid email address?
3. Check spam folder
4. Review Flow run history for send status

**Fix:**
```
1. Test with your own email first
2. Check Shopify's email sending limits
3. Verify email template doesn't have errors
4. Try removing/adding action again
```

### Condition Not Working

**Check:**
1. Condition logic correct?
2. Field names match exactly?
3. Values are correct type (string vs number)
4. Customer actually meets condition?

**Fix:**
```
1. Simplify condition to test
2. Remove condition temporarily
3. Check run history for condition results
4. Verify customer data in Shopify
```

---

## 💡 Best Practices

### DO ✅
- Start with simple flows
- Test thoroughly before activating
- Use clear workflow names
- Document what each flow does
- Monitor run history regularly
- Keep email templates professional
- Respect customer preferences

### DON'T ❌
- Don't create duplicate flows
- Don't over-automate (keep human touch)
- Don't spam customers with too many emails
- Don't forget to test with real data
- Don't ignore failed flows
- Don't use all caps in emails
- Don't forget unsubscribe links

---

## 📈 Next-Level Automations

### Integrate with Other Apps

**Klaviyo Integration:**
```
Trigger: Customer tag added = "footer_signup"
Action: Add to Klaviyo segment
→ Klaviyo handles email campaigns
```

**Slack Integration:**
```
Trigger: Customer tag added = "contact_inquiry"
Action: Post message to Slack channel
→ Team collaboration in real-time
```

**Google Sheets:**
```
Trigger: Customer tag added = "contact_inquiry"
Action: Add row to Google Sheet
→ Track all inquiries in spreadsheet
```

---

## 🎉 Summary

You're now set up to:

✅ Get notified of every contact inquiry  
✅ Send auto-responses to customers  
✅ Welcome newsletter subscribers  
✅ Follow up on unanswered inquiries  
✅ Identify high-value leads  
✅ Automate your entire customer journey  

**All through Shopify Flow - no external webhooks needed!**

---

## 📚 Resources

- [Shopify Flow Documentation](https://help.shopify.com/en/manual/shopify-flow)
- [Flow Triggers Reference](https://help.shopify.com/en/manual/shopify-flow/reference/triggers)
- [Flow Actions Reference](https://help.shopify.com/en/manual/shopify-flow/reference/actions)
- [Email Marketing Best Practices](https://help.shopify.com/en/manual/promoting-marketing/create-marketing/email-marketing)

---

**Ready to automate?** Start with Flow 1 (Contact Inquiry Notification) and go from there! 🚀

