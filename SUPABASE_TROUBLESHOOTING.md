# Supabase Connectivity Troubleshooting Guide

## Error: "Failed to fetch" in Supabase Auth

This error typically occurs when the Supabase client can't reach the Supabase API. Here are the steps to diagnose and fix the issue:

## 🔍 **Diagnosis Steps**

### 1. Check Environment Variables
```bash
# Verify these are set in your .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Test Network Connectivity
```bash
# Test if you can reach Supabase
curl -I https://your-project.supabase.co

# Test auth endpoint specifically
curl -I https://your-project.supabase.co/auth/v1/
```

### 3. Check Browser Console
- Open Developer Tools (F12)
- Go to Network tab
- Try to access the admin dashboard
- Look for failed requests to Supabase endpoints

## 🛠️ **Quick Fixes**

### Fix 1: Update Supabase Client Configuration
```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Add this for better compatibility
  },
  global: {
    headers: {
      'X-Client-Info': 'skillconnect-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

### Fix 2: Add Error Handling and Retry Logic
```typescript
// lib/supabaseClient.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'skillconnect-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Add connection test function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    console.log('Supabase connection test successful')
    return true
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return false
  }
}
```

### Fix 3: Add Network Error Handling to Admin Service
```typescript
// lib/adminService.ts
export class AdminService {
  static async loadUsers(limit?: number): Promise<AdminUser[]> {
    try {
      // Test connection first
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        throw new Error('Supabase connection failed')
      }

      // Rest of the function...
    } catch (error) {
      console.error('Error loading users:', error)
      // Return empty array instead of throwing
      return []
    }
  }
}
```

## 🚨 **Common Causes and Solutions**

### 1. **Environment Variables Not Set**
**Symptoms**: App works locally but fails in production
**Solution**: 
```bash
# Check your .env.local file
cat .env.local

# Make sure these are set:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. **Network/Firewall Issues**
**Symptoms**: Works on some networks but not others
**Solution**:
- Check if you're behind a corporate firewall
- Try using a different network (mobile hotspot)
- Check if Supabase is blocked by your ISP

### 3. **Supabase Project Issues**
**Symptoms**: Suddenly stops working
**Solution**:
- Check Supabase dashboard for project status
- Verify project is not paused or suspended
- Check billing status

### 4. **Browser Issues**
**Symptoms**: Works in one browser but not another
**Solution**:
- Clear browser cache and cookies
- Try incognito/private mode
- Check browser extensions that might block requests

## 🔧 **Advanced Debugging**

### 1. Create a Connection Test Component
```typescript
// components/supabase-test.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase, testSupabaseConnection } from '@/lib/supabaseClient'

export function SupabaseTest() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed'>('testing')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await testSupabaseConnection()
        setStatus(isConnected ? 'connected' : 'failed')
      } catch (err) {
        setStatus('failed')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">Supabase Connection Test</h3>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
        }`} />
        <span className="capitalize">{status}</span>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  )
}
```

### 2. Add to Admin Dashboard
```typescript
// app/dashboard/admin/page.tsx
import { SupabaseTest } from '@/components/supabase-test'

// Add this to the debug panel
{process.env.NODE_ENV === 'development' && (
  <SupabaseTest />
)}
```

## 📋 **Checklist for Resolution**

- [ ] Environment variables are correctly set
- [ ] Supabase project is active and not paused
- [ ] Network connectivity to Supabase is working
- [ ] Browser cache and cookies are cleared
- [ ] No firewall or proxy is blocking requests
- [ ] Supabase client is properly configured
- [ ] Error handling is in place

## 🆘 **If Still Not Working**

1. **Check Supabase Status**: https://status.supabase.com/
2. **Check your project dashboard**: https://supabase.com/dashboard
3. **Try the test script**: `node test-admin-users.js`
4. **Contact Supabase Support**: If the issue persists

## 🔄 **Alternative Solutions**

### 1. Use Service Role Key (Server-side only)
```typescript
// Only use this on the server side!
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
```

### 2. Implement Fallback Strategy
```typescript
export class AdminService {
  static async loadUsers(limit?: number): Promise<AdminUser[]> {
    try {
      return await this.loadUsersFromSupabase(limit)
    } catch (error) {
      console.error('Supabase failed, trying fallback:', error)
      return await this.loadUsersFromFallback(limit)
    }
  }
}
```

### 3. Add Retry Logic
```typescript
const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
``` 