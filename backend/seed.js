const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

const demoProducts = [
    {
        name: 'Oversized Black Tee',
        price: 599,
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
        stock: 50
    },
    {
        name: 'Vintage Skull Tee',
        price: 599,
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop',
        stock: 45
    },
    {
        name: 'Urban White Tee',
        price: 599,
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop',
        stock: 40
    },
    {
        name: 'Bold Red Tee',
        price: 599,
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop',
        stock: 35
    },
    {
        name: 'Street Gray Tee',
        price: 599,
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop',
        stock: 30
    },
    {
        name: 'Classic Navy Tee',
        price: 599,
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop',
        stock: 25
    },
    {
        name: 'Premium Black Oversized Tee',
        price: 699,
        category: 'Men',
        sizes: ['M', 'L', 'XL', 'XXL'],
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
        stock: 60
    },
    {
        name: 'Graphic Print White Tee',
        price: 649,
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop',
        stock: 42
    },
    {
        name: 'Crop Top White Tee',
        price: 549,
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L'],
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop',
        stock: 38
    },
    {
        name: 'Vintage Wash Blue Tee',
        price: 599,
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop',
        stock: 33
    },
    {
        name: 'Minimalist Black Tee',
        price: 599,
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
        stock: 55
    },
    {
        name: 'Oversized Pink Tee',
        price: 599,
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop',
        stock: 28
    },
    {
        name: 'Streetwear Green Tee',
        price: 649,
        category: 'Men',
        sizes: ['M', 'L', 'XL', 'XXL'],
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop',
        stock: 20
    },
    {
        name: 'Crop Top Black Tee',
        price: 549,
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L'],
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop',
        stock: 35
    },
    {
        name: 'Classic White Tee',
        price: 499,
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop',
        stock: 70
    },
    {
        name: 'Designer Print Tee',
        price: 749,
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop',
        stock: 22
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert demo products
        const insertedProducts = await Product.insertMany(demoProducts);
        console.log(`\n✅ Successfully inserted ${insertedProducts.length} products:\n`);
        
        // Display inserted products
        insertedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Category: ${product.category} | Price: ₹${product.price} | Stock: ${product.stock}`);
            console.log(`   Sizes: ${product.sizes.join(', ')}\n`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
