# 🖼️ Poster Parlor - E-commerce Application

A modern, full-stack e-commerce platform for selling posters built with Next.js and NestJS in an Nx monorepo architecture.

# Demo

[Live Demo](https://poster-parlor-frontend.vercel.app/)

**_Note: The backend is hosted on Render and may take a few seconds to wake up if it has been idle._**

## 🏗️ Project Architecture

This project uses **Nx Monorepo** with the following structure:

- **API Backend**: NestJS application with modular architecture
- **Web Frontend**: Next.js application with modern React features
- **Shared Libraries**: Reusable code across applications

### 📁 Project Structure

```
poster-parlor/
├── api/                    # Backend monorepo (NestJS + Nx)
│   ├── apps/
│   │   ├── api/           # Main NestJS application
│   │   └── api-e2e/       # E2E tests
│   ├── libs/              # Shared backend libraries
│   │   ├── admin/         # Admin functionality
│   │   ├── auth/          # Authentication & authorization
│   │   ├── config/        # Configuration management
│   │   ├── database/      # Database utilities
│   │   ├── inventory/     # Product inventory management
│   │   ├── logger/        # Logging utilities
│   │   ├── models/        # Database models
│   │   ├── orders/        # Order management
│   │   ├── review/        # Product reviews
│   │   ├── shared/        # Shared utilities
│   │   └── utils/         # Common utilities
│   └── scripts/           # Deployment scripts
├── web/                   # Frontend Next.js application
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-based modules
│   │   ├── lib/          # Utility libraries
│   │   ├── providers/    # React context providers
│   │   ├── store/        # Redux store & API
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static assets
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Docker)
- **Git**

### 📋 Environment Variables Setup

#### Backend Environment Variables

Create environment files in the `api/libs/config/src/env/` directory:

**For Development (`development.env`):**

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200

# Database Configuration
DB_NAME=poster_parlor_dev
DB_URL=mongodb://admin:admin123@localhost:27017/poster_parlor_dev?authSource=admin
POOL_SIZE=10

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_jwt_access_secret_key_here
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration (for payments)
RAZORPAY_API_KEY=your_razorpay_key
RAZORPAY_API_SECRET=your_razorpay_secret
```

**For Production (`production.env`):**
Use the same format but with production values.

#### Frontend Environment Variables

Create a `.env.local` file in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### 🗄️ Database Setup

#### Option 1: Using Docker (Recommended)

1. **Pull MongoDB Image:**

   ```bash
   docker pull mongo:7
   ```

2. **Run MongoDB Container:**

   ```bash
   docker run -d \
     --name poster-parlor-mongo \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
     -v mongo_data:/data/db \
     mongo:7
   ```

3. **Verify MongoDB is Running:**
   ```bash
   docker ps
   ```

#### Option 2: Local MongoDB Installation

1. Install MongoDB Community Edition from [official website](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Update the `DB_URL` in your environment variables accordingly

### 📦 Installation & Setup

#### 1. Clone the Repository

```bash
git clone poster-parlor.git
cd poster-parlor
```

#### 2. Setup Backend (API)

```bash
cd api
npm install
```

#### 3. Setup Frontend (Web)

```bash
cd ../web
npm install
```

### 🔧 Development

#### Start Backend Server

```bash
cd api
npm run dev
```

The API will be available at `http://localhost:{port}`

#### Start Frontend Server

```bash
cd web
npm run dev
```

The web application will be available at `http://localhost:3000` (or next available port)

### 🏭 Production Build

#### Build Backend

```bash
cd api
npm run build
```

#### Build Frontend

```bash
cd web
npm run build
npm start
```

#### Generate Environment File (Production)

```bash
cd api
npm run generate-env
```

## 🎯 Features

### 🛍️ E-commerce Core Features

- **Product Catalog**: Browse and search posters
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Google OAuth integration
- **Order Management**: Place orders, track status
- **Payment Integration**: Razorpay payment gateway
- **Product Reviews**: Rate and review products
- **Admin Dashboard**: Manage products, orders, and customers

### 🔧 Technical Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for frontend state
- **API Documentation**: RESTful API with proper error handling
- **File Uploads**: Cloudinary integration for image management
- **Logging**: Comprehensive logging with Winston
- **Testing**: Jest for unit testing
- **Code Quality**: ESLint and Prettier configuration
- **Type Safety**: Full TypeScript implementation

## 🛠️ Technology Stack

### Backend

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with JWT
- **File Storage**: Cloudinary
- **Payment**: Razorpay
- **Logging**: Winston
- **Testing**: Jest
- **Build Tool**: Nx

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Authentication**: React OAuth Google

### Development Tools

- **Monorepo**: Nx
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **Containerization**: Docker

## 📚 Available Scripts

### Backend (API)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run graph        # View dependency graph
npm run clear        # Clean and reinstall dependencies
npm run generate-env # Generate production environment file
```

### Frontend (Web)

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## 🔐 Authentication Setup

1. **Google OAuth Setup:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **JWT Configuration:**
   - Generate secure random strings for JWT secrets
   - Configure token expiration times based on security requirements

## 💳 Payment Setup

1. **Razorpay Setup:**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Get API keys from dashboard
   - Configure webhook URLs for payment status updates

## ☁️ Cloudinary Setup

1. **Account Setup:**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get cloud name, API key, and API secret from dashboard
   - Configure upload presets if needed

## 🚀 Deployment

### Backend Deployment

The backend is configured for deployment on platforms like Render, Heroku, or any cloud platform that supports Node.js.

### Frontend Deployment

The frontend can be deployed on Vercel, Netlify, or any platform that supports Next.js applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

---

**Happy coding!** 🚀
