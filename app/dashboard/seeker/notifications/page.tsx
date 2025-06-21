"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  BookmarkIcon as MarkAsUnread,
} from "lucide-react"
import Link from "next/link"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function SeekerNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Job Match",
      message: "Software Developer position at TechHub Kenya matches your profile with 95% compatibility",
      time: "2 hours ago",
      type: "match",
      read: false,
      icon: Briefcase,
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 2,
      title: "Application Update",
      message: "Your application for Hotel Manager at Safari Lodge has been reviewed",
      time: "1 day ago",
      type: "update",
      read: false,
      icon: FileText,
      color: "from-green-400 to-emerald-500",
    },
    {
      id: 3,
      title: "Interview Scheduled",
      message: "BuildRight Ltd has scheduled an interview for Construction Site Manager position",
      time: "2 days ago",
      type: "interview",
      read: true,
      icon: Clock,
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 4,
      title: "Profile View",
      message: "Digital Agency viewed your profile",
      time: "3 days ago",
      type: "profile",
      read: true,
      icon: User,
      color: "from-orange-400 to-red-500",
    },
    {
      id: 5,
      title: "Application Rejected",
      message: "Unfortunately, your application for Marketing Specialist was not successful",
      time: "1 week ago",
      type: "rejection",
      read: true,
      icon: AlertCircle,
      color: "from-red-400 to-pink-500",
    },
  ])

  // Load notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const userData = localStorage.getItem("skillconnect_user")
        if (!userData) return
        
        const user = JSON.parse(userData)
        
        // TODO: Create notifications table and fetch real notifications
        // For now, we'll use mock data but this could be extended to fetch from database
        // const { data: notificationsData, error } = await supabase
        //   .from('notifications')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false })
        
        // if (!error && notificationsData) {
        //   setNotifications(notificationsData)
        // }
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    loadNotifications()
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

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <SeekerGuard>
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar
              className="border-r border-white/10"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)" }}
            >
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">SkillConnect</span>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-white/95 font-semibold uppercase tracking-wide text-xs">
                    Main Menu
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium"
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
                          className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium"
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
                          className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium"
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
                          className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/profile">
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-white/95 font-semibold uppercase tracking-wide text-xs">
                    Account
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium"
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
                          className="text-white hover:text-white hover:bg-white/20 data-[active=true]:bg-white/30 data-[active=true]:shadow-lg rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/notifications">
                            <Bell className="w-5 h-5" />
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                              <Badge className="ml-auto bg-white/20 text-white border-0 rounded-full text-xs">
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
                      className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium"
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
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 bg-black/20 backdrop-blur-xl">
                <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 rounded-xl" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-white">Notifications</h1>
                </div>
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 rounded-xl"
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
                    <h2 className="text-3xl font-bold text-white mb-2">Notifications</h2>
                    <p className="text-white/70 text-lg">
                      Stay updated with your job search activity
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

                {/* Notifications List */}
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`modern-card-dark hover:scale-[1.02] transition-all duration-300 ${
                        !notification.read ? "border-orange-500/30 bg-orange-500/5" : ""
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
                                className={`text-lg font-semibold ${notification.read ? "text-white/80" : "text-white"}`}
                              >
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-2 ml-4">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></div>
                                )}
                                <span className="text-white/60 text-sm whitespace-nowrap">{notification.time}</span>
                              </div>
                            </div>
                            <p className={`${notification.read ? "text-white/60" : "text-white/80"} mb-4`}>
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
                                  className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                                >
                                  <MarkAsUnread className="w-4 h-4 mr-2" />
                                  Mark as Unread
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteNotification(notification.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl"
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

                {notifications.length === 0 && (
                  <Card className="modern-card-dark">
                    <CardContent className="text-center py-12">
                      <Bell className="w-16 h-16 text-white/40 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                      <p className="text-white/60 mb-6">You're all caught up! Check back later for updates.</p>
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl"
                        asChild
                      >
                        <Link href="/jobs">Browse Jobs</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </SeekerGuard>
  )
}
