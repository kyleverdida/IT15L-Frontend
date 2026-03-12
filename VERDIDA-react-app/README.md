# UM EduFlow - Enrollment System Frontend

React + Vite frontend for the UM enrollment dashboard. This app is connected to a Laravel API with API key middleware and Sanctum auth.

## Features

- Secure login with validation, auth context, and protected routes
- Explicit input sanitization for auth fields before submit
- Session-aware dashboard access and logout flow
- Responsive dashboard layout (desktop and mobile)
- Interactive charts via Recharts:
	- Bar chart: monthly enrollment trends
	- Pie chart: course distribution
	- Line chart: attendance pattern
- Data fetching with loading states and error handling
- Error boundary fallback UI for runtime safety
- Program and subject listing/detail pages
- Production HTTPS enforcement for absolute API base URL

## Tech Stack

- React 19
- React Router 7
- Tailwind CSS 4
- Recharts
- Lucide React
- Vite

## Updated Project Structure

```text
src/
	api/
		apiService.js
		mockData.js
	components/
		auth/
			GuestRoute.jsx
			Login.jsx
			ProtectedRoute.jsx
		common/
			ErrorBoundary.jsx
			LoadingSpinner.jsx
			Navbar.jsx
		dashboard/
			AttendanceChart.jsx
			CourseDistributionChart.jsx
			Dashboard.jsx
			EnrollmentChart.jsx
		weather/
			ForecastDisplay.jsx
			WeatherWidget.jsx
		ChatBot.jsx
		FilterBar.jsx
		ProgramCard.jsx
		ProgramDetails.jsx
		ProgramList.jsx
		sidebar.jsx
		SubjectCard.jsx
		SubjectDetails.jsx
		SubjectList.jsx
	context/
		AuthContext.jsx
	layouts/
		DashboardLayout.jsx
	pages/
		dashboard.jsx
		login.jsx
		Students.jsx
	services/
		api.js
		weatherApi.js
```

## Prerequisites

- Node.js 18+
- npm 9+
- Laravel backend running and reachable from `VITE_API_URL`

## Frontend Setup (Detailed)

1. Install dependencies:

```bash
npm install
```

2. Create frontend env file:

```bash
cp .env.example .env
```

3. Set `.env` values:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_API_KEY=change-this-api-key
VITE_API_KEY_HEADER=X-API-Key

VITE_API_LOGIN_PATH=/login
VITE_API_ME_PATH=/me
VITE_API_LOGOUT_PATH=/logout

VITE_API_DASHBOARD_PATH=/dashboard
VITE_API_STUDENTS_PATH=/students
VITE_API_COURSES_PATH=/courses
VITE_API_SCHOOL_DAYS_PATH=/school-days

# Optional (leave blank to derive from /dashboard)
VITE_API_DASHBOARD_MONTHLY_ENROLLMENT_PATH=
VITE_API_DASHBOARD_COURSE_DISTRIBUTION_PATH=
VITE_API_DASHBOARD_ATTENDANCE_PATTERN_PATH=
```

Production security note:

- In production builds, absolute `VITE_API_URL` values must use `https://`.
- Relative `/api` is allowed for same-origin deployments behind HTTPS.

4. Start frontend:

```bash
npm run dev
```

5. Production checks:

```bash
npm run lint
npm run build
```

## Backend Route Contract (Laravel)

This frontend is mapped to the provided `routes/api.php`:

- `POST /api/login`
- `GET /api/me`
- `POST /api/logout`
- `GET /api/dashboard`
- `GET /api/students`
- `GET /api/courses`
- `GET /api/school-days`
- `GET /api/weather`
- `POST /api/students/{student}/courses/{course}`
- `DELETE /api/students/{student}/courses/{course}`

If your backend route names differ, override them in `.env` using `VITE_API_*_PATH` keys.

## Weather API Flow (Frontend <-> Backend)

The weather widget uses `src/services/weatherApi.js` and always calls the backend weather endpoint, not a third-party weather API directly from the browser.

### 1) Frontend request source

