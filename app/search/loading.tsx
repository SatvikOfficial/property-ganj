import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 py-4 md:py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-[28px] border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur-md">
            <div className="space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Skeleton className="h-11 w-24 rounded-full" />
                <Skeleton className="h-11 w-full rounded-2xl md:max-w-sm" />
              </div>
              <div className="pg-mobile-scroll-row md:flex md:flex-wrap md:gap-2 md:overflow-visible md:pb-0">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-11 w-28 shrink-0 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-6 w-56" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[24px] border border-[#eadcca] bg-white/95 p-3.5 shadow-[0_18px_36px_-28px_rgba(31,42,46,0.38)] md:p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:gap-5">
                    <Skeleton className="aspect-[16/11] w-full rounded-[18px] md:h-[170px] md:w-[220px] md:shrink-0 md:aspect-auto" />
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-7 w-4/5" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="grid grid-cols-2 gap-3 rounded-[18px] bg-[#faf6f1] p-3 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((__, statIndex) => (
                          <Skeleton key={statIndex} className="h-12 rounded-xl" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 rounded-[20px] border border-[#eadcca] bg-[#fffaf5] p-4 md:w-[170px] md:border-0 md:bg-transparent md:p-0">
                      <Skeleton className="h-7 w-28 md:ml-auto" />
                      <Skeleton className="h-11 w-full rounded-full" />
                      <Skeleton className="h-11 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[24px] border border-[#eadcca] bg-white p-5 shadow-[0_18px_42px_-30px_rgba(31,42,46,0.24)]">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-3 h-6 w-3/4" />
                  <Skeleton className="mt-3 h-36 w-full rounded-[20px]" />
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-14 rounded-[18px]" />
                    <Skeleton className="h-14 rounded-[18px]" />
                    <Skeleton className="h-14 rounded-[18px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
