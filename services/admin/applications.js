var _ = require('underscore');
var mailer = require('../mailer');

exports.routeGetUnaprovedApplications = function (app, db) {
	app.get('/admin/applications', function(req, res) {
		db.applications.find({'status':'pending'}, function (appErr, appDocs) {
			if (!appErr) {
				if(appDocs){
					db.users.find({}, function (userErr, userDocs) {
						if (!userErr) {
							if(userDocs){
								var result = [];
								for(var i = 0; i < userDocs.length; i++) {
									for (var j = appDocs.length - 1; j >= 0; j--) {
										if(userDocs[i].email === appDocs[j].email){
											result.push(_.extend(userDocs[i],appDocs[j]));
										}
									};
								};
								res.status(200).send(result);
							} else {
								console.log('Error feching Unaproved Applications: USersDocs');
								res.send(500);
							}
						} else {
							console.log('Error feching Unaproved Applications: USersERR');
							res.send(500);
						}});
				} else {
					console.log('Error feching Unaproved Applications: appDocs');
					res.send(500);
				}
			} else {
				console.log('Error feching Unaproved Applications appErr');
				res.send(500);
			};
		});
	});
}

exports.routeAproveApplications = function (app, db) {
	app.put('/admin/applications', function(req, res) {		
		console.log('routeUnaproveApplications');
		db.applications.update({'email': req.body.email, 'status' : 'pending'},{ '$set' : {'status':'approved'}}, function (err, docs) {
			if (!err) {
				if(docs){
					res.status(200).send(docs);		
					mailer.sendMail(req.body.email);
				} else {
					res.send(200);
				}
			} else {
				console.log('Error feching Unaproved Applications');
				res.send(500);
			};
		});
	});
}
