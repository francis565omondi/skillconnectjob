import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe JSON parsing utility for localStorage
export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback
  
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return fallback
  }
}

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
} 