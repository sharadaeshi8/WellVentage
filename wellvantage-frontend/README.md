# WellVantage Frontend

A modern gym management system frontend built with Next.js 16, React 19, and TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)

## ✨ Features

- **Authentication**

  - Google OAuth integration
  - Phone number verification
  - Secure session management

- **Dashboard**

  - Overview of gym statistics
  - Quick actions and shortcuts
  - Recent activity feed

- **Lead Management**
  - Create, edit leads
  - Advanced filtering and search
  - Status tracking and updates
- **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
  - Modern UI with Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Authentication**: NextAuth.js

## 📁 Project Structure

```
wellvantage-frontend/
├── app/                         # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── register/
│   │   ├── signin/
│   │   └── signup/
│   ├── (dashboard)/             # Dashboard pages
│   │   ├── attendance/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   └── memberships/
│   ├── api/                     # API routes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # Context providers
├── components/                  # React components
│   ├── auth/                    # Auth-related components
│   ├── dashboard/               # Dashboard components
│   ├── leads/                   # Lead management components
│   └── BrandLogo.tsx
├── lib/                         # Utilities and configurations
│   ├── api/                     # API client setup
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   ├── types/                   # TypeScript types
│   ├── constants/               # App constants
│   └── utils/                   # Utility functions
├── public/                      # Static assets
│   └── images/
├── .env.local                   # Environment variables
├── proxy.ts                     # Middleware
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wellvantage-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🔧 Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Code Quality

```bash
# Type check
npx tsc --noEmit
```

### Project Conventions

- **Components**: Use functional components with TypeScript
- **Styling**: Use Tailwind CSS utility classes
- **State Management**: Use TanStack Query for server state
- **File Naming**:
  - Components: PascalCase (e.g., `LeadCard.tsx`)
  - Utilities: camelCase (e.g., `formatPhone.ts`)
  - Types: PascalCase with `.ts` extension

## 📦 Building

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Build Optimization

- Automatic code splitting
- Image optimization with Next.js Image
- CSS optimization with Tailwind
- Bundle analysis available with `npm run analyze`

## 🎨 Styling Guide

### Tailwind CSS

This project uses Tailwind CSS v4. Key features:

- Utility-first CSS framework
- Custom design tokens in `globals.css`
- Responsive design utilities
- Dark mode support (if enabled)

### Component Styling

```tsx
// Example component with Tailwind
export function Button({ children, variant = "primary" }) {
  return (
    <button
      className={`
        px-4 py-2 rounded-md font-medium
        ${variant === "primary" ? "bg-green-500 text-white" : "bg-gray-200"}
        hover:opacity-90 transition-opacity
      `}
    >
      {children}
    </button>
  );
}
```

## 📱 Pages Overview

### Public Pages

- `/` - Landing page with carousel
- `/signup` - User registration

### Protected Pages (Dashboard)

- `/dashboard` - Main dashboard - Coming soon
- `/leads` - Lead management
- `/leads/new` - Create new lead
- `/leads/[id]` - Lead details
- `/attendance` - Attendance tracking - Coming soon
- `/memberships` - Membership management - Coming soon

## 🧪 Testing

```bash
# Run tests (when configured)
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📝 Code Style

- Use TypeScript for type safety
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

## 🐛 Troubleshooting

### Common Issues

**Issue**: Images not loading

- **Solution**: Ensure images are in `public/` folder and paths start with `/`

**Issue**: API calls failing

- **Solution**: Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

**Issue**: Build errors

- **Solution**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
