const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },
    productName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    productImg :[

        {
            url:{type: String, required: true},
            public_id:{type: String, required: true}
        }
    ],
    productPrice:{
        type: Number,
    },
    category:{
        type: String,
    },
    brand:{
        type: String,
    }
    
},
{timestamps: true}
)


module.exports = mongoose.model('Product', productSchema);