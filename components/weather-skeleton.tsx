import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WeatherSkeleton() {
    return (
        <Card className="p-8 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-xl">
            <div className="flex flex-col items-center space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center space-y-2 w-full">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                </div>

                {/* Main Weather */}
                <div className="flex items-center justify-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-20 w-32" />
                </div>
                <Skeleton className="h-6 w-36" />

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>

                {/* Sunrise/Sunset */}
                <div className="flex justify-center gap-8 pt-4 w-full">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>

                {/* Forecast */}
                <div className="w-full space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </Card>
    )
}
