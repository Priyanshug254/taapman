"use client"

import { Sprout, CloudRain, Sun, Wind, ThermometerSnowflake } from "lucide-react"
import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"

interface GardenGuruProps {
    weather: WeatherData
}

export function GardenGuru({ weather }: GardenGuruProps) {
    const getAdvice = () => {
        const advice = []
        const { temp, condition, windSpeed } = weather
        const isRaining = condition.toLowerCase().includes("rain")
        const isSnowing = condition.toLowerCase().includes("snow")

        // Watering Logic
        if (isRaining || isSnowing) {
            advice.push({
                icon: CloudRain,
                text: "No need to water today.",
                color: "text-blue-500",
                type: "Watering"
            })
        } else if (temp > 25) {
            advice.push({
                icon: Sun,
                text: "Water deeply in the evening.",
                color: "text-orange-500",
                type: "Watering"
            })
        } else {
            advice.push({
                icon: Sprout,
                text: "Check soil moisture before watering.",
                color: "text-green-500",
                type: "Watering"
            })
        }

        // Protection Logic
        if (temp < 5) {
            advice.push({
                icon: ThermometerSnowflake,
                text: "Cover sensitive plants from frost.",
                color: "text-cyan-500",
                type: "Protection"
            })
        } else if (windSpeed > 20) {
            advice.push({
                icon: Wind,
                text: "Secure tall plants and climbers.",
                color: "text-slate-500",
                type: "Protection"
            })
        } else if (temp > 10 && !isRaining && windSpeed < 15) {
            advice.push({
                icon: Sprout,
                text: "Great day for planting or pruning!",
                color: "text-green-600",
                type: "Activity"
            })
        }

        return advice
    }

    const adviceList = getAdvice()

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                Garden Guru
            </h3>
            <div className="space-y-4">
                {adviceList.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                        <item.icon className={`h-6 w-6 shrink-0 ${item.color}`} />
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{item.type}</p>
                            <p className="font-medium text-slate-900 dark:text-white leading-tight">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
