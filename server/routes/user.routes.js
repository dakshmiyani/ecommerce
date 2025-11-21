const express = require('express');
const app = express();
const router = express.Router();




const UserController = require('../controllers/user.controller');
const Authenticated = require('../middleware/isAuthenticated.middleware');
const {singleUpload} = require('../middleware/multer.midlleware');

router.post('/register', UserController.registerUser);
router.post('/verify', UserController.verify);
router.post('/reverify', UserController.reVerify);
router.post('/login', UserController.login);
router.post('/logout', Authenticated.isAuthenticated, UserController.logout);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/verify-otp/:email', UserController.verifyOTP);
router.post('/change-password/:email', UserController.changePassword);
router.get('/all-users',Authenticated.isAuthenticated, Authenticated.isAdmin, UserController.allUsers);
router.get('/get-user/:id', UserController.getUserById); //Authenticated.isAuthenticated, Authenticated.isAdmin,
router.put('/update/:id', Authenticated.isAuthenticated,singleUpload, UserController.updateUser);


module.exports = router;