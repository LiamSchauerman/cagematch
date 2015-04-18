//endpoints
var User = require('../models/userModel.js');
var Movie = require('../models/movieModel.js');
var ActorCollection = require('../models/actorCollectionModel.js');

// var utils = require('../config/utility.js')

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

	app.get('/getActorCollection', function(req, res){
		var actorId = req.query.id;
		console.log(actorId)
		ActorCollection.findOne({imdbId: actorId}, function(err, actorCollection){
			if (err) throw err;
			if( actorCollection ){
				console.log('found a coll')
				res.json({actorCollection:actorCollection});
			} else {
				request('http://www.imdb.com/name/'+actorId, function (error, response, body) {
					if (!error && response.statusCode == 200) {
			    		res.send(body)
				    }
				})
			}
		})
		console.log('inside /scrape route');

	});
	app.post('/postActorCollection', function(req,res){
		var actorCollection = new ActorCollection();
		actorCollection.imdbId = req.body.imdbId;
		console.log(req.body.collection)
		actorCollection.movies = [];
		for( var i=0; i < req.body.collection.length; i++){
			var movie = {};
			var props = Object.keys(req.body.collection[i])
			console.log(props)
			for( var j=0; j< props.length; j++){
				movie[props[j]] = req.body.collection[i][props[j]];
			}
			actorCollection.movies.push(movie)
		}

		// actorCollection.movies = req.body.collection;
		actorCollection.save(function(err, actorCollection) {
			console.log('actor collection save');
			console.log(actorCollection)
		    if (err) throw err;
		    res.status(201).end();
		});
	})
}
function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
