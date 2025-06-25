"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { ApplicationsService } from "@/lib/applicationsService"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"

export default function TestCVUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [testUserId, setTestUserId] = useState("test-user-123")
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })
      setSelectedFile(file)
      setUploadResult(null)
      setUploadError(null)
    }
  }

  const testUpload = async () => {
    if (!selectedFile) {
      showError('No file selected')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)
      setUploadResult(null)
      
      console.log('Starting test upload with:', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        userId: testUserId
      })

      showLoading('Testing CV upload...', 'Please wait')

      const result = await ApplicationsService.uploadCV(selectedFile, testUserId)
      
      console.log('Upload successful:', result)
      setUploadResult(result)
      showSuccess('CV upload test successful!')
      
    } catch (error) {
      console.error('Upload test failed:', error)
      setUploadError(error instanceof Error ? error.message : 'Unknown error')
      showError('Upload test failed', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">CV Upload Test Page</h1>
        
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-user-id">Test User ID</Label>
                <Input
                  id="test-user-id"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  placeholder="Enter test user ID"
                />
              </div>
              
              <div>
                <Label htmlFor="file-upload">Select CV File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
              </div>
              
              {selectedFile && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={testUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Testing Upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Test Upload
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <div>
                      <p className="font-medium text-red-800">Upload Failed</p>
                      <p className="text-sm text-red-600">{uploadError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {uploadResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="font-medium text-green-800">Upload Successful</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>URL:</strong> {uploadResult.url}</p>
                    <p><strong>Filename:</strong> {uploadResult.filename}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 