"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Users, Building, AlertTriangle, CheckCircle, Clock, Globe, Lock, Scale, Gavel, Handshake } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function TermsOfService() {
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
              <Gavel className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
              <p className="text-slate-600 text-lg">Please read these terms carefully before using our platform</p>
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
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                By accessing and using SkillConnect, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-slate-700 leading-relaxed">
                These Terms of Service govern your use of the SkillConnect job marketplace platform, including all features, 
                functionality, and services available through our website and mobile applications.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                    <p className="text-blue-800 text-sm">
                      These terms apply to all users of SkillConnect, including job seekers, employers, and visitors to our platform.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Description */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-orange-600" />
                Platform Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                SkillConnect is a job marketplace platform that connects job seekers with employers in Kenya. 
                Our platform provides tools and services for job posting, application management, and professional networking.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-900">For Job Seekers</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Browse and apply for job opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Create and manage professional profiles</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Track application status</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Receive job recommendations</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center mr-3">
                      <Building className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-900">For Employers</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Post job opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Manage applications and candidates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Access candidate profiles</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Use recruitment tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                User Accounts and Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Account Creation</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">You must provide accurate and complete information when creating an account</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">You are responsible for maintaining the confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">You must be at least 18 years old to create an account</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">One account per person is allowed</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Account Responsibilities</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">You are responsible for all activities that occur under your account</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Notify us immediately of any unauthorized use of your account</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Keep your profile information up to date and accurate</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-orange-600" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                You agree to use SkillConnect only for lawful purposes and in accordance with these Terms of Service.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 text-green-700">What You May Do</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Post legitimate job opportunities</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Apply for jobs you are qualified for</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Communicate professionally with other users</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Use platform features as intended</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 text-red-700">What You May Not Do</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Post false or misleading information</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Harass or discriminate against other users</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Violate any applicable laws or regulations</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Attempt to gain unauthorized access to our systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-orange-600" />
                Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Data Protection</h4>
                    <ul className="space-y-2 text-sm text-orange-800">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>We implement appropriate security measures to protect your data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Your personal information is collected and processed in accordance with applicable laws</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>You have rights regarding your personal data as outlined in our Privacy Policy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Link href="/privacy">
                  <Button variant="outline" className="btn-secondary">
                    Read Our Privacy Policy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Our Rights</h3>
                <p className="text-slate-700 leading-relaxed">
                  SkillConnect and its original content, features, and functionality are owned by SkillConnect and are protected by 
                  international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Your Rights</h3>
                <p className="text-slate-700 leading-relaxed">
                  You retain ownership of any content you submit to our platform. By submitting content, you grant us a 
                  non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Copyright Notice</h4>
                    <p className="text-yellow-800 text-sm">
                      If you believe your copyrighted work has been used without permission, please contact us immediately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Service Availability</h3>
                <p className="text-slate-700 leading-relaxed">
                  We strive to maintain high availability of our platform, but we do not guarantee uninterrupted access. 
                  We may temporarily suspend or restrict access for maintenance, updates, or other reasons.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Content Accuracy</h3>
                <p className="text-slate-700 leading-relaxed">
                  While we make efforts to verify information on our platform, we cannot guarantee the accuracy, completeness, 
                  or reliability of any content posted by users. Users are responsible for verifying information independently.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Third-Party Services</h3>
                <p className="text-slate-700 leading-relaxed">
                  Our platform may contain links to third-party websites or services. We are not responsible for the content, 
                  privacy policies, or practices of any third-party services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">By You</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You may terminate your account at any time by contacting our support team or using the account deletion 
                    feature in your settings.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Account deletion is permanent</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Data will be removed within 30 days</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">By Us</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice, for conduct that we believe 
                    violates these Terms of Service or is harmful to other users.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Violation of terms</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Fraudulent activity</span>
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
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Email Support</h4>
                  </div>
                  <p className="text-slate-700 mb-4">legal@skillconnect.co.ke</p>
                  <p className="text-sm text-slate-600">For legal and terms-related inquiries</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mr-3">
                      <Handshake className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">General Support</h4>
                  </div>
                  <p className="text-slate-700 mb-4">support@skillconnect.co.ke</p>
                  <p className="text-sm text-slate-600">For general platform support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
