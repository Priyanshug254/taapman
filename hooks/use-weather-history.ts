"use client"

import { useState, useEffect } from "react"

interface WeatherHistoryItem {
    city: string
    temp: number
    condition: string
    timestamp: number
}

export function useWeatherHistory() {
    const [history, setHistory] = useState<WeatherHistoryItem[]>([])

    useEffect(() => {
        const saved = localStorage.getItem("taapman_weather_history")
        if (saved) {
            setHistory(JSON.parse(saved))
        }
    }, [])

    const addToHistory = (city: string, temp: number, condition: string) => {
        const newItem: WeatherHistoryItem = {
            city,
            temp,
            condition,
            timestamp: Date.now()
        }

        // Keep only last 10 searches, avoid duplicates
        const filtered = history.filter(item => item.city.toLowerCase() !== city.toLowerCase())
        const newHistory = [newItem, ...filtered].slice(0, 10)

        setHistory(newHistory)
        localStorage.setItem("taapman_weather_history", JSON.stringify(newHistory))
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem("taapman_weather_history")
    }

    return { history, addToHistory, clearHistory }
}
