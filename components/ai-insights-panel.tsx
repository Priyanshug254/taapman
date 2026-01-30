"use client"

import { Card } from "@/components/ui/card"
import { WeatherData } from "@/types/weather"
import { generateAIInsights, AIInsight } from "@/lib/ai-insights"
import { Brain, AlertTriangle, Info, Activity, Heart } from "lucide-react"
import { useMemo } from "react"

interface AIInsightsPanelProps {
    weather: WeatherData
}

export function AIInsightsPanel({ weather }: AIInsightsPanelProps) {
    const insights = useMemo(() => generateAIInsights(weather), [weather])

    if (insights.length === 0) return null

    const getIcon = (insight: AIInsight) => {
        switch (insight.type) {
            case 'alert': return <AlertTriangle className="h-5 w-5" />
            case 'activity': return <Activity className="h-5 w-5" />
            case 'health': return <Heart className="h-5 w-5" />
            default: return <Info className="h-5 w-5" />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
            case 'warning': return 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
            default: return 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400'
        }
    }

    return (
        <Card className="p-6 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-lg lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Weather Insights</h3>
                <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                    Powered by Smart Analysis
                </span>
            </div>

            <div className="space-y-3">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${getSeverityColor(insight.severity)}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getIcon(insight)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{insight.icon}</span>
                                    <h4 className="font-bold text-sm">{insight.title}</h4>
                                </div>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    💡 Insights generated from real-time weather data analysis
                </p>
            </div>
        </Card>
    )
}
