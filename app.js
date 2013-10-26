var express = require('express');
var mongojs = require('mongojs');
var crypto = require('crypto-js/md5');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator'); 


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
  // app.use(expressValidator);
  app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
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
  res.send(req.user);
});

app.post('/register', function(req, res) {
 
  // console.log('/register\n');
  // console.log(req.body);

  req.assert('email', 'A valid email is required').isEmail();
  req.assert('password', 'password is required').notEmpty();
  req.assert('firstName', 'firstName is required').notEmpty();
  req.assert('surname', 'surname is required').notEmpty();
  req.assert('lastName', 'lastName is required').notEmpty();
  req.assert('facultyId', 'facultyId is required').notEmpty();
  req.assert('facultyName', 'facultyName is required').notEmpty();
  req.assert('major', 'major is required').notEmpty();

  var errors = req.validationErrors();  
    if(errors){
      console.log("Validation parameters fail");
      console.log(errors);
      res.send(500);
      return;
    }


    var user = getPostParametersForRegistration(req);


  db.users.save(user, function(err, saved) {
    if( err || !saved ) {
      console.log("User not saved");
      res.send(500);
    }
    else{

      console.log("User saved");
      res.send(200);    
    } 
  });
});

app.listen(3000);
console.log('Listening to port 3000');


function getPostParametersForRegistration(req){
    var email = req.param('email');
  var password = req.param('password');
  var firstName = req.param('firstName');
  var surname = req.param('surname');
  var lastName = req.param('lastName');
  var facultyId = req.param('facultyId');
  var facultyName = req.param('facultyName');
  var major = req.param('major');

  return {
    'email' : email,
    'password' : password,
    'firstName' : firstName,
    'surname' : surname,
    'lastName' : lastName,
    'facultyId' : facultyId,
    'facultyName' : facultyName,
    'major' : major
  };
}