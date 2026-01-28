export const weatherTrivia = {
    temperature: {
        hot: [
            "The hottest temperature ever recorded on Earth was 134°F (56.7°C) in Death Valley, California!",
            "Your body cools itself by sweating - you can lose up to 1.5 liters of water per hour in extreme heat.",
            "Hot weather makes your heart work harder - it beats 10-15 times more per minute in high temperatures."
        ],
        cold: [
            "The coldest temperature ever recorded was -128.6°F (-89.2°C) in Antarctica!",
            "Snow isn't actually white - it's translucent! It appears white because it reflects all light wavelengths.",
            "You lose 40-45% of your body heat through your head in cold weather."
        ],
        moderate: [
            "The perfect temperature for human productivity is around 70°F (21°C).",
            "Weather affects your mood - sunny days increase serotonin production in your brain!",
            "Temperature can affect how fast your nails grow - they grow faster in warm weather."
        ]
    },
    seasonal: {
        spring: [
            "🌱 Perfect time to plant tomatoes, peppers, and herbs!",
            "🌸 Spring allergies? Local honey can help build immunity.",
            "🏃 Best season for outdoor cardio - temperatures are ideal for exercise."
        ],
        summer: [
            "☀️ Apply sunscreen 30 minutes before going outside for maximum protection.",
            "💧 Drink water before you feel thirsty - thirst means you're already dehydrated.",
            "🌿 Water your garden early morning or late evening to prevent evaporation."
        ],
        fall: [
            "🍂 Perfect weather for hiking - cooler temps and beautiful foliage!",
            "🎃 Great time to plant garlic and onions for next year's harvest.",
            "🧥 Layer up! Temperature swings are common in autumn."
        ],
        winter: [
            "❄️ Keep your car's gas tank at least half full to prevent fuel line freeze.",
            "🏠 Open curtains during the day to let sunlight warm your home naturally.",
            "☕ Hot drinks actually help you cool down by triggering sweat response."
        ]
    },
    conditions: {
        rain: [
            "The smell of rain is called 'petrichor' - it comes from oils released by plants!",
            "Raindrops aren't actually tear-shaped - they're more like hamburger buns.",
            "Rain can fall at speeds up to 20 mph depending on drop size."
        ],
        sunny: [
            "Just 10-15 minutes of sunlight helps your body produce vitamin D!",
            "Sunlight can improve your sleep quality by regulating circadian rhythms.",
            "Solar panels work best on clear, cool days - not necessarily the hottest ones."
        ],
        cloudy: [
            "Clouds are made of tiny water droplets - a single cloud can weigh over a million pounds!",
            "Cloudy days are perfect for photography - diffused light reduces harsh shadows.",
            "Plants can still photosynthesize on cloudy days - they need light, not direct sun."
        ],
        snow: [
            "No two snowflakes are exactly alike - each has a unique crystal structure!",
            "Snow is an excellent insulator - igloos can be 100°F warmer inside than outside.",
            "Fresh snow can absorb sound, making everything seem quieter."
        ]
    }
}

export function getWeatherTip(temp: number, condition: string): string {
    const cond = condition.toLowerCase()
    const month = new Date().getMonth()

    // Seasonal tips
    let season: 'spring' | 'summer' | 'fall' | 'winter'
    if (month >= 2 && month <= 4) season = 'spring'
    else if (month >= 5 && month <= 7) season = 'summer'
    else if (month >= 8 && month <= 10) season = 'fall'
    else season = 'winter'

    // Condition-based trivia
    if (cond.includes('rain')) {
        return weatherTrivia.conditions.rain[Math.floor(Math.random() * weatherTrivia.conditions.rain.length)]
    } else if (cond.includes('snow')) {
        return weatherTrivia.conditions.snow[Math.floor(Math.random() * weatherTrivia.conditions.snow.length)]
    } else if (cond.includes('cloud')) {
        return weatherTrivia.conditions.cloudy[Math.floor(Math.random() * weatherTrivia.conditions.cloudy.length)]
    } else if (cond.includes('clear') || cond.includes('sunny')) {
        return weatherTrivia.conditions.sunny[Math.floor(Math.random() * weatherTrivia.conditions.sunny.length)]
    }

    // Temperature-based trivia
    if (temp > 30) {
        return weatherTrivia.temperature.hot[Math.floor(Math.random() * weatherTrivia.temperature.hot.length)]
    } else if (temp < 10) {
        return weatherTrivia.temperature.cold[Math.floor(Math.random() * weatherTrivia.temperature.cold.length)]
    }

    // Seasonal tip as fallback
    return weatherTrivia.seasonal[season][Math.floor(Math.random() * weatherTrivia.seasonal[season].length)]
}
