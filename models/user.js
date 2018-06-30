const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
})

const User = module.exports = mongoose.model('User', userSchema);

const createUser = (user, callback) =>{
  User.create(user, callback)
}

const findByUsername = (_username, callback) =>{
  User.findOne({username: _username}, callback)
}

const findByUsernameAsync = (_username) => {
  return User.findOne({username: _username})
}

const findUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports = {
  createUser,
  findByUsername,
  findByUsernameAsync,
  findUserById
}
