# ProLink

## Fullstack Documentation

A comprehensive, professional fullstack LinkedIn-like social networking application built with React, Express, MongoDB, and real-time Socket.IO integration. This document provides complete technical documentation for developers working on this project.

---

## Table of Contents

- [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [Technology Stack](#technology-stack)
- [Frontend Documentation](#frontend-documentation)
  - [Project Structure](#frontend-project-structure)
  - [Technology Stack](#frontend-technology-stack)
  - [Installation & Setup](#frontend-installation--setup)
  - [Architecture](#frontend-architecture)
  - [Components](#frontend-components)
  - [Pages](#frontend-pages)
  - [Configuration Files](#frontend-configuration-files)
  - [Development Guidelines](#frontend-development-guidelines)
  - [Build & Deployment](#build--deployment)
- [Backend Documentation](#backend-documentation)
  - [Project Structure](#backend-project-structure)
  - [Technology Stack](#backend-technology-stack)
  - [Installation & Setup](#backend-installation--setup)
  - [Architecture](#backend-architecture)
  - [Database Configuration](#database-configuration)
  - [Database Models](#database-models)
  - [Controllers](#controllers)
  - [Routes](#routes)
  - [Middlewares](#middlewares)
  - [API Endpoints Reference](#api-endpoints-reference)
  - [Development Guidelines](#backend-development-guidelines)
  - [Security Practices](#security-practices)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

---

## Project Overview

ProLink is a fullstack social networking platform that enables users to:

- **User Authentication**: Create accounts with secure password hashing and JWT token-based authentication
- **User Profiles**: Manage comprehensive profiles with profile pictures, cover images, skills, education, and work experience
- **Social Networking**: Send and accept connection requests to build professional networks
- **Content Sharing**: Create, edit, and delete posts with optional image attachments
- **Social Engagement**: Like posts and add comments in real-time
- **Real-time Notifications**: Receive notifications for connections, likes, and comments via Socket.IO
- **User Search**: Search for users by name, username, or skills
- **Network Discovery**: Get personalized suggestions of users not yet connected

### Key Features

- **Authentication & Authorization**: Secure JWT-based authentication with HTTP-only cookies
- **Real-time Updates**: Socket.IO integration for instant notifications and live connection status updates
- **Cloud Image Storage**: Cloudinary integration for profile images, cover photos, and post images
- **Comprehensive Search**: Full-text search with regex fallback for finding users and content
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **Production Ready**: Security headers with Helmet, CORS configuration, environment-based settings
- **Database Indexing**: Performance optimized with MongoDB indexes on frequently queried fields
- **Connection Management**: Bidirectional connection system with pending/accepted/rejected states

---

# Frontend Documentation

## Frontend Project Structure

```
frontend/
├── index.html                          # HTML entry point
├── main.jsx                            # React app initialization
├── App.jsx                             # Main router configuration
├── App.css                             # Global styles (deprecated, use Tailwind)
├── index.css                           # Tailwind directives and global styles
├── package.json                        # Frontend dependencies and scripts
├── vite.config.js                      # Vite bundler configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration for Tailwind
├── eslint.config.js                    # ESLint rules and configuration
├── README.md                           # Project-specific frontend README
│
├── public/                             # Static assets (images, icons)
│   └── [static files]
│
└── src/
    ├── assets/                         # Images, icons, and media files
    │   └── [asset files]
    │
    ├── axios/
    │   └── AxiosInstance.jsx          # Configured Axios instance for API calls
    │                                   # Handles base URL, credentials, and interceptors
    │
    ├── context/
    │   ├── AuthContext.jsx             # Provides serverUrl to entire app
    │   └── UserContext.jsx             # Global user state, posts, socket connection
    │
    ├── components/
    │   ├── Nav.jsx                     # Navigation bar (header)
    │   ├── Post.jsx                    # Post card component (display, like, comment)
    │   ├── ConnectionButton.jsx        # Connect/Disconnect button for networking
    │   └── EditProfile.jsx             # Modal for editing user profile
    │
    └── pages/
        ├── Home.jsx                    # Feed page (all posts, navigation)
        ├── Login.jsx                   # User login page
        ├── Signup.jsx                  # User registration page
        ├── Profile.jsx                 # User profile page (own and others)
        ├── Network.jsx                 # Connections & pending requests page
        └── Notification.jsx            # User notifications page
```

## Frontend Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^19.0.0 | UI library for component-based development |
| **React Router DOM** | ^7.4.0 | Client-side routing and navigation |
| **Vite** | ^6.2.0 | Fast build tool and dev server |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS framework for styling |

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **Axios** | ^1.13.5 | HTTP client for API requests with credentials support |
| **Socket.IO Client** | ^4.8.1 | Real-time bidirectional event-based communication |
| **React Icons** | ^5.5.0 | Icon library (Heroicons, Font Awesome, Feather, etc.) |
| **Moment.js** | ^2.30.1 | Date and time formatting and manipulation |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | ^9.21.0 | JavaScript linter for code quality |
| **@vitejs/plugin-react** | ^4.3.4 | Vite plugin for React with Hot Module Replacement |
| **PostCSS** | ^8.5.3 | CSS transformation tool for Tailwind processing |
| **Autoprefixer** | ^10.4.21 | Automatically adds vendor prefixes to CSS |
| **Terser** | ^5.46.0 | JavaScript minifier for production builds |

## Frontend Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see Backend Installation)

### Installation Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file in frontend directory
# Add the following environment variable:
# VITE_API_BASE_URL=http://localhost:5000  (for development)
# VITE_API_BASE_URL=https://your-production-api.com  (for production)
```

### Available Scripts

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm run dev` | Start development server | Hot reload enabled, runs on `http://localhost:5173` |
| `npm run build` | Build for production | Creates optimized `dist/` folder with code splitting |
| `npm run lint` | Run ESLint | Check code quality and style violations |
| `npm run preview` | Preview production build locally | Simulates production environment |

## Frontend Architecture

### Entry Points

**Root Level: `index.html`**
```html
<!-- Serves as the single HTML file for the entire SPA -->
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ProLink</title>
  </head>
  <body>
    <div id="root"></div>  <!-- React root element -->
    <!-- Vite injects scripts here -->
  </body>
</html>
```

**main.jsx - Application Initialization**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContext from './context/AuthContext'
import UserContext from './context/UserContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContext>
        <UserContext>
          <App />
        </UserContext>
      </AuthContext>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### Routing Structure

**Public Routes** (Anyone can access)
- `/login` - User login page
- `/signup` - User registration page

**Protected Routes** (Require authentication via JWT token)
- `/` (Home) - Main feed with all posts
- `/profile` - User profile page (view own or other users' profiles)
- `/network` - Connection requests and connections management
- `/notification` - User notifications for likes, comments, and connection acceptances

**Route Protection Logic**
```jsx
// In App.jsx
<Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
// If userData exists (user logged in), show Home page
// Otherwise, redirect to Login page
```

## Frontend Components

### Nav Component

**Location:** `src/components/Nav.jsx`

**Features:**
- Navigation header with links to all pages
- User profile menu with logout option
- Displays current user's name
- Responsive design for mobile and desktop

**Usage:**
```jsx
import Nav from './components/Nav'
// Used in layout wrapper or main pages
<Nav />
```

---

### Post Component

**Location:** `src/components/Post.jsx`

**Features:**
- Display individual post with author info, content, and image
- Like button with real-time like count
- Comment section with ability to add comments
- Delete post option for post author
- Timestamp display (relative time using moment.js)
- Click author name to view their profile

**Props:**
```jsx
{
  post: {
    _id: string,              // Post ID from database
    author: {
      _id: string,           // User ID
      firstName: string,
      lastName: string,
      userName: string,
      profileImage: string   // Cloudinary URL
    },
    description: string,      // Post content
    image: string,           // Post image URL (optional)
    like: Array[],           // Array of user IDs who liked
    comment: Array[],        // Array of comment objects
    createdAt: timestamp,
    updatedAt: timestamp
  },
  onPostUpdate: function     // Callback to refresh post data
}
```

**Functionality:**
- `handleLike()` - Send like request to backend, updates in real-time
- `handleComment()` - Submit comment to database and update display
- `handleDelete()` - Remove post (only author can delete)

---

### ConnectionButton Component

**Location:** `src/components/ConnectionButton.jsx`

**Features:**
- Display connection status with user (Connect, Connected, Pending, Received)
- Send connection request
- Accept/Reject incoming requests
- Remove connection
- Real-time status updates via Socket.IO

**Props:**
```jsx
{
  userId: string,           // Target user ID
  status: string,           // "Connect", "pending", "received", or "connected"
  onStatusChange: function  // Callback when status changes
}
```

**Status States:**
- **Connect** - Not connected, click to send request
- **Pending** - Request sent, waiting for acceptance
- **Received** - Recipient has request, click to accept/reject
- **Connected** - Already connected, click to disconnect

---

### EditProfile Component

**Location:** `src/components/EditProfile.jsx`

**Features:**
- Modal form for updating user profile
- Edit fields: firstName, lastName, headline, location, skills, education, experience
- Upload profile image and cover image with preview
- Validation and error handling
- Cloudinary image upload integration

**Form Fields:**
- Basic Info: firstName, lastName, headline
- Location & Skills
- Education (college, degree, field of study)
- Work Experience (title, company, description)
- Profile Image & Cover Image upload

---

## Frontend Pages

### Home Page

**Location:** `src/pages/Home.jsx`

**Features:**
- Display feed with all posts from all users
- Create new post with optional image
- Real-time socket updates for new posts
- Pagination or infinite scroll (if implemented)
- Post component for each post

**State Management:**
- `userData` - Current logged-in user (from UserContext)
- `postData` - Array of all posts (from UserContext)
- Local state for new post form

**Components Used:**
- `Nav` - Navigation header
- `Post` - Display each post card

---

### Profile Page

**Location:** `src/pages/Profile.jsx`

**Features:**
- Display user profile (own or other users)
- Show user stats: connections count, posts count
- Display user info: headline, location, skills, education, experience
- Profile image and cover image
- Edit profile button (only visible for own profile)
- View all posts of the user
- Connection status button (for other users)

**State Management:**
- `userData` - Logged-in user
- `profileData` - Viewed user's profile (from UserContext)
- Local state for profile updates

**Conditional Rendering:**
- Show "Edit Profile" button only if viewing own profile
- Show connection button only if viewing other users' profiles
- Show user's posts filtered by userId

---

### Network Page

**Location:** `src/pages/Network.jsx`

**Features:**
- Display list of all connections
- Display pending connection requests (received from others)
- Accept/Reject request functionality
- Remove connection functionality
- Search and filter connections
- Real-time socket updates for new requests

**Tabs/Sections:**
1. **My Connections** - List of accepted connections
2. **Pending Requests** - Connection requests received (waiting for action)

**Components Used:**
- `ConnectionButton` - For accepting/rejecting/removing connections
- User cards showing profile info

---

### Notification Page

**Location:** `src/pages/Notification.jsx`

**Features:**
- Display all notifications in chronological order (newest first)
- Notification types: like, comment, connectionAccepted
- Click notification to navigate to related content
- Delete single notification
- Clear all notifications
- Real-time socket updates for new notifications

**Notification Display:**
```
[Profile Picture] {User} liked your post
[Profile Picture] {User} commented on your post
[Profile Picture] {User} accepted your connection request
```

**Functionality:**
- Click to view the post or navigate to user profile
- Delete button removes individual notification
- Clear all button removes all notifications for user

---

### Login Page

**Location:** `src/pages/Login.jsx`

**Features:**
- Email and password input fields
- Form validation
- Submit button sends POST request to backend
- Error handling and display
- Link to signup page for new users
- Remember me option (optional)
- Password visibility toggle (optional)

**Form Submission:**
```
POST /api/auth/login
Body: { email, password }
Response: { _id, firstName, lastName, userName, email, ... }
```

---

### Signup Page

**Location:** `src/pages/Signup.jsx`

**Features:**
- First name and last name input
- Username field (lowercase, no spaces)
- Email field with validation
- Password field with minimum 8 characters requirement
- Confirm password field
- Form validation
- Submit sends POST request to backend
- Error handling and duplicate account check
- Link to login page for existing users

**Form Submission:**
```
POST /api/auth/signup
Body: { firstName, lastName, userName, email, password }
Response: { _id, firstName, lastName, userName, email, ... }
```

---

## Frontend Configuration Files

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Optimization for production build
  build: {
    // Enable code splitting for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries into their own chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['react-icons/io5', 'react-icons/ti', 'react-icons/fa6'],
        },
      },
    },
    // Minify with Terser for optimal compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'moment'],
  },
})
```

**Key Features:**
- **Code Splitting**: React vendor and icons loaded separately for better caching
- **Minification**: Terser removes console logs and compresses code
- **Dependency Optimization**: Pre-bundles dependencies for faster dev server startup

---

### tailwind.config.js

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Purpose:**
- Scans all HTML and JSX files for Tailwind classes
- Purges unused styles in production for smaller CSS files
- Allows extending default theme with custom colors, fonts, etc.

---

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Purpose:**
- Processes Tailwind CSS directives
- Autoprefixer adds vendor prefixes for browser compatibility
- These are applied when building for production

---

### .env (Environment Variables)

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
# For production, change to your deployed backend URL
# VITE_API_BASE_URL=https://api.prolink.com
```

**Usage in Code:**
```javascript
const serverUrl = import.meta.env.VITE_API_BASE_URL
```

---

## Frontend Development Guidelines

### Best Practices

1. **Always use context for global state**
   - User data and posts should be in UserContext
   - Server URL should be in AuthContext
   - Avoid prop drilling through multiple components

2. **Protect routes properly**
   - Check `userData` before rendering protected pages
   - Redirect to login if userData is null
   - Use Navigate from react-router-dom

3. **Handle errors gracefully**
   - Try-catch all API calls
   - Display user-friendly error messages
   - Reset states on error to prevent crashes

4. **Use moment.js for timestamps**
   - Format dates consistently: `moment(date).fromNow()`
   - Display relative time (e.g., "2 minutes ago", "3 days ago")
   - Store ISO strings in database, format on frontend

5. **Optimize images**
   - Use Cloudinary for image storage
   - Request appropriately sized images with URL parameters
   - Implement lazy loading for image-heavy pages

6. **Component Structure**
   - Keep components small and focused (single responsibility)
   - Extract reusable logic into custom hooks
   - Keep styling scoped or use Tailwind utilities
   - Document component with JSDoc comments

7. **Performance**
   - Use React.lazy() for code splitting (already done in App.jsx)
   - Memoize expensive computations with useMemo
   - Use useCallback for event handlers passed to child components
   - Avoid inline object/array creation in render

---

## Build & Deployment

### Development Build

```bash
# Start development server with hot reload
npm run dev

# Server runs on http://localhost:5173
# API requests to http://localhost:5000 (backend)
```

### Production Build

```bash
# Create optimized production build
npm run build

# Output: dist/ folder with minified and chunked files
# Code splitting enabled: react-vendor chunk, icons chunk, main app chunk
# Console logs removed, Terser minification applied
```

### Preview Production Build Locally

```bash
# Preview the production build (useful for testing before deployment)
npm run preview

# Serves dist/ folder locally
# Simulates production environment
```

### Deployment to Vercel/Netlify

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel or Netlify

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Environment Variables:
     VITE_API_BASE_URL=https://your-backend-url.com
   ```

3. **Deploy**
   - Push to main branch to trigger automatic deployment
   - Frontend URL: `https://your-domain.vercel.app`
   - Backend URL: Update VITE_API_BASE_URL for production

4. **CORS Configuration**
   - Backend must allow requests from frontend URL
   - Update CORS originAllowList in backend/index.js

---

# Backend Documentation

## Backend Project Structure

```
backend/
├── index.js                            # Server entry point (Express + Socket.IO)
├── package.json                        # Backend dependencies and scripts
├── versal.json                         # Vercel deployment configuration
├── .env                                # Environment variables (git-ignored)
├── .env.example                        # Example environment variables
│
├── config/
│   ├── db.js                          # MongoDB connection setup
│   ├── token.js                       # JWT token generation
│   └── cloudinary.js                  # Cloudinary image storage setup
│
├── controllers/
│   ├── auth.controllers.js            # Login, signup, logout logic
│   ├── user.controllers.js            # User profile, search, suggestions
│   ├── post.Controllers.js            # Create, fetch, like, comment posts
│   ├── connection.controllers.js      # Connection requests, accept, reject
│   └── notification.controllers.js    # Fetch and delete notifications
│
├── models/
│   ├── user.model.js                 # User schema with profile fields
│   ├── post.model.js                 # Post schema with comments/likes
│   ├── connection.model.js           # Connection request schema
│   └── notification.model.js         # Notification schema
│
├── middlewares/
│   ├── isAuth.js                     # JWT verification middleware
│   └── multer.js                     # File upload (images) middleware
│
├── routes/
│   ├── auth.routes.js                # Auth endpoints (signup, login, logout)
│   ├── user.routes.js                # User endpoints (profile, search, edit)
│   ├── post.routes.js                # Post endpoints (create, like, comment)
│   ├── connection.routes.js          # Connection endpoints (send, accept, reject)
│   └── notification.routes.js        # Notification endpoints (fetch, delete)
│
└── public/                            # Static files (CSS, images if needed)
```

## Backend Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest LTS | JavaScript runtime for backend |
| **Express.js** | ^4.21.2 | Web framework for building REST API |
| **MongoDB** | Latest | NoSQL database for data persistence |
| **Mongoose** | ^8.12.1 | MongoDB object modeling and validation |
| **Socket.IO** | ^4.8.1 | Real-time bidirectional communication |

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **bcryptjs** | ^3.0.2 | Password hashing with salt rounds |
| **jsonwebtoken** | ^9.0.2 | JWT token generation and verification |
| **dotenv** | ^16.4.7 | Environment variable management |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing configuration |
| **cloudinary** | ^2.6.0 | Cloud image storage and manipulation |
| **multer** | ^2.0.2 | File upload middleware |
| **joi** | ^18.0.2 | Input validation and schema |
| **helmet** | ^8.1.0 | HTTP security headers |
| **compression** | ^1.8.1 | Response compression (gzip) |
| **cookie-parser** | ^1.4.7 | Parse cookies from requests |
| **streamifier** | ^0.1.1 | Convert streams for file uploads |

### Development Tools

| Package | Version | Purpose |
|---------|---------|---------|
| **nodemon** | ^3.1.9 | Auto-restart server on file changes |

## Backend Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image storage)
- Git

### Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
# For production: NODE_ENV=production

# Database
MONGODB_URL=mongodb://localhost:27017/proLink
# Local MongoDB: mongodb://localhost:27017/prolink

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long!
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Frontend URL
VITE_FRONTEND_URL=http://localhost:5173
# For production: VITE_FRONTEND_URL=https://your-frontend-domain.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important:** Never commit `.env` to Git. Add to `.gitignore`.

### Installation Steps

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify environment setup
# Update .env with your MongoDB URL and Cloudinary credentials

# Start development server
npm run dev

# Server runs on http://localhost:5000
# With nodemon, auto-restarts on file changes
```

### Available Scripts

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm run dev` | Start development server | Uses nodemon for auto-reload |
| `npm start` | Start production server | No auto-reload, use this for production |

## Backend Architecture

### Application Entry Point

**File:** `backend/index.js`

```javascript
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO configuration
export const io = new Server(server, {
  cors: {
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [process.env.VITE_FRONTEND_URL, "http://localhost:5173"],
  credentials: true
}));
app.use(helmet());
app.use(compression());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);

// Socket.IO - Track connected users
const userSocketMap = {};
io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSocketMap[userId] = socket.id;
  });
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
  });
});

// Connect Database and Start Server
connectDb();
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

**Key Responsibilities:**
- Initialize Express server and HTTP server (required for Socket.IO)
- Setup middleware for security (Helmet), compression, CORS, cookies
- Configure Socket.IO with CORS for frontend communication
- Mount all API routes under `/api/` prefix
- Track user socket connections for real-time notifications
- Connect to MongoDB and start server on configured port

---

## Database Configuration

### MongoDB Connection

**File:** `backend/config/db.js`

```javascript
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("db connected");
  } catch (error) {
    console.error("db connection error:", error);
    process.exit(1);
  }
};

export default connectDb;
```

**Configuration Details:**
- Connection URL from `.env` (MongoDB Atlas URI)
- Automatic reconnection on network errors
- Process exits if connection fails (prevents running without database)

### Cloudinary Configuration

**File:** `backend/config/cloudinary.js`

- Configure Cloudinary API credentials
- Used for uploading profile images, cover images, and post images
- Returns secure URLs for storing in database

---

## Database Models

### User Model

**Location:** `backend/models/user.model.js`

**Schema Definition:**

```javascript
{
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9._-]+$/  // Only alphanumeric, dots, dashes, underscores
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true  // Hashed with bcrypt, never returned to frontend
  },
  profileImage: {
    type: String,
    default: ""  // Cloudinary URL
  },
  coverImage: {
    type: String,
    default: ""  // Cloudinary URL
  },
  headline: {
    type: String,
    default: ""  // Job title or bio (e.g., "Senior Developer")
  },
  skills: [{
    type: String
  }],
  education: [{
    college: String,
    degree: String,
    fieldOfStudy: String
  }],
  location: {
    type: String,
    default: "India"
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  experience: [{
    title: String,
    company: String,
    description: String
  }],
  connection: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  timestamps: true  // createdAt, updatedAt
}
```

**Indexes:**
- `userName`: Fast unique lookups for profile pages
- `email`: Fast unique lookups for login
- Full-text search on: firstName, lastName, userName, skills

**Important Notes:**
- Password is hashed with bcrypt (10 salt rounds) before saving
- Always exclude password in queries: `.select("-password")`
- Connection array stores User ObjectIds for bidirectional relationships
- Use `.populate("connection")` to fetch full user objects

---

### Post Model

**Location:** `backend/models/post.model.js`

**Schema Definition:**

```javascript
{
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true  // Post always has an author
  },
  description: {
    type: String,
    default: ""  // Post content/text
  },
  image: {
    type: String  // Cloudinary URL (optional)
  },
  like: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  // Array of user IDs who liked
  }],
  comment: [{
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }],
  timestamps: true  // createdAt (for feed sorting), updatedAt
}
```

**Indexes:**
- `author`: Fetch all posts by a specific user (profile page)
- `createdAt` (descending): Sort posts newest first for feed
- `like`: Quick like count queries
- `comment.user`: Analytics on who commented

**Usage Patterns:**
- **Create post**: `new Post({ author: userId, description, image })`
- **Add like**: `Post.updateOne({_id}, {$addToSet: {like: userId}})` (prevents duplicates)
- **Remove like**: `Post.updateOne({_id}, {$pull: {like: userId}})`
- **Add comment**: `Post.updateOne({_id}, {$push: {comment: {content, user: userId}}})`
- **Fetch with details**: `Post.find().populate("author").populate("comment.user")`

---

### Connection Model

**Location:** `backend/models/connection.model.js`

**Schema Definition:**

```javascript
{
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  // User who initiated the request
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  // User who receives the request
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  timestamps: true  // createdAt (request date), updatedAt
}
```

**Indexes:**
- `(sender, receiver)`: Check if connection already exists
- `(receiver, status)`: Fetch all pending requests for a user

**Connection Workflow:**

1. **Send Request**
   - Create Connection(sender, receiver, status: "pending")
   - Sender appears in receiver's pending requests

2. **Accept Request**
   - Update status to "accepted"
   - Add both users to each other's connection array (User model)
   - Create notification: "Connection accepted"

3. **Reject Request**
   - Update status to "rejected"
   - Don't modify connection arrays
   - No notification created

4. **Remove Connection**
   - Delete Connection document
   - Remove both users from each other's connection array

---

### Notification Model

**Location:** `backend/models/notification.model.js`

**Schema Definition:**

```javascript
{
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  // Who receives this notification
  },
  type: {
    type: String,
    enum: ["like", "comment", "connectionAccepted"]
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  // Who performed the action (liker, commenter, etc.)
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"  // Post involved (null for connectionAccepted)
  },
  timestamps: true  // createdAt (for sorting), updatedAt
}
```

**Notification Types:**

| Type | When Created | relatedPost | Example |
|------|-------------|------------|---------|
| `like` | User likes a post | Post ID | "John liked your post" |
| `comment` | User comments on post | Post ID | "Jane commented on your post" |
| `connectionAccepted` | Connection request accepted | null | "John accepted your connection request" |

**Usage:**
- Frontend fetches all notifications for user on load
- Socket.IO emits real-time updates when new notifications created
- Users can delete individual notifications or clear all

---

## Controllers

### Auth Controller

**Location:** `backend/controllers/auth.controllers.js`

**Function 1: `signUp(req, res)`**

Purpose: Register new user with validation, password hashing, and JWT token generation

```javascript
POST /api/auth/signup
Body: {
  firstName: string (required),
  lastName: string (required),
  userName: string (required, unique, alphanumeric only),
  email: string (required, unique),
  password: string (required, min 8 chars)
}

Response: 201
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  profileImage: "",
  coverImage: "",
  headline: "",
  skills: [],
  education: [],
  location: "India",
  gender: null,
  experience: [],
  connection: [],
  createdAt: timestamp,
  updatedAt: timestamp
}

Errors:
- 400: Email already exists
- 400: Username already exists
- 400: Invalid username format (spaces, special chars)
- 400: Password < 8 characters
- 500: Signup error
```

**Validation:**
- Username regex: `/^[a-zA-Z0-9._-]+$/` (no spaces)
- Email uniqueness check
- Password minimum 8 characters
- Normalize username to lowercase

**Password Hashing:**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
// 10 salt rounds for good security/performance balance
```

**JWT Token & Cookie:**
```javascript
const token = await genToken(user._id);  // 7 day expiry
res.cookie("token", token, {
  httpOnly: true,      // JS cannot access (XSS protection)
  maxAge: 7*24*60*60*1000,
  sameSite: "none" (production) | "lax" (dev),
  secure: true (production only),
  path: "/"
});
```

---

**Function 2: `login(req, res)`**

Purpose: Authenticate user and issue JWT token

```javascript
POST /api/auth/login
Body: {
  email: string (required),
  password: string (required)
}

Response: 200
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  profileImage: string,
  coverImage: string,
  headline: string,
  skills: Array,
  education: Array,
  location: string,
  gender: string,
  experience: Array,
  connection: Array,
  createdAt: timestamp,
  updatedAt: timestamp
}

Errors:
- 400: User does not exist
- 400: Incorrect password
- 500: Login error
```

**Password Comparison:**
```javascript
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({message: "incorrect password"});
```

**Set Cookie:** Same as signup

---

**Function 3: `logOut(req, res)`**

Purpose: Clear authentication token and end session

```javascript
GET /api/auth/logout

Response: 200
{
  message: "log out successfully"
}
```

**Clear Cookie:**
```javascript
res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/"
});
```

---

### User Controller

**Location:** `backend/controllers/user.controllers.js`

**Function 1: `getCurrentUser(userId)`**

Fetch logged-in user's full profile

```javascript
GET /api/user/currentuser [AUTH]

Response: 200
{ Full user object }

Errors:
- 401: User not found
- 500: Error fetching user
```

---

**Function 2: `getProfile(userName)`**

Fetch any user's profile by username

```javascript
GET /api/user/profile/:userName [AUTH]

Response: 200
{ User object with all profile details }

Errors:
- 404: User not found
- 500: Error fetching profile
```

---

**Function 3: `search(query)`**

Search users by name, username, or skills using text search

```javascript
GET /api/user/search?query=javascript [AUTH]

Response: 200
[
  { User object 1 },
  { User object 2 },
  ...
]

Errors:
- 500: Search error
```

**Search Method:**
- Uses MongoDB text indexes on: firstName, lastName, userName, skills
- Fallback to regex if text search fails

---

**Function 4: `getSuggestedUser(userId)`**

Get users not in current user's network (suggestions)

```javascript
GET /api/user/suggestedusers [AUTH]

Response: 200
[
  { User 1 - not connected },
  { User 2 - not connected },
  ...
]

Errors:
- 500: Error fetching suggestions
```

**Logic:**
- Fetch all users except: self, already connected, already requested
- Return up to 5-10 random users

---

**Function 5: `updateProfile(userId, firstName, lastName, ...)`**

Update user profile with optional image uploads

```javascript
PUT /api/user/updateprofile [AUTH + MULTIPART]

Form Data: {
  firstName: string,
  lastName: string,
  headline: string,
  location: string,
  skills: Array (JSON string),
  education: Array (JSON string),
  experience: Array (JSON string),
  profileImage: File (optional),
  coverImage: File (optional)
}

Response: 200
{ Updated user object }

Errors:
- 400: Validation error
- 500: Update error
```

**Image Upload Flow:**
1. Receive file buffer from multer
2. Upload to Cloudinary
3. Store Cloudinary URL in user document
4. Return updated user

---

### Post Controller

**Location:** `backend/controllers/post.Controllers.js`

**Function 1: `createPost(userId, description, image)`**

Create new post with optional image

```javascript
POST /api/post/create [AUTH + MULTIPART]

Form Data: {
  description: string,
  image: File (optional)
}

Response: 201
{
  _id: ObjectId,
  author: User object,
  description: string,
  image: string (Cloudinary URL),
  like: [],
  comment: [],
  createdAt: timestamp,
  updatedAt: timestamp
}

Errors:
- 400: Validation error
- 500: Create error
```

**Process:**
1. Validate request (description not empty or image provided)
2. Upload image to Cloudinary (if provided)
3. Create Post document with author, description, image
4. Populate author for response
5. Emit "postCreated" socket event to all clients
6. Return created post

---

**Function 2: `getPost()`**

Fetch all posts (paginated) sorted by newest first

```javascript
GET /api/post/getpost?page=1&limit=10 [AUTH]

Response: 200
[
  { Post 1 with author and comments populated },
  { Post 2 with author and comments populated },
  ...
]

Errors:
- 500: Fetch error
```

**Features:**
- Pagination: default 10 posts per page
- Sort by createdAt descending (newest first)
- Populate author and comment.user for frontend display

---

**Function 3: `like(postId, userId)`**

Toggle like on post (like or unlike)

```javascript
GET /api/post/like/:id [AUTH]

Response: 200
{ Updated post object }

Errors:
- 404: Post not found
- 500: Like error
```

**Logic:**
1. Check if user already liked the post
2. If yes: remove like (use `$pull`)
3. If no: add like (use `$addToSet` to prevent duplicates)
4. Create notification if new like: type: "like"
5. Emit "postUpdated" socket event
6. Return updated post

---

**Function 4: `comment(postId, userId, content)`**

Add comment to post

```javascript
POST /api/post/comment/:id [AUTH]

Body: {
  content: string (required)
}

Response: 200
{ Updated post with new comment }

Errors:
- 404: Post not found
- 400: Empty comment
- 500: Comment error
```

**Process:**
1. Validate comment content (not empty)
2. Create comment object with content and user ID
3. Push to post.comment array
4. Create notification for post author: type: "comment"
5. Populate the new comment's user field
6. Emit "postUpdated" socket event
7. Return updated post

---

### Connection Controller

**Location:** `backend/controllers/connection.controllers.js`

**Function 1: `sendConnection(sender, receiver)`**

Send connection request from one user to another

```javascript
POST /api/connection/send/:userId [AUTH]

Response: 201
{
  _id: ObjectId,
  sender: ObjectId,
  receiver: ObjectId,
  status: "pending",
  createdAt: timestamp,
  updatedAt: timestamp
}

Errors:
- 400: Already connected
- 400: Request already pending
- 400: Cannot send to self
- 500: Send error
```

**Validation:**
- Prevent duplicate requests
- Prevent sending to self
- Check existing connection status

**Socket Emit:**
- Emit "statusUpdate" to all clients with new status

---

**Function 2: `acceptConnection(connectionId, userId)`**

Accept pending connection request

```javascript
PUT /api/connection/accept/:connectionId [AUTH]

Response: 200
{
  _id: ObjectId,
  sender: ObjectId,
  receiver: ObjectId,
  status: "accepted",
  createdAt: timestamp,
  updatedAt: timestamp
}

Errors:
- 404: Connection not found
- 400: Not a pending request
- 500: Accept error
```

**Process:**
1. Find Connection by ID
2. Verify receiver is current user
3. Update status to "accepted"
4. Add sender to receiver's connection array
5. Add receiver to sender's connection array
6. Create notification for sender: type: "connectionAccepted"
7. Emit "statusUpdate" socket event
8. Return updated connection

---

**Function 3: `rejectConnection(connectionId, userId)`**

Reject pending connection request

```javascript
PUT /api/connection/reject/:connectionId [AUTH]

Response: 200
{
  _id: ObjectId,
  sender: ObjectId,
  receiver: ObjectId,
  status: "rejected",
  createdAt: timestamp,
  updatedAt: timestamp
}

Errors:
- 404: Connection not found
- 400: Not a pending request
- 500: Reject error
```

**Process:**
1. Find Connection by ID
2. Verify receiver is current user
3. Update status to "rejected"
4. Emit "statusUpdate" socket event
5. Return updated connection

---

**Function 4: `getConnectionStatus(targetUserId, currentUserId)`**

Get connection status between current user and target user

```javascript
GET /api/connection/getstatus/:userId [AUTH]

Response: 200
{
  status: "Connect" | "pending" | "received" | "connected"
}
```

**Status Logic:**
- **"Connect"**: No relationship
- **"pending"**: Current user sent request to target
- **"received"**: Target user sent request to current user
- **"connected"**: Already connected

---

**Function 5: `removeConnection(targetUserId, currentUserId)`**

Remove/disconnect from a user

```javascript
DELETE /api/connection/remove/:userId [AUTH]

Response: 200
{ Success message }

Errors:
- 404: Connection not found
- 500: Remove error
```

**Process:**
1. Delete Connection documents (both directions if exists)
2. Remove both users from each other's connection arrays
3. Emit "statusUpdate" socket event
4. Return success

---

**Function 6: `getConnectionRequests(userId)`**

Fetch all pending connection requests for current user

```javascript
GET /api/connection/requests [AUTH]

Response: 200
[
  {
    _id: ObjectId,
    sender: { Full user object },
    receiver: ObjectId,
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp
  },
  ...
]

Errors:
- 500: Fetch error
```

**Features:**
- Populate sender with full user details
- Sort by newest first
- Only returns pending requests

---

**Function 7: `getUserConnections(userId)`**

Fetch all accepted connections for current user

```javascript
GET /api/connection/ [AUTH]

Response: 200
[
  {
    _id: ObjectId,
    sender: { User object },
    receiver: { User object } | ObjectId,
    status: "accepted",
    createdAt: timestamp,
    updatedAt: timestamp
  },
  ...
]

Errors:
- 500: Fetch error
```

**Features:**
- Returns both where user is sender and receiver
- Populate both sides to get user details
- Only returns accepted connections

---

### Notification Controller

**Location:** `backend/controllers/notification.controllers.js`

**Function 1: `getNotifications(userId)`**

Fetch all notifications for current user

```javascript
GET /api/notification/get [AUTH]

Response: 200
[
  {
    _id: ObjectId,
    receiver: ObjectId,
    type: "like" | "comment" | "connectionAccepted",
    relatedUser: { User object },
    relatedPost: { Post object },
    createdAt: timestamp,
    updatedAt: timestamp
  },
  ...
]

Errors:
- 500: Fetch error
```

**Features:**
- Sorted by newest first (createdAt descending)
- Populated with relatedUser and relatedPost details
- Limit to last 100 notifications (optional)

---

**Function 2: `deleteNotification(notificationId, userId)`**

Delete single notification

```javascript
DELETE /api/notification/deleteone/:id [AUTH]

Response: 200
{ Success message }

Errors:
- 404: Notification not found
- 500: Delete error
```

---

**Function 3: `clearAllNotification(userId)`**

Clear all notifications for current user

```javascript
DELETE /api/notification/ [AUTH]

Response: 200
{ Success message }

Errors:
- 500: Clear error
```

---

## Routes

### Auth Routes

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|-----------|-----------|-------------|
| POST | `/api/auth/signup` | - | `signUp` | Register new user |
| POST | `/api/auth/login` | - | `login` | Authenticate user |
| GET | `/api/auth/logout` | `isAuth` | `logOut` | Logout and clear token |

---

### User Routes

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|-----------|-----------|-------------|
| GET | `/api/user/currentuser` | `isAuth` | `getCurrentUser` | Get logged-in user's profile |
| GET | `/api/user/profile/:userName` | `isAuth` | `getProfile` | Get any user's profile by username |
| GET | `/api/user/search` | `isAuth` | `search` | Search users by name/skills (query param: ?query=) |
| GET | `/api/user/suggestedusers` | `isAuth` | `getSuggestedUser` | Get users not in network |
| PUT | `/api/user/updateprofile` | `isAuth`, `upload.fields()` | `updateProfile` | Update profile with image uploads |

---

### Post Routes

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|-----------|-----------|-------------|
| POST | `/api/post/create` | `isAuth`, `upload.single()` | `createPost` | Create new post with optional image |
| GET | `/api/post/getpost` | `isAuth` | `getPost` | Fetch all posts (paginated) |
| GET | `/api/post/like/:id` | `isAuth` | `like` | Toggle like on post |
| POST | `/api/post/comment/:id` | `isAuth` | `comment` | Add comment to post |

---

### Connection Routes

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|-----------|-----------|-------------|
| POST | `/api/connection/send/:id` | `isAuth` | `sendConnection` | Send connection request |
| PUT | `/api/connection/accept/:connectionId` | `isAuth` | `acceptConnection` | Accept pending request |
| PUT | `/api/connection/reject/:connectionId` | `isAuth` | `rejectConnection` | Reject pending request |
| GET | `/api/connection/getstatus/:userId` | `isAuth` | `getConnectionStatus` | Get connection status |
| DELETE | `/api/connection/remove/:userId` | `isAuth` | `removeConnection` | Remove/disconnect from user |
| GET | `/api/connection/requests` | `isAuth` | `getConnectionRequests` | Get all pending requests |
| GET | `/api/connection/` | `isAuth` | `getUserConnections` | Get all accepted connections |

---

### Notification Routes

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|-----------|-----------|-------------|
| GET | `/api/notification/get` | `isAuth` | `getNotifications` | Get all notifications for user |
| DELETE | `/api/notification/deleteone/:id` | `isAuth` | `deleteNotification` | Delete single notification |
| DELETE | `/api/notification/` | `isAuth` | `clearAllNotification` | Clear all notifications |

---

## Middlewares

### isAuth Middleware

**Location:** `backend/middlewares/isAuth.js`

**Purpose:** Verify JWT token from HTTP-only cookies and protect authenticated routes

**Flow:**
1. Extract `token` from `req.cookies`
2. If missing or invalid, return 401 Unauthorized
3. Verify token signature using `JWT_SECRET`
4. Extract and store `userId` in `req.userId`
5. Call `next()` to proceed to controller

**Usage:**
```javascript
// Protect route by adding isAuth middleware
authRouter.post('/logout', isAuth, logoutController)
```

**Error Handling:**
- 401: Missing token
- 401: Invalid or expired token
- 401: JWT verification failed

**Important Notes:**
- Must be placed AFTER cookieParser middleware
- Token validation happens on every protected request
- Failed auth prevents controller from executing

---

### Multer Middleware

**Location:** `backend/middlewares/multer.js`

**Purpose:** Handle file uploads (images) from frontend requests

**Configuration:**
```javascript
const storage = multer.memoryStorage();
// Stores files in RAM instead of disk
// Better for cloud uploads (Cloudinary), no temp files

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024  // 10MB max file size
  }
});
```

**Usage Examples:**

```javascript
// Single file upload
router.post('/create', upload.single("image"), createPost)
// Access via: req.file.buffer, req.file.originalname, req.file.mimetype

// Multiple files
router.put('/profile', upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]), updateProfile)
// Access via: req.files.profileImage[0], req.files.coverImage[0]
```

**Important:**
- Memory storage keeps entire file in RAM; watch for large files
- 10MB limit matches Cloudinary free tier
- Files uploaded to Cloudinary, URL stored in database

---

## API Endpoints Reference

### Authentication Endpoints

#### POST /api/auth/signup

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe123",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe123",
  "email": "john@example.com",
  "profileImage": "",
  "coverImage": "",
  "headline": "",
  "skills": [],
  "education": [],
  "location": "India",
  "gender": null,
  "experience": [],
  "connection": [],
  "createdAt": "2024-02-15T10:30:00.000Z",
  "updatedAt": "2024-02-15T10:30:00.000Z"
}
```

**Set-Cookie Header:**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=604800000; Path=/; SameSite=lax
```

---

#### POST /api/auth/login

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe123",
  "email": "john@example.com",
  "profileImage": "https://res.cloudinary.com/...",
  "coverImage": "https://res.cloudinary.com/...",
  "headline": "Senior Developer",
  "skills": ["React", "Node.js", "MongoDB"],
  "education": [
    {
      "college": "MIT",
      "degree": "BS",
      "fieldOfStudy": "Computer Science"
    }
  ],
  "location": "San Francisco",
  "gender": "male",
  "experience": [
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "description": "Led development team..."
    }
  ],
  "connection": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "createdAt": "2024-01-20T08:15:00.000Z",
  "updatedAt": "2024-02-15T12:45:00.000Z"
}
```

---

#### GET /api/auth/logout

**Response (200):**
```json
{
  "message": "log out successfully"
}
```

---

### User Endpoints

#### GET /api/user/currentuser

**Headers:** `Cookie: token=...`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe123",
  "email": "john@example.com",
  "profileImage": "https://res.cloudinary.com/...",
  "coverImage": "https://res.cloudinary.com/...",
  "headline": "Senior Developer",
  "skills": ["React", "Node.js", "MongoDB"],
  "education": [...],
  "location": "San Francisco",
  "gender": "male",
  "experience": [...],
  "connection": [...],
  "createdAt": "2024-01-20T08:15:00.000Z",
  "updatedAt": "2024-02-15T12:45:00.000Z"
}
```

---

#### GET /api/user/profile/:userName

**Example:** `GET /api/user/profile/johndoe123`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe123",
  "profileImage": "https://res.cloudinary.com/...",
  "coverImage": "https://res.cloudinary.com/...",
  "headline": "Senior Developer",
  "skills": ["React", "Node.js"],
  "education": [...],
  "location": "San Francisco",
  "experience": [...],
  "connection": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "janesmith",
      "profileImage": "..."
    }
  ],
  "createdAt": "2024-01-20T08:15:00.000Z",
  "updatedAt": "2024-02-15T12:45:00.000Z"
}
```

---

#### GET /api/user/search?query=react

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "johndoe123",
    "profileImage": "https://res.cloudinary.com/...",
    "headline": "React Developer",
    "skills": ["React", "Node.js"],
    "connection": []
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "userName": "janesmith",
    "profileImage": "https://res.cloudinary.com/...",
    "headline": "React Specialist",
    "skills": ["React", "TypeScript"],
    "connection": []
  }
]
```

---

#### GET /api/user/suggestedusers

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "userName": "janesmith",
    "profileImage": "https://res.cloudinary.com/...",
    "headline": "Full Stack Developer",
    "skills": ["React", "Node.js", "MongoDB"]
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Bob",
    "lastName": "Johnson",
    "userName": "bobjohnson",
    "profileImage": "https://res.cloudinary.com/...",
    "headline": "DevOps Engineer",
    "skills": ["Kubernetes", "Docker", "AWS"]
  }
]
```

---

#### PUT /api/user/updateprofile

**Headers:** `Content-Type: multipart/form-data`

**Form Data:**
```
firstName: "John"
lastName: "Doe"
headline: "Senior Developer at Tech Corp"
location: "San Francisco, CA"
skills: '["React", "Node.js", "MongoDB", "TypeScript"]' (JSON string)
education: '[{"college": "MIT", "degree": "BS", "fieldOfStudy": "CS"}]'
experience: '[{"title": "Senior Dev", "company": "Tech Corp", "description": "..."}]'
profileImage: (File)
coverImage: (File)
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe123",
  "email": "john@example.com",
  "profileImage": "https://res.cloudinary.com/...",
  "coverImage": "https://res.cloudinary.com/...",
  "headline": "Senior Developer at Tech Corp",
  "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
  "education": [{"college": "MIT", "degree": "BS", "fieldOfStudy": "CS"}],
  "location": "San Francisco, CA",
  "gender": "male",
  "experience": [{"title": "Senior Dev", "company": "Tech Corp", "description": "..."}],
  "connection": [...],
  "createdAt": "2024-01-20T08:15:00.000Z",
  "updatedAt": "2024-02-15T14:30:00.000Z"
}
```

---

### Post Endpoints

#### POST /api/post/create

**Headers:** `Content-Type: multipart/form-data`

**Form Data:**
```
description: "Just launched a new React project! #ReactJS #WebDevelopment"
image: (optional File)
```

**Response (201):**
```json
{
  "_id": "607f1f77bcf86cd799439020",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "johndoe123",
    "profileImage": "https://res.cloudinary.com/...",
    "headline": "Senior Developer"
  },
  "description": "Just launched a new React project! #ReactJS #WebDevelopment",
  "image": "https://res.cloudinary.com/...",
  "like": [],
  "comment": [],
  "createdAt": "2024-02-15T15:45:00.000Z",
  "updatedAt": "2024-02-15T15:45:00.000Z"
}
```

---

#### GET /api/post/getpost?page=1&limit=10

**Response (200):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439020",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "johndoe123",
      "profileImage": "https://res.cloudinary.com/...",
      "headline": "Senior Developer"
    },
    "description": "Just launched a new React project!",
    "image": "https://res.cloudinary.com/...",
    "like": [
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013"
    ],
    "comment": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "content": "Great work!",
        "user": {
          "_id": "507f1f77bcf86cd799439012",
          "firstName": "Jane",
          "lastName": "Smith",
          "userName": "janesmith",
          "profileImage": "https://res.cloudinary.com/..."
        }
      }
    ],
    "createdAt": "2024-02-15T15:45:00.000Z",
    "updatedAt": "2024-02-15T16:20:00.000Z"
  }
]
```

---

#### GET /api/post/like/:postId

**Example:** `GET /api/post/like/607f1f77bcf86cd799439020`

**Response (200):**
```json
{
  "_id": "607f1f77bcf86cd799439020",
  "author": {...},
  "description": "Just launched a new React project!",
  "image": "https://res.cloudinary.com/...",
  "like": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ],
  "comment": [...],
  "createdAt": "2024-02-15T15:45:00.000Z",
  "updatedAt": "2024-02-15T16:25:00.000Z"
}
```

**Note:** If user already in like array, they're removed. If not in array, they're added.

---

#### POST /api/post/comment/:postId

**Example:** `POST /api/post/comment/607f1f77bcf86cd799439020`

**Request:**
```json
{
  "content": "This looks amazing! Well done 🎉"
}
```

**Response (200):**
```json
{
  "_id": "607f1f77bcf86cd799439020",
  "author": {...},
  "description": "Just launched a new React project!",
  "image": "https://res.cloudinary.com/...",
  "like": ["507f1f77bcf86cd799439012"],
  "comment": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "content": "This looks amazing! Well done 🎉",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "userName": "johndoe123",
        "profileImage": "https://res.cloudinary.com/..."
      }
    }
  ],
  "createdAt": "2024-02-15T15:45:00.000Z",
  "updatedAt": "2024-02-15T16:30:00.000Z"
}
```

---

### Connection Endpoints

#### POST /api/connection/send/:userId

**Example:** `POST /api/connection/send/507f1f77bcf86cd799439012`

**Response (201):**
```json
{
  "_id": "607f1f77bcf86cd799439040",
  "sender": "507f1f77bcf86cd799439011",
  "receiver": "507f1f77bcf86cd799439012",
  "status": "pending",
  "createdAt": "2024-02-15T17:00:00.000Z",
  "updatedAt": "2024-02-15T17:00:00.000Z"
}
```

---

#### PUT /api/connection/accept/:connectionId

**Example:** `PUT /api/connection/accept/607f1f77bcf86cd799439040`

**Response (200):**
```json
{
  "_id": "607f1f77bcf86cd799439040",
  "sender": "507f1f77bcf86cd799439011",
  "receiver": "507f1f77bcf86cd799439012",
  "status": "accepted",
  "createdAt": "2024-02-15T17:00:00.000Z",
  "updatedAt": "2024-02-15T17:15:00.000Z"
}
```

**Result:**
- Status changes to "accepted"
- Both users added to each other's connection array
- Notification created for sender

---

#### PUT /api/connection/reject/:connectionId

**Example:** `PUT /api/connection/reject/607f1f77bcf86cd799439040`

**Response (200):**
```json
{
  "_id": "607f1f77bcf86cd799439040",
  "sender": "507f1f77bcf86cd799439011",
  "receiver": "507f1f77bcf86cd799439012",
  "status": "rejected",
  "createdAt": "2024-02-15T17:00:00.000Z",
  "updatedAt": "2024-02-15T17:15:00.000Z"
}
```

---

#### GET /api/connection/getstatus/:userId

**Example:** `GET /api/connection/getstatus/507f1f77bcf86cd799439012`

**Response (200):**
```json
{
  "status": "Connect"
}
```

**Possible Status Values:**
- `"Connect"` - Not connected, can send request
- `"pending"` - Request sent by current user, waiting
- `"received"` - Request received from this user, can accept/reject
- `"connected"` - Already connected

---

#### DELETE /api/connection/remove/:userId

**Example:** `DELETE /api/connection/remove/507f1f77bcf86cd799439012`

**Response (200):**
```json
{
  "message": "Connection removed successfully"
}
```

---

#### GET /api/connection/requests

**Response (200):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439040",
    "sender": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "janesmith",
      "profileImage": "https://res.cloudinary.com/...",
      "headline": "Full Stack Developer",
      "location": "New York"
    },
    "receiver": "507f1f77bcf86cd799439011",
    "status": "pending",
    "createdAt": "2024-02-15T17:00:00.000Z",
    "updatedAt": "2024-02-15T17:00:00.000Z"
  }
]
```

---

#### GET /api/connection/

**Response (200):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439041",
    "sender": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "johndoe123",
      "profileImage": "https://res.cloudinary.com/...",
      "headline": "Senior Developer"
    },
    "receiver": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "janesmith",
      "profileImage": "https://res.cloudinary.com/...",
      "headline": "Full Stack Developer"
    },
    "status": "accepted",
    "createdAt": "2024-02-15T16:00:00.000Z",
    "updatedAt": "2024-02-15T17:00:00.000Z"
  }
]
```

