# Complete Setup and Integration Guide

This guide walks you through setting up the complete hotel order management system from scratch, integrating the backend with the frontend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Integration Testing](#integration-testing)
5. [Common Issues](#common-issues)
6. [Next Steps](#next-steps)

## Prerequisites

### Required Software

- **Node.js** (v18 or higher)
  ```bash
  node --version  # Should be v18+
  ```

- **MongoDB** (local or cloud)
  - Option 1: Local MongoDB
  - Option 2: MongoDB Atlas (cloud)

- **Git**
  ```bash
  git --version
  ```

- **Package Manager** (npm, yarn, or pnpm)
  ```bash
  npm --version
  ```

### Optional but Recommended

- **Postman** or **Thunder Client** for API testing
- **MongoDB Compass** for database visualization
- **VS Code** with recommended extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

## Backend Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/BerkCertel/hotel-order-app-backend.git
cd hotel-order-app-backend

# Install backend dependencies
npm install
```

### Step 2: Setup MongoDB

#### Option A: Local MongoDB

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 3: Setup Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your credentials from the dashboard:
   - Cloud name
   - API Key
   - API Secret

### Step 4: Configure Environment Variables

Create `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/hotel-order-app
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-order-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@hoteorderapp.com
```

**Important Security Note**: 
- Never commit `.env` file to Git
- Use strong, unique JWT_SECRET in production
- Use app-specific passwords for Gmail

### Step 5: Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB connected.
✅ Server running on port 5000
✅ Socket.io server running with CORS: http://localhost:3000
```

### Step 6: Test Backend

Test with curl or Postman:

```bash
# Health check (create this endpoint if needed)
curl http://localhost:5000

# Test login (after creating a user)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Frontend Setup

### Step 1: Navigate to Frontend

```bash
# From project root
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- Next.js 15.4.1
- React 19.1.0
- Redux Toolkit 2.9.0
- shadcn/ui components
- Tailwind CSS
- Socket.io Client
- And more...

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Note**: `NEXT_PUBLIC_*` variables are exposed to the browser.

### Step 4: Start Frontend

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.4.1
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 5: Verify Frontend

1. Open browser to [http://localhost:3000](http://localhost:3000)
2. You should see the home page with three cards
3. Click "Staff Login" to go to login page
4. Check browser console for any errors

## Integration Testing

### Test 1: Socket.io Connection

1. Open browser DevTools (F12)
2. Go to Console
3. Look for: `✅ Socket connected: [socket-id]`
4. If you see connection errors, check:
   - Backend is running
   - CORS is configured correctly
   - No firewall blocking connections

### Test 2: API Communication

#### Create Test User (Backend)

Using Postman or curl:

```bash
# Register a test user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login from Frontend

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to dashboard
5. Check Redux DevTools to see user in state

### Test 3: Redux Persistence

1. Login to the app
2. Refresh the page (F5)
3. Should stay logged in (Redux Persist working)
4. Check localStorage in DevTools:
   - Application tab → Local Storage → localhost:3000
   - Look for `persist:root` key

### Test 4: Real-time Updates

**Backend Terminal:**
```bash
# The backend logs will show socket connections
Yeni bir kullanıcı bağlandı: [socket-id]
```

**Frontend Console:**
```javascript
✅ Socket connected: [socket-id]
```

If both show connection, Socket.io is working!

## Common Issues

### Issue 1: Backend Won't Start

**Error**: `MongoDB connection failed`

**Solution**:
```bash
# Check if MongoDB is running
mongosh

# If not, start it
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

### Issue 2: Frontend Can't Connect to Backend

**Error**: `Network Error` or `CORS error`

**Solution**:
1. Verify backend is running: `http://localhost:5000`
2. Check `.env` has correct `CLIENT_URL=http://localhost:3000`
3. Check `frontend/.env.local` has correct `NEXT_PUBLIC_API_URL`
4. Restart both servers

### Issue 3: Socket Connection Failed

**Error**: `Socket connection error`

**Solution**:
1. Check backend Socket.io CORS config in `server.js`
2. Verify `NEXT_PUBLIC_SOCKET_URL` in frontend `.env.local`
3. Check browser console for specific errors
4. Try disabling browser extensions

### Issue 4: Redux Persist Not Working

**Error**: Redux state clears on refresh

**Solution**:
1. Check browser localStorage (DevTools → Application)
2. Clear localStorage and try again
3. Check `ReduxProvider` is wrapping app in `layout.tsx`
4. Verify `PersistGate` is properly configured

### Issue 5: Build Errors

**Error**: TypeScript errors during build

**Solution**:
```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Issue 6: Cloudinary Upload Fails

**Error**: `Upload failed` or `Invalid credentials`

**Solution**:
1. Verify Cloudinary credentials in `.env`
2. Check if credentials have spaces (remove them)
3. Try uploading directly on Cloudinary dashboard to verify account

## Verification Checklist

Use this checklist to ensure everything is set up correctly:

- [ ] Backend
  - [ ] MongoDB connected successfully
  - [ ] Backend running on port 5000
  - [ ] Socket.io server initialized
  - [ ] Environment variables configured
  - [ ] Can create user via API

- [ ] Frontend
  - [ ] Frontend running on port 3000
  - [ ] Home page loads without errors
  - [ ] Socket.io connects successfully
  - [ ] Can navigate to login page
  - [ ] Environment variables configured

- [ ] Integration
  - [ ] Can login from frontend
  - [ ] User data stored in Redux
  - [ ] Redux persists after refresh
  - [ ] Socket connection maintained
  - [ ] No CORS errors

## Next Steps

### 1. Create Admin User

```bash
# Use MongoDB Compass or mongosh
mongosh hotel-order-app

db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "ADMIN" } }
)
```

### 2. Add Sample Data

Create categories, locations, and products through the API or admin panel.

### 3. Customize Frontend

- Modify colors in `frontend/src/app/globals.css`
- Add more pages in `frontend/src/app/`
- Create custom components in `frontend/src/components/`
- Add more Redux slices for features

### 4. Add Features

Suggested features to implement:
- [ ] Complete admin panel
- [ ] Guest order interface
- [ ] Order management dashboard
- [ ] QR code generation UI
- [ ] Category and subcategory management
- [ ] User management
- [ ] Order statistics/reports
- [ ] Push notifications

### 5. Security Hardening

For production:
- [ ] Use strong JWT_SECRET
- [ ] Enable rate limiting
- [ ] Add request validation
- [ ] Implement CSRF protection
- [ ] Use HTTPS
- [ ] Sanitize user inputs
- [ ] Add logging and monitoring

### 6. Performance Optimization

- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] Optimize images
- [ ] Add loading states
- [ ] Implement pagination
- [ ] Use React.memo for expensive components

### 7. Testing

- [ ] Write unit tests for Redux slices
- [ ] Add integration tests for API services
- [ ] Create E2E tests for critical flows
- [ ] Test on different browsers
- [ ] Test responsive design

## Documentation Reference

- **[PROJECT_README.md](../PROJECT_README.md)** - Turkish overview
- **[frontend/README.md](../frontend/README.md)** - Frontend guide
- **[frontend/ARCHITECTURE.md](../frontend/ARCHITECTURE.md)** - Architecture details
- **[frontend/QUICKSTART.md](../frontend/QUICKSTART.md)** - Quick start
- **[frontend/FOLDER_STRUCTURE.md](../frontend/FOLDER_STRUCTURE.md)** - Folder structure

## Getting Help

If you encounter issues:

1. **Check Documentation**: Read the relevant docs first
2. **Search Issues**: Look for similar issues on GitHub
3. **Check Console**: Browser console and terminal output
4. **Debug**: Use console.log and debugger
5. **Ask for Help**: Create an issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - What you've tried

## Useful Commands Reference

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database
```bash
mongosh                          # Connect to MongoDB
use hotel-order-app             # Switch to database
db.users.find()                 # List users
db.users.deleteMany({})         # Clear users (careful!)
```

### Git
```bash
git status                       # Check status
git add .                       # Stage all changes
git commit -m "message"         # Commit changes
git push                        # Push to remote
```

## Success!

If you've completed all steps and passed all tests, congratulations! 🎉

Your hotel order management system is now fully set up and running. You have:

✅ A working backend API with MongoDB and Socket.io  
✅ A modern Next.js frontend with Redux and shadcn/ui  
✅ Real-time communication between frontend and backend  
✅ Authentication and authorization working  
✅ A scalable architecture ready for new features  

Now you can start building your custom features and make the app your own!

Happy coding! 🚀
