# Discount Code Setup Guide

## 🎁 Making the 10% Off Code Functional

Your special offers tab gives users the code `WELCOME10`, but you need to create this discount in Shopify for it to actually work at checkout.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create the Discount Code in Shopify

1. **Go to Shopify Admin**
   ```
   Admin → Discounts → Create discount
   ```

2. **Choose "Discount code"**

3. **Configure the discount:**

   ```
   Discount code: WELCOME10
   
   Type: Percentage
   Value: 10%
   
   Applies to: Entire order (or specific collections/products)
   
   Minimum requirements: None (or set minimum purchase amount)
   
   Customer eligibility: All customers
   
   Usage limits:
   ├── Limit number of times: 1 per customer ✓ (recommended)
   └── Total usage limit: Unlimited (or set a cap)
   
   Active dates:
   ├── Start date: Today
   └── End date: None (never expires)
   ```

4. **Click "Save discount"**

---

## ✅ What's Already Implemented

### Frontend Features

✅ **Tab stays visible** - Closing it leaves the handle tab  
✅ **Centered vertically** - Fixed in middle of screen during scroll  
✅ **Smooth animations** - Slide in/out with ease-in-out  
✅ **Mobile responsive** - Smaller on mobile, touch-friendly  
✅ **Persistent code** - Once subscribed, code is always accessible  
✅ **Copy to clipboard** - One-click copy functionality  

### User Flow

```
First Visit:
1. Tab slides out after 3 seconds
2. User enters email
3. Gets WELCOME10 code instantly
4. Code saved in localStorage
5. Can close tab and reopen anytime

Return Visits:
1. Tab handle shows "Your Code" if subscribed
2. Click to see discount code again
3. No re-subscription needed
```

---

## 🎨 Features Overview

### Tab Behavior

| Action | Result |
|--------|--------|
| **First load** | Tab opens after 3s |
| **Close (X button)** | Tab slides out, handle remains |
| **Click handle** | Tab slides back in |
| **After subscribing** | Code displayed, can close/reopen anytime |
| **On scroll** | Stays fixed in center of screen |

### Mobile Optimizations

- ✅ Smaller width on mobile devices
- ✅ Touch-friendly buttons
- ✅ Smaller text on tab handle
- ✅ Full-width on small screens (with margin)
- ✅ Smooth animations optimized for mobile

### Animations

```css
Tab Slide: 500ms ease-in-out
Handle Hover: 300ms ease
Gift Icon: Bouncing animation
Badge: Pulse animation
Button Hover: Scale transform + color change
```

---

## 💡 Customization Options

### Change Discount Percentage

**In Shopify:**
1. Admin → Discounts → Edit WELCOME10
2. Change value to 15%, 20%, etc.

**In Code (update display text):**
```tsx
// components/landing-page/SpecialOffersTab.tsx
<h3>Get 15% Off</h3>  // Line 154
<span>15% Off</span>   // Line 229
```

### Change Discount Code

**In Shopify:**
1. Create new discount code (e.g., "TURKS10")

**In Code:**
```tsx
// components/landing-page/SpecialOffersTab.tsx
const code = 'TURKS10';  // Line 62
setDiscountCode('TURKS10');  // Line 21
```

### Change Auto-Open Delay

```tsx
// components/landing-page/SpecialOffersTab.tsx
setTimeout(() => {
  setIsOpen(true);
}, 5000);  // Change from 3000 to 5000 (5 seconds)
```

### Change Tab Position

```tsx
// Vertical position (currently centered)
className="fixed top-1/2 -translate-y-1/2 ..."

// Options:
top-1/4  // Upper quarter
top-1/3  // Upper third  
top-2/3  // Lower third
top-20   // Fixed pixels from top
bottom-20 // Fixed pixels from bottom
```

---

## 🔧 Advanced: Auto-Apply Discount

Want to auto-apply the discount when users click from the tab?

### Add "Shop Now" Button

```tsx
// In SpecialOffersTab.tsx, after the discount code display:
<a
  href={`/search?discount=${discountCode}`}
  className="w-full bg-[#DBEEC8] text-[#1D431D] font-bold py-3 rounded-lg hover:bg-white transition-all text-center block mt-4"
>
  Shop Now with Code
</a>
```

