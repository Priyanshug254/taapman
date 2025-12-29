"use client"

import { WeatherData } from "@/types/weather"

interface WeatherBackgroundProps {
    weather: WeatherData | null
}

export function WeatherBackground({ weather }: WeatherBackgroundProps) {
    const getGradient = () => {
        if (!weather) {
            // Default / Loading State
            return "from-sky-100 via-blue-50 to-cyan-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900"
        }

        const { condition, isDay } = weather
        const cond = condition.toLowerCase()

        // Night Time (overrides most conditions unless specifically snowy/rainy which might be brighter/grayer)
        if (!isDay) {
            if (cond.includes("rain") || cond.includes("cloud")) return "from-slate-900 via-gray-900 to-black"
            return "from-slate-950 via-indigo-950 to-slate-900" // Starry night feel
        }

        // Day Time
        if (cond.includes("clear") || cond.includes("sunny")) return "from-sky-400 via-blue-300 to-blue-200"
        if (cond.includes("cloud")) return "from-slate-300 via-gray-300 to-slate-200"
        if (cond.includes("rain") || cond.includes("drizzle")) return "from-slate-700 via-slate-600 to-slate-500"
        if (cond.includes("snow")) return "from-blue-100 via-white to-blue-50"
        if (cond.includes("thunder")) return "from-slate-800 via-purple-900 to-slate-800"
        if (cond.includes("fog") || cond.includes("mist")) return "from-gray-300 via-slate-200 to-gray-300"

        // Fallback for Day
        return "from-sky-300 via-cyan-200 to-blue-200"
    }

    return (
        <div
            className={`fixed inset-0 -z-10 bg-gradient-to-br ${getGradient()} transition-colors duration-1000 ease-in-out`}
        />
    )
}
