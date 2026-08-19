# Week 8 — Authenticated Tasks API

A RESTful Task Management API built with **NestJS, TypeScript, PostgreSQL, TypeORM, JWT Authentication, and bcrypt**.

This project extends the previous Task Management API by introducing **user authentication, password hashing, JWT-based authorization, protected task operations, filtering, relationships, validation, centralized error handling, and automated testing**.

---

## 📌 Project Overview

The Week 8 project focuses on building a secure and authenticated backend API.

The API provides:

- User management
- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- Protected task creation
- Protected task updates
- Protected task deletion
- Authenticated user access
- Project management
- Task filtering
- Task relationships
- Tag relationships
- DTO validation
- Centralized HTTP exception handling
- PostgreSQL database integration
- TypeORM migrations
- Unit testing
- End-to-end testing

---

## 🚀 Tech Stack

- **NestJS**
- **TypeScript**
- **Node.js**
- **PostgreSQL**
- **TypeORM**
- **JWT**
- **Passport**
- **bcrypt**
- **class-validator**
- **class-transformer**
- **Jest**
- **Supertest**
- **ESLint**
- **Prettier**
- **Git & GitHub**

---

## ✨ Features

### Authentication

The API supports secure user authentication using:

- User registration
- User login
- Email-based authentication
- Password hashing
- Password verification
- JWT access tokens
- JWT protected routes
- Current authenticated user access

### Password Security

Passwords are never stored as plain text.

During registration:

1. The user provides a password.
2. The password is hashed using `bcrypt`.
3. Only the hashed password is stored in PostgreSQL.

During login:

1. The user provides email and password.
2. The user is searched by email.
3. The password hash is retrieved securely.
4. `bcrypt.compare()` verifies the password.
5. A JWT access token is generated after successful authentication.

The API does not return user passwords in normal user responses.

### JWT Authorization

Authenticated requests use the following HTTP header:

```text
Authorization: Bearer <access_token>
```

Protected endpoints reject requests that do not contain a valid JWT.

### Task Management

The API supports:

- Create task
- Get all tasks
- Get task by ID
- Update task
- Delete task
- Assign task to a user
- Attach task to a project
- Attach tags to tasks

### Task Filtering

Tasks can be filtered using query parameters:

- `status`
- `projectId`
- `assigneeId`

Multiple filters can be combined.

Example:

```text
GET /tasks?status=todo&projectId=1&assigneeId=1
```

### Relationships

The application demonstrates relational database concepts including:

- User → Projects
- User → Assigned Tasks
- Project → Tasks
- Task → Project
- Task → Assignee
- Task → Tags
- Many-to-many relationship between Tasks and Tags

---

## 🔐 Authentication Flow

### 1. Register

A user registers using:

```http
POST /auth/register
```

Example request:

```json
{
  "name": "Haris",
  "email": "haris@example.com",
  "password": "password123"
}
```

The password is hashed before being stored.

Example response:

```json
{
  "id": 6,
  "name": "Haris",
  "email": "haris@example.com",
  "createdAt": "2026-08-18T07:08:49.545Z"
}
```

The password is not returned.

---

### 2. Login

Login endpoint:

```http
POST /auth/login
```

Example request:

```json
{
  "email": "haris@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "access_token": "<JWT_TOKEN>"
}
```

---

### 3. Access Protected Routes

Use the returned JWT in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Example:

```http
POST /tasks
Authorization: Bearer <JWT_TOKEN>
```

Without a valid token, protected routes return:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 👤 Current User

The project includes a custom `@CurrentUser()` decorator.

It retrieves the authenticated user from the request after JWT authentication.

Example:

```typescript
@CurrentUser() user
```

The authenticated user information comes from the JWT authentication process.

---

## 🔑 JWT Payload

The JWT payload contains:

```typescript
{
  sub: user.id,
  email: user.email
}
```

Where:

- `sub` represents the authenticated user's ID.
- `email` represents the authenticated user's email.

---

## 🛡️ Protected Task Operations

The following task operations require authentication:

