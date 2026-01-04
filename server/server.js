require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

// database connection
const ConnectDB = require('./database/db')
  ConnectDB();

//routes
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require("./routes/cart.routes")
app.use('/api/users', userRoutes);
app.use('/api/products',productRoutes)
app.use("/api/cart",cartRoutes)





const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  

    console.log(`server is listening at port http://localhost:${PORT}`);
    
})