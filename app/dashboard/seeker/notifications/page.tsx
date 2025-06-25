"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell, CheckCircle, AlertCircle, Info, X,
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home, Briefcase, User, Settings, LogOut, Building, FileText, Search,
} from "lucide-react"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"

/* -------------------------------------------------------------------------- */
/*  1.  SHARED DOMAIN MODELS                                                  */
/* -------------------------------------------------------------------------- */

export interface Seeker {
  id: string
  name: string
  email: string
  // ➕ add any extra fields you store in localStorage
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
  seeker_id: string
}

/* -------------------------------------------------------------------------- */
/*  2.  COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function SeekerNotificationsPage() {
  /* ---------- 2.1  REACT STATE ------------------------------------------- */

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<Seeker | null>(null)

  /* ---------- 2.2  LOAD CURRENT USER ------------------------------------- */

  useEffect(() => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (userData) {
        setCurrentUser(JSON.parse(userData) as Seeker)
      } else {
        setError("No user data found. Please log in again.")
        setIsLoading(false)
      }
    } catch {
      setError("Error loading user data. Please log in again.")
      setIsLoading(false)
    }
  }, [])

  /* ---------- 2.3  FETCH NOTIFICATIONS WHEN USER IS READY ---------------- */

  useEffect(() => {
    if (currentUser) fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  /* ---------- 2.4  NOTIFICATIONS HELPERS --------------------------------- */

  const fetchNotifications = async () => {
    if (!currentUser) return

    try {
      setIsLoading(true)
      setError(null)

      // For now, we'll use mock data since we don't have a notifications table
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Application Status Update",
          message: "Your application for Senior Frontend Developer at TechCorp has been reviewed.",
          type: "info",
          read: false,
          created_at: new Date().toISOString(),
          seeker_id: currentUser.id,
        },
        {
          id: "2",
          title: "New Job Match",
          message: "We found a new job that matches your profile: React Developer at StartupXYZ",
          type: "success",
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          seeker_id: currentUser.id,
        },
        {
          id: "3",
          title: "Profile Completion",
          message: "Complete your profile to increase your chances of getting hired!",
          type: "warning",
          read: false,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          seeker_id: currentUser.id,
        },
      ]

      setNotifications(mockNotifications)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError("Failed to fetch notifications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )
    } catch (err) {
      console.error("Error deleting notification:", err)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationBadgeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  3.  RENDER                                                            */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
        <Card className="simple-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error Loading Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-600">{error}</p>
            <div className="flex gap-2">
              <Button onClick={fetchNotifications} className="btn-primary flex-1">
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

  /* ---------- Guard while currentUser loads ----------------------------- */
  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  /* ---------- UI -------------------------------------------------------- */

  return (
    <SeekerGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="px-4 py-4">
                  <Logo showTagline={false} />
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
                          <Link href="/dashboard/seeker">
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
                          <Link href="/dashboard/seeker/applications">
                            <FileText className="w-5 h-5" />
                            <span>My Applications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/jobs">
                            <Search className="w-5 h-5" />
                            <span>Browse Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/profile">
                            <User className="w-5 h-5" />
                            <span>My Profile</span>
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
                          <Link href="/dashboard/seeker/settings">
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
                          <Link href="/dashboard/seeker/notifications">
                            <Bell className="w-5 h-5" />
                            <span>Notifications</span>
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
                        <span className="font-medium">Sign Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-slate-900">Notifications</h1>
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {/*  HEADER  */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-slate-600">
                      Stay updated with your job applications and opportunities
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {notifications.filter(n => !n.read).length} unread
                    </Badge>
                  </div>
                </div>

                {/*  NOTIFICATIONS LIST  */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <Card className="simple-card">
                    <CardContent className="p-8 text-center">
                      <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications yet</h3>
                      <p className="text-slate-600 mb-4">
                        You'll see notifications here when you apply for jobs or receive updates.
                      </p>
                      <Button asChild className="btn-primary">
                        <Link href="/jobs">Browse Jobs</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`simple-card transition-all ${
                          !notification.read ? "border-orange-200 bg-orange-50/50" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-900">
                                      {notification.title}
                                    </h3>
                                    <Badge
                                      variant="secondary"
                                      className={getNotificationBadgeColor(notification.type)}
                                    >
                                      {notification.type}
                                    </Badge>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-slate-600 text-sm mb-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs"
                                    >
                                      Mark as read
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </SeekerGuard>
  )
}
