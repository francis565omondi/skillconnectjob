"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function ApplyPostNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="border-orange-600 text-orange-600 hover:bg-orange-50 rounded-xl" 
              asChild
            >
              <Link href="/jobs">Back to Jobs</Link>
            </Button>
            <Button 
              className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl" 
              asChild
            >
              <Link href="/dashboard/seeker">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 