"use client"

import { WeatherData } from "@/types/weather"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Info, Flame, CloudSnow, CloudRain, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface SafetyGuideModalProps {
    weather: WeatherData
}

export function SafetyGuideModal({ weather }: SafetyGuideModalProps) {
    const [tips, setTips] = useState<{ title: string; icon: any; items: string[] } | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const cond = weather.condition.toLowerCase()
        const temp = weather.temp

        if (cond.includes('storm') || cond.includes('thunder')) {
            setTips({
                title: "Thunderstorm Safety",
                icon: Zap,
                items: [
                    "Seek shelter indoors immediately.",
                    "Avoid windows and doors.",
                    "Do not use electrical appliances.",
                    "If outside, avoid open fields and tall trees."
                ]
            })
        } else if (cond.includes('rain') && (weather.windSpeed > 30 || temp < 10)) {
            setTips({
                title: "Heavy Rain / Flood Safety",
                icon: CloudRain,
                items: [
                    "Avoid walking or driving through flood waters.",
                    "Move to higher ground if necessary.",
                    "Stay away from power lines.",
                    "Monitor local news for updates."
                ]
            })
        } else if (cond.includes('snow') || cond.includes('blizzard')) {
            setTips({
                title: "Blizzard / Snow Safety",
                icon: CloudSnow,
                items: [
                    "Stay indoors and keep warm.",
                    "Cover windows with blankets at night.",
                    "Keep dry supplies of food and water.",
                    "Watch for signs of hypothermia."
                ]
            })
        } else if (temp > 35) {
            setTips({
                title: "Extreme Heat Safety",
                icon: Flame,
                items: [
                    "Stay hydrated; drink plenty of water.",
                    "Stay indoors during midday sun.",
                    "Wear lightweight, light-colored clothing.",
                    "Check on elderly neighbors and pets."
                ]
            })
        } else {
            setTips(null)
        }
    }, [weather])

    if (!tips) return null

    const Icon = tips.icon

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="fixed bottom-24 left-6 z-50 rounded-full h-12 w-12 shadow-lg animate-bounce"
                    title="Severe Weather Safety Tips"
                >
                    <ShieldAlert className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-red-500/50">
                <DialogHeader>
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <Icon className="h-8 w-8" />
                        <DialogTitle>{tips.title}</DialogTitle>
                    </div>
                    <DialogDescription>
                        Safety precautions for current conditions in {weather.city}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <ul className="space-y-3">
                        {tips.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Info className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-xs text-center text-red-600 dark:text-red-400 mt-4">
                        Always follow official guidance from local authorities.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
