const mongoose = require('mongoose');

const connectDB = async ()=>{
mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Connected to MONGO");})
.catch((err)=>{console.log("Connection Error" + err);})
}
module.exports = connectDB;