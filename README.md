# ASKT - Premium Streetwear E-commerce Website

A complete modern e-commerce website for ASKT clothing brand built with HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, and MongoDB.

## 🎨 Features

- **Dark Premium Streetwear Theme** - Modern, bold design inspired by Nike/Zara street collections
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - GSAP-like animations using CSS
- **Product Management** - Browse, filter, and search products
- **Shopping Cart** - localStorage-based cart system
- **Order Management** - Complete checkout flow
- **Admin Panel** - Add products and view orders
- **RESTful API** - Node.js + Express backend
- **MongoDB Database** - Product and order storage

## 📁 Project Structure

```
ASKT/
├── frontend/
│   ├── index.html          # Homepage
│   ├── shop.html           # All products page
│   ├── men.html            # Men's collection
│   ├── women.html          # Women's collection
│   ├── product.html        # Product detail page
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout page
│   ├── success.html        # Order success page
│   ├── about.html          # About page
│   ├── contact.html        # Contact page
│   ├── admin.html          # Admin panel
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js        # Main JavaScript
│   │   └── cart.js        # Cart management
│   └── assets/            # Images and assets
├── backend/
│   ├── server.js          # Express server
│   ├── models/
│   │   ├── Product.js     # Product model
│   │   └── Order.js       # Order model
│   ├── routes/
│   │   ├── products.js    # Product routes
│   │   └── orders.js      # Order routes
│   ├── controllers/
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── seed.js           # Database seeding script
│   └── package.json      # Backend dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works)
- Git

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd ASKT
```

### Step 2: Setup Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/askt-store?retryWrites=true&w=majority
PORT=3000
```

5. Seed the database with demo products:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:3000`

### Step 3: Setup Frontend

1. Navigate to frontend directory (or root if frontend is in root):
```bash
cd frontend
# or if frontend files are in root:
cd ..
```

2. Open `index.html` in your browser, or use a local server:

**Option A: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js http-server**
```bash
npx http-server -p 8000
```

**Option C: Using VS Code Live Server**
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

3. Open `http://localhost:8000` in your browser

### Step 4: Update API URL (if needed)

If your backend is running on a different port or URL, update the API URL in `frontend/js/config.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Change to your backend URL. This single file controls all API calls across the frontend.

## 🔧 MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `askt-store` or your preferred database name

6. **Update .env file**
   - Paste the connection string in `backend/.env`

## 📱 Usage

### Customer Features

1. **Browse Products**
   - Visit homepage to see featured products
   - Use "Shop" to see all products
   - Filter by Men/Women categories
   - Search products by name

2. **View Product Details**
   - Click on any product
   - Select size (S/M/L/XL)
   - Add to cart

3. **Shopping Cart**
   - View cart items
   - Update quantities
   - Remove items
   - Proceed to checkout

4. **Checkout**
   - Fill in shipping details
   - Place order
   - View order confirmation

### Admin Features

1. **Login**
   - Go to `admin.html`
   - Email: `admin@askt.com`
   - Password: `askt@123`

2. **Add Products**
   - Fill in product details
   - Upload image URL
   - Select category (Men/Women)
   - Set price (₹599 default)
   - Add product

3. **View Orders**
   - See all customer orders
   - View order details
   - Track order status

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. **Prepare Frontend**
   - Ensure all API URLs point to your backend URL (not localhost)
   - Update API URLs in all HTML files

2. **Deploy to Netlify**
   - Go to [Netlify](https://www.netlify.com)
   - Sign up/login
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `frontend` folder
   - Or connect your Git repository

3. **Configure Environment**
   - Go to Site settings → Environment variables
   - Add any required variables

4. **Update API URLs**
   - After backend deployment, update `frontend/js/config.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```
   - Redeploy frontend with updated config

### Backend Deployment (Render)

1. **Prepare Backend**
   - Ensure `.env` file is ready (but don't commit it)
   - Update CORS settings if needed

2. **Deploy to Render**
   - Go to [Render](https://render.com)
   - Sign up/login
   - Click "New" → "Web Service"
   - Connect your Git repository
   - Select the `backend` folder
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: 3000 (or leave default)
   - Click "Create Web Service"

3. **Update Frontend API URLs**
   - After backend deployment, get your Render URL
   - Update all API URLs in frontend files to use Render URL
   - Redeploy frontend

### Alternative: Vercel for Frontend

1. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up/login
   - Click "New Project"
   - Import your Git repository
   - Set root directory to `frontend`
   - Deploy

2. **Update API URLs**
   - Update `frontend/js/config.js` to point to your backend URL

## 🔑 Admin Credentials

- **Email**: `admin@askt.com`
- **Password**: `askt@123`

## 📦 Demo Products

The seed script creates 6 demo products:
- Oversized Black Tee (Men) - ₹599
- Vintage Skull Tee (Men) - ₹599
- Urban White Tee (Women) - ₹599
- Bold Red Tee (Women) - ₹599
- Street Gray Tee (Men) - ₹599
- Classic Navy Tee (Women) - ₹599

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom dark theme)
- Vanilla JavaScript
- CSS Animations

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- RESTful API

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Men` - Filter by category
- `GET /api/products?limit=4` - Limit results
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check if port 3000 is available

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:3000`
- Check CORS settings in `server.js`
- Update API URLs in HTML files

### Products not loading
- Run `npm run seed` to populate database
- Check MongoDB connection
- Verify API endpoints are working

### Cart not saving
- Check browser localStorage is enabled
- Clear browser cache and try again

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
- Use Live Server or any static file server
- Or use `npx http-server` in frontend directory

### Making Changes

1. **Add New Products**: Use admin panel or seed script
2. **Modify Styles**: Edit `frontend/css/style.css`
3. **Update Functionality**: Edit JavaScript files in `frontend/js/`
4. **Backend Changes**: Modify files in `backend/` directory

## 🎯 Future Enhancements

- User authentication
- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filters
- Image upload functionality
- Order tracking

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for ASKT Clothing Brand**
