# BarakahAid Admin Panel Documentation

## Overview
The Admin Panel is a modular React application designed to manage the BarakahAid platform. It serves as a centralized hub for managing users, donations, campaigns, requests, and viewing platform analytics.

Currently, the Admin Panel is **fully integrated** into the main Client application via lazy loading, providing a unified single-page application (SPA) experience.

## 🏗 Architecture

- **Tech Stack**: React, Redux Toolkit, Tailwind CSS, Recharts.
- **Integration Strategy**: The Admin Panel (`admin/`) acts as a "sub-module" loaded by the Client App (`client/`).
- **State Management**: Uses a dedicated Redux store (`admin/src/store`) separate from the Client store, but synchronized via `localStorage`.

## 🛠 Integration & Changes

To achieve seamless integration, several modifications were made across the codebase (Client, Server, and Admin).

### 1. Client Application (`client/`)
Key changes were made to the client to host and support the admin module:

*   **Routing (`src/App.jsx`)**:
    *   **Lazy Loading**: Imported the `AdminModule` using `React.lazy` to separate bundles.
    *   **Protected Route**: Added a `/admin/*` route guarded by `ProtectedRoute` (requiring 'admin' role).
    *   **Layout Logic**: Updated `Navbar` and `Footer` conditional rendering to **hide** public headers when visiting `/admin` routes (preventing double layouts).
*   **Authentication (`src/hooks/useAuth.js`)**:
    *   **Session Persistence**: Updated the `login` function to explicitly save the `user` object and `token` to `localStorage` upon successful login. This allows the Admin panel to pick up the session.
*   **Mock Data (`src/utils/dummyData.js`)**:
    *   **Admin User**: Verified/Updated credential `admin@barakahaid.com` for standardized access.
    *   **SSOT**: This file now serves as the **Single Source of Truth** for mock data for BOTH Client and Admin apps.

### 2. Server Application (`server/`)
The backend foundation for the admin panel has been established using NestJS:

*   **Admin Module (`src/admin/`)**:
    *   **Structure**: Created complete module structure with `dto/`, `guards/`, `decorators/`, `interfaces/`.
    *   **Controller**: `AdminController` with REST endpoints for specific admin operations.
    *   **Service**: `AdminService` designed to aggregate data from Users, Donations, and Campaigns services.
    *   **Security**: Implemented `RolesGuard` and `@Roles('ADMIN')` decorator to secure endpoints.
*   **App Module**: Registered `AdminModule` in `app.module.ts`.

### 3. Admin Module (`admin/`)
The admin panel itself is contained here:

*   **Entry Point (`src/AdminModule.jsx`)**: The wrapper component exported to the Client. It sets up the Admin Redux Provider and Router context.
*   **Layout (`src/layout/AdminLayout.jsx`)**:
    *   **Hydration**: Implemented a `useEffect` hook that reads the user from `localStorage` effectively "logging them in" to the Admin Redux store automatically.
    *   **Rendering**: Configured to properly render child routes from the integration point.
*   **Sidebar (`src/layout/AdminSidebar.jsx`)**:
    *   **Navigation**: Updated all menu links to use absolute paths (e.g., `/admin/users`) to ensure correct routing within the nested Client structure.
*   **Data Layer (`src/utils/api.js` & Store)**:
    *   **Mock Implementation**: To match the current Client-side "Demo" mode, the API layer intercepts requests and returns mock data from `client/src/utils/dummyData.js`.
    *   **Redux Slices**: All slices (`usersSlice`, `campaignsSlice`, etc.) are configured to import initial state from the Client's dummy data to ensure consistency.

## 🔐 Authentication Flow
1.  **Login**: User logs in on the Client's `/login` page (`admin@barakahaid.com` / `Admin123!`).
2.  **Redirect**: System detects 'admin' role and redirects to `/admin/dashboard`.
3.  **Hydration**: `AdminLayout` mounts, checks `localStorage` for the active token/user, and dispatches `setAdminData` to the Admin Store.
4.  **Access**: Admin is now authenticated within the Admin Module context.

## 🚀 How to Run
Since the panel is integrated, you simply run the client application:

```bash
# In the root directory (or /client)
npm run dev
```

*   **URL**: `http://localhost:5174` (or similar)
*   **Admin Path**: `http://localhost:5174/admin/dashboard`

## 📁 Project Structure (Admin)
```
admin/
├── src/
│   ├── components/    # Reusable UI components
│   ├── layout/        # Sidebar, Navbar, Footer
│   ├── pages/         # Dashboard and Management screens
│   ├── store/         # Redux slices (Admin, Users, etc.)
│   ├── utils/         # Helpers, API mock, Constants
│   ├── AdminModule.jsx # Integration Entry Point
│   └── App.jsx        # Standalone Entry Point (Unused in Integration)
```

## 🐛 Known Issues & Debugging

### ❗ White Screen / Blank Page Error
Currently, the admin panel may render as a **blank page** after login, despite the layout seemingly being fixed.

**Symptoms:**
*   Login is successful (redirects to `/admin/dashboard`).
*   URL changes correctly.
*   Page content is empty (white screen).

**Potential Causes & debugging paths:**

1.  **Redux Provider Isolation**:
    *   **Context**: `AdminModule.jsx` wraps itself in a *new* `<Provider store={adminStore}>`. This isolates the Admin Redux state from the Client Redux state.
    *   **Hypothesis**: If `AdminLayout` or `DashboardPage` relies on context from the *Client* app (e.g., `useAuth`, `BrowserRouter`, or shared Theme providers), the Admin Provider might be blocking/resetting that context.
    *   **Fix Attempt**: Ensure `AdminModule` either shares the main store OR explicitly re-initializes all necessary contexts.

2.  **Router Outlet vs Children**:
    *   **Context**: `AdminModule` defines `Routes` manually and passes them as children to `AdminLayout`.
    *   **Fix Applied**: `AdminLayout.jsx` was updated to render `{children}` instead of `<Outlet />`.
    *   **Check**: Verify if `react-router-dom` v6 allows nesting `Routes` inside another `Routes` component (from `App.jsx`) without an `Outlet` in the parent route configuration.

3.  **Runtime Crash (Silent)**:
    *   **Context**: If a component throws an error during render, React unmounts the tree (White Screen).
    *   **Debugging**: Check Browser Console (`Cmd+Option+J`) for "Minified React Error" or "Cannot read properties of undefined".
    *   **Suspects**: `useSelector` returning `undefined` for `dashboardStats` (if hydration failed/too slow) causing `variable.prop` access to throw.

4.  **Import/Dependency Issues**:
    *   **Context**: Admin slices import mock data.
    *   **Fix Applied**: Updated all slices to point to `client/src/utils/dummyData.js`.
    *   **Check**: Verify no circular dependencies or failed imports in the browser network tab.

### Future Fix Plan
1.  **Console Log Capture**: Run the app and check the console logs immediately upon white screen.
2.  **Error Boundary**: Wrap `AdminModule` in a React Error Boundary to catch and display the specific crash error.
3.  **Simplify**: Temporarily remove the specific `Provider` in `AdminModule` and try using the global store (merging reducers) to see if isolation is the cause.
