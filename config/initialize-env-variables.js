const session    = require('express-session');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (app) => {
	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		httpOnly: true,
		resave : true,
	  	saveUninitialized: false, 
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};

module.exports.initializeVariable = (req, res, next) => {
  	res.locals.session = req.session;
  	res.locals.title   = "Dentistry Office";
	res.locals.node_environment   = process.env.NODE_EN;

	next();
};