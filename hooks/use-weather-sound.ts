"use client"

import { useState, useEffect, useRef } from 'react'
import { WeatherData } from '@/types/weather'

export function useWeatherSound(weather: WeatherData | null) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Sound mapping logic
    const getSoundUrl = (condition: string) => {
        const cond = condition.toLowerCase()
        if (cond.includes('rain') || cond.includes('drizzle')) return 'https://assets.mixkit.co/active_storage/sfx/2496/2496-preview.mp3' // Rain
        if (cond.includes('storm') || cond.includes('thunder')) return 'https://assets.mixkit.co/active_storage/sfx/1273/1273-preview.mp3' // Thunder
        if (cond.includes('wind')) return 'https://assets.mixkit.co/active_storage/sfx/1258/1258-preview.mp3' // Wind
        if (cond.includes('snow')) return 'https://assets.mixkit.co/active_storage/sfx/1131/1131-preview.mp3' // Snow/Ice wind
        if (cond.includes('cloud')) return '' // Silence for clouds? Or ambient city?
        if (cond.includes('clear') || cond.includes('sunny')) return 'https://assets.mixkit.co/active_storage/sfx/198/198-preview.mp3' // Birds/Nature
        return ''
    }

    useEffect(() => {
        if (!weather) return

        const soundUrl = getSoundUrl(weather.condition)

        if (soundUrl) {
            if (!audioRef.current) {
                audioRef.current = new Audio(soundUrl)
                audioRef.current.loop = true
            } else if (audioRef.current.src !== soundUrl) {
                // Change track
                const wasPlaying = !audioRef.current.paused
                audioRef.current.src = soundUrl
                if (wasPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
            }
        } else {
            // Stop if no sound for condition
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }

        // Volume control
        if (audioRef.current) {
            audioRef.current.volume = volume
        }

    }, [weather?.condition, volume])

    const toggleSound = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed)", e))
        }
        setIsPlaying(!isPlaying)
    }

    return { isPlaying, toggleSound, volume, setVolume }
}
