"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { useEffect, useState } from "react"
import { History, Calendar } from "lucide-react"

interface WeatherTimeMachineProps {
    weather: WeatherData
}

interface HistoricalPoint {
    year: number
    temp: number
    condition: string
}

export function WeatherTimeMachine({ weather }: WeatherTimeMachineProps) {
    const [history, setHistory] = useState<HistoricalPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            const points: HistoricalPoint[] = []
            const currentYear = new Date().getFullYear()

            // Let's check 1 year, 10 years, and 20 years ago
            const years = [currentYear - 1, currentYear - 10, currentYear - 20]

            // We need coords. We'll use the same geocoding trick or preferably pass lat/lon down.
            // For efficiency, I'll do a quick lookup then fetch history or pass lat/lon if available.
            // Assuming we resolve coords first.
            try {
                // 1. Get coords
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weather.city)}&count=1&language=en&format=json`)
                const geoData = await geoRes.json()
                if (!geoData.results?.length) return

                const { latitude, longitude } = geoData.results[0]
                const today = new Date().toISOString().split('T')[0]
                const monthDay = today.substring(5) // MM-DD

                // 2. Fetch for each year
                await Promise.all(years.map(async (year) => {
                    const date = `${year}-${monthDay}`
                    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,weather_code&timezone=auto`

                    const res = await fetch(url)
                    const data = await res.json()

                    if (data.daily) {
                        const weatherCodeMap: { [key: number]: string } = {
                            0: 'Clear', 1: 'Clear', 2: 'Cloudy', 3: 'Overcast',
                            45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle',
                            61: 'Rain', 63: 'Rain', 71: 'Snow', 95: 'Storm'
                        }

                        points.push({
                            year,
                            temp: data.daily.temperature_2m_max[0],
                            condition: weatherCodeMap[data.daily.weather_code[0]] || 'Unknown'
                        })
                    }
                }))

                setHistory(points.sort((a, b) => b.year - a.year)) // Sort descending 
            } catch (e) {
                console.error("Time machine failed", e)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [weather.city])

    if (!history.length && !loading) return null

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Time Machine</h3>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-sm text-slate-500 animate-pulse">Traveling through time...</div>
                ) : (
                    history.map((pt) => (
                        <div key={pt.year} className="flex items-center justify-between p-3 rounded-lg bg-white/40 dark:bg-slate-800/40">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span className="font-bold text-slate-900 dark:text-white">{pt.year}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{pt.condition}</span>
                                <span className="font-bold text-lg text-slate-900 dark:text-white">{pt.temp}°</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}
