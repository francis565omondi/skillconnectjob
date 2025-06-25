"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, FileText, Users, Globe, Bell, Trash2, CheckCircle, AlertTriangle, Clock, Database, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          Last updated: July 10, 2025
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
                    <span>Keep your account credentials secure</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Log out when using shared devices</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Report suspicious activity immediately</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Update your information regularly</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Deletion Rights */}
        <Card className="simple-card">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-orange-600" />
              Your Data Deletion Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 leading-relaxed">
              You have the right to request the deletion of your personal data from our systems. 
              This is also known as the "right to be forgotten" under data protection regulations.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center mr-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900">Request Data Deletion</h4>
                </div>
                <p className="text-sm text-red-800 mb-4">
                  You can request complete deletion of your personal data from our systems.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
                  <Link href="/data-deletion">
                    Request Data Deletion
                    <ArrowLeft className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">Processing Time</h4>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>We process deletion requests within 30 days</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive confirmation when complete</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Some data may be retained for legal compliance</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Important Note</h4>
                  <p className="text-yellow-800 text-sm">
                    Data deletion is irreversible. Once your data is deleted, it cannot be recovered. 
                    Please ensure you have backed up any important information before requesting deletion.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="simple-card">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Database className="w-5 h-5 mr-2 text-orange-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-700 font-medium">Email: skillconnect2025@gmail.com</p>
              <p className="text-slate-700 font-medium">Phone: <a href="tel:+254111701308" className="text-orange-500 hover:underline font-semibold">+254111701308</a> <a href="https://wa.me/254111701308" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:underline font-semibold">WhatsApp</a></p>
              <p className="text-slate-700 font-medium">Address: Nairobi, Kenya</p>
            </div>
            <p className="text-sm text-slate-600">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated revision date.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
