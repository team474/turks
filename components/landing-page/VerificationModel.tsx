"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 1 day
const AGE_VERIFIED_AT_KEY = "ageVerificationAcceptedAt";

export function VerificationModel() {
  const [isOpen, setIsOpen] = useState(false);

  function handleYes() {
    try {
      localStorage.setItem(AGE_VERIFIED_AT_KEY, String(Date.now()));
      // Set a lightweight cookie as a server hint (optional)
      document.cookie = `ageVerification=1; max-age=${Math.floor(
        VERIFICATION_TTL_MS / 1000
      )}; path=/; samesite=lax`;
    } catch {
      // ignore storage errors
    }
    setIsOpen(false);
  }

  function handleNo() {
    alert("You are not allowed to enter. You must be 21 or older.");
  }

  useEffect(() => {
    try {
      const verifiedAtRaw = localStorage.getItem(AGE_VERIFIED_AT_KEY);
      if (verifiedAtRaw) {
        const verifiedAt = Number(verifiedAtRaw);
        const isValid =
          Number.isFinite(verifiedAt) && Date.now() - verifiedAt < VERIFICATION_TTL_MS;
        if (isValid) {
          setIsOpen(false);
          return;
        }
      }
    } catch {
      // ignore storage errors
    }
    setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[650px] w-full rounded-2xl p-4 md:p-7.5 border-none gap-8"
        style={{ background: "#ffffff" }}
        aria-describedby={undefined}
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-start">
          <div className="flex-1 pr-8">
            <DialogTitle className="text-[28px] text-[#101010] font-semibold leading-[120%] uppercase">
              Please confirm your age.
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirm you are 21+ to continue.
            </DialogDescription>
          </div>
        </div>

        <span className="w-full h-px bg-[#101010] opacity-10" />

        <div className="w-full flex flex-col justify-center items-center gap-7.5 p-7.5 rounded-3xl bg-[#E3EAD5]">
          <div className="flex flex-col gap-5 justify-center items-center">
            <p className="text-[28px] text-[#101010] font-semibold leading-[120%] uppercase">
              Are you 21+?
            </p>
            <p className="text-xl text-[#101010] font-normal leading-[150%]">
              You must be 21+ to enter.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleYes}
              className="cursor-pointer px-8 py-4 justify-center items-center flex rounded-full bg-[#1D431D] text-white text-center text-base font-bold leading-[150%] uppercase"
            >
              YES
            </button>
            <button
              onClick={handleNo}
              className="cursor-pointer px-8 py-4 justify-center items-center flex rounded-full border border-[#1D431D] text-[#1D431D] text-center text-base font-bold leading-[150%] uppercase"
            >
              No
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
