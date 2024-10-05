const mongoose = require("mongoose")

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");



const BuyProductData = mongoose.Schema({

    productBuyId: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },

    productDetails: {
        type: [
            {
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
                discountPrice: {
                    type: Number,
                    default: 20,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
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
                quantity:{
                    type:Number,
                    default:1
                },
                uniqueProductId: {
                    type: Number,
                    unique: true
                },
                images: {
                    type: [String],
                    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
                },
                productAmount:{
                    type:Number,
                    default:0

                }

            },
        ],
        default: [],
    },
  
    addressDetails: [
        {
          street: String,
          city: String,
          state: String,
          postalCode: String,
          country: String,
          addressType: String,
          uniqueAddressId: String,
        },
    ],
    finalPrice:{
        type:Number,
        default:null
    }
});


BuyProductData.pre("save", function (next) {
    if (this.isNew) {
        const currentDate = moment().format("YYYYMMDD");
        const currentTime = moment().format("HHmmss");
        this.productBuyId = `${currentDate}${currentTime}`;
    }
    next();
});


function arrayLimit(val) {
    return val.length <= 10;
}


const BuyProduct = mongoose.model("BuyProductData", BuyProductData)

module.exports = BuyProduct