var _ = require('underscore');

exports.routeCreateApplication = function(app, db) {
    app.post('/application', function(req, res) {
    console.log(req.body);

    req.assert('grade', 'grade is not valid').isBetween(4.5, 6.0);
    req.assert('schoolYear', 'schooYear is not valid').isBetween(1, 4);
    req.assert('firstParentIncome', 'firstParentIncome is invalid').isFloat();
    req.assert('secondParentIncome', 'secondParentIncome is invalid').isFloat();
    req.assert('firstParentFirstName', 'firstParentFirstName is invalid').isName();
    req.assert('firstParentSurname', 'firstParentSurname is invalid').isName();
    req.assert('firstParentLastName', 'fisrtParentLastName is invalid').isName();
    req.assert('secondParentFirstName', 'secondParentFirstName is invalid').isName();
    req.assert('secondParentSurname', 'secondParentSurname is invalid').isName();
    req.assert('secondParentLastName', 'secondParentLastName is invalid').isName();

    var errors = req.validationErrors();
    console.log(errors);

    if(errors){
      console.log("Validation parameters fail");
      console.log(errors);
      res.send(500);
      return;
    }

    var application = _.pick(req.body,
      'email', 'major', 'grade', 'schoolYear', 'socialScholarship', 'yearlyScholarship',
      'firstParentFirstName', 'firstParentSurname', 'firstParentLastName',
      'firstParentCompany', 'firstParentIncome',
      'secondParentFirstName', 'secondParentSurname', 'secondParentLastName',
      'secondParentCompany', 'secondParentIncome');
    console.log(application);
    application.status = 'pending';
    application.timestamp = Date.now();
    var deadline = 0;

    console.log(application.major);
    db.majors.findOne({major: application.major}, function(err, major) {
      if(err || !major) {
        console.log("Application not saved: cannot find major");
        res.send(500);
      } else {
        //console.log(major.deadLine);
        deadline = major.deadLine;
        //console.log((application.timestamp));
        //console.log((deadline));
        //console.log((application.timestamp > deadline));
        db.applications.findOne({email: application.email, status: {'$ne' : 'deleted'} }, function(err, dup) {
          if(err || dup || (application.timestamp > deadline)) {   
            console.log("Application not saved: application exists or deadline not met");
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
      }
    });

    
  });
};

exports.routeDeleteApplication = function(app, db) {
  app.del('/application/:email', function(req, res) {
    db.applications.update({email: req.params['email'], 'status' :{'$ne' :'deleted'}}, {'$set': {'status': 'deleted'}}, function(err, updated) {
      if(err || !updated) {
        console.dir(err);
        console.dir(req.body);
        console.dir(req.params);
        console.dir(updated);
        console.log(req.body.email);
        console.log('Application not deleted');
        res.send(404);
      } else {
        console.log('Application deleted');
        res.send(200);
      }
    });
  });
};

exports.routeGetApplication = function(app, db) {
  app.get('/application', function(req, res){
    db.applications.findOne({email: req.query['email'], 'status' :{'$ne' :'deleted'}}, function(err, found) {
      if(err || !found) {
        console.log('Application not found');
        res.status(200).send([]);
      } else {
        console.log('Application found');
        res.status(200).send([found]);
      }
    });
  }); 
};