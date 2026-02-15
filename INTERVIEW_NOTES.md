# ProLink - Interview Preparation Notes

**Interview Ready Cheat Sheet for ProLink - LinkedIn Clone**

---

## Quick Overview

ProLink is a **full-stack social networking application** similar to LinkedIn. It's built with **React (frontend)**, **Node.js/Express (backend)**, **MongoDB (database)**, and **Socket.IO (real-time features)**.

**Key Stats:**
- Frontend: React 19, Vite, Tailwind CSS
- Backend: Express.js, MongoDB, Socket.IO
- Authentication: JWT with HTTP-only cookies
- Image Storage: Cloudinary
- Real-time: Socket.IO for notifications and connection updates

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER BROWSER                               │
│                   (React Frontend)                                │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP & WebSocket
         ┌───────────┼───────────┐
         │           │           │
    REST APIs   Socket.IO  Static Assets
         │           │           │
┌────────▼───────────▼───────────▼─────────────────────────────────┐
│                    EXPRESS SERVER                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Routes: /api/auth, /api/user, /api/post, /api/connection    │ │
│  │         /api/notification                                    │ │
│  │ Middleware: isAuth (JWT verification), multer (file upload) │ │
│  │ Controllers: Handle business logic, call models              │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
      MongoDB    Cloudinary   Socket.IO
      (Data)    (Images)   (Real-time)
         │           │           │
```

---

## Data Flow - User Journey

### 1. **User Registration & Login**
```
Frontend Input: firstName, lastName, userName, email, password
    ↓
POST /api/auth/signup [No Auth Needed]
    ↓
Backend: 
  • Validate inputs (duplicate email, username format)
  • Hash password with bcryptjs (10 rounds)
  • Create user document in MongoDB
  • Generate JWT token (7 day expiry)
    ↓
Set HTTP-only Cookie with JWT
    ↓
Frontend: Store userData in UserContext
    ↓
User logged in, redirected to /home
```

### 2. **Creating a Post with Image**
```
Frontend: User writes post description, uploads image
    ↓
POST /api/post/create [AUTH + MULTIPART]
    ↓
Backend:
  • Verify JWT token (isAuth middleware)
  • Extract userId from token
  • Upload image to Cloudinary (if provided)
  • Create Post document: {author, description, image, like[], comment[]}
  • Populate author details
    ↓
Emit "postCreated" event via Socket.IO to all connected users
    ↓
Frontend receives socket event, adds post to postData array
    ↓
Post appears instantly in feed for all users
```

### 3. **Liking a Post**
```
Frontend: User clicks like button
    ↓
GET /api/post/like/:postId [AUTH]
    ↓
Backend:
  • Check if userId in post.like array
  • If present: Remove userId from like array ($pull)
  • If absent: Add userId to like array ($addToSet)
  • Create Notification if new like
  • Populate post details
    ↓
Return updated post with new like count
    ↓
Emit "postUpdated" socket event
    ↓
Frontend: Update post component with new like count
    ↓
Like number changes instantly (optimistic UI)
```

### 4. **Connection Request Flow**
```
Frontend: User clicks "Connect" on profile
    ↓
POST /api/connection/send/:userId [AUTH]
    ↓
Backend:
  • Create Connection doc: {sender, receiver, status: "pending"}
  • Socket emit "statusUpdate" to sender & receiver
    ↓
Frontend (Receiver): 
  • Receives socket event
  • Button changes from "Connect" to "Pending"
    ↓
Receiver accepts request:
PUT /api/connection/accept/:connectionId [AUTH]
    ↓
Backend:
  • Update Connection status to "accepted"
  • Add sender to receiver's connection array
  • Add receiver to sender's connection array
  • Create Notification for sender
  • Emit "statusUpdate" socket event
    ↓
Both users see "Connected" button
Both users appear in each other's connections list
```

### 5. **Real-time Notifications**
```
When someone:
  • Likes your post
  • Comments on your post
  • Accepts your connection request
    ↓
Backend creates Notification document:
  {receiver, type: "like"/"comment"/"connectionAccepted", 
   relatedUser, relatedPost}
    ↓
Emit "notificationCreated" socket event to specific user
    ↓
Frontend:
  • Receives socket event in real-time
  • Adds notification to notifications array
  • Shows notification badge/icon
    ↓
User can:
  • Click notification to view related post
  • Delete individual notification
  • Clear all notifications
