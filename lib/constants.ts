export const WEATHER_THRESHOLDS = {
    TEMP: {
        FREEZING: 0,
        COLD: 5,
        CHILLY: 10,
        MILD: 15,
        WARM: 20,
        HOT: 25,
        VERY_HOT: 30,
    },
    WIND: {
        LIGHT: 15,
        MODERATE: 20,
        STRONG: 25,
        GALE: 30,
    },
    SCORES: {
        POOR: 50,
        GOOD: 80,
        MAX: 100,
    }
} as const
