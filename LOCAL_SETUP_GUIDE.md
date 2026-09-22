# OuTuoLu Local Setup & Testing Guide

This guide details how to set up, run, and test every component of the OuTuoLu project locally on Windows.

## Prerequisites

Ensure you have the following installed:
*   **Git**: Version control.
*   **Node.js** (v18+): For Web and Infra tools.
*   **Flutter SDK** (3.10+): For Mobile App.
*   **JDK 17+**: For Backend (Kotlin/Spring Boot).
*   **Docker Desktop**: For Database and Infrastructure.
*   **WeChat DevTools**: For Mini Program.
*   **VS Code** or **IntelliJ IDEA**: Recommended IDEs.

---

## 1. Infrastructure & Database (Start Here)

We use **Supabase** (PostgreSQL) and **Docker** for local infrastructure.

### Setup
1.  Navigate to the infra directory:
    ```powershell
    cd infra
    ```
2.  Start services using Docker Compose:
    ```powershell
    docker-compose up -d
    ```
    *   *Alternatively, if using Supabase CLI:* `npx supabase start`

### Verification
*   Check if containers are running: `docker ps`
*   Access Supabase Studio (if running locally via CLI) usually at `http://localhost:54323`.

---

## 2. Backend (Spring Boot)

The core API service.

### Setup
1.  Navigate to the backend directory:
    ```powershell
    cd backend
    ```
2.  Build the project (this downloads dependencies):
    ```powershell
    .\gradlew.bat build
    ```

### Run
*   Start the server:
    ```powershell
    .\gradlew.bat bootRun
    ```
*   Server usually starts on `http://localhost:8080`.

### Testing
*   **Health Check**: Open browser to `http://localhost:8080/actuator/health` (if enabled) or try a basic API endpoint.

---

## 3. Web Application (React/Vite)

The web interface for users.

### Setup
1.  Navigate to the web directory:
    ```powershell
    cd web
    ```
2.  Install dependencies:
    ```powershell
    npm install
    ```
3.  **Environment Variables**:
    *   Create a `.env` file in `web/` based on `.env.example` (if available).
    *   Add your Supabase URL and Anon Key.

### Run
*   Start the development server:
    ```powershell
    npm run dev
    ```
*   Access at `http://localhost:5173`.

---

## 4. Mobile App (Flutter)

iOS and Android application.

### Setup
1.  Navigate to the mobile directory:
    ```powershell
    cd mobile
    ```
2.  Install dependencies:
    ```powershell
    flutter pub get
    ```

### Run
*   Ensure an emulator is running or a device is connected.
*   Start the app:
    ```powershell
    flutter run
    ```

---

## 5. WeChat Mini Program

Native WeChat experience.

### Setup & Run
1.  Open **WeChat DevTools**.
2.  Click "Import Project" (or "+").
3.  Select the `wechat` directory: `D:\testProejekt\apps\otulu\otulu\wechat`.
4.  Set the AppID (use Test AppID if you don't have one).
5.  The project will compile and open in the simulator.

---

## Troubleshooting

*   **Port Conflicts**: Ensure ports 8080 (Backend), 5173 (Web), and 5432 (Postgres) are free.
*   **Dependency Errors**: Try deleting `node_modules` or `.gradle` caches and reinstalling.
