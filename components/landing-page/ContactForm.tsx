"use client";

import React, { useId, useRef, useState } from "react";
import { Icon } from "../Icons";
import { Button as BrandButton } from "./Button";
import { m, LazyMotion, domAnimation } from "framer-motion";

type ContactFormProps = {
  className?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string; // honeypot
};

export function ContactForm({ className }: ContactFormProps) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; error?: string }>(null);

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      // Limit to 10 digits for US numbers
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-format phone number as user types
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setForm((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
      setResult({ ok: false, error: "Please complete required fields." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
          website: form.website, // honeypot
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || "Failed to send message";
        setResult({ ok: false, error: msg });
      } else {
        setResult({ ok: true });
        setForm({ name: "", email: "", phone: "", message: "", website: "" });
      }
    } catch {
      setResult({ ok: false, error: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.form
        onSubmit={handleSubmit}
        ref={formRef}
        className={
          "flex flex-col gap-4 md:gap-6 w-full" + (className ? ` ${className}` : "")
        }
        aria-describedby="contact-status"
      >
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={form.website}
          onChange={onChange}
          className="hidden"
          aria-hidden="true"
        />

        <label htmlFor={nameId} className="sr-only">
          Name
        </label>
        <div className="flex py-4 pl-6 pr-9 gap-4 bg-[#DBEEC8] rounded-full border border-[#1D431D]">
          <Icon.userIcon />
          <input
            id={nameId}
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
          />
        </div>

        <label htmlFor={emailId} className="sr-only">
          Email
        </label>
        <div className="flex py-4 pl-6 pr-9 gap-4 bg-[#DBEEC8] rounded-full border border-[#1D431D]">
          <Icon.emailIcon />
          <input
            id={emailId}
            name="email"
            type="email"
            placeholder="Enter Your Email Address"
            value={form.email}
            onChange={onChange}
            required
            className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
          />
        </div>

        <label htmlFor={phoneId} className="sr-only">
          Phone
        </label>
        <div className="flex py-4 pl-6 pr-9 gap-4 bg-[#DBEEC8] rounded-full border border-[#1D431D]">
          <Icon.callIcon />
          <input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={onChange}
            maxLength={14}
            className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
            title="US phone number - auto-formatted as you type"
          />
        </div>

        <label htmlFor={messageId} className="sr-only">
          Message
        </label>
        <div className="flex py-4 pl-6 pr-9 gap-4 bg-[#DBEEC8] rounded-3xl border border-[#1D431D]">
          <Icon.messageIcon />
          <textarea
            id={messageId}
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={onChange}
            required
            rows={5}
            className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0 resize-none"
          />
        </div>

        <div className="w-fit mx-auto md:mt-2 relative">
          <BrandButton
            title={submitting ? "SENDING..." : "GET IN TOUCH"}
            onClick={() => {
              if (submitting) return;
              formRef.current?.requestSubmit();
            }}
            style={{ cursor: submitting ? "not-allowed" as const : "pointer" }}
            className={submitting ? "opacity-80 pointer-events-none" : ""}
          />
        </div>

        <div id="contact-status" role="status" aria-live="polite" className="text-center text-sm text-[#101010] min-h-5">
          {result?.ok && <span>Thanks! Your message has been sent.</span>}
          {result && !result.ok && <span>{result.error}</span>}
        </div>
      </m.form>
    </LazyMotion>
  );
}