```

---

## Database Schema Design

### **User Model**
```javascript
{
  // Profile Info
  firstName, lastName, userName (unique), email (unique)
  password (hashed), profileImage (Cloudinary URL), 
  coverImage (Cloudinary URL)
  
  // Professional Info
  headline (job title), location, gender
  skills: ["React", "Node.js", ...]
  education: [{college, degree, fieldOfStudy}, ...]
  experience: [{title, company, description}, ...]
  
  // Relationships
  connection: [userId, userId, ...]  // Array of User IDs
  
  timestamps: createdAt, updatedAt
}

Indexes:
  • userName, email: For fast login & profile lookup
  • Full-text on firstName, lastName, userName, skills: For search
```

### **Post Model**
```javascript
{
  author: ObjectId (ref to User)
  description: String
  image: String (Cloudinary URL)
  
  // Engagement
  like: [userId, userId, ...]  // Users who liked
  comment: [{content, user: ObjectId (ref to User)}, ...]
  
  timestamps: createdAt, updatedAt
}

Indexes:
  • author: Get all posts by user (profile page)
  • createdAt (desc): Sort feed by newest
  • like, comment.user: Analytics queries
```

### **Connection Model**
```javascript
{
  sender: ObjectId (User who sent request)
  receiver: ObjectId (User who receives request)
  status: "pending" | "accepted" | "rejected"
  timestamps: createdAt, updatedAt
}

Index:
  • (sender, receiver): Check if already connected
  • (receiver, status): Get all pending requests for user
```

### **Notification Model**
```javascript
{
  receiver: ObjectId (User who gets notification)
  type: "like" | "comment" | "connectionAccepted"
  relatedUser: ObjectId (Who performed action)
  relatedPost: ObjectId (Post involved, null for connection)
  timestamps: createdAt, updatedAt
}
```

---

## Key Design Patterns Used

### 1. **MVC Pattern (Backend)**
```
Model (MongoDB schemas - user.model.js, post.model.js, etc.)
    ↓ Data Structure
View (JSON responses sent to frontend)
    ↓ Data Presentation
Controller (auth.controllers.js, post.Controllers.js, etc.)
    ↓ Business Logic
```

### 2. **Context API Pattern (Frontend State Management)**
```
AuthContext: Provides serverUrl to entire app
    ↓
UserContext: Provides userData, posts, socket connection
    ↓
Components can access via useContext() without prop drilling
```

### 3. **Middleware Pattern (Backend)**
```
Request → isAuth (verify JWT) → multer (parse files) → Controller → Response
Each middleware can:
  • Validate
  • Transform data
  • Stop if unauthorized
  • Pass control to next
```

### 4. **Real-time Pub-Sub (Socket.IO)**
```
User A (Publisher): Takes action (like, comment, connect)
    ↓
Backend: Creates/updates data, emits socket event
    ↓
User B (Subscriber): Receives socket event, updates UI instantly
```

---

## Performance Optimizations

### **Frontend Optimizations**

1. **Code Splitting with React.lazy()**
   - Each page wrapped in React.lazy()
   - Pages load only when accessed
   - Initial bundle smaller, faster load
   ```javascript
   const Home = lazy(() => import('./pages/Home'))
   const Profile = lazy(() => import('./pages/Profile'))
   // Load on demand, not at startup
   ```

2. **Vite Build Optimization**
   - Manual code chunks: react-vendor, icons separated
   - Terser minification removes console logs
   - Dependencies pre-bundled for faster startup
   ```javascript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom', 'react-router-dom'],
           'icons': ['react-icons/io5', 'react-icons/ti', 'react-icons/fa6'],
         }
       }
     }
   }
   ```

3. **Tailwind CSS Purging**
   - Only used CSS classes included in production
   - Unused styles removed automatically
   - Smaller CSS file size

4. **Axios with Credentials**
   - Configured once in AxiosInstance.jsx
   - Reused across app
   - Prevents repetitive configuration

5. **Socket.IO Connection Pool**
   - Single socket connection per session
   - Reused for all real-time events
   - Reduces server load

### **Backend Optimizations**

1. **MongoDB Indexes**
   ```javascript
   // Without indexes: O(n) search
   // With indexes: O(log n) search
   
   User: userName, email (fast login)
   Post: author, createdAt (fast feed queries)
   Connection: (sender, receiver), (receiver, status)
   ```

2. **Selective Population**
   ```javascript
   // Inefficient: Always populate
   Post.find().populate("author").populate("comment.user")
   
   // Efficient: Populate only needed fields
   Post.find().select("-password").populate("author")
   ```

3. **Memory-based File Storage (Multer)**
   ```javascript
   // Store in RAM instead of disk
   const storage = multer.memoryStorage()
   // Send directly to Cloudinary without temp files
   // Faster, cleaner
   ```

4. **Response Compression**
   ```javascript
   app.use(compression())
   // Compresses all responses with gzip
   // Reduces response size by 70%
   ```

5. **JWT Token Expiry**
   ```javascript
   // Short-lived tokens (7 days)
   expiresIn: "7d"
   // Less damage if stolen
   // User re-authenticates periodically
   ```

6. **HTTP-only Cookies**
   ```javascript
   // Token in HTTP-only cookie
   httpOnly: true
   // JS cannot access (prevents XSS attacks)
   // Automatically sent with requests
   ```

---

## Full Structure Walkthrough

### **Frontend Structure**
```
src/
├── pages/           → 6 pages (Home, Profile, Network, Notification, Login, Signup)
├── components/      → 4 reusable components (Nav, Post, ConnectionButton, EditProfile)
├── context/         → 2 contexts (AuthContext for serverUrl, UserContext for user data)
├── axios/           → Configured Axios instance
├── assets/          → Images and static files
└── main.jsx         → Entry point
```

**Data Flow (Frontend):**
```
App.jsx (Routes)
  └─ AuthContext (provides serverUrl)
      └─ UserContext (provides userData, postData, socket)
          └─ Pages (Home, Profile, etc.)
              └─ Components (Post, Nav, ConnectionButton)
