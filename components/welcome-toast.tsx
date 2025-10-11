"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast(<p className="text-md">Welcome to turks!</p>, {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <p className="text-sm">
            We ship the highest quality local sourced THCA Flower by the ounce,
            anywhere in the United States.
          </p>
        ),
      });
    }
  }, []);

  return null;
}
