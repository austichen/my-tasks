const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');
const isLoggedIn = require('../middleware/middleware.js')
const { check, validationResult } = require('express-validator/check');

Task = require('../models/task');

router.get('/create', isLoggedIn, (req, res) =>{
  res.render('create', {errors: []});
})

router.post('/create', [
  check('title', 'Title cannot be empty').isLength({min: 1}),
  check('date_due', "Due date must be after today's date").isAfter(moment().subtract(1, 'day').format())
],(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('create', {errors: errors.array()})
  }
  //return res.send(req.user)
  const newTask = new Task({
    title: req.body.title,
    description: req.body.description,
    date_due: moment(req.body.date_due),
    author_id: req.user._id
  })
  Task.addTask(newTask, (err, task) => {
    if(err) {
      req.flash('red', 'Unexpected error.')
      return res.redirect('/task/create')
    } else {
      User.increaseNumTasks(req.user._id, (err, user) => {
        if(err || !user) {
          req.flash('red', 'Unexpected error.')
          return res.redirect('/task/create')
        }
        req.flash('green', 'Task saved!')
        return res.redirect('/task/create')
      })
    }
  })
})

router.post('/edit/:taskId', isLoggedIn, [
  check('title', 'Title cannot be empty').isLength({min: 1}),
  check('date_due', "Due date must be after today's date").isAfter(moment().subtract(1, 'day').format())
],(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('create', {errors: errors.array()})
  }
  //return res.send(req.user)
  const newTask = {
    id: req.params.taskId,
    title: req.body.title,
    description: req.body.description,
    date_due: moment(req.body.date_due)
  }
  Task.findTaskAndUpdate(newTask, (err, task) => {
    if(err || !task) {
      req.flash('red', 'Unexpected error.')
      return res.redirect('/task/create')
    } else {
        req.flash('green', 'Task saved!')
        return res.redirect('/dashboard')
    }
  })
})

router.get('/edit/:taskId', isLoggedIn, (req, res) => {
  if(req.query.done!=undefined) {
    var isDone;
    if(req.query.done==='false') {
      isDone=false;
    } else if(req.query.done==='true') {
      isDone=true;
    } else {
      req.flash('red', 'Error updating task.')
      return res.redirect('/task')
    }
    const id = req.params.taskId;
    Task.markAsDone(id, isDone, (err, task) => {
      if(err || !task) {
        return res.status(500).send('error');
      } else {
        return res.send('task done');
      }
    })
  } else {
    Task.findTaskById(req.params.taskId, (err, task) => {
      if(err || !task || (task && task.author_id!=req.user.id)) {
        req.flash('red', 'Error retrieving task')
        return res.redirect('/dashboard');
      } else {
        const taskObject = {
          id: task._id,
          title: task.title,
          description: task.description,
          date_due: task.date_due.toISOString().slice(0,10),
        }
        res.render('edit', {task: taskObject, errors: []})
      }
    })
  }
})

router.delete('/delete/:taskId', isLoggedIn, (req, res) => {
  const taskId = req.params.taskId
  Task.deleteTask(taskId, (err, task) => {
    if(err || !task) {
      res.status(500);
    } else {
      User.decreaseNumTasks(req.user.id, (err, user) => {
        if(err || !user) {
          res.status(500);
        } else {
        res.send('Ok');
        }
      })
    }
  })
})

router.get('/', isLoggedIn, (req, res) => {
  Task.findTasksByUserId(req.user.id, (err, tasks) => {
    if(err) {
      req.flash('red', 'Unexpected error');
      return res.redirect('/dashboard')
    }
    if(tasks) {
      var _upcommingTasks = [];
      var completedTasks = false;
      var uncompletedTasks = false;
      tasks.forEach(task => {
        if(task.isDone) {
          completedTasks = true;
        } else {
          uncompletedTasks = true;
        }
        const formattedTask = {
          id: task._id,
          title: task.title,
          description: task.description,
          date_due: task.date_due.toDateString(),
          date_created: task.date_created.toDateString(),
          isDone: task.isDone
        }
        _upcommingTasks.push(formattedTask);
      })
      res.render('view', {user: req.user, upcommingTasks: _upcommingTasks, tasksStatus: {completed: completedTasks, uncompleted: uncompletedTasks}})
    } else {
      res.render('view', {user: req.user, upcommingTasks: null})
    }
  })
})

module.exports = router;
