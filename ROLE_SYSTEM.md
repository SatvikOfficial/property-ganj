# PropertyGanj Role-Based System

## Overview

PropertyGanj now has a complete role-based access control system with 4 distinct user types, each with their own dashboard and permissions.

## User Roles

### 1. **User (Buyer/Renter)**
- **Color Theme**: Blue
- **Dashboard URL**: `/user/dashboard` (or `/dashboard` auto-redirect)
- **Permissions**:
  - Search and browse properties
  - Like/save favorite properties
  - Post personal properties
  - View profile information
  
- **Dashboard Features**:
  - Quick access to liked properties
  - Link to post property
  - Browse all properties
  - Manage personal profile

### 2. **Agent**
- **Color Theme**: Purple/Pink
- **Dashboard URL**: `/agent/dashboard` (or `/dashboard` auto-redirect)
- **Permissions**:
  - Post multiple properties
  - Manage property listings
  - Track inquiries
  - View market opportunities
  - Build client relationships

- **Dashboard Features**:
  - Properties Listed counter
  - Inquiries Received counter
  - Properties Sold counter
  - Post new property button
  - View my postings
  - Track opportunities
  - Profile settings

### 3. **Builder**
- **Color Theme**: Orange/Amber
- **Dashboard URL**: `/builder/dashboard` (or `/dashboard` auto-redirect)
- **Permissions**:
  - Post construction projects
  - Manage multiple projects
  - Track project inventory (units)
  - Monitor sales
  - View market insights

- **Dashboard Features**:
  - Active Projects counter
  - Total Units counter
  - Inquiries Received counter
  - Sold Units counter
  - Launch new project button
  - Manage projects
  - Market insights
  - Company settings

### 4. **Admin**
- **Color Theme**: Purple
- **Dashboard URL**: `/admin/dashboard` (or `/dashboard` auto-redirect)
- **Permissions**:
  - Full CRUD on all content
  - Manage users
  - Manage properties
  - Manage projects
  - Manage builders
  - View analytics
  - System administration

- **Dashboard Features**:
  - Total Projects counter
  - Total Units counter
  - Total Agents counter
  - Total Users counter
  - Manage all projects
  - Manage all properties
  - Manage all agents
  - Manage all builders

## Authentication Flow

### Sign Up
1. User clicks "Login / Sign Up" in header
2. Chooses to create account
3. Enters name, email, phone, password
4. Account created with default role: `user`

### Login
1. User enters email and password
2. Supabase authenticates the user
3. `/api/auth/generate-token` endpoint:
   - Verifies Supabase session
   - Looks up or creates MongoDB user record
   - Generates JWT token with role
   - Sets httpOnly cookie
4. User redirected to appropriate dashboard based on role

### Role Assignment
- **Default**: New users get `user` role
- **Admin Can Assign**: Admin can change user roles
- **Self-Promotion**: Users can register as agent (separate form at `/agent-registration`)
- **Builder Accounts**: Need to be created by admin

## Header Navigation

When logged in, users see:
- **Dashboard** link (colored by role)
- **My Profile** link
- **Liked Properties** link (for buyers)
- **My Postings** link (for agents/builders)
- Role-specific dashboard link (Admin Panel, Agent Dashboard, Builder Portal)
- **Logout** button

## Protected Routes

The following routes check authentication and role:
- `/user/dashboard` - User only
- `/agent/dashboard` - Agent only
- `/builder/dashboard` - Builder only
- `/admin/dashboard` - Admin only
- `/profile` - Authenticated users only
- `/list-property` - Authenticated users only

## Database Schema

### User Model Fields
```
{
  supabaseId: String (unique),
  name: String,
  email: String (unique),
  phone: String,
  role: 'user' | 'agent' | 'admin' | 'builder',
  agentProfile: {
    experience?: Number,
    specialization?: String[],
    languages?: String[],
    bio?: String,
    location?: String,
    isVerified?: Boolean,
    photoUrl?: String
  },
  likedProperties: ObjectId[],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/generate-token` - Generate JWT after Supabase auth
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout and clear tokens

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

## Development

### Testing Different Roles

1. **Create User Account**
   ```
   Email: user@example.com
   Password: test123456
   Role: user (default)
   ```

2. **Create Agent Account**
   ```
   Email: agent@example.com
   Password: test123456
   Role: agent (register at /agent-registration or admin assignment)
   ```

3. **Create Builder Account**
   ```
   Email: builder@example.com
   Password: test123456
   Role: builder (admin assignment only)
   ```

4. **Create Admin Account**
   ```
   Email: admin@example.com
   Password: test123456
   Role: admin (database or admin panel)
   ```

### Environment Variables Required
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Future Enhancements

- Role-specific property filters
- Agent performance metrics
- Builder project analytics
- Admin user management panel
- Payment gateway integration
- Commission management for agents
- Project milestone tracking for builders
