"use client"

import { GoogleMap, JobLocationMap, CompanyLocationMap } from "@/components/ui/map"
import { PublicNavbar } from "@/components/public-navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building, Briefcase } from "lucide-react"

export default function TestMapPage() {
  return (
    <div className="min-h-screen bg-light-gradient">
      <PublicNavbar />
      
      <div className="section-simple pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Map Integration Demo
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how maps can enhance your SkillConnect experience with job locations, company offices, and directions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Location Map */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    Job Location Example
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">Senior Software Engineer</h3>
                      <p className="text-sm text-slate-600">TechKE Solutions</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Westlands, Nairobi, Kenya</span>
                      </div>
                    </div>
                    <JobLocationMap
                      address="Westlands, Nairobi, Kenya"
                      companyName="TechKE Solutions"
                      jobTitle="Senior Software Engineer"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Location Map */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-orange-600" />
                    Company Office Example
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">Serena Hotels</h3>
                      <p className="text-sm text-slate-600">Hospitality & Tourism</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Central Business District, Nairobi</span>
                      </div>
                    </div>
                    <CompanyLocationMap
                      address="Central Business District, Nairobi, Kenya"
                      companyName="Serena Hotels"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>How to Use Maps in Your Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">1. Job Listings</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Add location maps to job postings to help candidates find the workplace.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-xs">
                        {`<JobLocationMap
  address="Westlands, Nairobi"
  companyName="TechKE Solutions"
  jobTitle="Software Engineer"
/>`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">2. Company Profiles</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Show company office locations on employer profiles.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-xs">
                        {`<CompanyLocationMap
  address="CBD, Nairobi"
  companyName="Serena Hotels"
/>`}
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 