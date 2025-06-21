"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import {
  Users,
  Target,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Building,
  UserCheck,
  Briefcase,
  Home,
  Network,
  Menu,
  Info,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      description:
        "AI-powered algorithms ensure perfect job-candidate alignment based on skills and experience.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "We maintain the highest standards of data protection and verification for all users.",
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description:
        "While we leverage technology, we never forget that careers are about people and their dreams.",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description:
        "We continuously evolve our platform with cutting-edge features to stay ahead.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former VP of Talent at Google with 15+ years in HR technology",
      initials: "SJ",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Senior Engineer at LinkedIn, AI and machine learning expert",
      initials: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product leader with experience at Airbnb and Uber",
      initials: "ER",
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Full-stack architect with expertise in scalable systems",
      initials: "DK",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/about" className="text-orange-600 font-semibold">
                About
              </Link>
              <Link href="/jobs" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Jobs
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="bg-orange-600 text-white hover:bg-orange-700" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link 
                  href="/" 
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="text-orange-600 font-semibold py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/jobs" 
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link 
                  href="/contact" 
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button className="bg-orange-600 text-white hover:bg-orange-700" asChild>
                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="bg-orange-gradient text-white section-simple">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            About SkillConnect
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Connecting Talent with
            <span className="block text-orange-200">Opportunity</span>
          </h1>

          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            We're revolutionizing how people find careers and how companies
            discover talent through simple, effective matching.
          </p>

          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4">
            Join Our Mission
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-simple py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <Icon className="h-12 w-12 text-orange-200 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-orange-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-simple bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="accent-orange mx-auto" />
            <h2 className="heading-xl mb-6">Our Mission</h2>

            <p className="text-simple mb-8">
              To democratize access to meaningful career opportunities by using
              technology to create transparent, efficient, and fair connections
              between talented individuals and forward-thinking organizations.
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              {/* Mission features */}
              <div className="space-y-4">
                {[
                  "AI-Powered Job Matching",
                  "Real-time Application Tracking",
                  "Skills Assessment Tools",
                  "Career Development Resources",
                ].map((feat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  "Company Culture Insights",
                  "Salary Benchmarking",
                  "Interview Preparation",
                  "Professional Networking",
                ].map((feat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-simple bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="accent-orange mx-auto" />
            <h2 className="heading-xl mb-4">Our Values</h2>

            <p className="text-simple max-w-2xl mx-auto">
              These core principles guide everything we do, from product
              development to customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="simple-card-orange hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-orange-700 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-simple bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="accent-orange mx-auto" />
            <h2 className="heading-xl mb-4">Meet Our Team</h2>

            <p className="text-simple max-w-2xl mx-auto">
              Our diverse team brings together decades of experience in
              technology, HR, and business development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="simple-card hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-gradient text-white section-simple">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect job
            match through SkillConnect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4"
            >
              <Link href="/auth/signup">Get Started Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4"
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
