const express = require('express');
const router = express.Router();
const BuyProductController = require("../controller/ProductBuyByUser");


router.post('/addProductToUser', BuyProductController.AddProductToParticularUser);
router.get('/cartitems',BuyProductController.getProductBuybyParticularUser)
router.delete('/deleteitems', BuyProductController.deleteParticularProductBuyBYuser)
router.patch('/addquantity',BuyProductController.addQuantityOfParticularProduct)
router.patch('/decreasequantity',BuyProductController.DecraeseQuantityOfParticularProduct)
router.get('/finalprice',BuyProductController.finalPriceOfCart)


module.exports = router;
