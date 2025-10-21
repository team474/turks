import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

// Simple in-memory rate limiter
const ipToRequestTimes = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 10;

const EmailCaptureSchema = z.object({
  email: z.string().email().max(320),
  // Honeypot field
  website: z.string().optional(),
});

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
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    const raw = await req.json();
    const parsed = EmailCaptureSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, website } = parsed.data;

    // Honeypot check - if filled, silently accept but don't process
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: 'Subscribed successfully!' });
    }

    // Check if Shopify Admin API is configured
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyDomain || !adminAccessToken) {
      console.error('Shopify Admin API not configured');
      return NextResponse.json(
        { error: 'Email subscription service not configured' },
        { status: 500 }
      );
    }

    // Create or update customer in Shopify with email marketing consent
    const shopifyApiUrl = `${shopifyDomain}/admin/api/2024-10/customers.json`;

    const customerData = {
      customer: {
        email: email,
        email_marketing_consent: {
          state: 'subscribed',
          opt_in_level: 'single_opt_in',
          consent_updated_at: new Date().toISOString(),
        },
        tags: 'footer_signup',
      },
    };

    const response = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Check if customer already exists
      if (response.status === 422 && errorData.errors?.email) {
        // Customer exists, try to update them instead
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
            const customerId = searchData.customers[0].id;
            
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
                    email_marketing_consent: {
                      state: 'subscribed',
                      opt_in_level: 'single_opt_in',
                      consent_updated_at: new Date().toISOString(),
                    },
                  },
                }),
              }
            );

            if (updateResponse.ok) {
              return NextResponse.json({
                ok: true,
                message: 'Subscription updated successfully!',
              });
            }
          }
        }
        
        return NextResponse.json({
          ok: true,
          message: 'You are already subscribed!',
        });
      }

      console.error('Shopify API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Subscribed successfully!',
    });
  } catch (err) {
    console.error('Email capture error:', err);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}