```

### **Backend Structure**
```
backend/
├── config/          → DB, JWT token, Cloudinary setup
├── models/          → 4 schemas (User, Post, Connection, Notification)
├── controllers/     → 5 controllers with all business logic
├── routes/          → 5 route files (auth, user, post, connection, notification)
├── middlewares/     → JWT verification, file upload
└── index.js         → Express server, Socket.IO setup
```

**Request Flow (Backend):**
```
Client Request
  ↓
Express Routes (match URL to route file)
  ↓
Middlewares (isAuth checks token, multer parses files)
  ↓
Controller Function (business logic)
  ↓
Models (MongoDB operations)
  ↓
Response + Socket Event (if real-time update needed)
```

---

## Core Features Explained

### **1. Authentication**
- Signup: Hash password + create user + set JWT cookie
- Login: Verify password + send JWT cookie
- Logout: Clear cookie
- Protected routes: Check JWT before allowing access
- **Why HTTP-only cookies:** Can't be accessed by JavaScript. Protects against XSS attacks.

### **2. User Profiles**
- Upload profile image and cover image (via Cloudinary)
- Add skills, education, experience
- See current user profile or any other user's profile
- Edit own profile only
- **Why separate update endpoint:** Handles file uploads separately from normal form data

### **3. Feed & Posts**
- Create posts with optional images
- See all posts from all users (not just connections)
- Like/unlike posts (toggle)
- Comment on posts
- Delete own posts
- **Optimization:** Paginated feed (10 posts per page) instead of infinite scroll

### **4. Networking (Connections)**
- Send connection request (status: pending)
- Receiver can accept or reject
- Accepted connections appear in both users' connection lists
- View all connections
- See pending requests
- Remove connection
- **Why two endpoints:** Connection in both directions keeps data consistent

### **5. Notifications**
- Get notifications for: likes, comments, connection acceptances
- Delete individual notifications
- Clear all notifications
- Real-time delivery via Socket.IO
- **Why dedicated model:** Decouples notifications from other data. Can expire old notifications.

### **6. Search & Suggestions**
- Search users by name, username, or skills
- Get suggested users (people you're not connected with)
- Uses MongoDB text indexes for fast search
- **Why text indexes:** Full-text search with ranking. Much faster than regex

---

## API Architecture

### **REST API Principles**
```
✅ GET    - Fetch data (idempotent)
✅ POST   - Create new resource
✅ PUT    - Update existing resource
✅ DELETE - Remove resource

Status Codes:
✅ 200 - Success
✅ 201 - Created
❌ 400 - Bad request (validation error)
❌ 401 - Unauthorized (no token)
❌ 404 - Not found
❌ 500 - Server error
```

### **URL Structure**
```
/api/auth/signup           - Public route
/api/auth/login            - Public route
/api/user/currentuser      - Protected route
/api/post/create           - Protected route
/api/connection/send/:id   - Protected route
/api/notification/get      - Protected route
```

**Pattern:**
```
/api/
  └─ [feature]/[action]
     └─ Example: /api/post/create, /api/user/search