### Auto-Apply at Checkout

Shopify allows discount parameter in URLs:
```
https://your-store.com/checkout?discount=WELCOME10
```

Add a "Checkout" button:
```tsx
<a
  href={`/checkout?discount=${discountCode}`}
  className="..."
>
  Apply & Checkout
</a>
```

---

## 📊 Tracking & Analytics

### Monitor Discount Usage

**In Shopify:**
```
Admin → Discounts → WELCOME10 → View details

Track:
- Total uses
- Revenue generated
- Conversion rate
- Most popular products with code
```

### Add Analytics Tracking

```tsx
// Track when users get the code
if (response.ok) {
  // Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'discount_code_claimed', {
      code: 'WELCOME10',
      value: 10
    });
  }
  
  // Shopify Analytics
  if (window.Shopify?.analytics) {
    window.Shopify.analytics.publish('turks:discount_claimed', {
      code: 'WELCOME10',
      discount_percentage: 10
    });
  }
}
```

---

## 🎯 Recommended Settings

### For New Stores

```
Code: WELCOME10
Value: 10%
Applies to: Entire order
Minimum: None
Limit: 1 per customer
Duration: No end date
```

### For Established Stores

```
Code: WELCOME10
Value: 10%
Applies to: Entire order
Minimum: $50 purchase
Limit: 1 per customer
Duration: First 30 days after signup
```

### For High-Traffic Stores

```
Code: WELCOME10
Value: 10%
Applies to: Specific collections only
Minimum: $75 purchase
Limit: 1 per customer
Total limit: 500 uses per month
```

---

## 🔍 Testing the Discount

### Test Flow

1. **Open incognito/private window**
2. **Go to your site**
3. **Wait for tab to appear (3 seconds)**
4. **Enter email and subscribe**
5. **Copy the WELCOME10 code**
6. **Add products to cart**
7. **Go to checkout**
8. **Apply discount code**
9. **Verify 10% is deducted**

### Common Issues

**Code not working:**
- Check discount is active in Shopify
- Verify code name matches exactly (case-sensitive)
- Check if minimum purchase requirement met
- Ensure customer hasn't used it before (if limited)

**Code expired:**
- Check end date in Shopify
- Update or remove expiration

**Discount not showing full amount:**
- Check if "Entire order" is selected
- Verify no conflicting discounts
- Check collection/product restrictions

---

## 💰 Discount Strategy Tips

### Maximize Conversions

1. **First-time discount (10%)** - Gets them in the door
2. **Minimum purchase ($50)** - Increases average order value
3. **Limited time** - Creates urgency
4. **One per customer** - Prevents abuse

### Email Follow-ups

After someone claims the code, use Shopify Flow to:

**Day 1:** Send email with code reminder  
**Day 3:** Send "Don't forget your 10% off!"  
**Day 7:** Last chance reminder  
**Day 14:** Code expires (creates urgency)

---

## 🎨 Styling & Branding

The tab matches your brand colors:
- **Primary**: #1D431D (dark green)
- **Secondary**: #DBEEC8 (light green)
- **Accent**: White for hover states

### Mobile Breakpoints

```tsx
// Small phones
w-[380px] max-w-[calc(100vw-32px)]

// Tablets & up
sm:w-[350px]

// Desktop
Stays same width, centered vertically
```

---

## ✨ Summary

### What You Get

✅ Slide-out tab with 10% off offer  
✅ Email capture integration  
✅ Persistent discount code display  
✅ Copy-to-clipboard functionality  
✅ Mobile responsive design  
✅ Smooth animations  
✅ Tab handle always visible  
✅ Centered on screen (scrolls with page)  
✅ Smart behavior (shows code if already subscribed)  

### Setup Required

1. Create WELCOME10 discount in Shopify (5 min)
2. Test the flow end-to-end
3. Monitor usage and adjust settings

### Optional Enhancements

- Auto-apply discount to cart
- Add expiration dates
- Set minimum purchase amounts
- Create multiple discount tiers
- A/B test different percentages

---

**Your special offers tab is ready to convert visitors into customers!** 🎉

