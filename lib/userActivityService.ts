import { supabase } from './supabaseClient'

const SERVICE_EMAIL = 'skillconnect2025@gmail.com'

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  ip_address: string
  user_agent: string
  device_type: string
  browser: string
  os: string
  location: string
  login_time: string
  logout_time: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  session_id: string
  activity_type: string
  activity_details: any
  page_url: string
  ip_address: string
  user_agent: string
  created_at: string
}

export interface AdminAction {
  id: string
  admin_id: string
  target_user_id: string
  action_type: 'suspend' | 'ban' | 'warn' | 'delete' | 'restrict'
  reason: string
  duration: string | null
  details: any
  created_at: string
  expires_at: string | null
  is_active: boolean
}

export interface UserWarning {
  id: string
  user_id: string
  admin_id: string
  warning_type: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  is_acknowledged: boolean
  acknowledged_at: string | null
  created_at: string
}

export interface SuspiciousActivity {
  id: string
  user_id: string
  alert_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: any
  is_resolved: boolean
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
}

export interface DashboardStats {
  active_sessions: number
  logins_24h: number
  activities_24h: number
  pending_alerts: number
  warnings_24h: number
}

export class UserActivityService {
  // Create a new user session
  static async createSession(userId: string, sessionToken: string): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('create_user_session', {
        p_user_id: userId,
        p_session_token: sessionToken
      })

