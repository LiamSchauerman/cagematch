var Matchup = Backbone.Collection.extend({
	model: Movie,
	initialize: function(){
		console.log("should be two",this.models)
		this.set('winner', undefined)
		this.on('win', this.win, this);
		this.on('change', this.newContent, this)
	},
	win: function(winner){
		console.log("matchup winner, from matchup colelction", winner)
		console.log(this.get("winner"))
	},
	newContent: function(){
		console.log("in new content event callback")
	}
})