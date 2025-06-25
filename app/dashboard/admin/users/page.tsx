"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  UserCheck,
  Building,
  FileText,
  Mail,
  Calendar,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch users data
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } else {
        const formattedUsers = usersData.map((user: any) => ({
          id: user.id,
          name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email || 'N/A',
          email: user.email || 'N/A',
          role: user.role || 'N/A',
          status: user.status || 'active',
          joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
          lastActive: user.updated_at ? new Date(user.updated_at).toLocaleDateString() : (user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'),
          phone: user.phone || 'Not provided',
          location: user.location || 'Not specified',
        }))
        
        setUsers(formattedUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "suspend" | "activate" | "ban") => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: action === 'ban' ? 'banned' : action === 'suspend' ? 'suspended' : 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user status:', error)
        return
      }

      // Refresh users list
      fetchUsers()
    } catch (error) {
      console.error('Error handling user action:', error)
    }
  }

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
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
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
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
                  <h1 className="text-lg font-semibold text-slate-900">User Management</h1>
                  <p className="text-sm text-slate-600">Manage platform users and their accounts</p>
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">User Management</h2>
                    <p className="text-slate-600 text-lg">Monitor and manage all platform users</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="btn-secondary">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Users
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <Card className="simple-card">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-32 form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-orange-200">
                          <SelectItem value="all" className="text-slate-900 hover:bg-orange-50">
                            All Roles
                          </SelectItem>
                          <SelectItem value="seeker" className="text-slate-900 hover:bg-orange-50">
                            Seekers
                          </SelectItem>
                          <SelectItem value="employer" className="text-slate-900 hover:bg-orange-50">
                            Employers
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
                          <SelectItem value="active" className="text-slate-900 hover:bg-orange-50">
                            Active
                          </SelectItem>
                          <SelectItem value="suspended" className="text-slate-900 hover:bg-orange-50">
                            Suspended
                          </SelectItem>
                          <SelectItem value="banned" className="text-slate-900 hover:bg-orange-50">
                            Banned
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-orange-600" />
                      Platform Users ({filteredUsers.length})
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage user accounts, roles, and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-orange-50 rounded-2xl border border-orange-100 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-orange-100 hover:bg-orange-100">
                              <TableHead className="text-slate-700">User</TableHead>
                              <TableHead className="text-slate-700">Role</TableHead>
                              <TableHead className="text-slate-700">Status</TableHead>
                              <TableHead className="text-slate-700">Join Date</TableHead>
                              <TableHead className="text-slate-700">Last Active</TableHead>
                              <TableHead className="text-slate-700">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user: any) => (
                              <TableRow key={user.id} className="border-orange-100 hover:bg-orange-100">
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-slate-900">{user.name || user.email || 'N/A'}</div>
                                    <div className="text-sm text-slate-600">{user.email || 'N/A'}</div>
                                    <div className="text-xs text-slate-500">{user.phone || 'Not provided'}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`${user.role === "seeker" ? "bg-blue-500" : "bg-green-500"} text-white border-0 rounded-xl`}
                                  >
                                    {user.role === "seeker" ? (
                                      <Users className="w-3 h-3 mr-1" />
                                    ) : (
                                      <Building className="w-3 h-3 mr-1" />
                                    )}
                                    {user.role || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`${
                                      user.status === "active"
                                        ? "bg-green-500"
                                        : user.status === "suspended"
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                    } text-white border-0 rounded-xl`}
                                  >
                                    {user.status || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600">{user.joinDate || 'N/A'}</TableCell>
                                <TableCell className="text-slate-600">{user.lastActive || 'N/A'}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    {user.status === "active" ? (
                                      <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                                        onClick={() => handleUserAction(user.id, "suspend")}
                                      >
                                        <Ban className="w-3 h-3" />
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                        onClick={() => handleUserAction(user.id, "activate")}
                                      >
                                        <UserCheck className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
} 