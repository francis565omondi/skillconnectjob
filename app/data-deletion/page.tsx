"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Trash2, Shield, AlertTriangle, CheckCircle, Menu, ArrowLeft, FileText, Clock, Lock } from "lucide-react";
import Link from "next/link";

export default function DataDeletionPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    accountType: "",
    reason: "",
    confirmDeletion: false,
    backupData: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const deletionSteps = [
    {
      step: 1,
      title: "Submit Request",
      description: "Fill out the form below with your details and reason for deletion",
      icon: FileText
    },
    {
      step: 2,
      title: "Verification",
      description: "We'll verify your identity and account ownership",
      icon: Shield
    },
    {
      step: 3,
      title: "Processing",
      description: "Your data will be permanently deleted within 30 days",
      icon: Clock
    },
    {
      step: 4,
      title: "Confirmation",
      description: "You'll receive confirmation when deletion is complete",
      icon: CheckCircle
    }
  ];

  const whatGetsDeleted = [
    "Personal profile information",
    "Job applications and history",
    "Posted job listings (for employers)",
    "Messages and communications",
    "Account settings and preferences",
    "Usage data and analytics",
    "Uploaded documents and files"
  ];

  const whatStays = [
    "Data required for legal compliance",
    "Anonymized analytics data",
    "Records of transactions (for tax purposes)",
    "Data needed for fraud prevention",
    "Information required by law enforcement"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">Home</Link>
              <Link href="/about" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">About</Link>
              <Link href="/jobs" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">Jobs</Link>
              <Link href="/contact" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">Contact</Link>
            </nav>
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="bg-orange-600 text-white hover:bg-orange-700" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link href="/" className="text-slate-700 hover:text-orange-600 transition-colors py-2">Home</Link>
                <Link href="/about" className="text-slate-700 hover:text-orange-600 transition-colors py-2">About</Link>
                <Link href="/jobs" className="text-slate-700 hover:text-orange-600 transition-colors py-2">Jobs</Link>
                <Link href="/contact" className="text-slate-700 hover:text-orange-600 transition-colors py-2">Contact</Link>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button className="bg-orange-600 text-white hover:bg-orange-700" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Trash2 className="w-4 h-4 mr-2" />
              Data Deletion Request
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Request Your Data
              <span className="block text-red-100">Deletion</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-red-100 leading-relaxed">
              We respect your right to have your personal data permanently removed from our systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50" asChild>
                <Link href="#form">
                  Start Request
                  <ArrowLeft className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How the Deletion Process Works</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {deletionSteps.map((step, index) => (
                <Card key={index} className="simple-card text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Gets Deleted vs What Stays */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Trash2 className="w-6 h-6 mr-3 text-red-600" />
                    What Gets Deleted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {whatGetsDeleted.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Lock className="w-6 h-6 mr-3 text-slate-600" />
                    What Stays (Required by Law)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {whatStays.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Deletion Form */}
      <section id="form" className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {!isSubmitted ? (
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <Trash2 className="w-6 h-6 mr-3 text-red-600" />
                    Data Deletion Request Form
                  </CardTitle>
                  <p className="text-slate-600">
                    Please fill out this form to request the deletion of your personal data. 
                    We'll process your request within 30 days.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          placeholder="Enter your full name"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter your email"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter your phone number"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Account Type *
                        </label>
                        <Select value={formData.accountType} onValueChange={(value) => setFormData({...formData, accountType: value})}>
                          <SelectTrigger className="form-input">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="job-seeker">Job Seeker</SelectItem>
                            <SelectItem value="employer">Employer</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Reason for Deletion *
                      </label>
                      <Textarea
                        required
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        placeholder="Please explain why you want to delete your data..."
                        className="form-input min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="confirmDeletion"
                          checked={formData.confirmDeletion}
                          onCheckedChange={(checked) => setFormData({...formData, confirmDeletion: checked as boolean})}
                          className="mt-1"
                        />
                        <label htmlFor="confirmDeletion" className="text-sm text-slate-700">
                          I understand that this action is <strong>permanent and irreversible</strong>. 
                          Once my data is deleted, it cannot be recovered.
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="backupData"
                          checked={formData.backupData}
                          onCheckedChange={(checked) => setFormData({...formData, backupData: checked as boolean})}
                          className="mt-1"
                        />
                        <label htmlFor="backupData" className="text-sm text-slate-700">
                          I would like to receive a copy of my data before deletion (optional)
                        </label>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1">Important Notice</h4>
                          <p className="text-sm text-red-700">
                            This action will permanently delete your account and all associated data. 
                            You will lose access to all your job applications, saved jobs, and account history. 
                            This process cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={!formData.confirmDeletion || isSubmitting}
                      className="w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting Request..." : "Submit Deletion Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="simple-card">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Request Submitted Successfully</h2>
                  <p className="text-slate-600 mb-6">
                    We've received your data deletion request. You'll receive a confirmation email shortly, 
                    and we'll process your request within 30 days as required by law.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      <strong>Reference Number:</strong> DD-{Date.now().toString().slice(-8)}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                        <Link href="/">Return to Home</Link>
                      </Button>
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Need Help?</h2>
            <p className="text-lg text-slate-600 mb-8">
              If you have questions about the deletion process or need assistance, 
              our support team is here to help.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="simple-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
                  <p className="text-slate-600">privacy@skillconnect.co.ke</p>
                </CardContent>
              </Card>
              <Card className="simple-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
                  <p className="text-slate-600">+254 700 000 000</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 