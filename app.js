var express = require('express');
var mongojs = require('mongojs');
var crypto = require('crypto-js/md5');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator'); 
var registration = require('./services/register'); 


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

registration.route(app,db);


app.listen(3000);
console.log('Listening to port 3000');

