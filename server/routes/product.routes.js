const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const Authenticated = require('../middleware/isAuthenticated.middleware');
const {multipleUpload} = require('../middleware/multer.midlleware');



router.post('/add-product',Authenticated.isAuthenticated,Authenticated.isAdmin, multipleUpload, productController.addProduct)
router.get('/all-products', productController.getAllProducts)
router.put('/update-product/:id', Authenticated.isAuthenticated, Authenticated.isAdmin, multipleUpload, productController.updateProduct);
router.delete('/delete-product/:id', Authenticated.isAuthenticated, Authenticated.isAdmin, productController.deleteProduct);


module.exports = router;