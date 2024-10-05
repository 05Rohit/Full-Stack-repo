
const { MongoClient } = require("mongodb");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const express = require("express");
const router = express.Router();
const path = require('path');


require("../Database/db");
const User = require("../Modal/UserSchema");
const BuyProduct = require("../Modal/BuyProduct")

const dbName = "ecom";
const ProductCollectionName = "productdatas";
const UserAddress = "useraddresses"
const client = new MongoClient("mongodb://localhost:27017/");


exports.AddProductToParticularUser = catchAsync(async (req, res, next) => {
  const { uniqueProductId, email, uniqueAddressId } = req.body;

  await client.connect();
  const database = client.db(dbName);
  const ProductData = database.collection(ProductCollectionName);
  const userAddress = database.collection(UserAddress);

  const productDataDetails = await ProductData.findOne({ uniqueProductId: uniqueProductId });
  const userHomeAddress = await userAddress.findOne({ uniqueAddressId: uniqueAddressId });
  const userDetails = await User.findOne({ email: email });

  if (!productDataDetails || !userDetails) {
    return res.status(404).json({ message: "Product or user not found" });
  }

  const existingUser = await BuyProduct.findOne({ email: email });

  if (existingUser) {
    // If user exists, push the new product details to the productDetails array
    existingUser.productDetails.push({
      title: productDataDetails.title,
      category: productDataDetails.category,
      description: productDataDetails.description,
      discountPrice: productDataDetails.discountPrice,
      price: productDataDetails.price,
      discountPercentage: productDataDetails.discountPercentage,
      rating: productDataDetails.rating,
      stock: productDataDetails.stock,
      brand: productDataDetails.brand,
      thumbnail: productDataDetails.thumbnail,
      productAmount: productDataDetails.price,
      uniqueProductId: productDataDetails.uniqueProductId,
    });

    // Check if the address already exists
    const addressExists = existingUser.addressDetails.some(address => address.uniqueAddressId === uniqueAddressId);

    if (!addressExists) {
      existingUser.addressDetails.push({
        street: userHomeAddress.street,
        city: userHomeAddress.city,
        state: userHomeAddress.state,
        postalCode: userHomeAddress.postalCode,
        country: userHomeAddress.country,
        addressType: userHomeAddress.addressType,
        uniqueAddressId: userHomeAddress.uniqueAddressId,
      });
    }

    await existingUser.save();
    res.status(200).json({ message: "Product added to existing user successfully", data: existingUser });
  } else {
    // If user does not exist, create a new document
    const newProductByUser = new BuyProduct({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      productDetails: [
        {
          title: productDataDetails.title,
          category: productDataDetails.category,
          description: productDataDetails.description,
          discountPrice: productDataDetails.discountPrice,
          price: productDataDetails.price,
          discountPercentage: productDataDetails.discountPercentage,
          rating: productDataDetails.rating,
          stock: productDataDetails.stock,
          brand: productDataDetails.brand,
          thumbnail: productDataDetails.thumbnail,
          productAmount: productDataDetails.price,
          uniqueProductId: productDataDetails.uniqueProductId,
        },
      ],
      addressDetails: [
        {
          street: userHomeAddress.street,
          city: userHomeAddress.city,
          state: userHomeAddress.state,
          postalCode: userHomeAddress.postalCode,
          country: userHomeAddress.country,
          addressType: userHomeAddress.addressType,
          uniqueAddressId: userHomeAddress.uniqueAddressId,
        },
      ],
    });

    await newProductByUser.save();
    res.status(201).json({ message: "Product added to new user successfully", data: newProductByUser });
  }
});

exports.getProductBuybyParticularUser = catchAsync(async (req, res, next) => {

  const { email } = req.body
  console.log(req.body)

  const AllCartItems = await BuyProduct.findOne({ email: email })


  if (!AllCartItems) {
    return res.status(404).json({ message: "Your cart Is empty" });

  }

  res.status(201).json({ message: "All cart Items", data: AllCartItems });

})


exports.deleteParticularProductBuyBYuser = catchAsync(async (req, res, next) => {
  const { email, productId } = req.body;

  const user = await BuyProduct.findOneAndUpdate(
    { email: email },
    { $pull: { productDetails: { _id: productId } } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User or product not found" });
  }

  if (user.productDetails.length === 0) {
    await BuyProduct.deleteOne({ email: email });
    return res.status(200).json({ message: "User and all products deleted successfully" });
  }

  res.status(200).json({ message: "Product deleted successfully", data: user });
});

// Increase quantity by one Only
exports.addQuantityOfParticularProduct = catchAsync(async (req, res, next) => {
  const { email, productId } = req.body;

  const cart = await BuyProduct.findOne({ email: email });

  if (!cart) {
    return res.status(404).json({ message: "User not found" });
  }

  const productIndex = cart.productDetails.findIndex(elem => elem._id.toString() === productId);


  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  // Add or update the quantity field
  cart.productDetails[productIndex].quantity = (cart.productDetails[productIndex].quantity || 0) + 1;

  if (cart.productDetails[productIndex]) {
    cart.productDetails[productIndex].productAmount = cart.productDetails[productIndex].price * cart.productDetails[productIndex].quantity;
  }



  await cart.save();

  res.status(200).json({ message: "Product quantity updated successfully", data: cart });
});

exports.DecraeseQuantityOfParticularProduct = catchAsync(async (req, res, next) => {
  const { email, productId } = req.body;

  const cart = await BuyProduct.findOne({ email: email });

  if (!cart) {
    return res.status(404).json({ message: "User not found" });
  }

  const productIndex = cart.productDetails.findIndex(elem => elem._id.toString() === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  // Add or update the quantity field
  cart.productDetails[productIndex].quantity = (cart.productDetails[productIndex].quantity || 0) - 1;
  if (cart.productDetails[productIndex]) {
    cart.productDetails[productIndex].productAmount = cart.productDetails[productIndex].price * cart.productDetails[productIndex].quantity;
  }
  await cart.save();

  if (cart.productDetails[productIndex].quantity < 1) {
    await BuyProduct.deleteOne({ email: email });
    return res.status(200).json({ message: "User and all products deleted successfully" });
  }

  res.status(200).json({ message: "Product quantity updated successfully", data: cart });
});

exports.finalPriceOfCart = catchAsync(async (req, res) => {
  const { productBuyId } = req.body
  const productData = await BuyProduct.findOne({ productBuyId: productBuyId });
  if (!productData) {
    return res.status(404).json({ message: "Product not found" });
  }
  const productArray = productData.productDetails;
  let FinalPrice = 0;

  for (let i = 0; i < productArray.length; i++) {
    FinalPrice += productArray[i].productAmount;
  }
  productData.finalPrice = FinalPrice
  await productData.save()
  return res.status(200).json({ message: "Final Price", finalPrice: FinalPrice })

})











