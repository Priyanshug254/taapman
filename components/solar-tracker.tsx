"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { Sunrise, Sunset } from "lucide-react"

interface SolarTrackerProps {
    weather: WeatherData
}

export function SolarTracker({ weather }: SolarTrackerProps) {
    const calculateSunPosition = () => {
        const now = new Date()
        const sunrise = new Date(now.toDateString() + ' ' + weather.sunrise)
        const sunset = new Date(now.toDateString() + ' ' + weather.sunset)

        const totalDayMinutes = (sunset.getTime() - sunrise.getTime()) / 1000 / 60
        const elapsedMinutes = (now.getTime() - sunrise.getTime()) / 1000 / 60

        const percentage = Math.max(0, Math.min(100, (elapsedMinutes / totalDayMinutes) * 100))
        return percentage
    }

    const sunPosition = calculateSunPosition()
    const angle = (sunPosition / 100) * 180 - 90 // -90 to 90 degrees
    const radius = 80
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Solar Progress</h3>

            <div className="relative flex items-center justify-center h-48">
                <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                    {/* Arc path */}
                    <path
                        d="M 20 100 Q 100 20, 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-slate-300 dark:text-slate-700"
                    />

                    {/* Progress arc */}
                    <path
                        d="M 20 100 Q 100 20, 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * sunPosition) / 100}
                        className="text-amber-500 transition-all duration-1000"
                    />

                    {/* Sun icon */}
                    <circle
                        cx={100 + x}
                        cy={100 + y}
                        r="8"
                        fill="currentColor"
                        className="text-yellow-400 drop-shadow-lg transition-all duration-1000"
                    />
                    <circle
                        cx={100 + x}
                        cy={100 + y}
                        r="12"
                        fill="currentColor"
                        className="text-yellow-400/30 animate-pulse"
                    />
                </svg>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Sunrise className="h-4 w-4" />
                    <span className="font-medium">{weather.sunrise}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-semibold">
                    {sunPosition.toFixed(0)}% Complete
                </div>
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <Sunset className="h-4 w-4" />
                    <span className="font-medium">{weather.sunset}</span>
                </div>
            </div>
        </Card>
    )
}