```

---

## Backend Routes Complete Reference

### **1. Authentication Routes**

| HTTP | Endpoint | Auth | Input | Output |
|------|----------|------|-------|--------|
| **POST** | `/api/auth/signup` | ❌ No | `{firstName, lastName, userName, email, password}` | `{userId, firstName, lastName, email, ...}` |
| **POST** | `/api/auth/login` | ❌ No | `{email, password}` | `{userId, firstName, lastName, email, ...}` |
| **GET** | `/api/auth/logout` | ✅ Yes (JWT) | - | `{message: "log out successfully"}` |

**Use Cases:**
- Signup: New user registration
- Login: Existing user authentication
- Logout: Clear JWT cookie and end session

---

### **2. User Profile Routes**

| HTTP | Endpoint | Auth | Input | Output | Purpose |
|------|----------|------|-------|--------|---------|
| **GET** | `/api/user/currentuser` | ✅ Yes | - | Full user object | Get logged-in user's profile |
| **GET** | `/api/user/profile/:userName` | ✅ Yes | userName param | User object | View any user's profile |
| **GET** | `/api/user/search?query=...` | ✅ Yes | query param | `[{User}, {User}, ...]` | Search users by name/skills |
| **GET** | `/api/user/suggestedusers` | ✅ Yes | - | `[{User}, {User}, ...]` | Get connection suggestions |
| **PUT** | `/api/user/updateprofile` | ✅ Yes + Files | Form data + images | Updated user object | Update profile & upload images |

**Use Cases:**
```
currentuser: Fetch user data on app load (UserContext)
profile: Navigate to any user's profile page
search: Search for other users to connect with
suggestedusers: Show network suggestions
updateprofile: Edit bio, skills, upload photos
```

---

### **3. Post Routes**

| HTTP | Endpoint | Auth | Input | Output | Purpose |
|------|----------|------|-------|--------|---------|
| **POST** | `/api/post/create` | ✅ Yes + File | Form data: `{description, image}` | Created post object | Create new post |
| **GET** | `/api/post/getpost?page=1&limit=10` | ✅ Yes | Pagination params | `[{Post}, {Post}, ...]` | Fetch feed (paginated) |
| **GET** | `/api/post/like/:postId` | ✅ Yes | postId param | Updated post object | Toggle like on post |
| **POST** | `/api/post/comment/:postId` | ✅ Yes | `{content: "comment text"}` | Updated post object | Add comment to post |

**Use Cases:**
```
create: User writes post with optional image
getpost: Load home feed (10 posts per page)
like: Click like button (adds/removes userId from like array)
comment: Click comment button and add reply
```

**Important:**
- Like is a GET (toggle: adds if not present, removes if present)
- Comment is POST (returns updated post with new comment)
- Image upload uses multer.single("image")

---

### **4. Connection Routes**

| HTTP | Endpoint | Auth | Input | Output | Purpose |
|------|----------|------|-------|--------|---------|
| **POST** | `/api/connection/send/:userId` | ✅ Yes | userId param | Connection object | Send connection request |
| **PUT** | `/api/connection/accept/:connectionId` | ✅ Yes | connectionId param | Updated connection | Accept pending request |
| **PUT** | `/api/connection/reject/:connectionId` | ✅ Yes | connectionId param | Updated connection | Reject pending request |
| **GET** | `/api/connection/getstatus/:userId` | ✅ Yes | userId param | `{status: "..."}` | Check connection status |
| **DELETE** | `/api/connection/remove/:userId` | ✅ Yes | userId param | Success message | Remove/disconnect |
| **GET** | `/api/connection/requests` | ✅ Yes | - | `[{pending requests}]` | Get all pending requests |
| **GET** | `/api/connection/` | ✅ Yes | - | `[{accepted connections}]` | Get all connections |

**Connection Status Values:**
```javascript
"Connect"      // Not connected, can send request
"pending"      // Current user sent request, waiting for response
"received"     // Other user sent request, I can accept/reject
"connected"    // Already connected to this user
```

**Use Cases:**
```
send: Click "Connect" button on user profile
accept: Click "Accept" on pending request
reject: Click "Reject" on pending request
getstatus: Check button label ("Connect", "Pending", etc.)
remove: Click "Remove connection" to disconnect
requests: Show all pending requests in Network page
get all: Show all connections in Connections list
```

**Key Flow:**
```
1. User A clicks Connect → POST /api/connection/send/userB_id
2. Connection created with status: "pending"
3. User B gets notification: "User A sent connection request"
4. User B clicks Accept → PUT /api/connection/accept/connectionId
5. Status changes to "accepted"
6. Both users added to each other's connection arrays
7. Both see "Connected" button
```

---

### **5. Notification Routes**

| HTTP | Endpoint | Auth | Input | Output | Purpose |
|------|----------|------|-------|--------|---------|
| **GET** | `/api/notification/get` | ✅ Yes | - | `[{Notifications}]` | Fetch all notifications |
| **DELETE** | `/api/notification/deleteone/:notificationId` | ✅ Yes | notificationId param | Success message | Delete single notification |
| **DELETE** | `/api/notification/` | ✅ Yes | - | Success message | Clear all notifications |

**Notification Types:**
```javascript
"like"                  // Someone liked your post
"comment"               // Someone commented on your post
"connectionAccepted"    // Connection request accepted
```

**Use Cases:**
```
get: Load notifications page (sorted newest first)
deleteone: Delete individual notification
Clear all: Remove all notifications at once
```

**Real-time Flow:**
```
User A likes post → Backend creates Notification
              ↓
