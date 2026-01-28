"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Trash2 } from "lucide-react"
import { WeatherIcon } from "./weather-icon"

interface WeatherHistoryItem {
    city: string
    temp: number
    condition: string
    timestamp: number
}

interface WeatherHistoryProps {
    history: WeatherHistoryItem[]
    onClear: () => void
    onCityClick: (city: string) => void
}

export function WeatherHistory({ history, onClear, onCityClick }: WeatherHistoryProps) {
    if (history.length === 0) return null

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
        return `${Math.floor(diffMins / 1440)}d ago`
    }

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Searches</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            </div>

            <div className="space-y-2">
                {history.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onCityClick(item.city)}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <WeatherIcon condition={item.condition} className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                            <div className="text-left">
                                <div className="font-semibold text-slate-900 dark:text-white">{item.city}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{formatTime(item.timestamp)}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{item.temp}°</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{item.condition}</div>
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    )
}
