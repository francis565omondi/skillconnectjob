"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import {
  Target,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Building,
  UserCheck,
  Briefcase,
  Users,
  Award,
  Star,
  Globe,
  MessageSquare,
  MapPin,
  Clock,
  TrendingUp,
  Lightbulb,
  Users2,
  Handshake,
} from "lucide-react";
import Link from "next/link";

export default function AboutOverviewPage() {
  const stats = [
    { icon: Users, number: "50K+", label: "Active Job Seekers" },
    { icon: Building, number: "5K+", label: "Partner Companies" },
    { icon: Briefcase, number: "25K+", label: "Jobs Posted Monthly" },
    { icon: UserCheck, number: "95%", label: "Success Rate" },
  ];

  const values = [
    {
      icon: Target,
      title: "Precision Matching",
      description: "AI-powered algorithms ensure perfect job-candidate alignment.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Highest standards of data protection and verification.",
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "Technology that never forgets careers are about people.",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Cutting-edge features to stay ahead of the curve.",
    },
  ];

  const features = [
    {
      icon: Users2,
      title: "Smart Matching",
      description: "Our AI analyzes skills, experience, and preferences to connect you with the perfect opportunity.",
    },
    {
      icon: Handshake,
      title: "Verified Employers",
      description: "All companies are thoroughly vetted to ensure legitimate opportunities and fair practices.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Access to training resources, mentorship programs, and career development tools.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant notifications for new jobs, application status, and interview invitations.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mwangi",
      role: "Software Developer",
      content: "SkillConnect helped me find my dream job in just 2 weeks. The matching was spot-on!",
      rating: 5,
    },
    {
      name: "John Kamau",
      role: "HR Manager",
      content: "We've hired 15 amazing developers through SkillConnect. The quality of candidates is outstanding.",
      rating: 5,
    },
    {
      name: "Grace Wanjiku",
      role: "Marketing Specialist",
      content: "The platform is so user-friendly and the support team is incredibly helpful.",
      rating: 5,
    },
  ];

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
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-6 shadow-lg">
              <Star className="w-4 h-4 mr-2 text-yellow-300" />
              Trusted by 50,000+ professionals
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Where <span className="text-orange-100 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-50 bg-clip-text text-transparent">Dreams</span> Meet<br />
              <span className="text-orange-100 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-50 bg-clip-text text-transparent">Opportunities</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-orange-100 leading-relaxed max-w-3xl mx-auto font-medium">
              Discover the story behind Kenya's most trusted job platform. We're not just connecting people to jobs – we're building careers, transforming lives, and shaping the future of work in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold px-8 py-6 rounded-xl" asChild>
                <Link href="/auth/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm text-lg font-semibold px-8 py-6 rounded-xl" asChild>
                <Link href="/jobs">Explore Opportunities</Link>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-orange-100 font-medium">Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">5K+</div>
                <div className="text-sm text-orange-100 font-medium">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-orange-100 font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        </section>

      {/* Stats Section */}
      <section className="section-simple bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-700 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </section>

      {/* Main Content */}
      <section className="section-simple bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                  Our Story
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  SkillConnect was born from a simple vision: to make job hunting and hiring 
                  in Kenya more efficient, transparent, and human. Founded by passionate 
                  developer Francis Omondi, we've created a platform that bridges the gap 
                  between talented individuals and forward-thinking companies.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Today, we serve thousands of job seekers and employers across Kenya, 
                  providing cutting-edge tools and resources to help everyone succeed 
                  in their career journey.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at SkillConnect
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex-shrink-0 mb-4">
                        <value.icon className="w-12 h-12 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkillConnect?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover what makes us the preferred choice for job seekers and employers
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <feature.icon className="w-12 h-12 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-700 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from real people who found success with SkillConnect
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-orange-700 text-lg">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="text-center max-w-4xl mx-auto">
                  <Lightbulb className="w-16 h-16 mx-auto mb-6 text-orange-200" />
                  <h2 className="text-3xl font-bold mb-6">
                    Our Mission
                  </h2>
                  <p className="text-orange-100 text-xl leading-relaxed max-w-3xl mx-auto">
                    To democratize access to quality employment opportunities in Kenya by 
                    creating a transparent, efficient, and human-centered platform that 
                    connects talent with opportunity, fostering economic growth and 
                    professional fulfillment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0 shadow-xl">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold mb-6">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-orange-100 text-xl mb-8 max-w-2xl mx-auto">
                  Join thousands of job seekers and employers who trust SkillConnect to build their future
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
              </CardContent>
            </Card>
          </div>
        </div>
        </section>

      <Footer />
    </div>
  );
} 