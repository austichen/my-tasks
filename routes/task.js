const router = require('express').Router();
const mongoose = require('mongoose');
Task = require('../models/task');

router.get('/create', (req, res) =>{
  res.render('createTask');
})

router.post('/create', (req, res) => {
  //return res.send(req.user)
  const newTask = new Task({
    title: req.body.title,
    description: req.body.description,
    date_due: Date.now
    //author_id: req.user._id,
  })
  Task.addTask(newTask, (err, task) => {
    res.json(task)
  })
})

module.exports = router;
