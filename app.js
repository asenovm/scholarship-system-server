var express = require('express');
var mongojs = require('mongojs');

var databaseURL = 'mydb';
var collections = ['users'];
var db = mongojs.connect(databaseURL, collections);

var app = express();
app.use(express.bodyParser());

app.post('/login', function(req, res) {
  var username = req.param('username');
  var password = req.param('password');
  db.users.findOne({ username: username, password: password }, function(err, user) {
    if(err || !user) res.send('Invalid login');
    else res.send(user);
  });
});

app.get('/register', function(req, res) {
	res.send('Register page');
});

app.listen(3000);
console.log('Listening to port 3000');
