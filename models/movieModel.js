var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	actorId: String,
	title : String,
	score : {type : Number, default: 1200},
	year : String,
	imdbId : String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('Movie', movieSchema);