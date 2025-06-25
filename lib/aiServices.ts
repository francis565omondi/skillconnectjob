import { HfInference } from '@huggingface/inference'

// Initialize Hugging Face client (free tier)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '')

const SERVICE_EMAIL = 'skillconnect2025@gmail.com'

export interface JobMatch {
  jobId: string
  score: number
  reasons: string[]
  skillGaps: string[]
  recommendations: string[]
}

export interface ContentAnalysis {
  isAppropriate: boolean
  confidence: number
  flags: string[]
  riskLevel: 'low' | 'medium' | 'high'
  suggestions: string[]
}

export interface MaliciousActivityReport {
  isMalicious: boolean
  confidence: number
  activityType: 'spam' | 'fake_profile' | 'suspicious_behavior' | 'inappropriate_content' | 'none'
  riskScore: number
  evidence: string[]
  recommendations: string[]
}

export class AIServices {
  /**
   * AI-Powered Job Matching
   * Matches job seekers to relevant jobs using semantic similarity
   */
  static async matchJobToResume(
    jobDescription: string,
    resumeText: string,
    userSkills: string[],
    userExperience: string
  ): Promise<JobMatch> {
    try {
      // Combine all user information
      const userProfile = `${resumeText} ${userSkills.join(' ')} ${userExperience}`
      
      // Use Hugging Face sentence similarity model
      const similarity = await hf.sentenceSimilarity({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: {
          source_sentence: jobDescription,
          sentences: [userProfile]
        }
      })

      const matchScore = similarity[0] * 100 // Convert to percentage
      
      // Analyze skill gaps
      const skillGaps = this.analyzeSkillGaps(jobDescription, userSkills)
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(matchScore, skillGaps)
      
      // Extract reasons for match
      const reasons = this.extractMatchReasons(jobDescription, userProfile, matchScore)

      return {
        jobId: '', // Will be set by caller
        score: Math.round(matchScore),
        reasons,
        skillGaps,
        recommendations
      }
    } catch (error) {
      console.error('Job matching error:', error)
      return {
        jobId: '',
        score: 0,
        reasons: ['Unable to analyze job match'],
        skillGaps: [],
        recommendations: ['Please try again later']
      }
    }
  }

  /**
   * AI Content Moderation
   * Analyzes job postings, resumes, and applications for inappropriate content
   */
  static async moderateContent(content: string, contentType: 'job' | 'resume' | 'application'): Promise<ContentAnalysis> {
    try {
      // Use Hugging Face text classification for content moderation
      const moderation = await hf.textClassification({
        model: 'facebook/bart-large-mnli',
        inputs: content,
        parameters: {
          candidate_labels: [
            'inappropriate content',
            'spam',
            'fake information',
            'appropriate content',
            'professional content'
          ]
        }
      })

      const isAppropriate = moderation[0].label === 'appropriate content' || 
                           moderation[0].label === 'professional content'
      
      const confidence = moderation[0].score * 100
      
      // Additional checks for specific content types
      const flags = this.checkContentFlags(content, contentType)
      
      const riskLevel = this.calculateRiskLevel(confidence, flags.length)
      
      const suggestions = this.generateContentSuggestions(content, contentType, flags)

      return {
        isAppropriate,
        confidence: Math.round(confidence),
        flags,
        riskLevel,
        suggestions
      }
    } catch (error) {
      console.error('Content moderation error:', error)
      return {
        isAppropriate: true, // Default to safe
        confidence: 0,
        flags: ['Unable to analyze content'],
        riskLevel: 'low',
        suggestions: ['Please review manually']
      }
    }
  }

