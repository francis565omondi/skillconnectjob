import { supabase } from './supabaseClient'

export interface Job {
  id: string
  employer_id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary_min?: number
  salary_max?: number
  description: string
  requirements?: string[]
  benefits?: string[]
  status: 'active' | 'closed' | 'draft'
  created_at: string
  updated_at: string
  // Additional fields that might exist
  category?: string
  experience_level?: string
  remote?: boolean
  contact_email?: string
  contact_phone?: string
  company_website?: string
  company_description?: string
}

export interface JobFilters {
  search?: string
  location?: string
  type?: string
  category?: string
  experience_level?: string
  remote?: boolean
  salary_min?: number
  salary_max?: number
}

export interface JobSortOptions {
  field: 'created_at' | 'salary_min' | 'salary_max' | 'title'
  direction: 'asc' | 'desc'
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCacheKey(method: string, params?: any): string {
  return `${method}:${JSON.stringify(params || {})}`
}

function getCachedData(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

const SERVICE_EMAIL = 'skillconnect2025@gmail.com'

export class JobsService {
  // Fetch all active jobs with optional filters
  static async getJobs(filters?: JobFilters, sort?: JobSortOptions, limit?: number): Promise<Job[]> {
    const cacheKey = getCacheKey('getJobs', { filters, sort, limit })
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')

      // Apply filters
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }

      if (filters?.salary_min) {
        query = query.gte('salary_max', filters.salary_min)
      }

      if (filters?.salary_max) {
        query = query.lte('salary_min', filters.salary_max)
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        // Default sort by newest first
        query = query.order('created_at', { ascending: false })
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching jobs:', error)
        throw error
      }

      const result = data || []
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error in getJobs:', error)
      return []
    }
  }

  // Fetch recent jobs for homepage (first 3)
  static async getRecentJobs(limit: number = 3): Promise<Job[]> {
    const cacheKey = getCacheKey('getRecentJobs', { limit })
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    const result = await this.getJobs(undefined, { field: 'created_at', direction: 'desc' }, limit)
    setCachedData(cacheKey, result)
    return result
  }

  // Fetch a single job by ID
  static async getJobById(id: string): Promise<Job | null> {
    const cacheKey = getCacheKey('getJobById', { id })
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error('Error fetching job:', error)
        return null
      }

      setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error in getJobById:', error)
      return null
    }
  }

  // Get job statistics
  static async getJobStats() {
    const cacheKey = getCacheKey('getJobStats')
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const { count: totalJobs, error: totalError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: totalCompanies, error: companiesError } = await supabase
        .from('jobs')
        .select('company', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: totalLocations, error: locationsError } = await supabase
        .from('jobs')
        .select('location', { count: 'exact', head: true })
        .eq('status', 'active')

      if (totalError || companiesError || locationsError) {
        console.error('Error fetching job stats:', { totalError, companiesError, locationsError })
        return {
          totalJobs: 0,
          totalCompanies: 0,
          totalLocations: 0,
          totalSeekers: 12500 // Mock data for now
        }
      }

      const result = {
        totalJobs: totalJobs || 0,
        totalCompanies: totalCompanies || 0,
        totalLocations: totalLocations || 0,
        totalSeekers: 12500 // Mock data for now
      }

      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error in getJobStats:', error)
      return {
        totalJobs: 0,
        totalCompanies: 0,
        totalLocations: 0,
        totalSeekers: 12500
      }
    }
  }

  // Get unique locations for filter dropdown
  static async getUniqueLocations(): Promise<string[]> {
    const cacheKey = getCacheKey('getUniqueLocations')
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('location')
        .eq('status', 'active')

      if (error) {
        console.error('Error fetching locations:', error)
        return []
      }

      const locations = [...new Set(data?.map(job => job.location) || [])]
      const result = locations.sort()
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error in getUniqueLocations:', error)
      return []
    }
  }

  // Get unique companies for filter dropdown
  static async getUniqueCompanies(): Promise<string[]> {
    const cacheKey = getCacheKey('getUniqueCompanies')
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('company')
        .eq('status', 'active')

      if (error) {
        console.error('Error fetching companies:', error)
        return []
      }

      const companies = [...new Set(data?.map(job => job.company) || [])]
      const result = companies.sort()
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error in getUniqueCompanies:', error)
      return []
    }
  }

  // Clear cache (useful for development or when data changes)
  static clearCache(): void {
    cache.clear()
  }
} 