Backend emits "notificationCreated" via Socket.IO
              ↓
User B receives socket event in real-time
              ↓
Notification appears instantly (no page refresh needed)
```

---

### **Complete Routes Map**

```
API Base URL: http://localhost:5000

┌─ /api/auth/
│   ├─ POST   /signup           (Public)
│   ├─ POST   /login            (Public)
│   └─ GET    /logout           (Protected)
│
├─ /api/user/
│   ├─ GET    /currentuser      (Protected)
│   ├─ GET    /profile/:userName(Protected)
│   ├─ GET    /search?query=    (Protected)
│   ├─ GET    /suggestedusers   (Protected)
│   └─ PUT    /updateprofile    (Protected + Files)
│
├─ /api/post/
│   ├─ POST   /create           (Protected + File)
│   ├─ GET    /getpost          (Protected)
│   ├─ GET    /like/:postId     (Protected)
│   └─ POST   /comment/:postId  (Protected)
│
├─ /api/connection/
│   ├─ POST   /send/:userId     (Protected)
│   ├─ PUT    /accept/:connectionId (Protected)
│   ├─ PUT    /reject/:connectionId (Protected)
│   ├─ GET    /getstatus/:userId(Protected)
│   ├─ DELETE /remove/:userId   (Protected)
│   ├─ GET    /requests         (Protected)
│   └─ GET    /               (Protected)
│
└─ /api/notification/
    ├─ GET    /get              (Protected)
    ├─ DELETE /deleteone/:id    (Protected)
    └─ DELETE /               (Protected)
```

---

### **How to Remember Routes**

**Pattern 1: CRUD Operations**
```
Create → POST   /api/[resource]/create
Read   → GET    /api/[resource]/get
Update → PUT    /api/[resource]/update
Delete → DELETE /api/[resource]/:id
```

**Pattern 2: Special Actions**
```
Search → GET    /api/user/search?query=...
Status → GET    /api/connection/getstatus/:userId
Like   → GET    /api/post/like/:postId (toggling action)
Comment→ POST   /api/post/comment/:postId
```

**Pattern 3: Lists**
```
Get Multiple → GET /api/[resource]/
              GET /api/[resource]/requests
              GET /api/connection/
              GET /api/notification/get
