const catchAsync = require("../utils/CatchAsync");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require("../Modal/UserSchema");
const Useraddress=require("../Modal/UserAddressSchema")

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

exports.registerNewUser = catchAsync(
    async (req, res) => {

        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(422).json({ error: "Fill the All Data" });


        }

      
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }
        const userData = new User({
            firstName,
            lastName,
            email,
            password
        });
        await userData.save();

        res.status(201).json("uploaded");


});

exports.signIn = catchAsync(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Fill all the fields" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
        const isPasswordMatch = await bcrypt.compare(password, userLogin.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        } else {
            const payload = {
                userId: userLogin._id,
                name: userLogin.firstName,
                email: userLogin.email
            };
            const secretKey = process.env.SECRET_KEY; // Ensure this is set in your environment variables
            const options = {
                expiresIn: '30m' // Set token expiration to 10 seconds
            };

            const token = jwt.sign(payload, secretKey, options);

            await userLogin.save();

            res.cookie("token", token, { httpOnly: true });
            res.json({ userLogin });
        }
    } else {
        res.status(400).json({ error: "Invalid Credentials" });
    }
});


exports.CheckAuth = catchAsync(async (req, res, next) => {
    let token = req.cookies?.token;


    if (!token) {
        return res.status(400).json({ message: 'There is no token available' });
    }


    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const UserData = await User.findOne({ _id: decoded.userId });


    if (!UserData) {
        return res.status(400).json({ message: 'There is no user' });
    }

    res.status(200).json({
        status: "success",
        data: {
            user: {
                email: UserData.email
            },
        },
    });

});

exports.Logout = catchAsync((req, res) => {
    res.clearCookie('token', { httpOnly: true });
    res.status(200).json({ message: 'Logout successful' });
});

exports.setUserAddress= catchAsync(async(req,res)=>{
    const {email,street,city,state,postalCode,country,addressType}=req.body

    if(!email|| !street || !city || !state || !postalCode || !country || !addressType)
    {
        return res.status(422).json({ error: "Fill the All Data Properly" });
    }
    const UserAddress = new Useraddress({
        street,city,state,postalCode,country,addressType,email
    });
    await UserAddress.save();

    res.status(201).json("New Address is created");
})

exports.updateUserAddress = catchAsync(async (req, res) => {
    const uniqueAddressId = req.params.Id;
    const { email,street,city,state,postalCode,country,addressType } = req.body;
    const updatedUserAddress = await Useraddress.findOneAndUpdate(
        { uniqueAddressId },
        {  email,street,city,state,postalCode,country,addressType},
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedUserAddress) {
        return res.status(404).json({
            status: 'fail',
            message: 'No address is found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            Address: updatedUserAddress
        }
    });
});

exports.deleteUserAddress = catchAsync(async (req, res) => {
    const uniqueAddressId = req.params.Id; 
    console.log(uniqueAddressId)

        const deleteUserAddress = await Useraddress.deleteOne({ uniqueAddressId: uniqueAddressId });
        console.log(deleteUserAddress);

        if (deleteUserAddress.deletedCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No address found with that uniqueProductId'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Deleted successfully',
            data: {
                address: deleteUserAddress
            }
        });
    
});





