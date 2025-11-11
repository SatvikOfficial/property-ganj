# Real Estate Property Listing Application

## Overview

This is a modern real estate property listing platform built with Next.js 16 and React 19. The application enables users to browse, search, and view detailed information about properties for sale, rent, and other real estate transactions. It features a responsive design with a component-based architecture using shadcn/ui components and Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
**Technology**: Next.js 16 with React Server Components (RSC)
- **Rationale**: Next.js provides server-side rendering, optimal performance, and built-in routing. RSC support enables better performance through reduced client-side JavaScript.
- **App Router**: Uses Next.js App Router (`app/` directory) for file-based routing with support for layouts, loading states, and nested routes.
- **TypeScript**: Strict TypeScript configuration for type safety across the application.

### UI Component Library
**Technology**: shadcn/ui with Radix UI primitives
- **Rationale**: Provides accessible, customizable components built on Radix UI primitives with full control over styling.
- **Component Architecture**: All UI components are located in `components/ui/` with consistent patterns for variants, sizes, and states.
- **Icon Library**: Lucide React for consistent iconography throughout the application.
- **Pros**: Full customization, accessibility built-in, no external dependencies for component logic.
- **Cons**: Requires manual updates for component changes, larger initial setup.

### Styling System
**Technology**: Tailwind CSS with CSS Variables
- **Configuration**: Uses `@import "tailwindcss"` syntax with custom variants and theme tokens.
- **Design System**: 
  - Custom color palette with primary (`#eb6239`), secondary (`#25abc2`), and accent (`#eec78e`) colors
  - Light and dark mode support via CSS variables
  - Consistent spacing and border radius (`--radius: 0.625rem`)
- **Theme Implementation**: `next-themes` for theme switching with `ThemeProvider` wrapper, currently forced to light mode.

### Form Management
**Technology**: React Hook Form with Zod validation
- **Dependencies**: `@hookform/resolvers` for schema validation integration
- **Rationale**: Provides performant form handling with minimal re-renders and strong TypeScript support through Zod schemas.

### State Management
**Approach**: React hooks (useState, useContext) for local and shared state
- **Rationale**: For this application's complexity, built-in React state management is sufficient without additional libraries like Redux.
- **Custom Hooks**: 
  - `use-mobile.ts`: Responsive breakpoint detection (768px)
  - `use-toast.ts`: Toast notification state management

### Routing Structure
- **Home Page** (`app/page.tsx`): Main landing page with property search, featured listings, and carousels
- **Search Results** (`app/search/page.tsx`): Filtered property listings with advanced search filters
- **Property Detail** (`app/property/[id]/page.tsx`): Individual property details with image gallery, amenities, and specifications
- **Suspense Boundaries**: Loading states defined for async operations

### Component Architecture
**Pattern**: Compound components with composition
- **Shared Components**:
  - `header.tsx`: Sticky navigation with location selector and authentication
  - `search-bar.tsx`: Property search with location, type, and budget filters
  - `property-card.tsx`: Reusable property display card with wishlist functionality
  - `featured-carousel.tsx`: Featured properties carousel
  - `search-filters.tsx`: Advanced filtering UI for search page

**Design Patterns**:
- Slot pattern from Radix UI for flexible component composition
- Variant-based styling using `class-variance-authority` (CVA)
- Data slots (`data-slot` attributes) for consistent component identification

### Analytics & Monitoring
**Technology**: Vercel Analytics
- **Integration**: `@vercel/analytics` package with `<Analytics />` component in root layout
- **Rationale**: Provides built-in performance monitoring and user analytics for Vercel-deployed applications.

### Font Strategy
**Fonts**: Geist and Geist Mono from `next/font/google`
- **Optimization**: Next.js font optimization for improved loading performance
- **Application**: CSS variables (`--font-sans`, `--font-mono`) for consistent typography

### Development Configuration
- **Dev Server**: Runs on port 5000 with host `0.0.0.0` for network accessibility (configured for Replit environment)
- **Build Process**: Standard Next.js build with static optimization where possible
- **Linting**: ESLint configuration for code quality
- **Package Manager**: npm with `--legacy-peer-deps` flag for React 19 compatibility
- **Deployment**: Configured for autoscale deployment on Replit

### Data Flow
**Current State**: Static/mock data in components
- **Property Data**: Hardcoded arrays in page components (temporary implementation)
- **Future Consideration**: Architecture supports integration with database and API routes for dynamic data fetching

### Accessibility Features
- **Radix UI Primitives**: Built-in ARIA attributes and keyboard navigation
- **Form Validation**: Error states with visual indicators and descriptive messages
- **Focus Management**: Consistent focus-visible states across interactive elements
- **Semantic HTML**: Proper use of landmarks, headings, and ARIA roles

## External Dependencies

### UI Component Dependencies
- **Radix UI Primitives** (`@radix-ui/react-*`): 25+ primitive components for dialogs, dropdowns, menus, tooltips, and form controls
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Component variant management
- **clsx** & **tailwind-merge**: Utility for conditional className merging

### Form & Validation
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Schema resolver integration

### Carousel & Media
- **embla-carousel-react**: Carousel/slider functionality for property images and featured listings
- **input-otp**: OTP input component

### Date Handling
- **date-fns**: Date formatting and manipulation utilities

### Utilities
- **cmdk**: Command menu component (likely for search functionality)
- **next-themes**: Theme switching and persistence

### Development Dependencies
- **TypeScript**: Type checking and development experience
- **Autoprefixer**: CSS vendor prefixing
- **PostCSS**: CSS processing (implied by Tailwind setup)

### External Services
**Vercel Analytics**: Application performance and user behavior tracking

### Future Integration Considerations
The application architecture is prepared to integrate:
- Database layer (ORM like Drizzle or Prisma)
- Authentication provider
- Image storage service
- Payment gateway for property transactions
- Map services for location visualization
- Email service for notifications