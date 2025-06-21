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
  FileText,
  User,
  Settings,
  Bell,
  Search,
  Briefcase,
  LogOut,
  Camera,
  MapPin,
  Mail,
  Phone,
  Award,
  Plus,
  X,
  Edit,
  Save,
} from "lucide-react"
import Link from "next/link"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

interface UserSession {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function SeekerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserSession | null>(null)
  const [profile, setProfile] = useState({
    title: "",
    location: "",
    bio: "",
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[],
  })
  const [newSkill, setNewSkill] = useState("")
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  // Get current user and fetch profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        
        // Get user from localStorage
        const userData = localStorage.getItem("skillconnect_user")
        if (!userData) {
          showError("User not found", "Please log in again")
          return
        }
        
        const currentUser = JSON.parse(userData)
        setUser(currentUser)

        // Fetch profile from database
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          // Set default profile if not found
          setProfile({
            title: "",
            location: "",
            bio: "",
            skills: [],
            experience: [],
            education: [],
          })
        } else {
          // Parse skills from JSON string if it exists
          const skills = profileData.skills ? JSON.parse(profileData.skills) : []
          const experience = profileData.experience ? JSON.parse(profileData.experience) : []
          const education = profileData.education ? JSON.parse(profileData.education) : []
          
          setProfile({
            title: profileData.title || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
            skills,
            experience,
            education,
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        showError("Failed to load profile", "Please try refreshing the page")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [showError])

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((skill) => skill !== skillToRemove) })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfile({ ...profile, [id]: value })
  }

  const handleSave = async () => {
    if (!user) return

    try {
      showLoading("Saving profile changes...", "Please wait")
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          title: profile.title,
          location: profile.location,
          bio: profile.bio,
          skills: JSON.stringify(profile.skills),
          experience: JSON.stringify(profile.experience),
          education: JSON.stringify(profile.education),
          updated_at: new Date().toISOString(),
        })

      if (error) {
        throw error
      }
      
      setIsEditing(false)
      showSuccess("Profile updated successfully!", "Your changes have been saved")
    } catch (error) {
      console.error('Error saving profile:', error)
      showError("Failed to save profile", "Please try again")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data if needed
    const storedProfile = localStorage.getItem("skillconnect_profile")
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }

  return (
    <SeekerGuard>
      <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">SkillConnect</span>
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
                          <Link href="/dashboard/seeker">
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
                          <Link href="/dashboard/seeker/applications">
                            <FileText className="w-5 h-5" />
                            <span>My Applications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/jobs">
                            <Search className="w-5 h-5" />
                            <span>Browse Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/profile">
                            <User className="w-5 h-5" />
                            <span>Profile</span>
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
                          <Link href="/dashboard/seeker/settings">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/notifications">
                            <Bell className="w-5 h-5" />
                            <span>Notifications</span>
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
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-xl">
                <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-slate-900">Profile</h1>
                  <p className="text-sm text-slate-600">Manage your professional profile</p>
                </div>
                <div className="flex items-center space-x-2">
                  {!isLoading && (
                    isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button className="btn-primary" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button className="btn-primary" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )
                  )}
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {isLoading ? (
                  <div className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                      <div className="lg:col-span-1">
                        <Card className="simple-card">
                          <CardContent className="p-6">
                            <div className="animate-pulse space-y-4">
                              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="lg:col-span-2 space-y-6">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="simple-card">
                            <CardContent className="p-6">
                              <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8 lg:grid-cols-3">
                    {/* Profile Overview */}
                    <div className="lg:col-span-1">
                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle>Profile Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Profile Picture */}
                          <div className="text-center">
                            <div className="relative inline-block">
                              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-12 h-12 text-orange-600" />
                              </div>
                              {isEditing && (
                                <Button size="sm" variant="outline" className="absolute bottom-0 right-0">
                                  <Camera className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-slate-600">{profile.title}</p>
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-slate-900">Contact Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span>{user?.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span>{user?.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span>{profile.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-slate-900">Skills</h4>
                              {isEditing && (
                                <Button size="sm" variant="outline" onClick={() => setNewSkill("")}>
                                  <Plus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="bg-orange-100 text-orange-800">
                                  {skill}
                                  {isEditing && (
                                    <button
                                      onClick={() => removeSkill(skill)}
                                      className="ml-1 hover:text-red-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </Badge>
                              ))}
                            </div>
                            {isEditing && (
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Add a skill"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                                />
                                <Button size="sm" onClick={addSkill}>
                                  Add
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* About */}
                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea
                              id="bio"
                              value={profile.bio}
                              onChange={handleInputChange}
                              className="min-h-[150px]"
                              placeholder="Tell us about yourself..."
                            />
                          ) : (
                            <p className="text-slate-600">{profile.bio}</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Experience */}
                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle>Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {profile.experience.map((exp) => (
                              <div key={exp.id} className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-slate-900">{exp.title}</h4>
                                <p className="text-orange-600 font-medium">{exp.company}</p>
                                <p className="text-sm text-slate-500 mb-2">{exp.duration}</p>
                                <p className="text-slate-600">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Education */}
                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {profile.education.map((edu) => (
                              <div key={edu.id} className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                                <p className="text-orange-600 font-medium">{edu.institution}</p>
                                <p className="text-sm text-slate-500">{edu.duration}</p>
                              </div>
                            ))}
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
    </SeekerGuard>
  )
}
