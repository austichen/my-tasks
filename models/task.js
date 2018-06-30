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

const addTask = (task, callback) => {
  Task.create(task, callback);
}

module.exports = {
  addTask
}
