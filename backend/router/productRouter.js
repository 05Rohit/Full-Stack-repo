const express = require('express');
const router = express.Router();
const multer = require('multer');
const ProductController = require('../controller/ProductController');
const { route } = require('./BuyProductRouter');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Add data to MongoDB with file upload
router.post('/createproduct', upload.single('thumbnail'), ProductController.CreateProduct);

//get All product
router.post('/setproduct',ProductController.insertNewProductFromApi)
router.get('/allproduct',ProductController.getAllProduct)

// Get product details
router.get('/getproductdata', ProductController.getTheProductDetails);

// Download product photo
router.post('/downloadProductPhoto', ProductController.getTheProductPhoto);

router.delete('/deleteproduct',ProductController.deleteTheProduct)
router.patch('/updateproduct/:Id',ProductController.updateTheProduct)
router.post('/feedback',ProductController.feedBackByUser)


module.exports = router;
