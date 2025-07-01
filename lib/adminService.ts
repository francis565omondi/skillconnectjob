import { supabase, testSupabaseConnection, retrySupabaseOperation, handleSupabaseError } from './supabaseClient'
import { AIServices } from './aiServices'

export interface AdminStats {
  totalUsers: number
  totalJobs: number
  totalApplications: number
  activeUsers: number
  pendingApplications: number
  suspiciousActivities: number
  aiInsights: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  bio?: string
  created_at: string
  last_login?: string
  applications_count: number
  jobs_posted_count: number
  aiRiskScore: number
  aiFlags: string[]
}

export interface AdminJob {
  id: string
  title: string
  company: string
  location: string
  salary_min?: number
  salary_max?: number
  status: string
  created_at: string
  applications_count: number
  aiModerationStatus: 'approved' | 'flagged' | 'pending'
  aiFlags: string[]
}

export interface AdminApplication {
  id: string
  job_title: string
  applicant_name: string
  applicant_email: string
  status: string
  created_at: string
  aiMatchScore: number
}

export interface AIInsight {
  id: string
  type: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
  status: string
  affectedUsers?: number
  affectedJobs?: number
}

export interface SystemSettings {
  aiEnabled: boolean
  autoModeration: boolean
  emailNotifications: boolean
  maintenanceMode: boolean
  maxApplicationsPerUser: number
  maxJobsPerEmployer: number
  requireEmailVerification: boolean
  requireProfileCompletion: boolean
  sessionTimeout: number
  storageLimit: number
}

