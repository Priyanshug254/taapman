"use client"

import { useState } from "react"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  MapPin,
  Search,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { OutfitAdvisor } from "@/components/outfit-advisor"
import { ActivityPlanner } from "@/components/activity-planner"


// Helper to map WMO codes to conditions
const mapWeatherCode = (code: number): string => {
  if (code === 0) return "Clear"
  if (code === 1 || code === 2 || code === 3) return "Cloudy"
  if (code >= 45 && code <= 48) return "Cloudy"
  if (code >= 51 && code <= 67) return "Rainy"
  if (code >= 71 && code <= 77) return "Snowy"
  if (code >= 80 && code <= 82) return "Rainy"
  if (code >= 85 && code <= 86) return "Snowy"
  if (code >= 95 && code <= 99) return "Rainy"
  return "Clear"
}

const getWeatherIcon = (condition: string, size = 24) => {
  const className = `h-${size} w-${size}`
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className={className} />
    case "cloudy":
      return <Cloud className={className} />
    case "rainy":
      return <CloudRain className={className} />
    case "snowy":
      return <CloudSnow className={className} />
    default:
      return <Sun className={className} />
  }
}

export default function Home() {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchWeatherData = async (lat: number, lon: number, cityName: string, countryCode?: string) => {
    try {
      // Fetch weather data from Open-Meteo
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      )

      if (!response.ok) throw new Error("Failed to fetch weather data")

      const data = await response.json()

      // Format 5-day forecast
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const forecast = data.daily.time.slice(0, 5).map((dateStr: string, index: number) => {
        const date = new Date(dateStr)
        return {
          day: days[date.getDay()],
          condition: mapWeatherCode(data.daily.weather_code[index]),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          maxTemp: Math.round(data.daily.temperature_2m_max[index])
        }
      })

      // Format current weather to match our UI requirements
      setWeather({
        city: cityName,
        country: countryCode || "",
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: mapWeatherCode(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        visibility: 10, // Open-Meteo basic free tier doesn't always have visibility easily, defaulting to 10
        pressure: Math.round(data.current.surface_pressure),
        sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        forecast: forecast,
        isDay: data.current.is_day === 1
      })

    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to load weather data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Error",
        description: "Please enter a city name",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // 1. Geocoding
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
      )
      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        toast({
          title: "City not found",
          description: "Please check the spelling and try again.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { latitude, longitude, name, country_code } = geoData.results[0]

      // 2. Fetch Weather
      await fetchWeatherData(latitude, longitude, name, country_code)

    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    toast({
      title: "Getting your location...",
      description: "Please allow location access if prompted",
    })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await response.json()

          await fetchWeatherData(latitude, longitude, data.city || data.locality || "Unknown Location", data.countryCode)
        } catch (error) {
          // Fallback if reverse geocoding fails but we have coords
          await fetchWeatherData(latitude, longitude, "Your Location")
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error(error)
        toast({
          title: "Location Error",
          description: "Unable to retrieve your location. Please check permissions.",
          variant: "destructive",
        })
        setLoading(false)
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-500">

      {/* Header */}
      <header className="border-b border-white/20 dark:border-white/10 backdrop-blur-sm bg-white/30 dark:bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Taapman</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Forecast
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              About
            </a>
            <ThemeToggle />
          </nav>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-2xl mx-auto text-center mb-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white text-balance">
            Smart Weather Forecasting
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-pretty">
            Get accurate, real-time weather information for any location worldwide
          </p>

          {/* Search Section */}
          <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter city name... (e.g. London)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="h-12 px-6 bg-sky-600 hover:bg-sky-700 text-white"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleUseLocation}
                disabled={loading}
                variant="outline"
                className="w-full h-12 border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950 bg-transparent"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Use My Location
              </Button>
            </div>
          </Card>
        </div>

        {/* Weather Data Card */}
        {weather && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Weather Card */}
            <Card className="p-8 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-xl">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {weather.city}{weather.country ? `, ${weather.country}` : ''}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">{weather.condition}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="text-sky-600 dark:text-sky-400">{getWeatherIcon(weather.condition, 16)}</div>
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

            {/* Smart Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OutfitAdvisor weather={weather} />
              <ActivityPlanner weather={weather} />
            </div>

            {/* 5-Day Forecast */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">5-Day Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {weather.forecast.map((day: any, index: number) => (
                  <Card
                    key={index}
                    className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{day.day}</p>
                      <div className="text-sky-600 dark:text-sky-400">{getWeatherIcon(day.condition, 10)}</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{day.condition}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{day.maxTemp}°</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{day.minTemp}°</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Cloud className="h-24 w-24 mx-auto text-sky-600/30 dark:text-sky-400/30 mb-4" />
            <p className="text-lg text-slate-600 dark:text-slate-400">Enter a city name to get started</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-white/10 backdrop-blur-sm bg-white/30 dark:bg-black/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-slate-700 dark:text-slate-300 font-medium">Taapman – Smart Weather Forecasting</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
