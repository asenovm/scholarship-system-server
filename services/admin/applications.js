exports.routeGetUnaprovedApplications = function (app, db) {
	app.get('/admin/applications', function(req, res) {
		db.applications.find({'status':'pending'}, function (err, docs) {
			if (!err) {
				if(docs){
					res.send(docs);		
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