"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, Wind, Sun } from "lucide-react"
import { WeatherData } from "@/types/weather"
import { useEffect, useState } from "react"

interface WeatherAlertProps {
    weather: WeatherData
}

export function WeatherAlert({ weather }: WeatherAlertProps) {
    const [alerts, setAlerts] = useState<{ title: string; description: string; variant: "default" | "destructive"; icon: any }[]>([])

    useEffect(() => {
        const newAlerts = []

        // UV Alert
        if (weather.uvIndex >= 7) {
            newAlerts.push({
                title: "High UV Warning",
                description: `UV Index is ${weather.uvIndex}. Wear sunscreen and protective clothing.`,
                variant: "destructive" as const,
                icon: Sun
            })
        }

        // Wind Alert
        if (weather.windSpeed >= 30) {
            newAlerts.push({
                title: "High Wind Advisory",
                description: `Wind speeds reaching ${weather.windSpeed} km/h. Secure loose objects.`,
                variant: "default" as const,
                icon: Wind
            })
        }

        // AQI Alert
        if (weather.aqi && weather.aqi > 60) {
            newAlerts.push({
                title: "Poor Air Quality",
                description: "Air quality is degraded. Limit outdoor exertion.",
                variant: "destructive" as const,
                icon: AlertTriangle
            })
        }

        // Storm Alert (based on weather code)
        // Codes: 95, 96, 99 are Thunderstorm
        const stormCodes = ["Thunderstorm", "Heavy Rain", "Snow"]
        if (stormCodes.some(code => weather.condition.includes(code))) {
             newAlerts.push({
                title: "Severe Weather Alert",
                description: `Current condition: ${weather.condition}. Stay safe.`,
                variant: "destructive" as const,
                icon: AlertCircle
            })
        }

        setAlerts(newAlerts)
    }, [weather])

    if (alerts.length === 0) return null

    return (
        <div className="space-y-4 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 mt-6">
            {alerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant} className="border-l-4 shadow-md bg-white/90 dark:bg-slate-900/90 backdrop-blur">
                    <alert.icon className="h-4 w-4" />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>
                        {alert.description}
                    </AlertDescription>
                </Alert>
            ))}
        </div>
    )
}
