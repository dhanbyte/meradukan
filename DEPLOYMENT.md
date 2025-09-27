# 🚀 Production Deployment Guide

## ✅ Pre-deployment Checklist

### 1. Environment Variables Setup
Copy `.env.example` to `.env.local` and fill in your production values:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB_NAME=your_database_name

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Database Setup
- Ensure MongoDB Atlas cluster is running
- Database collections will be created automatically
- Test connection with your MongoDB URI

### 3. Payment Gateway
- Switch Razorpay from test to live mode
- Update webhook URLs in Razorpay dashboard
- Test payment flow in staging environment

## 🌐 Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with automatic builds

## 🔧 Common Production Issues & Fixes

### 1. API Routes 404 Error
**Problem:** `/api/users` not found
**Solution:** Use `/api/register-user` instead (already implemented)

### 2. Database Connection Issues
**Problem:** MongoDB connection timeout
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has proper permissions

### 3. Authentication Issues
**Problem:** Clerk authentication fails
**Solution:**
- Update Clerk domain settings
- Check environment variables
- Verify redirect URLs

### 4. Payment Gateway Issues
**Problem:** Razorpay integration fails
**Solution:**
- Switch to live keys
- Update webhook URLs
- Check CORS settings

## 📋 Post-deployment Verification

### Test These Features:
- [ ] User registration/login
- [ ] Product browsing
- [ ] Add to cart/wishlist
- [ ] Address management
- [ ] Payment processing
- [ ] Order placement
- [ ] Admin dashboard access
- [ ] Real-time data sync

### Admin Panel Access:
- URL: `https://your-domain.com/admin`
- Create admin user in database
- Set `isAdmin: true` for admin users

## 🛠 Monitoring & Maintenance

### Performance Monitoring:
- Use Vercel Analytics
- Monitor API response times
- Check database performance

### Error Tracking:
- Set up error logging
- Monitor failed payments
- Track user registration issues

### Regular Updates:
- Keep dependencies updated
- Monitor security vulnerabilities
- Backup database regularly

## 🆘 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity

**All systems are production-ready! 🎯**