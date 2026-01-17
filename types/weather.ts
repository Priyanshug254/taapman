export interface ForecastDay {
    day: string
    condition: string
    minTemp: number
    maxTemp: number
    rainProb: number
}

export interface WeatherData {
    city: string
    country: string
    temp: number
    feelsLike: number
    condition: string
    humidity: number
    windSpeed: number
    windDirection: string
    visibility: number
    pressure: number
    uvIndex: number
    sunrise: string
    sunset: string
    lastUpdated: string
    forecast: ForecastDay[]
    isDay: boolean
    aqi?: number
}
