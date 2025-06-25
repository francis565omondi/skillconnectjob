import { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "job"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = "/og-image.svg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | SkillConnect` : "SkillConnect - Kenya Jobs Marketplace"
  const fullDescription = description || "Connect with verified employers and skilled job seekers across Kenya. Find opportunities in IT, construction, hospitality, healthcare, and more."
  const fullUrl = url ? `https://skillconnect.ke${url}` : "https://skillconnect.ke"

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      "jobs Kenya",
      "employment Kenya", 
      "skilled workers Kenya",
      "verified employers Kenya",
      "job marketplace Kenya",
      ...keywords
    ],
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: "SkillConnect",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_KE",
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [{ name: author }] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
      site: "@skillconnect_ke",
      creator: "@skillconnect_ke",
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

// Helper function for job-specific SEO
export function generateJobSEO(job: {
  title: string
  company: string
  location: string
  description: string
  id: string
  type: string
  salary_min?: number
  salary_max?: number
}) {
  const salaryText = job.salary_min && job.salary_max 
    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
    : job.salary_min 
    ? `$${job.salary_min.toLocaleString()}+`
    : "Competitive salary"

  return generateSEO({
    title: `${job.title} at ${job.company}`,
    description: `${job.title} position at ${job.company} in ${job.location}. ${job.description.substring(0, 150)}...`,
    keywords: [
      job.title,
      job.company,
      job.location,
      job.type,
      "job Kenya",
      "employment Kenya",
      "career Kenya"
    ],
    url: `/jobs/${job.id}`,
    type: "job",
    tags: [job.title, job.company, job.location, job.type],
  })
}

// Helper function for company-specific SEO
export function generateCompanySEO(company: {
  name: string
  description: string
  location: string
  industry: string
}) {
  return generateSEO({
    title: `${company.name} - Company Profile`,
    description: `Learn about ${company.name}, a ${company.industry} company in ${company.location}. ${company.description}`,
    keywords: [
      company.name,
      company.industry,
      company.location,
      "company Kenya",
      "employer Kenya",
      "career opportunities"
    ],
    url: `/company/${company.name.toLowerCase().replace(/\s+/g, '-')}`,
    type: "website",
    tags: [company.name, company.industry, company.location],
  })
} 