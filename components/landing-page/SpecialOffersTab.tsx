'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

export function SpecialOffersTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // Show tab after 3 seconds on first visit
  useEffect(() => {
    const hasSeenTab = sessionStorage.getItem('hasSeenOffersTab');
    const hasSubscribedBefore = localStorage.getItem('specialOffersSubscribed');
    
    if (hasSubscribedBefore) {
      setHasSubscribed(true);
      setDiscountCode('WELCOME10');
      return;
    }

    if (!hasSeenTab) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenOffersTab', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Generate and save discount code
        const code = 'WELCOME10';
        setDiscountCode(code);
        setHasSubscribed(true);
        localStorage.setItem('specialOffersSubscribed', 'true');
        
        setMessage({ 
          type: 'success', 
          text: `Success! Your code: ${code}` 
        });
        setEmail('');
        
        // Don't auto-close, let user see the code
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
    <>
      {/* Slide-out Tab */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 right-0 z-50 transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative bg-[#1D431D] text-white shadow-2xl rounded-l-2xl overflow-hidden w-[380px] max-w-[calc(100vw-32px)] sm:w-[350px]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close special offers tab"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6 pt-12">
            {/* Icon/Badge */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#DBEEC8] text-[#1D431D] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
                🌿 Special Offer
              </div>
            </div>

            {hasSubscribed ? (
              // Already subscribed - show discount code
              <>
                <h3 className="text-2xl font-bold text-center mb-2">
                  Your Discount Code
                </h3>
                <p className="text-[#DBEEC8] text-center mb-6 text-sm">
                  Use this code at checkout to save 10%!
                </p>
                
                <div className="bg-white/10 border-2 border-[#DBEEC8] rounded-lg p-6 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-[#DBEEC8] mb-2 uppercase tracking-wider">Your Code</p>
                    <p className="text-3xl font-bold text-white tracking-widest mb-3">
                      {discountCode}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(discountCode || '');
                        setMessage({ type: 'success', text: 'Copied to clipboard!' });
                        setTimeout(() => setMessage(null), 2000);
                      }}
                      className="text-xs text-[#DBEEC8] hover:text-white transition-colors underline"
                    >
                      Click to Copy
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/80 text-center">
                  Valid on your first order. Shop now and save! 🎉
                </p>
              </>
            ) : (
              // Not subscribed yet - show signup form
              <>
                <h3 className="text-2xl font-bold text-center mb-2">
                  Get 10% Off
                </h3>
                <p className="text-[#DBEEC8] text-center mb-6 text-sm">
                  Join our VIP list for exclusive deals, new strains, and special promotions!
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#DBEEC8] focus:border-transparent disabled:opacity-50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#DBEEC8] text-[#1D431D] font-bold py-3 rounded-lg hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#1D431D] border-t-transparent rounded-full animate-spin" />
                        Signing Up...
                      </span>
                    ) : (
                      'Claim My 10% Off'
                    )}
                  </button>
                </form>

                {/* Fine Print */}
                <p className="text-xs text-white/60 text-center mt-4">
                  By signing up, you agree to receive marketing emails. Unsubscribe anytime.
                </p>
              </>
            )}

            {/* Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 text-white border border-green-500/30'
                    : 'bg-red-500/20 text-white border border-red-500/30'
                }`}
                role="alert"
              >
                {message.text}
              </div>
            )}
          </div>

          {/* Decorative Element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#DBEEC8]/10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Tab Handle (when closed) - Always visible, centered vertically */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-1/2 -translate-y-1/2 right-0 z-40 bg-[#1D431D] text-white px-3 py-8 sm:px-4 sm:py-10 rounded-l-xl shadow-lg hover:bg-[#163416] transition-all duration-300 group ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:px-5'
        }`}
        aria-label="Open special offers"
      >
        <div className="flex flex-col items-center gap-2">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            {hasSubscribed ? 'Your Code' : '10% Off'}
          </span>
        </div>
      </button>
    </>
  );
}

