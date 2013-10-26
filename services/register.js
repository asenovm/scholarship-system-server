var _ = require('underscore');

exports.route = function(app, db) {
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


    var user =_.pick(req.param, 'email', 'password', 'firstName', 'surname', 'lastName', 'facultyId', 'facultyName', 'major');

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
};
