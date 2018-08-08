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
  },
  googleId: String
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

module.exports.decreaseNumTasks = (id, callback) => {
  User.findOneAndUpdate({_id: id}, {$inc:{'taskInfo.numTotal':-1}}, callback)
}

module.exports.increaseNumCompleted = (id, callback) => {
  User.findOneAndUpdate({_id: id}, {$inc:{'taskInfo.numCompleted':1}}, callback)
}

module.exports.decreaseNumCompleted = (id, callback) => {
  User.findOneAndUpdate({_id: id}, {$inc:{'taskInfo.numCompleted':-1}}, callback)
}

module.exports.googleIdAuthorize = (profile, callback) => {
  User.findOneAndUpdate(
    {googleId: profile.id},
    {$set: {
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      username: profile.displayName,
      email: "your gmail! this api doesn't let me see your email :("
    }},
    {upsert: true, 'new': true},
    callback)
}
