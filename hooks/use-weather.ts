"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { WeatherData } from "@/types/weather"
import { mapWeatherCode, getWindDirection } from "@/lib/weather-utils"

export function useWeather() {
    const [location, setLocation] = useState("")
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const fetchWeatherData = async (lat: number, lon: number, cityName: string, countryCode?: string) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
            )

            if (!response.ok) throw new Error("Failed to fetch weather data")

            const data = await response.json()

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

            setWeather({
                city: cityName,
                country: countryCode || "",
                temp: Math.round(data.current.temperature_2m),
                feelsLike: Math.round(data.current.apparent_temperature),
                condition: mapWeatherCode(data.current.weather_code),
                humidity: data.current.relative_humidity_2m,
                windSpeed: Math.round(data.current.wind_speed_10m),
                windDirection: getWindDirection(data.current.wind_direction_10m),
                visibility: 10,
                pressure: Math.round(data.current.surface_pressure),
                uvIndex: Math.round(data.daily.uv_index_max[0]),
                sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                forecast: forecast,
                isDay: data.current.is_day === 1
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
        handleUseLocation
    }
}
