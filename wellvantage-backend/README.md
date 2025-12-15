# WellVantage Backend

A comprehensive gym management system backend built with NestJS, MongoDB, and TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- **Authentication & Authorization**
  - Google OAuth 2.0 integration
  - JWT-based authentication
  - Phone number verification via Twilio
  - Role-based access control

- **Gym Management**
  - Create and manage gym profiles
  - Owner information management
  - Address and contact details

- **Lead Management**
  - Create, read, update, and delete leads
  - Lead status tracking (New, Contacted, Qualified, etc.)
  - Lead preferences and notes
  - Bulk operations (archive, assign, delete)
  - Advanced filtering and search

- **User Management**
  - User profiles
  - Role management (Owner, Staff, etc.)
  - Gym association

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Runtime**: Node.js 22.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Google OAuth, JWT)
- **Validation**: class-validator, class-transformer
- **Phone Verification**: Twilio Verify API
- **Language**: TypeScript 5.x

## 📁 Project Structure

```
wellvantage-backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── strategies/          # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── phone-verification.service.ts
│   ├── gyms/                    # Gym management module
│   │   ├── schemas/
│   │   ├── gyms.controller.ts
│   │   ├── gyms.service.ts
│   │   └── gyms.module.ts
│   ├── leads/                   # Lead management module
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── leads.controller.ts
│   │   ├── leads.service.ts
│   │   └── leads.module.ts
│   ├── users/                   # User management module
│   │   ├── schemas/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── database/                # Database configuration
│   ├── common/                  # Shared constants and utilities
│   ├── seeds/                   # Database seeders
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── main.ts
├── test/                        # E2E tests
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- MongoDB 5.x or higher
- npm or yarn
- Twilio account (for phone verification)
- Google OAuth credentials (for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellvantage-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or use your local MongoDB installation
   ```

5. **Run the application**
   ```bash
   # Development mode with hot-reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

The server will start on `http://localhost:3001`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/wellvantage

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# Twilio Phone Verification
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SID=your_twilio_verify_service_sid

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000

# Server
PORT=3001
```

See [TWILIO_SETUP.md](./TWILIO_SETUP.md) for detailed Twilio configuration instructions.

## 📚 API Documentation

### Health Check

```http
GET / or GET /health
```

Returns server health status.

### Authentication

#### Google OAuth Login
```http
GET /auth/google
```

Initiates Google OAuth flow.

#### Google OAuth Callback
```http
GET /auth/google/callback
```

Handles Google OAuth callback.

#### Send Phone Verification Code
```http
POST /auth/phone/send-code
Content-Type: application/json

{
  "phone": "+919876543210",
  "country": "IN"
}
```

#### Verify Phone Code
```http
POST /auth/phone/verify-code
Content-Type: application/json

{
  "phone": "+919876543210",
  "code": "123456",
  "country": "IN"
}
```

#### Logout
```http
POST /auth/logout
```

#### Get Current User
```http
GET /auth/me
```

### Leads

#### Get All Leads (with filters)
```http
GET /leads?status=new&search=john&page=1&limit=10
```

#### Create Lead
```http
POST /leads
```

#### Get Lead by ID
```http
GET /leads/:id
```

#### Update Lead
```http
PUT /leads/:id
```

#### Update Lead Status
```http
PUT /leads/:id/status
```

#### Update Lead Preferences
```http
PUT /leads/:id/preferences
```

#### Delete Lead
```http
DELETE /leads/:id
```

#### Archive Lead
```http
PATCH /leads/:id/archive
```

#### Add Note to Lead
```http
POST /leads/:id/notes
```

#### Update Note
```http
PUT /leads/:id/notes/:noteId
```

#### Delete Note
```http
DELETE /leads/:id/notes/:noteId
```

### Users

#### Get All Users
```http
GET /users
```

#### Get User by ID
```http
GET /users/:id
```

#### Update User
```http
PUT /users/:id
```

#### Delete User
```http
DELETE /users/:id
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Development

### Code Formatting

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Database Seeding

```bash
# Seed leads data
npm run seed:leads
```

### Building

```bash
# Build for production
npm run build

# Start production build
npm run start:prod
```