# Quick Setup Guide - ASKT Backend

## Step 1: Get MongoDB Atlas Connection String

### Option A: Use MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0)
4. Create database user (username/password)
5. Whitelist IP (Allow from anywhere for testing)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `askt-store`

### Option B: Use Local MongoDB (If installed)
```
MONGODB_URI=mongodb://localhost:27017/askt-store
```

## Step 2: Update .env File

Edit `backend/.env` and replace the MONGODB_URI with your actual connection string:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/askt-store?retryWrites=true&w=majority
```

## Step 3: Add Products to Database

Run the seed script to add 6 demo products:

```bash
cd backend
npm run seed
```

You should see:
- ✅ Connected to MongoDB
- ✅ Cleared existing products
- ✅ Demo products inserted successfully

## Step 4: Start Backend Server

```bash
cd backend
npm start
```

Server will run on: http://localhost:3000

## Step 5: Test the API

Open in browser or use curl:
- http://localhost:3000/api/health (Health check)
- http://localhost:3000/api/products (Get all products)

## Troubleshooting

**Error: Cannot connect to MongoDB**
- Check your connection string in .env
- Make sure MongoDB Atlas IP whitelist includes your IP
- Verify username and password are correct

**Error: Port 3000 already in use**
- Change PORT in .env to another port (e.g., 3001)
- Update frontend/js/config.js with new port

**Products not showing**
- Make sure you ran `npm run seed`
- Check MongoDB connection
- Verify products exist in database
