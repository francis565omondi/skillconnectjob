"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, FileText, Users, Globe, Bell, Trash2, CheckCircle, AlertTriangle, Clock, Database } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Home</Link>
              <Link href="/about" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">About</Link>
              <Link href="/jobs" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Jobs</Link>
              <Link href="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login"><Button variant="outline" className="btn-secondary">Sign In</Button></Link>
              <Link href="/auth/signup"><Button className="btn-primary">Sign Up</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
              <p className="text-slate-600 text-lg">Your privacy is our priority</p>
            </div>
          </div>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 rounded-xl">
            Last updated: January 15, 2024
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                At SkillConnect, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our job marketplace platform.
              </p>
              <p className="text-slate-700 leading-relaxed">
                By using SkillConnect, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our service.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                    <p className="text-blue-800 text-sm">
                      This policy applies to all users of SkillConnect, including job seekers, employers, and visitors to our platform.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-orange-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-orange-600" />
                    Personal Information
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Name, email address, and contact information</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Professional credentials and work history</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Company information (for employers)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Profile pictures and biographical information</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Payment information (processed securely)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-orange-600" />
                    Usage Information
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Job search queries and preferences</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Application history and interactions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Platform usage patterns and analytics</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Device information and IP addresses</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Cookies and similar tracking technologies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-orange-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against:
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-900">Security Measures</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Encryption of data in transit and at rest</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Regular security audits and updates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Access controls and authentication</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Secure data centers and infrastructure</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-900">Your Responsibilities</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Keep your login credentials secure</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Use strong, unique passwords</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Enable two-factor authentication</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Report suspicious activity immediately</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Email Support</h4>
                  </div>
                  <p className="text-slate-700 mb-4">privacy@skillconnect.co.ke</p>
                  <p className="text-sm text-slate-600">We typically respond within 24-48 hours</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center mr-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Data Deletion</h4>
                  </div>
                  <p className="text-slate-700 mb-4">Request complete removal of your data</p>
                  <Link href="/data-deletion">
                    <Button variant="outline" size="sm" className="btn-secondary">
                      Request Data Deletion
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
