const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  date_created: {type: Date, default: new Date(), required: true},
  date_due: Date,
  author_id: {type: mongoose.Schema.Types.ObjectId, required: false},
  isDone: {type: Boolean, default: false, required: true}
})

const Task = module.exports = mongoose.model('Task', taskSchema);

module.exports.addTask = function(task, callback){
  console.log('addTask function')
  Task.create(task, callback);
}

module.exports.findTasksByUserId = (userId, callback) => {
  Task.find({author_id: userId}, callback);
}

module.exports.findTaskById = (id, callback) => {
  Task.findById(id, callback);
}

module.exports.findTaskAndUpdate = (_task, callback) => {
  Task.findOneAndUpdate({_id: _task.id}, {$set: {title: _task.title, description: _task.description, date_due: _task.date_due}}, callback);
}

module.exports.deleteTask = (taskId, callback) => {
  //TODO this doesn't exist
  Task.findByIdAndDelete(taskId, callback);
}

module.exports.markAsDone = (taskId, taskIsDone, callback) => {
  taskIsDone ? Task.findOneAndUpdate({_id: taskId}, {$set: {isDone: false}}, callback) : Task.findOneAndUpdate({_id: taskId}, {$set: {isDone: true}}, callback)
}
/*
module.exports = {
  addTask
}
*/
