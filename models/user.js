const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
  taskInfo: {
    numTotal: {type: Number, default: 0},
    numCompleted: {type: Number, default: 0}
  }
})

const User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (user, callback) =>{
  User.create(user, callback)
}

module.exports.findByUsername = (_username, callback) =>{
  User.findOne({username: _username}, callback)
}

module.exports.findByUsernameAsync = (_username) => {
  return User.findOne({username: _username})
}

module.exports.findUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.increaseNumTasks = (id, callback) => {
  User.findOneAndUpdate({_id: id}, {$inc:{'taskInfo.numTotal':1}}, callback)
}