export class AdminService {
  // Load admin dashboard statistics
  static async loadStats(): Promise<AdminStats> {
    try {
      // Test connection first
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        console.warn('Supabase connection test failed, returning default stats')
        return {
          totalUsers: 0,
          totalJobs: 0,
          totalApplications: 0,
          activeUsers: 0,
          pendingApplications: 0,
          suspiciousActivities: 0,
          aiInsights: 0,
          systemHealth: 'critical'
        }
      }

      const loadStatsOperation = async () => {
        const [
          { count: totalUsers },
          { count: totalJobs },
          { count: totalApplications },
          { count: activeUsers },
          { count: activeJobs },
          { count: pendingApplications },
          { count: aiInsightsCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('jobs').select('*', { count: 'exact', head: true }),
          supabase.from('applications').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_login', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('ai_insights').select('*', { count: 'exact', head: true }).eq('is_resolved', false)
        ])

        return {
          totalUsers: totalUsers || 0,
          totalJobs: totalJobs || 0,
          totalApplications: totalApplications || 0,
          activeUsers: activeUsers || 0,
          activeJobs: activeJobs || 0,
          pendingApplications: pendingApplications || 0,
          aiInsightsCount: aiInsightsCount || 0
        }
      }

      const stats = await retrySupabaseOperation(loadStatsOperation)

      // Calculate system health
      let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'good'
      const pendingRatio = stats.totalApplications > 0 ? (stats.pendingApplications / stats.totalApplications) * 100 : 0
      const activeJobRatio = stats.totalJobs > 0 ? (stats.activeJobs / stats.totalJobs) * 100 : 0

      if (pendingRatio > 80 || activeJobRatio < 20) {
        systemHealth = 'critical'
      } else if (pendingRatio > 60 || activeJobRatio < 40) {
        systemHealth = 'warning'
      } else if (pendingRatio < 20 && activeJobRatio > 80) {
        systemHealth = 'excellent'
      }

      return {
        totalUsers: stats.totalUsers,
        totalJobs: stats.totalJobs,
        totalApplications: stats.totalApplications,
        activeUsers: stats.activeUsers,
        pendingApplications: stats.pendingApplications,
        suspiciousActivities: stats.aiInsightsCount,
        aiInsights: stats.aiInsightsCount,
        systemHealth
      }
    } catch (error) {
      const errorInfo = handleSupabaseError(error, 'loadStats')
      console.error('Error loading admin stats:', errorInfo)
      
      // Return default stats instead of throwing
      return {
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        activeUsers: 0,
        pendingApplications: 0,
        suspiciousActivities: 0,
        aiInsights: 0,
        systemHealth: 'critical'
      }
    }
  }

  // Load users with AI analysis
  static async loadUsers(limit?: number): Promise<AdminUser[]> {
    try {
      // Test connection first
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        console.warn('Supabase connection test failed, returning empty users array')
        return []
      }

      const loadUsersOperation = async () => {
        // If no limit specified, load ALL users
        let query = supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
          // Handle RLS policy errors specifically
          if (error.message?.includes('infinite recursion') || error.message?.includes('row-level security')) {
            console.error('RLS policy error detected. Please run the SQL fix in Supabase dashboard.')
            console.error('Error details:', error)
            throw new Error('Database policy error: Please contact administrator to fix RLS policies')
          }
          throw error
        }

        console.log(`Loading ${data?.length || 0} users from database`)

        const usersWithStats = await Promise.all(
          (data || []).map(async (user) => {
            try {
              // Get applications count for seekers
              let applicationsCount = 0
              if (user.role === 'seeker') {
                const { count } = await supabase
                  .from('applications')
                  .select('*', { count: 'exact', head: true })
                  .eq('applicant_id', user.id)
                applicationsCount = count || 0
              }

              // Get jobs posted count for employers
              let jobsPostedCount = 0
              if (user.role === 'employer') {
                const { count } = await supabase
                  .from('jobs')
                  .select('*', { count: 'exact', head: true })
                  .eq('employer_id', user.id)
                jobsPostedCount = count || 0
              }

              // AI risk assessment
              const aiAnalysis = await AIServices.detectMaliciousActivity({
                email: user.email,
                profile: `${user.first_name} ${user.last_name} ${user.bio || ''}`,
                applications: [],
                behavior: {
                  loginFrequency: 1,
                  applicationRate: applicationsCount,
                  profileCompleteness: user.bio ? 80 : 40,
                  lastActivity: user.last_login
                }
              })

              return {
                ...user,
                applications_count: applicationsCount,
                jobs_posted_count: jobsPostedCount,
                aiRiskScore: aiAnalysis.riskScore,
                aiFlags: aiAnalysis.evidence
              }
            } catch (error) {
              console.error(`Error processing user ${user.id}:`, error)
              return {
                ...user,
                applications_count: 0,
                jobs_posted_count: 0,
                aiRiskScore: 0,
                aiFlags: ['AI analysis unavailable']
              }
            }
          })
        )

        console.log(`Successfully processed ${usersWithStats.length} users`)
        return usersWithStats
      }

      return await retrySupabaseOperation(loadUsersOperation)
    } catch (error) {
      const errorInfo = handleSupabaseError(error, 'loadUsers')
      console.error('Error loading users:', errorInfo)
      
      // Return empty array instead of throwing
      return []
    }
  }

  // Load jobs with AI moderation
  static async loadJobs(limit?: number): Promise<AdminJob[]> {
    try {
      // If no limit specified, load ALL jobs
      let query = supabase
        .from('jobs')
        .select(`
          *,
          applications(count)
        `)
        .order('created_at', { ascending: false })
      
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error

      console.log(`Loading ${data?.length || 0} jobs from database`)

      const jobsWithAI = await Promise.all(
        (data || []).map(async (job) => {
          try {
            const contentAnalysis = await AIServices.moderateContent(
              `${job.title} ${job.description || ''}`,
              'job'
            )

            return {
              ...job,
              applications_count: job.applications?.[0]?.count || 0,
              aiModerationStatus: contentAnalysis.isAppropriate ? 'approved' : 'flagged',
              aiFlags: contentAnalysis.flags
            }
          } catch (error) {
            console.error(`Error processing AI for job ${job.id}:`, error)
            // Return job without AI analysis if it fails
            return {
              ...job,
              applications_count: job.applications?.[0]?.count || 0,
              aiModerationStatus: 'pending',
              aiFlags: ['AI analysis unavailable']
            }
          }
        })
      )

      console.log(`Successfully processed ${jobsWithAI.length} jobs`)
      return jobsWithAI
    } catch (error) {
      console.error('Error loading jobs:', error)
      throw error
    }
  }

  // Load applications
  static async loadApplications(limit?: number): Promise<AdminApplication[]> {
    try {
      // If no limit specified, load ALL applications
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs(title)
        `)
        .order('created_at', { ascending: false })
      
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error

      console.log(`Loading ${data?.length || 0} applications from database`)

      const formattedApplications = (data || []).map(app => ({
        id: app.id,
        job_title: app.jobs?.title || 'Unknown Job',
        applicant_name: app.applicant_name,
        applicant_email: app.applicant_email,
        status: app.status,
        created_at: app.created_at,
        aiMatchScore: Math.floor(Math.random() * 40) + 60 // Mock AI score for now
      }))

      console.log(`Successfully processed ${formattedApplications.length} applications`)
      return formattedApplications
    } catch (error) {
      console.error('Error loading applications:', error)
      throw error
    }
  }

  // Load AI insights
  static async loadAIInsights(limit: number = 10): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error || !data || data.length === 0) {
        // Generate insights from current data if none exist
        return await this.generateInsights()
      }

      return data.map(insight => ({
        id: insight.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        severity: insight.severity,
        created_at: insight.created_at,
        status: insight.status,
        affectedUsers: insight.affected_users,
        affectedJobs: insight.affected_jobs
      }))
    } catch (error) {
      console.error('Error loading AI insights:', error)
      throw error
    }
  }

  // Generate insights from current data
  private static async generateInsights(): Promise<AIInsight[]> {
    const insights: AIInsight[] = []
    
    try {
      // Get user data for insights
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .limit(100)

      // Get job data for insights
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .limit(100)

      // Get application data for insights
      const { data: applications } = await supabase
        .from('applications')
        .select('*')
        .limit(100)

      // Generate insights from user data
      if (users) {
        const highRiskUsers = users.filter(user => {
          const profileCompleteness = user.bio ? 80 : 40
          const daysSinceLogin = user.last_login ? 
            (new Date().getTime() - new Date(user.last_login).getTime()) / (1000 * 60 * 60 * 24) : 0
          return profileCompleteness < 50 || daysSinceLogin > 30
        })

        if (highRiskUsers.length > 0) {
          insights.push({
            id: '1',
            type: 'security',
            title: 'High Risk Users Detected',
            description: `${highRiskUsers.length} users have incomplete profiles or inactive accounts`,
            severity: 'high',
            created_at: new Date().toISOString(),
            status: 'new',
            affectedUsers: highRiskUsers.length
          })
        }
      }

      // Generate insights from job data
      if (jobs) {
        const flaggedJobs = jobs.filter(job => {
          const suspiciousKeywords = ['quick money', 'earn fast', 'work from home', 'make money']
          const jobContent = `${job.title} ${job.description || ''}`.toLowerCase()
          return suspiciousKeywords.some(keyword => jobContent.includes(keyword))
        })

        if (flaggedJobs.length > 0) {
          insights.push({
            id: '2',
            type: 'content_moderation',
            title: 'Suspicious Job Postings',
            description: `${flaggedJobs.length} job postings contain suspicious content`,
            severity: 'medium',
            created_at: new Date().toISOString(),
            status: 'new',
            affectedJobs: flaggedJobs.length
          })
        }
      }

      // Generate insights from application data
      if (applications) {
        const recentApplications = applications.filter(app => 
          new Date(app.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        )

        if (recentApplications.length > 20) {
          insights.push({
            id: '3',
            type: 'user_behavior',
            title: 'High Application Volume',
            description: `${recentApplications.length} applications submitted in the last 24 hours`,
            severity: 'low',
            created_at: new Date().toISOString(),
            status: 'new'
          })
        }
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    }

    return insights
  }

  // Load system settings
  static async loadSettings(): Promise<SystemSettings> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single()

      if (error || !data) {
        // Return default settings if none exist
        return {
          aiEnabled: true,
          autoModeration: true,
          emailNotifications: true,
          maintenanceMode: false,
          maxApplicationsPerUser: 50,
          maxJobsPerEmployer: 20,
          requireEmailVerification: true,
          requireProfileCompletion: true,
          sessionTimeout: 24,
          storageLimit: 100
        }
      }

      return {
        aiEnabled: data.ai_enabled || true,
        autoModeration: data.auto_moderation || true,
        emailNotifications: data.email_notifications || true,
        maintenanceMode: data.maintenance_mode || false,
        maxApplicationsPerUser: data.max_applications_per_user || 50,
        maxJobsPerEmployer: data.max_jobs_per_employer || 20,
        requireEmailVerification: data.require_email_verification || true,
        requireProfileCompletion: data.require_profile_completion || true,
        sessionTimeout: data.session_timeout || 24,
        storageLimit: data.storage_limit || 100
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      throw error
    }
  }

  // Update system settings
  static async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({
          ai_enabled: settings.aiEnabled,
          auto_moderation: settings.autoModeration,
          email_notifications: settings.emailNotifications,
          maintenance_mode: settings.maintenanceMode,
          max_applications_per_user: settings.maxApplicationsPerUser,
          max_jobs_per_employer: settings.maxJobsPerEmployer,
          require_email_verification: settings.requireEmailVerification,
          require_profile_completion: settings.requireProfileCompletion,
          session_timeout: settings.sessionTimeout,
          storage_limit: settings.storageLimit
        })
        .eq('id', (await this.loadSettings()).id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  // Log admin activity
  static async logActivity(action: string, targetType?: string, targetId?: string, details?: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_activity_log')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          action,
          target_type: targetType,
          target_id: targetId,
          details
        })

      if (error) throw error
    } catch (error) {
      console.error('Error logging admin activity:', error)
    }
  }

  // Real-time subscriptions for dynamic updates
  static subscribeToUsers(callback: (users: AdminUser[]) => void) {
    return supabase
      .channel('admin-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload) => {
          console.log('Users table changed:', payload)
          // Reload all users when any change occurs
          const users = await this.loadUsers()
          callback(users)
        }
      )
      .subscribe()
  }

  static subscribeToJobs(callback: (jobs: AdminJob[]) => void) {
    return supabase
      .channel('admin-jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        async (payload) => {
          console.log('Jobs table changed:', payload)
          // Reload all jobs when any change occurs
          const jobs = await this.loadJobs()
          callback(jobs)
        }
      )
      .subscribe()
  }

  static subscribeToApplications(callback: (applications: AdminApplication[]) => void) {
    return supabase
      .channel('admin-applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        async (payload) => {
          console.log('Applications table changed:', payload)
          // Reload all applications when any change occurs
          const applications = await this.loadApplications()
          callback(applications)
        }
      )
      .subscribe()
  }

  static subscribeToStats(callback: (stats: AdminStats) => void) {
    return supabase
      .channel('admin-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload) => {
          console.log('Stats changed (profiles):', payload)
          const stats = await this.loadStats()
          callback(stats)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        async (payload) => {
          console.log('Stats changed (jobs):', payload)
          const stats = await this.loadStats()
          callback(stats)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        async (payload) => {
          console.log('Stats changed (applications):', payload)
          const stats = await this.loadStats()
          callback(stats)
        }
      )
      .subscribe()
  }

  static subscribeToAIInsights(callback: (insights: AIInsight[]) => void) {
    return supabase
      .channel('admin-ai-insights')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_insights'
        },
        async (payload) => {
          console.log('AI Insights changed:', payload)
          const insights = await this.loadAIInsights()
          callback(insights)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload) => {
          console.log('AI Insights changed (profiles):', payload)
          const insights = await this.loadAIInsights()
          callback(insights)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        async (payload) => {
          console.log('AI Insights changed (jobs):', payload)
          const insights = await this.loadAIInsights()
          callback(insights)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        async (payload) => {
          console.log('AI Insights changed (applications):', payload)
          const insights = await this.loadAIInsights()
          callback(insights)
        }
      )
      .subscribe()
  }

  // Unsubscribe from all channels
  static unsubscribeFromAll() {
    supabase.removeAllChannels()
  }
} 