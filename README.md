# Portfolio Management Dashboard

A full-stack portfolio management application with user authentication, portfolio overview with charts, transaction history, and investment management capabilities.

## Tech Stack

- Frontend: Next.js with TypeScript, Bootstrap 5, and Chart.js
- Backend: Node.js with Express and TypeScript
- Database: MongoDB
- Authentication: JWT
- Containerization: Docker and Docker Compose

## Features

- User Registration and Login (Auto-creates default portfolio)
- JWT-based Authentication
- Portfolio Management (Create multiple portfolios)
- Investment Tracking (Stocks and Mutual Funds)
- Transaction History
- Interactive Charts for Portfolio Visualization
- Asset Summary Dashboard with Performance Metrics
- Add/Edit/Delete Investments (Manage Investments page)

## Setup and Run

### Prerequisites

- Docker and Docker Compose installed

### Running the Project

1. Clone or navigate to the project directory
2. Run the following command to build and start all services:

```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5001
   - MongoDB: localhost:27017

**Note:** Docker will first try to build and start the services. If you get port conflicts, you can change the ports in docker-compose.yml to any available ports.

## Project Structure

- `frontend/`: Next.js application
- `backend/`: Node.js Express API with TypeScript
- `docker-compose.yml`: Orchestrates all services
- `Dockerfile`: Build instructions for each service

## Environment Variables

- Backend uses `MONGODB_URI`, `JWT_SECRET`, `PORT`
- Frontend uses `NEXT_PUBLIC_API_URL` for API endpoint

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `GET /api/portfolio`: Get user portfolios
- `POST /api/portfolio/create`: Create a new portfolio
- `POST /api/portfolio/add-investment`: Add investment to portfolio

## Previews
<img width="1440" height="726" alt="Screenshot 2025-11-26 at 6 56 42 PM" src="https://github.com/user-attachments/assets/96cac172-f2dc-4c52-b2ac-c725ad2f5848" /><img width="1440" height="718" alt="Screenshot 2025-11-26 at 7 00 35 PM" src="https://github.com/user-attachments/assets/a151ce3f-c3e9-4591-b326-c36be06f06d3" />
<img width="1440" height="719" alt="Screenshot 2025-11-26 at 7 00 14 PM" src="https://github.com/user-attachments/assets/55641f12-a567-4be3-9d62-746e64d3579e" />
<img width="1440" height="712" alt="Screenshot 2025-11-26 at 6 59 50 PM" src="https://github.com/user-attachments/assets/64f3c36c-27d0-4d89-8b0e-40ae499e7e13" />
<img width="1440" height="721" alt="Screenshot 2025-11-26 at 6 57 44 PM" src="https://github.com/user-attachments/assets/c9667947-c874-4a51-a511-7b7f581ff538" />
