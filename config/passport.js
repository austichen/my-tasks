const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bcrypt = require('bcryptjs');
User = require('../models/user');


module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('check');
      User.findByUsername(username, (err, user) =>{
        if(err || !user){
          return done(null, false, {message: 'Invalid username'});
        } else {
          if(bcrypt.compareSync(password, user.password)){
            console.log('login successful');
            console.log(user);
            return done(null, user, {message: 'Login successful.'});
          } else {
            return done(null, false, {message: 'Invalid password.'})
          }
        }
      })
    }
  ))

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/login/google/success"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
       User.googleIdAuthorize(profile, function (err, user) {
         return done(err, user);
       });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    User.findUserById(id, (err, user) => {
      done(err, user);
    });
  })
}