```

---

## Security Measures Implemented

| Security Measure | Implementation | Why |
|-----------------|---------------|-----|
| **Password Hashing** | bcryptjs with 10 rounds | Can't recover plaintext password if DB leaked |
| **JWT Tokens** | HTTP-only cookies, 7 day expiry | Stateless auth, prevents XSS |
| **CORS** | Whitelist frontend URL only | Prevent requests from other domains |
| **HTTPS** | secure flag in production | Encrypt cookie in transit |
| **Helmet.js** | Set security headers | Prevent clickjacking, XSS, MIME sniffing |
| **Input Validation** | Check all inputs server-side | Prevent injection attacks |
| **File Upload Limits** | Max 10MB, memory storage | Prevent server overload |
| **Cloudinary** | Store images in cloud | Don't store sensitive files on server |

---

## Performance Metrics

### **Frontend Metrics**
| Metric | Value | How Optimized |
|--------|-------|--------------|
| Initial Bundle | Reduced by code splitting | Lazy loading pages |
| CSS Size | Purged unused styles | Tailwind production build |
| Images | Cloudinary URLs | Not stored locally |
| Re-renders | Minimized via context | Only re-render when context changes |

### **Backend Metrics**
| Metric | Optimization |
|--------|-------------|
| Query Speed | Indexes on frequently queried fields |
| Response Size | Gzip compression middleware |
| Database | Selective population (only needed fields) |
| Concurrent Users | Socket.IO scales horizontally |
| File Uploads | Memory storage → Direct to Cloudinary |

---

## Technology Choices & Why

### **Frontend Stack**

| Tech | Why |
|------|-----|
| **React 19** | Modern hooks, better performance, large ecosystem |
| **Vite** | 10x faster than Webpack, instant HMR, optimized build |
| **Tailwind CSS** | Utility-first, smaller CSS, faster styling, responsive by default |
| **React Router v7** | Client-side routing, code splitting friendly |
| **Axios** | Promise-based, interceptors, credentials handling |
| **Socket.IO Client** | Real-time updates, fallback transports, auto-reconnect |
| **Moment.js** | Date formatting, relative time ("2 minutes ago") |
| **React Icons** | Lightweight, multiple icon sets, tree-shakeable |

### **Backend Stack**

| Tech | Why |
|------|-----|
| **Node.js** | JavaScript on backend, async/await, event-driven |
| **Express.js** | Lightweight, middleware pattern, widely adopted |
| **MongoDB** | Flexible schema, JSON-like documents, horizontal scaling |
| **Mongoose** | Schema validation, relationships (populate), indexes |
| **Socket.IO** | Real-time, fallback for old browsers, built-in namespaces |
| **bcryptjs** | Password hashing, works in browsers + Node |
| **JWT** | Stateless auth, works across services, scalable |
| **Cloudinary** | Image storage, CDN, easy manipulation, free tier |
| **Helmet.js** | Security headers with one line |
| **CORS** | Prevent cross-origin requests from unknown domains |
| **Multer** | File upload handling, memory or disk storage |

---

## Scalability Considerations

### **Current Architecture (Single Server)**
```
Frontend (Deployed to Vercel)
    ↓ HTTPS
Backend (Single Node.js process)
    ↓
MongoDB (Single instance or Atlas cluster)
```

### **If Scaling Needed (Horizontal)**
```
Frontend (CDN serves static files)
    ↓
Load Balancer
    ↓
Backend Server 1 ─┬─
Backend Server 2 ─┼─ All connected to
Backend Server 3 ─┘  MongoDB Cluster
    
