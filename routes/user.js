const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
User = require('../models/user');


router.get('/login', (req, res) =>{
  res.render('login');
})



router.get('/register', (req, res) =>{
  res.render('register');
})

router.post('/register', [
  check('firstName', 'First name is required').exists(),
  check('lastName', 'Last name enter a password').exists(),
  check('email', 'Email is required').exists(),
  check('email', 'Email is invalid').isEmail(),
  check('password', 'Password is required').exists(),
  check('password', 'Password must be at least 6 characters long').isLength({min: 5}),
  check('passwordVerify', 'Passwords must match')
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.password) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.send('failed')
    //return res.render('register', {errors: errors.array()})
  }
  const newUser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  console.log(req.body.password)
  User.createUser(newUser, (err, user) =>{
    if(err){
      res.send('database errror');
    } else {
      res.json(user);
    }
  })
})

module.exports = router;