- `WeatherWidget` triggers requests from:
	- initial load (default city: `Tagum City`)
	- city search submit
	- `Use location` (browser geolocation)
- `WeatherWidget` calls:
	- `fetchWeather({ city, days })`
	- `fetchWeatherByCoordinates({ lat, lon, days })`

### 2) HTTP request built by frontend

- Endpoint: `GET {VITE_API_URL}/weather`
- Default query: `days=5`
- Query variants:
	- by city: `?city=Tagum%20City&days=5`
	- by coordinates: `?lat=7.4478&lon=125.8078&days=5`
- Headers sent:
	- `Accept: application/json`
	- `Authorization: Bearer <token>` (if user is logged in and token exists in localStorage session)
	- API key header from env (if set), default header name `X-API-KEY`

### 3) Backend response shape expected by frontend

The widget expects this JSON shape:

```json
{
	"data": {
		"location": { "name": "Tagum City" },
		"current": {
			"temperature_c": 31,
			"condition": "Partly cloudy",
			"humidity": 72,
			"wind_kph": 12
		},
		"forecast": [
			{
				"date": "2026-03-12",
				"icon": "https://...",
				"condition": "Cloudy",
				"max_temp_c": 32,
				"min_temp_c": 24,
				"humidity": 70,
				"max_wind_kph": 15
			}
		]
	},
	"meta": {
		"warning": "",
		"stale": false
	}
}
```

Frontend usage details:

- Current weather card reads `data.current.*`
- Forecast cards read `data.forecast[]`
- Optional cache warning reads `meta.stale`
- Optional advisory message reads `meta.warning`

### 4) Error handling behavior

- If backend returns non-2xx, frontend throws an error using backend `message` when available.
- Widget displays a user-friendly fallback (e.g., `Unable to load weather.`).
- If backend returns invalid JSON, frontend still fails safely with a generic message.

### 5) Backend requirements for compatibility

- Expose `GET /api/weather` under the same API base URL used by frontend.
- Return JSON (not HTML) for both success and error responses.
- Support either city query (`city`) or coordinate query (`lat`, `lon`) plus optional `days`.
- If API key middleware is enabled, accept the configured key header/value.
- If auth is required, accept Bearer token from login flow (Sanctum/token auth).

## Backend Setup Checklist (Laravel)

Use this checklist in your Laravel backend project before running the frontend.

1. Install backend dependencies:

```bash
composer install
```

2. Configure backend `.env`:

- Set database values (`DB_*`)
- Set API key for middleware (example):

```env
FRONTEND_API_KEY=change-this-api-key
```

- Ensure CORS allows frontend origin and credentials.

3. Generate app key (if needed):

```bash
php artisan key:generate
```

4. Run migrations and seeders:

```bash
php artisan migrate --seed
```

5. Verify Sanctum/auth setup:

- `auth:sanctum` middleware is active on protected routes.
- `me` and `logout` endpoints require authenticated token.
- Login endpoint returns token (`token` or `access_token`).

6. Start backend server:

```bash
php artisan serve
```

7. Quick API smoke test:

- `POST /api/login` with valid `X-API-Key` should return token.
- `GET /api/dashboard` with bearer token + API key should return dashboard payload.

## Troubleshooting

- `Invalid API key.`:
	- Check `VITE_API_KEY` matches backend `FRONTEND_API_KEY`
	- Check `VITE_API_KEY_HEADER` matches middleware header name
	- Restart Vite after editing `.env`

- `401 Unauthorized` on `/api/login`:
	- API key can be valid; credentials may be incorrect
	- Inspect Network response body to distinguish key vs credential errors

- Dashboard error boundary appears:
	- Open browser console and check failing request/shape
	- Verify backend returns expected JSON and not HTML error pages

- `Route [login] not defined` from protected endpoints:
	- Backend is using `auth:sanctum` without a named `login` route fallback in exception handling.
	- If this appears in a browser tab, test the same endpoint with API headers (`Accept: application/json`) to verify API behavior.
	- Add API unauthenticated JSON handling in Laravel `bootstrap/app.php` to return `401` JSON consistently.

