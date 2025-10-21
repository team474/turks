# Phone Number Validation Guide

## 🎯 What Changed

Your contact form now **automatically formats phone numbers** for Shopify and provides **detailed error messages** from Shopify's API.

---

## 📱 Phone Number Formats

### ✅ Accepted Formats (All Auto-Formatted)

The backend automatically converts these to Shopify's required format:

```
(555) 123-4567  →  +15551234567
555-123-4567    →  +15551234567
555.123.4567    →  +15551234567
5551234567      →  +15551234567
1-555-123-4567  →  +15551234567
+15551234567    →  +15551234567  (already correct)
+442012345678   →  +442012345678 (international)
```

### How It Works

The backend function `formatPhoneForShopify()`:

1. **Extracts digits** from any format
2. **Detects 10-digit US numbers** → adds `+1` prefix
3. **Detects 11-digit US numbers** (starting with 1) → adds `+` prefix
4. **Preserves international numbers** (already starting with `+`)
5. **Formats in E.164** (no dashes/spaces) for Shopify

### Invalid Inputs

If a phone can't be parsed, it's **omitted** from the Shopify request (treated as blank):
```
123            → Too short, omitted
abc-def-ghij   → No digits, omitted
```

---

## 🚨 Error Messages

### Before (Generic)
```
"Failed to submit inquiry"
```

### After (Specific from Shopify)
```
Phone number is invalid. Please use format: (555) 123-4567 or leave blank.
```

```
Email is invalid. Please check the email address.
```

```
first_name cannot be blank
```

---

## 🔧 How Error Handling Works

### Backend Flow

```typescript
1. Try to create Shopify customer
2. If Shopify returns 422 (validation error):
   
   a. Check for phone errors:
      → "Phone number is invalid. Please use format: +1-555-123-4567 or leave blank."
   
   b. Check for email errors:
      → "Email is invalid. Please check the email address."
   
   c. Check for other errors:
      → Pass through Shopify's error message
   
   d. If it's a duplicate email:
      → Update existing customer instead
```

### Error Response Structure

Shopify returns errors like this:
```json
{
  "errors": {
    "phone": ["is invalid"],
    "email": ["has already been taken"],
    "first_name": ["can't be blank"]
  }
}
```

We transform this into user-friendly messages.

---

## 🧪 Testing

### Test Phone Formats

Try these in your contact form:

| Input | Expected Result |
|-------|----------------|
| `5551234567` | ✅ Works (formatted to +1-555-123-4567) |
| `(555) 123-4567` | ✅ Works (formatted to +15551234567) |
| `+15551234567` | ✅ Works (already correct) |
| `+442012345678` | ✅ Works (UK number) |
| `(111)2223334` | ✅ Works (your original example!) |
| `123` | ✅ Works (omitted as invalid, form still submits) |
| *(blank)* | ✅ Works (phone is optional) |

### Test Error Messages

**Invalid phone (too complex):**
- Try: `abc-def-ghij`
- Result: Omitted, form submits successfully

**Duplicate email:**
- Submit form twice with same email
- Result: Second submission updates existing customer

---

## 🎨 Frontend Changes

### Phone Field Updated

```tsx
<input
  type="tel"                                    // Changed from "text"
  placeholder="Enter Your Phone Number (Optional)" // Shows it's optional
  title="Format: (555) 123-4567 or 555-123-4567"  // Tooltip on hover
/>
```

---

## 📋 Shopify's Phone Requirements

### What Shopify Expects

Shopify's Customer API expects phone numbers in:
- **E.164 format**: `+[country code][number]` (NO dashes or spaces)
- **Examples**: `+15551234567`, `+442012345678`
- **Critical**: Must be digits only after the + sign

### Why Format Matters

Shopify validates phones to ensure:
- ✅ Can be used for SMS notifications
- ✅ Compatible with international systems
- ✅ Consistent data format
- ✅ Can dial from Shopify admin

---

## 🌍 International Numbers

### Supported Formats

Your form now handles international numbers:

```
+44 20 1234 5678  (UK)
+33 1 42 86 82 00  (France)
+81 3 1234 5678    (Japan)
+61 2 1234 5678    (Australia)
```

### How International Numbers Are Handled

1. If phone starts with `+`, we assume it's already formatted correctly
2. We preserve the original format
3. Shopify validates against its international database

---

## 💡 Best Practices

### For Users

**Recommended input:**
- US: `(555) 123-4567` or `555-123-4567`
- International: `+[country code] [number]`

**Don't worry about format:**
- The backend handles all formatting automatically
- Any reasonable format works
- Extra spaces, dots, dashes are fine

### For Developers

**Backend validation:**
```typescript
formatPhoneForShopify(phone)
// Handles all formatting automatically
// Returns undefined if invalid (safely omitted)
```

**Error handling:**
```typescript
// Shopify error messages are passed through to frontend
if (errors.phone) {
  return { 
    error: `Phone number ${errors.phone[0]}. Please use format: +1-555-123-4567 or leave blank.` 
  };
}
```

---

## 🔍 Debugging

### Check Server Logs

When testing, watch the server console:

```bash
✅ Created Shopify customer with inquiry
# Success!

Phone validation error: is invalid
# Phone format issue (now auto-fixed)

Shopify API error: { errors: { phone: ['is invalid'] } }
# Old error (shouldn't see this anymore)
```

### Check Shopify Customer Record

After successful submission:
```
Shopify Admin → Customers → [Customer Name]

Phone field should show:
+1-555-123-4567  ← Formatted correctly!
```

---

## 🎉 Summary

### What You Get Now

✅ **Automatic phone formatting** - Any US format works  
✅ **International support** - `+XX` numbers preserved  
✅ **Detailed error messages** - Know exactly what's wrong  
✅ **Optional phone field** - Can be left blank  
✅ **No form failures** - Invalid phones are omitted, form still works  

### Example Error Flow

**Before:**
```
User enters: (111)2223334
Backend: Sends to Shopify
Shopify: Rejects (invalid format)
Frontend: "Failed to submit inquiry" ❌
```

**After:**
```
User enters: (111)2223334
Backend: Formats to +11112223334
Shopify: Accepts ✅
Frontend: "Thanks! Your message has been sent." ✅
```

---

## 📚 Related Files

- `app/api/contact/route.ts` - Phone formatting + error handling
- `components/landing-page/ContactForm.tsx` - Phone field UI
- `docs/QUICK_START.md` - Main setup guide
- `docs/SHOPIFY_FLOW_SETUP.md` - Automation guide

---

**Your form now handles phone numbers like a pro!** 📱✨

