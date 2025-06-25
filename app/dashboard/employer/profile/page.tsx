"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home,
  Briefcase,
  Users,
  User,
  Settings,
  Bell,
  LogOut,
  Building,
  Camera,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Edit,
  Save,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { EmployerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"
import { Logo } from "@/components/logo"

interface UserSession {
  firstName: string;
}

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    companyName: "",
    industry: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    about: "",
    companySize: "",
    description: "",
  })
  const [companyImage, setCompanyImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = localStorage.getItem("skillconnect_user")
        if (userData) {
          const user = JSON.parse(userData)
          setUser(user)
          
          // Set profile data from user
          setProfile({
            companyName: user.company_name || "",
            industry: user.industry || "",
            location: user.location || "",
            website: user.website || "",
            email: user.email || "",
            phone: user.phone || "",
            about: user.description || "",
            companySize: user.company_size || "",
            description: user.description || "",
          })
          setCompanyImage(user.company_image || null)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfile({ ...profile, [id]: value })
  }

  const handleSave = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: profile.companyName,
          industry: profile.industry,
          location: profile.location,
          website: profile.website,
          phone: profile.phone,
          description: profile.about,
          company_size: profile.companySize,
          company_image: companyImage,
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile. Please try again.')
      } else {
        // Update local storage with both old and new field names for compatibility
        const updatedUser = { 
          ...user, 
          company_name: profile.companyName,
          companyName: profile.companyName,
          industry: profile.industry,
          location: profile.location,
          website: profile.website,
          phone: profile.phone,
          description: profile.about,
          company_size: profile.companySize,
          companySize: profile.companySize,
          company_image: companyImage,
        }
        localStorage.setItem("skillconnect_user", JSON.stringify(updatedUser))
        
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  return (
    <EmployerGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="px-4 py-4">
                  <Logo showTagline={false} />
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Main Menu
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer">
                            <Home className="w-5 h-5" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span>Posted Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/applicants">
                            <Users className="w-5 h-5" />
                            <span>Applicants</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/profile">
                            <User className="w-5 h-5" />
                            <span>Company Profile</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Account
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/settings">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Link href="/auth/login">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading profile...</p>
                  </div>
                ) : (
                  <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Company Info */}
                    <div className="lg:col-span-1 space-y-8">
                      <Card className="simple-card">
                        <CardContent className="p-6 text-center">
                          <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                              {companyImage ? (
                                <img
                                  src={companyImage}
                                  alt="Company Logo"
                                  className="w-32 h-32 rounded-full object-cover"
                                />
                              ) : (
                                <Building className="w-16 h-16" />
                              )}
                              {uploading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                </div>
                              )}
                            </div>
                            {isEditing && (
                              <label className="absolute bottom-0 right-0 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-600 hover:bg-white transition-colors border border-orange-200 cursor-pointer">
                                <Camera className="w-5 h-5" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    setUploading(true)
                                    try {
                                      const fileExt = file.name.split('.').pop()
                                      const fileName = `company_${user.id}_${Date.now()}.${fileExt}`
                                      const { data, error } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true })
                                      if (error) throw error
                                      const { data: publicUrlData } = supabase.storage.from('company-logos').getPublicUrl(fileName)
                                      const newImageUrl = publicUrlData.publicUrl
                                      setCompanyImage(newImageUrl)
                                      
                                      // Update database immediately
                                      const { error: dbError } = await supabase
                                        .from('profiles')
                                        .update({ company_image: newImageUrl })
                                        .eq('id', user.id)
                                      
                                      if (dbError) {
                                        console.error('Error updating database:', dbError)
                                        alert('Image uploaded but failed to save to profile. Please try again.')
                                      } else {
                                        // Update local storage
                                        const updatedUser = { ...user, company_image: newImageUrl }
                                        localStorage.setItem("skillconnect_user", JSON.stringify(updatedUser))
                                        alert('Company logo updated successfully!')
                                      }
                                    } catch (err) {
                                      console.error('Error uploading image:', err)
                                      alert('Failed to upload image')
                                    } finally {
                                      setUploading(false)
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-1">
                            {isEditing ? (
                              <Input
                                id="companyName"
                                value={profile.companyName}
                                onChange={handleInputChange}
                                className="text-center"
                                placeholder="Company Name"
                              />
                            ) : (
                              profile.companyName || "Company Name"
                            )}
                          </h3>
                          <p className="text-slate-600">
                            {isEditing ? (
                              <Input
                                id="industry"
                                value={profile.industry}
                                onChange={handleInputChange}
                                className="text-center"
                                placeholder="Industry"
                              />
                            ) : (
                              profile.industry || "Industry"
                            )}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-3 text-slate-500" />
                            <span>{profile.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-3 text-slate-500" />
                            {isEditing ? (
                              <Input
                                id="phone"
                                value={profile.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                              />
                            ) : (
                              <span>{profile.phone || "Phone Number"}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-3 text-slate-500" />
                            {isEditing ? (
                              <Input
                                id="location"
                                value={profile.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                              />
                            ) : (
                              <span>{profile.location || "Location"}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <LinkIcon className="w-4 h-4 mr-3 text-slate-500" />
                            {isEditing ? (
                              <Input
                                id="website"
                                value={profile.website}
                                onChange={handleInputChange}
                                placeholder="Website"
                              />
                            ) : (
                              <a href={profile.website} className="text-orange-600 hover:underline">
                                {profile.website || "Website"}
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column: About & Active Jobs */}
                    <div className="lg:col-span-2 space-y-8">
                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle>About Company</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea
                              id="about"
                              value={profile.about}
                              onChange={handleInputChange}
                              className="min-h-[150px]"
                              placeholder="Tell us about your company..."
                            />
                          ) : (
                            <p className="text-slate-600">
                              {profile.about || "No description available. Click 'Edit Profile' to add one."}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="simple-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Active Job Postings</CardTitle>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/employer/jobs">
                              <Plus className="w-4 h-4 mr-2" />
                              Post Job
                            </Link>
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Briefcase className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No active jobs yet</h3>
                            <p className="text-slate-600 mb-4">
                              Start posting jobs to attract talented candidates.
                            </p>
                            <Button asChild className="btn-primary">
                              <Link href="/dashboard/employer/jobs">
                                Post Your First Job
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </EmployerGuard>
  )
} 