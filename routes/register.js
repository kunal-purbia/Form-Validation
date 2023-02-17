var express = require('express');
const {
  check,
  validationResult
} = require('express-validator');
var router = express.Router();

const app = express();
app.use(express.json());
urlencoded = express.urlencoded({
  extended: false
});

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  dob: String,
  age: Number
});

const User = new mongoose.model("user", userSchema);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register');
});

const registerCheck = [check('username', 'Name field cannot be empty').notEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('dob', 'Date of birth cannot be empty').notEmpty(),
  check('password', 'Password cannot be empty').notEmpty(),
  check('password1').custom((value, { req })=>{
    if(value != req.body.password)
      throw new Error ("Confirm Password do not match password");
    return true;
  })
]

router.post('/', urlencoded, registerCheck, function (req, res) {
  let errorData = validationResult(req);
  let errorArray = errorData.errors;
  if (errorArray.length === 0) {
    const dob = req.body.dob;
    const year = dob.slice(0, 4);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    const userDetail = {};
    userDetail.username = req.body.username;
    userDetail.email = req.body.email;
    userDetail.dob = req.body.dob;
    userDetail.age = age;
    userDetail.password = req.body.password;
    
    const newUser = new User(userDetail);

    newUser.save((err)=>{
      if(err) throw err
      res.redirect('/login');
    })
  } else {
    const errorInput = errorArray[0].param;
    const errorMessage = errorArray[0].msg;
    // res.send(error)
    res.render('register', {errorInput:errorInput, message:errorMessage});
  }
})

module.exports = router;