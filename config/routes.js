//endpoints
var User = require('../models/userModel.js');
var Matchup = require('../models/matchupModel.js');
var Movie = require('../models/movieModel.js');
var Actor = require('../models/actorModel.js');

// var utils = require('../config/utility.js')

module.exports = function(app, passport){
	app.use(function(req, res, next) {
	    res.header("Access-Control-Allow-Origin", '*');
	    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	    res.header("Access-Control-Allow-Headers",  'Content-Type, X-Requested-With');
	    next();
	});
	app.get('/setMatchup', function(req, res, next){
		// get two movies and return their attributes
		Movie.find({actorId : req.query.id}, function(err, results){
			if(err) throw err
			var twoRandomNumbers = function(){
				var indexA = Math.floor(Math.random()*results.length);
				var indexB = Math.floor(Math.random()*results.length);
				while(indexA === indexB){ //no duplicates
					indexB = Math.floor(Math.random()*results.length);
				}
				return [indexA, indexB];
			}
			var indexes = twoRandomNumbers();
			res.send({
				movieA : results[indexes[0]],
				movieB : results[indexes[1]]
			})
		})

	})
	app.get('/getCollection', function(req, res){
		var actorId = req.query.id;
		console.log(actorId)
		Movie.find({actorId: actorId}, function(err, collection){
			if (err) throw err;
			if( collection && collection.length !== 0 ){
				console.log('found a coll')
				console.log(collection.length)
				res.json({collection:collection});
			} else {
				request('http://www.imdb.com/name/'+actorId, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log("got html", typeof body)
						console.log(body)
			    		res.send(body)
				    }
				})
			}
		})
		console.log('inside /scrape route');

	});
	function insertCollection(collection, actorId, callback) {
	  var inserted = 0;
	  for(var i = 0; i < collection.length; i++) {
	  	var movie = new Movie(collection[i]);
	  	movie.actorId = actorId;
	    movie.save(function(err) {
	      if (err) {
	        throw err;
	        return;
	      }
	      if (++inserted == collection.length) {
	        callback();
	      }
	    });
	  }
	}
	app.post('/postCollection', function(req,res){
		// make and save actor
		var actor = new Actor();
		actor.imdbId = req.body.actorId;
		actor.save(function(err,log){
			// create new movie objects for each in array
			console.log("about to insert collection")
			insertCollection(req.body.collection, req.body.actorId, function(){
				res.status(200).end();
			})
		})
	});
	app.post('/scoreMatchup', function(req,res){
		// calculate score change
		// find mongoose model for winner and loser
		var declareWinner = function(){
			var matchup = new Matchup();
			matchup.actorId = req.body.actorId;
			matchup.winner = req.body.winner;
			matchup.loser = req.body.loser;
			// access score
			var winnerScore;
			var loserScore;

			Movie.findOne({title: matchup.winner}, function(err, winner){
				if(err) throw err;
				console.log('winnerrrr',winner)
				matchup.winnerScorePre = winner.score;
				console.log(matchup.winnerScorePre)
			    console.log("oooh hes tryin");
				// res.status(200).end()
				Movie.findOne({title: matchup.loser}, function(err, loser){
					if(err) throw err;
					matchup.loserScorePre = loser.score;
					//calculate change in score
					var winExp = 1/(1+Math.pow(10, ( matchup.loserScorePre - matchup.winnerScorePre )/400));
					var K = 24;
					matchup.winnerScorePost = matchup.winnerScorePre + K*(1-winExp);
					var diff = Math.floor(matchup.winnerScorePost - matchup.winnerScorePre);
					console.log(matchup.loserScorePre, matchup.winnerScorePre, diff)
					matchup.loserScorePost = matchup.loserScorePre - diff;
					console.log('searching',winner._id)
					Movie.update({_id: winner._id}, {$set:{
						"score" : matchup.winnerScorePost
					}}, function(err, updated){
						Movie.update({_id: loser._id}, {$set:{
							"score" : matchup.loserScorePost
						}}, function(err, updated){
							matchup.save(function(err,log){
								console.log('scored ......')
								res.json({
									winnerScore: matchup.winnerScorePost,
									loserScore: matchup.loserScorePost
								})
							})
						})
					})
				})
			})
		};
		declareWinner();
	})
}
function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
