exports.createRankingOfStudents = function (app, db) {
	var timerID = setInterval(function (){
		db.majors.find({'status':'ongo'}, function(err, docs) {
			if (!err && docs.length === 0) {
				clearInterval(timerID);
				return;
			} else {
				console.log ('Error Raing');
				console.dir(err);
			};
		});
		var now = Date.now();
		db.majors.find({'status':'ongo'}).forEach(function(err, majorDoc) {
			// console.log('createRankingOfStudents:find majors');
			// console.log('Error:');
			// console.dir(err);
			// console.log('majorDoc:');
			// console.dir(majorDoc);
			// console.log('now:');
			// console.log(now);
			if (majorDoc) {
				console.log('majorDoc.deadLine:');
				console.log(majorDoc.deadLine);
			}

			if(!err && majorDoc && majorDoc.deadLine < now) {
			// console.log('!err && majorDoc && majorDoc.deadLine > now')
			// console.log(majorDoc.deadLine)
			// console.log(now);
				// update major status
				db.majors.update({'major':majorDoc.major, 'status' :'ongo'}, {'$set': {'status' : 'finish'}}, true, function (err, docs) {
					if (err) {
						console.log('Error chage major status');
						console.dir(err);
						return;
					};
				});


				var i = 0;
				var minGrade = 6;

				db.applications.find({'major' : majorDoc.major,'status' :'approved'}).sort({'grade': -1}).forEach(function (err, appDoc) {
					if(!err && appDoc){
						console.log('createRankingOfStudents:application forEach');
						// console.dir(appDoc);

						console.log('minGrade ', minGrade);
						minGrade = (i < majorDoc.maxOccupacity && minGrade > appDoc.grade)?appDoc.grade:minGrade;
						console.log('minGrade ', minGrade);
						console.log('appDoc.grade ', appDoc.grade);
						console.log('appDoc.grade vs  minGrade ', (minGrade < appDoc.grade));
						i++;
						var status = (appDoc.grade >= minGrade)?'rated':'notrated'; 
						console.log(status);
						db.applications.update({email:appDoc.email, 'status' :{'$ne' :'deleted'}}, {'$set': {'status' : status}}, true, function (err, docs) {
							if (err) {
								console.log('Error chage applications status');
								console.dir(err);
							};
						});
					}
				});
			}
    	});
	}, 2000); //21600000
};