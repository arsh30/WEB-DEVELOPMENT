const express = require("express");
//note jin jin ko import kra tha use ke liye vo idr bhi lekr aayege ex: jwt or secret code
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets.js");
const userModel = require("../modal/usermodal.js");
const { bodyChecker } = require("./utilFns.js");
const emailSender = require("../helpers/emailSender.js");

const authRouter = express.Router();

//routes
authRouter.use(bodyChecker); //jo function har jagha use hona tha vo aise krege
authRouter.route("/signup").post(signupUser);
//   .post(bodyChecker, signupUser)

authRouter.route("/login").post(loginUser);

authRouter.route("/forgetPassword").post(forgetPassword);

authRouter.route("/resetPassword").post(resetPassword);
async function signupUser(req, res) {
  try {
    let newUser = await userModel.create(req.body); //data aayega body me
    res.status(200).json({
      message: "user created. successfully",
      user: newUser, //user ka data recieve krliya
    });
    console.log(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

// function signupUser1st(req, res) {
//     let { name, email, password, confirmPassword } = req.body;
//     if (password == confirmPassword) {
//         let newUser = { name, email, password };
//         //put entry
//         content.push(newUser);
//         //save in data storage
//         fs.writeFileSync("data.json", JSON.stringify(content));
//         res.status(200).json({
//             createdUser : newUser
//         })
//     } else {
//         res.status(422).json({ message: "Password or Email is Wrong" });
//     }
// }

// function createUser(req, res) {
//     console.log("users");
//     let body = req.body;
//     console.log("req.body");
//     content.push(req.body);
//     // 2 put it in data storage
//     fs.writeFileSync("data.json",JSON.stringify(content));
//     res.json({ message: content });
// }
// function createUser(req, res) {
//     console.log("users");
//     let body = req.body;
//     console.log("req.body");
//     content.push(req.body);
//     // 2 put it in data storage
//     fs.writeFileSync("data.json",JSON.stringify(content));
//     res.json({ message: content });
// }// function createUser(req, res) {
//     console.log("users");
//     let body = req.body;
//     console.log("req.body");
//     content.push(req.body);
//     // 2 put it in data storage
//     fs.writeFileSync("data.json",JSON.stringify(content));
//     res.json({ message: content });
// }
// function createUser(req, res) {
//     console.log("users");
//     let body = req.body;
//     console.log("req.body");
//     content.push(req.body);
//     // 2 put it in data storage
//     fs.writeFileSync("data.json",JSON.stringify(content));
//     res.json({ message: content });
// }

async function loginUser(req, res) {
  //jwt
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email }); //email check coz it may happen that samne wale ne kuch bhja na ho

    if (user) {
      if (user.password == password) {
        //so we verify and send the token
        let token = jwt.sign({ id: user["_id"] }, JWT_SECRET, {
          httpOnly: true,
        }); //here we create a signature or token
        //httpOnly true jo h  hm dit nahi krr skte fir
        console.log(token);
        res.cookie("JWT", token); // we send the token to the db
        res.status(200).json({
          data: user,
          message: "user logged In!",
        });
      } else {
        res.status(404).json({
          message: "email or password is incorrect",
        });
      }
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    //1st search on the basis of email
    let user = await userModel.findOne({ email }); //it is mongoosee query so we use async
    if (user) {
      //create token  :-> OTP based
      let token = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      let updateRes = await userModel.updateOne({ email }, { token }); //alag se krege pdate
      console.log(
        "updateQuery -> So for this we have to apply one more query ie findone",
        updateRes
      );

      let newUser = await userModel.findOne({ email }); //yeh token db se nikala hai

      //note:->UPDATEONE  se yeh jo user update hota h vo nhi deta agar vo chaiye to alag se query lgaege findone ki
      // console.log("updatedValue", updateValue);
      // let newUser = await userModel.findOne({ email });
      // console.log("newUser",newUser);

      // await emailSender(token, user.email);  //then we send this to the mail

      res.status(200).json({
        message: "User token send to your email",
        // email krra hmne ab then 2) token or update token bhjdiya
        user: newUser, //
        token, //token bhi bhj diya frontend pr baad me nahi mnagwaege
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    let { token, confirmPassword, password } = req.body;
    let user = await userModel.findOne({ token });
    if (user) {
      // await userModel.updateOne({ token }, {
      //     //     token: undefined,
      //     //     password: password,
      //     //     confirmPassword: confirmPassword
      //     // }, { runValidators: true })

      // }

      // user.password = password;  comment this and do in update user function(user router)
      // user.confirmPassword = confirmPassword;
      // user.token = undefined;
      // await user.save();

      let newUser = await userModel.findOne({ email: user.email });
      res.status(200).json({
        message: "user token send to your email",
        user: newUser,
        token,
      });
    } else {
      res.status(404).json({
        message: "Password and Confirm Password have not matched",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

//function tempLoginUser(req, res) {
//     let { email, password } = req.body;
//     let obj = content.find((obj) => {
//         //agar userobject same email wala bnda hai toh
//         return obj.email == email  //rhs wali email abhi jo bhjege vo hogi
//     })
//     if (!obj) {  //means user hi nhi h
//         return res.status(404).json({
//             message :"User not found"
//         })
//     }
//     if (obj.password == password) {  // jb login krete h tb login ke tym pr sath sath hum toen bhi bhjte h
//         //set header ->
//         var token = jwt.sign({ email:obj.email }, JWT_SECRET);  //2nd param is secret code
//         console.log(token);
//         //res ki body bhji h -> through cookies
//         res.cookie("JWT", token);  //konse naam ki cookie bhji or sath token bhi
//         res.status(200).json({
//             message: "user logged In",
//             //ab chahe to user bhi mangwale btw it does not requred
//             user:obj
//         })
//     } else {
//         res.status(422).json({
//             message: "password doesnot match"
//         })
//     }
// }
module.exports = authRouter;

// function createUser(req, res) {
//     console.log("users");
//     let body = req.body;
//     console.log("req.body");
//     content.push(req.body);
//     // 2 put it in data storage
//     fs.writeFileSync("data.json",JSON.stringify(content));
//     res.json({ message: content });
// }