---

### Notification Endpoints

#### GET /api/notification/get

**Response (200):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439050",
    "receiver": "507f1f77bcf86cd799439011",
    "type": "like",
    "relatedUser": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "janesmith",
      "profileImage": "https://res.cloudinary.com/..."
    },
    "relatedPost": {
      "_id": "607f1f77bcf86cd799439020",
      "description": "Just launched a new React project!",
      "image": "https://res.cloudinary.com/..."
    },
    "createdAt": "2024-02-15T16:30:00.000Z",
    "updatedAt": "2024-02-15T16:30:00.000Z"
  },
  {
    "_id": "607f1f77bcf86cd799439051",
    "receiver": "507f1f77bcf86cd799439011",
    "type": "connectionAccepted",
    "relatedUser": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "janesmith",
      "profileImage": "https://res.cloudinary.com/..."
    },
    "relatedPost": null,
    "createdAt": "2024-02-15T17:00:00.000Z",
    "updatedAt": "2024-02-15T17:00:00.000Z"
  }
]
```

---

#### DELETE /api/notification/deleteone/:notificationId

**Example:** `DELETE /api/notification/deleteone/607f1f77bcf86cd799439050`

**Response (200):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

#### DELETE /api/notification/

**Response (200):**
```json
{
  "message": "All notifications cleared successfully"
}
```

---

## Backend Development Guidelines

### Best Practices

1. **Always validate input**
   - Check required fields
   - Validate data types
   - Sanitize strings to prevent injections

2. **Error handling**
   - Use try-catch in async functions
   - Return appropriate HTTP status codes
   - Send meaningful error messages (avoid exposing server internals)

3. **Database queries**
   - Use indexes for frequently queried fields
   - Populate references only when needed
   - Exclude sensitive fields (password) in queries
   - Use `.lean()` when you only need JSON (faster)

4. **Authentication & Authorization**
   - Always use isAuth middleware for protected routes
   - Verify ownership before allowing updates/deletes
   - Never return passwords in responses

5. **File uploads**
   - Validate file types and sizes
   - Store files in cloud (Cloudinary)
   - Delete old images when updating

6. **Real-time updates**
   - Emit socket events after database changes
   - Include updated data in response
   - Broadcast to relevant users only

7. **Code organization**
   - Keep controllers focused on request handling
   - Move complex logic to separate utility functions
   - Use consistent error response format

---

### Code Structure Example

```javascript
// Good: Separation of concerns
const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.userId;
    
    // Validate
    if (!description && !req.file) {
      return res.status(400).json({message: "Post must have text or image"});
    }
    
    // Upload image if provided
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }
    
    // Create post
    const post = await Post.create({
      author: userId,
      description,
      image: imageUrl
    }).populate("author");
    
    // Real-time update
    io.emit("postCreated", post);
    
    // Response
    return res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error creating post"});
  }
};
```

---

## Security Practices

### Authentication Security

1. **Password Security**
   - Hash with bcryptjs (10 salt rounds)
   - Never return password in responses
   - Require minimum 8 characters
   - Consider adding complexity rules (uppercase, numbers, special chars)

2. **JWT Token Security**
   - Use strong JWT_SECRET (min 32 characters)
   - Set expiration to 7 days
   - Store only userId in token payload
   - Use HTTP-only cookies (prevent XSS)

3. **Cookie Configuration**
   ```javascript
   res.cookie("token", token, {
     httpOnly: true,      // Prevent JS access (XSS protection)
     secure: isProd,      // HTTPS only in production
     sameSite: "none" : "lax",  // CSRF protection
     maxAge: 7*24*60*60*1000,   // 7 days
     path: "/"
   });
   ```

### HTTP Security

1. **Helmet.js**
   - Removes vulnerable headers
   - Sets security headers automatically
   - Protects against clickjacking, XSS, etc.

2. **CORS Configuration**
   ```javascript
   cors({
     origin: [process.env.VITE_FRONTEND_URL],
     credentials: true  // Allow cookies with cross-origin requests
   })
   ```

3. **Input Validation**
   - Validate all inputs
   - Use Joi for schema validation
   - Prevent SQL injection (MongoDB mitigates with schema)

### Data Security

1. **Database**
   - Don't store sensitive data in logs
   - Use environment variables for credentials
   - Regular backups

2. **File Uploads**
   - Validate file types
   - Limit file size (10MB)
   - Store in secure cloud storage (Cloudinary)

3. **Authorization**
   - Verify user owns resource before modifying
   - Check permissions before allowing actions
   - Prevent privilege escalation

### Environment Variables

Never commit sensitive data to Git:
```bash
# .gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
```

---

# Contributing Guidelines

## General Contributing Guidelines

1. **Fork the Repository**
   - Create your own fork of the project
   - Clone your fork locally: `git clone https://github.com/your-username/ProLink.git`

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

