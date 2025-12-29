# Taapman - Smart Weather Forecasting 🌤️

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Taapman** is a next-generation weather dashboard built for the modern web. Unlike traditional weather apps, Taapman interprets weather data to provide actionable life hacks—telling you what to wear and what activities are best suited for the current conditions.

![Taapman Screenshot](public/screenshot.png) 
*(Screenshots coming soon)*

## ✨ Key Features

### 🌡️ Hyper-Local Weather
-   **Current Conditions**: Real-time temperature, "feels like" temp, humidity, wind, and visibility.
-   **5-Day Forecast**: Accurate daily predictions to help you plan your week.
-   **Sunrise/Sunset**: Dynamic tracking of daylight hours.

### 🧠 Smart Lifestyle Engine
-   **👕 Outfit Advisor**: A rule-based engine that recommends clothing combinations (e.g., "Hoodie + Jeans") based on temperature thresholds and precipitation presence.
-   **🌻 Garden Guru**: Provides smart gardening advice (e.g., "Water deeply", "Cover from frost") based on rain forecasts, temperature, and wind conditions.
-   **🏃 Activity Planner**: Calculates a 0-100 suitability score for activities like **Running**, **Cycling**, **Camping**, and **Stargazing** by analyzing wind speed, cloud cover, and rain probability.
-   **🌈 Dynamic Backgrounds**: Immersive gradients that change in real-time to reflect the weather (Sunny, Rainy, Snowy, Night).

### 💻 Modern Tech Features
-   **Global Search**: Instant city lookups via Open-Meteo Geocoding API.
-   **Auto-Location**: Geo-positioning integration using browser APIs and BigDataCloud reverse geocoding.
-   **Dark Mode**: Seamless day/night theming with generic system preference detection.

---

## 🏗️ Architecture & Project Structure

The project follows a clean, modular architecture with strict TypeScript typing.

```
taapman/
├── app/                  # App Router & Pages
│   └── page.tsx          # Main Dashboard
├── components/           # Reusable UI Components
│   ├── activity-planner.tsx # Activity scoring logic
│   ├── garden-guru.tsx      # Gardening advice engine
│   ├── outfit-advisor.tsx   # Clothing recommendation engine
│   ├── weather-background.tsx # Dynamic background engine
│   ├── weather-card.tsx     # Main weather display
│   ├── weather-icon.tsx     # Dynamic icon renderer
│   └── ui/               # Shadcn UI primitives
├── hooks/                # Custom React Hooks
│   └── use-weather.ts    # Centralized state & fetching logic
├── lib/                  # Utilities & Helpers
│   └── weather-utils.ts  # WMO code mapping
├── types/                # TypeScript Interfaces
│   └── weather.ts        # Data models
└── public/               # Static Assets
```

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router), React 19
-   **Language**: TypeScript for type safety
-   **Styling**: Tailwind CSS + Shadcn UI (Radix Primitives)
-   **Icons**: Lucide React
-   **Data Sources**:
    -   [Open-Meteo](https://open-meteo.com/): Weather data
    -   [BigDataCloud](https://www.bigdatacloud.com/): Reverse geocoding

---

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   npm, pnpm, or yarn

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/Priyanshug254/taapman.git
    cd taapman/tapman-weather-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **View App**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

This app is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect Next.js and deploy your app.

No environment variables are needed for the base version as it uses free, public APIs.

---

## 🤝 Contributing

We love contributions!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
