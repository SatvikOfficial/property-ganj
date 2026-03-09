# PropertyGanj Deployment Checklist

## Pre-Deployment Testing

### Authentication Flow
- [ ] User can sign up with email/password
- [ ] Verification email is sent (check email inbox)
- [ ] User can log in with created account
- [ ] Token cookie is created after login
- [ ] User info appears in header dropdown
- [ ] Admin dashboard appears for admin users

### Property Posting
- [ ] Logged-in user can access `/list-property`
- [ ] Unauthenticated user redirected to `/auth?returnUrl=%2Flist-property`
- [ ] User can fill and submit property form
- [ ] Property appears in database after submission
- [ ] User can view submitted properties in "My Ads"

### Admin Dashboard
- [ ] Admin user can access `/admin/dashboard`
- [ ] Non-admin users get 404 on admin routes
- [ ] Dashboard loads with correct stats
- [ ] All tabs work (Overview, Inventory, Agents, Builders, Projects)
- [ ] Tables display data correctly
- [ ] Admin can navigate to project/builder management pages

### General Navigation
- [ ] Homepage loads all properties correctly
- [ ] Search works with filters
- [ ] Like/unlike properties works
- [ ] Header shows correct user state
- [ ] Mobile menu works properly
- [ ] All links in header navigation work

### Logout & Session Management
- [ ] Logout button clears session
- [ ] Token cookie is removed after logout
- [ ] User redirected to home after logout
- [ ] Can't access protected pages after logout
- [ ] Login again works correctly after logout

---

## Environment Setup

### Required Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# MongoDB Configuration
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# Node Environment
NODE_ENV=production
```

### Supabase Setup Checklist
- [ ] Database tables exist:
  - [ ] profiles (id, full_name, email, phone, role, created_at)
  - [ ] projects
  - [ ] units
  - [ ] block_logs
- [ ] Auth is enabled
- [ ] Email provider configured
- [ ] User can sign up and receive emails

### MongoDB Setup Checklist
- [ ] Database connection working
- [ ] Collections exist:
  - [ ] users
  - [ ] properties
  - [ ] agents (if applicable)
- [ ] Indexes created for performance
- [ ] Backup configured

---

## Deployment Steps

### 1. Code Deployment
```bash
# Push changes to Git
git add .
git commit -m "Fix: Auth flow and admin dashboard improvements"
git push origin your-branch

# Deploy to Vercel (if using Vercel)
vercel deploy
```

### 2. Environment Variables
- [ ] Add all env vars to Vercel project settings
- [ ] Verify vars are not exposed in browser
- [ ] Ensure JWT_SECRET is strong (32+ chars)

### 3. Database Migrations
- [ ] Ensure all Supabase tables exist
- [ ] Verify MongoDB collections created
- [ ] Check indexes are created
- [ ] Run any pending migrations

### 4. Testing in Staging
- [ ] Deploy to staging environment
- [ ] Run full testing checklist above
- [ ] Test on mobile devices
- [ ] Check performance metrics
- [ ] Verify error handling

### 5. Production Deployment
- [ ] Set NODE_ENV=production
- [ ] Enable security headers
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Configure error tracking (Sentry)

---

## Post-Deployment Verification

### Immediate Checks (First Hour)
- [ ] Application loads without errors
- [ ] Auth works correctly
- [ ] API responses are correct
- [ ] Database connections working
- [ ] Error logs are clean

### Performance Checks
- [ ] Page load time < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No console errors
- [ ] Images load correctly

### Security Checks
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] JWT tokens are secure
- [ ] Database credentials not exposed
- [ ] API keys properly protected

### User Flow Checks
- [ ] Sign up workflow complete
- [ ] Login/logout works smoothly
- [ ] Protected pages require auth
- [ ] Admin features work for admins only
- [ ] Property posting works

---

## Rollback Plan

If issues occur post-deployment:

1. **Critical Issues (Auth/Security)**
   ```bash
   git revert HEAD
   git push origin your-branch
   vercel deploy --prod
   ```

2. **Database Issues**
   - Restore from last backup
   - Revert migrations if needed

3. **Performance Issues**
   - Check error logs
   - Verify database connection
   - Clear cache if needed
   - Scale up if under heavy load

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Error log is clean
- [ ] No failed auth attempts spike
- [ ] Database performance normal
- [ ] API response times acceptable

### Weekly Checks
- [ ] Review user signups
- [ ] Check property submissions
- [ ] Verify admin usage
- [ ] Database backup completed

### Monthly Checks
- [ ] Review analytics
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization

---

## New Endpoints Summary

### Auth Endpoints
- `POST /api/auth/generate-token` - Create JWT after Supabase login
- `POST /api/auth/logout` - Sign out and clear tokens
- `GET /api/auth/me` - Get current user info

### Protected Routes
- `/list-property` - Requires JWT token
- `/profile` - Requires JWT token
- `/profile/liked` - Requires JWT token
- `/profile/my-ads` - Requires JWT token
- `/admin/dashboard` - Requires JWT + admin role

---

## Common Issues & Solutions

### Issue: User can't post property after login
**Solution:**
- Verify JWT token is in cookies
- Check JWT_SECRET is correct
- Verify MongoDB user was created
- Check `/api/properties` endpoint exists

### Issue: Admin dashboard shows 404
**Solution:**
- Verify user role is 'admin' in Supabase
- Check user is logged in
- Verify token is valid
- Check `/admin/dashboard/page.tsx` exists

### Issue: Login redirects to auth infinitely
**Solution:**
- Check Supabase connection
- Verify auth tokens are being set
- Clear browser cache
- Check `/api/auth/me` responds correctly

### Issue: Logout doesn't work
**Solution:**
- Verify Supabase auth.signOut() completes
- Check token cookie is being cleared
- Refresh page after logout
- Check browser cookie settings

---

## Performance Optimization Tips

1. **Caching:**
   - Enable browser caching for images
   - Cache API responses where applicable
   - Use SWR for client data fetching

2. **Database:**
   - Create indexes on frequently queried fields
   - Optimize N+1 queries
   - Use connection pooling

3. **Frontend:**
   - Code split large components
   - Lazy load images
   - Minimize bundle size
   - Enable gzip compression

4. **Server:**
   - Enable CDN for static assets
   - Use HTTP/2
   - Configure proper cache headers
   - Monitor server resources

---

## Success Criteria

✅ **Authentication**
- Users can sign up and log in
- JWT tokens are properly generated
- Session management works correctly

✅ **Core Features**
- Users can post properties
- Admin can manage platform
- Search and browsing works

✅ **User Experience**
- No console errors
- Smooth navigation
- Quick load times
- Mobile responsive

✅ **Security**
- Passwords secured
- Tokens protected
- Protected routes working
- No data leaks

✅ **Performance**
- Response times < 1s
- Page loads < 3s
- Database queries optimized
- No memory leaks

---

## Sign-Off

- [ ] QA Lead: Tested and approved
- [ ] Backend Lead: Deployment ready
- [ ] DevOps Lead: Infrastructure ready
- [ ] Product Lead: Feature complete
- [ ] Security Lead: Security reviewed

---

## Notes

Use this space for deployment notes, issues encountered, and solutions applied:

```
Date: _______________
Deployed by: _______________
Environment: staging / production
Issues: _______________
Solutions: _______________
Rollback needed: yes / no
```

---

**Last Updated:** 2026-03-09
**Version:** 1.0
**Status:** Ready for Deployment
