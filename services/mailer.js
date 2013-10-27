var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "scholarship.dev.tester@gmail.com",
        pass: "scholarshipdev"
    }
});

exports.sendMail = function (to) {

	var mailOptions = {
	    from: "scholarship.dev.tester@gmail.com",
            to: to,
	    subject: "Application Approved",
	    text: "Your scholarship applicaiton has been approved"
	};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
		console.log(error);
	    }else{
		console.log("Message sent: " + response.message);
	    }
	});
};

