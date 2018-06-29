const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const flash = require('connect-flash')
const bcrypt = require('bcryptjs');
const passport = require('passport');
User = require('../models/user');

const test = 'hello world'
router.get('/login', (req, res) =>{
    res.render('login');
})

router.post('/login', (req,res, next) =>{
  console.log('check2')
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/user/login',
    successFlash: true,
    failureFlash: true
  })(req, res, next);
})

router.get('/logout', (req, res) => {
  if(req.user){
    req.flash('green', 'you have been logged out.')
  } else {
    req.flash('red', 'you are not logged in')
  }
  req.logout();
  res.redirect('/');
})

router.get('/register', (req, res) =>{
  res.render('register', {errors: []});
})

router.post('/register', [
  check('firstName', 'First name is required').isLength({min: 1}),
  check('lastName', 'Last name is required').isLength({min: 1}),
  check('email', 'Email is invalid').isEmail(),
  check('username', 'Username is required')
    .isLength({min: 1})
    .custom(async (value, { req }) => {
      let user = await User.findByUsername(value);
      if (user) {
        return false;
      }
    })
    .withMessage('Username is already taken'),
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

router.get('/', (req, res, next) => {
  if(!req.user){
    return res.render('loginRequired');
  }
  next()
}, (req, res) => {
  res.render('profile', {user: req.user})
})


module.exports = router;
