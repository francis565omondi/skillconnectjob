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
  Mail,
  Calendar,
  Filter,
  Download,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState([
    {
      id: 1,
      companyName: "TechStart Solutions",
      contactPerson: "Jane Doe",
      email: "jane@techstart.co.ke",
      phone: "+254 700 123 456",
      submittedDate: "2024-01-15",
      documentType: "Business License",
      status: "pending",
      documentUrl: "#",
      notes: "New technology startup seeking verification",
    },
    {
      id: 2,
      companyName: "BuildCorp Kenya",
      contactPerson: "John Smith",
      email: "john@buildcorp.co.ke",
      phone: "+254 711 234 567",
      submittedDate: "2024-01-14",
      documentType: "Business License",
      status: "pending",
      documentUrl: "#",
      notes: "Construction company with 5+ years experience",
    },
    {
      id: 3,
      companyName: "Digital Innovations Ltd",
      contactPerson: "Sarah Johnson",
      email: "sarah@digitalinnovations.co.ke",
      phone: "+254 722 345 678",
      submittedDate: "2024-01-13",
      documentType: "Business License",
      status: "approved",
      documentUrl: "#",
      notes: "Digital marketing agency",
    },
    {
      id: 4,
      companyName: "Safari Lodge Resort",
      contactPerson: "Michael Brown",
      email: "michael@safarilodge.co.ke",
      phone: "+254 733 456 789",
      submittedDate: "2024-01-12",
      documentType: "Business License",
      status: "rejected",
      documentUrl: "#",
      notes: "Incomplete documentation provided",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleVerificationAction = (id: number, action: "approve" | "reject") => {
    setVerifications(verifications.map(verification => 
      verification.id === id 
        ? { ...verification, status: action === "approve" ? "approved" : "rejected" }
        : verification
    ))
  }

  const filteredVerifications = verifications.filter((verification) => {
    const matchesSearch =
      verification.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || verification.status === statusFilter
    return matchesSearch && matchesStatus
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
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
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
                  <h1 className="text-lg font-semibold text-slate-900">Company Verifications</h1>
                  <p className="text-sm text-slate-600">Review and approve company verification requests</p>
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Company Verifications</h2>
                    <p className="text-slate-600 text-lg">Review and manage company verification requests</p>
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
                        placeholder="Search by company name or contact person..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
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
                          <SelectItem value="approved" className="text-slate-900 hover:bg-orange-50">
                            Approved
                          </SelectItem>
                          <SelectItem value="rejected" className="text-slate-900 hover:bg-orange-50">
                            Rejected
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Verifications List */}
                <div className="space-y-4">
                  {filteredVerifications.map((verification) => (
                    <Card key={verification.id} className="simple-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <Building className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{verification.companyName}</h3>
                                <p className="text-slate-600">{verification.contactPerson}</p>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span className="flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {verification.email}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Submitted: {verification.submittedDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-slate-600">
                                <strong>Document Type:</strong> {verification.documentType}
                              </p>
                              <p className="text-sm text-slate-600">
                                <strong>Notes:</strong> {verification.notes}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <Badge
                              className={`${
                                verification.status === "pending"
                                  ? "bg-orange-500"
                                  : verification.status === "approved"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                              } text-white border-0 rounded-xl`}
                            >
                              {verification.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-xl">
                                <Download className="w-3 h-3" />
                              </Button>
                              {verification.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                    onClick={() => handleVerificationAction(verification.id, "approve")}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                    onClick={() => handleVerificationAction(verification.id, "reject")}
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

                {filteredVerifications.length === 0 && (
                  <Card className="simple-card">
                    <CardContent className="p-12 text-center">
                      <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No verification requests</h3>
                      <p className="text-slate-600 mb-6">
                        {searchQuery || statusFilter !== "all" 
                          ? "No verification requests match your search criteria."
                          : "All verification requests have been processed."
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