"use client"

import { Activity, Bike, Footprints, Tent, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WEATHER_THRESHOLDS } from "@/lib/constants"

import { WeatherData } from "@/types/weather"

interface ActivityPlannerProps {
    weather: WeatherData
}

export function ActivityPlanner({ weather }: ActivityPlannerProps) {
    const getSuitability = (activity: string) => {
        const { temp, condition, windSpeed, isDay } = weather
        const isRaining = condition.toLowerCase().includes("rain")
        const isSnowing = condition.toLowerCase().includes("snow")
        const isClear = condition.toLowerCase().includes("clear")

        let score: number = WEATHER_THRESHOLDS.SCORES.MAX
        let reason = "Perfect conditions!"

        switch (activity) {
            case "Running":
                if (temp > WEATHER_THRESHOLDS.TEMP.VERY_HOT) { score -= 40; reason = "Too hot" }
                if (temp < WEATHER_THRESHOLDS.TEMP.FREEZING) { score -= 30; reason = "Too cold" }
                if (isRaining) { score -= 30; reason = "Raining" }
                if (windSpeed > WEATHER_THRESHOLDS.WIND.GALE) { score -= 20; reason = "Windy" }
                break
            case "Cycling":
                if (windSpeed > WEATHER_THRESHOLDS.WIND.MODERATE) { score -= 40; reason = "Too windy" }
                if (isRaining) { score -= 50; reason = "Raining" }
                if (isSnowing) { score -= 80; reason = "Snow/Ice risk" }
                break
            case "Camping":
                if (isRaining) { score -= 60; reason = "Rain expected" }
                if (temp < WEATHER_THRESHOLDS.TEMP.CHILLY) { score -= 30; reason = "Chilly night" }
                if (windSpeed > WEATHER_THRESHOLDS.WIND.STRONG) { score -= 30; reason = "Windy" }
                break
            case "Stargazing":
                if (!isClear) { score = 0; reason = "Cloudy/Rainy" }
                if (isDay) { score = 0; reason = "It's daytime" }
                else if (score === WEATHER_THRESHOLDS.SCORES.MAX) reason = "Clear skies!"
                break
        }

        return { score: Math.max(0, score), reason }
    }

    const activities = [
        { name: "Running", icon: Footprints, ...getSuitability("Running") },
        { name: "Cycling", icon: Bike, ...getSuitability("Cycling") },
        { name: "Camping", icon: Tent, ...getSuitability("Camping") },
        { name: "Stargazing", icon: Star, ...getSuitability("Stargazing") },
    ]

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Activity Planner
            </h3>
            <div className="space-y-4">
                {activities.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                            </div>
                            <span className={`text-sm ${item.score >= WEATHER_THRESHOLDS.SCORES.GOOD ? 'text-green-600' : item.score >= WEATHER_THRESHOLDS.SCORES.POOR ? 'text-yellow-600' : 'text-red-600'}`}>
                                {item.reason}
                            </span>
                        </div>
                        <Progress value={item.score} className={`h-2 ${item.score >= WEATHER_THRESHOLDS.SCORES.GOOD ? 'bg-green-100' : 'bg-slate-100'}`} indicatorClassName={item.score >= WEATHER_THRESHOLDS.SCORES.GOOD ? 'bg-green-500' : item.score >= WEATHER_THRESHOLDS.SCORES.POOR ? 'bg-yellow-500' : 'bg-red-500'} />
                    </div>
                ))}
            </div>
        </Card>
    )
}
