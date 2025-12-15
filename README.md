# WellVantage - Gym Management System

A comprehensive, modern gym management system with lead tracking, member management, and business analytics.

## 🎯 Overview

WellVantage is a full-stack application designed to help gym owners manage their business efficiently. It includes features for lead management, member tracking, attendance monitoring, and business analytics.

## 🏗 Architecture

This is a monorepo containing:

- **Backend**: NestJS API with MongoDB
- **Frontend**: Next.js 16 with React 19

```
wellvantage/
├── wellvantage-backend/    # NestJS API
└── wellvantage-frontend/   # Next.js App
```

## ✨ Key Features

### Authentication & Security

- Google OAuth integration
- Phone number verification via Twilio

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- MongoDB 5.x or higher
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wellvantage
   ```

2. **Setup Backend**

   ```bash
   cd wellvantage-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run start:dev
   ```

3. **Setup Frontend**

   ```bash
   cd wellvantage-frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📚 Documentation

- [Backend Documentation](./wellvantage-backend/README.md)
- [Frontend Documentation](./wellvantage-frontend/README.md)
- [Twilio Setup Guide](./wellvantage-backend/TWILIO_SETUP.md)

## 🛠 Tech Stack

### Backend

- NestJS 11
- MongoDB with Mongoose
- TypeScript
- Passport.js (Google OAuth, JWT)
- Twilio Verify API

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query
- Axios

## 📁 Project Structure

```
wellvantage/
├── wellvantage-backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── gyms/           # Gym management
│   │   ├── leads/          # Lead management
│   │   ├── users/          # User management
│   │   └── common/         # Shared utilities
│   └── README.md
│
└── wellvantage-frontend/
    ├── app/                # Next.js pages
    ├── components/         # React components
    ├── lib/               # Utilities & services
    └── README.md
```

## 🔐 Environment Setup

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/wellvantage
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_VERIFY_SID=your_verify_sid
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## 🧪 Testing

### Backend

```bash
cd wellvantage-backend
npm run test
npm run test:e2e
```

### Frontend

```bash
cd wellvantage-frontend
npm run test
```
