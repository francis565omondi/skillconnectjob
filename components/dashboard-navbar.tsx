"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Menu,
  X
} from "lucide-react"

export function DashboardNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notificationsCount, setNotificationsCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem("skillconnect_user")
        setUserData(data ? JSON.parse(data) : null)
      } catch (error) {
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const userRole = userData?.role || 'user'
  const userName = userData ? `${userData.first_name} ${userData.last_name}` : 'User'

  const handleLogout = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
    window.location.href = "/auth/login"
  }

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/dashboard/admin'
      case 'employer':
        return '/dashboard/employer'
      case 'seeker':
        return '/dashboard/seeker'
      default:
        return '/dashboard/seeker'
    }
  }

  if (loading) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Dashboard Link */}
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>/</span>
              <Link 
                href={getDashboardLink()} 
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationsCount}
              </span>
              )}
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium">{userName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                  <Link 
                    href="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 inline mr-2" />
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </div>
              <Link 
                href="/dashboard/profile" 
                className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link 
                href="/dashboard/settings" 
                className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}