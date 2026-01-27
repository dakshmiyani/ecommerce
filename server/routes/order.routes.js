const express =require('express')
const router= express.Router();



const Authenticated = require('../middleware/isAuthenticated.middleware');
const OrderController =require("../controllers/order.controller");


router.post('/create',Authenticated.isAuthenticated,OrderController.createOrder);
router.get('/getorder', Authenticated.isAuthenticated,OrderController.getOrder)
router.put("/delivery-status/:orderId", Authenticated.isAuthenticated,Authenticated.isAdmin, OrderController.updateDeliveryStatus);
router.put("/cancel/:orderId", Authenticated.isAuthenticated, OrderController.cancelOrder);
router.get("/all",Authenticated.isAuthenticated,Authenticated.isAdmin, OrderController.getAllOrders);
router.get("/getorder/:id", Authenticated.isAuthenticated, OrderController.getOrderbyId);


module.exports= router;