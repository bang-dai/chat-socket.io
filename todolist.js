var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(session({'secret' : 'mySecretKey'}));

app.get('/', function(req, res){

  if((typeof req.session.todolist) == 'undefined')
    req.session.todolist = [];
  res.render('todolist.ejs', {todolist: req.session.todolist})
});


app.post('/addTask', urlencodedParser, function(req, res){
  if(req.body.newTask != '') {
    req.session.todolist.push(req.body.newTask);
  }
  res.redirect('/');
});

app.get('/delete/:id', function(req, res){
  if (req.params.id != '') {
    req.session.todolist.splice(req.params.id, 1);
  }
  res.redirect('/');
});

app.listen(8080);