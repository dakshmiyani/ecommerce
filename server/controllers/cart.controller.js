const cartModel = require("../models/cart.model");




const getCart = async (req,res)=>{
    try {

        const userId =req.id;

        const cart= await cartModel.findOne({userId}).populate("items.productId")
         if(! cart){
            return res.json({
                success:true,
                 cart:[]
                })
         }
          res.status(200).json({
            success:true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}