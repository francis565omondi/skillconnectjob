"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GoogleMap } from "@/components/ui/map"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home, Briefcase, User, Settings, Bell, LogOut, Building,
  Users, TrendingUp, Eye, PlusCircle, Calendar, MapPin
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { EmployerGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Footer } from "@/components/footer"

interface Employer {
  id: string
  company_name: string
  email: string
  first_name?: string
  last_name?: string
}

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  recentApplications: number
}

export default function EmployerDashboard() {
  const [currentUser, setCurrentUser] = useState<Employer | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    recentApplications: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("skillconnect_user")
        if (userData) {
          const user = JSON.parse(userData) as Employer
          setCurrentUser(user)
          await fetchDashboardStats(user)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const fetchDashboardStats = async (user: Employer) => {
    try {
      // Fetch jobs count
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, status")
        .eq("employer_id", user.id)

      if (jobsError) throw jobsError

      const totalJobs = jobs?.length || 0
      const activeJobs = jobs?.filter(job => job.status === "active").length || 0

      // Fetch applications count (mock data for now)
      const totalApplications = Math.floor(Math.random() * 50) + 10
      const recentApplications = Math.floor(Math.random() * 10) + 2

      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        recentApplications
      })
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError("Failed to load dashboard statistics")
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
        <Card className="simple-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-600">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => currentUser && fetchDashboardStats(currentUser)} className="btn-primary flex-1">
                Try Again
              </Button>
              <Button variant="outline" className="btn-secondary flex-1" asChild>
                <Link href="/fix-auth">Fix Auth</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <EmployerGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-border bg-white shadow-lg">
              <SidebarHeader>
                <div className="px-4 py-4">
                  <Logo showTagline={false} />
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    Dashboard
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer">
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Overview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    Jobs
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">My Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/applicants">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Applications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    Account
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/profile">
                            <User className="w-5 h-5" />
                            <span className="font-medium">Company Profile</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/settings">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Link href="/auth/login">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <main className="flex-1 space-y-6 p-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {currentUser?.first_name || currentUser?.company_name || 'Employer'}!
                      </h2>
                      <p className="text-orange-100">
                        Here's what's happening with your job postings today.
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <Building className="w-16 h-16 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Jobs</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalJobs}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Jobs</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.activeJobs}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Applications</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalApplications}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Recent Applications</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.recentApplications}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900">Quick Actions</CardTitle>
                      <CardDescription>
                        Manage your job postings and applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full justify-start" asChild>
                        <Link href="/dashboard/employer/jobs">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Post New Job
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/employer/applicants">
                          <Eye className="w-4 h-4 mr-2" />
                          View Applications
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/employer/profile">
                          <User className="w-4 h-4 mr-2" />
                          Update Profile
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                      <CardDescription>
                        Latest updates on your job postings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">New application received</p>
                            <p className="text-xs text-slate-500">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">Job posting published</p>
                            <p className="text-xs text-slate-500">1 hour ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">Profile updated</p>
                            <p className="text-xs text-slate-500">3 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Locations Map */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                      Your Job Locations
                    </CardTitle>
                    <CardDescription>
                      Map view of your active job postings across Kenya
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 rounded-lg overflow-hidden">
                      <GoogleMap
                        center="Nairobi, Kenya"
                        zoom={8}
                        markers={[
                          {
                            position: "Nairobi, Kenya",
                            title: "Software Developer",
                            info: `${currentUser?.company_name}<br/>Nairobi, Kenya<br/>Full-time`
                          },
                          {
                            position: "Mombasa, Kenya",
                            title: "Marketing Specialist",
                            info: `${currentUser?.company_name}<br/>Mombasa, Kenya<br/>Part-time`
                          },
                          {
                            position: "Kisumu, Kenya",
                            title: "Sales Representative",
                            info: `${currentUser?.company_name}<br/>Kisumu, Kenya<br/>Contract`
                          }
                        ]}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                      {stats.activeJobs} active job postings across Kenya
                    </div>
                  </CardContent>
                </Card>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </EmployerGuard>
  )
} 