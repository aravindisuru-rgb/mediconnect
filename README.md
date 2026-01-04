# Digital Healthcare Ecosystem

A comprehensive healthcare platform integrating Patients, Doctors, Labs, and Pharmacies.

## Structure (Monorepo)

- **`apps/api`**: NestJS Backend API. Handles business logic, database connections, and security.
- **`apps/web`**: Next.js Web Portals. Served for Doctors, Laboratories, and Pharmacies.
- **`apps/patient-mobile`**: React Native (Expo) Mobile App. The primary interface for Patients (iOS/Android).

## getting Started

1.  Run `npm install` to install dependencies.
2.  Start the development environment:
    ```bash
    npx turbo dev
    ```

## Technology Stack

-   **Frontend**: React, Next.js, TailwindCSS
-   **Mobile**: React Native, Expo
-   **Backend**: NestJS, TypeScript
-   **Database**: PostgreSQL (Planned)
