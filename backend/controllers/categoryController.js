const { default: slugify } = require("slugify");
const { categoryModel } = require("../models/categoryModel");

const createCategory = async (req, res) => {
    try {
        const { mainCategory, name } = req.body;
        if (!name || !mainCategory) {
            return res.status(401).send({ message: "Name and mainCategory are required" });
        }

        // Generate slug from name and mainCategory
        const slugName = mainCategory + ' ' + name;
        const slug = slugify(slugName);

        // Check if a category with the same slug already exists
        const existingCategory = await categoryModel.findOne({ slug });
        if (existingCategory) {
            return res.status(400).send({ message: "Category Already Exists" });
        }

        // Create and save the new category
        const category = await new categoryModel({ mainCategory, slug, name }).save();
        res.status(200).send({ message: "New Category Created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in Category" });
    }
};



// Update category
const updateCategory = async (req,res)=>{
    try {
        const {name, mainCategory} = req.body;
        const {id} = req.params;
        const slugname = mainCategory + ' ' + name;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(slugname)},{new:true})
        console.log(category);
        res.status(200).send({message: "Category Updated Suggessfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error while updating Category"} )
    }
}
// Delete Category
const deleteCategory = async (req,res)=>{
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({message: "Category Deleted Suggessfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error while deleting Category"} )
    }
}

// Get All Category
const getAllCategory = async (req,res)=>{
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            message: "All Category List",
            category,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error while getting all categories"})
    }
}
// Get Single Category
const getSingleCategory = async (req,res)=>{
    try {
        const category = await categoryModel.findOne({slug: req.params.slug});
        res.status(200).send({
            message: "Single Category: ",
            category,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error while getting Single category"})
    }
}


module.exports = {createCategory, updateCategory,getAllCategory, getSingleCategory, deleteCategory}