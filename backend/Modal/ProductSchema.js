const mongoose = require('mongoose');
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
   
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true
    },
    uniqueProductId: {
        type: Number,
        unique: true
    },
    images: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10']
    },

});

function arrayLimit(val) {
    return val.length <= 10;
}

// Pre-save hook to calculate discountPrice
// productSchema.pre('save', function(next) {
//     if (this.discountPercentage && this.price) {
//         // this.discountPrice = this.price * (1 - this.discountPercentage / 100);
//         this.discountPrice="20"
//     }
//     next();
// });

const Product = mongoose.model('ProductData', productSchema);

module.exports = Product;
