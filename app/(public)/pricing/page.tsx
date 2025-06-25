"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { 
  Check, 
  Star, 
  Building, 
  Briefcase, 
  DollarSign, 
  ArrowRight, 
  Crown
} from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const employerPlans = [
    {
      name: "Starter",
      price: isAnnual ? 99 : 119,
      description: "Perfect for small businesses",
      features: [
        "5 job postings per month",
        "Basic candidate search",
        "Email support",
        "Standard templates"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: isAnnual ? 199 : 239,
      description: "Ideal for growing companies",
      features: [
        "25 job postings per month",
        "Advanced candidate search",
        "Priority support",
        "Custom templates",
        "Analytics & reports"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: isAnnual ? 399 : 479,
      description: "For large organizations",
      features: [
        "Unlimited job postings",
        "AI-powered matching",
        "Dedicated manager",
        "Custom integrations",
        "Advanced reporting"
      ],
      popular: false
    }
  ]

  const jobSeekerPlans = [
    {
      name: "Free",
      price: 0,
      description: "Get started with basic search",
      features: [
        "Browse all job listings",
        "Basic profile creation",
        "Apply to unlimited jobs",
        "Job alerts"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: isAnnual ? 9 : 12,
      description: "Unlock advanced features",
      features: [
        "Priority applications",
        "Advanced profile features",
        "Salary insights",
        "Resume review",
        "Interview tools"
      ],
      popular: true
    },
    {
      name: "Career Pro",
      price: isAnnual ? 19 : 24,
      description: "Complete career platform",
      features: [
        "Personal career coach",
        "Skills assessment",
        "Networking events",
        "Portfolio builder",
        "Exclusive opportunities"
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            <DollarSign className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Choose the Perfect
            <span className="block text-orange-200">Plan for You</span>
          </h1>
          
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Whether you're hiring talent or looking for your next opportunity, 
            we have flexible pricing options to meet your needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-orange-200'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-white' : 'bg-orange-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-orange-600 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-orange-200'}`}>
              Annual
              <Badge className="ml-2 bg-green-500 text-white text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Employer Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">For Employers</h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find the perfect candidates with our comprehensive hiring solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {employerPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-orange-500 shadow-xl scale-105' : ''} hover-lift`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-2 rounded-full">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                  <p className="text-slate-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">KSh {plan.price.toLocaleString()}</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                    asChild
                  >
                    <Link href="/auth/signup">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Seeker Plans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">For Job Seekers</h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Accelerate your career with premium features and tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {jobSeekerPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-orange-500 shadow-xl scale-105' : ''} hover-lift`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-2 rounded-full">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                  <p className="text-slate-600">{plan.description}</p>
                  <div className="mt-4">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-slate-900">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-slate-900">KSh {plan.price.toLocaleString()}</span>
                        <span className="text-slate-600">/month</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                    asChild
                  >
                    <Link href="/auth/signup">
                      {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using SkillConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50" asChild>
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 