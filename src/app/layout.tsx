import type { Metadata } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";

import LightBlob from "@/components/light-blob";
import LightBlobMouse from "@/components/light-blob-mouse";
import { CSPostHogProvider } from "@/components/posthog-provider";
import SnowOverlayNoSSR from "@/components/snow-overlay-no-ssr";
import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";

import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dominik Tóth",
  description: "Personal website of Dominik Tóth.",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} text-brand-light ${GeistMono.variable} dark antialiased selection:bg-gradient-green selection:text-teal-900`}
    >
      <body className="font-sans">
        <FilteredPostHogProvider>
          <TRPCReactProvider>
            <ReactQueryDevtools />
            <NextTopLoader color="#005cb8" />
            <LightBlob className="-translate-x-1/2 -translate-y-1/2 right-0 left-0" />
            <LightBlob className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
            <LightBlobMouse className="hidden xl:block" />
            <SnowOverlayNoSSR />

            {children}
            <Toaster />
          </TRPCReactProvider>
        </FilteredPostHogProvider>
      </body>
    </html>
  );
}

function FilteredPostHogProvider({ children }: { children: React.ReactNode }) {
  if (env.NODE_ENV === "development" || env.VERCEL_ENV !== "production")
    return <>{children}</>;

  return <CSPostHogProvider>{children}</CSPostHogProvider>;
}
