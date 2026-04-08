# Task Manager API

A robust RESTful API for task management, developed with a strong focus on best practices, scalability, and strict typing. This project is part of my Full-Stack development portfolio.

## 🚀 Technologies & Tools

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/)
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** [Vitest](https://vitest.dev/) & Supertest (E2E Tests)
- **Documentation:** Swagger (OpenAPI)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose

## ✨ Key Features

- **Authentication & Authorization:** Secure login with JWT. Password hashing using bcrypt.
- **User Management:** Complete CRUD operations for users.
- **Task Management:** Complete CRUD operations for tasks. Tasks are strictly linked to the authenticated user.
- **Pagination:** Built-in pagination and metadata for listing tasks.
- **Data Validation:** Strict input validation and error handling using Zod schemas.
- **Interactive Documentation:** Swagger UI integrated for easy API exploration and testing.
- **Automated Testing:** End-to-End (E2E) testing suite ensuring API reliability.

## 🏗️ Architecture

The application is fully containerized. It uses Docker Compose to orchestrate both the Node.js API and the PostgreSQL database seamlessly. Prisma acts as the bridge between the application and the database, ensuring consistent and safe data migrations.

## 🛠️ How to Run the Project

Since the application is fully Dockerized, getting it up and running is incredibly simple.

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

### Step-by-Step

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/DamiloW/task-manager-api.git](https://github.com/DamiloW/task-manager-api.git)
   cd task-manager-api

2. **Set up environment variables:**
Create a .env file in the root directory and add your secret keys (you can use .env.example if available):
    DATABASE_URL="postgresql://admin:password123@db:5432/task_manager?schema=public"
    JWT_SECRET="your_super_secret_jwt_key"

3. **Build and start the containers:**
    docker compose up --build

4. **Access the API:**
    Base URL: http://localhost:3000
    Swagger Documentation: http://localhost:3000/api-docs

5. **🧪 How to Run Tests**
To run the automated E2E test suite locally (requires Node.js):

**🗺️ Project Roadmap (Completed)**

[x] Complete User CRUD.
[x] Complete Task CRUD with pagination.
[x] Data validation with Zod.
[x] JWT Authentication & Route protection.
[x] Automated E2E Testing with Vitest.
[x] Interactive API Documentation with Swagger.
[x] Full Docker containerization (API + Database).

Developed by Damilo Queiroz - [LinkedIn](https://www.linkedin.com/in/damiloqueiroz/)