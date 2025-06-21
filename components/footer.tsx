"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Network } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("skillconnect_session")
    if (session) {
      const sessionData = JSON.parse(session)
      setIsLoggedIn(sessionData.isLoggedIn)
      setUserRole(sessionData.role)
    }
  }, [])

  const getDashboardLink = (role: string) => {
    if (!isLoggedIn) {
      return "/auth/signup"
    }
    return role === "employer" ? "/dashboard/employer" : "/dashboard/seeker"
  }

  const getProfileLink = (role: string) => {
    if (!isLoggedIn) {
      return "/auth/login"
    }
    return role === "employer" ? "/dashboard/employer/profile" : "/dashboard/seeker/profile"
  }

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4 sm:mb-6 group">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                  SkillConnect
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">Kenya Jobs Marketplace</span>
              </div>
            </Link>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              Connecting talented professionals with amazing opportunities. Your next career move starts here.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">For Job Seekers</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/jobs" className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link 
                  href={isLoggedIn ? "/dashboard/seeker/profile" : "/auth/signup"} 
                  className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {isLoggedIn ? "My Profile" : "Create Profile"}
                </Link>
              </li>
              <li>
                <Link 
                  href={getDashboardLink("seeker")} 
                  className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {isLoggedIn && userRole === "seeker" ? "Job Seeker Dashboard" : "Job Seeker Dashboard"}
                </Link>
              </li>
              <li>
                <Link href="/career-advice" className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">For Employers</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  href={isLoggedIn && userRole === "employer" ? "/dashboard/employer/jobs" : "/auth/signup"} 
                  className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link 
                  href={getDashboardLink("employer")} 
                  className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {isLoggedIn && userRole === "employer" ? "Employer Dashboard" : "Employer Dashboard"}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link 
                  href={isLoggedIn && userRole === "employer" ? "/dashboard/employer/applicants" : "/auth/signup"} 
                  className="text-sm sm:text-base text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Search Talent
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact Us</h3>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base text-gray-400">hello@skillconnect.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base text-gray-400">+254 700 000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base text-gray-400">Nairobi, Kenya</span>
              </div>
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-400 mb-3">Subscribe to job alerts</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 text-sm"
                />
                <Button className="bg-orange-600 hover:bg-orange-700 text-white text-sm whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">© 2024 SkillConnect. All rights reserved.</p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link href="/privacy" className="text-xs sm:text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs sm:text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-xs sm:text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
