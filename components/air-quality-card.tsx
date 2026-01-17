"use client"

import { Wind, Leaf, Activity, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { getAQIStatus } from "@/lib/weather-utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface AirQualityCardProps {
    weather: WeatherData
}

export function AirQualityCard({ weather }: AirQualityCardProps) {
    if (weather.aqi === undefined) return null

    const aqiInfo = getAQIStatus(weather.aqi)

    const getHealthAdvice = (aqi: number) => {
        if (aqi <= 20) return "Excellent air quality! Perfect for outdoor activities."
        if (aqi <= 40) return "Air quality is good. Enjoy your day."
        if (aqi <= 60) return "Moderate air quality. Sensitive groups should limit prolonged outdoor exertion."
        if (aqi <= 80) return "Poor air quality. Consider reducing heavy outdoor activities."
        return "Very poor air quality. Avoid outdoor activities if possible."
    }

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" />
                    Air Quality
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="cursor-help">
                                <Info className="h-4 w-4 text-slate-400" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px]">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                This is based on the European Air Quality Index (EAQI) which measures pollutants like PM2.5, PM10, NO2, O3, and SO2.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center gap-6">
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl ${aqiInfo.bgColor} min-w-[100px]`}>
                    <span className={`text-4xl font-bold ${aqiInfo.color}`}>{weather.aqi}</span>
                    <span className={`text-sm font-semibold mt-1 ${aqiInfo.color}`}>{aqiInfo.status}</span>
                </div>

                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Advice</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                        "{getHealthAdvice(weather.aqi)}"
                    </p>
                </div>
            </div>
        </Card>
    )
}
