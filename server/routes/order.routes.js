const express =require('express')
const router= express.Router();



const Authenticated = require('../middleware/isAuthenticated.middleware');
const OrderController =require("../controllers/order.controller");


router.post('/create',Authenticated.isAuthenticated,OrderController.createOrder)


module.exports= router;