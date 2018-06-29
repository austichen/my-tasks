const LocalStrategy = require('passport-local').Strategy;
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

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    User.findUserById(id, (err, user) => {
      done(err, user);
    });
  })
}
