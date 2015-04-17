var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	title : String,
	score : Number,
	year : Number,
	imdbId : String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('Movie', movieSchema);