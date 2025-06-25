"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Clock, 
  MapPin, 
  Monitor,
  Search,
  Filter,
  MoreHorizontal,
  Ban,
  Warning,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  AlertCircle,
  Info
} from "lucide-react"
import { UserActivityService, type UserSession, type UserActivity, type AdminAction, type UserWarning, type SuspiciousActivity, type DashboardStats } from "@/lib/userActivityService"
import { formatDistanceToNow } from "date-fns"

export default function AdminMonitoringPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [adminActions, setAdminActions] = useState<AdminAction[]>([])
  const [warnings, setWarnings] = useState<UserWarning[]>([])
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [
        statsData,
        sessionsData,
        activitiesData,
        adminActionsData,
        warningsData,
        suspiciousData
      ] = await Promise.all([
        UserActivityService.getDashboardStats(),
        UserActivityService.getUserSessions(),
        UserActivityService.getUserActivities(),
        UserActivityService.getAdminActions(),
        UserActivityService.getUserWarnings(),
        UserActivityService.getSuspiciousActivities(false) // Only unresolved
      ])

      setStats(statsData)
      setSessions(sessionsData)
      setActivities(activitiesData)
      setAdminActions(adminActionsData)
      setWarnings(warningsData)
      setSuspiciousActivities(suspiciousData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'ban': return 'bg-red-100 text-red-700'
      case 'suspend': return 'bg-orange-100 text-orange-700'
      case 'warn': return 'bg-yellow-100 text-yellow-700'
      case 'restrict': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return '📱'
      case 'tablet': return '📱'
      case 'desktop': return '💻'
      default: return '🖥️'
    }
  }

  const handleTakeAction = async (userId: string, actionType: AdminAction['action_type'], reason: string) => {
    try {
      // This would typically open a modal for admin input
      console.log(`Taking action ${actionType} on user ${userId} for reason: ${reason}`)
      // await UserActivityService.takeAdminAction(adminId, userId, actionType, reason)
      await loadDashboardData() // Refresh data
    } catch (error) {
      console.error('Error taking admin action:', error)
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      await UserActivityService.resolveSuspiciousActivity(alertId, 'admin-id') // Replace with actual admin ID
      await loadDashboardData() // Refresh data
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const filteredSessions = sessions.filter(session => 
    !searchQuery || 
    session.user_id.includes(searchQuery) ||
    session.ip_address.includes(searchQuery)
  )

  const filteredActivities = activities.filter(activity =>
    !searchQuery ||
    activity.user_id.includes(searchQuery) ||
    activity.activity_type.includes(searchQuery)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Activity Monitoring</h1>
          <p className="text-gray-600 mt-2">Monitor user activities, sessions, and take administrative actions</p>
        </div>
        <Button onClick={loadDashboardData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_sessions}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Logins (24h)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.logins_24h}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activities (24h)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activities_24h}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_alerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings (24h)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.warnings_24h}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user ID, IP address, or activity type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="activities">User Activities</TabsTrigger>
          <TabsTrigger value="alerts">Suspicious Alerts</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
          <TabsTrigger value="warnings">User Warnings</TabsTrigger>
        </TabsList>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Active User Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getDeviceIcon(session.device_type)}</div>
                        <div>
                          <p className="font-medium text-gray-900">User: {session.user_id}</p>
                          <p className="text-sm text-gray-600">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {session.ip_address} • {session.device_type}
                          </p>
                          <p className="text-sm text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Logged in {formatDistanceToNow(new Date(session.login_time))} ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleTakeAction(session.user_id, 'suspend', 'Suspicious activity')}>
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent User Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.activity_type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">User: {activity.user_id}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(activity.created_at))} ago
                        </p>
                        {activity.page_url && (
                          <p className="text-sm text-gray-500">Page: {activity.page_url}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{activity.ip_address}</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspicious Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Suspicious Activity Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspiciousActivities.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <p className="font-medium text-gray-900">{alert.alert_type}</p>
                        </div>
                        <p className="text-sm text-gray-600">User: {alert.user_id}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(alert.created_at))} ago
                        </p>
                        {alert.details && (
                          <p className="text-sm text-gray-500">
                            Details: {JSON.stringify(alert.details)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTakeAction(alert.user_id, 'warn', 'Suspicious activity detected')}
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Warn
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Recent Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminActions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getActionTypeColor(action.action_type)}>
                            {action.action_type.toUpperCase()}
                          </Badge>
                          <p className="font-medium text-gray-900">
                            Action on User: {action.target_user_id}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">Reason: {action.reason}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(action.created_at))} ago
                        </p>
                        {action.duration && (
                          <p className="text-sm text-gray-500">Duration: {action.duration}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={action.is_active ? "default" : "secondary"}>
                          {action.is_active ? "Active" : "Expired"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Warnings Tab */}
        <TabsContent value="warnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                User Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warnings.map((warning) => (
                  <div key={warning.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(warning.severity)}>
                            {warning.severity.toUpperCase()}
                          </Badge>
                          <p className="font-medium text-gray-900">{warning.warning_type}</p>
                        </div>
                        <p className="text-sm text-gray-600">User: {warning.user_id}</p>
                        <p className="text-sm text-gray-700 mb-2">{warning.message}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(warning.created_at))} ago
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={warning.is_acknowledged ? "default" : "secondary"}>
                          {warning.is_acknowledged ? "Acknowledged" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 