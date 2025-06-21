"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestPage() {
  const [testState, setTestState] = useState("Test page is working!")

  return (
    <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
      <Card className="simple-card w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-slate-900">Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-600">{testState}</p>
          <Button 
            onClick={() => setTestState("Button clicked! " + new Date().toLocaleTimeString())}
            className="w-full btn-primary"
          >
            Test Button
          </Button>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/employer">Go to Employer Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/seeker">Go to Seeker Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/admin">Go to Admin Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 