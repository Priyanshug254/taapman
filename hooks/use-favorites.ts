"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem("taapman_favorites")
        if (saved) {
            setFavorites(JSON.parse(saved))
        }
    }, [])

    const toggleFavorite = (city: string) => {
        let newFavorites
        if (favorites.includes(city)) {
            newFavorites = favorites.filter(f => f !== city)
        } else {
            newFavorites = [...favorites, city]
        }
        setFavorites(newFavorites)
        localStorage.setItem("taapman_favorites", JSON.stringify(newFavorites))
    }

    const isFavorite = (city: string) => favorites.includes(city)

    return { favorites, toggleFavorite, isFavorite }
}
