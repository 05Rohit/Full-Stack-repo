const path = require('path');
const Product = require('../Modal/ProductSchema.js');
const catchAsync = require('../utils/CatchAsync');

const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017/");

const dbName = "ecom";
const productCollectionName = "exampleproduct";
const savedAPiDataCollectionName = "productdatas";
const userCollectionName="usersdatas"

// Add data to MongoDB with file upload
exports.CreateProduct = catchAsync(async (req, res) => {
    const productData = new Product({
        ...req.body,
        thumbnail: req.file ? req.file.path : undefined
    });
    await productData.save();
    res.status(201).json({ message: "Product uploaded successfully", data: productData });
});

//Put data from API to MONGODB

async function saveDataToMongoDB(data) {
    try {
        const database = client.db(dbName);
        const productDataDB = database.collection(savedAPiDataCollectionName);


        if (Array.isArray(data)) {
            for (const element of data) {
                const existingDocument = await productDataDB.findOne({ uniqueProductId: element.uniqueProductId });
                if (!existingDocument) {
                    await productDataDB.insertOne(element);
                }
            }
        }

    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
    }
}

exports.insertNewProductFromApi = catchAsync(async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const userCollection = database.collection(productCollectionName);
        const allProductData = await userCollection.find({}).toArray();

        if (allProductData.length === 0) {
            return res.status(201).json({ message: "There is no product" });
        }

        const processedDataTable = allProductData.map((processedData) => ({
            title: processedData.title,
            category: processedData.category,
            description: processedData.description,
            price: processedData.price,
            discountPercentage: processedData.discountPercentage,
            rating: processedData.rating,
            stock: processedData.stock,
            brand: processedData.brand,
            thumbnail: processedData.thumbnail,
            uniqueProductId: processedData.id,
            images: processedData.images,
            discountPrice: Math.round((processedData.price * (1 - processedData.discountPercentage / 100)) * 100) / 100,
        }));

        await saveDataToMongoDB(processedDataTable);
        res.status(201).json({ message: "Product Data", data: processedDataTable });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});


//get All product List
exports.getAllProduct = catchAsync(async (req, res) => {

    const productDetails = await Product.find({});
    if (!productDetails) {
        return res.status(404).json({ message: "There is no product" });
    }

    res.status(200).json({ data: productDetails });
});


// Get product details
exports.getTheProductDetails = catchAsync(async (req, res) => {
    const {
        uniqueProductId
    } = req.body;
    console.log(req.body);

    const productDetails = await Product.findOne({ uniqueProductId: uniqueProductId });
    console.log(productDetails)

    if (!productDetails) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: productDetails });
});

// Download product photo
exports.getTheProductPhoto = catchAsync(async (req, res, next) => {
    const { uniqueProductId } = req.body;

    const productDetails = await Product.findOne({ uniqueProductId: uniqueProductId });

    if (!productDetails || !productDetails.thumbnail) {
        return res.status(404).json({ message: "Product or photo not found" });
    }

    const filePath = path.join(__dirname, '..', productDetails.thumbnail);

    res.download(filePath, (err) => {
        if (err) {
            next(err);
        }
    });
});


//
exports.deleteTheProduct = catchAsync(async (req, res, next) => {

    const { uniqueProductId } = req.body

    const deleteProductDetails = await Product.deleteOne({ uniqueProductId: uniqueProductId });

    if (!deleteProductDetails) {
        return res.status(404).json({ message: "No product is present" });
    }
    return res.status(404).json({ message: "Product deleted Successfully", deleteProduct: deleteProductDetails });

})


exports.updateTheProduct = catchAsync(async (req, res) => {
    const uniqueProductId = req.params.Id;

    const { title, category, price, stock } = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
        { uniqueProductId },
        { title, category, price, stock },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedProduct) {
        return res.status(404).json({
            status: 'fail',
            message: 'No product found with that uniqueProductId'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            product: updatedProduct
        }
    });
});


exports.feedBackByUser = catchAsync(async (req, res) => {
    const { uniqueProductId, userMessage,email } = req.body;

    // console.log(user)

    if (!uniqueProductId || !userMessage) {
        return res.status(400).json({ message: "uniqueProductId and userMessage are required" });
    }

  
    await client.connect();
    const database = client.db(dbName);
    const ProductClient = database.collection(savedAPiDataCollectionName);
    const UserCollection=database.collection(userCollectionName)

    const UserDetails=await UserCollection.findOne({email:email})

    const currentDate = new Date().toISOString().split('T')[0]; 
    const productDetails = await ProductClient.findOneAndUpdate(
        { uniqueProductId: uniqueProductId },
        {
            $push: { feedback: { message: userMessage, userFirstName: UserDetails.firstName, userLastname:UserDetails.lastName,userEmail:UserDetails.email,date:currentDate} }          
        },

    );
    if (!productDetails) {
        return res.status(404).json({ message: "Product not found or feedback not updated" });
    }


    return res.status(200).json({ message: "Feedback updated successfully", Feedback: productDetails });

});