3. **Commit Messages**
   - Write clear, descriptive commit messages
   - Use present tense: "Add feature" not "Added feature"
   - Reference issues: "Fixes #123"
   - Example: `git commit -m "Add user search functionality (fixes #45)"`

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**
   - Write a clear PR description
   - Explain what your PR does
   - Reference any related issues
   - Wait for code review

6. **Code Review**
   - Be open to feedback
   - Discuss suggestions respectfully
   - Update your PR based on feedback
   - All feedback should be addressed before merging

## Frontend Contributing Guidelines

### Code Style
- Use ES6+ syntax
- Use functional components and hooks (React best practices)
- Keep components under 200 lines
- Use meaningful variable names

### Component Guidelines
- Create reusable, single-responsibility components
- Document component props with JSDoc
- Use proper error boundaries
- Implement loading states

### Testing
- Test complex components manually
- Ensure responsive design on all screen sizes
- Test on mobile devices
- Check accessibility (keyboard navigation, screen readers)

### File Naming
- Components: PascalCase (e.g., `UserProfile.jsx`)
- Utilities: camelCase (e.g., `formatDate.js`)
- Styles: Match component name

### Commits
- Make small, logical commits
- Each commit should be independently testable
- Commit related changes together

## Backend Contributing Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Use async/await for asynchronous operations
- Add comments for complex logic
- Follow existing naming conventions

