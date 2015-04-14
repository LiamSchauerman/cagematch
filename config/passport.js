var LocalStrategy = require('passport-local').Strategy;
	// TwitterStrategy = require('passport-twitter').Strategy,
	// FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/userModel.js');

module.exports = function(passport){
	// serialize and deserialize the user
	passport.serializeUser(function(user, done) {
	    done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	    User.findById(id, function(err, user) {
	        done(err, user);
	    });
	});
	// adding strategies to passport

	passport.use(new LocalStrategy(
		{
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true 
		}, 
		function(req, email, password, done) {
			console.log('inside local strategy callback');
			process.nextTick(function() {
		        // check if a user is already logged in:
		        if (!req.user) {
		        	console.log('in auth passport callback');
		        	// see if a user exists with this email
		            User.findOne({ 'local.email' :  email }, function(err, user) {
		                // if there are any errors, return the error
		           		if (err) return done(err);
		                if (user) {
		                	console.log("User found");
		                    return done(null, user);
		                } else {
		                	console.log("No user found");
		                	return done(null, false);
		                }
		            });
		        } else {
		            // user already logged in
		            console.log("User logged in")
		            return done(null, req.user);
		        }
			});
		}
	));
	passport.use('local-signup', new LocalStrategy(
		{
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true 	
		},
		function(req, email, password, done){
			if(!req.user){
				User.findOne({'local.email':email}, function(err, user){
					if(err) return done(err);
					if ( user ){
						console.log("username already registered")
						return done(null, false)
					} else {
						console.log("Making new user");
					    var newUser = new User();
					    newUser.local.password = newUser.makeHash(password);
					    newUser.local.email = email;

					    newUser.save(function(err, user) {
					        if (err) return done(err);
					        return done(null, user);
					    });
					}
				})
			}
		}))
}