      if (error) {
        console.error('Error creating session:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in createSession:', error)
      throw error
    }
  }

  // End a user session
  static async endSession(sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('end_user_session', {
        p_session_id: sessionId
      })

      if (error) {
        console.error('Error ending session:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in endSession:', error)
      return false
    }
  }

  // Log user activity
  static async logActivity(
    userId: string,
    sessionId: string,
    activityType: string,
    activityDetails?: any,
    pageUrl?: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('log_user_activity', {
        p_user_id: userId,
        p_session_id: sessionId,
        p_activity_type: activityType,
        p_activity_details: activityDetails,
        p_page_url: pageUrl
      })

      if (error) {
        console.error('Error logging activity:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in logActivity:', error)
      throw error
    }
  }

  // Get user sessions
  static async getUserSessions(userId?: string, limit: number = 50): Promise<UserSession[]> {
    try {
      let query = supabase
        .from('user_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.message?.includes('relation "user_sessions" does not exist') || 
            error.message?.includes('Invalid API key') ||
            error.code === 'PGRST116') {
          console.warn('User sessions table not available yet. Returning empty array.')
          return []
        }
        console.error('Error fetching user sessions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn('Error in getUserSessions (likely table not created yet):', error)
      return []
    }
  }

  // Get user activities
  static async getUserActivities(userId?: string, limit: number = 100): Promise<UserActivity[]> {
    try {
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.message?.includes('relation "user_activities" does not exist') || 
            error.message?.includes('Invalid API key') ||
            error.code === 'PGRST116') {
          console.warn('User activities table not available yet. Returning empty array.')
          return []
        }
        console.error('Error fetching user activities:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn('Error in getUserActivities (likely table not created yet):', error)
      return []
    }
  }

  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Calculate stats from existing tables
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

      // Get active sessions count
      const { count: activeSessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Get logins in last 24 hours
      const { count: logins24h, error: loginsError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('login_time', twentyFourHoursAgo)

      // Get activities in last 24 hours
      const { count: activities24h, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo)

      // Get pending alerts count
      const { count: pendingAlerts, error: alertsError } = await supabase
        .from('suspicious_activities')
        .select('*', { count: 'exact', head: true })
        .eq('is_resolved', false)

      // Get warnings in last 24 hours
      const { count: warnings24h, error: warningsError } = await supabase
        .from('user_warnings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo)

      // Check if any of the tables don't exist
      const hasTableErrors = [sessionsError, loginsError, activitiesError, alertsError, warningsError].some(
        error => error && (error.message?.includes('relation') || error.message?.includes('Invalid API key'))
      )

      if (hasTableErrors) {
        console.warn('Some monitoring tables not available yet. Returning default stats.')
        return {
          active_sessions: 0,
          logins_24h: 0,
          activities_24h: 0,
          pending_alerts: 0,
          warnings_24h: 0
        }
      }

      return {
        active_sessions: activeSessions || 0,
        logins_24h: logins24h || 0,
        activities_24h: activities24h || 0,
        pending_alerts: pendingAlerts || 0,
        warnings_24h: warnings24h || 0
      }
    } catch (error) {
      console.warn('Error in getDashboardStats (likely tables not created yet):', error)
      // Return default values if tables don't exist yet
      return {
        active_sessions: 0,
        logins_24h: 0,
        activities_24h: 0,
        pending_alerts: 0,
        warnings_24h: 0
      }
    }
  }

  // Admin Actions
  static async takeAdminAction(
    adminId: string,
    targetUserId: string,
    actionType: AdminAction['action_type'],
    reason: string,
    duration?: string,
    details?: any
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .insert({
          admin_id: adminId,
          target_user_id: targetUserId,
          action_type: actionType,
          reason,
          duration: duration ? duration : null,
          details,
          expires_at: duration ? new Date(Date.now() + this.parseDuration(duration)).toISOString() : null
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error taking admin action:', error)
        throw error
      }

      return data.id
    } catch (error) {
      console.error('Error in takeAdminAction:', error)
      throw error
    }
  }

  // Get admin actions
  static async getAdminActions(targetUserId?: string): Promise<AdminAction[]> {
    try {
      let query = supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false })

      if (targetUserId) {
        query = query.eq('target_user_id', targetUserId)
      }

      const { data, error } = await query

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.message?.includes('relation "admin_actions" does not exist') || 
            error.message?.includes('Invalid API key') ||
            error.code === 'PGRST116') {
          console.warn('Admin actions table not available yet. Returning empty array.')
          return []
        }
        console.error('Error fetching admin actions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn('Error in getAdminActions (likely table not created yet):', error)
      return []
    }
  }

  // Issue warning to user
  static async issueWarning(
    adminId: string,
    userId: string,
    warningType: string,
    message: string,
    severity: UserWarning['severity'] = 'medium'
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_warnings')
        .insert({
          admin_id: adminId,
          user_id: userId,
          warning_type: warningType,
          message,
          severity
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error issuing warning:', error)
        // Return a mock ID if table doesn't exist
        return 'mock-warning-id'
      }

      return data.id
    } catch (error) {
      console.error('Error in issueWarning:', error)
      // Return a mock ID if table doesn't exist
      return 'mock-warning-id'
    }
  }

  // Get user warnings
  static async getUserWarnings(userId?: string): Promise<UserWarning[]> {
    try {
      let query = supabase
        .from('user_warnings')
        .select('*')
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.message?.includes('relation "user_warnings" does not exist') || 
            error.message?.includes('Invalid API key') ||
            error.code === 'PGRST116') {
          console.warn('User warnings table not available yet. Returning empty array.')
          return []
        }
        console.error('Error fetching user warnings:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn('Error in getUserWarnings (likely table not created yet):', error)
      return []
    }
  }

  // Get suspicious activities
  static async getSuspiciousActivities(resolved?: boolean): Promise<SuspiciousActivity[]> {
    try {
      let query = supabase
        .from('suspicious_activities')
        .select('*')
        .order('created_at', { ascending: false })

      if (resolved !== undefined) {
        query = query.eq('is_resolved', resolved)
      }

      const { data, error } = await query

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.message?.includes('relation "suspicious_activities" does not exist') || 
            error.message?.includes('Invalid API key') ||
            error.code === 'PGRST116') {
          console.warn('Suspicious activities table not available yet. Returning empty array.')
          return []
        }
        console.error('Error fetching suspicious activities:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn('Error in getSuspiciousActivities (likely table not created yet):', error)
      return []
    }
  }

  // Resolve suspicious activity
  static async resolveSuspiciousActivity(
    activityId: string,
    resolvedBy: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('suspicious_activities')
        .update({
          is_resolved: true,
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString()
        })
        .eq('id', activityId)

      if (error) {
        console.error('Error resolving suspicious activity:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error in resolveSuspiciousActivity:', error)
      return false
    }
  }

  // Check for suspicious activity
  static async checkSuspiciousActivity(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('check_suspicious_activity', {
        p_user_id: userId
      })

      if (error) {
        console.error('Error checking suspicious activity:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in checkSuspiciousActivity:', error)
    }
  }

  // Helper function to parse duration string
  private static parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([dhms])$/)
    if (!match) return 0

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000 // days
      case 'h': return value * 60 * 60 * 1000 // hours
      case 'm': return value * 60 * 1000 // minutes
      case 's': return value * 1000 // seconds
      default: return 0
    }
  }

  // Get user activity summary
  static async getUserActivitySummary(userId: string, days: number = 7): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('activity_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

      if (error) {
        console.error('Error fetching user activity summary:', error)
        throw error
      }

      // Group activities by type
      const summary = data?.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      return {
        total_activities: data?.length || 0,
        activity_breakdown: summary,
        period_days: days
      }
    } catch (error) {
      console.error('Error in getUserActivitySummary:', error)
      return {
        total_activities: 0,
        activity_breakdown: {},
        period_days: days
      }
    }
  }
} 