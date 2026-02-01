"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { Sun, Shield, Clock, AlertTriangle } from "lucide-react"

interface UVTrackerProps {
    weather: WeatherData
}

export function UVTracker({ weather }: UVTrackerProps) {
    const uv = weather.uvIndex

    // Safety Logic
    const getSafetyInfo = (uv: number) => {
        if (uv >= 11) return {
            level: "Extreme",
            color: "text-purple-500",
            bg: "bg-purple-500",
            burnTime: "< 10 mins",
            spf: "SPF 50+",
            advice: "Avoid sun. Stay indoors."
        }
        if (uv >= 8) return {
            level: "Very High",
            color: "text-red-500",
            bg: "bg-red-500",
            burnTime: "15 mins",
            spf: "SPF 50+",
            advice: "Seek shade. Shirt, hat, sunglasses."
        }
        if (uv >= 6) return {
            level: "High",
            color: "text-orange-500",
            bg: "bg-orange-500",
            burnTime: "30 mins",
            spf: "SPF 30+",
            advice: "Reduce exposure between 10AM-4PM."
        }
        if (uv >= 3) return {
            level: "Moderate",
            color: "text-yellow-500",
            bg: "bg-yellow-500",
            burnTime: "45 mins",
            spf: "SPF 15+",
            advice: "Wear hat and sunglasses."
        }
        return {
            level: "Low",
            color: "text-green-500",
            bg: "bg-green-500",
            burnTime: "60+ mins",
            spf: "None",
            advice: "Enjoy the outdoors safely."
        }
    }

    const info = getSafetyInfo(uv)

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
                <Sun className={`h-5 w-5 ${info.color}`} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">SunSmart UV</h3>
            </div>

            <div className="space-y-6">
                {/* Main Gauge */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className={`text-4xl font-bold ${info.color}`}>{uv}</div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{info.level}</div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-700 dark:text-slate-300 font-medium">
                            <Clock className="h-4 w-4" />
                            <span>{info.burnTime}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">Time to Burn</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${info.bg}`}
                        style={{ width: `${Math.min((uv / 12) * 100, 100)}%` }}
                    />
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
                            <Shield className="h-4 w-4" />
                            Recommended
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{info.spf}</div>
                    </div>
                    <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            Action
                        </div>
                        <div className="text-xs font-medium text-slate-900 dark:text-white leading-tight">{info.advice}</div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
