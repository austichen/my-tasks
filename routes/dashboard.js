const router = require('express').Router();
const flash = require('connect-flash')
Task = require('../models/task');

router.get('/', (req, res, next) => {
  if(!req.user) {
    req.flash('red', 'please log in first');
    return res.redirect('/');
  }
  next();
}, (req, res) => {
  var TasksArray = [];
  Task.findTasksByUserId(req.user.id, (err, tasks) => {
    if(tasks) {
      TasksArray.concat(tasks);
    }
  })
  var _upcommingTasks = [];
  const currentDate = new Date();
  TasksArray.forEach(task => {
    if(task.date_due.getTime() - currentDate.getTime() <= 604800000) {
      _upcommingTasks.append(task);
    }
  })
  console.log('upcomming tasks: ',_upcommingTasks)
  res.render('dashboard', {user: req.user, upcommingTasks: _upcommingTasks})
})

module.exports = router
