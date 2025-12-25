const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const fs = require('fs');
const { categoryModel } = require("../models/categoryModel");
const braintree = require("braintree")


// payment Gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



// Create New Product
const createProduct = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        if (!name || !description || !price || !category || !quantity || !photo) {
            return res.status(500).send({ message: "One or more fields are empty" })
        }
        if (photo.size > 1000000) {
            return res.status(500).send({ message: "Photo Size should be less than 1 mb" })
        }
        const product = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({
            success: true,
            message: "product created Successfully",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Creating Product" })
    }
}

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        let product = await productModel.findById(req.params.pid);

        // Check if a new photo is provided
        if (req.files.photo) {
            const { photo } = req.files;
            if (photo.size > 10000000) {
                return res.status(500).send({ message: "Photo Size should be less than 1 mb" });
            }
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        // Update other fields
        product.name = name;
        product.slug = slugify(name);
        product.description = description;
        product.price = price;
        product.category = category;
        product.quantity = quantity;
        product.shipping = shipping;

        // Save the updated product
        await product.save();

        res.status(201).send({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in updating product" });
    }
}


// Get products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({ TotalCount: products.length, message: "true", products })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in getting products" })
    }
}
// Get Single product
const getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category');
        res.status(200).send({ message: "true", product })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in getting products" })
    }
}

// Get Product Photo
const productPhoto = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error getting Product photo" })
    }
}

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({ message: "Product deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error deleting product" })
    }
}

// Filter Product
const productFilter = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0)
            args.category = checked
        if (radio.length)
            args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({ products })
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error filtering Products" })
    }
}

// Count Product
const countProduct = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({ total })
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error Counting Products" })

    }
}

// List Product based on page
const listProduct = async (req, res) => {
    try {
        const perPage = 12;
        const page = req.params.page ? req.params.page : 1
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({ products })

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error Listing Products" })

    }
}

// Search Product
const searchProduct = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        })
            .select("-photo");
        res.send({ result })
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error Searching Products" })

    }
}

// Similar Product
const similarProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }

        }).select('-photo').limit(3).populate("category")
        res.send({ products })
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error Getting Similar Products" })

    }
}
// Get Category wise Product
const categoryWiseProduct = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category').select('-photo')
        console.log("Products" + products);
        res.status(200).send({ category, products })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while getting  category wise Product" })

    }
}
// Get MAin Category wise Product
const mainCategoryWiseProduct = async (req, res) => {
    try {
        console.log(req.params);
        const category = await categoryModel.find({ mainCategory: req.params.mainCategory })
        const products = await productModel.find({ category }).populate('category').select('-photo')
        console.log("Products" + products);
        res.status(200).send({ category, products })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while getting  category wise Product" })

    }
}

// payment gateway api


// token
const braintreeToken = async (req,res) => {
     try {
        gateway.clientToken.generate({}, function(err,response){
            if(err){
                res.send(err);
            
            }else{
                console.log(response);
                
                res.send(response);
            }
        })
     } catch (error) {
        console.log(error);
        
     }
}

// paymnet
const braintreePayment = async (req, res) => {
try {
    const {cart, nonce} = req.body;
    let total = 0;
    cart.map((i) => {
        total+=i.price;
    });
    let newTransaction = gateway.transaction.sale({
        amount:total,
        PaymentMethodNonce: nonce,
        option:{
            submitForSettlement: true,
        }
    },
function(error,result){
    if(result){
        const order =  orderModel({
            products:cart,
            payment:result,
            buyer: req.user._id

        }).save()
        res.json({ok:true})
    }else{
        res.status(500).send(error)
    }
}
)
} catch (error) {
    console.log(error);
    
}
}

module.exports = {
    createProduct, productFilter,
    getAllProducts, getSingleProduct,
    productPhoto, deleteProduct,
    updateProduct, countProduct,
    listProduct, searchProduct, similarProduct,
    categoryWiseProduct, mainCategoryWiseProduct, braintreeToken,
    braintreePayment
}