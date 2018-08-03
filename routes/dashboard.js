const router = require('express').Router();
const flash = require('connect-flash')
const isLoggedIn = require('../middleware/middleware.js')
const moment = require('moment');
Task = require('../models/task');

const isOverDue = (checkDate, knownDate) => {
  if (moment(checkDate).year() < moment(knownDate).year()) {
    return true;
  } else if (moment(checkDate).year() > moment(knownDate).year()) {
    return false;
  } else {
    if (moment(checkDate).month() < moment(knownDate).month()) {
      return true;
    } else if (moment(checkDate).month() > moment(knownDate).month()) {
      return false;
    } else {
      if (moment(checkDate).date() < moment(knownDate).date()) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}

router.get('/', isLoggedIn, (req, res) => {
  Task.findTasksByUserId(req.user.id, (err, tasks) => {
    if(err) {
      req.flash('red', 'Unexpected error');
      return res.redirect('/dashboard')
    }
    if(tasks) {
      var _upcommingTasks = [];
      const currentDate = new Date();
      tasks.forEach(task => {
        if(!task.isDone) {
          console.log('current date: ',currentDate, 'date due: ',task.date_due)
          const dateDifference = task.date_due.getTime() - currentDate.getTime();
          if(dateDifference <= 604800000 && !isOverDue(task.date_due, currentDate) && !task.isDone) {
            const formattedTask = {
              id: task._id,
              title: task.title,
              description: task.description,
              date_due: task.date_due.toDateString(),
              date_created: task.date_created.toDateString(),
              isDone: task.isDone
            }
            _upcommingTasks.push(formattedTask);
          }
        }
      })
      res.render('dashboard', {user: req.user, upcommingTasks: _upcommingTasks})
    } else {
      res.render('dashboard', {user: req.user, upcommingTasks: null})
    }
  })
})

module.exports = router
