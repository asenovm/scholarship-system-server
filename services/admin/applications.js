exports.routeGetUnaprovedApplications = function (app, db) {
	app.get('/admin/applications', function(req, res) {
		db.applications.find({'status':'pending'}, function (err, docs) {
			if (!err) {
				if(docs){
					res.status(200).send(docs);		
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

exports.routeAproveApplications = function (app, db) {
	app.put('/admin/applications', function(req, res) {		
		console.log('routeUnaproveApplications');
		db.applications.update({'email': req.body.email, 'status' : 'pending'},{ '$set' : {'status':'approved'}}, function (err, docs) {
			if (!err) {
				if(docs){
					res.status(200).send(docs);		
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