"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar"
import {
  Users, Shield, Briefcase, FileText, Settings, Bell, LogOut, Brain,
  TrendingUp, Eye, AlertTriangle, CheckCircle, XCircle, Clock, 
  BarChart3, Activity, UserCheck, UserX, Building, MapPin, DollarSign,
  Calendar, Search, Filter, Plus, Edit, Trash, MoreHorizontal,
  RefreshCw, Download, Upload, Zap, Target, Award, Mail, Phone
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"
import { AIServices } from "@/lib/aiServices"
import { AdminGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { AdminService, AdminUser } from "@/lib/adminService"

interface User extends AdminUser {
  // Additional properties specific to this page if needed
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRisk, setFilterRisk] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(20)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, filterRole, filterStatus, filterRisk])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const users = await AdminService.loadUsers()
      setUsers(users)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions for users page...')
    
    // Subscribe to users changes
    const usersSubscription = AdminService.subscribeToUsers((updatedUsers) => {
      console.log('Users updated via subscription:', updatedUsers.length)
      setUsers(updatedUsers)
    })

    // Cleanup subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time subscriptions...')
      AdminService.unsubscribeFromAll()
    }
  }, [])

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.company_name && user.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesRole = filterRole === 'all' || user.role === filterRole
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      
      let matchesRisk = true
      if (filterRisk === 'high') {
        matchesRisk = (user.aiRiskScore || 0) > 70
      } else if (filterRisk === 'medium') {
        matchesRisk = (user.aiRiskScore || 0) > 40 && (user.aiRiskScore || 0) <= 70
      } else if (filterRisk === 'low') {
        matchesRisk = (user.aiRiskScore || 0) <= 40
      }

      return matchesSearch && matchesRole && matchesStatus && matchesRisk
    })

    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    setIsUpdating(true)
    try {
      const status = action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'banned'
      
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ))

      setShowUserModal(false)
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'AI Risk Score', 'Joined Date', 'Last Activity'],
      ...filteredUsers.map(user => [
        `${user.first_name} ${user.last_name}`,
        user.email,
        user.role,
        user.status,
        user.aiRiskScore || 0,
        new Date(user.created_at).toLocaleDateString(),
        new Date(user.last_activity || user.last_login).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getRiskColor = (score: number) => {
    if (score > 70) return 'text-red-600'
    if (score > 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getRiskBadgeColor = (score: number) => {
    if (score > 70) return 'bg-red-100 text-red-800'
    if (score > 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-light-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Users...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-red-200 bg-white shadow-lg">
              <SidebarHeader>
                <div className="px-4 py-4">
                  <Logo showTagline={false} />
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    Administration
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/users">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">User Management</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Job Moderation</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/ai">
                            <Brain className="w-5 h-5" />
                            <span className="font-medium">AI Insights</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/analytics">
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Analytics</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    System
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/settings">
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
                      className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
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
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-600 mt-1">
                      Manage platform users, monitor activity, and maintain security
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={loadUsers} variant="outline" disabled={isLoading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button onClick={exportUsers} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Users</p>
                          <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Users</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {users.filter(u => u.status === 'active').length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Suspended</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {users.filter(u => u.status === 'suspended').length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">High Risk</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {users.filter(u => (u.aiRiskScore || 0) > 70).length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <UserX className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters and Search */}
                <Card className="simple-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search by name, email, or company..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <Select value={filterRole} onValueChange={setFilterRole}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="seeker">Seekers</SelectItem>
                            <SelectItem value="employer">Employers</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterRisk} onValueChange={setFilterRisk}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Risk Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="low">Low Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      Users ({filteredUsers.length} found)
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>AI Risk</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                                  <p className="text-sm text-slate-500">{user.email}</p>
                                  {user.company_name && (
                                    <p className="text-xs text-slate-400">{user.company_name}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  user.role === 'admin' ? 'border-red-200 text-red-700' :
                                  user.role === 'employer' ? 'border-blue-200 text-blue-700' :
                                  'border-green-200 text-green-700'
                                }>
                                  {user.role}
                                </Badge>
                                {user.role === 'seeker' && user.applications_count !== undefined && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {user.applications_count} applications
                                  </p>
                                )}
                                {user.role === 'employer' && user.jobs_posted_count !== undefined && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {user.jobs_posted_count} jobs posted
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                                  user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    (user.aiRiskScore || 0) > 70 ? 'bg-red-500' :
                                    (user.aiRiskScore || 0) > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></div>
                                  <span className={`text-sm font-medium ${getRiskColor(user.aiRiskScore || 0)}`}>
                                    {user.aiRiskScore || 0}%
                                  </span>
                                </div>
                                {user.aiFlags && user.aiFlags.length > 0 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {user.aiFlags.length} flags
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-slate-600">
                                  {new Date(user.last_activity || user.last_login).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(user.last_activity || user.last_login).toLocaleTimeString()}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-slate-600">
                                  {new Date(user.created_at).toLocaleDateString()}
                                </p>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedUser(user)
                                      setShowUserModal(true)
                                    }}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {user.status === 'active' ? (
                                      <>
                                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                                          <AlertTriangle className="w-4 h-4 mr-2" />
                                          Suspend
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'ban')}>
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Ban
                                        </DropdownMenuItem>
                                      </>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Activate
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-slate-600">
                          Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>

        {/* User Details Modal */}
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-sm font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm font-medium">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge variant="outline" className={
                      selectedUser.role === 'admin' ? 'border-red-200 text-red-700' :
                      selectedUser.role === 'employer' ? 'border-blue-200 text-blue-700' :
                      'border-green-200 text-green-700'
                    }>
                      {selectedUser.role}
                    </Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={
                      selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedUser.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>AI Risk Score</Label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getRiskColor(selectedUser.aiRiskScore || 0)}`}>
                        {selectedUser.aiRiskScore || 0}%
                      </span>
                      <Badge className={getRiskBadgeColor(selectedUser.aiRiskScore || 0)}>
                        {(selectedUser.aiRiskScore || 0) > 70 ? 'High' : 
                         (selectedUser.aiRiskScore || 0) > 40 ? 'Medium' : 'Low'} Risk
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Role-specific Information */}
                {selectedUser.role === 'employer' && selectedUser.company_name && (
                  <div>
                    <Label>Company Information</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium">Company Name</p>
                        <p className="text-sm text-slate-600">{selectedUser.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Jobs Posted</p>
                        <p className="text-sm text-slate-600">{selectedUser.jobs_posted_count || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'seeker' && (
                  <div>
                    <Label>Job Seeker Information</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium">Applications</p>
                        <p className="text-sm text-slate-600">{selectedUser.applications_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-slate-600">{selectedUser.location || 'Not specified'}</p>
                      </div>
                    </div>
                    {selectedUser.skills && selectedUser.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedUser.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Flags */}
                {selectedUser.aiFlags && selectedUser.aiFlags.length > 0 && (
                  <div>
                    <Label>AI Security Flags</Label>
                    <div className="space-y-2 mt-2">
                      {selectedUser.aiFlags.map((flag, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Information */}
                <div>
                  <Label>Activity Information</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-sm text-slate-600">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Activity</p>
                      <p className="text-sm text-slate-600">
                        {new Date(selectedUser.last_activity || selectedUser.last_login).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  {selectedUser.status === 'active' ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => handleUserAction(selectedUser.id, 'suspend')}
                        disabled={isUpdating}
                      >
                        Suspend User
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleUserAction(selectedUser.id, 'ban')}
                        disabled={isUpdating}
                      >
                        Ban User
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleUserAction(selectedUser.id, 'activate')}
                      disabled={isUpdating}
                    >
                      Activate User
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
} 