var express = require('express');
var mongojs = require('mongojs');
var crypto = require('crypto-js/md5');
var crypto_core = require('crypto-js/core');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator'); 
var registration = require('./services/register'); 
var login = require('./services/login'); 
var application = require('./services/app-creation');
var adminApplications = require('./services/admin/applications');
var adminSettings = require('./services/admin/settings');
var ranking = require('./events/ranking');


var hashPassword = '7f2cb012375570';

//192.168.0.103
var databaseURL = 'localhost:27017/scholar-systems';
var collections = ['users', 'applications','majors'];
var db = mongojs.connect(databaseURL, collections);

var app = express();

// app.all('*', function (req,res,next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//    next();
// });

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:9000");
   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
   res.header('Access-Control-Allow-Credentials', true);
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   next();
});

function hashFunction(password) {
  console.log('hashFunction()');
  return crypto_core.enc.Hex.stringify(crypto(password+hashPassword));
};

expressValidator.Validator.prototype.isBetween = function(a, b) {
  var grade = parseFloat(this.str);
  if(grade < a || grade > b) {
    this.error(this.msg);
    return this;
  }
};
expressValidator.Validator.prototype.isName = function() {
  if (!this.str.match(/^[АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя]+$/)) {
    return this.error(this.msg || 'Invalid characters');
  }
  return this;
};

   expressValidator.Validator.prototype.isEmail = function() {
    console.log('=======================');
    if (!this.str.match(/.+@.+\..+/)) {
        return this.error(this.msg || 'Invalid email');
    }
    return this;
  }
  expressValidator.Validator.prototype.isFacultyID = function() {
    console.log('=======================');
    if (!this.str.match(/[0-9]+/)) {
        return this.error(this.msg || 'Invalid email');
    }
    return this;
  }
  expressValidator.Validator.prototype.validatePassword = function() {
    console.log('=======================');
    if (this.str.length < 8 || this.str.search(/[A-Z]/) === -1 || this.str.search(/\d/) === -1) {
        return this.error(this.msg || 'Invalid password');
    }
    return this;
  }

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

login.route(app, db, passport, LocalStrategy, hashFunction);
registration.route(app, db, hashFunction);
application.routeCreateApplication(app, db);
application.routeDeleteApplication(app, db);
adminApplications.routeGetUnaprovedApplications(app,db);
adminApplications.routeAproveApplications(app, db);
application.routeGetApplication(app, db);
adminSettings.routeGetMajorsSettings(app, db);
adminSettings.routeUpdateMajorSettings(app, db);
ranking.createRankingOfStudents(app, db);

app.listen(3000);
console.log('Listening to port 3000');

