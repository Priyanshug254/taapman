import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react"

interface WeatherIconProps {
    condition: string
    className?: string
}

export function WeatherIcon({ condition, className }: WeatherIconProps) {
    switch (condition.toLowerCase()) {
        case "clear":
            return <Sun className={className} />
        case "cloudy":
            return <Cloud className={className} />
        case "rainy":
            return <CloudRain className={className} />
        case "snowy":
            return <CloudSnow className={className} />
        default:
            return <Sun className={className} />
    }
}
