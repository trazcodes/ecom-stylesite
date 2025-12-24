const mongoose = require('mongoose');
require('dotenv').config();

// Import the models
const { userModel } = require('../models/userModel');
const { categoryModel } = require('../models/categoryModel');
const productModel = require('../models/productModel');
const { orderModel } = require('../models/orderModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB at ${conn.connection.host}`);
    
    // Create sample data for categories
    const categories = [
      {
        mainCategory: 'Electronics',
        name: 'Smartphones',
        slug: 'smartphones'
      },
      {
        mainCategory: 'Electronics',
        name: 'Laptops',
        slug: 'laptops'
      },
      {
        mainCategory: 'Clothing',
        name: 'Men\'s Wear',
        slug: 'mens-wear'
      },
      {
        mainCategory: 'Clothing',
        name: 'Women\'s Wear',
        slug: 'womens-wear'
      },
      {
        mainCategory: 'Home & Kitchen',
        name: 'Appliances',
        slug: 'appliances'
      }
    ];
    
    // Check if collections exist first
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Current collections:', collectionNames);
    
    // Initialize category collection if it doesn't exist
    if (!collectionNames.includes('categories')) {
      console.log('Creating category collection...');
      
      for (const category of categories) {
        // Check if category already exists by slug
        const existingCategory = await categoryModel.findOne({ slug: category.slug });
        if (!existingCategory) {
          await categoryModel.create(category);
          console.log(`Added category: ${category.name}`);
        }
      }
    } else {
      console.log('Category collection already exists');
    }
    
    // Initialize product collection if needed
    if (!collectionNames.includes('products')) {
      console.log('Product collection will be created when you add products');
    } else {
      console.log('Product collection already exists');
    }
    
    // Initialize order collection if needed
    if (!collectionNames.includes('orders')) {
      console.log('Order collection will be created when orders are placed');
    } else {
      console.log('Order collection already exists');
    }
    
    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the database initialization
connectDB();
