import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://skillconnect.ke'),
  title: {
    default: "SkillConnect - Kenya Jobs Marketplace",
    template: "%s | SkillConnect"
  },
  description:
    "Connect with verified employers and skilled job seekers across Kenya. Find opportunities in IT, construction, hospitality, healthcare, and more. Post jobs, apply for positions, and grow your career.",
  keywords: [
    "jobs Kenya", 
    "employment Kenya", 
    "skilled workers Kenya", 
    "verified employers Kenya", 
    "job marketplace Kenya",
    "IT jobs Kenya",
    "construction jobs Kenya",
    "hospitality jobs Kenya",
    "healthcare jobs Kenya",
    "remote jobs Kenya",
    "career opportunities Kenya",
    "hire skilled workers Kenya",
    "find jobs Kenya",
    "post jobs Kenya"
  ],
  authors: [{ name: "SkillConnect Team", url: "https://skillconnect.ke" }],
  creator: "SkillConnect",
  publisher: "SkillConnect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://skillconnect.ke",
    siteName: "SkillConnect",
    title: "SkillConnect - Kenya Jobs Marketplace",
    description: "Connect with verified employers and skilled job seekers across Kenya. Find opportunities in IT, construction, hospitality, healthcare, and more.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SkillConnect - Kenya Jobs Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@skillconnect_ke",
    creator: "@skillconnect_ke",
    title: "SkillConnect - Kenya Jobs Marketplace",
    description: "Connect with verified employers and skilled job seekers across Kenya",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://skillconnect.ke",
    languages: {
      'en-KE': "https://skillconnect.ke",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#ea580c" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkillConnect",
  },
  other: {
    "msapplication-TileColor": "#ea580c",
    "msapplication-config": "/browserconfig.xml",
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#ea580c",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SkillConnect" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Botpress domains for faster chatbot loading */}
        <link rel="preconnect" href="https://cdn.botpress.cloud" />
        <link rel="preconnect" href="https://files.bpcontent.cloud" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#ea580c" />
        
        {/* Structured data for better SEO */}
        {/* Removed ld+json script due to CSP issues */}
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        
        {/* Botpress Chatbot Integration */}
        <Script
          src="https://cdn.botpress.cloud/webchat/v3.0/inject.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://files.bpcontent.cloud/2025/06/24/13/20250624132644-YDRBM1DG.js"
          strategy="afterInteractive"
        />
        
        {/* Google Maps API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
