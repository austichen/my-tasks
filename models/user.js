const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
})

const User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (user, callback) =>{
  User.create(user, callback)
}

module.exports.findByUsername = (_username, callback) =>{
  User.findOne({username: _username}, callback)
}

module.exports.findUserById = (id, callback) => {
  User.findById(id, callback);
}
