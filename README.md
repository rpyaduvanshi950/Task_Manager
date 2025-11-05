# Task Manager — Crazy App

A small React + Firebase example app for managing tasks with realtime sync.
This README explains what was done, the project structure, how to run the app locally, and notes about the "crazy" design choices.

## What this app does (short)
- Email/Google authentication via Firebase Auth (Login page).
- Protected dashboard (`/dashboard`) that shows the current user's tasks from Firestore.
- Create, update status, and delete tasks. Tasks are stored under `users/{uid}/tasks` in Firestore.
- Protected routes redirect to `/login` when unauthenticated.
- UI: Home, Login, Dashboard pages with Tailwind styles. Some pages use animated/gradient backgrounds and a dark theme.

Notable edits made in this repository (by recent changes):
- Task lanes (To do / Ongoing / Done columns) use a darker black background for contrast.
- Sign out is wired to navigate back to `/` (Home) after signing out.
- ProtectedRoute component redirects unauthenticated users to `/login` and preserves the original location in the `state.from` value.

## Project structure (key files)
- `index.html` — App entry HTML.
- `src/main.jsx` — App bootstrap; wraps the app with `BrowserRouter` and `AuthProvider`.
- `src/App.jsx` — Route definitions using react-router-dom v7.
- `src/routes/ProtectedRoute.jsx` — HOC component used to protect private routes.
- `src/context/AuthContext.jsx` — Authentication context; exposes `user`, `loading`, and `signOut`.
- `src/lib/firebase.js` — Firebase initialization (Auth + Firestore). Replace with your env variables if needed.

Pages
- `src/pages/Home.jsx` — Landing / marketing page with a call-to-action to log in.
- `src/pages/Login.jsx` — Login page with Google sign-in (uses Firebase Auth `signInWithPopup` / `signInWithRedirect`).
- `src/pages/Dashboard.jsx` — Main app; add tasks, change statuses, delete tasks. Contains Firestore listeners (`onSnapshot`) for realtime updates.

Assets & styling
- `src/index.css`, `src/App.css` and Tailwind config for CSS utilities.

## Quick start — run locally
Prerequisites
- Node.js (v18+ recommended) and npm.
- A Firebase project (optional if you keep the provided config, but recommended to replace with your own keys).

Install and run

```bash
# install deps
npm install

# start dev server
npm run dev
```

Open http://localhost:5173 (Vite default) in your browser.

## Firebase config
This project currently includes a firebase initialization in `src/lib/firebase.js`. The file contains an example/hardcoded config. For production or your own project, replace the config with environment variables. Example Vite env variables to use:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID (optional)

Then update `src/lib/firebase.js` to read from `import.meta.env.VITE_FIREBASE_API_KEY` etc. (There is already a commented block showing this.)

## Routes & behavior summary
- `/` — Home page.
- `/login` — Login page; supports Google sign-in.
- `/dashboard` — Protected route; requires authentication.

Protected route behavior
- If a user tries to visit a protected page while unauthenticated, they are redirected to `/login` and the original location is stored in `location.state.from`. After a successful sign-in the app should redirect back to the intended destination (this behavior is implemented in ProtectedRoute + Login when wired).

Sign out behavior
- From the Dashboard header the "Sign out" button signs the user out and (after the sign-out completes) navigates back to `/` (Home).

Data model (Firestore)
- Collection structure used by the app:
  - `users` (collection)
    - `{uid}` (document)
      - `tasks` (subcollection)
        - `{taskId}` (document) with fields like `title`, `status`, `createdAt`, `uid`, `ownerName`.

## Developer notes & improvements
- The UI uses TailwindCSS. Tweak classes in the component files for theme changes.
- Currently the repo contains a hardcoded Firebase config in `src/lib/firebase.js`. Move to env variables before sharing the repo publicly.
- Suggested next improvements (low-risk):
  - Reapply or ensure Login redirects back to the originally requested protected route after sign-in.
  - Add client-side input validation and friendly toasts for success/errors (e.g., task added, sign out successful/failed).
  - Add unit tests for components and an integration test for the route protection logic.
  - Add a small loader or disable the Add button while submitting to prevent duplicate tasks.

## Troubleshooting
- If the dev server exits with code 130 or is interrupted, re-run `npm run dev`.
- If Firebase auth or Firestore fails, verify your Firebase console rules and API keys.
- If you see `React Router` warnings, ensure you are using the expected `react-router-dom` version and that `BrowserRouter` wraps the app in `src/main.jsx`.

## How to contribute
- Make a feature branch, open a pull request against `main`, and include a brief description and screenshots if the change affects UI.

## License
This project is provided as-is for educational/demo purposes.

---
