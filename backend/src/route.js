const express = require('express');
const { addUser,logUser, AdminUser, UpdateProfile } = require('./controllers/userController');
const { isAdmin, protectedResource } = require('./middlewares/authmiddleware');
const { updateCategory, createCategory, getAllCategory, getSingleCategory, deleteCategory} = require('./controllers/categoryController');
const { createProduct, getAllProducts, getSingleProduct, productPhoto, deleteProduct, updateProduct, productFilter, countProduct, listProduct, searchProduct, similarProduct, categoryWiseProduct, mainCategoryWiseProduct, braintreeToken, braintreePayment } = require('./controllers/productController');
const formidable = require('express-formidable');
// const { addProduct, alluserallproduct, topProduct, revenue } = require('./controller/productController');
// const protectedResource = require('./middleware/protectedResource');

const route = express.Router();

route.post('/signup',addUser);
route.post('/login', logUser);
route.get('/isadmin',protectedResource, isAdmin , AdminUser);


//==================CATEGORY ROUTES=============
// GET ALL CATEGORY
route.get('/category',getAllCategory)
route.get('/single-category/:slug',getSingleCategory)

// ====ADMIN ROUTES====

// CREATE CATEGORY
route.post('/create-category',protectedResource,isAdmin,createCategory)
// UPDATE CATEGORY
route.put('/update-category/:id',protectedResource,isAdmin,updateCategory)
// DELETE CATEGORY
route.delete('/delete-category/:id',protectedResource,isAdmin,deleteCategory)


// =====USER ROUTES======

// UPDATE PROFILE
route.put('/profile',protectedResource,UpdateProfile)



// ====================

// ==============================================
// ==================PRODUCT ROUTES=================
// CREATE PRODUCT
route.post('/create-product',protectedResource,isAdmin,formidable(),createProduct);
// Update Product
route.put('/update-product/:pid',protectedResource,isAdmin,formidable(),updateProduct);
// GET ALL PRODUCT
route.get('/get-product',getAllProducts);
// GET SINGLE PRODUCT
route.get('/get-product/:slug',getSingleProduct);
// GET PRODUCT PHOTO
route.get('/product-photo/:pid',productPhoto);
// GET PRODUCT FILTER
route.post('/filter-product',productFilter);
// DELETE PRODUCT
route.delete('/delete-product/:pid',deleteProduct);
// COUNT PRODUCT
route.get('/count-product',countProduct);
// List PRODUCT
route.get('/list-product/:page',listProduct);
// Search PRODUCT
route.get('/search-product/:keyword',searchProduct);
// Similar PRODUCT
route.post('/similar-product/:pid/:cid',similarProduct);
// CAtegoryWiseProduct
route.get('/category-product/:slug',categoryWiseProduct);
route.get('/category-product/all/:mainCategory',mainCategoryWiseProduct);

// payment routes
// token
route.get('/braintree/token', braintreeToken)
// payments
route.get('/braintree/payment',protectedResource, braintreePayment)



// =================================================

module.exports = route;