Redis Cache (optional) - Session storage
Message Queue (optional) - Async tasks
```

### **Bottlenecks & Solutions**

| Bottleneck | Current Limit | Solution |
|-----------|-------------|----------|
| **Concurrent Users** | ~1000 (single server) | Multiple servers + load balancer |
| **Database Queries** | Limited by indexes | Read replicas, caching layer |
| **File Uploads** | 10MB limit | Increase limit, queue for large files |
| **Socket.IO** | Single server | Redis adapter for cross-server communication |

---

## Common Questions & Answers

### **Q: How do you handle real-time updates?**
**A:** Socket.IO maintains persistent WebSocket connections. When an action happens (like, comment, connection), backend emits event to relevant users. Frontend receives event and updates UI immediately without refresh.

### **Q: What's the difference between authentication and authorization?**
**A:** 
- **Authentication:** Verify who you are (login with email/password → JWT token)
- **Authorization:** Verify what you can do (only author can delete post)

### **Q: Why use HTTP-only cookies instead of localStorage?**
**A:** 
- HTTP-only: Can't be accessed by JavaScript (XSS protection)
- localStorage: Vulnerable to JavaScript injection
- Cookies: Automatically sent with requests, automatically cleared

### **Q: How do you prevent duplicate likes?**
**A:** Use MongoDB `$addToSet` instead of `$push`. `$addToSet` only adds if not already present.

### **Q: Why index the createdAt field?**
**A:** Feed queries need `find().sort({createdAt: -1})`. Without index, MongoDB scans all documents. With index, jumps to newest first.

### **Q: How do connections stay bidirectional?**
**A:** When user A accepts user B's request:
1. Add user A to user B's connection array
2. Add user B to user A's connection array
Now both users see each other as connected.

### **Q: What happens if user loses connection?**
**A:** 
- Socket.IO has auto-reconnect with exponential backoff
- If disconnected, real-time features don't work until reconnected
- After reconnect, fetch latest data from API

---

## Interview Talking Points

### **What You Did:**
1. Built a complete full-stack application from scratch
2. Implemented authentication with JWT tokens and HTTP-only cookies
3. Created real-time features using Socket.IO
4. Optimized performance with database indexes and code splitting
5. Handled file uploads with Cloudinary
6. Designed scalable MVC architecture
7. Secured application with multiple layers (CORS, Helmet, input validation)

### **What You Learned:**
1. Full-stack development (frontend to backend)
2. Database design and relationships
3. Real-time communication
4. Security best practices
5. Performance optimization
6. API design principles
7. DevOps basics (deployment, environment variables)

### **What Sets It Apart:**
1. Real-time notifications (Socket.IO)
2. Cloud image storage (Cloudinary) instead of local
3. Bidirectional connections (both sides connected)
4. Code splitting for performance
5. Multiple optimization layers
6. Proper security practices from the start

---

## Quick Feature Checklist

- [x] User authentication (signup, login, logout)
- [x] User profiles (view, edit, upload images)
- [x] Create posts with images
- [x] Like/unlike posts
- [x] Comment on posts
- [x] Send connection requests
- [x] Accept/reject requests
- [x] View connections
- [x] Search users
- [x] Get suggested users
- [x] Real-time notifications
- [x] View notifications
- [x] Delete notifications
- [x] Responsive design
- [x] Security (passwords, tokens, CORS)
- [x] Performance optimizations
- [x] Database indexes
- [x] Error handling

---

## Quick Command Reference

### **Development**
```bash
# Frontend
cd frontend && npm run dev        # Starts on http://localhost:5173

# Backend
cd backend && npm run dev         # Starts on http://localhost:5000

# To run both simultaneously, open 2 terminals
```

### **Deployment**
```bash
# Frontend (Vercel)
npm run build                     # Creates dist/ folder
# Push to GitHub, Vercel auto-deploys

# Backend (Render)
npm start                         # Production mode
# Set environment variables in Render dashboard
```

### **Environment Variables Needed**
```
Backend:
  PORT=5000
  MONGODB_URL=<your_mongo_uri>
  JWT_SECRET=<random_string_min_32_chars>
  VITE_FRONTEND_URL=<frontend_url>
  CLOUDINARY_CLOUD_NAME=<your_cloud>
  CLOUDINARY_API_KEY=<your_key>
  CLOUDINARY_API_SECRET=<your_secret>

Frontend:
  VITE_API_BASE_URL=<backend_url>
```

---

## API Versioning & Input Validation

### **API Versioning Strategy**

**Why Versioning?**
- Allows API to evolve without breaking existing clients
- Multiple versions can run simultaneously
- Smooth migration path for clients
- Professional production practice

**Implementation:**
```
Old (v0):  /api/auth/signup
New (v1):  /api/v1/auth/signup
Future:    /api/v2/auth/signup

Both old and new supported for backward compatibility
```

**All Routes Updated to v1:**
```
/api/v1/auth/signup         (instead of /api/auth/signup)
/api/v1/user/currentuser    (instead of /api/user/currentuser)
/api/v1/post/create         (instead of /api/post/create)
/api/v1/connection/send/:id (instead of /api/connection/send/:id)
/api/v1/notification/get    (instead of /api/notification/get)
```

**Backend Implementation:**
```javascript
// In index.js
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/connection", connectionRouter);
app.use("/api/v1/notification", notificationRouter);

// Backward compatibility: unversioned routes still work
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// ... etc
```

**Frontend Update:**
```javascript
// Before: serverUrl + "/api/user/currentuser"
// After:  serverUrl + "/api/v1/user/currentuser"

