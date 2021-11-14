//npm init -y
//npm install express

const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser');
const userRouter = require('./Routers/userRouter.js');
const authRouter = require('./Routers/authRouter.js');

const app = express();

app.use(express.static("Frontend_folder"));  //here we write folder name which we want to open means sirf client side ki files access hoti h 
//isse jo bhi chheze ayegi vo issi folder se aayegi ab
app.use(express.json());
app.use(cookieParser()); // middleware to check the token is valid or not

// let content = JSON.parse(fs.readFileSync("data.json"));
//CRUD OPERATIONS==============================================================
//These are on App level so here we use some limited so multiple routes use express router which is below

//make route
// app.get('/', function (req, res) {
//     console.log("hello from home page");
//     res.send("<h1>hellow from backend</h>")
// })

// app.get('/', function (req, res) {
//     console.log("hello");
//     let content = JSON.parse(fs.readFileSync("data.json"));
//     res.status(200).json(  //at 1 time only 1 get request done
//         { message: content }  // do in postman
//     );    
// })

// app.post('/', function (req, res,next) {
//     let body = req.body;
//     console.log("before", req.body);
//     next();
// })

// app.use(express.json());  //in built methoda it have  , it is neccesary to always use and JO DATA express.json me aayega  
// // usko body me add krdega or yeh data print hota h iske through

// app.post('/', function (req, res) {
//     let body = req.body;
//     console.log("after", req.body);
//     res.status(200).json({ message: body })
// })

//=====================================================================

//B MAke multiple routes use express.router();

// eg localhost/user/10

app.use('/api/user', userRouter);  //whenever we send  the data we should send "api/user"
app.use('/api/auth', authRouter);


app.listen(8081, function () {
    console.log("Server is started");
})
app.use(function (req, res) {  //yeh hmesha last me aaata h
    let resOfPath = path.join("./Frontend_folder", "404.html");
    res.status(404).sendFile(path.join(__dirname, resOfPath));  //dirname se hum current folder me aagye jidr hmara code run hora h
  //isme yeh full path pass krte h to path module upr require krege
})


//better to read the data when file 