import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import nodemailer from 'nodemailer';
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

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 0);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO || 'turksbudco@gmail.com';
    const from = process.env.CONTACT_FROM || user || 'no-reply@localhost';

    if (!host || !port || !user || !pass) {
      return NextResponse.json({ error: 'Email transport is not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587/others (TLS)
      auth: { user, pass },
    });

    const subject = `New contact form submission from ${name}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : undefined,
      '',
      'Message:',
      message,
      '',
      `IP: ${ip}`,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#101010">
        <h2 style="margin:0 0 12px 0;">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p style="white-space:pre-wrap"><strong>Message:</strong><br/>${escapeHtml(message)}</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e1e1e1" />
        <p style="font-size:12px;color:#555">IP: ${escapeHtml(ip)}</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


