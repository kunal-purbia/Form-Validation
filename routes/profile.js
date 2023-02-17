var express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
var router = express.Router();
var cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
urlencoded = express.urlencoded({ extended: false });

const User = mongoose.model("user");

const loginCheck = [  check('email', 'Email is not valid').isEmail(), 
                      check('password', 'Password cannot be empty').notEmpty()]

router.post('/', urlencoded, loginCheck, function(req, res){
  let errorData = validationResult(req);
  let errorArray = errorData.errors;
  if (errorArray.length === 0) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email, password:password}, function(err, foundUser){
      if(err){throw err}
      else{
        if(foundUser){
          res.cookie("user_email", foundUser.email)
          res.render('profile', {user: foundUser})
        } else{
          res.send("Account not found");
        }
      }
    })
  } else {
    const errorInput = errorArray[0].param;
    const errorMessage = errorArray[0].msg;

    res.render('login', {errorInput:errorInput, message:errorMessage});
  }
})

router.post('/update', function (req, res) {
  const userEmail = req.cookies.user_email;
  const findEmail = {
    email: userEmail
  };
  const newData = {
    username: req.body.username,
    email: req.body.email,
    dob: req.body.dob,
    age: req.body.age,
    password: req.body.password
  }

  User.updateOne(findEmail, newData, function(err, result){
    if(err) throw err;
    res.cookie("user_email", newData.email)
    res.render('profile', {updateMessage:"Profile updated successfully!", user:newData})
  })
})

router.post('/delete', function (req, res) {
  const userEmail = req.cookies.user_email;
  const findEmail = {
    email: userEmail
  };

  User.deleteOne(findEmail, function(err, result){
    if(err) throw err;
    res.clearCookie("user_email")
    res.send("<center><h1>Profile deleted successfully!</h1><button><a href='/'>HOME</a></button></center>")
  })
})

module.exports = router;