var _ = require('underscore');

exports.route = function(app, db, expressValidator) {
  expressValidator.Validator.prototype.isBetween = function(a, b) {
    var grade = parseFloat(this.str);
    if(grade < a || grade > b) {
      this.error(this.msg);
      return this;
    }
  };

  app.post('/application', function(req, res) {
    console.log(req.body);

    req.assert('grade', 'grade is not valid').isBetween(4.5, 6.0);
    req.assert('schoolYear', 'schooYear is not valid').isBetween(1, 4);
    req.assert('firstParentIncome', 'firstParentIncome is invalid').isFloat();
    req.assert('secondParentIncome', 'secondParentIncome is invalid').isFloat();
    req.assert('firstParentFirstName', 'firstParentFirstName is invalid').isAlpha();
    req.assert('firstParentSurname', 'firstParentSurname is invalid').isAlpha();
    req.assert('firstParentLastName', 'fisrtParentLastName is invalid').isAlpha();
    req.assert('secondParentFirstName', 'secondParentFirstName is invalid').isAlpha();
    req.assert('secondParentSurname', 'secondParentSurname is invalid').isAlpha();
    req.assert('secondParentLastName', 'secondParentLastName is invalid').isAlpha();

    var errors = req.validationErrors();
    console.log(errors);
      
    if(errors){
      console.log("Validation parameters fail");
      console.log(errors);
      res.send(500);
      return;
    }

    var application = _.pick(req.body,
      'email', 'grade', 'schoolYear', 'socialScholarship', 'yearlyScholarship',
      'firstParentFirstName', 'firstParentSurname', 'firstParentLastName',
      'firstParentCompany', 'firstParentIncome',
      'secondParentFirstName', 'secondParentSurname', 'secondParentLastName',
      'secondParentCompany', 'secondParentIncome');
    console.log(application);
    application.status = 'pending';
    application.timestamp = Date.now();
    db.applications.findOne({email: application.email}, function(err, dup) {
      if(err || dup) {
        console.log("Application not saved");
        res.send(500);
      } else {
        db.applications.save(application, function(err, saved) {
          if( err || !saved ) {
            console.log("Application not saved");
            res.send(500);
          }
          else{
            console.log("Application saved");
            res.send(200);    
          } 
        });
      }
    });
  });
};