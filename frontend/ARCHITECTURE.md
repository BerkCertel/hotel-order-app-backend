# Frontend Architecture Documentation

## Overview

This is a comprehensive Next.js 15 frontend architecture implementing a hotel order management system with modern best practices, state management, real-time capabilities, and a beautiful UI.

## Core Technologies

### 1. Next.js 15.4.1 (App Router)
- **Server Components**: Default for better performance
- **Client Components**: Used where interactivity is needed
- **File-based Routing**: Automatic routing from `src/app/` directory
- **API Routes**: Can be added in `src/app/api/` for BFF pattern
- **Image Optimization**: Built-in with `next/image`
- **Font Optimization**: Automatic with `next/font`

### 2. React 19.1.0
- Latest React version with improved hooks
- Server components support
- Enhanced TypeScript integration
- Better error boundaries

### 3. TypeScript
- Full type safety across the application
- Type definitions in `src/types/`
- Strict mode enabled
- Path aliases configured (`@/*`)

### 4. Tailwind CSS 3.4.1
- Utility-first CSS framework
- Custom design system via CSS variables
- Dark mode support
- Responsive design utilities
- JIT (Just-In-Time) compiler

### 5. shadcn/ui
- Accessible components built on Radix UI
- Copy-paste component system (not a package)
- Fully customizable with Tailwind
- TypeScript-first design
- Components in `src/components/ui/`

## State Management Architecture

### Redux Toolkit 2.9.0

**Why Redux Toolkit?**
- Simplified Redux setup with less boilerplate
- Built-in Redux DevTools integration
- Immutability with Immer
- Type-safe with TypeScript
- RTK Query for API calls (optional)

**Store Structure:**
```
src/store/
├── store.ts          # Store configuration
├── authSlice.ts      # Authentication state
├── hooks.ts          # Typed hooks
└── [feature]Slice.ts # Feature-specific slices
```

**Key Concepts:**

1. **Slices**: Each feature has its own slice
   ```typescript
   const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
       setUser: (state, action) => { ... },
       logout: (state) => { ... }
     }
   });
   ```

2. **Typed Hooks**: Use `useAppDispatch` and `useAppSelector`
   ```typescript
   const dispatch = useAppDispatch();
   const user = useAppSelector((state) => state.auth.user);
   ```

3. **Actions**: Automatically generated from reducers
   ```typescript
   dispatch(setUser(userData));
   dispatch(logout());
   ```

### Redux Persist 6.0.0

**Purpose**: Persist Redux state to localStorage

**Configuration:**
- Persists `auth` state only
- Uses `localStorage` as storage engine
- Automatic rehydration on app load
- Type-safe with TypeScript

**Benefits:**
- User stays logged in after page reload
- Better UX with persistent state
- Configurable per slice

## API Layer

### Axios 1.10.0

**Features:**
- Centralized HTTP client
- Automatic cookie handling
- Request/response interceptors
- Error handling
- Type-safe service methods

**Structure:**
```
src/lib/axios.ts         # Axios client setup
src/services/
├── authService.ts       # Auth API calls
├── categoryService.ts   # Category API calls
├── orderService.ts      # Order API calls
└── [feature]Service.ts  # Feature services
```

**Usage Pattern:**
```typescript
// Define service
export const authService = {
  login: async (data: LoginData) => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },
};

// Use in component
const data = await authService.login({ email, password });
```

## Real-time Communication

### Socket.io Client 4.8.1

**Purpose**: Real-time updates for orders and notifications

**Architecture:**
```
src/lib/socket.ts        # Socket service class
src/hooks/useSocket.ts   # React hook wrapper
```

**Features:**
- Singleton pattern for connection management
- Automatic reconnection
- Event-based communication
- Type-safe event handlers

**Usage:**
```typescript
const { socket, isConnected } = useSocket();

useEffect(() => {
  socket?.on('newOrder', handleNewOrder);
  return () => socket?.off('newOrder');
}, [socket]);
```

## Form Handling

### Formik 2.4.6 + Yup 1.6.1

**Why Formik?**
- Declarative form handling
- Built-in validation
- Form state management
- Type-safe with TypeScript
- Easy integration with UI libraries

**Pattern:**
```typescript
const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ errors, touched }) => (
    <Form>
      <Field as={Input} name="email" />
      <ErrorMessage name="email" />
    </Form>
  )}
</Formik>
```

## UI Component System

### Component Structure

```
src/components/
├── ui/                  # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── providers/           # Context providers
│   ├── ReduxProvider.tsx
│   └── ThemeProvider.tsx
└── [feature]/          # Feature components
```

### Design System

**Colors**: Defined as CSS variables
- Primary, Secondary, Accent
- Destructive, Muted
- Background, Foreground
- Border, Input, Ring

**Spacing**: Tailwind default scale
**Typography**: Inter font family
**Radius**: Customizable border radius
**Shadows**: Tailwind shadow utilities

