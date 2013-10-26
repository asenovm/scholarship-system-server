var express = require('express');
var mongojs = require('mongojs');
var passport = require('passport');
var crypto = require('crypto-js/md5');
var LocalStrategy = require('passport-local').Strategy;


var databaseURL = '192.168.0.103:27017/scholar-systems';
var collections = ['users'];
var db = mongojs.connect(databaseURL, collections);

var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done) {
    db.users.findOne({email: username, password: password}, function(err, user) {
      if(err) {
        return done(err);
      } 
      if(!user) {
        return done(null, false, { message: 'Invalid username or password.'});
      }
      console.log(user);
      return done(null, user);
    });
  }
));

app.post('/login', passport.authenticate('local'), function(req, res) {
  0
  res.send(req.user);
  
});

app.post('/register', function(req, res) {
	var email = req.param('email');
  var password = req.param('password');
  var firstName = req.param('firstName');
  var surname = req.param('surname');
  var lastName = req.param('lastName');
  var facultyId = req.param('facultyId');
  var facultyName = req.param('facultyName');
  var major = req.param('major');

  user = {
    'email' : email,
    'password' : password,
    'firstName' : firstName,
    'surname' : surname,
    'lastName' : lastName,
    'facultyId' : facultyId,
    'facultyName' : facultyName,
    'major' : major
  };



  db.users.save(user, function(err, saved) {
    if( err || !saved ) {
      console.log("User not saved");
      res.send(500);
    }
    else{
      res.send(200);    
      console.log("User saved");
    } 
  });
});

app.listen(3000);
console.log('Listening to port 3000');
