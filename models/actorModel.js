var mongoose = require("mongoose");

var actorSchema = new mongoose.Schema({
	name: String,
	imdbId : String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('Actor', actorSchema);