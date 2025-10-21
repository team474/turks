'use client';

import { useState, FormEvent } from 'react';
import { Icon } from '../Icons';

export function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Submit to our API
      const response = await fetch('/api/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          website: honeypot, // Honeypot field
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Thank you for subscribing!' });
        setEmail('');
        
        // Track consent using Shopify's Customer Privacy API (if available)
        if (typeof window !== 'undefined' && window.Shopify?.customerPrivacy) {
          window.Shopify.customerPrivacy.setTrackingConsent(
            {
              marketing: true,
            },
            () => console.log('Marketing consent recorded')
          );
        }

        // Emit custom analytics event (if available)
        if (typeof window !== 'undefined' && window.Shopify?.analytics) {
          window.Shopify.analytics.publish('turks:email_capture_consent', {
            email: email,
            consent: true,
            source: 'footer',
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to subscribe. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Email capture error:', error);
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-4 w-full">
        {/* Honeypot field - hidden from real users */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px' }}
          aria-hidden="true"
        />
        
        <div className="px-8 py-4 flex-1 rounded-full border border-[#1D431D] bg-[#DBEEC8]">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
            className="text-base font-normal leading-[150%] text-[#1D431D] bg-transparent outline-none w-full placeholder:text-[#1D431D]/60 disabled:opacity-50"
          />
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex px-8 py-4 justify-center items-center rounded-[48px] bg-[#1D431D] hover:bg-[#163416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Subscribe to newsletter"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon.arrowRightIcon className="text-white" />
          )}
        </button>
      </form>
      
      {message && (
        <p 
          className={`mt-3 text-sm font-medium ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}
          role="alert"
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

// Type declarations for Shopify global objects
declare global {
  interface Window {
    Shopify?: {
      customerPrivacy?: {
        setTrackingConsent: (
          consent: {
            marketing?: boolean;
            analytics?: boolean;
            preferences?: boolean;
            sale_of_data?: boolean;
          },
          callback?: () => void
        ) => void;
      };
      analytics?: {
        publish: (eventName: string, eventData: Record<string, unknown>) => void;
      };
    };
  }
}

