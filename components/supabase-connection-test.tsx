'use client'

import { useState, useEffect } from 'react'
import { testSupabaseConnection } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react'

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed' | 'unknown'>('testing')
  const [error, setError] = useState<string>('')
  const [lastTest, setLastTest] = useState<Date | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testConnection = async () => {
    setIsTesting(true)
    setStatus('testing')
    setError('')
    
    try {
      const isConnected = await testSupabaseConnection()
      setStatus(isConnected ? 'connected' : 'failed')
      setLastTest(new Date())
      
      if (!isConnected) {
        setError('Connection test failed. Check your internet connection and Supabase configuration.')
      }
    } catch (err) {
      setStatus('failed')
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setLastTest(new Date())
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <WifiOff className="w-5 h-5 text-red-600" />
      case 'testing':
        return <RefreshCw className={`w-5 h-5 text-yellow-600 ${isTesting ? 'animate-spin' : ''}`} />
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200'
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-lg">Supabase Connection</CardTitle>
          </div>
          <Badge className={getStatusColor()}>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="capitalize">{status}</span>
            </div>
          </Badge>
        </div>
        <CardDescription>
          Real-time connection status to Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Connection Status:</span>
          <span className={`text-sm font-medium ${
            status === 'connected' ? 'text-green-600' : 
            status === 'failed' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {status === 'connected' ? 'Connected' : 
             status === 'failed' ? 'Failed' : 
             status === 'testing' ? 'Testing...' : 'Unknown'}
          </span>
        </div>
        
        {lastTest && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Last Test:</span>
            <span className="text-sm text-slate-500">
              {lastTest.toLocaleTimeString()}
            </span>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <Button 
            onClick={testConnection} 
            variant="outline" 
            size="sm"
            disabled={isTesting}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </Button>
          
          {status === 'connected' && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Ready</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 