"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home,
  FileText,
  User,
  Settings,
  Bell,
  Search,
  Briefcase,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
  Filter,
  Mail,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { EmployerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function EmployerNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Application Received",
      message: "John Doe has applied for the Senior Developer position",
      time: "2 hours ago",
      type: "application",
      read: false,
      icon: FileText,
      color: "from-blue-400 to-cyan-500",
      jobTitle: "Senior Developer",
      applicantName: "John Doe",
    },
    {
      id: 2,
      title: "Application Status Updated",
      message: "Sarah Johnson's application has been shortlisted",
      time: "1 day ago",
      type: "status",
      read: false,
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500",
      jobTitle: "Marketing Manager",
      applicantName: "Sarah Johnson",
    },
    {
      id: 3,
      title: "Job Posting Expiring",
      message: "Your Frontend Developer job posting expires in 3 days",
      time: "2 days ago",
      type: "expiry",
      read: true,
      icon: Clock,
      color: "from-orange-400 to-red-500",
      jobTitle: "Frontend Developer",
    },
    {
      id: 4,
      title: "Profile View",
      message: "Alice Wanjiku viewed your company profile",
      time: "3 days ago",
      type: "profile",
      read: true,
      icon: User,
      color: "from-purple-400 to-pink-500",
      viewerName: "Alice Wanjiku",
    },
    {
      id: 5,
      title: "System Update",
      message: "New features available for job posting management",
      time: "1 week ago",
      type: "system",
      read: true,
      icon: Bell,
      color: "from-indigo-400 to-purple-500",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentUser, setCurrentUser] = useState(null)

  // Get current user on component mount
  useEffect(() => {
    const userData = localStorage.getItem("skillconnect_user")
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)
    }
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAsUnread = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    return matchesSearch && matchesType
  })

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <EmployerGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">SkillConnect</span>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Main Menu
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer">
                            <Home className="w-5 h-5" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span>Posted Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/applicants">
                            <FileText className="w-5 h-5" />
                            <span>Applicants</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/profile">
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Account
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/settings">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/notifications">
                            <Bell className="w-5 h-5" />
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                              <Badge className="ml-auto bg-orange-500 text-white border-0 rounded-full text-xs">
                                {unreadCount}
                              </Badge>
                            )}
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
                      className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Link href="/auth/login">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-xl">
                <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-slate-900">Notifications</h1>
                  <p className="text-sm text-slate-600">Stay updated with your job postings and applications</p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </header>

              <main className="flex-1 space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h2>
                    <p className="text-slate-600 text-lg">
                      Stay updated with your job postings and applications
                      {unreadCount > 0 && (
                        <span className="ml-2">
                          <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0 rounded-xl">
                            {unreadCount} unread
                          </Badge>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <Card className="simple-card">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-32 form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="application">Applications</SelectItem>
                          <SelectItem value="status">Status Updates</SelectItem>
                          <SelectItem value="expiry">Job Expiry</SelectItem>
                          <SelectItem value="profile">Profile Views</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications List */}
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`simple-card hover:scale-[1.02] transition-all duration-300 ${
                        !notification.read ? "border-orange-500/30 bg-orange-50/50" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${notification.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                          >
                            <notification.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3
                                className={`text-lg font-semibold ${notification.read ? "text-slate-700" : "text-slate-900"}`}
                              >
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-2 ml-4">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></div>
                                )}
                                <span className="text-slate-500 text-sm whitespace-nowrap">{notification.time}</span>
                              </div>
                            </div>
                            <p className={`${notification.read ? "text-slate-600" : "text-slate-700"} mb-4`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2">
                              {!notification.read ? (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Read
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => markAsUnread(notification.id)}
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
                                >
                                  <MarkAsUnread className="w-4 h-4 mr-2" />
                                  Mark as Unread
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteNotification(notification.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-600 hover:bg-red-50 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredNotifications.length === 0 && (
                  <Card className="simple-card">
                    <CardContent className="p-12 text-center">
                      <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No notifications</h3>
                      <p className="text-slate-600 mb-6">
                        {searchQuery || typeFilter !== "all"
                          ? "No notifications match your search criteria."
                          : "You're all caught up! Check back later for updates."
                        }
                      </p>
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl"
                        asChild
                      >
                        <Link href="/dashboard/employer/jobs">Post a Job</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </EmployerGuard>
  )
} 