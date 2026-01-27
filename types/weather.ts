export interface ForecastDay {
    day: string
    condition: string
    minTemp: number
    maxTemp: number
    rainProb: number
}

export interface HourlyForecast {
    time: string
    temp: number
    icon: string
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
    hourly: HourlyForecast[]
    isDay: boolean
    aqi?: number
}
