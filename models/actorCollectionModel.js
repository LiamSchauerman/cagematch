var mongoose = require("mongoose");

var actorCollectionSchema = new mongoose.Schema({
	imdbId : String,
	movies: Array,
	actor: String,
	timestamp: { type : Date, default: Date.now },
});

module.exports = mongoose.model('ActorCollection', actorCollectionSchema);