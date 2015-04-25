//endpoints
var User = require('../models/userModel.js');
var Matchup = require('../models/matchupModel.js');
var Movie = require('../models/movieModel.js');
var Actor = require('../models/actorModel.js');
var cheerio = require('cheerio');


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
			res.status(400).end()
		})
	})

	app.get('/actorList', function(req,res){
		Actor.find(function(err,coll){
			if(err) throw err
			console.log(coll)
			res.send(coll)
		})
	})
	function scrapePhotos(collection, checked, callback) {
		var checked = checked || 0;
		console.log(collection[3])
		if(checked < collection.length){
			console.log(checked)
		  	request("http://www.imdbapi.com/?i=&t="+collection[checked].title.replace(/ /, "%20"), function(err,resp,body){
		  		if(!err && resp.statusCode === 200){
		  			var imgUrl = JSON.parse(body).Poster;
		  			console.log(checked)
		  			if( imgUrl && imgUrl !== "N/A"){
			  			Movie.update({_id: collection[checked]._id}, {$set:{
			  				"imgUrl" : imgUrl
			  			}}, function(err, updated){
			  				if(err) throw err
		  					console.log(updated);
			  				if (++checked === collection.length) {
			  				  callback();
			  				}
			  				scrapePhotos(collection, checked, callback)
			  			})
		  			} else {
		  				if (++checked === collection.length) {
		  				  callback();
		  				}
		  				console.log('checked again', checked)
		  				scrapePhotos(collection, checked, callback)

		  			}
		  		} else {
		  			console.log('no image for ',checked)
		  			if (++checked === collection.length) {
		  			  callback();
		  			}
		  			console.log('checked again', checked)
		  			scrapePhotos(collection, checked, callback)
		  		}
		  	})
		}
	}
	app.get('/photos', function(req,res){
		// needs actorId
		Movie.find({actorId : req.query.id}, function(err, collection){
			console.log(collection[9])
			scrapePhotos(collection, 0, function(){
				res.status(200).end()
			})
		})
	})
	app.get('/translate', function(req,res){
		var name = req.query.name;

	})
	app.get('/getCollection', function(req,res){
		// this is a lot of async
		// checks if the query is the imdbId or the actor's name
		// if the actor is not in the db, fetch the actor's info, then fetch all of that actors movies
		// if the actor is in the db, return the actors imdbId for use by setMatchup

		var query = req.query.id;
		console.log("queryyy",query)
		if( query.indexOf("%20") >= 0 || query.indexOf(' ') >= 0){
			// query is a name
			var name = query.replace(/%20/g, " ");
			console.log("replaced...")
			console.log(name)
			Actor.findOne({name : name}, function(err, actor){
				console.log(err, actor)
				if(err) throw err;
				if(actor){
					// actor already in db
					console.log('actor found in db')
					Movie.find({actorId : actor.imdbId}, function(err, collection){
						if(err) throw err;
						if(collection.length !== 0){
							//collection found
							res.send(actor.imdbId)
						} else {
							// collection not found
							res.status(400).end()
						}
					})
				} else {
					// actor not in db
					console.log('actor not in db')
						request("http://www.imdb.com/find?q="+query.replace(/ /g, "%20"), function(err, resp, body){
							console.log('in req callback line 126')
							if (!err && resp.statusCode == 200) {
								console.log('no error and 200')
								var $ = cheerio.load(body)
								var results = $("#main .article .findSection .findList .findResult.odd .result_text a")[0];
								if(results && results.attribs.href){
									var href = results.attribs.href;
									var name = results.children[0].data;

									var startIndex = href.indexOf('nm')
									for( var i = startIndex + 2; i < href.length; i++ ){
										if( href[i] === "/" ){
											var endIndex = i;
											var hrefParsed = href.substring(startIndex, endIndex)
											break
										}
									}
						    		var newActor = new Actor()
						    		newActor.name = name;
						    		newActor.imdbId = hrefParsed;
						    		request('http://www.imdb.com/name/'+newActor.imdbId, function (error, response, body) {
						    			if (!error && response.statusCode == 200) {
						    				// parse actors imdb page for a collection of movies
						    				var $ = cheerio.load(body);
						    				var children = $("#filmo-head-actor").next().children()
						    				console.log('children')
						    				console.log(children)
						    				if(children.length === 0){
						    					var children = $("#filmo-head-actress").next().children()
						    				}
						    				console.log('targeted all children', children.length)
						    				var data;
						    				var movieCollection = [];
						    				children.each(function(i, elem){
						    					data = {};
						    					data.imdbId = elem.children[1].next.next.children[0].attribs.href;
						    					data.title = elem.children[1].next.next.children[0].children[0].data;
						    					data.actorId = newActor.imdbId;
						    					var startIndex = data.imdbId.indexOf('tt')
						    					for( var i = startIndex + 2; i < data.imdbId.length; i++ ){
						    						if( data.imdbId[i] === "/" ){
						    							var endIndex = i;
						    							var hrefParsed = data.imdbId.substring(startIndex, endIndex)
						    							break
						    						}
						    					}
						    					data.imdbId = hrefParsed;
						    					movieCollection.push(data)
						    				})
						    				// movieCollection is our array
						    				console.log("about to insert collection")
						    				insertCollection(movieCollection, newActor.imdbId, function(){
						    					res.send(newActor.imdbId);
						    				})
						    		    }
						    		})
						    		// newActor.save(function(err, updated){
						    		// 	console.log('saving actor', newActor)
				    				// 	request('http://www.imdb.com/name/'+newActor.imdbId, function (error, response, body) {
				    				// 		if (!error && response.statusCode == 200) {
				    				// 			// parse actors imdb page for a collection of movies
				    				// 			var $ = cheerio.load(body);
				    				// 			var children = $(".filmo-category-section .filmo-row b a");
				    				// 			var data;
				    				// 			var movieCollection = [];
				    				// 			children.each(function(i, elem){
				    				// 				data = {};
				    				// 				data.imdbId = elem.attribs.href;
				    				// 				data.title = elem.children[0].data;
				    				// 				data.actorId = newActor.imdbId;
				    				// 				var startIndex = data.imdbId.indexOf('tt')
				    				// 				for( var i = startIndex + 2; i < data.imdbId.length; i++ ){
				    				// 					if( href[i] === "/" ){
				    				// 						var endIndex = i;
				    				// 						var hrefParsed = data.imdbId.substring(startIndex, endIndex)
				    				// 						break
				    				// 					}
				    				// 				}
				    				// 				data.imdbId = hrefParsed
				    				// 				movieCollection.push(data)
				    				// 			})
				    				// 			// movieCollection is our array
				    				// 			console.log("about to insert collection")
				    				// 			insertCollection(movieCollection, newActor.actorId, function(){
				    				// 				res.send(newActor.imdbId);
				    				// 			})
				    				// 	    }
				    				// 	})
						    		// })
								} else {
									res.status(400).end("no actor by this name")
								}
						    }
						})
					// get id from name
					// save actor
					// scrape movies by id
					// post collection to db
					// return collection
				}
			})
		} else {
			// query is an imdb id
			Actor.findOne({imdbId : query}, function(err, actor){
				if(err) throw err;
				if(actor){
					console.log('actor found',actor)
					// actor already in db
					Movie.find({actorId : actor.imdbId}, function(err,coll){
						if(err) throw err;
						if(coll){
							res.send(coll)
						} else {
							res.status(400).end()
						}
					})
				} else {
					// actor not in db
					console.log('actor not found with this id in DB');
					request('http://www.imdb.com/name/'+query, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							// parse actors imdb page for a collection of movies
							var $ = cheerio.load(body);
							var target = $("#overview-top h1 span");
							console.log(target.html());
							var actorName = target.html();
							var newActor = new Actor({
								imdbId : query,
								name : actorName
							});
							newActor.save(function(err, saved){
								if(err) throw err;
								console.log('saved',saved);
								request('http://www.imdb.com/name/'+newActor.imdbId, function (error, response, body) {
									if (!error && response.statusCode == 200) {
										// parse actors imdb page for a collection of movies
										var $ = cheerio.load(body);
										var children = $("#filmo-head-actor").next().children()
										if(children.length === 0){
											var children = $("#filmo-head-actress").next().children()
										}
										console.log('targeted all children', children.length)
										var data;
										var movieCollection = [];
										children.each(function(i, elem){
											data = {};
											data.imdbId = elem.children[1].next.next.children[0].attribs.href;
											data.title = elem.children[1].next.next.children[0].children[0].data;
											data.actorId = newActor.imdbId;
											var startIndex = data.imdbId.indexOf('tt')
											for( var i = startIndex + 2; i < data.imdbId.length; i++ ){
												if( data.imdbId[i] === "/" ){
													var endIndex = i;
													var hrefParsed = data.imdbId.substring(startIndex, endIndex)
													break
												}
											}
											data.imdbId = hrefParsed;
											movieCollection.push(data)
										})
										// movieCollection is our array
										console.log("about to insert collection")
										insertCollection(movieCollection, newActor.imdbId, function(){
											res.send(newActor.imdbId);
										})
								    }
								})
								// request('http://www.imdb.com/name/'+query, function (error, response, body) {
								// 	if (!error && response.statusCode == 200) {
								// 		// parse actors imdb page for a collection of movies
								// 		var $ = cheerio.load(body);
								// 		var children = $(".filmo-category-section .filmo-row b a");
								// 		console.log('targeted all children', children.length)
								// 		var data;
								// 		var movieCollection = [];
								// 		children.each(function(i, elem){
								// 			data = {};
								// 			data.imdbId = elem.attribs.href;
								// 			data.title = elem.children[0].data;
								// 			data.actorId = query;
								// 			var startIndex = data.imdbId.indexOf('tt')
								// 			for( var i = startIndex + 2; i < data.imdbId.length; i++ ){
								// 				if( data.imdbId[i] === "/" ){
								// 					var endIndex = i;
								// 					var hrefParsed = data.imdbId.substring(startIndex, endIndex)
								// 					break
								// 				}
								// 			}
								// 			data.imdbId = hrefParsed
								// 			movieCollection.push(data)
								// 		})
								// 		// movieCollection is our array
								// 		console.log("about to insert collection")
								// 		insertCollection(movieCollection, newActor.actorId, function(){
								// 			res.send(query);
								// 		})
								//     }
								// })
							})
					    }
					})					
					// get name from id
					// save actor
					// scrape movies by id
					// store movies in db
					// return coll
				}
			})
		}
	})
	app.get('/test', function(req,res){
		request('http://www.imdb.com/name/nm0000115', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// parse actors imdb page for a collection of movies
				var $ = cheerio.load(body);
				var children = $("#filmo-head-actor").next().children()
				if(children.length === 0){
					var children = $("#filmo-head-actress").next().children()
				}
				console.log('targeted all children', children.length)
				var data;
				var movieCollection = [];
				children.each(function(i, elem){
					data = {};
					data.imdbId = elem.children[1].next.next.children[0].attribs.href;
					data.title = elem.children[1].next.next.children[0].children[0].data;
					data.actorId = actorId;
					var startIndex = data.imdbId.indexOf('tt')
					for( var i = startIndex + 2; i < data.imdbId.length; i++ ){
						if( data.imdbId[i] === "/" ){
							var endIndex = i;
							var hrefParsed = data.imdbId.substring(startIndex, endIndex)
							break
						}
					}
					data.imdbId = hrefParsed
					movieCollection.push(data)
				})
				// movieCollection is our array
				console.log("about to insert collection")
				insertCollection(movieCollection, "nm0000115", function(){
					res.send(actorId);
				})
		    }
		})
	})
	function insertCollection(collection, actorId, callback) {
	  var inserted = 0;
	  console.log('in insertCollection',collection.length)
	  for(var i = 0; i < collection.length; i++) {
	  	var movie = new Movie(collection[i]);
	  	movie.actorId = actorId;
	    movie.save(function(err) {
	      if (err) {
	        throw err;
	        return;
	      }
	      if (++inserted === collection.length) {
	        callback();
	      }
	    });
	  }
	}
	// app.post('/postCollection', function(req,res){
	// 	// make and save actor
	// 	// req should have actorId and a parsed collection of movie objects
	// 	var actor = new Actor();
	// 	actor.imdbId = req.body.actorId;
	// 	actor.save(function(err,log){
	// 		// create new movie objects for each in array
	// 		console.log("about to insert collection")
	// 		insertCollection(req.body.collection, req.body.actorId, function(){
	// 			res.status(200).end();
	// 		})
	// 	})
	// });
	app.post('/scoreMatchup', function(req,res){
		// calculate score change
		// find mongoose model for winner and loser
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
	})
}
function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