  /**
   * Malicious Activity Detection
   * Detects spam, fake profiles, suspicious behavior, and inappropriate content
   */
  static async detectMaliciousActivity(
    userData: {
      email: string
      profile: string
      applications: string[]
      behavior: {
        loginFrequency: number
        applicationRate: number
        profileCompleteness: number
        lastActivity: string
      }
    }
  ): Promise<MaliciousActivityReport> {
    try {
      const flags: string[] = []
      const evidence: string[] = []
      let riskScore = 0
      let activityType: MaliciousActivityReport['activityType'] = 'none'

      // Check for suspicious email patterns
      if (this.isSuspiciousEmail(userData.email)) {
        flags.push('suspicious_email')
        evidence.push(`Email pattern ${userData.email} matches known spam patterns`)
        riskScore += 30
      }

      // Check for fake profile indicators
      if (this.isFakeProfile(userData.profile)) {
        flags.push('fake_profile')
        evidence.push('Profile contains generic or suspicious information')
        riskScore += 40
        activityType = 'fake_profile'
      }

      // Check for spam behavior
      if (this.isSpamBehavior(userData.behavior)) {
        flags.push('spam_behavior')
        evidence.push('User behavior matches spam patterns')
        riskScore += 50
        activityType = 'spam'
      }

      // Check for inappropriate content in applications
      const contentAnalysis = await this.moderateContent(
        userData.applications.join(' '), 
        'application'
      )
      
      if (!contentAnalysis.isAppropriate) {
        flags.push('inappropriate_content')
        evidence.push('Applications contain inappropriate content')
        riskScore += 35
        activityType = 'inappropriate_content'
      }

      // Determine if malicious based on risk score
      const isMalicious = riskScore > 50
      const confidence = Math.min(riskScore, 100)

      const recommendations = this.generateSecurityRecommendations(flags, riskScore)

      return {
        isMalicious,
        confidence,
        activityType,
        riskScore,
        evidence,
        recommendations
      }
    } catch (error) {
      console.error('Malicious activity detection error:', error)
      return {
        isMalicious: false,
        confidence: 0,
        activityType: 'none',
        riskScore: 0,
        evidence: ['Unable to analyze user activity'],
        recommendations: ['Please review manually']
      }
    }
  }

  /**
   * Resume Optimization Suggestions
   * Provides AI-powered suggestions to improve resumes
   */
  static async optimizeResume(resumeText: string, targetJob: string): Promise<{
    suggestions: string[]
    keywords: string[]
    improvements: string[]
    score: number
  }> {
    try {
      // Extract keywords from target job
      const jobKeywords = this.extractKeywords(targetJob)
      
      // Extract keywords from resume
      const resumeKeywords = this.extractKeywords(resumeText)
      
      // Find missing keywords
      const missingKeywords = jobKeywords.filter(keyword => 
        !resumeKeywords.some(resumeKeyword => 
          resumeKeyword.toLowerCase().includes(keyword.toLowerCase())
        )
      )

      // Generate suggestions
      const suggestions = [
        ...missingKeywords.map(keyword => `Add "${keyword}" to your resume`),
        'Use action verbs to describe your achievements',
        'Quantify your accomplishments with numbers',
        'Include relevant certifications and training',
        'Optimize for ATS (Applicant Tracking System)'
      ]

      // Calculate optimization score
      const score = Math.round((resumeKeywords.length / jobKeywords.length) * 100)

      return {
        suggestions,
        keywords: jobKeywords,
        improvements: missingKeywords,
        score: Math.min(score, 100)
      }
    } catch (error) {
      console.error('Resume optimization error:', error)
      return {
        suggestions: ['Unable to analyze resume'],
        keywords: [],
        improvements: [],
        score: 0
      }
    }
  }

