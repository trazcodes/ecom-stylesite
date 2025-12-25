const { default: mongoose } = require("mongoose");

const orderSchema= new mongoose.Schema({
    products: [
        {
            type: mongoose.ObjectId,
            ref: "Product",
        },
    ],
    payment:{},
    buyer:{
        type: mongoose.ObjectId,
        ref: "user"
    },
    status:{
        type: String,
        default: "Not Processed",
        enum:["Not Processed","Processing","Shipped","delivered","cancel"],
    },

},
{timestamps:true}
)
const orderModel= mongoose.model('order',orderSchema);

module.exports={orderModel}