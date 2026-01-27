"use client"

import { WeatherData } from "@/types/weather"
import { useEffect, useState } from "react"

interface WeatherAnimationsProps {
    weather: WeatherData | null
}

export function WeatherAnimations({ weather }: WeatherAnimationsProps) {
    const [particles, setParticles] = useState<{ id: number, style: any }[]>([])

    useEffect(() => {
        if (!weather) return

        const cond = weather.condition.toLowerCase()
        const isDay = weather.isDay
        const newParticles = []

        if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
            // Rain
            for (let i = 0; i < 50; i++) {
                newParticles.push({
                    id: i,
                    style: {
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        animationDelay: `${Math.random() * 2}s`,
                    }
                })
            }
        } else if (cond.includes("snow")) {
            // Snow
            for (let i = 0; i < 50; i++) {
                newParticles.push({
                    id: i,
                    style: {
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random()
                    }
                })
            }
        } else if (!isDay && (cond.includes("clear") || cond.includes("fair"))) {
            // Stars
            for (let i = 0; i < 50; i++) {
                newParticles.push({
                    id: i,
                    style: {
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${1 + Math.random() * 3}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        transform: `scale(${Math.random()})`
                    }
                })
            }
        }

        setParticles(newParticles)

    }, [weather])

    if (!weather) return null

    const cond = weather.condition.toLowerCase()

    // Rain
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-[1px] h-[20px] bg-blue-400/50"
                        style={{
                            ...p.style,
                            top: -20,
                            animation: 'fall linear infinite'
                        }}
                    />
                ))}
            </div>
        )
    }

    // Snow
    if (cond.includes("snow")) {
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                        style={{
                            ...p.style,
                            top: -10,
                            animation: 'fall linear infinite'
                        }}
                    />
                ))}
            </div>
        )
    }

    // Clouds
    if (cond.includes("cloud") || cond.includes("overcast") || cond.includes("fog")) {
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-0 w-64 h-32 bg-white/10 blur-3xl rounded-full animate-[float-cloud_20s_linear_infinite]" />
                <div className="absolute top-[20%] left-0 w-80 h-40 bg-white/10 blur-3xl rounded-full animate-[float-cloud_30s_linear_infinite]" style={{ animationDelay: '5s' }} />
                <div className="absolute top-[5%] left-0 w-48 h-24 bg-white/5 blur-3xl rounded-full animate-[float-cloud_25s_linear_infinite]" style={{ animationDelay: '10s' }} />
            </div>
        )
    }

    // Stars
    if (!weather.isDay && (cond.includes("clear") || cond.includes("fair"))) {
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-1 h-1 bg-white rounded-full bg-white/80 blur-[0.5px]"
                        style={{
                            ...p.style,
                            animation: 'twinkle linear infinite alternate'
                        }}
                    />
                ))}
            </div>
        )
    }

    // Sun / Clear Day
    if (weather.isDay && (cond.includes("clear") || cond.includes("sunny"))) {
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-start justify-end p-20">
                <div className="w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-[sun-pulse_4s_ease-in-out_infinite]" />
            </div>
        )
    }

    return null
}