```http
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

Unauthenticated requests are rejected with HTTP `401 Unauthorized`.

---

## 📋 API Endpoints

### Authentication

| Method | Endpoint         | Authentication | Description           |
| ------ | ---------------- | -------------- | --------------------- |
| POST   | `/auth/register` | No             | Register a new user   |
| POST   | `/auth/login`    | No             | Login and receive JWT |

---

### Users

| Method | Endpoint     | Authentication | Description    |
| ------ | ------------ | -------------- | -------------- |
| GET    | `/users`     | No             | Get all users  |
| GET    | `/users/:id` | No             | Get user by ID |

---

### Projects

| Method | Endpoint        | Authentication | Description       |
| ------ | --------------- | -------------- | ----------------- |
| GET    | `/projects`     | No             | Get all projects  |
| GET    | `/projects/:id` | No             | Get project by ID |

---

### Tasks

| Method | Endpoint     | Authentication | Description    |
| ------ | ------------ | -------------- | -------------- |
| GET    | `/tasks`     | No             | Get all tasks  |
| GET    | `/tasks/:id` | No             | Get task by ID |
| POST   | `/tasks`     | Yes            | Create a task  |
| PATCH  | `/tasks/:id` | Yes            | Update a task  |
| DELETE | `/tasks/:id` | Yes            | Delete a task  |

---

## 🔎 Task Filtering

### Filter by Status

```http
GET /tasks?status=todo
```

Example:

```text
GET http://localhost:3000/tasks?status=todo
```

---

### Filter by Project

```http
GET /tasks?projectId=1
```

Example:

```text
GET http://localhost:3000/tasks?projectId=1
```

---

### Filter by Assignee

```http
GET /tasks?assigneeId=1
```

Example:

```text
GET http://localhost:3000/tasks?assigneeId=1
```

---

### Combine Filters

```http
GET /tasks?status=todo&projectId=1&assigneeId=1
```

Example:

```text
GET http://localhost:3000/tasks?status=todo&projectId=1&assigneeId=1
```

The API applies all provided filters together.

---

## 📝 Create Task

Endpoint:

```http
POST /tasks
```

Authentication:

```text
Required
```

Request header:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Example request:

```json
{
  "title": "Build Authentication",
  "description": "Implement JWT authentication",
  "status": "todo",
  "priority": 4,
  "projectId": 1,
  "assigneeId": 1,
  "tagIds": [2, 4]
}
```

---

## ✏️ Update Task

Endpoint:

```http
PATCH /tasks/:id
```

Authentication:

```text
Required
```

Example:

```http
PATCH /tasks/17
```

Request:

```json
{
  "title": "Updated Task Title",
  "priority": 5
}
```

---

## 🗑️ Delete Task

Endpoint:

```http
DELETE /tasks/:id
```

Authentication:

```text
Required
```

Example:

```http
DELETE /tasks/17
```

---

## 🗄️ Database

The application uses **PostgreSQL** as the relational database.

### Main Tables

The project contains the following entities:

- `users`
- `projects`
- `tasks`
- `tags`
- task-tag join table

---

## 👤 User Entity

The `User` entity contains:

```text
id
name
email
password
createdAt
```

Relationships:

```text
User
 ├── Projects
 └── Assigned Tasks
```

---

## 📁 Project Entity

A project contains:

```text
id
name
owner
createdAt
```

A project can have multiple tasks.

---

## ✅ Task Entity

A task contains:

```text
id
title
description
status
priority
project
assignee
dueDate
createdAt
tags
```

---

## 🏷️ Tag Entity

Tags allow tasks to be categorized.

Examples:

```text
Frontend
Backend
Database
API
Bug
UI
```

A task can have multiple tags, and a tag can belong to multiple tasks.

This creates a many-to-many relationship.

---

## 🔗 Entity Relationships

The database relationships are:

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Projects       Tasks
 │               │
 │               ├── Assignee → User
 │               │
 │               ├── Project → Project
 │               │
 │               └── Tags ↔ Tags
 │
 └── Owner → User
```

---

## 🧩 DTO Validation

The project uses DTOs with `class-validator`.

Validation is enabled globally using:

```typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
```

### Validation Features

#### `whitelist`

Removes properties that are not defined in the DTO.

#### `forbidNonWhitelisted`

Rejects requests containing unexpected properties.

#### `transform`

Automatically transforms request values into the expected DTO types.

---

## ⚠️ Centralized Error Handling

The application includes a global HTTP exception filter:

```text
src/common/filters/http-exception.filter.ts
```

The filter provides a consistent error response format.

Example:

```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "timestamp": "2026-08-18T08:00:00.000Z",
  "path": "/auth/login"
}
```

---

## 🌐 CORS

CORS is enabled for the frontend application:

```text
http://localhost:3001
```

Configuration:

```typescript
app.enableCors({
  origin: 'http://localhost:3001',
});
```

---

## 📂 Project Structure

