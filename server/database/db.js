const mongoose = require('mongoose');
require('dotenv').config();


const ConnectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log('mongodb connected successfully');
        
        
    } catch (error) {
        console.log("MongoDB connection failed", error);
        
        
    }
}

module.exports= ConnectDB