"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface WeatherTrendsProps {
    weather: WeatherData
}

export function WeatherTrends({ weather }: WeatherTrendsProps) {
    if (!weather.hourly || weather.hourly.length === 0) return null

    // Prepare data for chart (take every 3rd hour for cleaner visualization)
    const chartData = weather.hourly
        .filter((_, index) => index % 3 === 0)
        .map(hour => ({
            time: hour.time,
            temperature: hour.temp,
            // Mock humidity data based on temperature (inverse relationship)
            humidity: Math.max(30, Math.min(90, 100 - hour.temp))
        }))

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Temperature & Humidity Trends</h3>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-300 dark:stroke-slate-700" opacity={0.3} />
                    <XAxis
                        dataKey="time"
                        className="text-xs"
                        stroke="currentColor"
                        tick={{ fill: 'currentColor' }}
                    />
                    <YAxis
                        yAxisId="temp"
                        className="text-xs"
                        stroke="currentColor"
                        tick={{ fill: 'currentColor' }}
                        label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis
                        yAxisId="humidity"
                        orientation="right"
                        className="text-xs"
                        stroke="currentColor"
                        tick={{ fill: 'currentColor' }}
                        label={{ value: '%', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px'
                        }}
                        labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Line
                        yAxisId="temp"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Temperature (°C)"
                    />
                    <Line
                        yAxisId="humidity"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Humidity (%)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}
