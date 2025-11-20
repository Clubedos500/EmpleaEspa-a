# EmpleaEspaña - Job Portal Platform

A comprehensive, GDPR-compliant job search platform tailored for the Spanish market, featuring specific workflows for minors (16-17 years old), role-based access, and advanced job matching.

## Architecture

The system follows a modular architecture:

1.  **Frontend**: React 18 + TypeScript + Tailwind CSS (Single Page Application).
2.  **Backend Core**: Java Spring Boot (Authentication, Job Management, Compliance).
3.  **ML Service**: Python FastAPI (CV Parsing, Recommendation Engine).
4.  **Infrastructure**: Docker, PostgreSQL, Redis, ElasticSearch.

## Features

-   **Role-Based Access**: Candidates, Employers, Admins.
-   **Minor Protection**:
    -   Automatic age calculation.
    -   Restriction on night shifts/hazardous jobs for users < 18.
    -   Parental consent upload flow (Mocked in frontend, enforced in backend).
-   **Search**: Full-text search filtered by location (Provinces).
-   **Compliance**: GDPR consent tracking, privacy-first design.

## Getting Started

### Prerequisites

-   Node.js 18+
-   Docker & Docker Compose

### Running locally

1.  **Frontend (Standalone Demo)**
    ```bash
    npm install
    npm start
    ```
    The frontend includes a `mockBackend.ts` service layer that simulates API latency and database operations, allowing you to test the full UI flow (Login, Search, Apply, Consent Upload) without spinning up the heavy backend containers.

2.  **Full Infrastructure (Docker)**
    ```bash
    docker-compose up -d
    ```
    This starts PostgreSQL, Redis, RabbitMQ, and placeholders for the Java/Python services.

## Project Structure

-   `src/components`: Reusable UI components (Tailwind).
-   `src/pages`: Route views.
-   `src/services`: API abstraction layer (swappable between Mock and Real REST).
-   `src/types`: Shared TypeScript interfaces.

## Security & GDPR

-   **Minors**: Data for minors is flagged. Parental consent files are stored in S3 (simulated) with strict ACLs.
-   **Auth**: JWT based (simulated in mock).
-   **Logs**: PII is stripped from logs.

## Testing

To run the frontend test suite (Jest/Vitest):
```bash
npm test
```