### Dark Mode

**Implementation**: next-themes
- System preference detection
- Manual theme switching
- No flash on page load
- CSS variable-based theming

## Routing & Navigation

### App Router (Next.js 15)

**Structure:**
```
src/app/
├── layout.tsx           # Root layout
├── page.tsx            # Home page
├── globals.css         # Global styles
├── login/
│   └── page.tsx        # Login page
├── dashboard/
│   └── page.tsx        # Dashboard
└── [dynamic]/
    └── page.tsx        # Dynamic routes
```

**Features:**
- Automatic code splitting
- Prefetching on hover
- Nested layouts
- Loading states
- Error boundaries

## Environment Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Naming Convention:**
- `NEXT_PUBLIC_*` - Exposed to browser
- Others - Server-side only

## Data Flow

### Authentication Flow

1. User submits login form (Formik)
2. Form validation (Yup)
3. API call (Axios service)
4. Response received
5. User data stored in Redux
6. Redux Persist saves to localStorage
7. User redirected to dashboard
8. Protected routes check auth state

### Order Creation Flow

1. User fills order form
2. Form validation
3. API call to create order
4. Socket.io emits order event
5. Real-time update to admin panel
6. Redux state updated
7. UI reflects new order
8. Notification shown (Sonner)

## Performance Optimizations

### Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Lazy loading of images

### Caching
- Redux Persist for state
- Next.js automatic page caching
- Image optimization caching

### Bundle Size
- Tree shaking enabled
- Minimal dependencies
- On-demand component loading

## Security Best Practices

### Authentication
- HTTP-only cookies (set by backend)
- No JWT in localStorage
- Cookie-based auth with Axios
- Protected routes with middleware

### Data Protection
- Input validation (client & server)
- XSS prevention (React default)
- CSRF protection (SameSite cookies)
- Type safety (TypeScript)

## Testing Strategy

### Unit Tests
- Components with React Testing Library
- Redux slices with Jest
- Utility functions with Jest

### Integration Tests
- API service layer
- Redux integration
- Form submission flows

### E2E Tests
- Critical user flows
- Authentication flow
- Order creation flow

## Development Workflow

### 1. Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

### 2. Create Feature
```bash
# 1. Create types
src/types/myFeature.ts

# 2. Create Redux slice
src/store/myFeatureSlice.ts

# 3. Create API service
src/services/myFeatureService.ts

# 4. Create components
src/components/myFeature/

# 5. Create pages
src/app/my-feature/page.tsx
```

### 3. Add UI Component
```bash
# Copy from shadcn/ui or create custom
src/components/ui/myComponent.tsx
```

### 4. Build & Deploy
```bash
npm run build
npm run start
```

## Deployment Considerations

### Environment Variables
- Set all NEXT_PUBLIC_* variables
- Configure backend URLs
- Set production domain

### Build Optimization
- Run `npm run build` locally first
- Check for build errors
- Verify bundle size

### Server Requirements
- Node.js 18+
- 512MB RAM minimum
- SSL certificate for HTTPS

### CDN & Caching
- Static assets to CDN
- Image optimization
- Cache-Control headers

## Monitoring & Analytics

### Error Tracking
- Can integrate Sentry
- Console error logging
- API error handling

### Performance
- Next.js Analytics
- Web Vitals tracking
- Custom performance metrics

### User Analytics
- Can integrate Google Analytics
- Custom event tracking
- User behavior analysis

## Future Enhancements

### Planned Features
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Push notifications
- [ ] Multi-language support (i18n)
- [ ] Advanced caching strategies
- [ ] GraphQL integration option
- [ ] Storybook for component docs
- [ ] E2E test suite

### Scalability
- Feature flags system
- Micro-frontends (if needed)
- Module federation
- Code splitting optimization

## Troubleshooting Guide

### Common Issues

1. **Hydration Errors**
   - Ensure server/client HTML matches
   - Use `suppressHydrationWarning` when needed
   - Check for browser-only code in server components

2. **Redux Persist Issues**
   - Clear localStorage
   - Check persist configuration
   - Verify whitelist/blacklist

3. **Socket Connection**
   - Check CORS on backend
   - Verify environment variables
   - Check network tab

4. **Build Errors**
   - Clear `.next` folder
   - Check TypeScript errors
   - Verify all imports

## Best Practices Summary

1. **Always use TypeScript** - Type everything
2. **Follow naming conventions** - Consistent casing
3. **Keep components small** - Single responsibility
4. **Use custom hooks** - Reusable logic
5. **Handle errors properly** - Try-catch + user feedback
6. **Write meaningful commits** - Clear history
7. **Document complex logic** - Comments where needed
8. **Test critical paths** - Authentication, orders
9. **Optimize images** - Use next/image
10. **Keep dependencies updated** - Security patches

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)

## Support

For questions or issues:
1. Check this documentation
2. Review the README.md
3. Check existing code examples
4. Consult framework documentation