  // Helper methods
  private static analyzeSkillGaps(jobDescription: string, userSkills: string[]): string[] {
    const jobKeywords = this.extractKeywords(jobDescription)
    return jobKeywords.filter(keyword => 
      !userSkills.some(skill => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  }

  private static generateRecommendations(matchScore: number, skillGaps: string[]): string[] {
    const recommendations = []
    
    if (matchScore < 50) {
      recommendations.push('Consider applying to jobs that better match your skills')
    }
    
    if (skillGaps.length > 0) {
      recommendations.push(`Consider learning: ${skillGaps.slice(0, 3).join(', ')}`)
    }
    
    if (matchScore > 80) {
      recommendations.push('This job is a great match for your profile!')
    }
    
    return recommendations
  }

  private static extractMatchReasons(jobDescription: string, userProfile: string, score: number): string[] {
    const reasons = []
    
    if (score > 80) {
      reasons.push('Excellent skill match')
      reasons.push('Strong experience alignment')
    } else if (score > 60) {
      reasons.push('Good skill overlap')
      reasons.push('Relevant experience')
    } else {
      reasons.push('Some relevant skills')
    }
    
    return reasons
  }

  private static checkContentFlags(content: string, contentType: string): string[] {
    const flags = []
    const lowerContent = content.toLowerCase()
    
    // Check for inappropriate words
    const inappropriateWords = ['spam', 'fake', 'scam', 'money', 'quick cash', 'work from home', 'earn money']
    inappropriateWords.forEach(word => {
      if (lowerContent.includes(word)) {
        flags.push(`Contains suspicious term: ${word}`)
      }
    })
    
    // Check for excessive capitalization
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length
    if (upperCaseRatio > 0.3) {
      flags.push('Excessive capitalization')
    }
    
    // Check for repetitive content
    const words = content.split(/\s+/).map(w => w.toLowerCase()).filter(Boolean)
    const uniqueWords = new Set(words)
    if (uniqueWords.size / words.length < 0.5) {
      flags.push('Repetitive content detected')
    }
    
    return flags
  }

  private static calculateRiskLevel(confidence: number, flagCount: number): 'low' | 'medium' | 'high' {
    const riskScore = (100 - confidence) + (flagCount * 10)
    
    if (riskScore < 30) return 'low'
    if (riskScore < 60) return 'medium'
    return 'high'
  }

  private static generateContentSuggestions(content: string, contentType: string, flags: string[]): string[] {
    const suggestions = []
    
    if (flags.some(flag => flag.includes('capitalization'))) {
      suggestions.push('Use proper capitalization')
    }
    
    if (flags.some(flag => flag.includes('Repetitive'))) {
      suggestions.push('Avoid repetitive language')
    }
    
    if (contentType === 'job') {
      suggestions.push('Be specific about job requirements')
      suggestions.push('Include salary range if possible')
    }
    
    if (contentType === 'resume') {
      suggestions.push('Use action verbs to describe achievements')
      suggestions.push('Quantify your accomplishments')
    }
    
    return suggestions
  }

  private static isSuspiciousEmail(email: string): boolean {
    const suspiciousPatterns = [
      /^[a-z]{1,3}\d{1,3}@/i, // Very short username with numbers
      /@temp\./i, // Temporary email services
      /@10minutemail\./i,
      /@guerrillamail\./i,
      /\d{8,}@/i // Too many numbers in username
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(email))
  }

  private static isFakeProfile(profile: string): boolean {
    const fakeIndicators = [
      'lorem ipsum',
      'test user',
      'sample profile',
      'placeholder',
      'fake',
      'demo'
    ]
    
    const lowerProfile = profile.toLowerCase()
    return fakeIndicators.some(indicator => lowerProfile.includes(indicator))
  }

  private static isSpamBehavior(behavior: any): boolean {
    return (
      behavior.applicationRate > 50 || // More than 50 applications per day
      behavior.loginFrequency > 100 || // More than 100 logins per day
      behavior.profileCompleteness < 20 // Very incomplete profile
    )
  }

  private static generateSecurityRecommendations(flags: string[], riskScore: number): string[] {
    const recommendations = []
    
    if (flags.includes('suspicious_email')) {
      recommendations.push('Verify email address authenticity')
    }
    
    if (flags.includes('fake_profile')) {
      recommendations.push('Request additional profile verification')
    }
    
    if (flags.includes('spam_behavior')) {
      recommendations.push('Monitor user activity closely')
      recommendations.push('Consider temporary account suspension')
    }
    
    if (riskScore > 70) {
      recommendations.push('Immediate account review required')
    }
    
    return recommendations
  }

  private static extractKeywords(text: string): string[] {
    // Simple keyword extraction using frequency
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return extractKeywords(text)
      .filter(term => !stopWords.includes(term))
      .slice(0, 10);
  }
}

// Add a simple tokenizer and keyword extractor
function simpleTokenizer(text: string): string[] {
  return text.split(/\s+/).map(w => w.toLowerCase()).filter(Boolean);
}

function extractKeywords(text: string, topN = 10): string[] {
  const words = simpleTokenizer(text);
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
} 