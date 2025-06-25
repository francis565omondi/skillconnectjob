import { Metadata } from "next"

export const homePageMetadata: Metadata = {
  title: "Home | SkillConnect",
  description: "SkillConnect is Kenya's premier job marketplace connecting verified employers with skilled professionals. Find your next career opportunity or hire the perfect candidate today.",
  keywords: [
    "jobs Kenya",
    "career opportunities Kenya", 
    "hire skilled workers Kenya",
    "find jobs Kenya",
    "employment Kenya",
    "job search Kenya",
    "recruitment Kenya",
    "IT jobs Kenya",
    "construction jobs Kenya",
    "hospitality jobs Kenya"
  ],
  openGraph: {
    title: "SkillConnect - Kenya Jobs Marketplace",
    description: "SkillConnect is Kenya's premier job marketplace connecting verified employers with skilled professionals. Find your next career opportunity or hire the perfect candidate today.",
    url: "https://skillconnect.ke/",
    siteName: "SkillConnect",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SkillConnect - Kenya Jobs Marketplace",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillConnect - Kenya Jobs Marketplace",
    description: "SkillConnect is Kenya's premier job marketplace connecting verified employers with skilled professionals.",
    images: ["/og-image.svg"],
    site: "@skillconnect_ke",
    creator: "@skillconnect_ke",
  },
  alternates: {
    canonical: "https://skillconnect.ke/",
  },
} 