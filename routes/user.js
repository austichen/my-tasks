const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const flash = require('connect-flash')
const bcrypt = require('bcryptjs');
User = require('../models/user');


router.get('/login', (req, res) =>{
    res.render('login');
})

router.post('/login', (req,res) =>{
  const username = req.body.username;
  const password = req.body.password;
  User.findByUsername(username, (err, user) =>{
    if(err || !user){
      req.flash('red', 'Invalid username or password');
      res.redirect('/user/login');
    } else {
      if(bcrypt.compareSync(password, user.password)){
        req.flash('green', 'Login successful.')
        //TODO: redirect to actual page instead of homepage
        res.redirect('/')
      } else {
        req.flash('red', 'Invalid username or password');
        res.redirect('/user/login');
      }
    }
  })
})

router.get('/register', (req, res) =>{
  res.render('register', {errors: []});
})

router.post('/register', [
  check('firstName', 'First name is required').isLength({min: 1}),
  check('lastName', 'Last name is required').isLength({min: 1}),
  check('email', 'Email is invalid').isEmail(),
  check('username', 'Username is required').isLength({min: 1}),
  check('password', 'Password must be at least 6 characters long').isLength({min: 6}),
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
    console.log(errors.array())
    //return res.send('failed')
    /*
    errors.array().forEach(error => {
      req.flash(error.param, error.msg)
    })
    res.redirect('/user/register')
    return;
    */
    return res.render('register', {errors: errors.array()})
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt)
  const newUser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: hash
  })
  console.log(req.body.password)
  User.createUser(newUser, (err, user) =>{
    if(err){
      res.send('database errror');
    } else {
      //res.json(user);
      //TODO make this part legit
      req.flash('green', 'registration successful. please log in.')
      res.redirect('/user/login');
    }
  })
})

module.exports = router;
