"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, X, ArrowRight } from "lucide-react"
import { WeatherIcon } from "./weather-icon"

interface ComparisonData {
    city: string
    temp: number
    condition: string
    humidity: number
    windSpeed: number
}

export function CityComparison() {
    const [city1, setCity1] = useState("")
    const [city2, setCity2] = useState("")
    const [comparison, setComparison] = useState<{ city1: ComparisonData | null, city2: ComparisonData | null }>({
        city1: null,
        city2: null
    })
    const [loading, setLoading] = useState(false)

    const fetchCityWeather = async (cityName: string): Promise<ComparisonData | null> => {
        try {
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
            )
            const geoData = await geoRes.json()

            if (!geoData.results || geoData.results.length === 0) return null

            const { latitude, longitude, name } = geoData.results[0]

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
            )
            const weatherData = await weatherRes.json()

            const weatherCodeMap: { [key: number]: string } = {
                0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
                45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle',
                61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow',
                73: 'Snow', 75: 'Heavy Snow', 95: 'Thunderstorm'
            }

            return {
                city: name,
                temp: Math.round(weatherData.current.temperature_2m),
                condition: weatherCodeMap[weatherData.current.weather_code] || 'Unknown',
                humidity: weatherData.current.relative_humidity_2m,
                windSpeed: Math.round(weatherData.current.wind_speed_10m)
            }
        } catch (error) {
            return null
        }
    }

    const handleCompare = async () => {
        if (!city1.trim() || !city2.trim()) return

        setLoading(true)
        const [data1, data2] = await Promise.all([
            fetchCityWeather(city1),
            fetchCityWeather(city2)
        ])

        setComparison({ city1: data1, city2: data2 })
        setLoading(false)
    }

    const clearComparison = () => {
        setComparison({ city1: null, city2: null })
        setCity1("")
        setCity2("")
    }

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">City Comparison</h3>
                {comparison.city1 && (
                    <Button variant="ghost" size="sm" onClick={clearComparison}>
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            {!comparison.city1 ? (
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        placeholder="First city (e.g., London)"
                        value={city1}
                        onChange={(e) => setCity1(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                        className="flex-1 bg-white dark:bg-slate-800"
                    />
                    <ArrowRight className="hidden sm:block h-5 w-5 text-slate-400 self-center" />
                    <Input
                        placeholder="Second city (e.g., Paris)"
                        value={city2}
                        onChange={(e) => setCity2(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                        className="flex-1 bg-white dark:bg-slate-800"
                    />
                    <Button onClick={handleCompare} disabled={loading} className="bg-sky-600 hover:bg-sky-700">
                        <Search className="h-4 w-4 mr-2" />
                        Compare
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[comparison.city1, comparison.city2].map((data, idx) => (
                        data && (
                            <div key={idx} className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{data.city}</h4>
                                <div className="flex items-center gap-3 mb-4">
                                    <WeatherIcon condition={data.condition} className="h-12 w-12 text-sky-600 dark:text-sky-400" />
                                    <div>
                                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{data.temp}°C</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">{data.condition}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Humidity</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{data.humidity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Wind Speed</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{data.windSpeed} km/h</span>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </Card>
    )
}
