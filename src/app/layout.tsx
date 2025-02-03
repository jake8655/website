import type { Metadata } from "next";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Noto_Color_Emoji } from "next/font/google";
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
  title: {
    template: "Dominik Tóth • %s",
    default: "Dominik Tóth",
  },
  description:
    "Dominik Tóth's personal website. I am a student and web developer building modern software.",

  generator: "Next.js",
  applicationName: "Dominik Tóth",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Dominik Tóth",
    "software engineer",
    "web developer",
    "Next.js developer",
    "React developer",
    "JavaScript developer",
    "TypeScript developer",
    "full-stack developer",
    "web development",
    "software development",
    "personal website",
    "personal portfolio",
    "tech blog",
  ],
  authors: [
    {
      name: "Dominik Tóth",
      url: "https://dominiktoth.com",
    },
  ],
  creator: "Dominik Tóth",
  publisher: "Dominik Tóth",
  formatDetection: {
    telephone: false,
    address: false,
    email: true,
  },

  openGraph: {
    title: "Dominik Tóth",
    description:
      "Dominik Tóth's personal website. I am a student and web developer building modern software.",
    url: "https://dominiktoth.com",
    siteName: "Dominik Tóth",
    images: [
      {
        url: "https://dominiktoth.com/images/memoji.png",
        width: 421,
        height: 421,
        alt: "Dominik Tóth",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    notranslate: false,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  twitter: {
    card: "summary_large_image",
    title: "Dominik Tóth",
    description:
      "Dominik Tóth's personal website. I am a student and web developer building modern software.",
    siteId: "1556401454931476484",
    creator: "@jake8655",
    creatorId: "1556401454931476484",
    images: ["https://dominiktoth.com/images/memoji.png"],
  },

  assets: ["https://dominiktoth.com/images"],
  category: "technology",
};

const notoEmoji = Noto_Color_Emoji({
  variable: "--font-noto-emoji",
  weight: "400",
  subsets: ["emoji"],
});

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${notoEmoji.variable} text-brand-light ${GeistMono.variable} dark antialiased selection:bg-gradient-green selection:text-teal-900`}
    >
      <body className="font-sans">
        <SpeedInsights />
        <FilteredPostHogProvider>
          <TRPCReactProvider>
            <ReactQueryDevtools />
            <NextTopLoader color="#005cb8" />
            <LightBlob className="-translate-x-1/2 -translate-y-1/2 right-0 left-0" />
            <LightBlob className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
            <LightBlobMouse className="hidden xl:block" />
            <SnowOverlayNoSSR />

            <Toaster />
            {children}
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