- `.env` changes not applied:
	- Stop all Vite/node dev processes and run `npm run dev` again

## Today's Update (2026-03-10)

### Summary

- Reworked auth/session with Context API and route guards
- Modularized dashboard with dedicated chart components
- Connected frontend to Laravel API with API key + bearer auth handling
- Added explicit frontend input sanitization utility for auth fields
- Enforced HTTPS for absolute API base URL in production
- Added loading/error boundary primitives and responsive navbar/sidebar flow
- Replaced legacy weather/stat pieces with new weather service and components
- Improved pie chart fit and legend behavior for dense course labels

### Overall Summary 

The frontend now satisfies the core project requirements by using React functional components, hooks, protected routing, and context-based session management. The login flow validates and sanitizes user input, stores authenticated session data, and supports logout with automatic session cleanup on unauthorized responses. Dashboard analytics are rendered through responsive Recharts components (bar, pie, and line charts) with loading states, skeleton placeholders, error handling, and an application-level error boundary. API integration has been hardened with environment-based configuration, production HTTPS enforcement for absolute API URLs, and verified runtime communication against the Laravel backend.

### Summary

This project delivers a React frontend built with functional components, hooks, and Context API for authentication and session state. It implements a secure login page with validation and clear feedback, protected routes for dashboard access, logout functionality, and token-based API authentication. The dashboard presents interactive data visualizations using Recharts, including bar, pie, and line charts, and includes loading indicators, skeleton states, and error handling for asynchronous requests. The interface is responsive across desktop and mobile using Tailwind CSS and provides intuitive navigation through a sidebar and top navigation bar. Security-focused improvements include explicit input sanitization, environment-based API configuration, and production HTTPS enforcement for absolute API URLs. Integration with the Laravel backend has been validated through live endpoint checks showing expected unauthorized JSON responses for protected resources when no valid session is present.

### Live Backend Verification (2026-03-11)

- Direct backend smoke test succeeded at transport/application level:
	- `POST https://VERDIDA_IT15_ENROLLMENT_SYSTEM.test/api/login`
	- Response: `401` with JSON body `{"message":"Invalid credentials."}`
	- This confirms frontend/backend communication is working and requests are reaching Laravel.
- Protected endpoint now returns expected API auth response:
	- `GET https://VERDIDA_IT15_ENROLLMENT_SYSTEM.test/api/students` with API headers returns `401` with JSON body `{"message":"Unauthenticated."}`.
	- This confirms protected-route enforcement is working correctly for unauthenticated requests.
	- Note: opening protected API URLs directly in a browser tab may still render an HTML exception/debug page depending on backend debug settings.

### Added Files

- `.env`
- `src/components/auth/GuestRoute.jsx`
- `src/components/auth/Login.jsx`
- `src/components/auth/ProtectedRoute.jsx`
- `src/components/common/ErrorBoundary.jsx`
- `src/components/common/LoadingSpinner.jsx`
- `src/components/common/Navbar.jsx`
- `src/components/dashboard/AttendanceChart.jsx`
- `src/components/dashboard/CourseDistributionChart.jsx`
- `src/components/dashboard/Dashboard.jsx`
- `src/components/dashboard/EnrollmentChart.jsx`
- `src/components/weather/ForecastDisplay.jsx`
- `src/components/weather/WeatherWidget.jsx`
- `src/context/AuthContext.jsx`
- `src/services/api.js`
- `src/services/weatherApi.js`

### Modified Files

- `.env.example`
- `src/App.css`
- `src/App.jsx`
- `src/api/apiService.js`
- `src/components/ProgramList.jsx`
- `src/components/SubjectList.jsx`
- `src/components/sidebar.jsx`
- `src/layouts/DashboardLayout.jsx`
- `src/pages/dashboard.jsx`
- `src/pages/login.jsx`

### Removed Files

- `src/components/StatWidget.jsx`
- `src/components/WeatherWidget.jsx`
- `src/hooks/useWeather.js`
- `src/pages/Enrollment.jsx`
- `src/pages/Reports.jsx`
- `src/pages/Settings.jsx`
