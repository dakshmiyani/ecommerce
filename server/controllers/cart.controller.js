const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");




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

const addToCart = async (req,res) =>{


    try {
        const userId = req.id;
        const{productId} = req.body;

      
        const product = await productModel.findOne({productId})

       if(!product){
        return res.status(404).json({
            success:false,
            message:"product not found"
        })
       }

       let cart = await cartModel.findOne({userId})

       if(!cart){
       cart = new cartModel({
        userId,
        items:[{productId, quantity:1,price:product.productPrice}],
        totalPrice:product.productPrice

       }
    
    
    )
       }else{
        
       }


        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}