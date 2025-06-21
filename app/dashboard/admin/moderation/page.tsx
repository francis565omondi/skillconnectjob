"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Users,
  Briefcase,
  Flag,
  Shield,
  Settings,
  Bell,
  Search,
  LogOut,
  Eye,
  Ban,
  CheckCircle,
  Building,
  FileText,
  AlertTriangle,
  Calendar,
  Filter,
  User,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"

export default function AdminModerationPage() {
  const [flaggedContent, setFlaggedContent] = useState([
    {
      id: 1,
      type: "job",
      title: "High Paying Remote Work",
      company: "QuickMoney Ltd",
      reportedBy: "user123",
      reason: "Suspicious salary claims",
      reportedDate: "2024-01-16",
      status: "pending",
      description: "Earn $5000 per day working from home. No experience needed!",
      severity: "high",
    },
    {
      id: 2,
      type: "job",
      title: "Easy Money Online",
      company: "FastCash Inc",
      reportedBy: "user456",
      reason: "Potential scam",
      reportedDate: "2024-01-15",
      status: "pending",
      description: "Make money fast with our simple online system",
      severity: "high",
    },
    {
      id: 3,
      type: "user",
      title: "Suspicious User Activity",
      company: "N/A",
      reportedBy: "user789",
      reason: "Multiple fake applications",
      reportedDate: "2024-01-14",
      status: "reviewed",
      description: "User has submitted 50+ applications in one day",
      severity: "medium",
    },
    {
      id: 4,
      type: "job",
      title: "Marketing Specialist",
      company: "Legit Company",
      reportedBy: "user101",
      reason: "Misleading job description",
      reportedDate: "2024-01-13",
      status: "resolved",
      description: "Job description doesn't match actual role",
      severity: "low",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleModerationAction = (id: number, action: "approve" | "remove") => {
    setFlaggedContent(flaggedContent.map(content => 
      content.id === id 
        ? { ...content, status: action === "approve" ? "resolved" : "removed" }
        : content
    ))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredContent = flaggedContent.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.reason.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || content.type === typeFilter
    const matchesStatus = statusFilter === "all" || content.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

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
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
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
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/notifications">
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">Notifications</span>
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
                  <h1 className="text-lg font-semibold text-slate-900">Content Moderation</h1>
                  <p className="text-sm text-slate-600">Review and manage flagged content</p>
                </div>
                <div className="flex items-center space-x-3">
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Content Moderation</h2>
                    <p className="text-slate-600 text-lg">Review and manage flagged content and reports</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="btn-secondary">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <Card className="simple-card">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search flagged content..."
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
                        <SelectContent className="bg-white border-orange-200">
                          <SelectItem value="all" className="text-slate-900 hover:bg-orange-50">
                            All Types
                          </SelectItem>
                          <SelectItem value="job" className="text-slate-900 hover:bg-orange-50">
                            Jobs
                          </SelectItem>
                          <SelectItem value="user" className="text-slate-900 hover:bg-orange-50">
                            Users
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32 form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-orange-200">
                          <SelectItem value="all" className="text-slate-900 hover:bg-orange-50">
                            All Status
                          </SelectItem>
                          <SelectItem value="pending" className="text-slate-900 hover:bg-orange-50">
                            Pending
                          </SelectItem>
                          <SelectItem value="reviewed" className="text-slate-900 hover:bg-orange-50">
                            Reviewed
                          </SelectItem>
                          <SelectItem value="resolved" className="text-slate-900 hover:bg-orange-50">
                            Resolved
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Flagged Content List */}
                <div className="space-y-4">
                  {filteredContent.map((content) => (
                    <Card key={content.id} className="simple-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                {content.type === "job" ? (
                                  <Briefcase className="w-6 h-6 text-red-600" />
                                ) : (
                                  <User className="w-6 h-6 text-red-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{content.title}</h3>
                                <p className="text-slate-600">{content.company}</p>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span className="flex items-center">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Reported by: {content.reportedBy}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {content.reportedDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-slate-600">
                                <strong>Reason:</strong> {content.reason}
                              </p>
                              <p className="text-sm text-slate-600">
                                <strong>Description:</strong> {content.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getSeverityColor(content.severity)} text-white border-0 rounded-xl`}>
                                {content.severity} severity
                              </Badge>
                              <Badge
                                className={`${
                                  content.status === "pending"
                                    ? "bg-orange-500"
                                    : content.status === "reviewed"
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                                } text-white border-0 rounded-xl`}
                              >
                                {content.status}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                <Eye className="w-3 h-3" />
                              </Button>
                              {content.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                    onClick={() => handleModerationAction(content.id, "approve")}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                    onClick={() => handleModerationAction(content.id, "remove")}
                                  >
                                    <Ban className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredContent.length === 0 && (
                  <Card className="simple-card">
                    <CardContent className="p-12 text-center">
                      <Flag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No flagged content</h3>
                      <p className="text-slate-600 mb-6">
                        {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                          ? "No flagged content matches your search criteria."
                          : "All flagged content has been reviewed and resolved."
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