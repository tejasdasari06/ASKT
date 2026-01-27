const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Men', 'Women']
    },
    sizes: {
        type: [String],
        default: ['S', 'M', 'L', 'XL']
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 10,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
