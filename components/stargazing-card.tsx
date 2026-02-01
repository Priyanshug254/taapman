"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { Moon, Star, CloudFog, Cloud } from "lucide-react"

interface StargazingCardProps {
    weather: WeatherData
}

export function StargazingCard({ weather }: StargazingCardProps) {
    // Basic logic to calculate a "Stargazing Score" (0-100)
    // Factors: Cloud Cover (High impact), Humidity (Medium impact), Condition (High impact)

    // Simulating Cloud Cover from condition if not available directly
    // Ideally we'd have this data, but we can approximate:
    let cloudPenalty = 0
    const cond = weather.condition.toLowerCase()

    if (cond.includes('clear') || cond.includes('sunny')) cloudPenalty = 0
    else if (cond.includes('partly')) cloudPenalty = 30
    else if (cond.includes('cloud') || cond.includes('overcast')) cloudPenalty = 80
    else if (cond.includes('rain') || cond.includes('snow') || cond.includes('storm')) cloudPenalty = 100

    // Humidity penalty (High humidity = haze/lower visibility)
    const humidityPenalty = weather.humidity * 0.3

    // Wind penalty (Turbulence)
    const windPenalty = weather.windSpeed > 20 ? 10 : 0

    const rawScore = 100 - cloudPenalty - humidityPenalty - windPenalty
    const score = Math.max(0, Math.round(rawScore))

    const getRating = (s: number) => {
        if (s >= 90) return { label: "Perfect Night", color: "text-emerald-400" }
        if (s >= 70) return { label: "Great Visibility", color: "text-teal-400" }
        if (s >= 50) return { label: "Good", color: "text-blue-400" }
        if (s >= 30) return { label: "Fair", color: "text-amber-400" }
        return { label: "Poor Conditions", color: "text-red-400" }
    }

    const rating = getRating(score)

    return (
        <Card className="p-6 backdrop-blur-md bg-slate-900/80 border-white/10 shadow-lg relative overflow-hidden group">
            {/* Starry Background Effect */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-4 left-10 h-1 w-1 bg-white rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute top-10 right-8 h-0.5 w-0.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                <div className="absolute bottom-8 left-20 h-1 w-1 bg-white rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute top-1/2 left-1/2 h-0.5 w-0.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '2.5s' }} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                    <h3 className="text-xl font-bold text-white">Stargazing Index</h3>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className={`text-5xl font-bold tracking-tighter ${rating.color}`}>
                            {score}<span className="text-2xl opacity-60">/100</span>
                        </div>
                        <div className="text-lg font-medium text-slate-300 mt-1">
                            {rating.label}
                        </div>
                    </div>

                    <div className="bg-white/10 p-3 rounded-full">
                        <Moon className="h-10 w-10 text-slate-200" />
                        {/* Could rotate this based on moon phase if we had data */}
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                            <Cloud className="h-4 w-4" /> Cloud Cover
                        </span>
                        <span className="text-white font-medium">{cloudPenalty > 50 ? 'High' : cloudPenalty > 20 ? 'Moderate' : 'Low'}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-500" style={{ width: `${Math.min(cloudPenalty, 100)}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-slate-400 flex items-center gap-2">
                            <CloudFog className="h-4 w-4" /> Atm. Haze (Hum.)
                        </span>
                        <span className="text-white font-medium">{weather.humidity}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${weather.humidity}%` }} />
                    </div>
                </div>
            </div>
        </Card>
    )
}
