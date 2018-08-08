const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const flash = require('connect-flash')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const isLoggedIn = require('../middleware/middleware.js')
const moment = require('moment');
User = require('../models/user');
Task = require('../models/task');

const isOverDue = (checkDate, knownDate) => {
  if (moment(checkDate).year() < moment(knownDate).year()) {
    return true;
  } else if (moment(checkDate).year() > moment(knownDate).year()) {
    return false;
  } else {
    if (moment(checkDate).month() < moment(knownDate).month()) {
      return true;
    } else if (moment(checkDate).month() > moment(knownDate).month()) {
      return false;
    } else {
      if (moment(checkDate).date() < moment(knownDate).date()) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}

function computeGraphData(tasks) {
  var overdueCount=0, completedCount=0, uncompletedCount=0;
  tasks.forEach(task => {
    if(task.isDone) {
      completedCount++;
    } else if(isOverDue(task.date_due, new Date())) {
      overdueCount++;
    } else {
      uncompletedCount++;
    }
  })
  const graphData = {
    overdue: overdueCount,
    completed: completedCount,
    uncompleted: uncompletedCount
  }
  return graphData;
}

router.get('/login', (req, res, next) => {
  if(req.user) {
    req.flash('red', 'you are already logged in')
    return res.redirect('/')
  }
  next();
}, (req, res) =>{
    res.render('login');
})

router.get('/login/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/login/google/success',
  passport.authenticate('google', { failureRedirect: '/user/login', failureFlash: true }),
  function(req, res) {
    req.flash('green', 'you have successfuly logged in')
    res.redirect('/');
  }
);


router.post('/login', (req,res, next) =>{
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
      let user = await User.findByUsernameAsync(value);
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

router.get('/', isLoggedIn, (req, res) => {
  Task.findTasksByUserId(req.user.id, (err, tasks) => {
    if(err) {
      req.flash('red', 'database error');
      res.redirect('/')
    } else {
      const graphData = computeGraphData(tasks);
      console.log(graphData)
      res.render('profile', {user: req.user, data: graphData})
    }
  })
})


module.exports = router;
