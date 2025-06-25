"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export function LegalNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const legalPages = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/data-deletion", label: "Data Deletion" },
    { href: "/cookies", label: "Cookies" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {legalPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`font-medium transition-colors ${
                  isActive(page.href)
                    ? "text-orange-600 font-semibold"
                    : "text-slate-700 hover:text-orange-600"
                }`}
              >
                {page.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pt-4">
              {legalPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`py-2 transition-colors ${
                    isActive(page.href)
                      ? "text-orange-600 font-semibold"
                      : "text-slate-700 hover:text-orange-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {page.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 rounded-xl" 
                  asChild
                >
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button 
                  className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl" 
                  asChild
                >
                  <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 