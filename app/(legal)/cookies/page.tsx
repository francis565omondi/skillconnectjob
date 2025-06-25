"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Cookie, Settings, Eye, Lock, AlertTriangle, CheckCircle, Clock, Database, Globe } from "lucide-react"

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
            <Cookie className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Cookie Policy</h1>
            <p className="text-slate-600 text-lg">How we use cookies to enhance your experience</p>
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
              <Globe className="w-5 h-5 mr-2 text-orange-600" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing how you use our site, and personalizing content.
            </p>
            <p className="text-slate-700 leading-relaxed">
              This Cookie Policy explains how SkillConnect uses cookies and similar technologies 
              to enhance your browsing experience and provide our services.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                  <p className="text-blue-800 text-sm">
                    By continuing to use our website, you consent to our use of cookies as described in this policy.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="simple-card">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-orange-600" />
              Types of Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">Essential Cookies</h4>
                </div>
                <p className="text-sm text-green-800 mb-3">
                  These cookies are necessary for the website to function properly.
                </p>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Authentication and security</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Session management</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Basic functionality</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mr-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">Analytics Cookies</h4>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Page views and navigation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>User behavior analysis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Performance monitoring</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="simple-card">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-orange-600" />
              Managing Your Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 leading-relaxed">
              You have control over the cookies we use. Here are your options:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Browser Settings</h4>
                <p className="text-sm text-slate-700 mb-3">
                  Most web browsers allow you to control cookies through their settings. 
                  You can usually find these settings in the "Options" or "Preferences" menu.
                </p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Chrome: Settings → Privacy and security → Cookies and other site data</li>
                  <li>• Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                  <li>• Safari: Preferences → Privacy → Manage Website Data</li>
                  <li>• Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Cookie Consent</h4>
                <p className="text-sm text-slate-700">
                  When you first visit our website, you'll see a cookie consent banner. 
                  You can choose which types of cookies to accept or decline.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Important Note</h4>
                  <p className="text-yellow-800 text-sm">
                    Disabling certain cookies may affect the functionality of our website. 
                    Essential cookies cannot be disabled as they are necessary for basic site operation.
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
              If you have any questions about our use of cookies or this Cookie Policy, 
              please contact us at:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-700 font-medium">Email: skillconnect2025@gmail.com</p>
              <p className="text-slate-700 font-medium">Phone: <a href="tel:+254111701308" className="text-orange-500 hover:underline font-semibold">+254111701308</a> <a href="https://wa.me/254111701308" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:underline font-semibold">WhatsApp</a></p>
              <p className="text-slate-700 font-medium">Address: Nairobi, Kenya</p>
            </div>
            <p className="text-sm text-slate-600">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 