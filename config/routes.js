//endpoints
var User = require('../models/userModel.js');
// var Link = require('../models/linkModel.js');

module.exports = function(app, passport){
	app.use(function(req, res, next) {
	    res.header("Access-Control-Allow-Origin", '*');
	    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	    res.header("Access-Control-Allow-Headers",  'Content-Type, X-Requested-With');
	    next();
	});

	// app.get("/profile", function(req,res,next){
	// 	console.log('profile route...')
	// 	passport.authenticate('local', function(err, user){
	// 		if(err){ throw err }
	// 		console.log('reqlogin')
	// 		req.logIn(user, function(err) {
	// 		  if (err) { return next(err); }
	// 		  console.log("redirecting to users/username")
	// 		  return res.redirect('/users/' + user.local.email);
	// 		});
	// 		console.log("here")
	// 		// console.log(req.user);
	// 		// console.log('authenticated in /')
	// 	});
	// });
	// app.get('/auth', ensureAuthenticated, function(req,res){
	// 	res.send("You are authenticated! <br/>" + req.user)
	// })
	// app.post('/signup', function(req, res, next) {
	//   passport.authenticate('local-signup', function(err, user, info) {
	//     if (err) { return next(err); }
	//     if (!user) { return res.redirect('/'); }
	//     req.logIn(user, function(err) {
	//       if (err) { return next(err); }
	//       return res.redirect('/');
	//     });
	//   })(req, res, next);
	// });
	// app.post('/login', function(req, res, next) {
	//   passport.authenticate('local', function(err, user, info) {
	//     if (err) { return next(err); }
	//     if (!user) { return res.redirect('/'); }
	//     req.logIn(user, function(err) {
	//       if (err) { return next(err); }
	//       return res.redirect('/');
	//     });
	//   })(req, res, next);
	// });
	// app.get('/logout', function(req, res){
	//   req.logout();
	//   res.redirect('/');
	// });
	// app.get('/user', function(req,res,next){
	// 	res.send(req.user)
	// })
	// app.get('/users/:username', function(req, res, next){
	// 	// res.send(req.)
	// 	passport.authenticate('local', function(err, user, info){
	// 		console.log('logged in'+req.user)
	// 		var username = req.query.username;
	// 		res.send(user.local)
	// 	})(req,res,next);
	// })

	app.get('/scrape', function(req, res){
		// see if we have this actor in the db yet
			// yes we pull from there
			// no we make a request to imdb

		var actorId = req.query.id;
		console.log('inside /scrape route');

		request('http://www.imdb.com/name/'+actorId, function (error, response, body) {
			if (!error && response.statusCode == 200) {
	    		res.send(body)
		    }
		})
	});
}
function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
