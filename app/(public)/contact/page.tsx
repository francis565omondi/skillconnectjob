"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { GoogleMap } from "@/components/ui/map"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  ArrowRight,
  Briefcase,
  HelpCircle,
  Home,
  Network,
  Info,
  MessageSquare as MessageSquareIcon,
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIsSubmitted(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
      } else {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", message: "" })
      }
    } catch (err) {
      setError('Failed to send message')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "skillconnect2025@gmail.com",
      description: "Get help with your account or technical issues",
      color: "bg-blue-500",
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: <><a href="tel:+254111701308" className="text-orange-500 hover:underline font-semibold">+254111701308</a> <a href="https://wa.me/254111701308" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:underline font-semibold">WhatsApp</a></>,
      description: "Call us during business hours for immediate assistance or reach us on WhatsApp.",
      color: "bg-green-500",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      value: "Available 24/7",
      description: "Chat with our support team in real-time",
      color: "bg-purple-500",
    },
  ]

  const officeLocations = [
    {
      city: "Nairobi",
      address: "Westlands, Nairobi, Kenya",
      phone: <><a href="tel:+254111701308" className="text-orange-500 hover:underline font-semibold">+254111701308</a> <a href="https://wa.me/254111701308" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:underline font-semibold">WhatsApp</a></>,
      email: "skillconnect2025@gmail.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM",
      isMain: true,
    },
    {
      city: "Mombasa",
      address: "Nyali, Mombasa, Kenya",
      phone: <><a href="tel:+254111701308" className="text-orange-500 hover:underline font-semibold">+254111701308</a> <a href="https://wa.me/254111701308" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-500 hover:underline font-semibold">WhatsApp</a></>,
      email: "skillconnect2025@gmail.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM",
      isMain: false,
    },
  ]

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the top navigation and fill in your details. You'll need to provide your email, create a password, and select your role (job seeker or employer)."
    },
    {
      question: "How does the job matching work?",
      answer: "Our AI-powered system analyzes your skills, experience, and preferences to match you with the most relevant job opportunities. The more complete your profile, the better the matches."
    },
    {
      question: "Are all employers verified?",
      answer: "Yes, we verify all employers before they can post jobs. This includes business registration verification and document review to ensure legitimate opportunities."
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              We're Here to Help
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed">
              Have questions about SkillConnect? Need support with your account? 
              We're here to help you succeed in your career journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50" asChild>
                <Link href="#contact-form">
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="#faq">
                  View FAQ
                  <HelpCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the most convenient way to get in touch. Our support team is ready to help you 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="simple-card hover-lift text-center">
                <CardContent className="p-6 sm:p-8">
                  <div className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{info.title}</h3>
                  <p className="text-lg font-medium text-orange-600 mb-3">{info.value}</p>
                  <p className="text-slate-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Send Us a Message
                </h2>
                <p className="text-lg text-slate-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card className="simple-card" id="contact-form">
                <CardContent className="p-6 sm:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                      <p className="text-slate-600">Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                      {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                      )}
                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center justify-center"><Send className="w-5 h-5 mr-2 animate-spin" /> Sending...</span>
                        ) : (
                          <span className="flex items-center justify-center"><Send className="w-5 h-5 mr-2" /> Send Message</span>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Office Locations */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Visit Our Offices
                </h2>
                <p className="text-lg text-slate-600">
                  We have offices across Kenya to serve you better.
                </p>
              </div>

              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <Card key={index} className={`simple-card ${office.isMain ? 'ring-2 ring-orange-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-1">
                            {office.city}
                            {office.isMain && (
                              <Badge className="ml-2 bg-orange-500 text-white border-0">Main Office</Badge>
                            )}
                          </h3>
                          <p className="text-slate-600 mb-3">{office.address}</p>
                        </div>
                        <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-700">{office.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-700">{office.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-700">{office.hours}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations Map */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Find Our Offices
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Visit us at any of our locations across Kenya. Our main office is in Nairobi.
            </p>
          </div>

          <Card className="simple-card">
            <CardContent className="p-6">
              <div className="h-96 rounded-lg overflow-hidden">
                <GoogleMap
                  center="Nairobi, Kenya"
                  zoom={8}
                  markers={[
                    {
                      position: "Westlands, Nairobi, Kenya",
                      title: "SkillConnect - Main Office",
                      info: "Westlands, Nairobi, Kenya<br/>Mon-Fri: 8:00 AM - 6:00 PM"
                    },
                    {
                      position: "Nyali, Mombasa, Kenya",
                      title: "SkillConnect - Mombasa Office",
                      info: "Nyali, Mombasa, Kenya<br/>Mon-Fri: 8:00 AM - 6:00 PM"
                    }
                  ]}
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find answers to the most common questions about SkillConnect.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="simple-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-start">
                      <HelpCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-6">
              Still have questions? We're here to help!
            </p>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <Link href="#contact-form">
                Contact Support
                <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
} 