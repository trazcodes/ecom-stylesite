const { default: mongoose } = require("mongoose");

const categorySchema= new mongoose.Schema({
    mainCategory:{
        type: String,
        unique: false,
        required: true,
        
    },
    name:{
        type: String,
        unique: false,
        required: true,
        
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true
    }
})
const categoryModel= mongoose.model('category',categorySchema);

module.exports={categoryModel}