"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { Lightbulb, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { getWeatherTip } from "@/lib/trivia-data"
import { Button } from "@/components/ui/button"

interface WeatherTriviaProps {
    weather: WeatherData
}

export function WeatherTrivia({ weather }: WeatherTriviaProps) {
    const [tip, setTip] = useState("")
    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshTip = () => {
        setIsRefreshing(true)
        setTip(getWeatherTip(weather.temp, weather.condition))
        setTimeout(() => setIsRefreshing(false), 500)
    }

    useEffect(() => {
        setTip(getWeatherTip(weather.temp, weather.condition))
    }, [weather.temp, weather.condition])

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Weather Wisdom</h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshTip}
                    className="h-8 w-8 hover:bg-white/40 dark:hover:bg-slate-800/40"
                    title="Get another tip"
                >
                    <RefreshCw className={`h-4 w-4 text-slate-600 dark:text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {tip}
            </p>
        </Card>
    )
}
