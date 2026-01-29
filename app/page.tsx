use client

import { useEffect } from "react"

import { Cloud, MapPin, Search, Loader2, Star } from "lucide-react"
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
import { useWeather } from "@/hooks/use-weather"
import { useFavorites } from "@/hooks/use-favorites"
import { useWeatherHistory } from "@/hooks/use-weather-history"
import { useVoiceControl } from "@/hooks/use-voice-control"
import { Mic } from "lucide-react"

export default function Home() {
  const { location, setLocation, weather, loading, handleSearch, handleUseLocation, unit, toggleUnit, convertTemp } = useWeather()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { history, addToHistory, clearHistory } = useWeatherHistory()

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
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

              <WeatherCard
                weather={weather}
                isFavorite={isFavorite(weather.city)}
                toggleFavorite={() => toggleFavorite(weather.city)}
                unit={unit}
                convertTemp={convertTemp}
              />
              <HourlyForecast
                weather={weather}
                unit={unit}
                convertTemp={convertTemp}
              />

              {/* Smart Features Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeatherTrends weather={weather} />
                <CityComparison />
                <WeatherMap weather={weather} />
                <OutfitAdvisor weather={weather} />
                <ActivityPlanner weather={weather} />
                <GardenGuru weather={weather} />
                <WeatherTimeMachine weather={weather} />
                <AirQualityCard weather={weather} />
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
      <footer className="border-t border-white/20 dark:border-white/10 backdrop-blur-sm bg-white/30 dark:bg-black/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-slate-700 dark:text-slate-300 font-medium">Taapman – Smart Weather Forecasting</p>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors" aria-label="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
