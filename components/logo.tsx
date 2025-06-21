import { Network } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  className?: string
  showTagline?: boolean
}

export function Logo({ className = "", showTagline = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <Network className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
          SkillConnect
        </span>
        {showTagline && (
          <span className="text-xs text-slate-500 hidden sm:block">Kenya Jobs Marketplace</span>
        )}
      </div>
    </Link>
  )
} 