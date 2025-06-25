'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ApplicationsService } from '@/lib/applicationsService'
import { PublicNavbar } from '@/components/public-navbar'
import { Footer } from '@/components/footer'

export default function TestApplicationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [formData, setFormData] = useState({
    job_id: '95d2ea3e-9b49-4187-960d-2beb3ed40d7d', // Use a real job ID from your database
    applicant_name: 'Test User',
    applicant_email: 'test@example.com',
    applicant_phone: '+1234567890',
    cover_letter: 'This is a test cover letter for debugging purposes.',
    experience_summary: 'This is a test experience summary for debugging purposes.',
    expected_salary: '50000',
    available_start_date: '2024-01-01',
    additional_info: 'Additional test information',
    portfolio_url: 'https://example.com',
    linkedin_url: 'https://linkedin.com/in/testuser'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const testApplicationCreation = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      console.log('🧪 Starting application creation test...')
      
      // Check session storage
      const session = sessionStorage.getItem("skillconnect_session")
      console.log('📋 Session data:', session)
      
      if (!session) {
        setResult('❌ No session found. Please log in first.')
        return
      }

      const sessionData = JSON.parse(session)
      console.log('👤 Session user ID:', sessionData.userId)
      
      if (!sessionData.userId) {
        setResult('❌ No user ID in session. Please log in again.')
        return
      }

      // Test the application creation
      console.log('📝 Form data:', formData)
      
      const applicationData = {
        job_id: formData.job_id,
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone,
        cover_letter: formData.cover_letter,
        experience_summary: formData.experience_summary,
        expected_salary: parseInt(formData.expected_salary) || undefined,
        available_start_date: formData.available_start_date,
        additional_info: formData.additional_info,
        portfolio_url: formData.portfolio_url,
        linkedin_url: formData.linkedin_url
      }

      console.log('🚀 Calling ApplicationsService.createApplication...')
      
      const application = await ApplicationsService.createApplication(applicationData)
      
      console.log('✅ Application created successfully:', application)
      setResult(`✅ SUCCESS! Application created with ID: ${application.id}`)
      
    } catch (error) {
      console.error('❌ Test failed:', error)
      setResult(`❌ ERROR: ${error.message || 'Unknown error occurred'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkDatabaseConnection = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      console.log('🔍 Testing database connection...')
      
      // Test a simple query
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://oesnkmwbznwuyxpgofwd.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc25rbXdiem53dXl4cGdvZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzY3NTksImV4cCI6MjA2NjAxMjc1OX0.fwOIhX1DcQ2Bwh-7fod5zln0q6SnTgkoJEoBL0pmVxs'
      )
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .limit(1)
      
      if (error) {
        setResult(`❌ Database connection failed: ${error.message}`)
      } else {
        setResult(`✅ Database connection successful. Found ${data?.length || 0} applications.`)
      }
      
    } catch (error) {
      console.error('❌ Database test failed:', error)
      setResult(`❌ Database test failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Application Creation Test</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Test Form */}
            <Card>
              <CardHeader>
                <CardTitle>Test Application Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="job_id">Job ID</Label>
                  <Input
                    id="job_id"
                    value={formData.job_id}
                    onChange={(e) => handleInputChange('job_id', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="applicant_name">Name</Label>
                  <Input
                    id="applicant_name"
                    value={formData.applicant_name}
                    onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="applicant_email">Email</Label>
                  <Input
                    id="applicant_email"
                    type="email"
                    value={formData.applicant_email}
                    onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cover_letter">Cover Letter</Label>
                  <Textarea
                    id="cover_letter"
                    value={formData.cover_letter}
                    onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience_summary">Experience Summary</Label>
                  <Textarea
                    id="experience_summary"
                    value={formData.experience_summary}
                    onChange={(e) => handleInputChange('experience_summary', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={checkDatabaseConnection}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    Test Database
                  </Button>
                  
                  <Button 
                    onClick={testApplicationCreation}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Testing...' : 'Test Application Creation'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{result || 'No test results yet...'}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 