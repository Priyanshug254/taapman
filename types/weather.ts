export interface ForecastDay {
    day: string
    condition: string
    minTemp: number
    maxTemp: number
}

export interface WeatherData {
    city: string
    country: string
    temp: number
    feelsLike: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    sunrise: string
    sunset: string
    forecast: ForecastDay[]
    isDay: boolean
}
