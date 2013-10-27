exports.route = function(app, db, passport, LocalStrategy, hashFunction) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
      console.log('deserializeUser');
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
	  function(username, password, done) {
      password = hashFunction(password);
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
    res.status(200).send(req.user);
  });
};
