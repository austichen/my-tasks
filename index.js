const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.get('/', (req, res) =>{
  res.render("authorization")
})


app.listen(port, () => {console.log('listening on port ', port)});
