var express = require('express');
var mongojs = require('mongojs');
var crypto = require('crypto-js/md5');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator'); 
var registration = require('./services/register'); 
var login = require('./services/login'); 
var application = require('./services/app-creation');

//192.168.0.103
var databaseURL = 'localhost:27017/scholar-systems';
var collections = ['users', 'applications'];
var db = mongojs.connect(databaseURL, collections);

var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
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


login.route(app, db, passport, LocalStrategy);
registration.route(app,db);
application.route(app, db, expressValidator);

app.listen(3000);
console.log('Listening to port 3000');

