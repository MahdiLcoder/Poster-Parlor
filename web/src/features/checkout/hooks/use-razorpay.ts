"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayFailureResponse,
} from "@/types/razorpay.d";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

interface UseRazorpayReturn {
  isLoaded: boolean;
  error: string | null;
  openPayment: (options: RazorpayOptions) => void;
}

export function useRazorpay(): UseRazorpayReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    // Load the script
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setError(null);
    };

    script.onerror = () => {
      setError("Failed to load Razorpay SDK");
      setIsLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup only if we added it
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openPayment = useCallback(
    (options: RazorpayOptions) => {
      if (!isLoaded || !window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        return;
      }

      try {
        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", (response: RazorpayFailureResponse) => {
          console.error("Payment failed:", response.error);
        });

        razorpay.open();
      } catch (err) {
        console.error("Error opening Razorpay:", err);
      }
    },
    [isLoaded]
  );

  return { isLoaded, error, openPayment };
}

export type {
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayFailureResponse,
};
