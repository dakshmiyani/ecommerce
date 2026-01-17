
const Order = require('../models/order.model');
const Cart = require('../models/cart.model')
const {ORDER_STATUS }= require("../models/constants/constant")

const createOrder = async (req,res) =>{

 try  { const userId = req.id;
    const shippingAddress =req.body.shippingAddress
     
    if(!shippingAddress){
      return res.status(400).json({
        success:false,
        message:"shipping address is missing"
      })
    }
    const {
 firstName,
 lastName,
  phone,
  addressLine,
  city,
  state,
  zipcode,
} = shippingAddress;

if (
  !firstName||!lastName ||!phone ||!addressLine ||!city ||!state ||!zipcode
) {
  return res.status(400).json({
    success: false,
    message: "All shipping address fields are required",
  });

}

    let cart =  await Cart.findOne({userId}).populate({
      path: "items.productId",
      select: "productName productImg productPrice",
    })

   if( cart === null){
    return res.status(404).json({
      success:false,
      message:"No cart exists for this user"
    })
   }

    if(cart.items.length === 0){
      return res.status(400).json({
        success: false,
       message:"Cart exist but has no product"
      })
    }
  
  

    const orderItems = cart.items.map((item)=>({
      productId:item.productId._id,
      name:item.productId.productName,
      image:item.productId.productImg?.[0]?.url || "",
      price: item.price,
      quantity: item.quantity
    }))

    const subtotal = cart.totalPrice;
    const shipping = subtotal>299? 0: subtotal * 0.1;
    const tax = subtotal *0.05;
    const totalAmount= subtotal+shipping+tax;

      const order = await new Order({
        userId,
        shippingAddress: shippingAddress,
        items: orderItems,
        subtotal,
        shipping,
        tax,
        totalAmount,
        paymentStatus:"pending",
        orderStatus:"placed"
      })

      await order.save();

      cart.items =[];
      cart.totalPrice =0;
      
      await cart.save();




        return res.status(201).json({
      success:true,
      message:"order place. successfully",
       order,
       cart
    })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:error.message
    })

  }

  }

  const getOrder = async (req,res) =>{

     try {const userId = req.id;
     const order = await Order.find({userId});
    if(!order || order.length === 0){
      return res.status(404).json({
        success:false,
        message:"No order is placed"
      })
    }
  

    return res.status(200).json({
      success:true,
      order
    
    })
}catch(error){
  return res.status(500).json({
    success:false,
    message:error.message
  })

}
  }


  const updateDeliveryStatus = async (req,res)=>{
    try {

      const orderId = req.params.orderId;
       
      const order = await Order.findById(orderId);
       
      if(!order){
        return res.status(404).json({
          success:false,
          message:"No such order found"
        })
      }

      const {orderStatus} = req.body;

      if(!orderStatus){
        return res.status(400).json({
          success:false,
          message:"status is required"
        })
      }
      
      order.orderStatus = orderStatus;


      await order.save();


      return res.status(200).json({
        success:true,
        order,
        message:"status updated succesfully"
      })




      
    } catch (error) {
      
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }

  }
const cancelOrder = async (req,res) =>{
  try {
    const userId = req.id;
    const orderId = req.params.orderId;


 const order = await Order.findById(orderId);
     if(!order){
      return res.status(404).json({
        success:false,
        message:"No such order found"
      })
     }
     if (order.userId.toString() !== userId.toString()) {
  return res.status(403).json({ 
    success:false,
    message: "Not allowed" });
}

     if(order.orderStatus == ORDER_STATUS.SHIPPED){
      return res.status(400).json({
        success:false,
        message:"Order cannot be cancelled as it is already shipped"
      })
     }

     order.orderStatus = ORDER_STATUS.CANCELLED;
   
     await order.save();


     return res.status(200).json({
      success:true,
      message:"Order cancelled successfully"
     })

    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
    
  }
}

module.exports ={
  createOrder,
  getOrder,
  updateDeliveryStatus,
  cancelOrder
}