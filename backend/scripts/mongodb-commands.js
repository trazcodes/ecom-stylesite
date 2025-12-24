// MongoDB commands to create collections and insert sample data
// Run these commands in MongoDB Shell or MongoDB Compass

// Switch to your database
db.use('EcommerceApp');

// Create category collection with validation
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["mainCategory", "name", "slug"],
      properties: {
        mainCategory: {
          bsonType: "string",
          description: "Main category name - required"
        },
        name: {
          bsonType: "string",
          description: "Category name - required"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug - required and unique"
        }
      }
    }
  }
});

// Create product collection with validation
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "price", "category", "quantity"],
      properties: {
        name: {
          bsonType: "string",
          description: "Product name - required"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug"
        },
        description: {
          bsonType: "string",
          description: "Product description - required"
        },
        price: {
          bsonType: "number",
          description: "Product price - required"
        },
        category: {
          bsonType: "objectId",
          description: "Category ID - required"
        },
        quantity: {
          bsonType: "number",
          description: "Available quantity - required"
        },
        photo: {
          bsonType: "object",
          properties: {
            data: {
              bsonType: "binData",
              description: "Binary data for image"
            },
            contentType: {
              bsonType: "string",
              description: "MIME type of the image"
            }
          }
        },
        shipping: {
          bsonType: "bool",
          description: "Whether item is shippable"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when product was created"
        }
      }
    }
  }
});

// Create orders collection with validation
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["products", "buyer"],
      properties: {
        products: {
          bsonType: "array",
          description: "Array of product IDs - required",
          items: {
            bsonType: "objectId"
          }
        },
        payment: {
          bsonType: "object",
          description: "Payment information"
        },
        buyer: {
          bsonType: "objectId",
          description: "User ID of buyer - required"
        },
        status: {
          bsonType: "string",
          description: "Order status",
          enum: ["Not Processed", "Processing", "Shipped", "delivered", "cancel"]
        },
        createdAt: {
          bsonType: "date",
          description: "Order creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Order update timestamp"
        }
      }
    }
  }
});

// Insert sample categories
db.categories.insertMany([
  {
    mainCategory: "Electronics",
    name: "Smartphones",
    slug: "smartphones"
  },
  {
    mainCategory: "Electronics",
    name: "Laptops",
    slug: "laptops"
  },
  {
    mainCategory: "Clothing",
    name: "Men's Wear",
    slug: "mens-wear"
  },
  {
    mainCategory: "Clothing",
    name: "Women's Wear",
    slug: "womens-wear"
  },
  {
    mainCategory: "Home & Kitchen",
    name: "Appliances",
    slug: "appliances"
  }
]);

// Create indexes
db.categories.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.orders.createIndex({ buyer: 1 });
db.orders.createIndex({ createdAt: -1 });
