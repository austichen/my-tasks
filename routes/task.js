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
  console.log('task: ', newTask)
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
  console.log('task: ', newTask)
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
  console.log('req.user: ',req.user)
  console.log('typeof taskid: ',typeof req.params.taskId)
  Task.findTaskById(req.params.taskId, (err, task) => {
    if(err || !task || (task && task.author_id!=req.user.id)) {
      if(err) {
        console.log('err')
      } else if(!task) {
        console.log('no task')
      } else {
        if(task.author_id!=req.user._id) {
        console.log('ids dont match')
        console.log('authorId: ',task.author_id,", typeof:",typeof task.author_id, "; userId: ",req.user._id,", typeof: ",typeof req.user._id)
      }
      }
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
})

module.exports = router;
