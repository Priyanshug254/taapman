import { WeatherData } from "@/types/weather"

export interface AIInsight {
    type: 'recommendation' | 'alert' | 'activity' | 'health'
    title: string
    description: string
    icon: string
    severity: 'info' | 'warning' | 'critical'
}

export function generateAIInsights(weather: WeatherData): AIInsight[] {
    const insights: AIInsight[] = []
    const { temp, humidity, windSpeed, uvIndex, condition, pressure, aqi, isDay } = weather

    // Temperature-based insights
    if (temp > 35) {
        insights.push({
            type: 'health',
            title: 'Extreme Heat Warning',
            description: 'Stay hydrated and avoid prolonged outdoor exposure. Heat exhaustion risk is high.',
            icon: '🌡️',
            severity: 'critical'
        })
    } else if (temp > 28) {
        insights.push({
            type: 'recommendation',
            title: 'Hot Weather Advisory',
            description: 'Wear light, breathable clothing and use sunscreen. Stay in shaded areas when possible.',
            icon: '☀️',
            severity: 'warning'
        })
    } else if (temp < 5) {
        insights.push({
            type: 'health',
            title: 'Cold Weather Alert',
            description: 'Dress in layers and protect extremities. Hypothermia risk increases with wind chill.',
            icon: '🥶',
            severity: 'critical'
        })
    } else if (temp >= 15 && temp <= 25) {
        insights.push({
            type: 'activity',
            title: 'Perfect Outdoor Conditions',
            description: 'Ideal temperature for hiking, cycling, or outdoor photography. Make the most of it!',
            icon: '🌤️',
            severity: 'info'
        })
    }

    // UV Index insights
    if (uvIndex >= 8) {
        insights.push({
            type: 'health',
            title: 'Very High UV Exposure',
            description: 'Apply SPF 50+ sunscreen every 2 hours. Wear protective clothing and sunglasses.',
            icon: '🕶️',
            severity: 'warning'
        })
    }

    // Humidity insights
    if (humidity > 80) {
        insights.push({
            type: 'recommendation',
            title: 'High Humidity Detected',
            description: 'Feels warmer than actual temperature. Dehumidifiers recommended for indoor comfort.',
            icon: '💧',
            severity: 'info'
        })
    } else if (humidity < 30) {
        insights.push({
            type: 'health',
            title: 'Low Humidity Alert',
            description: 'Dry air may cause skin irritation and respiratory discomfort. Use moisturizers and humidifiers.',
            icon: '🏜️',
            severity: 'info'
        })
    }

    // Wind insights
    if (windSpeed > 50) {
        insights.push({
            type: 'alert',
            title: 'Strong Wind Warning',
            description: 'Avoid outdoor activities. Secure loose objects and stay away from trees.',
            icon: '💨',
            severity: 'critical'
        })
    } else if (windSpeed > 30) {
        insights.push({
            type: 'recommendation',
            title: 'Windy Conditions',
            description: 'Not ideal for drone flying or outdoor dining. Good for wind sports enthusiasts.',
            icon: '🌬️',
            severity: 'warning'
        })
    }

    // Air Quality insights
    if (aqi && aqi > 150) {
        insights.push({
            type: 'health',
            title: 'Unhealthy Air Quality',
            description: 'Limit outdoor activities. Sensitive groups should stay indoors with air purifiers.',
            icon: '😷',
            severity: 'critical'
        })
    } else if (aqi && aqi > 100) {
        insights.push({
            type: 'health',
            title: 'Moderate Air Quality',
            description: 'Sensitive individuals should reduce prolonged outdoor exertion.',
            icon: '🌫️',
            severity: 'warning'
        })
    }

    // Condition-based activity suggestions
    const cond = condition.toLowerCase()
    if (cond.includes('clear') && isDay) {
        insights.push({
            type: 'activity',
            title: 'Stargazing Tonight',
            description: 'Clear skies expected. Perfect conditions for astronomy and night photography.',
            icon: '🌟',
            severity: 'info'
        })
    }

    if (cond.includes('rain')) {
        insights.push({
            type: 'recommendation',
            title: 'Rainy Day Activities',
            description: 'Great time for indoor hobbies, museum visits, or cozy reading sessions.',
            icon: '☔',
            severity: 'info'
        })
    }

    if (cond.includes('snow')) {
        insights.push({
            type: 'activity',
            title: 'Winter Sports Opportunity',
            description: 'Fresh snow! Ideal for skiing, snowboarding, or building snowmen.',
            icon: '⛷️',
            severity: 'info'
        })
    }

    // Predictive insights based on pressure
    if (pressure < 1000) {
        insights.push({
            type: 'alert',
            title: 'Pressure Drop Detected',
            description: 'Weather may worsen soon. Rain or storms likely within 12-24 hours.',
            icon: '⚠️',
            severity: 'warning'
        })
    } else if (pressure > 1020) {
        insights.push({
            type: 'recommendation',
            title: 'Stable Weather Ahead',
            description: 'High pressure indicates clear, calm conditions will persist.',
            icon: '✨',
            severity: 'info'
        })
    }

    // Smart combinations
    if (temp >= 20 && temp <= 25 && humidity < 60 && windSpeed < 15 && !cond.includes('rain')) {
        insights.push({
            type: 'activity',
            title: 'Optimal Outdoor Exercise',
            description: 'Perfect conditions for running, cycling, or outdoor yoga. Temperature, humidity, and wind are ideal.',
            icon: '🏃',
            severity: 'info'
        })
    }

    return insights.slice(0, 5) // Limit to top 5 insights
}
