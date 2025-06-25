"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Shield,
  Target,
  Award,
  Zap,
  Newspaper,
  Calendar,
  Code,
  Hammer,
  Utensils,
  Heart,
  Car,
  GraduationCap,
  DollarSign,
  Eye,
  Plus,
  BarChart3,
  Briefcase,
  Network,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { JobsService, type Job } from "@/lib/jobsService"
import { supabase } from "@/lib/supabaseClient"
import { PublicNavbar } from "@/components/public-navbar"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentJobs, setRecentJobs] = useState<Job[]>([])

  useEffect(() => {
    let channel: any = null;
    // Fetch recent jobs on mount
    const fetchJobs = async () => {
      const jobs = await JobsService.getRecentJobs(3)
      setRecentJobs(jobs)
    }
    fetchJobs()

    // Subscribe to real-time updates
    channel = supabase
      .channel('public:jobs:homepage')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
        fetchJobs()
      })
      .subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "1 day ago"
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const getSalaryDisplay = (job: typeof recentJobs[0]) => {
    if (job.salary_min && job.salary_max) {
      return `KSh ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
    } else if (job.salary_min) {
      return `KSh ${job.salary_min.toLocaleString()}+`
    }
    return "Competitive"
  }

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return <Badge className="bg-blue-100 text-blue-700 border-0 font-semibold">Full-time</Badge>
      case "part-time":
        return <Badge className="bg-purple-100 text-purple-700 border-0 font-semibold">Part-time</Badge>
      case "contract":
        return <Badge className="bg-orange-100 text-orange-700 border-0 font-semibold">Contract</Badge>
      case "internship":
        return <Badge className="bg-green-100 text-green-700 border-0 font-semibold">Internship</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const jobCategories = [
    { icon: Code, name: "Technology", count: "2,500+", color: "bg-blue-500", jobs: "Software, IT, Data" },
    { icon: Hammer, name: "Construction", count: "1,800+", color: "bg-orange-500", jobs: "Building, Engineering" },
    { icon: Utensils, name: "Hospitality", count: "1,200+", color: "bg-green-500", jobs: "Hotels, Restaurants" },
    { icon: Heart, name: "Healthcare", count: "900+", color: "bg-red-500", jobs: "Medical, Nursing" },
    { icon: Car, name: "Transportation", count: "750+", color: "bg-purple-500", jobs: "Logistics, Driving" },
    { icon: GraduationCap, name: "Education", count: "600+", color: "bg-indigo-500", jobs: "Teaching, Training" },
  ]

  const employerFeatures = [
    {
      icon: Eye,
      title: "Reach Qualified Candidates",
      description: "Access our pool of verified professionals with detailed profiles and skill assessments.",
      metric: "15,000+ Active Job Seekers"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track application performance, candidate engagement, and hiring success rates.",
      metric: "95% Success Rate"
    },
    {
      icon: Plus,
      title: "Easy Job Posting",
      description: "Post jobs in minutes with our streamlined process and AI-powered optimization.",
      metric: "5-Minute Setup"
    },
    {
      icon: DollarSign,
      title: "Cost-Effective Hiring",
      description: "Reduce hiring costs with our competitive pricing and efficient matching system.",
      metric: "40% Cost Reduction"
    },
  ]

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechKE Solutions",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 150K - 250K",
      posted: "2 days ago",
      verified: true,
      initials: "TS"
    },
    {
      id: 2,
      title: "Construction Project Manager",
      company: "BuildRight Kenya",
      location: "Mombasa, Kenya",
      type: "Contract",
      salary: "KES 180K - 300K",
      posted: "3 days ago",
      verified: true,
      initials: "BK"
    },
    {
      id: 3,
      title: "Hotel Operations Manager",
      company: "Serena Hotels",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 120K - 200K",
      posted: "1 day ago",
      verified: true,
      initials: "SH"
    }
  ]

  const testimonials = [
    {
      name: "Mary Wanjiku",
      role: "Software Developer",
      content: "SkillConnect helped me find my dream job in tech. The platform is so easy to use!",
      rating: 5,
      initials: "MW",
    },
    {
      name: "John Ochieng",
      role: "Construction Manager",
      content: "As an employer, I love how simple it is to find qualified candidates. Highly recommended!",
      rating: 5,
      initials: "JO",
    },
    {
      name: "Grace Akinyi",
      role: "Hotel Supervisor",
      content: "Found my perfect job within two weeks. The mobile app works great even with slow internet!",
      rating: 5,
      initials: "GA",
    },
  ]

  const services = [
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "Smart algorithms match your skills with the most relevant job opportunities.",
    },
    {
      icon: Shield,
      title: "Verified Employers",
      description: "All employers are verified to ensure legitimate opportunities and safe working environments.",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Get real-time alerts for new job matches and application updates.",
    },
    {
      icon: Award,
      title: "Career Development",
      description: "Access resources and training programs to advance your professional growth.",
    },
  ]

  const features = [
    {
      icon: Newspaper,
      title: "Local News",
      description: "Get the latest news and updates from your local area, keeping you informed on what matters most.",
    },
    {
      icon: Network,
      title: "Community Hub",
      description: "Connect with your neighbors, share information, and build a stronger community together.",
    },
    {
      icon: Calendar,
      title: "Events Calendar",
      description: "Discover local events, from community gatherings to markets, and never miss out on what's happening.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.15)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-md"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-6 shadow-lg">
                <Star className="w-4 h-4 mr-2 text-yellow-300" />
                Trusted by 15,000+ professionals
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Connect with Your Next<br />
                <span className="text-orange-100 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-50 bg-clip-text text-transparent">Opportunity</span> in Kenya
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-8 text-orange-100 leading-relaxed max-w-lg lg:max-w-none font-medium">
                Join thousands of skilled professionals and verified employers. Our platform matches you with perfect opportunities in IT, construction, hospitality, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold px-8 py-6 rounded-xl" asChild>
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm text-lg font-semibold px-8 py-6 rounded-xl" asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-10 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">5,000+</div>
                  <div className="text-sm text-orange-100 font-medium">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">15,000+</div>
                  <div className="text-sm text-orange-100 font-medium">Job Seekers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">95%</div>
                  <div className="text-sm text-orange-100 font-medium">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="relative rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    {featuredJobs.slice(0, 2).map((job) => (
                      <div key={job.id} className="bg-white/95 rounded-2xl p-6 text-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                              <span className="text-orange-600 font-bold text-sm">{job.initials}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-base">{job.title}</h3>
                              <p className="text-sm text-gray-600">{job.company}</p>
                            </div>
                          </div>
                          {job.verified && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs font-semibold">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.type}
                            </span>
                          </div>
                          <span className="font-bold text-orange-600">{job.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="section-simple bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="heading-lg mb-6">Explore Job Categories</h2>
            <p className="text-simple max-w-3xl mx-auto text-lg">
              Find opportunities in your field with our comprehensive job categories designed for the Kenyan market
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {jobCategories.map((category, index) => (
              <Link key={index} href={`/jobs?category=${category.name.toLowerCase()}`} className="group">
                <Card className="simple-card hover-lift text-center transition-all duration-300 group-hover:scale-105 rounded-2xl border-0 shadow-lg hover:shadow-2xl bg-white">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{category.jobs}</p>
                    <p className="text-sm text-orange-600 font-bold">{category.count} jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12 sm:mt-16">
            <Button variant="outline" className="btn-secondary rounded-xl px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300" asChild>
              <Link href="/jobs">
                Browse All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Job Postings Section */}
      <section className="section-simple bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="heading-lg mb-6">Recently Posted Jobs</h2>
            <p className="text-simple max-w-3xl mx-auto text-lg">
              Latest opportunities from verified employers across Kenya - updated in real-time
            </p>
          </div>
          
          <div className="grid-responsive-3">
            {recentJobs.map((job) => (
              <Card key={job.id} className="simple-card hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-orange-600 font-bold text-lg">
                          {job.company?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 mb-1">{job.title}</CardTitle>
                        <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs font-semibold">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(job.created_at)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center font-medium">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </span>
                    <span className="flex items-center font-medium">
                      {getJobTypeBadge(job.type)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-600 text-lg">{getSalaryDisplay(job)}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{job.category}</span>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-semibold hover:scale-105 transition-all duration-300" asChild>
                    <Link href={`/jobs/${job.id}/apply`}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12 sm:mt-16">
            <Button variant="outline" className="btn-secondary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300" asChild>
              <Link href="/jobs">
                View All Recent Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-simple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">Why Choose SkillConnect?</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Our platform is designed to make job hunting and hiring seamless, efficient, and successful
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="simple-card text-center hover-lift">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <service.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{service.title}</CardTitle>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Features Section */}
      <section className="section-simple bg-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">For Employers</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Find the perfect candidates for your organization with our powerful hiring tools
            </p>
          </div>
          
          <div className="grid-responsive-2">
            {employerFeatures.map((feature, index) => (
              <Card key={index} className="simple-card hover-lift border-orange-200">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{feature.description}</p>
                      <Badge className="bg-orange-100 text-orange-700 border-0 font-medium">
                        {feature.metric}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href="/auth/signup">
                  <Plus className="mr-2 h-5 w-5" />
                  Post a Job
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-simple bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">What Our Users Say</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Join thousands of satisfied users who have found their dream jobs through SkillConnect
            </p>
          </div>
          
          <div className="grid-responsive-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="simple-card hover-lift bg-white border-0 shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Transform Your Career?
            </h3>
            <p className="text-orange-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals and employers who trust SkillConnect to build their future
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild 
                variant="secondary" 
                className="bg-white text-orange-600 hover:bg-orange-50 text-lg font-semibold px-8 py-4"
              >
                <Link href="/auth/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-orange-600 text-lg font-semibold px-8 py-4"
              >
                <Link href="/jobs">
                  Explore Opportunities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
