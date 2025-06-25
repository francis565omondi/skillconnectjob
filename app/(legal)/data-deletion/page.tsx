"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Shield, AlertTriangle, CheckCircle, ArrowLeft, FileText, Clock, Lock, Database, User, Building } from "lucide-react";
import Link from "next/link";

export default function DataDeletionPage() {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12 sm:py-16 md:py-20 rounded-3xl mb-12">
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
      </section>

      {/* Process Steps */}
      <section className="mb-12">
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
      </section>

      {/* What Gets Deleted vs What Stays */}
      <section className="mb-12">
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
                      <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="simple-card">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-blue-600" />
                  What Stays (Required by Law)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {whatStays.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Deletion Request Form */}
      <section id="form" className="mb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Database className="w-6 h-6 mr-3 text-red-600" />
                Data Deletion Request Form
              </CardTitle>
              <p className="text-slate-600">
                Please fill out this form to request the deletion of your personal data. 
                We'll process your request within 30 days as required by law.
              </p>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
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
                        className="w-full"
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
                        placeholder="Enter your email address"
                        className="w-full"
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
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Account Type *
                      </label>
                      <Select value={formData.accountType} onValueChange={(value) => setFormData({...formData, accountType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job-seeker">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              Job Seeker
                            </div>
                          </SelectItem>
                          <SelectItem value="employer">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2" />
                              Employer
                            </div>
                          </SelectItem>
                          <SelectItem value="both">Both Job Seeker & Employer</SelectItem>
                          <SelectItem value="visitor">Website Visitor (No Account)</SelectItem>
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
                      placeholder="Please explain why you want your data deleted..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="confirmDeletion"
                        checked={formData.confirmDeletion}
                        onCheckedChange={(checked) => setFormData({...formData, confirmDeletion: checked as boolean})}
                        required
                      />
                      <label htmlFor="confirmDeletion" className="text-sm text-slate-700">
                        I understand that this action is irreversible and all my personal data will be permanently deleted from SkillConnect's systems.
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="backupData"
                        checked={formData.backupData}
                        onCheckedChange={(checked) => setFormData({...formData, backupData: checked as boolean})}
                      />
                      <label htmlFor="backupData" className="text-sm text-slate-700">
                        I would like to receive a copy of my data before deletion (optional).
                      </label>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Important Notice</h4>
                        <p className="text-yellow-800 text-sm">
                          This process is irreversible. Once your data is deleted, it cannot be recovered. 
                          Please ensure you have backed up any important information before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.confirmDeletion}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Deletion Request"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Request Submitted Successfully</h3>
                  <p className="text-slate-600 mb-6">
                    We've received your data deletion request. You'll receive a confirmation email shortly, 
                    and we'll process your request within 30 days as required by law.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• You'll receive a confirmation email within 24 hours</li>
                      <li>• We'll verify your identity and account ownership</li>
                      <li>• Your data will be permanently deleted within 30 days</li>
                      <li>• You'll receive a final confirmation when deletion is complete</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <div className="max-w-4xl mx-auto">
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about the data deletion process or need assistance, 
                please contact our data protection team:
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-slate-700 font-medium">Email: skillconnect2025@gmail.com</p>
                <p className="text-slate-700 font-medium">Phone: <a href="tel:+254111701308" className="text-orange-500 hover:underline font-semibold">+254111701308</a> <a href="https://wa.me/254111701308" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:underline font-semibold">WhatsApp</a></p>
                <p className="text-slate-700 font-medium">Address: Nairobi, Kenya</p>
              </div>
              <p className="text-sm text-slate-600">
                <strong>Last updated:</strong> July 10, 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 