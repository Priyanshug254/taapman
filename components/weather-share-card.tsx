"use client"

import { WeatherData } from "@/types/weather"
import { WeatherIcon } from "./weather-icon"
import { Cloud, MapPin } from "lucide-react"

interface WeatherShareCardProps {
    weather: WeatherData
    id: string
}

export function WeatherShareCard({ weather, id }: WeatherShareCardProps) {
    // This component is rendered off-screen or hidden, designed specifically for the screenshot
    return (
        <div
            id={id}
            className="fixed left-[-9999px] top-[-9999px] w-[600px] h-[315px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 flex flex-col justify-between text-white font-sans"
            style={{ fontFamily: 'Inter, sans-serif' }} // Enforce font in screenshot
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Cloud className="h-8 w-8" strokeWidth={2.5} />
                    <span className="text-2xl font-bold tracking-tight">Taapman</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                    buffer.app/weather
                </div>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                        <MapPin className="h-5 w-5" />
                        <span className="text-xl font-medium">{weather.city}</span>
                    </div>
                    <div className="text-8xl font-bold tracking-tighter">
                        {Math.round(weather.temp)}°
                    </div>
                    <div className="text-2xl font-medium text-white/90 mt-1 capitalize">
                        {weather.condition}
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                    <WeatherIcon condition={weather.condition} className="h-32 w-32 text-white drop-shadow-2xl" />
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 bg-black/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-center border-r border-white/10">
                    <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Humidity</div>
                    <div className="text-xl font-bold">{weather.humidity}%</div>
                </div>
                <div className="text-center border-r border-white/10">
                    <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Wind</div>
                    <div className="text-xl font-bold">{weather.windSpeed} km/h</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Feels Like</div>
                    <div className="text-xl font-bold">{Math.round(weather.feelsLike)}°</div>
                </div>
            </div>
        </div>
    )
}
