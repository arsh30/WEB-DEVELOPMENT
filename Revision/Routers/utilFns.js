const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../secrets.js");

module.exports.protectRoute = function protectRoute(req, res, next) {
    try {
         //it is exactly same as bodyChecker
    console.log("reached protect route");  //yeh sirf authentication ke liye use hota h
    
    console.log("61",req.cookies);  //1st param is token
    let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);  //for verify use cookie parser
    console.log("66", decryptedToken);
    
    
    //only for jwt :-> agar yeh info true  hogi to hi run hoga otherwise nhi
    //verify Every Time: if ur bringing right token to get response
    // let isallowed = true;  //isline ki jwt token dalenge

    if (decryptedToken) {
        next();
    } else {
        res.send("kindly login to access this resource");
        }
    } catch (err) {
        res.status(200).json({
            message: err.message
        })
    }
}  //we also export like that exports.protectRoute(means any file name)
 
module.exports.bodyChecker = function bodyChecker(req, res, next) {  //why we make ? coz agaar body me data na ho to idr tk aaye hi nhi
    console.log("reached body checekrr");
    let isPresent = Object.keys(req.body).length; //agar koi kuch bhjega to body empty aati h
   console.log("isPresent",isPresent);
    if (isPresent) {  //agar isne middle ware ne ans nhi diya to back bhi jaa skte h
        next();
    } else {
        res.send("send details in body");
    }
}
