const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");


// Protected Routes token base
const protectedResource = async (req,res,next)=>{
    const {authorization} = req.headers;
    console.log(authorization);
    if(!authorization){
        console.log("0");
        return res.status(405).json({error: "User not logged in"});
    }
    const token = authorization.replace("Bearer ","");
   
    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET, (error, payload)=>{
                if (error) {
                    console.log("0");
                    return res.status(401).send({error: "User not logged in"});
                }
            const {_id}=payload;
         
            userModel.findById(_id)
            .then((dbuser)=>{
                req.user= dbuser;
                console.log("1");
                next();
            })
        });

        
    } catch (error) {
        console.log(error);
    }
}

// Admin middleware

const isAdmin = async (req,res,next)=>{
    try {
       
        const user = await userModel.findById(req.user._id)
        console.log(user.role);
        if(user.role!== 1)
        {   
            return res.status(200).send({result: user.role})
        }
        else{
            console.log("Success in Admin Middleware");
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={protectedResource,isAdmin}