var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	title : String,
	score : {type : String, default: 1200},
	year : String,
	imdbId : String,
	timestamp: { type : Date, default: Date.now },
});
var actorCollectionSchema = new mongoose.Schema({
	imdbId : String,
	movies: [movieSchema],
	actor: String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('ActorCollection', actorCollectionSchema);