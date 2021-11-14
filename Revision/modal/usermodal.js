const mongoose = require("mongoose");
let { PASSWORD } = require("../secrets.js");
const validator = require("email-validator");

let db_link = `mongodb+srv://admin:
${PASSWORD}
@cluster0.vlaa8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(db_link) //mongoose is async function
  .then(function (connection) {
    console.log("db is connected");
  })
  .catch(function (err) {
    console.log("err", error);
  });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            //3rd party library  -> npm eamil validator
          return validator.validate(this.email); // true
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: function () {
            return this.password == this.confirmPassword
        }
    },
    createdAt: {
        type: String,       
    },
    token:String
        //add validation upto
    //validUpto: 10sec
})

//Hooks
userSchema.pre('save', function (next) {
    this.confirmPassword = undefined;
    next();
})

//model: whenever we use schema the function are in model
let userModel = mongoose.model("UserModel", userSchema);  //2nd param we passes the schema which we use

//so to use this we exports this
module.exports = userModel;