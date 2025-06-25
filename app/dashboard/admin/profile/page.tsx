"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Shield } from "lucide-react"

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem("skillconnect_user")
        setAdmin(data ? JSON.parse(data) : null)
      } catch (error) {
        setAdmin(null)
      }
    }
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6 text-orange-600" />
            <span>Admin Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-900">{admin?.first_name || ''} {admin?.last_name || ''}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700">{admin?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700 capitalize">{admin?.role || 'admin'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 