const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },

    //Cloudinary image upload link
    profilePic:{
        type:String,
        default:"",  
    }, 

    //Cloudinary image public id  for deletion
    profilepicPublicId:{
        type:String,
        default:"",
    },
    email:{
        type:String,                            
        required:true,
        unique:true,
    },         
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    token:{
        type:String,
        default:null,  
    },
    isVerfied:{
        type:Boolean,
        default:false,
    },
    isLoggedIn:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpiryTime:{
        type:Date,
        default:null,
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },zipcode:{
        type:String,
    },
    phoneNo:{
        type:String,
    },
    state:{
        type:String,
    }
    
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);