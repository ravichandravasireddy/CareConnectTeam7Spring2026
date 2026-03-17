# React Web App (Vite)

This project uses [Vite](https://vitejs.dev/) for fast development and optimized production builds.

## Project Structure & Scaffolding

### Initialized Project Structure

```
react_web_app/
├── public/                 # Static assets
│   ├── manifest.json
│   ├── offline.html
│   ├── robots.txt
│   └── service-worker.js
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx      # Main layout wrapper (renders Outlet for child routes)
│   │   ├── Layout.css
│   │   ├── OfflineBanner.jsx
│   │   ├── PageMeta.jsx
│   │   ├── PatientCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── TaskItem.jsx
│   │   ├── Icons.jsx
│   │   └── Button.css
│   ├── pages/              # Route-level page components
│   │   ├── Dashboard.jsx
│   │   ├── PatientDetails.jsx
│   │   ├── Messages.jsx
│   │   └── Login.jsx
│   ├── App.jsx             # Root app + routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
└── package.json
```

### Routing Setup

Routes are defined in `App.jsx` using React Router:

| Path | Component | Layout |
|------|-----------|--------|
| `/` | Dashboard | Layout |
| `/patient/:id` | PatientDetails | Layout |
| `/messages` | Messages | Layout |
| `/login` | Login | (standalone) |

The `Layout` component wraps Dashboard, PatientDetails, and Messages. Login renders without the layout.

### Layout Component (Rendered in Browser)

The `Layout` component (`src/components/Layout.jsx`) provides the shared shell for the app:

- **OfflineBanner** – Shown when network is unavailable
- **Skip link** – Accessibility: "Skip to main content"
- **Main** – Renders child route content via `<Outlet />`

Child routes (Dashboard, PatientDetails, Messages) render inside the `<main>` area. Run `npm run dev` and open http://localhost:5173 to see the Layout with Dashboard rendered.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `dist` folder.\
The build is minified and optimized for deployment.

### `npm run preview`

Serves the production build locally for testing before deployment.

### `npm test`

Launches the test runner (Vitest) in interactive watch mode.

### `npm run test:run`

Runs tests once without watch mode (useful for CI).

### `npm run test:ui`

Launches the Vitest UI for a visual test interface.

## Learn More

- [Vite documentation](https://vitejs.dev/)
- [React documentation](https://reactjs.org/)
