import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { WeatherIcon } from "@/components/weather-icon"

interface WeatherCardProps {
    weather: WeatherData
}

export function WeatherCard({ weather }: WeatherCardProps) {
    return (
        <Card className="p-8 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-xl">
            <div className="text-center space-y-6">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {weather.city}{weather.country ? `, ${weather.country}` : ''}
                    </h3>
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
                    <div className="text-7xl font-bold text-slate-900 dark:text-white">{weather.temp}°C</div>
                </div>

                <p className="text-slate-600 dark:text-slate-400">Feels like {weather.feelsLike}°C</p>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40">
                        <Droplets className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Humidity</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.humidity}%</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40">
                        <Wind className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Wind Speed</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.windSpeed} km/h</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40">
                        <Eye className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Visibility</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.visibility} km</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/40 dark:bg-slate-800/40">
                        <Gauge className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pressure</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-white">{weather.pressure} hPa</p>
                    </div>
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
            </div>
        </Card>
    )
}
