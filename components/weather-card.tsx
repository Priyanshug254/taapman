"use client"

import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Clock, Share2, Check, Sun, Volume2, VolumeX, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { WeatherData } from "@/types/weather"
import { WeatherIcon } from "@/components/weather-icon"
import { toast } from "@/hooks/use-toast"

interface WeatherCardProps {
    weather: WeatherData
    isFavorite: boolean
    toggleFavorite: () => void
    unit: 'C' | 'F'
    convertTemp: (temp: number) => number
}

export function WeatherCard({ weather, isFavorite, toggleFavorite, unit, convertTemp }: WeatherCardProps) {
    const [copied, setCopied] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    const handleSpeak = () => {
        if (!('speechSynthesis' in window)) {
            toast({
                title: "Not supported",
                description: "Your browser doesn't support text-to-speech.",
                variant: "destructive",
            })
            return
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }

        const text = `Current weather in ${weather.city} is ${convertTemp(weather.temp)} degrees ${unit === 'C' ? 'Celsius' : 'Fahrenheit'} and ${weather.condition}. It feels like ${convertTemp(weather.feelsLike)} degrees. The humidity is ${weather.humidity} percent and wind speed is ${weather.windSpeed} kilometers per hour ${weather.windDirection}.`

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }

    const handleShare = async () => {
        const text = `Current weather in ${weather.city}: ${convertTemp(weather.temp)}°${unit}, ${weather.condition}. Feels like ${convertTemp(weather.feelsLike)}°${unit}. Check it out on Taapman!`

        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast({
                title: "Copied to clipboard!",
                description: "Weather summary is ready to share.",
            })
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Could not access clipboard.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card className="p-8 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-xl relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSpeak}
                    className={`${isSpeaking ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'} hover:bg-white/20 dark:hover:bg-slate-800/20`}
                    title={isSpeaking ? "Stop Listening" : "Listen to Weather"}
                >
                    {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="hover:bg-white/20 dark:hover:bg-slate-800/20 text-slate-600 dark:text-slate-400"
                    title="Share Weather"
                >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
                </Button>
            </div>

            <div className="text-center space-y-6">
                <div>
                    <div className="flex items-center justify-center gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {weather.city}{weather.country ? `, ${weather.country}` : ''}
                        </h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite()}
                            className="h-8 w-8 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Star className={`h-5 w-5 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-slate-400"}`} />
                        </Button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated at {weather.lastUpdated}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{weather.condition}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <div className="text-sky-600 dark:text-sky-400">
                        <WeatherIcon condition={weather.condition} className="h-16 w-16" />
                    </div>
                    <div className="text-7xl font-bold text-slate-900 dark:text-white">{convertTemp(weather.temp)}°{unit}</div>
                </div>

                <p className="text-slate-600 dark:text-slate-400">Feels like {convertTemp(weather.feelsLike)}°{unit}</p>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40 cursor-help hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                                    <Droplets className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Humidity</p>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.humidity}%</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Amount of water vapor in the air.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40 cursor-help hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                                    <Wind className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Wind Speed</p>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.windSpeed} km/h {weather.windDirection}</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Speed of wind at 10 meters above ground.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40 cursor-help hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                                    <Eye className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Visibility</p>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.visibility} km</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Distance at which objects can be clearly seen.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40 cursor-help hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                                    <Gauge className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Pressure</p>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.pressure} hPa</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Atmospheric pressure at sea level.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40 cursor-help hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                                    <Sun className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">UV Index</p>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.uvIndex}</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Max UV Index for the day (0-11+).</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Sunrise/Sunset */}
                <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2">
                        <Sunrise className="h-5 w-5 text-amber-500" />
                        <div className="text-left">
                            <p className="text-xs text-slate-600 dark:text-slate-400">Sunrise</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{weather.sunrise}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sunset className="h-5 w-5 text-orange-500" />
                        <div className="text-left">
                            <p className="text-xs text-slate-600 dark:text-slate-400">Sunset</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{weather.sunset}</p>
                        </div>
                    </div>
                </div>

                {/* Forecast List */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-left">5-Day Forecast</h4>
                    {weather.forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="w-12 font-medium text-slate-900 dark:text-white">{day.day}</span>
                                <div className="flex items-center gap-2">
                                    <WeatherIcon condition={day.condition} className="h-6 w-6" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline-block w-24">{day.condition}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    {convertTemp(day.maxTemp)}° <span className="text-slate-500 dark:text-slate-400 text-sm">/ {convertTemp(day.minTemp)}°</span>
                                </p>
                                {day.rainProb > 0 && (
                                    <p className="text-xs text-sky-600 dark:text-sky-400 flex items-center justify-end gap-1">
                                        <Droplets className="h-3 w-3" /> {day.rainProb}%
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}
