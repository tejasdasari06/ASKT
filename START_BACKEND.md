# 🚀 How to Start Database and Backend

## Quick Start (3 Steps)

### Step 1: Setup MongoDB Connection

**You need a MongoDB connection string.** Choose one option:

#### Option A: MongoDB Atlas (Free Cloud Database - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a free cluster (M0)
4. Create database user:
   - Database Access → Add New User
   - Create username and password (save them!)
5. Whitelist IP:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (for testing)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`

#### Option B: Local MongoDB (If you have it installed)
Use: `mongodb://localhost:27017/askt-store`

### Step 2: Create .env File

1. Go to `backend` folder
2. Create a file named `.env` (no extension)
3. Add this content (replace with YOUR connection string):

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/askt-store?retryWrites=true&w=majority
PORT=3000
```

**Example:**
```
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/askt-store?retryWrites=true&w=majority
PORT=3000
```

### Step 3: Run These Commands

Open PowerShell/Command Prompt in the project folder and run:

```powershell
# Navigate to backend folder
cd backend

# Install dependencies (if not done)
npm install

# Add demo products to database
npm run seed

# Start the backend server
npm start
```

## ✅ What You Should See

After running `npm run seed`:
```
Connected to MongoDB
Cleared existing products
Demo products inserted successfully
```

After running `npm start`:
```
MongoDB Connected
Server running on port 3000
```

## 🧪 Test It Works

1. Open browser: http://localhost:3000/api/products
2. You should see JSON with 6 products

## 📝 Products Added

The seed script adds these 6 products:
- Oversized Black Tee (Men) - ₹599
- Vintage Skull Tee (Men) - ₹599
- Urban White Tee (Women) - ₹599
- Bold Red Tee (Women) - ₹599
- Street Gray Tee (Men) - ₹599
- Classic Navy Tee (Women) - ₹599

## 🛠️ Troubleshooting

**"Cannot connect to MongoDB"**
- Check your .env file has correct connection string
- Make sure MongoDB Atlas IP whitelist includes your IP
- Verify username/password are correct

**"Port 3000 already in use"**
- Change PORT in .env to 3001
- Update `frontend/js/config.js` to use port 3001

**"Products not showing"**
- Make sure you ran `npm run seed` successfully
- Check MongoDB connection is working
