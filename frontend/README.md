# Hotel Order App - Frontend

Modern, responsive frontend for the Hotel Order Management System built with Next.js 15, React 19, TypeScript, Redux Toolkit, and shadcn/ui.

## 🚀 Tech Stack

- **Framework:** Next.js 15.4.1 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript
- **State Management:** Redux Toolkit 2.9.0 + Redux Persist 6.0.0
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Forms:** Formik 2.4.6 + Yup 1.6.1
- **HTTP Client:** Axios 1.10.0
- **Real-time:** Socket.io Client 4.8.1
- **Icons:** Lucide React 0.525.0 + React Icons 5.5.0
- **Notifications:** Sonner 2.0.6
- **Theme:** next-themes 0.4.6
- **Tables:** TanStack Table 8.21.3

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── providers/        # Context providers
│   │       ├── ReduxProvider.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── store/                # Redux store configuration
│   │   ├── store.ts          # Store setup with persist
│   │   ├── authSlice.ts      # Authentication state
│   │   └── hooks.ts          # Typed Redux hooks
│   │
│   ├── services/             # API service layer
│   │   ├── authService.ts    # Auth API calls
│   │   ├── categoryService.ts
│   │   └── orderService.ts
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── axios.ts          # Axios client setup
│   │   ├── socket.ts         # Socket.io client
│   │   └── utils.ts          # Helper functions (cn, etc.)
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useSocket.ts      # Socket.io hook
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # Shared types
│   │
│   └── constants/            # App constants
│       └── index.ts          # API URLs, routes, enums
│
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies

```

## 🏗️ Architecture Overview

### State Management (Redux Toolkit + Persist)

The application uses Redux Toolkit for state management with Redux Persist to maintain state across page reloads.

**Key Features:**
- Centralized state management
- Persistent authentication state
- Type-safe with TypeScript
- Easy-to-use hooks (`useAppDispatch`, `useAppSelector`)

**Example Usage:**
```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser, logout } from '@/store/authSlice';

const MyComponent = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  // Use state and actions...
};
```

### API Layer (Axios)

Centralized API client with interceptors for authentication and error handling.

**Features:**
- Automatic cookie-based authentication
- Request/response interceptors
- Centralized error handling
- Type-safe service methods

**Example:**
```typescript
import { authService } from '@/services/authService';

// Login
const userData = await authService.login({ email, password });

// Get user
const user = await authService.getUser();
```

### Real-time Communication (Socket.io)

Socket.io client for real-time order updates and notifications.

**Usage:**
```typescript
import { useSocket } from '@/hooks/useSocket';

const OrdersPage = () => {
  const { socket, isConnected } = useSocket();
  
  useEffect(() => {
    if (socket) {
      socket.on('newOrder', (order) => {
        // Handle new order
      });
    }
    
    return () => {
      socket?.off('newOrder');
    };
  }, [socket]);
};
```

### UI Components (shadcn/ui)

Modern, accessible UI components built with Radix UI primitives and Tailwind CSS.

**Available Components:**
- Button
- Input
- Card
- Dialog
- Select
- Checkbox
- Progress
- Scroll Area
- Accordion
- Alert Dialog
- Label
- Popover

**Adding More Components:**
```bash
# Install shadcn/ui CLI (optional)
npx shadcn-ui@latest add [component-name]
```

### Forms (Formik + Yup)

Type-safe form handling with validation.

**Example:**
```typescript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</Formik>
```

### Theme Support (Dark Mode)

Built-in dark mode support with next-themes.

**Usage:**
```typescript
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
};
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Run development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Styling Guide

### Tailwind CSS

The project uses Tailwind CSS with a custom configuration for shadcn/ui.

**CSS Variables:**
All colors are defined as CSS variables in `globals.css` for easy theming.

**Utility Function:**
Use the `cn()` utility to merge Tailwind classes:
```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', condition && 'conditional-class')} />
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend sets HTTP-only cookie
3. Redux stores user data
4. Redux Persist saves to localStorage
5. Axios automatically includes cookie in requests
6. Protected routes check authentication state

## 📡 API Integration

### Backend Endpoints

The frontend connects to these backend routes:

- **Auth:** `/api/v1/auth/*`
- **Categories:** `/api/v1/category/*`
- **Subcategories:** `/api/v1/subcategory/*`
- **Orders:** `/api/v1/order/*`
- **Locations:** `/api/v1/location/*`
- **QR Codes:** `/api/v1/qrcode/*`

### Adding New Services

1. Create service file in `src/services/`:
   ```typescript
   // src/services/myService.ts
   import axiosClient from '@/lib/axios';
   
   export const myService = {
     getData: async () => {
       const response = await axiosClient.get('/my-endpoint');
       return response.data;
     },
   };
   ```

2. Use in components:
   ```typescript
   import { myService } from '@/services/myService';
   
   const data = await myService.getData();
   ```

## 🧩 Adding New Features

### Creating a New Page

1. Create file in `src/app/[route]/page.tsx`
2. Add route to constants
3. Implement component with proper types

### Creating a New Redux Slice

1. Create slice file in `src/store/[name]Slice.ts`
2. Add to store configuration
3. Export actions and selectors

### Adding UI Components

1. Create component in `src/components/ui/`
2. Follow shadcn/ui patterns
3. Use TypeScript for props
4. Include proper accessibility

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

The build output will be in `.next/` directory.

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### TypeScript

Configure in `tsconfig.json` - includes path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Next.js

Configure in `next.config.ts` - includes Cloudinary image domain.

## 📚 Best Practices

1. **Use TypeScript** - Define proper types for all data
2. **Component Organization** - Keep components small and focused
3. **State Management** - Use Redux for global state, local state for UI
4. **Error Handling** - Always handle errors in async operations
5. **Accessibility** - Use semantic HTML and ARIA attributes
6. **Performance** - Use Next.js Image, lazy loading, code splitting
7. **Security** - Never store sensitive data in Redux/localStorage

## 🐛 Troubleshooting

### Hydration Errors

If you see hydration errors with redux-persist, ensure you're using `suppressHydrationWarning` on the HTML tag in layout.tsx.

### Socket Connection Issues

- Check CORS settings on backend
- Verify NEXT_PUBLIC_SOCKET_URL is correct
- Check browser console for connection errors

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## 📄 License

This project is part of the Hotel Order App system.

## 👥 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add types for all new code
4. Test thoroughly before submitting

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
