const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const Authenticated = require('../middleware/isAuthenticated.middleware');
const {multipleUpload} = require('../middleware/multer.midlleware');



router.post('/add-product',Authenticated.isAuthenticated,Authenticated.isAdmin, multipleUpload, productController.addProduct)
router.get('/all-products', productController.getAllProducts)




module.exports = router;