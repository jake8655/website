"use client";

import { useEffect } from "react";
import { toast } from "sonner";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function CustomErrorToast({ error }: { error?: string }) {
  useEffect(() => {
    if (error) {
      toast.error(error);
      fetch(`${getBaseUrl()}/api/custom_error`);
    }
  }, [error]);

  return null;
}
