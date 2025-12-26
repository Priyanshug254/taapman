# Taapman - Smart Weather Forecasting

Taapman is a modern, feature-rich weather application built with Next.js and Tailwind CSS. It goes beyond simple forecasting by providing lifestyle-oriented insights like outfit suggestions and activity planning based on real-time weather conditions.

![Taapman Screenshot](public/screenshot.png) 
*(Note: You can add a screenshot here later)*

## 🌟 Features

-   **Real-time Weather**: Accurate current weather data including temperature, humidity, wind speed, and pressure.
-   **5-Day Forecast**: Plan ahead with a detailed 5-day weather outlook.
-   **👕 Smart Outfit Advisor**: Intelligent clothing suggestions based on temperature, rain, and wind conditions.
-   **🏃 Activity Planner**: Suitability ratings for outdoor activities like Running, Cycling, Camping, and Stargazing.
-   **🌍 Global Search**: Search for weather in any city worldwide.
-   **📍 Auto-Location**: One-click "Use My Location" feature.
-   **dark Mode**: Fully responsive dark mode support for comfortable viewing at night.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Components**: [Radix UI](https://www.radix-ui.com/) (via shadcn/ui)
-   **Data Provider**: [Open-Meteo API](https://open-meteo.com/) (No API key required!)

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites

-   Node.js 18+ installed
-   npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Priyanshug254/taapman.git
    cd taapman/tapman-weather-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## 📁 Project Structure

-   `app/`: Main application code (App Router).
    -   `page.tsx`: The main dashboard page.
-   `components/`: Reusable UI components.
    -   `outfit-advisor.tsx`: Logic for clothing suggestions.
    -   `activity-planner.tsx`: Logic for activity suitability.
    -   `ui/`: Base UI components (buttons, cards, etc.).
-   `public/`: Static assets.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is open-source and available under the MIT License.
