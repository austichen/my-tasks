isLoggedIn = function(req, res, next) {
  if(!req.user) {
    req.flash('red', 'please log in first.')
    return res.redirect('/user/login')
  }
  next();
}

module.exports = isLoggedIn;
