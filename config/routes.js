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
	});
	app.post('/scoreMatchup', function(req,res){
		// calculate score change
		// find mongoose model for winner and loser
		// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
		var declareWinner = function(winner, loser){
			// access score
			console.log(winner)
			Movie.findOne({title: winner.title}, function(err, movie){
				if(err) throw err;
				console.log('movie find one');
				console.log(movie);
			})
			// var winExp = 1/(1+Math.pow(10, ( $scope.data[loser].score - $scope.data[winner].score )/400));
			// var K = 24;
			// var winScore = $scope.data[winner].score + K*(1-winExp);
			// var diff = winScore - $scope.data[winner].score;
			// console.log("diff", diff)
			// $scope.diff = diff;
			// $scope.data[winner].score += Math.floor(diff);
			// $scope.data[loser].score -= Math.floor(diff);

			// // syncing with firebase
			// $scope.data.$save($scope.data[winner])
			// $scope.data.$save($scope.data[loser])

			// $scope.inPlay = MakeMatchup.twoRandomNumbers();
			// $scope.toggleRankings = function() {
			// 	console.log($scope.rankings)
			// 	// show or hide the rankings div
			// 	$scope.rankings === true ? $scope.rankings = false : $scope.rankings = true;
			// }
		};

		// {'local.rooms': {$elemMatch: {name: req.body.username}}}
		console.log(req.body.winner)
		ActorCollection.findOne({
		    imdbId: req.body.actorId,
		},
		{
		    movies: { $elemMatch: {
		        title: req.body.winner
		    }},
		}, function(err, collection){
			console.log(collection);
		    console.log("oooh hes tryin");
			res.status(200).end()
		    //collection.movies is my array
		    // any )mongoose methods to query this array???
		})
		// ActorCollection
		//     .findOne({"imdbId": req.body.actorId})
		//     .elemMatch("movies", {"title":req.body.winner})
		//     .exec(function(err, results){
		//     	console.log(results)
		//     });
	})
}
function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
