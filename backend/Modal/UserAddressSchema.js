const mongoose = require('mongoose');
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const UserAddressSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    addressType: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    uniqueAddressId: {
        type: String, 
        required: true  
    }
});

UserAddressSchema.pre('validate', function(next) {
    if (this.isNew) {
        const currentDate = moment().format("YYYYMMDD");
        const currentTime = moment().format("HHmmss");
        this.uniqueAddressId = `${currentDate}${currentTime}`;
    }
    next();
});

UserAddressSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const UserAddress = mongoose.model('UserAddress', UserAddressSchema);

module.exports = UserAddress;
