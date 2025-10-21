import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';

// Simple in-memory rate limiter: per-IP timestamps within a rolling window
const ipToRequestTimes = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const ContactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional(),
  message: z.string().min(10).max(5000),
  // Honeypot field; real users never fill this
  website: z.string().optional(),
});

/**
 * Format phone number for Shopify
 * Shopify expects E.164 format: +[country code][number] (NO dashes/spaces)
 * Examples: +15551234567, +442071234567
 */
function formatPhoneForShopify(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  
  // Remove all non-digit characters except leading +
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If empty after removing non-digits, return undefined
  if (!digitsOnly) return undefined;
  
  // If it already starts with +, return + followed by digits only (E.164)
  if (hasPlus) {
    return `+${digitsOnly}`;
  }
  
  // If it's a 10-digit US number, format as +1XXXXXXXXXX (E.164)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  
  // If it's 11 digits and starts with 1 (US), format as +1XXXXXXXXXX
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }
  
  // For other cases (international), add + prefix if it looks valid
  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`;
  }
  
  // If we can't parse it, return undefined (will be omitted from Shopify request)
  return undefined;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const maybeIp = (req as unknown as { ip?: string }).ip;
  if (maybeIp) return String(maybeIp);
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = ipToRequestTimes.get(ip) ?? [];
  const recent = arr.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  ipToRequestTimes.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
    }

    const raw = await req.json();
    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, message, website } = parsed.data;
    // Honeypot caught
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Create/update customer in Shopify with the inquiry
    const result = await createShopifyCustomerInquiry({ name, email, phone, message, ip });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to submit inquiry' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

/**
 * Creates or updates a Shopify customer with their contact inquiry.
 * Returns the customer ID for notification purposes.
 */
async function createShopifyCustomerInquiry({
  name,
  email,
  phone,
  message,
  ip,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  ip: string;
}): Promise<{ success: boolean; customerId?: number; error?: string }> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shopifyDomain || !adminAccessToken) {
    return {
      success: false,
      error: 'Shopify Admin API not configured. Please contact support.',
    };
  }

  try {
    const timestamp = new Date().toISOString();
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;
    
    // Format phone for Shopify (E.164 format)
    const formattedPhone = formatPhoneForShopify(phone);

    // Format the inquiry note with more detail
    const inquiryNote = `📧 Contact Form Inquiry
Submitted: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}
${phone ? `Phone: ${phone}` : ''}
IP: ${ip}

Message:
${message}`;

    // Prepare customer data
    const customerData = {
      customer: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: formattedPhone || undefined,
        tags: 'contact_inquiry, needs_response',
        note: inquiryNote,
        email_marketing_consent: {
          state: 'not_subscribed',
          opt_in_level: 'unknown',
          consent_updated_at: timestamp,
        },
        // Add metafield for last contact date
        metafields: [
          {
            namespace: 'custom',
            key: 'last_contact_date',
            value: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            type: 'date',
          },
          {
            namespace: 'custom',
            key: 'contact_count',
            value: '1',
            type: 'number_integer',
          },
        ],
      },
    };

    // Try to create the customer
    const shopifyApiUrl = `${shopifyDomain}/admin/api/2024-10/customers.json`;
    const response = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify(customerData),
    });

    // Read response body once and handle both success and error cases
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('Failed to parse Shopify response:', parseError);
      return { success: false, error: 'Invalid response from Shopify' };
    }

    if (response.ok) {
      console.log('✅ Created Shopify customer with inquiry');
      return { success: true, customerId: responseData.customer?.id };
    }

    // If customer already exists, update them
    if (response.status === 422) {
      // Check for specific validation errors and provide helpful messages
      if (responseData.errors) {
        const errors = responseData.errors;
        
        // Phone validation error
        if (errors.phone) {
          const phoneError = Array.isArray(errors.phone) ? errors.phone[0] : errors.phone;
          console.error('Phone validation error:', phoneError);
          return { 
            success: false, 
            error: `Phone number ${phoneError}. Please use format: (555) 123-4567 or leave blank.` 
          };
        }
        
        // Email validation error
        if (errors.email) {
          const emailError = Array.isArray(errors.email) ? errors.email[0] : errors.email;
          console.error('Email validation error:', emailError);
          return { 
            success: false, 
            error: `Email ${emailError}. Please check the email address.` 
          };
        }
        
        // Other validation errors
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
          const firstErrorKey = errorKeys[0];
          const firstError = errors[firstErrorKey as keyof typeof errors];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          console.error('Validation error:', firstErrorKey, errorMessage);
          return { 
            success: false, 
            error: `${firstErrorKey} ${errorMessage}` 
          };
        }
      }
      
      // Email already exists - try to update
      if (responseData.errors?.email) {
        // Search for existing customer
        const searchResponse = await fetch(
          `${shopifyDomain}/admin/api/2024-10/customers/search.json?query=email:${encodeURIComponent(email)}`,
          {
            headers: {
              'X-Shopify-Access-Token': adminAccessToken,
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.customers && searchData.customers.length > 0) {
            const existingCustomer = searchData.customers[0];
            const customerId = existingCustomer.id;
            
            // Get current contact count
            const currentCount = existingCustomer.metafields?.find(
              (m: { namespace: string; key: string }) => m.namespace === 'custom' && m.key === 'contact_count'
            )?.value || '0';
            const newCount = parseInt(currentCount) + 1;
            
            // Append to existing notes
            const existingNote = existingCustomer.note || '';
            const updatedNote = existingNote 
              ? `${existingNote}\n\n${'─'.repeat(50)}\n\n${inquiryNote}`
              : inquiryNote;
            
            // Ensure tags include contact_inquiry and needs_response
            const existingTags = existingCustomer.tags ? existingCustomer.tags.split(',').map((t: string) => t.trim()) : [];
            if (!existingTags.includes('contact_inquiry')) existingTags.push('contact_inquiry');
            if (!existingTags.includes('needs_response')) existingTags.push('needs_response');
            
            // Update existing customer
            const updateResponse = await fetch(
              `${shopifyDomain}/admin/api/2024-10/customers/${customerId}.json`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Shopify-Access-Token': adminAccessToken,
                },
                body: JSON.stringify({
                  customer: {
                    id: customerId,
                    note: updatedNote,
                    tags: existingTags.join(', '),
                    phone: formattedPhone || existingCustomer.phone,
                    metafields: [
                      {
                        namespace: 'custom',
                        key: 'last_contact_date',
                        value: new Date().toISOString().split('T')[0],
                        type: 'date',
                      },
                      {
                        namespace: 'custom',
                        key: 'contact_count',
                        value: newCount.toString(),
                        type: 'number_integer',
                      },
                    ],
                  },
                }),
              }
            );

            if (updateResponse.ok) {
              console.log('✅ Updated existing customer with new inquiry');
              return { success: true, customerId };
            } else {
              const errorText = await updateResponse.text().catch(() => 'Unknown error');
              console.error('Failed to update customer:', errorText);
              return { success: false, error: 'Failed to update customer record' };
            }
          }
        }
      }
    }

    console.error('Shopify API error:', responseData);
    return { success: false, error: 'Failed to create customer record' };
  } catch (error) {
    console.error('Error creating Shopify customer inquiry:', error);
    return { success: false, error: 'Failed to process inquiry' };
  }
}



