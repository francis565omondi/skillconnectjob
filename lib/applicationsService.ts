import { supabase } from './supabaseClient'

// CACHE BUST: Updated at 2024-12-19 to fix application creation

const SERVICE_EMAIL = 'skillconnect2025@gmail.com'

export interface Application {
  id: string
  job_id: string
  applicant_id: string
  applicant_name: string
  applicant_email: string
  applicant_phone?: string
  cover_letter: string
  experience_summary: string
  expected_salary?: number
  available_start_date?: string
  additional_info?: string
  portfolio_url?: string
  linkedin_url?: string
  cv_url?: string
  cv_filename?: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected' | 'hired'
  created_at: string
  updated_at: string
  job?: {
    id: string
    title: string
    company: string
    location: string
    salary_min?: number
    salary_max?: number
    type: string
    description?: string
  }
}

export interface ApplicationStats {
  total: number
  pending: number
  reviewed: number
  shortlisted: number
  accepted: number
  rejected: number
  archived: number
}

export interface CreateApplicationData {
  job_id: string
  applicant_name: string
  applicant_email: string
  applicant_phone?: string
  cover_letter: string
  experience_summary: string
  expected_salary?: number
  available_start_date?: string
  additional_info?: string
  portfolio_url?: string
  linkedin_url?: string
  cv_url?: string
  cv_filename?: string
}

