# EduFlow - Enrollment System Frontend

A modern React-based frontend prototype for an **Integrative Programming Enrollment System**. Built with Vite, Tailwind CSS, Recharts, and React Router. Designed for future Laravel REST API integration.

## Features

- **Login Page** – Dark glassmorphism design, no backend required (demo mode)
- **Dashboard** – Overview widgets, enrollment trends chart, course distribution pie chart, weekly activity bar chart
- **Weather** – Live weather for Tagum City via [Open-Meteo API](https://open-meteo.com) (no API key)
- **Chatbot** – EduBot helper with mock responses (enrollment, courses)
- **Navigation** – Students, Courses, Enrollment, Reports, Settings
- **Mock Data** – Structured for Laravel API response format
- **Responsive** – Mobile sidebar, tablet & desktop layouts

## Project Structure

```
src/
├── api/           # Mock data & API service (Laravel-ready)
├── components/    # StatWidget, WeatherWidget, ChatBot, Sidebar
├── hooks/         # useWeather (weather API)
├── layouts/       # DashboardLayout
└── pages/         # Login, Dashboard, Students, Courses, Enrollment, Reports, Settings
```

## Quick Start

```bash
npm install
npm run dev
```

## Laravel Integration

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL=http://your-laravel-host/api`
3. Replace mock calls in `src/api/apiService.js` with `fetch`/axios to your endpoints
4. Mock data shape matches Laravel Resource conventions (`data`, `meta`, etc.)

## Tech Stack

- React 19, React Router 7
- Tailwind CSS 4
- Recharts
- Lucide React Icons

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
