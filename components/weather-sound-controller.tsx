"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX } from "lucide-react"
import { useWeatherSound } from "@/hooks/use-weather-sound"
import { WeatherData } from "@/types/weather"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function WeatherSoundController({ weather }: { weather: WeatherData }) {
    const { isPlaying, toggleSound, volume, setVolume } = useWeatherSound(weather)

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/20 hover:scale-105 transition-transform"
                        onClick={toggleSound}
                    >
                        {isPlaying ? <Volume2 className="h-6 w-6 text-sky-500" /> : <VolumeX className="h-6 w-6 text-slate-500" />}
                    </Button>
                </PopoverTrigger>
                {isPlaying && (
                    <PopoverContent side="top" className="w-40 p-3 mb-2 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Volume</span>
                                <span>{Math.round(volume * 100)}%</span>
                            </div>
                            <Slider
                                value={[volume]}
                                max={1}
                                step={0.01}
                                onValueChange={(val) => setVolume(val[0])}
                                className="cursor-pointer"
                            />
                        </div>
                    </PopoverContent>
                )}
            </Popover>
        </div>
    )
}
