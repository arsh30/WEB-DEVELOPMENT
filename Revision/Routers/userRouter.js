//dependency
const express = require("express");
const userRouter = express.Router();
const userModel = require("../modal/usermodal.js");
const { protectRoute } = require("./utilFns");

//2 routers
userRouter
    .route('/') 
    .get(protectRoute,getUsers)  //localhost/user - > get request

    
    /*.post(bodyChecker,isAuthenticated,isAuthorized ,createUser); //localhost/user -> post req bodyChecker is a mddleware function
    userRouter (only for knowledge)
    .route('/:id') //localhost/user/10 -> post
    .get(getUsers)
    */
//3rd functions of that routers
 async function getUsers(req, res) {  //kuch nhi krra yeh it is understanding for jwt
    try {
        let users = await userModel.find();  //sare users get krna chahte h
        res.status(200).json({
            message: users
        })
    } catch (err) {
        res.status(502).json({
            message: err.message
        })
    }
}

module.exports = userRouter;