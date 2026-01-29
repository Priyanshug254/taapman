"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { MapPin } from "lucide-react"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
)
const useMap = dynamic(
    () => import('react-leaflet').then((mod) => mod.useMap),
    { ssr: false }
)

// Helper component to update map view when coords change
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap() as any // Type casting for dynamic import
    useEffect(() => {
        if (map) map.setView(center)
    }, [center, map])
    return null
}

interface WeatherMapProps {
    weather: WeatherData
}

export function WeatherMap({ weather }: WeatherMapProps) {
    const [coords, setCoords] = useState<[number, number] | null>(null)

    useEffect(() => {
        // We need to fetch coordinates for the city since weather data might not have raw lat/lon exposed directly
        // Or simpler: modify useWeather to expose lat/lon. 
        // Checking types/weather.ts... it doesn't seem to have lat/lon.
        // I will fetch it again lightly or update types. 
        // For now, let's just fetch it quickly using the city name, same as search.

        const fetchCoords = async () => {
            try {
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
                {/* Leaflet CSS must be loaded globally or via Next.js styles. 
             I'll add a link tag or import it if I can. 
             Ideally import 'leaflet/dist/leaflet.css' in globals, but for now specific component style. */}
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin="" />

                <MapContainer
                    center={coords}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    // @ts-ignore
                    scrollWheelZoom={false}
                >
                    <ChangeView center={coords} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={coords}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold">{weather.city}</p>
                                <p>{weather.temp}°C</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </Card>
    )
}
