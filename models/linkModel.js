var mongoose = require("mongoose");

var matchupSchema = new mongoose.Schema({
	titleA : String,
	titleB : String,
	aScorePre : Number,
	aScorePost : Number,
	bScorePre : Number,
	bScorePost : Number,
	winner : String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('Matchup', matchupSchema);