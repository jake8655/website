"use client";

type PostHogProperties = Record<string, boolean | number | string>;

export async function capturePostHogEvent(
  event: string,
  properties?: PostHogProperties,
) {
  if (process.env.NODE_ENV !== "production") return;

  const { default: posthog } = await import("posthog-js");
  if (!posthog.__loaded) return;

  posthog.capture(event, properties);
}
