"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Users,
  Briefcase,
  Flag,
  Shield,
  Settings,
  Bell,
  Search,
  LogOut,
  Send,
  Trash2,
  Eye,
  Calendar,
  Mail,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"
import { AIServices } from "@/lib/aiServices"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCompose, setShowCompose] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "medium",
    targetAudience: "all",
  })

  // Fetch notifications from Supabase
  useEffect(() => {
    let subscription: any = null
    const fetchNotifications = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('timestamp', { ascending: false })
        if (error) throw error
        setNotifications(data)
      } catch (err: any) {
        setError("Failed to load notifications: " + err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
    // Real-time subscription
    subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload: any) => {
        fetchNotifications()
      })
      .subscribe()
    return () => {
      if (subscription) supabase.removeChannel(subscription)
    }
  }, [])

  // Mark as read in Supabase
  const markAsRead = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
      if (error) throw error
      setNotifications(notifications.map(notif => notif.id === id ? { ...notif, read: true } : notif))
    } catch (err: any) {
      setError("Failed to mark as read: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete notification in Supabase
  const deleteNotification = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
      if (error) throw error
      setNotifications(notifications.filter(notif => notif.id !== id))
    } catch (err: any) {
      setError("Failed to delete notification: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Send notification with AI moderation
  const sendNotification = async () => {
    if (newNotification.title && newNotification.message) {
      setIsLoading(true)
      setError(null)
      try {
        // AI moderation
        const aiResult = await AIServices.moderateContent(newNotification.message, 'application')
        if (!aiResult.isAppropriate) {
          setError('AI flagged this message: ' + aiResult.flags.join(', '))
          setIsLoading(false)
          return
        }
        // Insert into Supabase
        const { error } = await supabase
          .from('notifications')
          .insert([{ ...newNotification, timestamp: new Date().toISOString(), read: false, action_required: false }])
        if (error) throw error
        // Refresh notifications
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .order('timestamp', { ascending: false })
        setNotifications(data)
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          priority: "medium",
          targetAudience: "all",
        })
        setShowCompose(false)
      } catch (err: any) {
        setError("Failed to send notification: " + err.message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    return matchesSearch && matchesType
  })

  const unreadCount = notifications.filter(notif => !notif.read).length

  return (
    <AdminGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">Admin Panel</span>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Dashboard
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin">
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Overview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Management
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/users">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Users</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/verifications">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Verifications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Moderation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/moderation">
                            <Flag className="w-5 h-5" />
                            <span className="font-medium">Flagged Content</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/reports">
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Reports</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    System
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/settings">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/notifications">
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">Notifications</span>
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
                        <span className="font-medium">Sign Out</span>
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
                  <h1 className="text-lg font-semibold text-slate-900">System Notifications</h1>
                  <p className="text-sm text-slate-600">Manage system notifications and alerts</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setShowCompose(!showCompose)}
                    className="btn-primary"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                  <Badge className="bg-orange-500 text-white border-0 rounded-xl px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">System Notifications</h2>
                    <p className="text-slate-600 text-lg">Manage and send system notifications</p>
                  </div>
                </div>

                {/* Compose Notification */}
                {showCompose && (
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900">Send New Notification</CardTitle>
                      <CardDescription className="text-slate-600">
                        Create and send a new system notification
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newNotification.title}
                            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                            placeholder="Notification title"
                            className="form-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select value={newNotification.type} onValueChange={(value) => setNewNotification({...newNotification, type: value})}>
                            <SelectTrigger className="form-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={newNotification.priority} onValueChange={(value) => setNewNotification({...newNotification, priority: value})}>
                            <SelectTrigger className="form-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="audience">Target Audience</Label>
                          <Select value={newNotification.targetAudience} onValueChange={(value) => setNewNotification({...newNotification, targetAudience: value})}>
                            <SelectTrigger className="form-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="seekers">Job Seekers</SelectItem>
                              <SelectItem value="employers">Employers</SelectItem>
                              <SelectItem value="admins">Administrators</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={newNotification.message}
                          onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                          placeholder="Notification message"
                          className="form-input"
                          rows={4}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={sendNotification} className="btn-primary">
                          <Send className="w-4 h-4 mr-2" />
                          Send Notification
                        </Button>
                        <Button variant="outline" onClick={() => setShowCompose(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32 form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Notifications List */}
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className={`simple-card ${!notification.read ? "border-orange-500/30 bg-orange-50/50" : ""}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getTypeIcon(notification.type)}
                              <h3 className={`text-lg font-semibold ${notification.read ? "text-slate-700" : "text-slate-900"}`}>
                                {notification.title}
                              </h3>
                              <Badge className={`${getPriorityColor(notification.priority)} text-white border-0 rounded-xl`}>
                                {notification.priority}
                              </Badge>
                              {notification.actionRequired && (
                                <Badge className="bg-red-500 text-white border-0 rounded-xl">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <p className={`${notification.read ? "text-slate-600" : "text-slate-700"} mb-2`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                System Notification
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                                className="border-green-500 text-green-600 hover:bg-green-50"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNotification(notification.id)}
                              className="border-red-500 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
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
                          : "All notifications have been processed."
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
} 