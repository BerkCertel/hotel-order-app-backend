# Frontend Folder Structure

```
frontend/
│
├── 📁 src/                                # Source code
│   │
│   ├── 📁 app/                           # Next.js App Router (Pages)
│   │   ├── 📄 layout.tsx                 # Root layout with providers
│   │   ├── 📄 page.tsx                   # Home page (/)
│   │   ├── 📄 globals.css                # Global CSS with Tailwind
│   │   ├── 📁 login/                     # Login page
│   │   │   └── 📄 page.tsx               # Login page (/login)
│   │   ├── 📁 dashboard/                 # Dashboard page
│   │   │   └── 📄 page.tsx               # Dashboard (/dashboard)
│   │   └── 📁 [dynamic]/                 # Dynamic routes (add as needed)
│   │
│   ├── 📁 components/                    # React Components
│   │   │
│   │   ├── 📁 ui/                        # shadcn/ui components (copy-paste)
│   │   │   ├── 📄 button.tsx             # Button component
│   │   │   ├── 📄 card.tsx               # Card components
│   │   │   ├── 📄 input.tsx              # Input component
│   │   │   ├── 📄 label.tsx              # Label component
│   │   │   └── 📄 [more].tsx             # Add more as needed
│   │   │
│   │   ├── 📁 providers/                 # Context/Provider components
│   │   │   ├── 📄 ReduxProvider.tsx      # Redux Provider with Persist
│   │   │   └── 📄 ThemeProvider.tsx      # Theme Provider (dark mode)
│   │   │
│   │   └── 📁 [feature]/                 # Feature-specific components
│   │       └── 📄 [Component].tsx        # Add as needed
│   │
│   ├── 📁 store/                         # Redux Toolkit State Management
│   │   ├── 📄 store.ts                   # Store configuration with persist
│   │   ├── 📄 authSlice.ts               # Authentication state slice
│   │   ├── 📄 hooks.ts                   # Typed useAppDispatch, useAppSelector
│   │   └── 📄 [feature]Slice.ts          # Add more slices as needed
│   │
│   ├── 📁 services/                      # API Service Layer
│   │   ├── 📄 index.ts                   # Export all services
│   │   ├── 📄 authService.ts             # Authentication API calls
│   │   ├── 📄 categoryService.ts         # Category API calls
│   │   ├── 📄 orderService.ts            # Order API calls
│   │   └── 📄 [feature]Service.ts        # Add more services
│   │
│   ├── 📁 lib/                           # Utility Libraries
│   │   ├── 📄 utils.ts                   # Helper functions (cn, etc.)
│   │   ├── 📄 axios.ts                   # Axios client with interceptors
│   │   └── 📄 socket.ts                  # Socket.io client service
│   │
│   ├── 📁 hooks/                         # Custom React Hooks
│   │   ├── 📄 useSocket.ts               # Socket.io hook
│   │   └── 📄 use[Feature].ts            # Add more hooks
│   │
│   ├── 📁 types/                         # TypeScript Type Definitions
│   │   ├── 📄 index.ts                   # Shared types (User, Order, etc.)
│   │   └── 📄 [feature].ts               # Feature-specific types
│   │
│   └── 📁 constants/                     # Application Constants
│       └── 📄 index.ts                   # API URLs, routes, enums
│
├── 📁 public/                            # Static Assets
│   ├── 📄 favicon.ico                    # Favicon
│   └── 📁 images/                        # Images (add as needed)
│
├── 📄 .env.example                       # Environment variables template
├── 📄 .env.local                         # Local environment (gitignored)
├── 📄 .eslintrc.json                     # ESLint configuration
├── 📄 .gitignore                         # Git ignore rules
├── 📄 next.config.ts                     # Next.js configuration
├── 📄 tailwind.config.ts                 # Tailwind CSS configuration
├── 📄 postcss.config.js                  # PostCSS configuration
├── 📄 tsconfig.json                      # TypeScript configuration
├── 📄 components.json                    # shadcn/ui configuration
├── 📄 package.json                       # Dependencies and scripts
├── 📄 package-lock.json                  # Locked dependency versions
│
├── 📖 README.md                          # Comprehensive documentation
├── 📖 ARCHITECTURE.md                    # Architecture details
├── 📖 QUICKSTART.md                      # Quick start guide
└── 📖 FOLDER_STRUCTURE.md                # This file

```

## Key Directories Explained

### 📁 `src/app/` - Pages (App Router)
- Uses Next.js 15 App Router
- Each folder with `page.tsx` becomes a route
- `layout.tsx` wraps all pages
- Supports nested layouts and loading states

### 📁 `src/components/` - Components
- **`ui/`**: shadcn/ui components (button, card, input, etc.)
- **`providers/`**: Context providers (Redux, Theme)
- **`[feature]/`**: Feature-specific components (add as needed)

### 📁 `src/store/` - Redux State
- Redux Toolkit for state management
- Redux Persist for localStorage persistence
- Separate slices for different features
- Typed hooks for better TypeScript support

### 📁 `src/services/` - API Layer
- Axios-based API services
- One service file per feature
- Type-safe methods
- Centralized error handling

### 📁 `src/lib/` - Utilities
- `utils.ts`: Helper functions (cn for className merging)
- `axios.ts`: Configured Axios client
- `socket.ts`: Socket.io client service

### 📁 `src/hooks/` - Custom Hooks
- Reusable React hooks
- Socket.io hook for real-time features
- Add feature-specific hooks as needed

### 📁 `src/types/` - TypeScript Types
- Shared type definitions
- Interface for API responses
- Type safety across the app

### 📁 `src/constants/` - Constants
- API URLs
- Route paths
- Enums (USER_ROLES, ORDER_STATUS)

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `UserCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useSocket.ts`)
- **Services**: camelCase with 'Service' suffix (e.g., `authService.ts`)
- **Types**: PascalCase for interfaces (e.g., `User`, `Order`)
- **Utils**: camelCase (e.g., `utils.ts`, `helpers.ts`)

## Adding New Features - Recommended Flow

1. **Define Types** → `src/types/myFeature.ts`
2. **Create Redux Slice** → `src/store/myFeatureSlice.ts`
3. **Add API Service** → `src/services/myFeatureService.ts`
4. **Create Components** → `src/components/myFeature/`
5. **Add Pages** → `src/app/my-feature/page.tsx`

## Import Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
// ✅ Good - Using alias
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { authService } from '@/services/authService';

// ❌ Avoid - Relative paths
import { Button } from '../../components/ui/button';
```

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS theme |
| `tsconfig.json` | TypeScript compiler options |
| `components.json` | shadcn/ui configuration |
| `.eslintrc.json` | ESLint rules |
| `postcss.config.js` | PostCSS plugins |

## Best Practices

1. **Keep files focused**: One component per file
2. **Use TypeScript**: Define types for everything
3. **Follow conventions**: Use established naming patterns
4. **Organize by feature**: Group related code together
5. **Keep utilities small**: Single responsibility principle
6. **Document complex logic**: Add comments when needed
7. **Use path aliases**: Import with `@/` instead of relative paths

## Scalability

As the project grows:
- Add more feature folders in `components/`
- Create more slices in `store/`
- Add more services in `services/`
- Keep adding pages in `app/`
- Maintain type definitions in `types/`

The structure is designed to scale from small to large applications while maintaining clarity and organization.
