"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/footer";
import { Search, BookOpen, FileText, Users, ArrowRight, Clock, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

export default function CareerAdvicePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      id: 1,
      title: "How to Write a Standout CV for Kenyan Job Market",
      excerpt: "Learn the essential elements that make your CV stand out in Kenya's competitive job market.",
      category: "CV Writing",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Top 10 Interview Questions and How to Answer Them",
      excerpt: "Master the most common interview questions and learn how to give compelling answers.",
      category: "Interview Tips",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 3,
      title: "Networking Strategies for Kenyan Professionals",
      excerpt: "Build meaningful professional relationships that can advance your career in Kenya.",
      category: "Networking",
      readTime: "6 min read",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <BookOpen className="w-4 h-4 mr-2" />
              Career Resources
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Advance Your Career with
              <span className="block text-orange-100">Expert Advice</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed">
              Get insights, tips, and strategies from industry experts to help you succeed in your career journey.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search career advice, tips, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/90 border-0 text-gray-900 placeholder-gray-500 rounded-xl py-4 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Articles */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">Career Advice Articles</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Latest insights and tips from career experts</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="simple-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-orange-100 text-orange-700 border-0 rounded-xl">{article.category}</Badge>
                    <span className="text-sm text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{article.title}</h3>
                  <p className="text-slate-600 mb-4">{article.excerpt}</p>
                  <Button variant="ghost" className="text-orange-600 hover:text-orange-700 p-0">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Ready to Advance Your Career?</h2>
            <p className="text-lg sm:text-xl mb-8 text-orange-100">Join thousands of professionals who are already using SkillConnect to find their next opportunity.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50" asChild>
                <Link href="/auth/signup">Get Started<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 