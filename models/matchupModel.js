var mongoose = require("mongoose");

var matchupSchema = new mongoose.Schema({
	actorId : String,
	winnerScorePre : Number,
	winnerScorePost : Number,
	loserScorePre : Number,
	loserScorePost : Number,
	winner : String,
	loser: String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('Matchup', matchupSchema);