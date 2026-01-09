const mongoose = require('mongoose');



const orderSchema = mongoose.Schema({
    
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

      shippingAddress: {
  fullName: String,
  phone: String,
  addressLine: String,
  city: String,
  state: String,
  zipcode: String
},
   items :[
 {
 productId:  {
    type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    name:String,
    image: String,
     price: Number,
    quantity: Number,

   }

   ],
 
   subTotal: {
    type:Number
   },
   shipping:{
    type:Number
   },
   tax:{
    type:Number
   },
   totalAmount:{
    type:Number
   },

   paymentStatus :{
    type: String,
    enum: ["pending","paid","failed"],
    default: "pending"
   },

   orderStatus:{
    type:String,
    enum:["placed","shipped", "delivered", "cancelled"],
    default:"placed"
   }

 
},{
    timestamps:true
})

module.exports = mongoose.model("Order",orderSchema)