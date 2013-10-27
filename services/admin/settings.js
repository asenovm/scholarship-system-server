var _ = require('underscore');

exports.routeGetMajorsSettings = function (app, db) {
	app.get('/admin/settings', function(req, res) {
		db.majors.find({}, function (err, docs) {
			if (!err) {
				if(docs){
					res.status(200).send(docs);		
				} else {
					res.send(200);
				}
			} else {
				console.log('Error feching majors settings');
				res.send(500);
			};
		});
	});
};

exports.routeUpdateMajorSettings = function (app, db) {
	app.put('/admin/settings', function(req, res) {		
		console.log('/admin/settings');
		var selection = _.pick(req.body, 'major');
		if(!selection) {
			res.send(404);
			return;
		}
		console.log('selection');
		console.dir(selection);
		var modification = _.pick(req.body, 'maxOccupacity', 'deadLine');
		if(!modification) {
			res.send(404);
			return;
		}
		console.log('modification');
		console.dir(modification);

		//update({"tag": "databases"}, {"$inc": {"booksSold": 1}}, true)
		db.majors.findOne(selection, function(err, dup) {
			console.log('findOne(selection');
			if (err) {
				console.dir(err);
				res.send(500);
			} else {
				console.dir(dup);
				if(dup) {
					db.majors.update(selection, {'$set': modification}, true, function (err, docs) {
						if (!err) {
							if(docs){
								res.status(200).send(docs);		
							} else {
								res.send(200);
							}
						} else {
							console.log('Error chage settings');
							res.send(500);
						};
					});
				} else {
					major = _.extend(selection,modification);
					db.majors.save(major, function (err, docs) {
				console.dir(err);
				console.dir(docs);
						if (!err) {
							if(docs){
								res.status(200).send(docs);		
							} else {
								res.send(200);
							}
						} else {
							console.log('Error chage settings');
							res.send(500);
						};
					});
				}
			}
		});

	});
};