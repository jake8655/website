import type { Metadata } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";

import LightBlob from "@/components/light-blob";
import LightBlobMouse from "@/components/light-blob-mouse";
import { TRPCReactProvider } from "@/trpc/react";

import "@/app/globals.css";
import { CSPostHogProvider } from "@/components/posthog-provider";
import { env } from "@/env";

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
      className={`${GeistSans.variable} text-brand-light ${GeistMono.variable} antialiased`}
    >
      <FilteredPostHogProvider>
        <body className="font-sans">
          <TRPCReactProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <NextTopLoader color="#005cb8" />
            <LightBlob className="-translate-x-1/2 -translate-y-1/2 right-0 left-0" />
            <LightBlob className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
            <div className="hidden xl:block">
              <LightBlobMouse />
            </div>

            {children}
          </TRPCReactProvider>
        </body>
      </FilteredPostHogProvider>
    </html>
  );
}

function FilteredPostHogProvider({ children }: { children: React.ReactNode }) {
  if (env.NODE_ENV === "development" || env.VERCEL_ENV !== "production")
    return <>{children}</>;

  return <CSPostHogProvider>{children}</CSPostHogProvider>;
}
