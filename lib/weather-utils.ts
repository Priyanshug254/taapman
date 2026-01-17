export const mapWeatherCode = (code: number): string => {
    if (code === 0) return "Clear"
    if (code === 1 || code === 2 || code === 3) return "Cloudy"
    if (code >= 45 && code <= 48) return "Cloudy"
    if (code >= 51 && code <= 67) return "Rainy"
    if (code >= 71 && code <= 77) return "Snowy"
    if (code >= 80 && code <= 82) return "Rainy"
    if (code >= 85 && code <= 86) return "Snowy"
    if (code >= 95 && code <= 99) return "Rainy"
    return "Clear"
}

export function getWindDirection(degrees: number): string {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8
    return directions[index]
}

export function getAQIStatus(aqi: number) {
    if (aqi <= 20) return { status: "Good", color: "text-emerald-500", bgColor: "bg-emerald-500/10" }
    if (aqi <= 40) return { status: "Fair", color: "text-sky-500", bgColor: "bg-sky-500/10" }
    if (aqi <= 60) return { status: "Moderate", color: "text-yellow-500", bgColor: "bg-yellow-500/10" }
    if (aqi <= 80) return { status: "Poor", color: "text-orange-500", bgColor: "bg-orange-500/10" }
    return { status: "Very Poor", color: "text-red-500", bgColor: "bg-red-500/10" }
}

