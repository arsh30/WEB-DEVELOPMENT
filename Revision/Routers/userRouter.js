//dependency
const express = require("express");
const userRouter = express.Router();
const userModel = require("../modal/usermodal.js");
const { protectRoute, bodyChecker } = require("./utilFns");

//2 routers
userRouter
    .route('/')
    .post(bodyChecker, createUser)
    .get(protectRoute, getUsers)  //localhost/user - > get request

userRouter  //all perform crud operation
    .route('/:id')
    .get(getUser)
    .patch(bodyChecker, updateUser)
    .delete (bodyChecker, deleteUser);
    /*.post(bodyChecker,isAuthenticated,isAuthorized ,createUser); //localhost/user -> post req bodyChecker is a mddleware function
    userRouter (only for knowledge)
    .route('/:id') //localhost/user/10 -> post
    .get(getUsers)
    */
//3rd functions of that routers
 async function getUsers(req, res) {  //kuch nhi krra yeh it is understanding for jwt
  //agar sari list mangwani h
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


//CRUD OPERATIONS
async function createUser(req, res) {
    //simple samne wala user req.body me data layega or dedega hme
    //agar let user = req.body nhi likha it is already check in bodychecker that body is not empty
    try {
        
        let user = await userModel.create(req.body);
        res.status(200).json({
            user: user
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Err"
        });
    }
}

async function getUser(req, res) {
    //idr data parameter me aayega we paas the link
    let { id } = req.params
    try {
        let users = await userModel.findById(id);
        res.status(200).json({
            "message": users
        })
    } catch (err) {
        res.status(200).json({
            message:err.message
        })
    }
}

async function updateUser(req, res) {
    //isme id jo h vo params me aayegi or data jo h vo req.body me aayega
    let { id } = req.params;
    try {
        let user = await userModel.findById(id);   //findbyid:- jo mongoose id bnata hai uski baat hori
        if (user) {
            // req.body.id = undefined; yeh bhi nhi chaiye coz param se direct attach hoga
            for (let key in user) {
                user[key] = req.body[key];
            }
            await user.save();
            res.status(200).json({
                user: user
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:"server error"
        })
    }
}

async function deleteUser(req, res) {
    let { id } = req.params;
    // isme param se id nikali or req mari or vo bnda delete
    try {
        let user = await userModel.findByIdAndDelete(id);
        res.status(200).json({
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message : "server error"
        })
    }
}
module.exports = userRouter;