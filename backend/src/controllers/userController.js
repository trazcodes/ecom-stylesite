const  jwt  = require("jsonwebtoken");
const {hashPassword, comparePassword}= require("../helpers/authHelper"); 
const {userModel} = require("../models/userModel"); 



// Adding new User
const addUser = async (req,res) =>{
try {
    const {name,email,password,address,phone} = req.body;
    // validations
    if(!name||!email||!address||!phone){
        return res.send({error: "One or more fields are empty"});
    }
    // checking user
    const existingUser = await userModel.findOne({email})
    // existing user
    if(existingUser){
        return res.send({message: "User already registered with this email"})
    }
    // Registering User
  const hashedPassword = await hashPassword(password);
  const user = await new userModel({name,email,phone,address,password: hashedPassword}).save();
  res.send({message: 'user registered'})

} catch (error) {
    console.log(error);
    res.status(500).send({message: "Error in adding User from server"})
}
};


// Logging Existing User

const logUser = async (req,res)=>{
    try {
        const {email,password} = await req.body;

        // validation
        if(!email||!password){
            return res.status(401).send({message: "One or more fields are empty"})
        }
        // check user
        const user = await userModel.findOne({email})
        console.log(user);
        if(!user){
            return res.status(404).send("Email not registered")
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(401).send("Invalid Credentials")
        }
      
        // token
        const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET, {expiresIn: '5d'})
        res.status(200).send({result: {user:{
            name: user.name,
            email:user.email,
            phone:user.phone,
            address:user.address
        }, token}})
    } catch (error) {
        res.status(500).send({error: `${error}`})
    }
}

const AdminUser= async (req,res)=>{
       try {
        res.status(200).send({result: req.user.role});
       } catch (error) {
        console.log(error);
        res.status(401).send({message: "Access Denied"})
       }
}
 
// Update UserProfile

const UpdateProfile = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        // Check if the password is provided and meets the length requirement
        let hashedPassword;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password length must be greater than 6 characters' });
            } 
            hashedPassword = await hashPassword(password);
        }
        console.log("password:",user.password);
        // Prepare the fields to be updated
        const updatedFields = {
            name: name || user.name,
            phone: phone || user.phone,
            address: address || user.address
        };
        if (hashedPassword) {
            updatedFields.password = hashedPassword;
        }

        // Update user fields
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            updatedFields,
            { new: true }
        );

        console.log("Updated Successfully", req.body);
        res.status(200).send({ message: "Profile Updated Successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error While Updating Profile" });
    }
};




module.exports = {addUser, logUser,AdminUser,UpdateProfile}

