"use client";

import { useEffect, useState } from "react"

import { Cloud, MapPin, Search, Loader2, Star, Maximize2, Minimize2, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { OutfitAdvisor } from "@/components/outfit-advisor"
import { ActivityPlanner } from "@/components/activity-planner"
import { GardenGuru } from "@/components/garden-guru"
import { AirQualityCard } from "@/components/air-quality-card"
import { WeatherCard } from "@/components/weather-card"
import { HourlyForecast } from "@/components/hourly-forecast"
import { WeatherSkeleton } from "@/components/weather-skeleton"
import { WeatherIcon } from "@/components/weather-icon"
import { WeatherBackground } from "@/components/weather-background"
import { WeatherAnimations } from "@/components/weather-animations"
import { WeatherAlert } from "@/components/weather-alert"
import { SolarTracker } from "@/components/solar-tracker"
import { WeatherTrivia } from "@/components/weather-trivia"
import { WeatherTrends } from "@/components/weather-trends"
import { CityComparison } from "@/components/city-comparison"
import { WeatherHistory } from "@/components/weather-history"
import { WeatherMap } from "@/components/weather-map"
import { WeatherTimeMachine } from "@/components/weather-time-machine"
import { WeatherTicker } from "@/components/weather-ticker"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { WeatherGlobe } from "@/components/weather-globe"
import { WeatherShareCard } from "@/components/weather-share-card"
import { WeatherSoundController } from "@/components/weather-sound-controller"
import { SafetyGuideModal } from "@/components/safety-guide-modal"
import { UVTracker } from "@/components/uv-tracker"
import { StargazingCard } from "@/components/stargazing-card"
import { useWeather } from "@/hooks/use-weather"
import { useFavorites } from "@/hooks/use-favorites"
import { useWeatherHistory } from "@/hooks/use-weather-history"
import { useVoiceControl } from "@/hooks/use-voice-control"

export default function Home() {
  const { location, setLocation, weather, loading, handleSearch, handleUseLocation, unit, toggleUnit, convertTemp } = useWeather()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { history, addToHistory, clearHistory } = useWeatherHistory()
  const [isZenMode, setIsZenMode] = useState(false)

  const { isListening, startListening } = useVoiceControl((transcript) => {
    setLocation(transcript)
    handleSearch(transcript)
  })

  // Track weather history
  useEffect(() => {
    if (weather) {
      addToHistory(weather.city, weather.temp, weather.condition)
    }
  }, [weather?.city])

  return (
    <div className="min-h-screen transition-colors duration-500 relative flex flex-col">
      <WeatherBackground weather={weather} />
      <WeatherAnimations weather={weather} />
      <WeatherTicker />

      {/* Header */}
      <header className="border-b border-white/20 dark:border-white/10 backdrop-blur-sm bg-white/30 dark:bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Taapman</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home</a>
            <a href="#" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Forecast</a>
            <a href="#" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">About</a>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUnit}
              className="w-9 px-0 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400"
            >
              °{unit}
            </Button>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}
                  onClick={startListening}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <Button
                onClick={() => handleSearch()}
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

            {/* Favorites List */}
            {favorites.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {favorites.map((city) => (
                  <Button
                    key={city}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch(city)}
                    className="bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                    {city}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Weather Data */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <WeatherSkeleton />
          </div>
        ) : weather && (
          <>
            <WeatherAlert weather={weather} />
            {/* Zen Mode Toggle */}
            {weather && (
              <div className="absolute top-4 right-4 z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsZenMode(!isZenMode)}
                  className="rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white"
                  title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                >
                  {isZenMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
              </div>
            )}

            {/* Main Content */}
            <div className={`max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-all ${isZenMode ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>

              {/* Main Weather Card */}
              <WeatherCard
                weather={weather}
                isFavorite={isFavorite(weather.city)}
                toggleFavorite={() => toggleFavorite(weather.city)}
                unit={unit}
                convertTemp={convertTemp}
              />
              <WeatherShareCard weather={weather} id="weather-share-card" />
              <HourlyForecast
                weather={weather}
                unit={unit}
                convertTemp={convertTemp}
              />

              {/* Smart Features Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIInsightsPanel weather={weather} />
                <WeatherTrends weather={weather} />
                <CityComparison />
                <WeatherGlobe weather={weather} />
                <WeatherMap weather={weather} />
                <OutfitAdvisor weather={weather} />
                <ActivityPlanner weather={weather} />
                <GardenGuru weather={weather} />
                <WeatherTimeMachine weather={weather} />
                <AirQualityCard weather={weather} />
                <UVTracker weather={weather} />
                <StargazingCard weather={weather} />
                <SolarTracker weather={weather} />
                <WeatherTrivia weather={weather} />
                <WeatherHistory
                  history={history}
                  onClear={clearHistory}
                  onCityClick={(city) => handleSearch(city)}
                />
              </div>

              {/* 5-Day Forecast */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">5-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weather.forecast.map((day, index) => (
                    <Card
                      key={index}
                      className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{day.day}</p>
                        <div className="text-sky-600 dark:text-sky-400">
                          <WeatherIcon condition={day.condition} className="h-10 w-10" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{day.condition}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{convertTemp(day.maxTemp)}°{unit}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{convertTemp(day.minTemp)}°{unit}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Zen Mode View */}
            {isZenMode && weather && (
              <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="text-center text-white animate-in fade-in zoom-in duration-700">
                  <div className="text-2xl font-light mb-2">{weather.city}</div>
                  <div className="text-9xl font-bold tracking-tighter mb-4 drop-shadow-2xl">{Math.round(weather.temp)}°</div>
                  <div className="text-3xl capitalize font-medium opacity-90">{weather.condition}</div>
                </div>
              </div>
            )}
          </>
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
      <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm relative z-10 bg-white/20 dark:bg-black/20 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4">
          <p>© 2026 Taapman Weather. Powered by Open-Meteo & Next.js 16.</p>
          {weather && (
            <>
              <WeatherSoundController weather={weather} />
              <SafetyGuideModal weather={weather} />
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
