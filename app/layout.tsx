import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "SkillConnect - Kenya Jobs Marketplace",
  description:
    "Connect with verified employers and skilled job seekers across Kenya. Find opportunities in IT, construction, hospitality and more.",
  keywords: "jobs Kenya, employment, skilled workers, verified employers, job marketplace",
  authors: [{ name: "SkillConnect Team" }],
  openGraph: {
    title: "SkillConnect - Kenya Jobs Marketplace",
    description: "Connect with verified employers and skilled job seekers across Kenya",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "SkillConnect - Kenya Jobs Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillConnect - Kenya Jobs Marketplace",
    description: "Connect with verified employers and skilled job seekers across Kenya",
    images: ["/placeholder-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  themeColor: "#ea580c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkillConnect",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#ea580c",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SkillConnect" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
