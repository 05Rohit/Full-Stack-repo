const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser")

const userController = require("../controller/userAuthController");
router.use(cookieParser());


router.get(
  "/alluser",
  userController.getAllUsers
);

router.post(
  "/register",
  userController.registerNewUser
);

router.post("/signin", userController.signIn)
router.get('/checkauth', userController.CheckAuth)
router.post('/logout', userController.Logout)
router.post('/saveuseraddress',userController.setUserAddress)
router.post('/updateaddress/:Id',userController.updateUserAddress)
router.delete('/deleteaddress/:Id',userController.deleteUserAddress)



module.exports = router;
