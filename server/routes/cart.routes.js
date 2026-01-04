const express = require('express');
const router = express.Router();


const Authenticated = require('../middleware/isAuthenticated.middleware');

const cartController= require('../controllers/cart.controller');




router.get('/getcart', Authenticated.isAuthenticated, cartController.getCart);
router.post('/add', Authenticated.isAuthenticated,cartController.addToCart);
router.put('/update', Authenticated.isAuthenticated,cartController.updateQuantity);
router.delete('/remove', Authenticated.isAuthenticated, cartController.removQuantity)

module.exports = router;