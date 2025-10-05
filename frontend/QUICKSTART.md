# Quick Start Guide

This guide will help you get the frontend up and running quickly.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Backend server running (see main repository README)

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - Next.js 15.4.1
   - React 19.1.0
   - Redux Toolkit 2.9.0
   - shadcn/ui components
   - Tailwind CSS
   - Socket.io Client
   - And many more...

3. **Setup environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if your backend is running on a different port:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── providers/   # Context providers
│   ├── store/           # Redux store & slices
│   ├── services/        # API services
│   ├── lib/             # Utilities (axios, socket)
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   └── constants/       # App constants
├── public/              # Static files
└── package.json         # Dependencies
```

## Key Features

✅ **State Management**: Redux Toolkit with Redux Persist  
✅ **UI Components**: shadcn/ui with Tailwind CSS  
✅ **Real-time**: Socket.io integration  
✅ **Forms**: Formik + Yup validation  
✅ **HTTP Client**: Axios with interceptors  
✅ **Theme**: Dark mode support  
✅ **TypeScript**: Full type safety  

## Available Pages

- `/` - Home page
- `/login` - Login page (example)
- `/dashboard` - Dashboard (example, requires auth)

## Adding New Features

### 1. Create a new page
```bash
# Create directory
mkdir -p src/app/my-page

# Create page file
touch src/app/my-page/page.tsx
```

### 2. Add Redux state
```bash
# Create slice
touch src/store/myFeatureSlice.ts
```

### 3. Add API service
```bash
# Create service
touch src/services/myFeatureService.ts
```

### 4. Add shadcn/ui component
```typescript
// Import and use
import { Button } from '@/components/ui/button';
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Create production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Connecting to Backend

The frontend expects the backend to be running at `http://localhost:5000` by default.

**Backend endpoints used:**
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/user` - Get user info
- `GET /api/v1/category/get-all-categories` - Categories
- `GET /api/v1/order/get-all-orders` - Orders
- And more...

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Next Steps

1. **Read the documentation:**
   - [README.md](./README.md) - Comprehensive guide
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details

2. **Explore the code:**
   - Check `src/app/page.tsx` for home page
   - Review `src/store/store.ts` for Redux setup
   - Look at `src/lib/axios.ts` for API client

3. **Build your features:**
   - Follow existing patterns
   - Use TypeScript
   - Add proper error handling
   - Write tests (optional)

## Getting Help

- Check the [README.md](./README.md) for detailed information
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Check Next.js documentation: https://nextjs.org/docs
- Check Redux Toolkit docs: https://redux-toolkit.js.org/

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test the build locally:**
   ```bash
   npm run start
   ```

3. **Deploy to Vercel (recommended):**
   - Push to GitHub
   - Import in Vercel
   - Set environment variables
   - Deploy

4. **Or deploy to other platforms:**
   - AWS, Azure, Google Cloud
   - Docker container
   - Traditional hosting

## Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

## Tips

- Use `useAppSelector` and `useAppDispatch` instead of plain Redux hooks
- Import from `@/` instead of relative paths
- Use shadcn/ui components for consistency
- Follow TypeScript best practices
- Handle errors properly with try-catch
- Use Sonner for notifications
- Test on different screen sizes

Enjoy building with this modern Next.js architecture! 🚀