### API Guidelines
- RESTful principles (GET for read, POST for create, PUT for update, DELETE for delete)
- Consistent error responses
- Include proper HTTP status codes
- Document endpoint behavior in comments

### Database Guidelines
- Always validate input before database operations
- Use indexes for frequently queried fields
- Write efficient queries
- Use transactions for complex operations

### Error Handling
- Try-catch all async operations
- Return appropriate HTTP status codes
- Log errors server-side
- Don't expose sensitive error details to client

### Testing
- Test API endpoints manually with Postman
- Test with various inputs (empty, invalid, boundary cases)
- Test error scenarios
- Verify socket events are emitted correctly

### Commits
- Make logical, reviewable commits
- Include error handling in commits
- Test changes before committing
- Reference issues in commit messages

## Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this change?

## Checklist
- [ ] Code follows project style guidelines
- [ ] Changes are well-commented
- [ ] No new errors/warnings introduced
- [ ] Related issues are referenced
- [ ] Changes are tested
```

---

# License

This project is licensed under the ISC License. See the LICENSE file for details.

---

## Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **Socket.IO Documentation**: https://socket.io/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js
- **Cloudinary API**: https://cloudinary.com/documentation

---

**Last Updated:** February 15, 2025  
**Version:** 1.0.0  
**Author:** Ayush Sahu

For questions or issues, please open a GitHub issue or contact the development team.