```text
week-8-authenticated-tasks-api/
│
├── src/
│   │
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   │
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   │
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   │
│   ├── entities/
│   │   ├── Project.ts
│   │   ├── Tag.ts
│   │   ├── Task.ts
│   │   └── User.ts
│   │
│   ├── migrations/
│   │   └── AddPasswordToUser.ts
│   │
│   ├── projects/
│   │   ├── projects.controller.ts
│   │   ├── projects.module.ts
│   │   └── projects.service.ts
│   │
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   │
│   │   ├── tasks.controller.ts
│   │   ├── tasks.module.ts
│   │   ├── tasks.service.spec.ts
│   │   └── tasks.service.ts
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── data-source.ts
│   └── main.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── package-lock.json
├── tsconfig.build.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=your_database

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

PORT=3000
```

Do not commit the `.env` file to GitHub.

The `.env` file should be included in `.gitignore`.

---

## 📦 Installation

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Navigate to the project:

```bash
cd week-8-authenticated-tasks-api
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Application

### Development

```bash
npm run start:dev
```

The API runs at:

```text
http://localhost:3000
```

---

### Production Build

```bash
npm run build
```

Run the production application:

```bash
npm run start:prod
```

---

## 🗃️ Database Migration

TypeORM migrations are used to manage database schema changes.

Show migrations:

```bash
npx ts-node ./node_modules/typeorm/cli.js migration:show -d src/data-source.ts
```

Run pending migrations:

```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts
```

---

## 🧪 Testing

The project includes both unit tests and end-to-end tests.

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run test coverage:

```bash
npm run test:cov
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## ✅ Test Results

The final test suite verifies:

- Successful JWT login
- Invalid password rejection
- Unauthorized task creation rejection
- Authenticated task creation
- Unauthorized task update rejection
- Unauthorized task deletion rejection
- Task service functionality

Final test result:

```text
Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
```

---

## 🧪 End-to-End Authentication Tests

The E2E test suite verifies authentication behavior.

### Valid Login

```text
POST /auth/login
```

Expected:

```text
201 Created
```

Response contains:

```text
access_token
```

---

### Invalid Password

```text
POST /auth/login
```

Expected:

```text
401 Unauthorized
```

---

### Create Task Without JWT

```text
POST /tasks
```

Expected:

```text
401 Unauthorized
```

---

### Create Task With JWT

```text
POST /tasks
Authorization: Bearer <JWT_TOKEN>
```

Expected:

```text
201 Created
```

---

### Update Task Without JWT

```text
PATCH /tasks/:id
```

Expected:

```text
401 Unauthorized
```

---

### Delete Task Without JWT

```text
DELETE /tasks/:id
```

Expected:

```text
401 Unauthorized
```

---

## 🔍 TypeScript Verification

TypeScript compilation can be checked with:

```bash
npx tsc --noEmit
```

The project should complete without TypeScript errors.

---

## 🧹 Code Quality

The project uses ESLint and Prettier.

Run linting:

```bash
npm run lint
```

Format the code:

```bash
npm run format
```

---

## 🔒 Security Considerations

The project implements several security practices:

- Passwords are hashed with bcrypt.
- Plain-text passwords are not returned by API responses.
- JWT authentication protects sensitive task operations.
- Invalid credentials return `401 Unauthorized`.
- Duplicate email registration returns `409 Conflict`.
- DTO validation prevents invalid input.
- Non-whitelisted request properties are rejected.
- JWT secret is stored in environment variables.
- Database credentials are stored in environment variables.
- `.env` is excluded from Git.

---

## 🧠 Key Concepts Learned

During Week 8, the following backend concepts were implemented and practiced:

### NestJS

- Modules
- Controllers
- Services
- Dependency Injection
- Guards
- Custom decorators
- Exception filters
- DTOs

### Authentication

- Registration
- Login
- Password hashing
- Password verification
- JWT
- Passport
- JWT Strategy
- JWT Guard
- Authorization headers

### TypeORM

- Entities
- Repositories
- Relations
- QueryBuilder
- `find`
- `findOne`
- `create`
- `save`
- Migrations

### PostgreSQL

- Relational database
- Foreign keys
- One-to-many relationships
- Many-to-many relationships
- Join tables

### Testing

- Jest
- Supertest
- Unit testing
- E2E testing
- Authentication testing
- Protected route testing

### Git

- Repository initialization
- Branch management
- Commits
- Remote repositories
- GitHub
- Pull Requests

---

## 📊 Example Data

The database contains example projects such as:

```text
Task Management System
Hospital Management System
E-Commerce Website
```

Example users include:

```text
Muhammad Haris
Ali Khan
Ammad Ahmad
Hammad Khan
Ahmad Shahzad
```

Example task categories include:

```text
Frontend
Backend
Database
API
Bug
UI
```

---

## 📌 Example Task Response

A task response can contain:

