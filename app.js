const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

//connect to DB
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;

const port = process.env.PORT || 3000;

//View Engine
app.set("views", "./views");
app.set("view engine", "ejs");

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//static folder
app.use(express.static(__dirname+'/public'));

//express session middlware
app.use(session({
  secret: 'flying platypus',
  saveUninitialized: true,
  resave: true
}))

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//passport config
require('./config/passport')(passport);

app.get('/', (req, res) =>{
  res.render("home")
})

//routes
const userRoute = require('./routes/user');

app.use('/user', userRoute);


app.listen(port, () => {console.log('listening on port ', port)});
