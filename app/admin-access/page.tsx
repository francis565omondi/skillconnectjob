"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Briefcase, Eye, ArrowRight, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-25 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-red-600">Admin Access</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">SkillConnect Administration</h1>
          <p className="text-muted-foreground">Secure access for authorized administrators only</p>
        </div>

        {/* Security Notice */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Restricted Access</h3>
                <p className="text-sm text-yellow-700">
                  This area is protected and requires administrator authentication. Only authorized personnel with valid
                  admin credentials can access the dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Options */}
        <div className="grid gap-6">
          {/* Secure Admin Login */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-600" />
                <span>Secure Admin Login</span>
              </CardTitle>
              <CardDescription>
                Authenticate with your administrator credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">🔐 Admin Authentication Required</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Valid administrator email and password</li>
                    <li>• Session expires after 24 hours for security</li>
                    <li>• All access attempts are logged and monitored</li>
                  </ul>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                  <Link href="/auth/admin-login">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login Required
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What Admins Can Do */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Administrator Capabilities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage user accounts, suspend/activate users, monitor activity
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Company Verification</h3>
                <p className="text-sm text-muted-foreground">Review and approve company verification requests</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Content Moderation</h3>
                <p className="text-sm text-muted-foreground">Review flagged jobs, moderate content, handle reports</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">System Analytics</h3>
                <p className="text-sm text-muted-foreground">Monitor platform metrics, user growth, system health</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Public Dashboards */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-center">Public Access Available</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Job Seeker Dashboard</h3>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/seeker">
                    <Eye className="w-3 h-3 mr-1" />
                    View Demo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Employer Dashboard</h3>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/employer">
                    <Eye className="w-3 h-3 mr-1" />
                    View Demo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/">← Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