```json
{
  "id": 17,
  "title": "JWT Protected Task",
  "description": "Testing authenticated task creation",
  "status": "todo",
  "priority": 3,
  "project": {
    "id": 1,
    "name": "Task Management System"
  },
  "assignee": {
    "id": 1,
    "name": "Muhammad Haris",
    "email": "haris@gmail.com"
  },
  "dueDate": null,
  "tags": [
    {
      "id": 2,
      "name": "Backend"
    },
    {
      "id": 4,
      "name": "API"
    }
  ]
}
```

---

## 🛠️ Development Workflow

The Week 8 development workflow was:

```text
1. Configure PostgreSQL
        ↓
2. Configure TypeORM
        ↓
3. Create User password field
        ↓
4. Create database migration
        ↓
5. Implement user registration
        ↓
6. Hash passwords with bcrypt
        ↓
7. Implement login
        ↓
8. Generate JWT
        ↓
9. Configure JWT Strategy
        ↓
10. Create JWT Guard
        ↓
11. Protect task operations
        ↓
12. Add CurrentUser decorator
        ↓
13. Add validation
        ↓
14. Add centralized exception handling
        ↓
15. Test API with REST requests
        ↓
16. Write unit tests
        ↓
17. Write E2E authentication tests
        ↓
18. Verify TypeScript
        ↓
19. Commit changes
        ↓
20. Push to GitHub
        ↓
21. Create Pull Request
```

---

## 📋 Week 8 Checklist

### Authentication

- [x] User registration
- [x] User login
- [x] Password hashing
- [x] Password verification
- [x] JWT generation
- [x] JWT strategy
- [x] JWT guard
- [x] Protected routes
- [x] Current user decorator

### Users

- [x] Get all users
- [x] Get user by ID
- [x] Find user by email
- [x] Find user by email with password
- [x] Create user

### Tasks

- [x] Get all tasks
- [x] Get task by ID
- [x] Create task
- [x] Update task
- [x] Delete task
- [x] Assign user
- [x] Assign project
- [x] Assign tags

### Filtering

- [x] Filter by status
- [x] Filter by project
- [x] Filter by assignee
- [x] Combine multiple filters

### Database

- [x] PostgreSQL
- [x] TypeORM
- [x] User entity
- [x] Project entity
- [x] Task entity
- [x] Tag entity
- [x] Relationships
- [x] Migration

### Validation & Error Handling

- [x] DTO validation
- [x] Whitelist validation
- [x] Non-whitelisted property rejection
- [x] Global exception filter
- [x] Consistent error responses

### Testing

- [x] Unit tests
- [x] E2E tests
- [x] Login test
- [x] Invalid password test
- [x] Unauthorized request test
- [x] Authenticated task creation test
- [x] Protected update test
- [x] Protected delete test
- [x] 7/7 tests passing

### Git & GitHub

- [x] Git repository initialized
- [x] Initial commit created
- [x] Main branch configured
- [x] GitHub repository created
- [x] Remote configured
- [x] Changes pushed to GitHub
- [ ] Pull Request created

---

## 🌳 Git Workflow

The project uses a feature branch workflow.

Create a feature branch:

```bash
git checkout -b feature/week-8-authentication
```

Check the current status:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "docs: update Week 8 README"
```

Push the branch:

```bash
git push -u origin feature/week-8-authentication
```

After pushing, create a Pull Request on GitHub.

---

## 🔀 Pull Request

The Week 8 Pull Request should contain:

### Title

```text
docs: update Week 8 README
```

### Description

```text
## Summary

- Added complete Week 8 project documentation
- Documented JWT authentication
- Documented password security
- Documented protected task operations
- Documented API endpoints
- Documented database relationships
- Documented testing
- Documented project structure and setup

## Testing

- npx tsc --noEmit
- npm test

## Test Results

- Test Suites: 2 passed
- Tests: 7 passed
```

---

## 📈 Week 8 Outcome

By completing this project, the API has progressed from a basic task management backend to an authenticated REST API.

The final application provides:

```text
NestJS
   +
TypeScript
   +
PostgreSQL
   +
TypeORM
   +
bcrypt
   +
JWT
   +
Passport
   +
DTO Validation
   +
Exception Handling
   +
Jest
   +
Supertest
   =
Authenticated Task Management API
```

---

# 👨‍💻 Developer

**Muhammad Haris**

GitHub: https://github.com/hariskhan-136

---

# 🎓 Internship

**Coding Pixel Full-Stack Internship Program**

**Week 8 — Authenticated Tasks API**

**Repository created for Week 8 authenticated tasks API internship exercise**
