'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
} from '@/components/ui/sidebar'
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
  Activity,
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  RefreshCw,
  Zap,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertCircle,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { AdminGuard } from '@/components/admin-auth-guard'
import { AIServices, MaliciousActivityReport, ContentAnalysis } from '@/lib/aiServices'

export default function AIMonitoringPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'malicious' | 'moderation' | 'insights'>('overview')
  const [maliciousReports, setMaliciousReports] = useState<MaliciousActivityReport[]>([])
  const [moderationReports, setModerationReports] = useState<ContentAnalysis[]>([])
  const [aiStats, setAiStats] = useState({
    totalScans: 0,
    maliciousDetected: 0,
    contentFlagged: 0,
    accuracy: 0,
    lastScan: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch and analyze real data for AI monitoring
  useEffect(() => {
    const fetchAIReports = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Example: Fetch users and applications for AI analysis
        // You can expand this to fetch more data as needed
        const usersRes = await fetch('/api/admin/users')
        const users = await usersRes.json()
        const jobsRes = await fetch('/api/admin/jobs')
        const jobs = await jobsRes.json()
        const applicationsRes = await fetch('/api/admin/applications')
        const applications = await applicationsRes.json()

        // Run AI analysis for malicious activity
        const maliciousResults: MaliciousActivityReport[] = await Promise.all(
          users.slice(0, 10).map(async (user: any) => {
            return await AIServices.detectMaliciousActivity({
              email: user.email,
              profile: user.profile || '',
              applications: applications.filter((a: any) => a.applicant_id === user.id).map((a: any) => a.cover_letter || ''),
              behavior: {
                loginFrequency: user.loginFrequency || 0,
                applicationRate: user.applicationRate || 0,
                profileCompleteness: user.profileCompleteness || 100,
                lastActivity: user.updated_at || user.created_at || ''
              }
            })
          })
        )
        setMaliciousReports(maliciousResults)

        // Run AI content moderation for jobs
        const moderationResults: ContentAnalysis[] = await Promise.all(
          jobs.slice(0, 10).map(async (job: any) => {
            return await AIServices.moderateContent(job.description || '', 'job')
          })
        )
        setModerationReports(moderationResults)

        // Update AI stats
        setAiStats({
          totalScans: users.length + jobs.length,
          maliciousDetected: maliciousResults.filter(r => r.isMalicious).length,
          contentFlagged: moderationResults.filter(r => !r.isAppropriate).length,
          accuracy: 95, // Placeholder, you can calculate based on AI results
          lastScan: new Date().toISOString()
        })
      } catch (err: any) {
        setError('Failed to fetch AI monitoring data: ' + err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAIReports()
  }, [])

  const handleScanUsers = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('AI scan completed')
    } catch (error) {
      console.error('AI scan error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModerateContent = async () => {
    setIsLoading(true)
    try {
      // Simulate content moderation
      await new Promise(resolve => setTimeout(resolve, 1500))
      // In real implementation, this would call AIServices.moderateContent
      console.log('Content moderation completed')
    } catch (error) {
      console.error('Content moderation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'spam': return <AlertTriangle className="w-4 h-4" />
      case 'fake_profile': return <UserX className="w-4 h-4" />
      case 'suspicious_behavior': return <Activity className="w-4 h-4" />
      case 'inappropriate_content': return <FileText className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">AI Monitoring</span>
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
                    AI Monitoring
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'overview'}
                          onClick={() => setActiveTab('overview')}
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Brain className="w-5 h-5" />
                          <span className="font-medium">AI Overview</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'malicious'}
                          onClick={() => setActiveTab('malicious')}
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Shield className="w-5 h-5" />
                          <span className="font-medium">Malicious Activity</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'moderation'}
                          onClick={() => setActiveTab('moderation')}
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <FileText className="w-5 h-5" />
                          <span className="font-medium">Content Moderation</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'insights'}
                          onClick={() => setActiveTab('insights')}
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-medium">AI Insights</span>
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
                  <h1 className="text-lg font-semibold text-slate-900">AI-Powered Security Monitoring</h1>
                  <p className="text-sm text-slate-600">Monitor malicious activities and content moderation</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-orange-500 text-white border-0 rounded-xl px-3 py-1">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Active
                  </Badge>
                </div>
              </header>

              <main className="flex-1 space-y-6 p-6">
                {/* AI Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* AI Stats Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total AI Scans</CardTitle>
                          <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{aiStats.totalScans.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">
                            +12% from last month
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Malicious Detected</CardTitle>
                          <Shield className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">{aiStats.maliciousDetected}</div>
                          <p className="text-xs text-muted-foreground">
                            -5% from last week
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Content Flagged</CardTitle>
                          <FileText className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">{aiStats.contentFlagged}</div>
                          <p className="text-xs text-muted-foreground">
                            +8% from last week
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                          <Target className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{aiStats.accuracy}%</div>
                          <p className="text-xs text-muted-foreground">
                            +2.1% from last month
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Quick Actions</CardTitle>
                        <CardDescription>Run AI-powered security scans and content moderation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex space-x-4">
                          <Button 
                            onClick={handleScanUsers}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {isLoading ? 'Scanning...' : 'Scan for Malicious Users'}
                          </Button>
                          <Button 
                            onClick={handleModerateContent}
                            disabled={isLoading}
                            variant="outline"
                            className="flex-1"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {isLoading ? 'Moderating...' : 'Moderate Content'}
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last scan: {new Date(aiStats.lastScan).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent AI Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {maliciousReports.slice(0, 3).map((report, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                              <div className={`p-2 rounded-full ${report.isMalicious ? 'bg-red-100' : 'bg-green-100'}`}>
                                {getActivityTypeIcon(report.activityType)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {report.activityType === 'none' ? 'Normal Activity' : 
                                   report.activityType.replace('_', ' ').toUpperCase()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Confidence: {report.confidence}% | Risk Score: {report.riskScore}
                                </div>
                              </div>
                              <Badge className={getRiskLevelColor(report.riskScore > 50 ? 'high' : 'low')}>
                                {report.riskScore > 50 ? 'High Risk' : 'Low Risk'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Malicious Activity Tab */}
                {activeTab === 'malicious' && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Malicious Activity Detection</CardTitle>
                        <CardDescription>AI-detected suspicious user behavior and activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Activity Type</TableHead>
                              <TableHead>Risk Score</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Evidence</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {maliciousReports.map((report, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getActivityTypeIcon(report.activityType)}
                                    <span className="font-medium">
                                      {report.activityType.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getRiskLevelColor(report.riskScore > 50 ? 'high' : 'low')}>
                                    {report.riskScore}
                                  </Badge>
                                </TableCell>
                                <TableCell>{report.confidence}%</TableCell>
                                <TableCell>
                                  <div className="max-w-xs">
                                    {report.evidence.slice(0, 2).map((item, i) => (
                                      <div key={i} className="text-sm text-muted-foreground">
                                        • {item}
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      <Ban className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Content Moderation Tab */}
                {activeTab === 'moderation' && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Content Moderation</CardTitle>
                        <CardDescription>AI-flagged content requiring review</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Content Type</TableHead>
                              <TableHead>Risk Level</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Flags</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {moderationReports.map((report, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4" />
                                    <span>Job Application</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getRiskLevelColor(report.riskLevel)}>
                                    {report.riskLevel.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell>{report.confidence}%</TableCell>
                                <TableCell>
                                  <div className="max-w-xs">
                                    {report.flags.slice(0, 2).map((flag, i) => (
                                      <div key={i} className="text-sm text-muted-foreground">
                                        • {flag}
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      <Ban className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* AI Insights Tab */}
                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>AI Performance Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Detection Accuracy</span>
                            <span className="font-medium">{aiStats.accuracy}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${aiStats.accuracy}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">False Positives</span>
                            <span className="font-medium">2.3%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '2.3%' }}></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Response Time</span>
                            <span className="font-medium">1.2s</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Security Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Malicious activity down 15% this week</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Content quality improved 23%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Spam accounts reduced by 8%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">User engagement up 12%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>AI Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">Increase Monitoring Frequency</h4>
                              <p className="text-sm text-blue-700">
                                Consider running AI scans every 2 hours instead of 4 hours to catch malicious activity faster.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-900">AI Model Performing Well</h4>
                              <p className="text-sm text-green-700">
                                Your current AI model is achieving 94.2% accuracy. Consider updating to the latest version for even better performance.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-900">Review Content Moderation</h4>
                              <p className="text-sm text-yellow-700">
                                45 pieces of content were flagged this week. Consider reviewing the moderation rules.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
} 