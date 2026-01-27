"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { WeatherData } from "@/types/weather"
import { mapWeatherCode, getWindDirection } from "@/lib/weather-utils"

export function useWeather() {
    const [location, setLocation] = useState("")
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)
    const [unit, setUnit] = useState<'C' | 'F'>('C')
    const { toast } = useToast()

    const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C')

    const convertTemp = (temp: number) => {
        if (unit === 'C') return temp
        return Math.round((temp * 9 / 5) + 32)
    }

    const fetchWeatherData = async (lat: number, lon: number, cityName: string, countryCode?: string) => {
        try {
            const [weatherRes, aqiRes] = await Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`),
                fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`)
            ])

            if (!weatherRes.ok) throw new Error("Failed to fetch weather data")

            const weatherData = await weatherRes.json()
            const aqiData = aqiRes.ok ? await aqiRes.json() : null

            const currentHour = new Date().getHours()
            const hourly = weatherData.hourly.time
                .slice(currentHour, currentHour + 24)
                .map((time: string, index: number) => ({
                    time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temp: Math.round(weatherData.hourly.temperature_2m[currentHour + index]),
                    icon: mapWeatherCode(weatherData.hourly.weather_code[currentHour + index])
                }))

            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            const forecast = weatherData.daily.time.slice(0, 5).map((dateStr: string, index: number) => {
                const date = new Date(dateStr)
                return {
                    day: days[date.getDay()],
                    condition: mapWeatherCode(weatherData.daily.weather_code[index]),
                    minTemp: Math.round(weatherData.daily.temperature_2m_min[index]),
                    maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
                    rainProb: weatherData.daily.precipitation_probability_max[index] || 0
                }
            })

            setWeather({
                city: cityName,
                country: countryCode || "",
                temp: Math.round(weatherData.current.temperature_2m),
                feelsLike: Math.round(weatherData.current.apparent_temperature),
                condition: mapWeatherCode(weatherData.current.weather_code),
                humidity: weatherData.current.relative_humidity_2m,
                windSpeed: Math.round(weatherData.current.wind_speed_10m),
                windDirection: getWindDirection(weatherData.current.wind_direction_10m),
                visibility: 10,
                pressure: Math.round(weatherData.current.surface_pressure),
                uvIndex: Math.round(weatherData.daily.uv_index_max[0]),
                sunrise: new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                forecast: forecast,
                hourly: hourly,
                isDay: weatherData.current.is_day === 1,
                aqi: aqiData?.current?.european_aqi
            })

        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to load weather data. Please try again.",
                variant: "destructive",
                duration: 3000,
            })
        }
    }

    const handleSearch = async (query?: string) => {
        const searchLocation = query || location
        if (!searchLocation.trim()) {
            toast({
                title: "Error",
                description: "Please enter a city name",
                variant: "destructive",
            })
            return
        }

        if (query) setLocation(query)

        setLoading(true)
        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchLocation)}&count=1&language=en&format=json`
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
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    )
                    const data = await response.json()

                    await fetchWeatherData(latitude, longitude, data.city || data.locality || "Unknown Location", data.countryCode)
                } catch (error) {

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

    return {
        location,
        setLocation,
        weather,
        loading,
        handleSearch,
        handleUseLocation,
        unit,
        toggleUnit,
        convertTemp
    }
}
