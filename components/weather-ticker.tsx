"use client"

import { useEffect, useState } from "react"
import { WeatherIcon } from "./weather-icon"
import { WeatherData } from "@/types/weather"

interface TickerCity {
    name: string
    temp: number
    condition: string
}

export function WeatherTicker() {
    const [cities, setCities] = useState<TickerCity[]>([])
    const [loading, setLoading] = useState(true)

    const majorCities = [
        "London", "New York", "Tokyo", "Paris", "Dubai", "Singapore", "Sydney", "Mumbai", "Moscow", "Toronto"
    ]

    useEffect(() => {
        const fetchTickerData = async () => {
            // To avoid spamming the API, we'll implement a simple cache or just fetch once on mount.
            // Ideally we'd batch this or use a different endpoint, but for demo we'll do promise.all
            try {
                const results = await Promise.all(majorCities.map(async (city) => {
                    // Quick geocoding + weather fetch
                    // Using a simplified assumption or 1-step call if possible. 
                    // Or just mocking for "Outstanding" visual if API rate limits are tight?
                    // Let's try real data but limit it.
                    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
                    const geoData = await geoRes.json()
                    if (!geoData.results?.length) return null

                    const { latitude, longitude, name } = geoData.results[0]
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`)
                    const weatherData = await weatherRes.json()

                    const weatherCodeMap: { [key: number]: string } = {
                        0: 'Clear', 1: 'Clear', 2: 'Cloudy', 3: 'Overcast',
                        45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle',
                        61: 'Rain', 63: 'Rain', 71: 'Snow', 95: 'Storm'
                    }

                    return {
                        name,
                        temp: Math.round(weatherData.current.temperature_2m),
                        condition: weatherCodeMap[weatherData.current.weather_code] || 'Unknown'
                    }
                }))

                setCities(results.filter((c): c is TickerCity => c !== null))
            } catch (e) {
                console.error("Ticker fetch failed", e)
            } finally {
                setLoading(false)
            }
        }

        fetchTickerData()
    }, [])

    if (loading || !cities.length) return null

    return (
        <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 overflow-hidden py-2">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
                {/* Double the list for seamless loop */}
                {[...cities, ...cities].map((city, idx) => (
                    <div key={`${city.name}-${idx}`} className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-slate-200">{city.name}</span>
                        <span className="text-amber-400 font-mono">{city.temp}°C</span>
                        <span className="text-slate-400 text-xs">{city.condition}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
