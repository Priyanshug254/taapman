"use client"

import { Shirt, Umbrella, Glasses, Snowflake, Wind } from "lucide-react"
import { Card } from "@/components/ui/card"

interface OutfitAdvisorProps {
    weather: {
        temp: number
        condition: string
        windSpeed: number
        isDay?: boolean
    }
}

export function OutfitAdvisor({ weather }: OutfitAdvisorProps) {
    const getSuggestions = () => {
        const suggestions = []
        const { temp, condition, windSpeed } = weather
        const isRaining = condition.toLowerCase().includes("rain")
        const isSnowing = condition.toLowerCase().includes("snow")

        // Top wear
        if (temp >= 25) suggestions.push({ icon: Shirt, text: "T-shirt / Light Top", color: "text-orange-500" })
        else if (temp >= 15) suggestions.push({ icon: Shirt, text: "Long Sleeve / Hoodie", color: "text-blue-500" })
        else if (temp >= 5) suggestions.push({ icon: Shirt, text: "Jacket / Sweater", color: "text-indigo-600" })
        else suggestions.push({ icon: Snowflake, text: "Heavy Coat / Thermal", color: "text-cyan-600" })

        // Bottom wear
        if (temp >= 25) suggestions.push({ icon: Shirt, text: "Shorts / Skirt", color: "text-orange-500" }) // Reusing Shirt icon as generic clothing for now if no specific pants icon
        else suggestions.push({ icon: Shirt, text: "Jeans / Trousers", color: "text-slate-700" })

        // Accessories
        if (isRaining) suggestions.push({ icon: Umbrella, text: "Umbrella / Raincoat", color: "text-blue-600" })
        if (isSnowing) suggestions.push({ icon: Snowflake, text: "Snow Boots", color: "text-cyan-500" })
        if (temp > 20 && !isRaining && !isSnowing) suggestions.push({ icon: Glasses, text: "Sunglasses", color: "text-amber-600" })
        if (windSpeed > 20) suggestions.push({ icon: Wind, text: "Windbreaker", color: "text-slate-500" })

        return suggestions
    }

    const suggestions = getSuggestions()

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Shirt className="h-5 w-5 text-purple-500" />
                Outfit Advisor
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestions.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                        <item.icon className={`h-8 w-8 mb-2 ${item.color}`} />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}