// All API calls in components updated to use /api/v1
axios.get(serverUrl + "/api/v1/user/currentuser")
```

---

### **Input Validation with Joi**

**Why Joi Validation?**
- Single source of truth for validation rules
- Clear, consistent error messages
- Prevents invalid data from reaching database
- Reduces controller complexity
- Easy to maintain and update

**Validation Files Created:**

1. **`validators/`** - Feature-based validation schemas
   - `auth.validator.js` - Signup and login validation
   - `user.validator.js` - Profile update and user search validation
   - `post.validator.js` - Post creation, comments, and pagination validation
   - `connection.validator.js` - Connection request and status validation
   - `notification.validator.js` - Notification deletion validation
   - `index.js` - Barrel export for all validators
   - authValidation (signup, login)
   - userValidation (updateProfile, search)
   - postValidation (createPost, comment, getPost)
   - connectionValidation (sendConnection, updateConnection, getStatus)
   - notificationValidation (deleteNotification)

2. **`middlewares/validate.js`** - Reusable validation middleware
   - Validates request body, query, or params
   - Returns clear error messages
   - Stores validated data in req.validatedData

**Validation Examples:**

**Signup Validation:**
```javascript
signup: Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
})

// Error Response (400):
{
  "message": "Validation Error",
  "errors": [
    {
      "field": "userName",
      "message": "Username can only contain letters, numbers, dots, dashes, and underscores"
    }
  ]
}
```

**Post Creation Validation:**
```javascript
createPost: Joi.object({
  description: Joi.string().max(5000).optional(),
})
.external(async (value) => {
  // Custom validation: must have description OR image
  if (!value.description && !value.image) {
    throw new Error("Post must have either description or image");
  }
})
```

**Comment Validation:**
```javascript
comment: Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .trim()
})

// Validates:
// - Content is not empty
// - Not more than 1000 characters
// - Whitespace trimmed automatically
```

**How it Works in Routes:**

```javascript
// Before: No validation
router.post("/signup", signUp)

// After: Validation middleware added
router.post("/signup", validate(authValidation.signup), signUp)

// Validation middleware:
// 1. Validates request against schema
// 2. Returns 400 with error details if invalid
// 3. Stores validated data in req.validatedData
// 4. Calls next() to continue to controller
```

**Implementation in All Routes:**

| Route | Validation Added | Status |
|-------|-----------------|--------|
| POST /auth/signup | ✅ Validates all fields | Done |
| POST /auth/login | ✅ Validates email & password | Done |
| PUT /user/updateprofile | ✅ Validates all profile fields | Done |
| GET /user/search | ✅ Validates query parameter | Done |
| POST /post/create | ✅ Validates description or image exists | Done |
| POST /post/comment/:id | ✅ Validates comment content | Done |
| GET /post/getpost | ✅ Validates pagination params | Done |
| POST /connection/send/:id | ✅ Validates userId format | Done |
| PUT /connection/accept/:id | ✅ Validates connection ID | Done |
| DELETE /notification/deleteone/:id | ✅ Validates notification ID | Done |

**Error Message Examples:**

User submits invalid email:
```json
{
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

User submits short password:
```json
{
  "message": "Validation Error",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

Multiple validation errors:
```json
{
  "message": "Validation Error",
  "errors": [
    {"field": "firstName", "message": "First name is required"},
    {"field": "email", "message": "Email must be a valid email address"},
    {"field": "password", "message": "Password must be at least 8 characters"}
  ]
}
```

---

### **Benefits of Implementation**

1. **Better Error Handling**
   - Clear, user-friendly error messages
   - Client knows exactly what's wrong
   - Consistent format across all endpoints

2. **Improved Security**
   - Prevents invalid/malicious input from reaching database
   - Validates data types and formats
   - Rejects out-of-bounds values

3. **Performance**
   - Invalid requests rejected early
   - No database queries for bad requests
   - Reduces server load

4. **Maintainability**
   - Single place to update validation rules
   - Easy to understand validation logic
   - No scattered validation code in controllers

5. **Future-Proof**
   - Ready for multiple API versions
   - Easy to create v2 with different validation
   - Can deprecate old endpoints gracefully

---

## Final Tips for Interview

1. **Explain the data flow first** - Start with "User creates a post" and walk through entire flow
2. **Mention indexes** - Shows database knowledge
3. **Highlight real-time** - Socket.IO is impressive
4. **Talk about security** - Password hashing, JWT, CORS
5. **Discuss optimizations** - Code splitting, compression, selective population
6. **Be honest about trade-offs** - Why you chose technologies
7. **Show scalability thinking** - How would you handle 1M users?
8. **Have questions ready** - Ask about their tech stack, challenges, culture

---

**Good Luck! 🚀**

Remember: Interviewers want to see:
- ✅ You understand what you built
- ✅ You can explain complex concepts simply
- ✅ You think about scalability & performance
- ✅ You care about security & best practices
- ✅ You can discuss trade-offs and design decisions

