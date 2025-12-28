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
