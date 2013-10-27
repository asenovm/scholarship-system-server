var _ = require('underscore');

exports.route = function(app, db, hashFunction) {
  app.post('/register', function(req, res) {


  // console.log('/register\n');
  // console.log(req.body);
    if(!validate(req)) {
          res.send(500);
          return;
    }    

    var user =_.pick(req.body, 'email', 'password', 'firstName', 'surname', 'lastName', 'facultyId', 'facultyName', 'major');
    // console.dir(user);

    db.users.findOne({email:user.email, 'userType' : 'student' }, function(err,dup) {
      if(err || dup) {
              console.log("User not saved, already exists");
              res.send(500);
      } else {
          user.password = hashFunction(user.password);
          user.userType = 'student';
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
      }
    });
})};

function validate (req) {

    req.assert('email', 'A valid email is required').isEmail();
    req.assert('password', 'password is required').validatePassword();

    validateName('firstName', req);
    validateName('surname',req);
    validateName('lastName', req);

    req.assert('facultyId', 'facultyId is required').isFacultyID();
    req.assert('facultyName', 'facultyName is required').notEmpty();
    req.assert('major', 'major is required').notEmpty();

    var errors = req.validationErrors();  
   if(errors){
      console.log("Register validation fail: parameters problem");
      console.log(errors);
      return false;
    }
    return true;
};

function validateName(name, req) {
    req.assert(name, 'A valid '+ name + ' is required').isName();
}
