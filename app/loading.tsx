import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="animate-pulse space-y-6">
                <Skeleton className="h-8 w-64 mx-auto lg:mx-0 bg-white/20" />
                <Skeleton className="h-16 w-full bg-white/20" />
                <Skeleton className="h-6 w-3/4 mx-auto lg:mx-0 bg-white/20" />
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                  <Skeleton className="h-14 w-32 bg-white/20" />
                  <Skeleton className="h-14 w-32 bg-white/20" />
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="animate-pulse space-y-6">
                <Skeleton className="h-32 w-full bg-white/20 rounded-3xl" />
                <Skeleton className="h-32 w-full bg-white/20 rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-16 w-16 mx-auto rounded-2xl" />
                  <Skeleton className="h-6 w-24 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
