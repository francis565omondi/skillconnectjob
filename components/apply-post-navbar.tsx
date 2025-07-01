"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Home,
  LogOut,
  Settings
} from "lucide-react"
import { useState, useEffect } from "react"

interface ApplicationNavbarProps {
  backHref?: string
  jobTitle?: string
  companyName?: string
}

export function ApplicationNavbar({ backHref = "/jobs", jobTitle, companyName }: ApplicationNavbarProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Get current user from session
    const session = sessionStorage.getItem("skillconnect_session")
    if (session) {
      const sessionData = JSON.parse(session)
      if (sessionData.isLoggedIn) {
        setCurrentUser(sessionData)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
    window.location.href = "/auth/login"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Back button */}
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="hidden sm:block h-6 w-px bg-gray-300" />
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl" 
              asChild
            >
              <Link href={backHref}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job
              </Link>
            </Button>
          </div>

          {/* Center - Job info (if available) */}
          {jobTitle && companyName && (
            <div className="hidden md:flex flex-col items-center text-center">
              <h1 className="text-sm font-semibold text-slate-900 truncate max-w-xs">
                {jobTitle}
              </h1>
              <p className="text-xs text-slate-600">
                {companyName}
              </p>
            </div>
          )}

          {/* Right side - User actions */}
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 rounded-xl" 
                  asChild
                >
                  <Link href="/dashboard/seeker">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl" 
                  asChild
                >
                  <Link href="/dashboard/seeker/applications">
                    <FileText className="w-4 h-4 mr-2" />
                    My Applications
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 rounded-xl" 
                  asChild
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button 
                  className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl" 
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile job info */}
        {jobTitle && companyName && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
            <div className="text-center">
              <h1 className="text-sm font-semibold text-slate-900 truncate">
                {jobTitle}
              </h1>
              <p className="text-xs text-slate-600">
                {companyName}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 