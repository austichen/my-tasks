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
  const partition = function(tasks, low, high) {
    var pivot = tasks[high].date_due;
    var i = (low-1);
    for (let j=low; j<high; j++) {
      if (tasks[j].date_due <= pivot) {
        i++;
        var temp = tasks[i];
        tasks[i] = tasks[j];
        tasks[j] = temp;
      }
    }
    var temp = tasks[i+1];
    tasks[i+1] = tasks[high];
    tasks[high] = temp;
    return i+1;
  }

  const sort = function(tasks, low, high) {
    if (low < high) {
      var pi = partition(tasks, low, high);
      sort(tasks, low, pi-1);
      sort(tasks, pi+1, high);
    }
  }
  Task.find({author_id: userId}, (err, tasks) => {
    if(!err && tasks.length>1) sort(tasks, 0, tasks.length-1)
    callback(err, tasks);
  });
}

module.exports.findTaskById = (id, callback) => {
  Task.findById(id, callback);
}

module.exports.findTaskAndUpdate = (_task, callback) => {
  Task.findOneAndUpdate({_id: _task.id}, {$set: {title: _task.title, description: _task.description, date_due: _task.date_due}}, callback);
}

module.exports.deleteTask = (taskId, callback) => {
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