export class ApplicationsService {
  /**
   * Get all applications for a specific user
   */
  static async getUserApplications(userId: string): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user applications:', error)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserApplications:', error)
      throw error
    }
  }

  /**
   * Get applications for a specific job (for employers)
   */
  static async getJobApplications(jobId: string): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching job applications:', error)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Error in getJobApplications:', error)
      throw error
    }
  }

  /**
   * Create a new application
   */
  static async createApplication(applicationData: CreateApplicationData): Promise<Application> {
    console.log('🔄 [', new Date().toISOString(), '] Starting application creation...')
    
    try {
      // Get current user from session storage instead of Supabase auth
      const session = sessionStorage.getItem("skillconnect_session")
      console.log('📋 Session found:', !!session)
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      const sessionData = JSON.parse(session)
      console.log('👤 User ID from session:', sessionData.userId)
      
      if (!sessionData.userId) {
        throw new Error('User ID not found in session')
      }

      // Validate required fields
      if (!applicationData.job_id) {
        throw new Error('Job ID is required')
      }
      if (!applicationData.applicant_name) {
        throw new Error('Applicant name is required')
      }
      if (!applicationData.applicant_email) {
        throw new Error('Applicant email is required')
      }
      if (!applicationData.cover_letter) {
        throw new Error('Cover letter is required')
      }
      if (!applicationData.experience_summary) {
        throw new Error('Experience summary is required')
      }

      // Prepare the data for insertion
      const insertData = {
        job_id: applicationData.job_id,
        applicant_id: sessionData.userId,
        applicant_name: applicationData.applicant_name,
        applicant_email: applicationData.applicant_email,
        applicant_phone: applicationData.applicant_phone || null,
        cover_letter: applicationData.cover_letter,
        experience_summary: applicationData.experience_summary,
        expected_salary: applicationData.expected_salary || null,
        available_start_date: applicationData.available_start_date || null,
        additional_info: applicationData.additional_info || null,
        portfolio_url: applicationData.portfolio_url || null,
        linkedin_url: applicationData.linkedin_url || null,
        cv_url: applicationData.cv_url || null,
        cv_filename: applicationData.cv_filename || null,
        status: 'pending'
      }

      console.log('📝 Insert data prepared:', insertData)

      const { data, error } = await supabase
        .from('applications')
        .insert(insertData)
        .select(`
          *,
          job:jobs(*)
        `)
        .single()

      if (error) {
        console.error('❌ Supabase error:', error)
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned from application creation')
      }

      console.log('✅ Application created successfully:', data)
      return data
    } catch (error) {
      console.error('❌ Error in createApplication:', error)
      console.error('❌ Error stack:', error.stack)
      throw error
    }
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(
    applicationId: string, 
    status: Application['status']
  ): Promise<Application> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select(`
          *,
          job:jobs(*)
        `)
        .single()

      if (error) {
        console.error('Error updating application status:', error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Error in updateApplicationStatus:', error)
      throw error
    }
  }

  /**
   * Update application details
   */
  static async updateApplication(
    applicationId: string, 
    updates: Partial<CreateApplicationData>
  ): Promise<Application> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', applicationId)
        .select(`
          *,
          job:jobs(*)
        `)
        .single()

      if (error) {
        console.error('Error updating application:', error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Error in updateApplication:', error)
      throw error
    }
  }

  /**
   * Delete an application
   */
  static async deleteApplication(applicationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)

      if (error) {
        console.error('Error deleting application:', error)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Error in deleteApplication:', error)
      throw error
    }
  }

  /**
   * Get application statistics for a user
   */
  static async getUserApplicationStats(userId: string): Promise<ApplicationStats> {
    try {
      const applications = await this.getUserApplications(userId)
      
      return {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        accepted: applications.filter(app => app.status === 'accepted' || app.status === 'hired').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        archived: 0 // TODO: Implement archiving feature
      }
    } catch (error) {
      console.error('Error in getUserApplicationStats:', error)
      throw error
    }
  }

  /**
   * Search applications by criteria
   */
  static async searchApplications(
    userId: string,
    searchQuery: string,
    statusFilter?: string,
    sortBy: 'recent' | 'oldest' | 'status' | 'company' = 'recent'
  ): Promise<Application[]> {
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('applicant_id', userId)

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`job.title.ilike.%${searchQuery}%,job.company.ilike.%${searchQuery}%,job.location.ilike.%${searchQuery}%`)
      }

      // Apply sorting
      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'status':
          query = query.order('status', { ascending: true })
          break
        case 'company':
          query = query.order('job.company', { ascending: true })
          break
      }

      const { data, error } = await query

      if (error) {
        console.error('Error searching applications:', error)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Error in searchApplications:', error)
      throw error
    }
  }

  /**
   * Upload CV file
   */
  static async uploadCV(file: File, userId: string): Promise<{ url: string; filename: string }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('applications')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading CV:', error)
        throw new Error(error.message)
      }

      // Get a signed URL that will work for downloading
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('applications')
        .createSignedUrl(fileName, 3600) // 1 hour expiry

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError)
        // Fallback to public URL
        const { data: urlData } = supabase.storage
          .from('applications')
          .getPublicUrl(fileName)
        
        return {
          url: urlData.publicUrl,
          filename: file.name
        }
      }

      return {
        url: signedUrlData.signedUrl,
        filename: file.name
      }
    } catch (error) {
      console.error('Error in uploadCV:', error)
      throw error
    }
  }

  /**
   * Get authenticated CV URL for downloading
   */
  static async getCVDownloadUrl(cvUrl: string): Promise<string> {
    try {
      // Extract file path from URL
      const urlParts = cvUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const userId = urlParts[urlParts.length - 2]
      
      // Create a new signed URL for downloading
      const { data, error } = await supabase.storage
        .from('applications')
        .createSignedUrl(`${userId}/${fileName}`, 3600) // 1 hour expiry

      if (error) {
        console.error('Error creating signed URL for download:', error)
        // Return original URL as fallback
        return cvUrl
      }

      return data.signedUrl
    } catch (error) {
      console.error('Error in getCVDownloadUrl:', error)
      return cvUrl
    }
  }

  /**
   * Delete CV file
   */
  static async deleteCV(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('applications')
        .remove([filePath])

      if (error) {
        console.error('Error deleting CV:', error)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Error in deleteCV:', error)
      throw error
    }
  }

  /**
   * Subscribe to real-time application updates
   */
  static subscribeToApplicationUpdates(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `applicant_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  /**
   * Unsubscribe from real-time updates
   */
  static unsubscribeFromApplicationUpdates(subscription: any) {
    return supabase.removeChannel(subscription)
  }

  /**
   * Check if user has already applied to a job
   */
  static async hasUserAppliedToJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('applicant_id', userId)
        .eq('job_id', jobId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking application status:', error)
        throw new Error(error.message)
      }

      return !!data
    } catch (error) {
      console.error('Error in hasUserAppliedToJob:', error)
      throw error
    }
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(applicationId: string): Promise<Application | null> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('id', applicationId)
        .single()

      if (error) {
        console.error('Error fetching application:', error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Error in getApplicationById:', error)
      throw error
    }
  }

  /**
   * Get recent applications (for dashboard)
   */
  static async getRecentApplications(userId: string, limit: number = 5): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent applications:', error)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Error in getRecentApplications:', error)
      throw error
    }
  }
} 