export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section Skeleton */}
      <section className="gradient-navy section-padding">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-8 w-32 bg-white/20 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="h-16 bg-white/20 rounded-lg mb-8 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded-lg mb-12 animate-pulse"></div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 w-32 bg-white/20 rounded-2xl animate-pulse"></div>
              <div className="h-12 w-32 bg-white/20 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="stats-section py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 bg-white/20 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-8 w-16 bg-white/20 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-white/20 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections Skeleton */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="h-1 w-16 bg-slate-200 rounded mb-6 animate-pulse"></div>
              <div className="h-10 bg-slate-200 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
