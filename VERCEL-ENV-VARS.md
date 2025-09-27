# 🚀 Vercel Environment Variables for shopwave.social

## Copy these EXACT values to Vercel Dashboard:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWR2YW5jZWQta29pLTU4LmNsZXJrLmFjY291bnRzLmRldiQ

CLERK_SECRET_KEY=sk_test_79pbdZWPLcN5GtX0mUgC6WD6eyzWGOSqkKHGmgP5gg

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

MONGODB_URI=mongodb+srv://dhananjaywin15112004:ec2cY3Gk2HxizdS2@cluster.4jkps.mongodb.net/?retryWrites=true&w=majority&appName=photos-test

MONGODB_DB_NAME=photos-test

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RDS7GUfIddVKwK

RAZORPAY_KEY_SECRET=Sk0lz17w2Hz328cgvSs9WsVR

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_wkRNuym4bz+0R6wuAYTQfiaWi90=

IMAGEKIT_PRIVATE_KEY=private_CbNfu0pqv6SGi5szq+HCP01WZUc=

NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/b5qewhvhb

NEXT_PUBLIC_APP_URL=https://shopwave.social
```

## 🔧 Steps to Add in Vercel:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable separately
4. Set Environment: Production, Preview, Development (all three)
5. Save and Redeploy

## 🧪 Test Database Connection:

After deployment, visit: `https://shopwave.social/api/test-db`

Should return:
```json
{
  "success": true,
  "status": "Database connection successful",
  "connectionState": "connected",
  "database": "photos-test",
  "collections": ["adminusers", "userdatas", "products", ...]
}
```

## 🚨 Common Issues:

1. **MongoDB IP Whitelist**: Add `0.0.0.0/0` in MongoDB Atlas
2. **Connection String**: Ensure no extra spaces
3. **Environment**: Set for all three environments
4. **Redeploy**: Always redeploy after adding env vars