   "use client"

   import { useState, useEffect } from "react"
   import Link from "next/link"
   import {
     Card, CardContent, CardDescription, CardHeader, CardTitle,
   } from "@/components/ui/card"
   import { Button } from "@/components/ui/button"
   import { Badge } from "@/components/ui/badge"
   import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
   } from "@/components/ui/table"
   import {
     MoreHorizontal, PlusCircle, Users, Eye, Edit, Trash,
   } from "lucide-react"
   import {
     DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
   } from "@/components/ui/dropdown-menu"
   import {
     Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
     SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
     SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
   } from "@/components/ui/sidebar"
   import {
     Home, Briefcase, User, Settings, Bell, LogOut, Building,
   } from "lucide-react"
   import { Input } from "@/components/ui/input"
   import { Textarea } from "@/components/ui/textarea"
   import {
     Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
   } from "@/components/ui/dialog"
   import { supabase } from "@/lib/supabaseClient"
   import { EmployerGuard } from "@/components/admin-auth-guard"
   
   /* -------------------------------------------------------------------------- */
   /*  1.  SHARED DOMAIN MODELS                                                  */
   /* -------------------------------------------------------------------------- */
   
   export interface Employer {
     id: string
     company_name: string
     email: string
     // ➕ add any extra fields you store in localStorage
   }
   
   export interface Job {
     id: string
     title: string
     description: string
     company: string
     location: string
     salary: string
     job_type: "full-time" | "part-time" | "contract"
     status: "active" | "inactive"
     applications_count?: number
     created_at: string // ISO date string
     updated_at: string // ISO date string
     employer_id: string
   }
   
   interface JobFormState {
     title: string
     description: string
     company: string
     location: string
     salary: string
     job_type: "full-time" | "part-time" | "contract"
     status: "active" | "inactive"
   }
   
   /* -------------------------------------------------------------------------- */
   /*  2.  COMPONENT                                                             */
   /* -------------------------------------------------------------------------- */
   
   export default function EmployerJobsPage() {
     /* ---------- 2.1  REACT STATE ------------------------------------------- */
   
     const [jobs, setJobs] = useState<Job[]>([])
     const [showDialog, setShowDialog] = useState(false)
     const [isLoading, setIsLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
   
     const [currentUser, setCurrentUser] = useState<Employer | null>(null)
   
     const [form, setForm] = useState<JobFormState>({
       title: "",
       description: "",
       company: "",
       location: "",
       salary: "",
       job_type: "full-time",
       status: "active",
     })
   
     /* ---------- 2.2  LOAD CURRENT USER ------------------------------------- */
   
     useEffect(() => {
       try {
         const userData = localStorage.getItem("skillconnect_user")
         if (userData) {
           setCurrentUser(JSON.parse(userData) as Employer)
         } else {
           setError("No user data found. Please log in again.")
           setIsLoading(false)
         }
       } catch {
         setError("Error loading user data. Please log in again.")
         setIsLoading(false)
       }
     }, [])
   
     /* ---------- 2.3  FETCH JOBS WHEN USER IS READY ------------------------- */
   
     useEffect(() => {
       if (currentUser) fetchJobs()
       // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [currentUser])
   
     /* ---------- 2.4  JOBS CRUD HELPERS ------------------------------------- */
   
     const fetchJobs = async () => {
       if (!currentUser) return
   
       try {
         setIsLoading(true)
         setError(null)
   
         /* ----- Caching ------------------------------------------------------ */
         const cacheKey = `cached_employer_jobs_${currentUser.id}`
         const cacheTimeKey = `cached_employer_jobs_time_${currentUser.id}`
         const cachedJobs = localStorage.getItem(cacheKey)
         const cacheTime = localStorage.getItem(cacheTimeKey)
   
         if (cachedJobs && cacheTime && Date.now() - +cacheTime < 5 * 60_000) {
           setJobs(JSON.parse(cachedJobs) as Job[])
           setIsLoading(false)
           return
         }
   
         /* ----- Supabase request (with 10 s timeout) ------------------------ */
         const timeout = new Promise<never>((_, reject) =>
           setTimeout(() => reject(new Error("Request timeout")), 10_000),
         )
   
         const { data, error } = await Promise.race([
           supabase
             .from("jobs")
             .select("*")
             .eq("employer_id", currentUser.id)
             .order("created_at", { ascending: false }),
           timeout,
         ]) as { data: Job[] | null; error: unknown }
   
         if (error || !data) throw error
   
         setJobs(data)
         localStorage.setItem(cacheKey, JSON.stringify(data))
         localStorage.setItem(cacheTimeKey, Date.now().toString())
       } catch (err) {
         console.error("Error fetching jobs:", err)
         setError("Failed to fetch jobs. Please try again.")
       } finally {
         setIsLoading(false)
       }
     }
   
     const handleFormChange = (
       e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
     ) => setForm({ ...form, [e.target.name]: e.target.value })
   
     const handlePostJob = async (e: React.FormEvent) => {
       e.preventDefault()
       if (!currentUser) {
         alert("User not found. Please log in again.")
         return
       }
   
       try {
         const jobData: Omit<Job, "id"> = {
           ...form,
           employer_id: currentUser.id,
           company: currentUser.company_name || form.company,
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
         }
   
         const { error } = await supabase.from("jobs").insert(jobData).select()
   
         if (error) throw error
   
         /* clear cache and refresh list */
         localStorage.removeItem(`cached_employer_jobs_${currentUser.id}`)
         localStorage.removeItem(`cached_employer_jobs_time_${currentUser.id}`)
         await fetchJobs()
   
         setShowDialog(false)
         setForm({
           title: "",
           description: "",
           company: "",
           location: "",
           salary: "",
           job_type: "full-time",
           status: "active",
         })
         alert("Job posted successfully!")
       } catch (err) {
         console.error("Error posting job:", err)
         alert("Failed to post job. Please try again.")
       }
     }
   
     const handleDeleteJob = async (jobId: string) => {
       if (!confirm("Are you sure you want to delete this job?")) return
       if (!currentUser) return
   
       try {
         const { error } = await supabase.from("jobs").delete().eq("id", jobId)
         if (error) throw error
   
         localStorage.removeItem(`cached_employer_jobs_${currentUser.id}`)
         localStorage.removeItem(`cached_employer_jobs_time_${currentUser.id}`)
         await fetchJobs()
         alert("Job deleted successfully!")
       } catch (err) {
         console.error("Error deleting job:", err)
         alert("Failed to delete job. Please try again.")
       }
     }
   
     /* ---------------------------------------------------------------------- */
     /*  3.  RENDER                                                            */
     /* ---------------------------------------------------------------------- */
   
     if (error) {
       return (
         <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
           <Card className="simple-card w-full max-w-md">
             <CardHeader>
               <CardTitle className="text-center text-red-600">Error Loading Jobs</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <p className="text-center text-slate-600">{error}</p>
               <div className="flex gap-2">
                 <Button onClick={fetchJobs} className="btn-primary flex-1">
                   Try Again
                 </Button>
                 <Button variant="outline" className="btn-secondary flex-1" asChild>
                   <Link href="/fix-auth">Fix Auth</Link>
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )
     }
   
     /* ---------- Guard while currentUser loads ----------------------------- */
     if (!currentUser) {
       return <div className="min-h-screen flex items-center justify-center">Loading…</div>
     }
   
     /* ---------- UI -------------------------------------------------------- */
   
     return (
       <EmployerGuard>
         <div className="min-h-screen bg-light-gradient">
           {/*  SIDEBAR LAYOUT  */}
           <SidebarProvider>
             {/* … (sidebar markup unchanged) … */}
           </SidebarProvider>
   
           {/*  ⬇ Post Job Dialog (unchanged except types) ⬇ */}
           <Dialog open={showDialog} onOpenChange={setShowDialog}>
             <DialogContent className="bg-white border-orange-200">
               <DialogHeader>
                 <DialogTitle className="text-slate-900">Post New Job</DialogTitle>
               </DialogHeader>
   
               <form onSubmit={handlePostJob} className="space-y-4">
                 {/* Job Title */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                   <Input
                     name="title"
                     value={form.title}
                     onChange={handleFormChange}
                     placeholder="e.g., Senior Frontend Developer"
                     required
                   />
                 </div>
   
                 {/* Description */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                   <Textarea
                     name="description"
                     value={form.description}
                     onChange={handleFormChange}
                     rows={4}
                     placeholder="Describe the role, responsibilities, and requirements…"
                     required
                   />
                 </div>
   
                 {/* Location & Salary */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                     <Input
                       name="location"
                       value={form.location}
                       onChange={handleFormChange}
                       placeholder="e.g., Nairobi, Kenya"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Salary</label>
                     <Input
                       name="salary"
                       value={form.salary}
                       onChange={handleFormChange}
                       placeholder="e.g., $50,000 – $70,000"
                     />
                   </div>
                 </div>
   
                 <DialogFooter>
                   <DialogClose asChild>
                     <Button type="button" variant="outline" className="btn-secondary">
                       Cancel
                     </Button>
                   </DialogClose>
                   <Button type="submit" className="btn-primary">
                     Post Job
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
         </div>
       </EmployerGuard>
     )
   }
   