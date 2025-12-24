
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");



// =======================================================
const ProductSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type: String,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required:true,
    },
    category:{
        type:mongoose.ObjectId,
        ref: "category",
        require:true,
    },
    quantity:{
        type:Number,
        required: true,
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,

    },
    createdAt: { type: Date, default: Date.now },
})
const productModel = mongoose.model('Product',ProductSchema);
// ===========================================================

module.exports= productModel
