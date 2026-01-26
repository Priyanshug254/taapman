"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { WeatherIcon } from "@/components/weather-icon"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface HourlyForecastProps {
    weather: WeatherData
}

export function HourlyForecast({ weather }: HourlyForecastProps) {
    if (!weather.hourly || weather.hourly.length === 0) return null

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Hourly Forecast</h3>
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 p-4">
                    {weather.hourly.map((hour, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/40 dark:bg-slate-800/40 min-w-[80px]">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {index === 0 ? 'Now' : hour.time}
                            </span>
                            <div className="text-sky-600 dark:text-sky-400">
                                <WeatherIcon condition={hour.icon} className="h-8 w-8" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {hour.temp}°
                            </span>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </Card>
    )
}
