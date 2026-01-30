"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { MapPin } from "lucide-react"

// Dynamically import the client-side map component
const MapClient = dynamic(
    () => import('./map-client'),
    { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 dark:bg-slate-800 animate-pulse" /> } // Add loading state
)

interface WeatherMapProps {
    weather: WeatherData
}

export function WeatherMap({ weather }: WeatherMapProps) {
    const [coords, setCoords] = useState<[number, number] | null>(null)

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                // If the app was more robust, we would pass lat/lon from the main weather data
                // For now, we fetch it if not available, but ideally we should cache this or get it from upstream.
                // Assuming weather object doesn't have it yet.
                const res = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weather.city)}&count=1&language=en&format=json`
                )
                const data = await res.json()
                if (data.results && data.results.length > 0) {
                    setCoords([data.results[0].latitude, data.results[0].longitude])
                }
            } catch (e) {
                console.error("Failed to get map coords", e)
            }
        }
        fetchCoords()
    }, [weather.city])

    if (!coords) return null

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg lg:col-span-2 overflow-hidden h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-red-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Location Map</h3>
            </div>

            <div className="flex-1 w-full rounded-xl overflow-hidden relative z-0">
                <MapClient coords={coords} city={weather.city} temp={weather.temp} />
            </div>
        </Card>
    )
}
